print("Starting backend server...")
from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import joblib

app = Flask(__name__)

# Load model and scaler
model = tf.keras.models.load_model("predictive_maintenance_model.keras")
scaler = joblib.load("scaler.pkl")
print("Model and scaler loaded successfully.")


@app.route("/predict", methods=["POST"])
def predict():

    # Get feature data coming from fetched request 
    data = request.get_json()

    features = np.array(data['newDataArray']).reshape(1, -1)
    print(f"Input shape: {features.shape}")

    # scale data
    features_scaled = scaler.transform(features)

    print("Predicting...")
    prediction = model.predict(features_scaled)
    print(f"Raw prediction: {prediction}")

    # prediction is a list of 4 arrays (cooler, valve, pump, accumulator)
    predicted_classes = [int(np.argmax(pred)) for pred in prediction]

    return jsonify({
        "coolerCondition": 3 if predicted_classes[0] == 0 else 20 if predicted_classes[0] == 1 else 100,
        "valveCondition": 73 if predicted_classes[1] == 0 else 80 if predicted_classes[1] == 1 else 90 if predicted_classes[1] == 2 else 100,
        "pumpLeakage": predicted_classes[2],
        "accumulatorPressure": 90 if predicted_classes[3] == 0 else 100 if predicted_classes[3] == 1 else 115 if predicted_classes[3] == 2 else 130,
    })


if __name__ == "__main__":
    app.run(debug=True)     