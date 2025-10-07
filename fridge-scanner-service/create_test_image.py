#!/usr/bin/env python3
"""
Create a simple test image for testing the fridge scanner
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_test_image():
    """Create a simple test image with some basic shapes representing food"""
    
    # Create a white background
    width, height = 800, 600
    image = Image.new('RGB', (width, height), 'white')
    draw = ImageDraw.Draw(image)
    
    # Try to use a default font, fallback to basic if not available
    try:
        font = ImageFont.truetype("arial.ttf", 24)
    except:
        font = ImageFont.load_default()
    
    # Draw some simple shapes representing food items
    # Apple (red circle)
    draw.ellipse([100, 100, 200, 200], fill='red', outline='darkred', width=3)
    draw.text((120, 220), "Apple", fill='red', font=font)
    
    # Banana (yellow oval)
    draw.ellipse([250, 120, 350, 180], fill='yellow', outline='orange', width=3)
    draw.text((280, 200), "Banana", fill='orange', font=font)
    
    # Carrot (orange rectangle)
    draw.rectangle([400, 100, 450, 200], fill='orange', outline='darkorange', width=3)
    draw.text((420, 220), "Carrot", fill='orange', font=font)
    
    # Bread (brown rectangle)
    draw.rectangle([500, 120, 600, 180], fill='brown', outline='darkbrown', width=3)
    draw.text((520, 200), "Bread", fill='brown', font=font)
    
    # Add a title
    title_font = ImageFont.load_default()
    draw.text((300, 50), "Test Fridge Image", fill='black', font=title_font)
    
    # Save the image
    test_dir = "test_images"
    os.makedirs(test_dir, exist_ok=True)
    image_path = os.path.join(test_dir, "test_fridge.png")
    image.save(image_path)
    
    print(f"✅ Test image created: {image_path}")
    return image_path

def main():
    """Create test image"""
    print("🎨 Creating test image for Fridge Scanner...")
    
    try:
        image_path = create_test_image()
        print(f"📁 Test image saved to: {os.path.abspath(image_path)}")
        print("You can now upload this image to test the scanner!")
    except Exception as e:
        print(f"❌ Error creating test image: {e}")

if __name__ == "__main__":
    main()
