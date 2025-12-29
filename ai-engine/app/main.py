from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import vision, recommendations, intelligence

app = FastAPI(title="Aurora AI Brain", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for dev, restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(vision.router, prefix="/vision", tags=["Computer Vision"])
app.include_router(recommendations.router, prefix="/recommend", tags=["Recommendations"])
app.include_router(intelligence.router, prefix="/rag", tags=["Intelligence (RAG)"])

@app.get("/")
def read_root():
    return {"status": "online", "service": "Aurora AI Engine"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
