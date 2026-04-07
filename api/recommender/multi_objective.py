from typing import List, Dict, Any, Optional
from .base import BaseRecommender, RecommendationItem
from .retriever import get_fallback_recommendations
from .locations import CITY_DATA, calculate_distance

class MultiObjectiveRecommender(BaseRecommender):
    """
    Versatile Recommender with three scoring profiles:
    - Commercial: Relevance only (ignores carbon).
    - Ingredient-Aware: Relevance + Ingredient Carbon.
    - Lifecycle-Aware: Relevance + Total Carbon (Ingredients + Delivery).
    """
    async def recommend(
        self, 
        query: str, 
        city: str, 
        area: str, 
        limit: int = 5,
        mode: str = "lifecycle_aware",
        context: Optional[Dict[str, Any]] = None
    ) -> List[RecommendationItem]:
        context = context or {}

        # Lambda controls carbon-vs-relevance trade-off.
        lambda_value = context.get("lambda", 0.6)
        try:
            lambda_value = float(lambda_value)
        except (TypeError, ValueError):
            lambda_value = 0.6
        lambda_value = max(0.0, min(1.0, lambda_value))

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
            
            relevance = item.get("relevance_score", 0.9)
            
            # Determine scoring logic based on mode
            if mode == "commercial":
                total_score = relevance
            elif mode == "ingredient_aware":
                carbon_utility = 1.0 / (item_carbon + 1.0)
                total_score = (relevance * (1.0 - lambda_value)) + (carbon_utility * lambda_value)
            else: # lifecycle_aware
                carbon_utility = 1.0 / (total_carbon + 1.0)
                total_score = (relevance * (1.0 - lambda_value)) + (carbon_utility * lambda_value)
            
            results.append(RecommendationItem(
                id=item["id"],
                name=item["name"],
                restaurant_name=item["restaurant_name"],
                carbon_score=item_carbon,
                delivery_carbon=delivery_carbon,
                total_carbon=total_carbon,
                price=item["price"],
                distance=distance,
                relevance_score=relevance,
                total_score=total_score
            ))
            
        return sorted(results, key=lambda x: x.total_score, reverse=True)[:limit]
