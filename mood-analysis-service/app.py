from fastapi import FastAPI, Body
from transformers import pipeline

# Create a FastAPI application
app = FastAPI()

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
