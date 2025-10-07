import os
import yaml
from pathlib import Path

def test_dataset():
    """Test the dataset structure and data.yaml configuration"""
    print("🧪 Testing Dataset Structure")
    print("=" * 40)
    
    # Check if data.yaml exists
    if not os.path.exists('data.yaml'):
        print("❌ data.yaml not found!")
        return False
    
    # Load and validate data.yaml
    try:
        with open('data.yaml', 'r') as f:
            data = yaml.safe_load(f)
        print("✅ data.yaml loaded successfully")
        
        # Check required fields
        required_fields = ['train', 'val', 'test', 'nc', 'names']
        for field in required_fields:
            if field not in data:
                print(f"❌ Missing field in data.yaml: {field}")
                return False
            else:
                print(f"✅ {field}: {data[field] if field != 'names' else f'{len(data[field])} classes'}")
        
    except Exception as e:
        print(f"❌ Error loading data.yaml: {e}")
        return False
    
    # Check dataset directories
    directories = ['train/images', 'train/labels', 'valid/images', 'valid/labels', 'test/images', 'test/labels']
    
    print("\n📁 Checking directories:")
    for dir_path in directories:
        if os.path.exists(dir_path):
            file_count = len([f for f in os.listdir(dir_path) if f.endswith(('.jpg', '.jpeg', '.png', '.txt'))])
            print(f"✅ {dir_path}: {file_count} files")
        else:
            print(f"❌ {dir_path}: Not found")
            return False
    
    # Check if image and label counts match
    print("\n🔍 Checking image-label pairs:")
    for split in ['train', 'valid', 'test']:
        img_dir = f"{split}/images"
        label_dir = f"{split}/labels"
        
        img_files = set([f.replace('.jpg', '').replace('.jpeg', '').replace('.png', '') 
                        for f in os.listdir(img_dir) if f.endswith(('.jpg', '.jpeg', '.png'))])
        label_files = set([f.replace('.txt', '') 
                          for f in os.listdir(label_dir) if f.endswith('.txt')])
        
        if img_files == label_files:
            print(f"✅ {split}: {len(img_files)} image-label pairs match")
        else:
            missing_labels = img_files - label_files
            missing_images = label_files - img_files
            if missing_labels:
                print(f"⚠️  {split}: {len(missing_labels)} images missing labels")
            if missing_images:
                print(f"⚠️  {split}: {len(missing_images)} labels missing images")
    
    print("\n🎉 Dataset structure looks good!")
    return True

if __name__ == "__main__":
    test_dataset()




