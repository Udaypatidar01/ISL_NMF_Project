import pandas as pd
import joblib
import os
from sklearn.ensemble import RandomForestClassifier
from pathlib import Path
import numpy as np

# Load the main gesture landmarks CSV
data = pd.read_csv("../datasets/hands/Indian Sign Language Gesture Landmarks.csv")

print("Dataset Loaded!")
print("Columns:", data.columns.tolist())
print("Unique labels:", data.iloc[:, 0].unique())
print("Data shape:", data.shape)

# If the CSV already has word-level labels, we can use it directly
# Otherwise, we'll need to map letter sequences to words

# For now, let's filter for specific words if they exist
X = data.iloc[:, 1:]
y = data.iloc[:, 0]

print("\nLabel value counts:")
print(y.value_counts())

# Train a model
print("\nTraining Word Prediction Model...")
word_model = RandomForestClassifier(n_estimators=100, random_state=42)
word_model.fit(X, y)

print("Training Complete!")
print("Model classes:", word_model.classes_)

# Save model
joblib.dump(word_model, "../model/isl_word_model.pkl")
print("Word model saved to: ../model/isl_word_model.pkl")
