from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from app.services.recommender_service import recommender_service

router = APIRouter()

class RecommendationRequest(BaseModel):
    user_id: int
    visited_place_ids: List[int]

@router.post("/")
def get_recommendations(request: RecommendationRequest):
    ids = recommender_service.recommend(request.visited_place_ids)
    return {"recommended_place_ids": ids}
