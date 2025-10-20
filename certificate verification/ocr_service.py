import io
import requests
import pytesseract
import os # <-- Added for potential future port dynamic handling, though Gunicorn handles it
from PIL import Image, ImageEnhance
from flask import Flask, request, jsonify
from flask_cors import CORS # <-- FIX 2: Import CORS

# Conditionally import pdf2image for PDF support
try:
    from pdf2image import convert_from_bytes
    _PDF2IMAGE_AVAILABLE = True
except ImportError:
    _PDF2IMAGE_AVAILABLE = False

# --- Configuration ---
# Tesseract must be available in the container's PATH via the 'tesseract-ocr' package
# The Dockerfile's base image/environment should handle this if tesseract is installed.
# We comment out the Windows specific path for the Linux-based Docker image.
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# --- Flask App Initialization ---
app = Flask(__name__)
# FIX 2: Enable CORS for the Vercel frontend
CORS(app, origins=["https://moodbites-frontend.vercel.app"]) 

def _preprocess_image(img: Image.Image) -> Image.Image:
    """Basic preprocessing to improve OCR results."""
    img = img.convert('L')  # Convert to grayscale
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(2)  # Increase contrast
    return img

def _extract_text_from_image(img: Image.Image) -> str:
    """Runs OCR on a preprocessed PIL Image object."""
    processed_img = _preprocess_image(img)
    # Use a faster OCR language/config if only English/simple text is expected
    return pytesseract.image_to_string(processed_img)

def _perform_validation(extracted_text: str, user_name: str) -> dict:
    """
    Centralized validation logic: checks for the name and required keywords.
    """
    text_to_check = extracted_text.lower()

    # Improved, more flexible name validation.
    # It checks if all parts of the user_name (e.g., "Jane Doe" -> "jane", "doe") are present.
    name_parts = user_name.lower().split()
    # Require at least one part of the name to be present to prevent trivial passes
    if not name_parts:
        return {"success": False, "reason": "User name must not be empty.", "text": extracted_text}

    name_found = all(part in text_to_check for part in name_parts)
    
    if not name_found:
        return {"success": False, "reason": f"Name '{user_name}' not found.", "text": extracted_text}

    # Keyword Validation
    required_keywords = ["diet", "dietitian", "health coach", "nutritionist"]
    keyword_found = any(keyword in text_to_check for keyword in required_keywords)
    
    if not keyword_found:
        return {"success": False, "reason": "Required certification keywords not found.", "text": extracted_text}

    return {"success": True, "reason": "Validation successful.", "text": extracted_text}


def validate_cert_from_url(user_name: str, certificate_url: str) -> dict:
    """Downloads and validates a certificate from a URL (image or PDF)."""
    try:
        # Increase timeout slightly, especially for large PDFs
        resp = requests.get(certificate_url, timeout=45) 
        resp.raise_for_status()

        content_type = resp.headers.get('Content-Type', '').lower()
        file_bytes = resp.content

        extracted_text = ""
        # Check for PDF based on Content-Type or file extension
        if 'pdf' in content_type or certificate_url.lower().endswith('.pdf'):
            if not _PDF2IMAGE_AVAILABLE:
                # This should not happen if the Dockerfile is correctly implemented
                return {"success": False, "reason": "PDF support not available (Poppler/pdf2image missing).", "text": ""}
            
            # The 'pages' variable contains PIL Image objects, one for each page (we only use the first)
            # FIX 3: This works now because the Dockerfile installs poppler-utils!
            pages = convert_from_bytes(file_bytes, dpi=300) 
            
            if not pages:
                return {"success": False, "reason": "Unable to read any pages from the PDF.", "text": ""}
            
            # Run OCR on the first page
            extracted_text = _extract_text_from_image(pages[0])
        else:
            # Handle image file (JPG, PNG, etc.)
            img = Image.open(io.BytesIO(file_bytes))
            extracted_text = _extract_text_from_image(img)

        # Call the new centralized validation function
        return _perform_validation(extracted_text, user_name)

    except requests.RequestException as re:
        # Catch network/download issues
        return {"success": False, "reason": f"Failed to download certificate: {re}", "text": ""}
    except Exception as e:
        # Catch OCR/Image processing issues
        return {"success": False, "reason": f"An error occurred processing the file: {e}", "text": ""}

# --- Flask Routes ---

@app.route('/health', methods=['GET'])
def health():
    """Simple health check endpoint."""
    return jsonify({"status": "ok"})

@app.route('/validate', methods=['POST'])
def validate_endpoint():
    """Main endpoint to receive URL and name, and return validation result."""
    data = request.get_json(silent=True) or {}
    user_name = data.get('user_name')
    certificate_url = data.get('certificate_url')

    if not user_name or not certificate_url:
        return jsonify({"success": False, "reason": "Missing user_name or certificate_url in JSON body"}), 400

    result = validate_cert_from_url(user_name, certificate_url)
    return jsonify(result), 200

# The original __main__ block is REMOVED/commented out because Gunicorn will run the app, 
# not the Flask development server. This is FIX 1.
# if __name__ == "__main__":
#     print("🚀 Starting Python OCR Flask server on http://localhost:5001")
#     # Dynamic port handling is NOT needed here, as Gunicorn handles it via the --bind flag
#     app.run(host='0.0.0.0', port=5001, debug=True)