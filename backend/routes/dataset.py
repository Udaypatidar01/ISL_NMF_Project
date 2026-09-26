from flask import Blueprint, request, jsonify
import os
import json

dataset_bp = Blueprint("dataset", __name__)

@dataset_bp.route("/save_landmarks", methods=["POST"])
def save_landmarks():

    data = request.json

    gesture = data.get("gesture")
    landmarks = data.get("landmarks")

    folder = f"datasets/hands/{gesture}"

    os.makedirs(folder, exist_ok=True)

    count = len(os.listdir(folder))

    filename = f"{folder}/sample_{count}.json"

    with open(filename, "w") as f:
        json.dump(landmarks, f)

    return jsonify({
        "message": "Sample Saved",
        "file": filename
    })