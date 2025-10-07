import os
import cv2
import numpy as np
from ultralytics import YOLO
from pathlib import Path

def run_inference(model_path, image_path, output_dir="predictions"):
    """Run inference on a single image"""
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Load the trained model
    print(f"🤖 Loading model: {model_path}")
    model = YOLO(model_path)
    
    # Check if image exists
    if not os.path.exists(image_path):
        print(f"❌ Image not found: {image_path}")
        return
    
    # Run inference
    print(f"🔍 Running inference on: {image_path}")
    results = model(image_path)
    
    # Process results
    for r in results:
        # Get the image
        img = r.orig_img.copy()
        
        # Draw bounding boxes
        if r.boxes is not None:
            for box in r.boxes:
                # Get box coordinates
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(int)
                confidence = box.conf[0].cpu().numpy()
                class_id = int(box.cls[0].cpu().numpy())
                class_name = model.names[class_id]
                
                # Draw rectangle
                cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
                
                # Draw label
                label = f"{class_name}: {confidence:.2f}"
                cv2.putText(img, label, (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        # Save result
        output_path = os.path.join(output_dir, f"predicted_{os.path.basename(image_path)}")
        cv2.imwrite(output_path, img)
        print(f"💾 Saved prediction: {output_path}")

def main():
    print("🥬 YOLO Vegetable Detection Inference")
    print("=" * 40)
    
    # Check if model exists
    model_path = "runs/detect/yolo_vegetable_detector/weights/best.pt"
    if not os.path.exists(model_path):
        print(f"❌ Model not found: {model_path}")
        print("   Please train the model first by running: python train_yolo.py")
        return
    
    # Test on a sample image
    test_images = []
    
    # Look for test images in the test directory
    test_dir = "test/images"
    if os.path.exists(test_dir):
        test_images = [os.path.join(test_dir, f) for f in os.listdir(test_dir) 
                      if f.endswith(('.jpg', '.jpeg', '.png'))][:5]  # Test first 5 images
    
    if not test_images:
        print("❌ No test images found in test/images directory")
        return
    
    print(f"🔍 Found {len(test_images)} test images")
    
    # Run inference on test images
    for img_path in test_images:
        run_inference(model_path, img_path)
    
    print("\n✅ Inference completed!")
    print("📁 Check the 'predictions' folder for results")

if __name__ == "__main__":
    main()




