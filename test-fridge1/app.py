import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image
import numpy as np
import json # Import the json library for pretty printing

# Import ultralytics lazily so first install is easy
try:
    from ultralytics import YOLO
except Exception as e:
    YOLO = None

# --- FIX: Simplified Flask app setup ---
# Serves files from the same directory where the script is run.
app = Flask(__name__)
CORS(app)

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'best.pt')
model = None

# Using a function to load model on first request for compatibility
def load_model():
    global model
    if model is not None:
        return
    if YOLO is None:
        raise RuntimeError('ultralytics not installed. Run: pip install ultralytics flask flask-cors Pillow numpy')
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f'Model not found at {MODEL_PATH}. Make sure best.pt is in the same folder as this script.')
    print('🤖 Loading YOLO model...')
    model = YOLO(MODEL_PATH)
    print('✅ Model loaded')

@app.get('/health')
def health():
    return jsonify({ 'status': 'ok', 'model': os.path.basename(MODEL_PATH) })

@app.post('/api/predict')
def predict():
    # Lazy load the model on the first prediction request
    if model is None:
        try:
            load_model()
        except Exception as e:
            return jsonify({ 'error': f'Failed to load model: {str(e)}' }), 500

    if 'file' not in request.files:
        return jsonify({ 'error': 'No file provided' }), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({ 'error': 'Empty filename' }), 400

    try:
        # --- FIX: Manually load image data using Pillow for robustness ---
        image = Image.open(file.stream).convert("RGB")
        image_np = np.array(image)

        # Run prediction on the image data
        results = model(image_np, conf=0.1) # Set confidence threshold to 10%

        preds = []
        for r in results:
            names = r.names
            if r.boxes is not None:
                for b in r.boxes:
                    xyxy = b.xyxy[0].tolist()
                    conf = float(b.conf[0].item())
                    cls = int(b.cls[0].item())
                    class_name = names.get(cls, str(cls)) if isinstance(names, dict) else names[cls]
                    
                    preds.append({
                        'bbox': [round(v, 2) for v in xyxy],
                        'confidence': conf,  # Keep as decimal (0-1)
                        'classId': cls,
                        'className': class_name
                    })
        
        # Sort predictions by confidence (highest first)
        preds.sort(key=lambda x: x['confidence'], reverse=True)
        
        # Create the response format that FridgeScanner.jsx expects
        response_data = {
            'predictions': preds,
            'total_detections': len(preds),
            'top_prediction': preds[0] if preds else None
        }
        
        # --- NEW: Print the results to the console ---
        print("\n--- PREDICTION RESULTS ---")
        print(json.dumps(response_data, indent=2))
        print("--------------------------\n")
        
        return jsonify(response_data)
        
    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({'error': str(e)}), 500


# --- FIX: Serves index.html from the current directory ---
@app.get('/')
def index():
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    # Eager load model at startup; if it fails, endpoint will attempt lazy load
    try:
        load_model()
    except Exception as e:
        print(f'⚠️  Model preload failed: {e}. Will attempt lazy load on first request.')
    app.run(host='0.0.0.0', port=4010, debug=True)

