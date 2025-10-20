from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline

# Create a FastAPI application
app = FastAPI()
FRONTEND_URL = "https://moodbites-frontend.vercel.app"
# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", FRONTEND_URL],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the Hugging Face emotion detection model
classifier = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    return_all_scores=False
)

@app.post("/detect-mood")
async def detect_mood(text: str = Body(..., embed=True)):
    """
    Takes a piece of text and returns the detected mood and confidence score.
    """
    try:
        result = classifier(text)[0]  # e.g. {'label': 'joy', 'score': 0.98}
        return {
            "mood": result["label"],
            "confidence": round(result["score"], 4)
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
async def root():
    return {"message": "Mood Analysis Service is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Add server startup code for direct execution
if __name__ == "__main__":
    import uvicorn
    print("Starting Mood Analysis Service...")
    print("Service will be available at: http://localhost:8000")
    print("Press Ctrl+C to stop the service")
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="info"
    )
