# This script will test your 'best.pt' model directly to confirm it's working.

from ultralytics import YOLO
import os
from PIL import Image # Used for robust image loading
import numpy as np   # Used to handle the image array

# --- 1. CONFIGURATION ---
# IMPORTANT: Make sure 'best.pt' is in the same folder as this script.
MODEL_PATH = 'best.pt'

# IMPORTANT: Change this to the path of an image you want to test.
# Use a clear image of a fruit or vegetable you know is in your dataset.
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

    # Manually load the image using Pillow to prevent potential read errors
    print(f"\n🔍 Reading image from '{os.path.basename(IMAGE_PATH)}'...")
    img = Image.open(IMAGE_PATH)
    img_rgb = np.array(img.convert('RGB')) # Convert to format model expects
    print("✅ Image read successfully.")

    # Run prediction on the image data.
    # We set conf=0.01 to see ALL possible detections, even ones with low confidence.
    print(f"🔍 Running prediction...")
    results = model(img_rgb, conf=0.01)

    # Process and print the results in a user-friendly format
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


    
