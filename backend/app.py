import cv2
import os
import time
from collections import defaultdict
import numpy as np
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ultralytics import YOLO
import base64
from twilio.rest import Client  # Twilio import

# Twilio configuration
TWILIO_ACCOUNT_SID = ""  # Replace with your Twilio account SID
TWILIO_AUTH_TOKEN = "9751644f527edd8ed93e941145f656f6"    # Replace with your Twilio auth token
TWILIO_PHONE_NUMBER ="+12095070802"      # Replace with your Twilio phone number

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
PROCESSED_FOLDER = os.path.join(BASE_DIR, 'processed')
FACES_FOLDER = os.path.join(BASE_DIR, 'faces')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)
os.makedirs(FACES_FOLDER, exist_ok=True)

try:
    model = YOLO('C:/Users/darsh/Attensee/backend/best.pt')
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading YOLO model: {e}")
    model = None

face_tracker = {}
last_detection_time = {}
face_data = defaultdict(dict)
face_id_counter = 1  # Counter to keep track of face IDs starting from 1

def save_face_image(face_img, face_id):
    # Save the face image and return only the filename (without full path)
    face_filename = f"{face_id}.jpg"
    face_path = os.path.join(FACES_FOLDER, face_filename)
    cv2.imwrite(face_path, face_img)
    return face_filename  # Return only the filename

def detect_engagement(face_img):
    gray = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY)
    eyes = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml').detectMultiScale(gray)
    return len(eyes) >= 2

def send_notification(to_phone_number, message):
    """
    Sends an SMS notification using Twilio.
    
    :param to_phone_number: The recipient's phone number
    :param message: The message content to send
    """
    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        message = client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=to_phone_number
        )
        print(f"Notification sent: SID {message.sid}")
        return True
    except Exception as e:
        print(f"Error sending notification: {e}")
        return False

def process_video(video_path):
    global face_id_counter  # Use the global face_id_counter

    if model is None:
        print("Model not loaded, skipping video processing.")
        return

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Couldn't open video file {video_path}")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        try:
            results = model(frame)
            detections = results[0].boxes

            for box in detections:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                face_img = frame[y1:y2, x1:x2]
                face_id = face_id_counter  # Assign the current face_id

                # Increment face_id_counter for the next face
                face_id_counter += 1

                if face_id not in face_tracker or time.time() - last_detection_time.get(face_id, 0) > 1:
                    face_path = save_face_image(face_img, face_id)
                    is_engaged = detect_engagement(face_img)

                    face_data[face_id] = {
                        "face_id": face_id,  # Ensure face_id is included
                        "face_path": face_path,
                        "status": "engaged" if is_engaged else "disengaged",
                        "face_coords": [x1, y1, x2, y2],
                    }
                    last_detection_time[face_id] = time.time()

        except Exception as e:
            print(f"Error during frame processing: {e}")
            break

    cap.release()

