FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage cache
COPY requirements.txt .

# 1. Update pip
RUN pip install --upgrade pip

# 2. Install Scientific & RAG Stack (Lightweight)
# We removed PyTorch/Transformers to rely on Cloud APIs (OpenAI) for Vision
RUN pip install --no-cache-dir numpy pandas scikit-learn langchain langchain-community langchain-openai faiss-cpu tiktoken openai pillow fastapi "uvicorn[standard]" python-multipart requests --timeout 100

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
