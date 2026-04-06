from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.orm import declarative_base, relationship
from pgvector.sqlalchemy import Vector

Base = declarative_base()

class City(Base):
    __tablename__ = "cities"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, nullable=False)
    areas = relationship("Area", back_populates="city")

class Area(Base):
    __tablename__ = "areas"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    city_id = Column(Integer, ForeignKey("cities.id"))
    lat = Column(Float)
    long = Column(Float)
    distance_weight = Column(Float, default=1.0)
    city = relationship("City", back_populates="areas")
    restaurants = relationship("Restaurant", back_populates="area")

class Restaurant(Base):
    __tablename__ = "restaurants"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    area_id = Column(Integer, ForeignKey("areas.id"))
    lat = Column(Float)
    long = Column(Float)
    area = relationship("Area", back_populates="restaurants")
    items = relationship("FoodItem", back_populates="restaurant")

class FoodItem(Base):
    __tablename__ = "food_items"
    id = Column(Integer, primary_key=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"))
    name = Column(String(255), nullable=False)
    description = Column(Text)
    carbon_score = Column(Float)
    price = Column(Float)
    category = Column(String(100))
    embedding = Column(Vector(384))
    restaurant = relationship("Restaurant", back_populates="items")
