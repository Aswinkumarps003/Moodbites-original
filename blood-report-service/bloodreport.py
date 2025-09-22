import io
import base64
import requests
import pytesseract
from PIL import Image, ImageEnhance
from flask import Flask, request, jsonify
from werkzeug.exceptions import BadRequest

# Conditionally import pdf2image for PDF support
try:
    from pdf2image import convert_from_bytes
    _PDF2IMAGE_AVAILABLE = True
except ImportError:
    _PDF2IMAGE_AVAILABLE = False

# --- Configuration ---
# Set the path to the Tesseract executable.
# For Windows, it might be: pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
# For macOS (with Homebrew): pytesseract.pytesseract.tesseract_cmd = r'/usr/local/bin/tesseract'
# If Tesseract is in your system's PATH, this line is not needed.
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Flask App Initialization
app = Flask(__name__)

def _preprocess_image(img: Image.Image) -> Image.Image:
    """Basic preprocessing to improve OCR results."""
    # Convert to grayscale
    img = img.convert('L')
    # Increase contrast
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.5)
    # Increase sharpness
    enhancer = ImageEnhance.Sharpness(img)
    img = enhancer.enhance(2.0)
    return img

def _extract_text_from_image(img: Image.Image) -> str:
    """Runs OCR on a preprocessed PIL Image object."""
    processed_img = _preprocess_image(img)
    return pytesseract.image_to_string(processed_img)

def validate_blood_report(extracted_text: str) -> dict:
    """
    Validates if the extracted text content is likely a blood report.
    Returns a confidence score and a boolean flag.
    """
    text_lower = extracted_text.lower()
    
    # 1. Keyword Analysis
    medical_keywords = [
        'hemoglobin', 'platelets', 'glucose', 'cholesterol', 'rbc', 'wbc',
        'liver function test', 'renal function test', 'thyroid', 'cbc',
        'lipid panel', 'serum', 'plasma', 'bilirubin', 'creatinine',
        'urea', 'sgot', 'sgpt', 'mg/dl', 'g/dl', 'k/ul'
    ]
    found_keywords = [keyword for keyword in medical_keywords if keyword in text_lower]
    keyword_confidence = (len(found_keywords) / len(medical_keywords)) * 100
    
    # 2. Semantic Understanding (Simplified)
    # Check for common patterns like "Test: Value" or "Test Value Unit"
    has_value_pattern = any(
        re.search(r'(\w+):\s*(\d+\.?\d*)', extracted_text) or
        re.search(r'(\w+)\s+(\d+\.?\d*)\s+(mg/dl|g/dl|k/ul)', extracted_text, re.IGNORECASE)
        for re in [__import__('re')]
    )
    semantic_confidence = 50 if has_value_pattern else 0

    # 3. Lab/Hospital Name Check (Simplified)
    lab_keywords = ['lab', 'laboratory', 'medical', 'center', 'hospital', 'clinic', 'diagnostics']
    has_lab_name = any(keyword in text_lower for keyword in lab_keywords)
    lab_confidence = 50 if has_lab_name else 0
    
    # Calculate total confidence score (simple weighted average)
    total_confidence = (keyword_confidence * 0.5) + (semantic_confidence * 0.25) + (lab_confidence * 0.25)
    
    # Return a success flag if confidence is above a certain threshold, e.g., 20%
    is_likely_report = total_confidence > 5  # Lowered threshold for better flexibility

    return {
        "isLikelyReport": is_likely_report,
        "totalConfidence": total_confidence,
        "foundKeywords": found_keywords,
    }

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

@app.route('/extract-text', methods=['POST'])
def extract_text_endpoint():
    try:
        data = request.get_json(silent=True)
        if not data or 'image_data' not in data:
            return jsonify({"success": False, "reason": "Missing 'image_data' in request body."}), 400

        image_data = data.get('image_data')
        
        extracted_text = ""
        # Handle Base64 encoded image
        if image_data.startswith('data:image'):
            header, encoded_data = image_data.split(',', 1)
            file_bytes = base64.b64decode(encoded_data)
            img = Image.open(io.BytesIO(file_bytes))
            extracted_text = _extract_text_from_image(img)
        # Handle PDF (requires pdf2image)
        elif image_data.lower().endswith('.pdf'):
            if not _PDF2IMAGE_AVAILABLE:
                return jsonify({"success": False, "reason": "PDF support not installed. Please install pdf2image dependencies."}), 501
            resp = requests.get(image_data, timeout=30)
            resp.raise_for_status()
            pages = convert_from_bytes(resp.content, dpi=300, first_page=1, last_page=1)
            if not pages:
                return jsonify({"success": False, "reason": "Unable to read PDF pages."}), 400
            extracted_text = _extract_text_from_image(pages[0])
        else:
            # Assume it's an image URL
            resp = requests.get(image_data, timeout=30)
            resp.raise_for_status()
            img = Image.open(io.BytesIO(resp.content))
            extracted_text = _extract_text_from_image(img)

        validation_result = validate_blood_report(extracted_text)
        
        # Always return the extracted text, but with validation status
        return jsonify({
            "success": validation_result["isLikelyReport"],
            "reason": "Document validated as a blood report." if validation_result["isLikelyReport"] else "The uploaded file does not appear to be a blood report.",
            "text": extracted_text,
            "validation": validation_result,
            "confidence": validation_result["totalConfidence"],
            "foundKeywords": validation_result["foundKeywords"]
        })

    except Exception as e:
        app.logger.error(f"Error processing request: {e}")
        return jsonify({"success": False, "reason": f"An unexpected error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    print("🚀 Starting Python OCR Fl