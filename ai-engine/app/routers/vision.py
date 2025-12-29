from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.vision_service import vision_service

router = APIRouter()

class ImageRequest(BaseModel):
    url: str

@router.post("/analyze")
def analyze_image(request: ImageRequest):
    result = vision_service.analyze_image(request.url)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result
