# 🥬 YOLO Vegetable Detection Training

This folder contains everything needed to train a YOLO model for vegetable detection using the Roboflow dataset.

## 📁 Folder Structure

```
test-fridge/
├── data.yaml              # Dataset configuration
├── train/                 # Training data
│   ├── images/           # Training images
│   └── labels/           # Training labels (YOLO format)
├── valid/                 # Validation data
│   ├── images/           # Validation images
│   └── labels/           # Validation labels
├── test/                  # Test data
│   ├── images/           # Test images
│   └── labels/           # Test labels
├── train_yolo.py         # Main training script
├── test_dataset.py       # Dataset validation script
├── inference.py          # Inference script
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Test Dataset Structure

```bash
python test_dataset.py
```

This will verify that:
- All required directories exist
- Image and label files are properly paired
- data.yaml configuration is correct

### 3. Train the Model

```bash
python train_yolo.py
```

The training script will:
- ✅ Check dataset structure
- ✅ Verify data.yaml configuration
- ✅ Detect available device (GPU/CPU)
- ✅ Load pre-trained YOLOv8m model
- ✅ Train for 50 epochs (adjustable)
- ✅ Save the best model
- ✅ Run validation

### 4. Test the Trained Model

```bash
python inference.py
```

This will run inference on test images and save predictions to the `predictions/` folder.

## ⚙️ Configuration

### Training Parameters (in train_yolo.py)

```python
EPOCHS = 50          # Number of training epochs
IMAGE_SIZE = 640     # Input image size
BATCH_SIZE = 16      # Batch size (adjust based on GPU memory)
```

### Dataset Classes (38 classes)

The model can detect 38 different vegetables and fruits:
- Avocado, Bell Pepper, Broccoli, Burger, Carrot
- Lettuce, Potato, Pumpkin, Tomato, Apple, Banana
- And 28 more classes...

## 📊 Training Output

After training, you'll find:

```
runs/detect/yolo_vegetable_detector/
├── weights/
│   ├── best.pt      # Best model (highest mAP)
│   └── last.pt      # Last epoch model
├── results.png      # Training curves
├── confusion_matrix.png
└── val_batch0_pred.jpg
```

## 🔧 Troubleshooting

### Common Issues

1. **CUDA Out of Memory**
   - Reduce `BATCH_SIZE` in train_yolo.py
   - Use smaller model (yolov8s.pt instead of yolov8m.pt)

2. **Dataset Structure Errors**
   - Run `python test_dataset.py` to check structure
   - Ensure all image-label pairs exist

3. **Training Too Slow**
   - Use GPU if available
   - Reduce `IMAGE_SIZE` to 416
   - Reduce `EPOCHS` for testing

### Performance Tips

- **GPU Training**: Much faster than CPU
- **Batch Size**: Larger batches = faster training (if memory allows)
- **Image Size**: 640px is good balance of speed/accuracy
- **Early Stopping**: Model stops if no improvement for 10 epochs

## 📈 Expected Results

With proper training, you should achieve:
- **mAP50**: 0.7+ (70%+ accuracy)
- **mAP50-95**: 0.4+ (40%+ accuracy across IoU thresholds)

## 🎯 Using the Trained Model

```python
from ultralytics import YOLO

# Load your trained model
model = YOLO('runs/detect/yolo_vegetable_detector/weights/best.pt')

# Run inference
results = model('path/to/image.jpg')

# Process results
for r in results:
    print(r.boxes)  # Bounding boxes
    print(r.names)  # Class names
```

## 📝 Notes

- The dataset contains 2,895+ images across train/valid/test splits
- All images are in YOLO format with normalized coordinates
- Training typically takes 2-4 hours on GPU, 8-12 hours on CPU
- Model automatically saves checkpoints every 10 epochs

## 🆘 Support

If you encounter issues:
1. Check the error messages carefully
2. Verify dataset structure with `test_dataset.py`
3. Try reducing batch size or image size
4. Ensure all dependencies are installed correctly




