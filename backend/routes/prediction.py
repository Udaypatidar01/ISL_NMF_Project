from flask import Blueprint, jsonify, request
import numpy as np
import os
import joblib
import sys

# Add utils to path for word mapping import
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from utils.word_mapping import LABEL_TO_WORDS, COMMON_SENTENCES

prediction_bp = Blueprint('prediction', __name__)

# Load trained model from the backend package path
model_path = os.path.join(os.path.dirname(__file__), '..', 'model', 'isl_model.pkl')
model_path = os.path.normpath(model_path)
model = joblib.load(model_path)

# Labels for the trained hand landmark alphabet model
labels = [chr(ord("A") + i) for i in range(26)]

# Word mapping
WORD_MAPPING = {
    "A": ["apple", "about"],
    "B": ["bird", "ball"],
    "C": ["cat", "car"],
    "D": ["dog", "day"],
    "E": ["elephant", "eye"],
    "F": ["friend", "flower"],
    "G": ["good", "girl"],
    "H": ["hello", "happy"],
    "I": ["ice", "idea"],
    "J": ["jump", "joy"],
    "K": ["king", "kind"],
    "L": ["love", "light"],
    "M": ["mother", "moon"],
    "N": ["no", "night"],
    "O": ["orange", "open"],
    "P": ["please", "person"],
    "Q": ["queen", "quick"],
    "R": ["run", "rain"],
    "S": ["sorry", "sun"],
    "T": ["thank you", "tree"],
    "U": ["understand", "up"],
    "V": ["very", "visit"],
    "W": ["water", "well"],
    "X": ["xray"],
    "Y": ["yes", "you"],
    "Z": ["zero", "zoo"],
}

def build_input_vector(landmarks, handedness=None):
    if not isinstance(landmarks, list) or len(landmarks) != 63:
        raise ValueError("Expected 63 landmark values for one hand")

    handedness_label = (handedness or "Right").strip().lower()
    uses_two_hands = 0
    left_hand = [0.0] * 63
    right_hand = [0.0] * 63

    if handedness_label == "left":
        left_hand = landmarks
    else:
        right_hand = landmarks

    return [uses_two_hands] + left_hand + right_hand


@prediction_bp.route('/predict', methods=['POST'])
def predict():
    payload = request.get_json(silent=True)
    if not payload:
        return jsonify({
            "success": False,
            "error": "Invalid JSON payload"
        }), 400

    features = payload.get('features')
    if isinstance(features, list) and len(features) == 127:
        input_vector = features
    else:
        landmarks = payload.get('landmarks')
        handedness = payload.get('handedness')
        if isinstance(landmarks, list) and len(landmarks) == 63:
            try:
                input_vector = build_input_vector(landmarks, handedness)
            except ValueError as ve:
                return jsonify({
                    "success": False,
                    "error": str(ve)
                }), 400
        else:
            return jsonify({
                "success": False,
                "error": "Expected 127 feature values or 63 hand landmark values"
            }), 400

    try:
        data = np.array(input_vector, dtype=np.float32).reshape(1, -1)
        prediction = model.predict(data)
        raw_prediction = prediction[0]
        mapped_prediction = raw_prediction
        if isinstance(raw_prediction, (int, np.integer)) and 0 <= int(raw_prediction) < len(labels):
            mapped_prediction = labels[int(raw_prediction)]

        top_predictions = []
        if hasattr(model, 'predict_proba'):
            probabilities = model.predict_proba(data)[0]
            sorted_indices = np.argsort(-probabilities)
            for idx in sorted_indices[:3]:
                if 0 <= int(idx) < len(labels):
                    top_predictions.append({
                        "label": labels[int(idx)],
                        "probability": float(round(float(probabilities[int(idx)]), 4))
                    })

        return jsonify({
            "success": True,
            "prediction": mapped_prediction,
            "top_predictions": top_predictions
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Prediction failed",
            "message": str(e)
        }), 500


