from typing import List
from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

from .models import Base, City
from .recommender.base import RecommendationItem
from .recommender.multi_objective import MultiObjectiveRecommender
from .seed import seed_locations

app = FastAPI(title="TerraBite API")

allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@db/terrabite")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Startup event to seed if needed
@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_locations(db)
    db.close()

@app.get("/locations")
def get_locations(db: Session = Depends(get_db)):
    cities = db.query(City).all()
    result = {}
    for city in cities:
        result[city.name] = [a.name for a in city.areas]
    return result

@app.get("/recommend", response_model=List[RecommendationItem])
async def recommend(
    query: str,
    city: str,
    area: str,
    mode: str = "lifecycle_aware",
    limit: int = 5,
    lambda_value: float = Query(0.6, alias="lambda", ge=0.0, le=1.0),
    db: Session = Depends(get_db)
):
    recommender = MultiObjectiveRecommender()
    return await recommender.recommend(
        query,
        city,
        area,
        limit=limit,
        mode=mode,
        context={"lambda": lambda_value},
    )

@app.get("/recommend/compare")
async def compare(
    query: str,
    city: str,
    area: str,
    db: Session = Depends(get_db)
):
    recommender = MultiObjectiveRecommender()
    
    # Fetch top result for all 3 models
    c_res = await recommender.recommend(query, city, area, mode="commercial", limit=1)
    i_res = await recommender.recommend(query, city, area, mode="ingredient_aware", limit=1)
    l_res = await recommender.recommend(query, city, area, mode="lifecycle_aware", limit=1)
    
    return {
        "commercial": c_res[0] if c_res else None,
        "ingredient_aware": i_res[0] if i_res else None,
        "lifecycle_aware": l_res[0] if l_res else None
    }
