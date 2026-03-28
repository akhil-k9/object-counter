from flask import Flask, request, render_template, Response, jsonify
from ultralytics import YOLO
from collections import Counter
import cv2
import os
import base64
import numpy as np

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads/'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Load best model
model = YOLO("best_model.pt")

# Global camera object
camera = None

def encode_image(image_path):
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)

    # Run detection
    results = model(filepath, verbose=False)
    class_names = results[0].names
    detected = [class_names[int(c)] for c in results[0].boxes.cls]
    counts = dict(Counter(detected))
    total = len(detected)

    # Save annotated image
    annotated = results[0].plot()
    output_path = os.path.join("static/uploads", "output_" + file.filename)
    cv2.imwrite(output_path, annotated)

    # Encode output image to base64
    img_base64 = encode_image(output_path)

    return jsonify({
        "total": total,
        "counts": counts,
        "image": img_base64
    })

def generate_frames():
    global camera
    camera = cv2.VideoCapture(0)
    counted_ids = set()
    vehicle_count = 0

    while True:
        success, frame = camera.read()
        if not success:
            break

        results = model.track(frame, tracker="bytetrack.yaml", persist=True, verbose=False)
        frame_height = frame.shape[0]
        counting_line_y = frame_height // 2

        # Draw counting line
        cv2.line(frame, (0, counting_line_y), (frame.shape[1], counting_line_y), (0, 255, 255), 2)
        cv2.putText(frame, "Counting Line", (10, counting_line_y - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)

        if results[0].boxes.id is not None:
            for box in results[0].boxes:
                if box.id is not None:
                    object_id = int(box.id)
                    center_y = int((box.xyxy[0][1] + box.xyxy[0][3]) / 2)

                    if center_y > counting_line_y and object_id not in counted_ids:
                        counted_ids.add(object_id)
                        vehicle_count += 1

        # Annotate frame
        annotated_frame = results[0].plot()

        # Show count on frame
        cv2.rectangle(annotated_frame, (10, 10), (280, 60), (0, 0, 0), -1)
        cv2.putText(annotated_frame, f"Total Count: {vehicle_count}", (20, 45),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        ret, buffer = cv2.imencode('.jpg', annotated_frame)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route("/video_feed")
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route("/stop_camera", methods=["POST"])
def stop_camera():
    global camera
    if camera:
        camera.release()
        camera = None
    return jsonify({"status": "Camera stopped"})

if __name__ == "__main__":
    app.run(debug=True)
