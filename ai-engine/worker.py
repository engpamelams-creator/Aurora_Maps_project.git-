import os
import json
import redis
import time
import random
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load Env
load_dotenv()

# Config
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = os.getenv("REDIS_PORT", "6379")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_DATABASE", "aurora_maps")
DB_USER = os.getenv("DB_USERNAME", "aurora")
DB_PASS = os.getenv("DB_PASSWORD", "password")

# Connections
try:
    r = redis.Redis(host=REDIS_HOST, port=int(REDIS_PORT), db=0)
    connection_string = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    db_engine = create_engine(connection_string)
    print("✅ AI Worker Connected to Redis & Postgres")
except Exception as e:
    print(f"❌ Connection Error: {e}")
    exit(1)

def process_image(capsule_id, image_path):
    """
    Simulates Computer Vision analysis.
    In real life: Load TensorFlow/PyTorch model here.
    """
    print(f"👁️ analyzing image for Capsule #{capsule_id}...")
    time.sleep(2) # Simulate processing time

    # Mock Tags
    possible_tags = ["Nature", "Urban", "Sunset", "Architecture", "Food", "People", "Art"]
    detected_tags = random.sample(possible_tags, k=random.randint(1, 3))
    
    tags_json = json.dumps(detected_tags)
    print(f"🏷️ Detected Tags: {tags_json}")

    # Update DB (Assuming we have a 'tags' column or just logging for now)
    # For this MVP, we will append it to the 'message' or create a specific log
    try:
        with db_engine.connect() as conn:
            # We'll append tags to the message for visibility in this demo
            query = text("UPDATE capsules SET message = message || ' [AI Tags: ' || :tags || ']' WHERE id = :id")
            conn.execute(query, {"tags": tags_json, "id": capsule_id})
            conn.commit()
        print("💾 Database Updated.")
    except Exception as e:
        print(f"❌ DB Write Error: {e}")

def main():
    print("🚀 Aurora AI Worker Started. Listening for 'ai_processing_queue'...")
    while True:
        # Blocking Pop from List (Queue)
        # item is a tuple (queue_name, data)
        item = r.blpop("ai_processing_queue", timeout=0)
        
        if item:
            queue, data = item
            payload = json.loads(data)
            print(f"📥 Job Received: {payload}")
            
            process_image(payload.get('capsule_id'), payload.get('image_path'))
            print("--- Ready for next job ---")

if __name__ == "__main__":
    main()
