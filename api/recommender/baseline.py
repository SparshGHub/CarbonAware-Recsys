from typing import List, Dict, Any, Optional
from .base import BaseRecommender, RecommendationItem
from .retriever import get_fallback_recommendations, MOCK_FOOD_ITEMS
from .locations import CITY_DATA, calculate_distance

class BaselineRecommender(BaseRecommender):
    """
    Standard Recommender focusing primarily on semantic relevance.
    """
    async def recommend(
        self, 
        query: str, 
        city: str, 
        area: str, 
        limit: int = 5,
        mode: str = "commercial",
        context: Optional[Dict[str, Any]] = None
    ) -> List[RecommendationItem]:
        # 1. Fetch raw items
        raw_items = get_fallback_recommendations(query)
        
        # 2. Get user coords
        user_areas = {a[0]: (a[1], a[2]) for a in CITY_DATA.get(city, [])}
        user_coords = user_areas.get(area, (28.6139, 77.2090))
        
        results = []
        for item in raw_items:
            rest_area_name = item.get("area", area)
            rest_coords = user_areas.get(rest_area_name, user_coords)
            distance = calculate_distance(user_coords, rest_coords)
            
            item_carbon = item["carbon_score"]
            delivery_carbon = distance * 0.15
            total_carbon = item_carbon + delivery_carbon
            
            results.append(RecommendationItem(
                id=item["id"],
                name=item["name"],
                restaurant_name=item["restaurant_name"],
                carbon_score=item_carbon,
                delivery_carbon=delivery_carbon,
                total_carbon=total_carbon,
                price=item["price"],
                distance=distance,
                relevance_score=item.get("relevance_score", 0.9),
                total_score=item.get("relevance_score", 0.9)
            ))
            
        return sorted(results, key=lambda x: x.total_score, reverse=True)[:limit]
