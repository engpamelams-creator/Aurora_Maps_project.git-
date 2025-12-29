try:
    from langchain_openai import OpenAIEmbeddings
    from langchain_community.vectorstores import FAISS
    from langchain.chains import RetrievalQA
    from langchain_openai import ChatOpenAI
    _HAS_RAG = True
except ImportError as e:
    print(f"⚠️ RAG Dependencies missing: {e}")
    _HAS_RAG = False
import os

class RAGService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not _HAS_RAG:
            print("⚠️ RAG Service disabled (Missing Libs).")
            return
            
        if not self.api_key:
            print("⚠️ OpenAI Key missing. RAG Service disabled.")
            self.qa_chain = None
            return

        print("🧠 RAGService: Loading Vector Store...")
        self.llm = None
        try:
            self.embeddings = OpenAIEmbeddings(openai_api_key=self.api_key)
            self.vector_store = None 
            self.llm = ChatOpenAI(temperature=0.7, openai_api_key=self.api_key, model_name="gpt-3.5-turbo")
        except Exception as e:
            print(f"⚠️ RAG Init Error: {e}")

    def ingest_text(self, text_chunks: list[str]):
        if not _HAS_RAG: return "RAG Disabled"
        if not self.llm: return "LLM Not Initialized"
        """Embeds text and adds to FAISS index"""
        if not self.api_key: return "No API Key"
        
        if self.vector_store is None:
             self.vector_store = FAISS.from_texts(text_chunks, self.embeddings)
        else:
             self.vector_store.add_texts(text_chunks)
        
        return "Ingested"

    def ask(self, question: str):
        if not self.vector_store:
            return "Knowledge base is empty. Please ingest data first."
        
        # Create Chain
        qa = RetrievalQA.from_chain_type(llm=self.llm, chain_type="stuff", retriever=self.vector_store.as_retriever())
        return qa.run(question)

    
    def interpret_search(self, query: str):
        if not self.api_key: return {"error": "No API Key"}
        
        try:
            prompt = f"""
            Act as a Search Intent Interpreter for a Map App.
            User Query: "{query}"
            
            Translate this into structured data for OpenStreetMap/Geoapify search.
            Return a JSON Object with:
            - intent: (string) e.g. "search_nearby", "explore", "navigate"
            - category: (string) e.g. "restaurant", "park", "hospital" or "unknown"
            - keywords: (list) English keywords for the query
            - sentiment: (string) "budget", "luxury", "romantic", "family", etc.
            
            JSON ONLY. No markdown.
            """
            response = self.llm.invoke(prompt)
            return response.content
        except Exception as e:
            return {"error": str(e)}

    def generate_map_content(self, topic: str):
        if not self.api_key: return {"error": "No API Key"}
        
        # Use direct OpenAI client if available (more robust than LangChain)
        try:
            from openai import OpenAI
            client = OpenAI(api_key=self.api_key)
            
            prompt = f"""
            Act as a Local Guide Expert.
            Generate a Curated Map for the topic: "{topic}".
            Focus on Sao Paulo, Brazil (or huge global cities if generic).
            
            Return a JSON Object:
            {{
                "title": "Creative Title, short",
                "description": "Engaging description...",
                "points": [
                    {{
                        "title": "Place Name",
                        "description": "Why it fits...",
                        "latitude": -23.5505,
                        "longitude": -46.6333,
                        "category": "restaurant" 
                    }}
                ]
            }}
            JSON ONLY.
            """
            
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7
            )
            return response.choices[0].message.content
            
        except Exception as e:
            # Fallback to Mock Data if Quota Exceeded (429) or other error
            if "quota" in str(e).lower() or "429" in str(e):
                print("⚠️ OpenAI Quota Exceeded. Generating Mock Map.")
                import json
                mock_map = {
                    "title": f"Mapa de {topic} (Demo)",
                    "description": f"Uma seleção incrível sobre {topic} (Gerado em modo de demonstração).",
                    "points": [
                        {
                            "title": "Ponto de Interesse 1",
                            "description": "Um lugar fantástico para visitar.",
                            "latitude": -23.5505, 
                            "longitude": -46.6333,
                            "category": "restaurant"
                        },
                        {
                            "title": "Lugar Especial",
                            "description": "Muito recomendado pelos locais.",
                            "latitude": -23.5615, 
                            "longitude": -46.6559,
                            "category": "park"
                        },
                        {
                            "title": "Experiência Única",
                            "description": "Vale a pena conferir.",
                            "latitude": -23.5905, 
                            "longitude": -46.6733,
                            "category": "museum"
                        }
                    ]
                }
                return json.dumps(mock_map)
            
            return {"error": str(e)}

# Global
rag_service = RAGService()
