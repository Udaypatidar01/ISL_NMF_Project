import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier

# Load CSV
data = pd.read_csv("../datasets/hands/Indian Sign Language Gesture Landmarks.csv")

print("Dataset Loaded!")

# Features
X = data.iloc[:, 1:]

# Labels
y = data.iloc[:, 0]

print("Training Model...")

# Train
model = RandomForestClassifier(n_estimators=100)

model.fit(X, y)

print("Training Complete!")

# Save model
joblib.dump(model, "../model/isl_model.pkl")

print("Model Saved!")