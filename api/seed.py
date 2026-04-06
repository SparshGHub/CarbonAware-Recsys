from sqlalchemy.orm import Session
from .models import City, Area
from .recommender.locations import CITY_DATA

def seed_locations(db: Session):
    for city_name, areas in CITY_DATA.items():
        city = db.query(City).filter(City.name == city_name).first()
        if not city:
            city = City(name=city_name)
            db.add(city)
            db.commit()
            db.refresh(city)
        
        for area_name, lat, long in areas:
            area = db.query(Area).filter(Area.name == area_name, Area.city_id == city.id).first()
            if not area:
                new_area = Area(name=area_name, city_id=city.id, lat=lat, long=long)
                db.add(new_area)
    db.commit()
