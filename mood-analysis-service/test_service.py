import requests
import json

def test_mood_detection():
    """Test the mood detection endpoint with sample text inputs."""
    
    base_url = "http://localhost:8000"
    
    # Test cases with different emotions
    test_cases = [
        "I'm feeling really happy and excited today!",
        "I'm so sad and down, nothing seems to work.",
        "I'm really angry about what happened at work.",
        "I'm feeling anxious and worried about the future.",
        "Wow! I'm so surprised by this amazing news!",
        "I'm disgusted by the way they treated me.",
        "I'm feeling calm and neutral about everything."
    ]
    
    print("Testing Mood Analysis Service...")
    print("=" * 50)
    
    for i, text in enumerate(test_cases, 1):
        try:
            response = requests.post(
                f"{base_url}/detect-mood",
                json={"text": text},
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"Test {i}: ✅")
                print(f"  Input: {text[:50]}...")
                print(f"  Detected Mood: {result['mood']}")
                print(f"  Confidence: {result['confidence']}")
                print()
            else:
                print(f"Test {i}: ❌")
                print(f"  Status Code: {response.status_code}")
                print(f"  Response: {response.text}")
                print()
                
        except requests.exceptions.ConnectionError:
            print(f"Test {i}: ❌")
            print("  Error: Could not connect to the service. Make sure it's running on localhost:8000")
            print()
            break
        except Exception as e:
            print(f"Test {i}: ❌")
            print(f"  Error: {str(e)}")
            print()

def test_health_endpoint():
    """Test the health check endpoint."""
    
    base_url = "http://localhost:8000"
    
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("Health Check: ✅")
            print(f"  Response: {response.json()}")
        else:
            print("Health Check: ❌")
            print(f"  Status Code: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("Health Check: ❌")
        print("  Error: Could not connect to the service")
    except Exception as e:
        print("Health Check: ❌")
        print(f"  Error: {str(e)}")

if __name__ == "__main__":
    print("Mood Analysis Service Test")
    print("=" * 50)
    print()
    
    # Test health endpoint first
    test_health_endpoint()
    print()
    
    # Test mood detection
    test_mood_detection()









