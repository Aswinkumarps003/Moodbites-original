import io
import base64
import re
import pytesseract
from PIL import Image, ImageEnhance
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- Configuration ---
# Ensure Tesseract is in your system's PATH or set the command explicitly.
# For Windows:
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
# For macOS (Homebrew):
# pytesseract.pytesseract.tesseract_cmd = r'/usr/local/bin/tesseract'
# For Linux (apt-get):
# It's usually in the path, so this line might not be needed.

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

def _preprocess_image(img: Image.Image) -> Image.Image:
    """Basic preprocessing to improve OCR results."""
    img = img.convert('L')
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(2.0)
    return img

def _extract_text_from_image(img: Image.Image) -> str:
    """Runs OCR on a preprocessed PIL Image object."""
    processed_img = _preprocess_image(img)
    # Use config options to improve accuracy, e.g., PSM 6 assumes a single uniform block of text.
    custom_config = r'--oem 3 --psm 6'
    return pytesseract.image_to_string(processed_img, config=custom_config)

def validate_blood_report(extracted_text: str) -> dict:
    """
    Validates if the extracted text content is likely a blood report.
    Returns a dictionary with a boolean flag and confidence details.
    """
    text_lower = extracted_text.lower()
    
    if not text_lower.strip():
        return {
            "isLikelyReport": False,
            "reason": "No text could be extracted from the image.",
            "totalConfidence": 0,
            "foundKeywords": [],
        }

    medical_keywords = [
        'hemoglobin', 'platelet', 'glucose', 'cholesterol', 'rbc', 'wbc',
        'liver function', 'renal function', 'thyroid', 'cbc',
        'lipid', 'serum', 'plasma', 'bilirubin', 'creatinine', 'urea', 
        'sgot', 'sgpt', 'mg/dl', 'g/dl', 'k/ul', 'm/ul', 'complete blood count'
    ]
    found_keywords = {keyword for keyword in medical_keywords if keyword in text_lower}
    
    # Give a higher score for finding more unique keywords
    keyword_score = min((len(found_keywords) / 5) * 100, 100) # 100% score if 5 or more keywords are found

    lab_keywords = ['lab', 'laboratory', 'diagnostics', 'pathology', 'medical center', 'hospital', 'clinic']
    has_lab_name = any(keyword in text_lower for keyword in lab_keywords)
    lab_score = 100 if has_lab_name else 0

    # Total confidence as a weighted average
    total_confidence = (keyword_score * 0.7) + (lab_score * 0.3)
    
    # A report is likely if confidence is above a threshold (e.g., 30%)
    is_likely_report = total_confidence > 30

    reason = "Document appears to be a valid report." if is_likely_report else "The document does not contain enough keywords or patterns to be identified as a blood report."

    return {
        "isLikelyReport": is_likely_report,
        "reason": reason,
        "totalConfidence": round(total_confidence, 2),
        "foundKeywords": list(found_keywords),
    }

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "Python OCR service is running."})

@app.route('/extract-text', methods=['POST'])
def extract_text_endpoint():
    try:
        data = request.get_json()
        if not data or 'image_data' not in data:
            return jsonify({"success": False, "reason": "Missing 'image_data' in request body."}), 400

        image_data = data['image_data']
        
        # Decode the base64 data URI
        # Format: "data:image/jpeg;base64,..."
        if not image_data.startswith('data:image'):
            return jsonify({"success": False, "reason": "Invalid image data format. Expected a data URI."}), 400

        header, encoded_data = image_data.split(',', 1)
        file_bytes = base64.b64decode(encoded_data)
        
        img = Image.open(io.BytesIO(file_bytes))
        extracted_text = _extract_text_from_image(img)
        
        validation_result = validate_blood_report(extracted_text)
        
        # --- THIS IS THE CRITICAL FIX ---
        # The response now includes the 'validation' object that Node.js expects.
        return jsonify({
            "success": validation_result["isLikelyReport"],
            "text": extracted_text,
            "validation": validation_result
        })

    except Exception as e:
        app.logger.error(f"Error processing request: {e}")
        return jsonify({"success": False, "reason": f"An unexpected error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    print("🚀 Starting Python OCR Flask server on http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)