@prediction_bp.route('/predict-word', methods=['POST'])
def predict_word():
    """Direct word prediction from hand gestures."""
    payload = request.get_json(silent=True)
    if not payload:
        return jsonify({
            "success": False,
            "error": "Invalid JSON payload"
        }), 400

    features = payload.get('features')
    if isinstance(features, list) and len(features) == 127:
        input_vector = features
    else:
        landmarks = payload.get('landmarks')
        handedness = payload.get('handedness')
        if isinstance(landmarks, list) and len(landmarks) == 63:
            try:
                input_vector = build_input_vector(landmarks, handedness)
            except ValueError as ve:
                return jsonify({
                    "success": False,
                    "error": str(ve)
                }), 400
        else:
            return jsonify({
                "success": False,
                "error": "Expected 127 feature values or 63 hand landmark values"
            }), 400

    try:
        data = np.array(input_vector, dtype=np.float32).reshape(1, -1)
        prediction = model.predict(data)
        raw_prediction = prediction[0]
        
        # Map letter to word
        if isinstance(raw_prediction, (int, np.integer)) and 0 <= int(raw_prediction) < len(labels):
            letter = labels[int(raw_prediction)]
            words = WORD_MAPPING.get(letter, [letter.lower()])
        else:
            words = ["unknown"]

        # Get top word predictions based on probabilities
        top_words = []
        if hasattr(model, 'predict_proba'):
            probabilities = model.predict_proba(data)[0]
            sorted_indices = np.argsort(-probabilities)
            
            for idx in sorted_indices[:5]:
                if 0 <= int(idx) < len(labels):
                    letter = labels[int(idx)]
                    letter_words = WORD_MAPPING.get(letter, [letter.lower()])
                    for word in letter_words:
                        if len(top_words) < 5:
                            top_words.append({
                                "word": word,
                                "letter": letter,
                                "confidence": float(round(float(probabilities[int(idx)]), 4))
                            })

        return jsonify({
            "success": True,
            "predicted_word": words[0] if words else "unknown",
            "word_suggestions": words,
            "top_words": top_words
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Word prediction failed",
            "message": str(e)
        }), 500


@prediction_bp.route('/predict-sentence', methods=['POST'])
def predict_sentence():
    """Predict complete sentences from hand gestures."""
    payload = request.get_json(silent=True)
    if not payload:
        return jsonify({
            "success": False,
            "error": "Invalid JSON payload"
        }), 400

    features = payload.get('features')
    if isinstance(features, list) and len(features) == 127:
        input_vector = features
    else:
        landmarks = payload.get('landmarks')
        handedness = payload.get('handedness')
        if isinstance(landmarks, list) and len(landmarks) == 63:
            try:
                input_vector = build_input_vector(landmarks, handedness)
            except ValueError as ve:
                return jsonify({
                    "success": False,
                    "error": str(ve)
                }), 400
        else:
            return jsonify({
                "success": False,
                "error": "Expected 127 feature values or 63 hand landmark values"
            }), 400

    try:
        data = np.array(input_vector, dtype=np.float32).reshape(1, -1)
        prediction = model.predict(data)
        raw_prediction = prediction[0]
        
        # Map to sentences
        if isinstance(raw_prediction, (int, np.integer)) and 0 <= int(raw_prediction) < len(labels):
            letter = labels[int(raw_prediction)]
            words = WORD_MAPPING.get(letter, [letter.lower()])
        else:
            words = ["hello"]

        # Build sentences from common phrases and predicted words
        sentence_suggestions = []
        for word in words[:3]:
            # Find sentences containing this word
            for sentence in COMMON_SENTENCES:
                if word.lower() in sentence.lower() and len(sentence_suggestions) < 5:
                    sentence_suggestions.append(sentence)

        # If no matches, add default sentences
        if not sentence_suggestions:
            sentence_suggestions = COMMON_SENTENCES[:5]

        return jsonify({
            "success": True,
            "predicted_word": words[0] if words else "unknown",
            "sentence_suggestions": sentence_suggestions
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Sentence prediction failed",
            "message": str(e)
        }), 500