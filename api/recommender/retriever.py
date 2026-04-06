from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer
import numpy as np

# Load model once on import
model = SentenceTransformer('all-MiniLM-L6-v2')

MOCK_FOOD_ITEMS = [
    {"id": 1, "name": "Lentil & Spinach Dal", "restaurant_name": "Ved Garden", "carbon_score": 0.45, "price": 12.50, "category": "Vegan", "area": "Hauz Khas"},
    {"id": 2, "name": "Classic Beef Steak", "restaurant_name": "The Grill", "carbon_score": 14.5, "price": 45.00, "category": "Meat", "area": "Connaught Place"},
    {"id": 3, "name": "Quinoa Salad Bowl", "restaurant_name": "Fresh Co", "carbon_score": 0.65, "price": 18.00, "category": "Salads", "area": "Dwarka"},
    {"id": 4, "name": "Butter Chicken", "restaurant_name": "Punjabi Tadka", "carbon_score": 4.2, "price": 22.00, "category": "Indian", "area": "South Ex"},
    {"id": 5, "name": "Tofu Stir Fry", "restaurant_name": "Asian Fusion", "carbon_score": 0.95, "price": 15.50, "category": "Asian", "area": "Bandra"},
    {"id": 6, "name": "Lamb Rogan Josh", "restaurant_name": "Royal India", "carbon_score": 9.8, "price": 28.00, "category": "Meat", "area": "Indiranagar"},
    {"id": 7, "name": "Margarita Pizza", "restaurant_name": "Pizza Roma", "carbon_score": 2.1, "price": 14.00, "category": "Italian", "area": "MG Road"},
]

def get_fallback_recommendations(query: str) -> List[Dict[str, Any]]:
    """Simple keyword matching fallback if DB is empty."""
    query_lower = query.lower()
    if not query_lower:
        return MOCK_FOOD_ITEMS[:5]
    
    scored = []
    for item in MOCK_FOOD_ITEMS:
        score = 0
        if query_lower in item['name'].lower(): score += 1.0
        if query_lower in item['category'].lower(): score += 0.5
        item['relevance_score'] = score
        scored.append(item)
    
    return sorted(scored, key=lambda x: x['relevance_score'], reverse=True)[:5]
