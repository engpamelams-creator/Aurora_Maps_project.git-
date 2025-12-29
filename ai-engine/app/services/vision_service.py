from openai import OpenAI
import os

class VisionService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if self.api_key:
            print("🧠 VisionService: Connected to Cloud Vision API.")
            self.client = OpenAI(api_key=self.api_key)
        else:
            print("⚠️ Cloud Vision disabled (No Key). Using Mock Mode.")
            self.client = None

    def analyze_image(self, image_url: str):
        if not self.client:
            # Mock Fallback if no API key
            return {
                "tags": ["feature_disabled_no_key"],
                "note": "Add OPENAI_API_KEY to .env to enable Cloud Vision."
            }
            
        try:
            # Cloud-Native Computer Vision (GPT-4o or Vision Preview)
            # This is lighter and smarter than local caching
            response = self.client.chat.completions.create(
                model="gpt-4-turbo",
                messages=[
                    {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Analyze this image and return 3 simple tags describing the place (e.g., 'Coffee Shop', 'Park', 'Beach'). Return ONLY the tags coma separated."},
                        {
                        "type": "image_url",
                        "image_url": {
                            "url": image_url,
                        },
                        },
                    ],
                    }
                ],
                max_tokens=300,
            )
            
            tags_raw = response.choices[0].message.content
            tags = [t.strip() for t in tags_raw.split(',')]
            return {"tags": tags, "provider": "openai_cloud"}

        except Exception as e:
            print(f"❌ Error cloud analysis: {e}")
            return {"error": str(e)}

# Global instance
vision_service = VisionService()
