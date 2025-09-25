import io
import base64
import re
import pytesseract
from PIL import Image, ImageEnhance
from flask import Flask, request, jsonify

# Conditionally import pdf2image for PDF support
try:
    from pdf2image import convert_from_bytes
    _PDF2IMAGE_AVAILABLE = True
except ImportError:
    _PDF2IMAGE_AVAILABLE = False

# --- Configuration ---
# Set this to your Tesseract executable path if not on PATH
# Windows example:
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

app = Flask(__name__)

# --- Keyword Validation Setup (Tiered, Weighted) ---
TIER_1_KEYWORDS = {
    'lipid profile': 15, 'serum cholesterol': 15, 'serum triglycerides': 15,
    'serum hdl': 15, 'serum ldl': 15, 'vldl': 10, 'blood sugar (fasting)': 15,
    'biological reference range': 10, 'observed value': 10,
    'name of investigation': 10, 'mg/dl': 15
}
TIER_2_KEYWORDS = {
    'biochemistry': 8, 'serum': 5, 'fasting': 5, 'normal:': 5, 'high:': 5,
    'borderline high': 5, 'ratio': 5, 'lab technician': 5, 'final report': 5,
    'hemoglobin': 7, 'platelets': 7, 'glucose': 7, 'rbc': 5, 'wbc': 5
}
TIER_3_KEYWORDS = {
    'laboratory': 3, 'lab': 3, 'medical': 2, 'patient name': 3, 'name': 2,
    'gender & age': 3, 'bill no.': 3, 'bill date': 3, 'collected on': 3,
    'report on': 3, 'referred by': 2, 'approved by': 2
}
CONFIDENCE_THRESHOLD = 40  # Minimum weighted score to consider valid report

def _preprocess_image(img: Image.Image) -> Image.Image:
    """Basic preprocessing to improve OCR results."""
    img = img.convert('L')
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.8)
    enhancer = ImageEnhance.Sharpness(img)
    img = enhancer.enhance(2.0)
    return img

def _extract_text_from_image(img: Image.Image) -> str:
    """Runs OCR on a preprocessed PIL Image object."""
    processed_img = _preprocess_image(img)
    return pytesseract.image_to_string(processed_img)

def validate_blood_report(extracted_text: str) -> dict:
    """
    Validates if the extracted text is a blood report using a weighted keyword scoring system
    and tiered heuristics.
    """
    text_lower = extracted_text.lower()
    score = 0
    found = set()

    # Weighted scoring
    for keyword, weight in TIER_1_KEYWORDS.items():
        if keyword in text_lower:
            score += weight
            found.add(keyword)
    for keyword, weight in TIER_2_KEYWORDS.items():
        if keyword in text_lower:
            score += weight
            found.add(keyword)
    for keyword, weight in TIER_3_KEYWORDS.items():
        if keyword in text_lower:
            score += weight
            found.add(keyword)

    # Heuristics: ensure core blood-report signal
    # Count occurrences per tier for core rule
    tier1_hits = sum(1 for k in TIER_1_KEYWORDS if k in text_lower)
    tier2_hits = sum(1 for k in TIER_2_KEYWORDS if k in text_lower)
    passes_core = tier1_hits >= 2 or (tier1_hits >= 1 and tier2_hits >= 3)

    is_likely_report = (score >= CONFIDENCE_THRESHOLD) and passes_core

    reason = (
        f"Confidence score {score} >= {CONFIDENCE_THRESHOLD} with core keyword signal."
        if is_likely_report else
        f"Score {score} below {CONFIDENCE_THRESHOLD} or insufficient core keywords."
    )

    return {
        "isLikelyReport": is_likely_report,
        "confidenceScore": score,
        "foundKeywords": sorted(list(found)),
        "reason": reason
    }

@app.route('/extract-text', methods=['POST'])
def extract_text_endpoint():
    try:
        data = request.get_json()
        if not data or 'image_data' not in data:
            return jsonify({"success": False, "reason": "Missing 'image_data' in request body."}), 400

        image_data = data['image_data']
        if ',' not in image_data:
            return jsonify({"success": False, "reason": "Invalid data URL format."}), 400

        header, encoded_data = image_data.split(',', 1)
        try:
            file_bytes = base64.b64decode(encoded_data)
        except Exception:
            return jsonify({"success": False, "reason": "Base64 decode failed."}), 400
        
        extracted_text = ""

        # PDF (base64 data URL)
        if 'application/pdf' in header:
            if not _PDF2IMAGE_AVAILABLE:
                return jsonify({"success": False, "reason": "PDF processing dependencies not installed on server."}), 501
            pages = convert_from_bytes(file_bytes, dpi=300)
            if not pages:
                return jsonify({"success": False, "reason": "Unable to read PDF pages."}), 400
            extracted_text = _extract_text_from_image(pages[0])

        # Image (png/jpg/jpeg, base64 data URL)
        elif 'image' in header:
            try:
                img = Image.open(io.BytesIO(file_bytes))
            except Exception:
                return jsonify({"success": False, "reason": "Unable to decode image bytes."}), 400
            extracted_text = _extract_text_from_image(img)

        else:
            return jsonify({"success": False, "reason": "Unsupported file type in data URL."}), 400

        if not extracted_text or not extracted_text.strip():
            return jsonify({
                "success": False,
                "text": "",
                "validation": {
                    "isLikelyReport": False,
                    "confidenceScore": 0,
                    "reason": "OCR could not extract any text from the file."
                }
            })

        validation = validate_blood_report(extracted_text)

        return jsonify({
            "success": validation["isLikelyReport"],
            "text": extracted_text,
            "validation": validation
        })

    except Exception as e:
        app.logger.error(f"Error processing request: {e}")
        return jsonify({"success": False, "reason": str(e)}), 500

if __name__ == "__main__":
    print("🚀 Starting Python OCR Flask server with keyword validation on http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)