from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class RecommendationItem(BaseModel):
    id: int
    name: str
    restaurant_name: str
    carbon_score: float  # Item carbon footprint
    delivery_carbon: float  # Dynamic delivery carbon based on distance
    total_carbon: float
    price: float
    distance: float
    relevance_score: float
    total_score: float

class BaseRecommender(ABC):
    @abstractmethod
    async def recommend(
        self, 
        query: str, 
        city: str, 
        area: str, 
        limit: int = 5,
        mode: str = "lifecycle_aware",
        context: Optional[Dict[str, Any]] = None
    ) -> List[RecommendationItem]:
        """
        Produce a ranked list of recommendations.
        """
        pass
