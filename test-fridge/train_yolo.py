import os
import sys
from pathlib import Path
from ultralytics import YOLO
import torch

def check_dataset_structure():
    """Check if the dataset structure is correct"""
    required_dirs = ['train/images', 'train/labels', 'valid/images', 'valid/labels', 'test/images', 'test/labels']
    
    print("🔍 Checking dataset structure...")
    for dir_path in required_dirs:
        if not os.path.exists(dir_path):
            print(f"❌ Missing directory: {dir_path}")
            return False
        else:
            file_count = len([f for f in os.listdir(dir_path) if f.endswith(('.jpg', '.jpeg', '.png', '.txt'))])
            print(f"✅ {dir_path}: {file_count} files")
    
    return True

def check_data_yaml():
    """Check if data.yaml exists and is valid"""
    if not os.path.exists('data.yaml'):
        print("❌ data.yaml not found!")
        return False
    
    print("✅ data.yaml found")
    return True

def main():
    print("🥬 YOLO Vegetable Detection Training Script")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists('data.yaml'):
        print("❌ Please run this script from the test-fridge directory")
        print("   cd test-fridge")
        print("   python train_yolo.py")
        sys.exit(1)
    
    # Configuration
    DATASET_YAML_PATH = 'data.yaml'
    EPOCHS = 50  # Reduced for faster training
IMAGE_SIZE = 640
    BATCH_SIZE = 16  # Adjust based on your GPU memory
    
    print(f"📊 Training Configuration:")
    print(f"   - Epochs: {EPOCHS}")
    print(f"   - Image Size: {IMAGE_SIZE}")
    print(f"   - Batch Size: {BATCH_SIZE}")
    print(f"   - Dataset: {DATASET_YAML_PATH}")
    
    # Check dataset structure
    if not check_dataset_structure():
        print("❌ Dataset structure is incomplete. Please check your dataset.")
        sys.exit(1)
    
    # Check data.yaml
    if not check_data_yaml():
        print("❌ data.yaml is missing or invalid.")
        sys.exit(1)
    
    # Check GPU availability
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"🖥️  Using device: {device}")
    
    if device == 'cpu':
        print("⚠️  Warning: CUDA not available. Training will be slower on CPU.")
        BATCH_SIZE = 4  # Reduce batch size for CPU
    
    try:
        # Load pre-trained model
        print("\n🤖 Loading pre-trained YOLOv8m model...")
model = YOLO('yolov8m.pt') 

        # Start training
        print(f"\n🚀 Starting training for {EPOCHS} epochs...")
        print("   This may take a while...")
        
results = model.train(
    data=DATASET_YAML_PATH,
    epochs=EPOCHS,
    imgsz=IMAGE_SIZE,
            batch=BATCH_SIZE,
            name='yolo_vegetable_detector',
            device=device,
            patience=10,  # Early stopping patience
            save=True,
            save_period=10,  # Save checkpoint every 10 epochs
            val=True,
            plots=True,
            verbose=True
        )
        
        print("\n🎉 Training completed successfully!")
        print("📁 Model saved in: runs/detect/yolo_vegetable_detector/weights/")
        print("   - best.pt: Best model based on validation metrics")
        print("   - last.pt: Last epoch model")
        
        # Test the trained model
        print("\n🧪 Testing the trained model...")
        best_model = YOLO('runs/detect/yolo_vegetable_detector/weights/best.pt')
        
        # Run validation
        val_results = best_model.val()
        print(f"📊 Validation mAP50: {val_results.box.map50:.3f}")
        print(f"📊 Validation mAP50-95: {val_results.box.map:.3f}")
        
        print("\n✅ Training and validation completed successfully!")
        print("🎯 Your model is ready to use for vegetable detection!")
        
    except Exception as e:
        print(f"❌ Training failed with error: {str(e)}")
        print("💡 Common solutions:")
        print("   - Check if you have enough GPU memory (try reducing batch_size)")
        print("   - Ensure all dataset files are present")
        print("   - Check if data.yaml paths are correct")
        sys.exit(1)

if __name__ == "__main__":
    main()