@app.route('/upload', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file uploaded'}), 400

    video_file = request.files['video']
    video_path = os.path.join(UPLOAD_FOLDER, video_file.filename)

    try:
        video_file.save(video_path)
        process_video(video_path)

        # Update face_data to return only the filenames
        response_face_data = [
            {
                "face_id": face_id,  # Include face_id here
                "face_path": face["face_path"],  # This now contains only the filename
                "status": face["status"],
                "face_coords": face["face_coords"],
            }
            for face_id, face in face_data.items()
        ]

        # Count disengaged faces
        disengaged_faces = [face for face in face_data.values() if face["status"] == "disengaged"]
        if len(disengaged_faces) > 25:
            # Send a notification if more than 25 faces are disengaged
            send_notification(
                "+919848581944",  # Replace with the teacher's phone number
                f"Warning: More than 25 students are disengaged during the class."
            )

        return jsonify({
            'message': 'Video processed successfully.',
            'face_data': response_face_data,
        })
    except Exception as e:
        print(f"Error processing video: {e}")
        return jsonify({'error': 'Failed to process video'}), 500

@app.route('/faces/<filename>')
def get_face(filename):
    # Serve face images from the faces folder
    return send_from_directory(FACES_FOLDER, filename)

@app.route('/student/<student_id>', methods=['GET'])
def get_student_details(student_id):
    # Convert to int if the student_id is a string, handle appropriately
    try:
        student_id = int(student_id)
    except ValueError:
        return jsonify({"error": "Invalid student ID"}), 400
    student = face_data.get(student_id)
    if student:
        return jsonify(student)
    else:
        return jsonify({"error": "Student not found"}), 404


if __name__ == '__main__':
    app.run(debug=True)


# import cv2
# import os
# import time
# from collections import defaultdict
# import numpy as np
# from flask import Flask, request, jsonify, send_from_directory
# from flask_cors import CORS
# from ultralytics import YOLO
# import json
# import subprocess  # To execute Node.js TextFlow script

# app = Flask(__name__)
# CORS(app)

# UPLOAD_FOLDER = 'uploads'
# PROCESSED_FOLDER = 'processed'
# FACES_FOLDER = 'faces'
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# os.makedirs(PROCESSED_FOLDER, exist_ok=True)
# os.makedirs(FACES_FOLDER, exist_ok=True)

# # Load student data from studentdata.json
# def load_student_data():
#     try:
#         with open('studentdata.json') as f:
#             student_data = json.load(f)
#         return {student['id']: student for student in student_data}
#     except Exception as e:
#         print(f"Error loading student data: {e}")
#         return {}

# student_data = load_student_data()  # Load student data once when the app starts

# try:
#     model = YOLO('best.pt')
#     print("Model loaded successfully.")
# except Exception as e:
#     print(f"Error loading YOLO model: {e}")
#     model = None

# face_tracker = {}
# last_detection_time = {}
# face_data = defaultdict(dict)
# next_face_id = 1  # Start from 1 to ensure face IDs begin at 1

# def save_face_image(face_img, face_id):
#     face_filename = f"{face_id}.jpg"
#     face_path = os.path.join(FACES_FOLDER, face_filename)
#     cv2.imwrite(face_path, face_img)
#     return face_filename

# def detect_engagement(face_img):
#     gray = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY)
#     eyes = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml').detectMultiScale(gray)
#     return len(eyes) >= 2

# def detect_smile(face_img):
#     gray = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY)
#     smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')
#     smiles = smile_cascade.detectMultiScale(gray, scaleFactor=1.8, minNeighbors=20)
#     return len(smiles) > 0

# def get_color_code(status):
#     if status == "Fully engaged":
#         return "green"
#     elif status == "Disengaged":
#         return "red"
#     else:
#         return "yellow"

# def send_notification_with_textflow(phone_number, message):
#     """
#     Sends a notification using TextFlow API (via Node.js).
#     :param phone_number: The recipient's phone number
#     :param message: The message content to send
#     """
#     try:
#         # Prepare the Node.js script for TextFlow
#         script = f"""
#         const textflow = require('textflow.js');
#         textflow.useKey("Zact7vrYC9Qd8FYtu6Mok3ynHet8D0xpUIToHDCSCZeWhhluIyVHjRqnA63sQ4Y9");
#         textflow.sendSMS("{phone_number}", "{message}");
#         """

#         # Write the script to a temporary file
#         with open('textflow_temp.js', 'w') as file:
#             file.write(script)

#         # Execute the Node.js script
#         subprocess.run(["node", "textflow_temp.js"], check=True)

#         # Cleanup: remove the temporary script
#         os.remove('textflow_temp.js')

#         print("Notification sent successfully.")
#     except Exception as e:
#         print(f"Error sending notification with TextFlow: {e}")

# def process_video(video_path):
#     global next_face_id

#     if model is None:
#         print("Model not loaded, skipping video processing.")
#         return

#     cap = cv2.VideoCapture(video_path)
#     if not cap.isOpened():
#         print(f"Error: Couldn't open video file {video_path}")
#         return

#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             break

#         try:
#             results = model(frame)
#             detections = results[0].boxes

#             for box in detections:
#                 x1, y1, x2, y2 = map(int, box.xyxy[0])
#                 face_img = frame[y1:y2, x1:x2]
#                 face_id = next_face_id

#                 next_face_id += 1

#                 if face_id not in face_tracker or time.time() - last_detection_time.get(face_id, 0) > 1:
#                     face_path = save_face_image(face_img, face_id)
#                     is_engaged = detect_engagement(face_img)
#                     is_smiling = detect_smile(face_img)

#                     engagement_status = "Fully engaged" if is_engaged else "Disengaged"
#                     facial_expression = "Smiling" if is_smiling else "Neutral"
#                     focus_score = 90 if engagement_status == "Fully engaged" else 50
#                     historical_engagement = "High" if engagement_status == "Fully engaged" else "Low"

#                     student_details = student_data.get(face_id, {"name": "Unknown", "other_details": "N/A"})

#                     face_data[face_id] = {
#                         "face_path": face_path,
#                         "status": engagement_status,
#                         "color_code": get_color_code(engagement_status),
#                         "focus_score": f"{focus_score}%",
#                         "facial_expression": facial_expression,
#                         "historical_engagement": historical_engagement,
#                         "face_coords": [x1, y1, x2, y2],
#                         "student_name": student_details.get("name"),
#                         "other_details": student_details.get("other_details"),
#                     }
#                     last_detection_time[face_id] = time.time()

#         except Exception as e:
#             print(f"Error during frame processing: {e}")
#             break

#     cap.release()

# @app.route('/upload', methods=['POST'])
# def upload_video():
#     if 'video' not in request.files:
#         return jsonify({'error': 'No video file uploaded'}), 400

#     video_file = request.files['video']
#     video_path = os.path.join(UPLOAD_FOLDER, video_file.filename)

#     try:
#         video_file.save(video_path)
#         process_video(video_path)

#         response_face_data = [
#             {
#                 "face_id": face_id,
#                 "face_path": face["face_path"],
#                 "status": face["status"],
#                 "color_code": face["color_code"],
#                 "focus_score": face["focus_score"],
#                 "facial_expression": face["facial_expression"],
#                 "historical_engagement": face["historical_engagement"],
#                 "face_coords": face["face_coords"],
#                 "student_name": face["student_name"],
#                 "other_details": face["other_details"],
#             }
#             for face_id, face in face_data.items()
#         ]

#         disengaged_faces = [face for face in face_data.values() if face["status"] == "Disengaged"]
#         if len(disengaged_faces) > 25:
#             send_notification_with_textflow(
#                 "+919398308393",  # Replace dynamically as needed
#                 f"Warning: {len(disengaged_faces)} students are disengaged during the class."
#             )

#         return jsonify({
#             'message': 'Video processed successfully.',
#             'face_data': response_face_data,
#         })
#     except Exception as e:
#         print(f"Error processing video: {e}")
#         return jsonify({'error': 'Failed to process video'}), 500

# @app.route('/faces/<filename>')
# def get_face(filename):
#     return send_from_directory(FACES_FOLDER, filename)

# @app.route('/student/<int:student_id>', methods=['GET'])
# def get_student_details(student_id):
#     student = face_data.get(student_id)
#     if student:
#         return jsonify(student)
#     else:
#         return jsonify({"error": "Student not found"}), 404

# if __name__ == '__main__':
#     app.run(debug=True)

