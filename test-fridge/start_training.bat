@echo off
echo 🥬 YOLO Vegetable Detection Training
echo ====================================

echo.
echo 📋 Step 1: Installing dependencies...
pip install -r requirements.txt

echo.
echo 📋 Step 2: Testing dataset structure...
python test_dataset.py

if %errorlevel% neq 0 (
    echo ❌ Dataset test failed! Please check the errors above.
    pause
    exit /b 1
)

echo.
echo 📋 Step 3: Starting training...
echo ⚠️  This may take several hours depending on your hardware.
echo.
python train_yolo.py

if %errorlevel% neq 0 (
    echo ❌ Training failed! Please check the errors above.
    pause
    exit /b 1
)

echo.
echo 📋 Step 4: Running inference test...
python inference.py

echo.
echo ✅ All done! Check the 'predictions' folder for results.
echo 📁 Model saved in: runs/detect/yolo_vegetable_detector/weights/
pause




