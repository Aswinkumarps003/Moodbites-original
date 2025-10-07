#!/usr/bin/env python3
"""
Test script for Fridge Scanner Service API
"""

import requests
import json

def test_health_endpoint():
    """Test the health check endpoint"""
    try:
        response = requests.get('http://localhost:4005/api/health')
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_predict_endpoint():
    """Test the predict endpoint with a sample image"""
    try:
        # Create a simple test image (1x1 pixel PNG)
        import base64
        
        # Minimal PNG file (1x1 transparent pixel)
        png_data = base64.b64decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        )
        
        files = {'file': ('test.png', png_data, 'image/png')}
        response = requests.post('http://localhost:4005/api/predict', files=files)
        
        if response.status_code == 200:
            print("✅ Predict endpoint accessible")
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"❌ Predict endpoint failed: {response.status_code}")
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Predict endpoint error: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Fridge Scanner Service API")
    print("=" * 40)
    
    # Test health endpoint
    health_ok = test_health_endpoint()
    print()
    
    # Test predict endpoint
    predict_ok = test_predict_endpoint()
    print()
    
    # Summary
    if health_ok and predict_ok:
        print("🎉 All tests passed! Service is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the service logs.")

if __name__ == "__main__":
    main()
