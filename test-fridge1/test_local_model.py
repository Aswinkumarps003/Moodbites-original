# This script will test your 'best.pt' model directly.

from ultralytics import YOLO
import os
from PIL import Image # --- FIX: Import the Pillow library for robust image loading ---
import numpy as np   # --- FIX: Import numpy to handle the image array ---

# --- 1. CONFIGURATION ---
# IMPORTANT: Make sure 'best.pt' is in the same folder as this script.
MODEL_PATH = 'best.pt'

# IMPORTANT: Change this to the path of an image you want to test.
# Use an image you expect to work, like a clear picture of a single vegetable.
IMAGE_PATH = "D:/moodbites project/test-fridge1/testimg/lime.jpg" 

# --- 2. SCRIPT LOGIC ---
if not os.path.exists(MODEL_PATH):
    print(f"❌ Error: Model file not found at '{MODEL_PATH}'")
    exit()

if not os.path.exists(IMAGE_PATH):
    print(f"❌ Error: Test image not found at '{IMAGE_PATH}'")
    print("👉 Please update the IMAGE_PATH variable in this script.")
    exit()

try:
    # Load your custom-trained model
    print("🤖 Loading YOLO model...")
    model = YOLO(MODEL_PATH)
    print("✅ Model loaded successfully.")

    # --- FIX: Manually load the image to prevent read errors ---
    print(f"\n🔍 Reading image from '{os.path.basename(IMAGE_PATH)}'...")
    # Open the image file
    img = Image.open(IMAGE_PATH)
    # Convert the image to an RGB NumPy array, which is the format the model expects
    img_rgb = np.array(img.convert('RGB'))
    print("✅ Image read successfully.")

    # Run prediction on the image array instead of the path
    print(f"🔍 Running prediction...")
    # We pass the image data directly, and set conf=0.01 to see ALL detections.
    results = model(img_rgb, conf=0.01)

    # Process and print the results
    print("\n--- DETECTION RESULTS ---")
    detection_count = 0
    for r in results:
        if r.boxes is not None:
            for box in r.boxes:
                class_name = model.names[int(box.cls)]
                confidence = float(box.conf)
                print(f"  - Found: {class_name} (Confidence: {confidence:.2f})")
                detection_count += 1
    
    if detection_count == 0:
        print("  - No objects were detected in this image.")
    
    print("-------------------------\n")

except Exception as e:
    print(f"❌ An error occurred during the test: {e}")

