# backend.py - Fridge Scanner Service using Roboflow API

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import base64
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Roboflow API configuration
ROBOFLOW_API_KEY = os.getenv('ROBOFLOW_API_KEY', 'AXFJDDgVQDodKuiR5xxW')
ROBOFLOW_MODEL_ID = os.getenv('ROBOFLOW_MODEL_ID', 'vegetable-b6cbp-zbx7v')
ROBOFLOW_VERSION = os.getenv('ROBOFLOW_VERSION', '1')

# Configuration for file uploads
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}

def encode_image_to_base64(image_path):
    """Encode image to base64 string"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def predict_with_roboflow(image_path):
    """Make prediction using Roboflow API"""
    try:
        # Encode image to base64
        image_base64 = encode_image_to_base64(image_path)
        
        # Prepare the request
        url = f"https://detect.roboflow.com/{ROBOFLOW_MODEL_ID}/{ROBOFLOW_VERSION}"
        params = {
            "api_key": ROBOFLOW_API_KEY,
            "confidence": 0.5,
            "overlap": 0.5
        }
        
        # Make the request
        response = requests.post(
            url,
            params=params,
            data=image_base64,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Roboflow API error: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"Error calling Roboflow API: {e}")
        return None

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'fridge-scanner-service',
        'version': '1.0.0'
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    """Predict food items in uploaded image"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
            
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Please upload an image file.'}), 400
            
        # Save the file temporarily
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Get predictions from Roboflow
            result = predict_with_roboflow(filepath)
            
            if result is None:
                return jsonify({'error': 'Failed to get predictions from Roboflow API'}), 500
            
            # Process the response
            predictions = result.get('predictions', [])
            
            # Sort by confidence
            predictions.sort(key=lambda x: x.get('confidence', 0), reverse=True)
            
            # Format response
            formatted_predictions = []
            for pred in predictions:
                formatted_predictions.append({
                    'class': pred.get('class', 'Unknown'),
                    'confidence': round(pred.get('confidence', 0) * 100, 2),  # Convert to percentage
                    'bbox': {
                        'x': pred.get('x', 0),
                        'y': pred.get('y', 0),
                        'width': pred.get('width', 0),
                        'height': pred.get('height', 0)
                    }
                })
            
            # Get top prediction
            top_prediction = formatted_predictions[0] if formatted_predictions else None
            
            return jsonify({
                'success': True,
                'predictions': formatted_predictions,
                'top_prediction': top_prediction,
                'total_detections': len(formatted_predictions)
            })
            
        finally:
            # Clean up the saved file
            if os.path.exists(filepath):
                os.remove(filepath)
                
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/api/scan-fridge', methods=['POST'])
def scan_fridge():
    """Alternative endpoint for fridge scanning"""
    return predict()

@app.errorhandler(413)
def too_large(e):
    return jsonify({'error': 'File too large. Please upload an image smaller than 16MB.'}), 413

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("Starting Fridge Scanner Service...")
    print(f"Using Roboflow Model: {ROBOFLOW_MODEL_ID}/{ROBOFLOW_VERSION}")
    print("Service ready for image predictions!")
    app.run(debug=True, host='0.0.0.0', port=4005)
