import cv2
import os
from ultralytics import YOLO
from datetime import datetime
from api import send_detection

# Load YOLO model
model = YOLO("yolov8n.pt")

# Keep track of active detections
active_detections = set()

# Classes required for CHITTI
required_classes = [
    "person",
    "cow",
    "dog",
    "elephant"
]

# ==========================
# Save Folder (UPDATED)
# ==========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
save_folder = os.path.join(BASE_DIR, "detections")

os.makedirs(save_folder, exist_ok=True)

print("Images will be saved to:")
print(save_folder)
print()

# Open webcam
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("❌ Could not open webcam")
    exit()

print("✅ Webcam started. Press 'q' to quit.")

current_detections = set()

while True:

    ret, frame = cap.read()

    if not ret:
        break

    annotated_frame = frame.copy()

    current_detections = set()

    results = model(frame)

    for result in results:

        for box in result.boxes:

            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            confidence = float(box.conf[0])

            if class_name in required_classes and confidence > 0.70:

                current_detections.add(class_name)

                print(f"{class_name}: {confidence:.2f}")

                x1, y1, x2, y2 = map(int, box.xyxy[0])

                cv2.rectangle(
                    annotated_frame,
                    (x1, y1),
                    (x2, y2),
                    (0, 255, 0),
                    2
                )

                cv2.putText(
                    annotated_frame,
                    f"{class_name} {confidence:.2f}",
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    (0, 255, 0),
                    2
                )

                # Save only once per appearance
                if class_name not in active_detections:

                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

                    filename = f"{class_name}_{timestamp}.jpg"

                    filepath = os.path.join(save_folder, filename)

                    # Save image
                    success = cv2.imwrite(filepath, frame)

                    if success:
                        print("📸 Image saved at:")
                        print(filepath)
                    else:
                        print("❌ Failed to save image")

                    detection_data = {
                        "animal": class_name,
                        "confidence": round(confidence * 100, 2),
                        "timestamp": datetime.now().isoformat(),
                        "image": filename,
                        "camera": "Laptop Webcam"
                    }

                    print(f"✅ New {class_name} detected")

                    send_detection(detection_data)

                    active_detections.add(class_name)

    # Remove disappeared objects
    active_detections.intersection_update(current_detections)

    # Show live video
    cv2.imshow("CHITTI 4.0", annotated_frame)

    # Quit
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()