from typing import List, Optional, Dict
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

from .models import Base, City, Area, FoodItem
from .recommender.base import RecommendationItem
from .recommender.baseline import BaselineRecommender
from .recommender.multi_objective import MultiObjectiveRecommender
from .seed import seed_locations

app = FastAPI(title="TerraBite API")

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
    db: Session = Depends(get_db)
):
    recommender = MultiObjectiveRecommender()
    return await recommender.recommend(query, city, area, mode=mode)

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
