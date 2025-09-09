import io
import requests
import pytesseract
from PIL import Image, ImageEnhance, ImageDraw, ImageFont
from flask import Flask, request, jsonify

# Conditionally import pdf2image for PDF support
try:
    from pdf2image import convert_from_bytes
    _PDF2IMAGE_AVAILABLE = True
except ImportError:
    _PDF2IMAGE_AVAILABLE = False

# --- Configuration ---
# If Tesseract is not in your system's PATH, uncomment and set the path.
# For Windows, it might be:
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def _preprocess_image(img: Image.Image) -> Image.Image:
    """Basic preprocessing to improve OCR results."""
    img = img.convert('L')  # Convert to grayscale
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(2)  # Increase contrast
    return img

def _extract_text_from_image(img: Image.Image) -> str:
    """Runs OCR on a preprocessed PIL Image object."""
    processed_img = _preprocess_image(img)
    return pytesseract.image_to_string(processed_img)

def _perform_validation(extracted_text: str, user_name: str) -> dict:
    """
    CHANGE 1: This is the new, centralized validation logic.
    It checks for the name and keywords to avoid code duplication.
    """
    text_to_check = extracted_text.lower()

    # CHANGE 2: Improved, more flexible name validation.
    # It splits the name (e.g., "Jane Doe") and checks if both "jane" and "doe" are present.
    name_parts = user_name.lower().split()
    name_found = all(part in text_to_check for part in name_parts)
    
    if not name_found:
        return {"success": False, "reason": f"Name '{user_name}' not found.", "text": extracted_text}

    # Keyword Validation (no changes needed here)
    required_keywords = ["diet", "dietitian", "health coach", "nutritionist"]
    keyword_found = any(keyword in text_to_check for keyword in required_keywords)
    
    if not keyword_found:
        return {"success": False, "reason": "Required keywords not found.", "text": extracted_text}

    return {"success": True, "reason": "Validation successful.", "text": extracted_text}


def validate_cert_from_path(user_name: str, file_path: str) -> dict:
    """Validates a certificate from a local file path."""
    try:
        with Image.open(file_path) as img:
            extracted_text = _extract_text_from_image(img)
            # Call the new centralized validation function
            return _perform_validation(extracted_text, user_name)
    except FileNotFoundError:
        return {"success": False, "reason": "Certificate file not found.", "text": ""}
    except Exception as e:
        return {"success": False, "reason": f"An error occurred: {e}", "text": ""}


def validate_cert_from_url(user_name: str, certificate_url: str) -> dict:
    """Downloads and validates a certificate from a URL (image or PDF)."""
    try:
        resp = requests.get(certificate_url, timeout=30)
        resp.raise_for_status()

        content_type = resp.headers.get('Content-Type', '').lower()
        file_bytes = resp.content

        extracted_text = ""
        if 'pdf' in content_type or certificate_url.lower().endswith('.pdf'):
            if not _PDF2IMAGE_AVAILABLE:
                return {"success": False, "reason": "PDF support not available (pdf2image not installed).", "text": ""}
            pages = convert_from_bytes(file_bytes, dpi=300)
            if not pages:
                return {"success": False, "reason": "Unable to read PDF pages.", "text": ""}
            extracted_text = _extract_text_from_image(pages[0])
        else:
            img = Image.open(io.BytesIO(file_bytes))
            extracted_text = _extract_text_from_image(img)

        # Call the new centralized validation function
        return _perform_validation(extracted_text, user_name)

    except requests.RequestException as re:
        return {"success": False, "reason": f"Failed to download certificate: {re}", "text": ""}
    except Exception as e:
        return {"success": False, "reason": f"An error occurred processing the file: {e}", "text": ""}


app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

@app.route('/validate', methods=['POST'])
def validate_endpoint():
    data = request.get_json(silent=True) or {}
    user_name = data.get('user_name')
    certificate_url = data.get('certificate_url')

    if not user_name or not certificate_url:
        return jsonify({"success": False, "reason": "Missing user_name or certificate_url"}), 400

    result = validate_cert_from_url(user_name, certificate_url)
    return jsonify(result), 200


if __name__ == "__main__":
    print("🚀 Starting Python OCR Flask server on http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)