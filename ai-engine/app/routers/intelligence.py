from fastapi import APIRouter
from pydantic import BaseModel
from app.services.rag_service import rag_service

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str

class IngestRequest(BaseModel):
    texts: list[str]

@router.post("/ask")
def ask_question(request: QuestionRequest):
    answer = rag_service.ask(request.question)
    return {"answer": answer}

@router.post("/ingest")
def ingest_knowledge(request: IngestRequest):
    status = rag_service.ingest_text(request.texts)
    return {"status": status}

class GenRequest(BaseModel):
    topic: str

@router.post("/generate-map")
def generate_map(request: GenRequest):
    import json
    import re
    raw = rag_service.generate_map_content(request.topic)
    try:
        # Robust cleaning
        clean_json = raw
        if "```" in clean_json:
            clean_json = re.search(r'```(?:json)?\s*({.*})\s*```', raw, re.DOTALL).group(1)
        elif "{" not in clean_json:
             return {"error": "No JSON found", "raw": raw}
        
        return json.loads(clean_json)
    except Exception as e:
        print(f"JSON Parse Error: {e} | Raw: {raw}")
        return {"error": "Parse Error", "details": str(e), "raw": raw}

@router.get("/interpret")
def interpret(q: str):
    import json
    raw = rag_service.interpret_search(q)
    try:
        if "```json" in raw:
            raw = raw.split("```json")[1].split("```")[0]
        return json.loads(raw)
    except:
        return {"raw": raw}
