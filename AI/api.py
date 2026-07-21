import requests

API_URL = "http://localhost:5000/api/detections"

def send_detection(data):
    try:
        response = requests.post(API_URL, json=data)

        if response.status_code == 201:
            print("✅ Detection sent to backend")
            return response.json()
        else:
            print("❌ Failed:", response.text)
            return None

    except Exception as e:
        print("❌ Backend Error:", e)
        return None