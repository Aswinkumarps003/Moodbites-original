#!/usr/bin/env python3
"""
Fridge Scanner Service Startup Script
This script starts the Python Flask backend for the fridge scanner service.
"""

import os
import sys
import subprocess

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    return True

def install_requirements():
    """Install required Python packages"""
    try:
        print("📦 Installing Python dependencies...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def start_service():
    """Start the Flask service"""
    try:
        print("🚀 Starting Fridge Scanner Service...")
        os.system(f"{sys.executable} backend.py")
    except KeyboardInterrupt:
        print("\n🛑 Service stopped by user")
    except Exception as e:
        print(f"❌ Error starting service: {e}")

def main():
    """Main function"""
    print("🍎 Fridge Scanner Service")
    print("=" * 40)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install requirements
    if not install_requirements():
        sys.exit(1)
    
    # Start the service
    start_service()

if __name__ == "__main__":
    main()
