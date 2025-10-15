import os
import yaml

# --- Configuration ---
# Set the path to the main directory containing your dataset folders
train_dir = 'D:/Downloads/Telegram Desktop/food360/fruits-360_original-size/fruits-360-original-size/Training'
val_dir = 'D:/Downloads/Telegram Desktop/food360/fruits-360_original-size/fruits-360-original-size/Validation'
output_yaml_file = 'fruits360.yaml'
# --- End Configuration ---

def generate_dataset_yaml():
    """
    Scans the training directory to get class names and generates a YAML file.
    """
    try:
        # Get class names by listing the directories inside the 'train_dir'
        class_names = sorted([d for d in os.listdir(train_dir) if os.path.isdir(os.path.join(train_dir, d))])
        
        num_classes = len(class_names)

        if num_classes == 0:
            print(f"Error: No class folders found in '{train_dir}'. Please check your path.")
            return

        print(f"✅ Found {num_classes} classes.")

        # Create the data dictionary with absolute paths
        data = {
            'train': os.path.abspath(train_dir),
            'val': os.path.abspath(val_dir),
            'nc': num_classes,
            'names': class_names
        }

        # Write the data to the YAML file
        with open(output_yaml_file, 'w') as f:
            yaml.dump(data, f, sort_keys=False, default_flow_style=False)

        print(f"✅ Successfully created '{output_yaml_file}'!")
        print(f"Please verify the paths in the generated file are correct.")

    except FileNotFoundError:
        print(f"Error: The directory '{train_dir}' was not found.")
        print("Please make sure the 'train_dir' path in the script is correct.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == '__main__':
    generate_dataset_yaml()