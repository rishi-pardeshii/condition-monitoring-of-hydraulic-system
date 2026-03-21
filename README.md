# 🔧 Hydraulic System Condition Monitoring

A multi-output deep learning system that predicts the health condition of a hydraulic test rig in real time. Sensor data from 17 channels is fed through a shared neural network backbone that simultaneously classifies the state of four hydraulic components — cooler, valve, pump, and accumulator. A Flask REST API serves predictions to external dashboards or monitoring tools.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Dataset](#dataset)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
  - [Training the Model](#training-the-model)
  - [Running the Backend Server](#running-the-backend-server)
  - [Making Predictions](#making-predictions)
- [Model Architecture](#model-architecture)
- [Target Variables](#target-variables)
- [Data Preprocessing](#data-preprocessing)
- [API Reference](#api-reference)
- [Saved Artifacts](#saved-artifacts)
- [Dependencies](#dependencies)

---

## Overview

Industrial hydraulic systems degrade gradually, and early fault detection can prevent costly downtime. This project trains a neural network on cyclic sensor readings from a hydraulic test rig and predicts the current condition of four subsystems in a single forward pass.

Key design decisions:

- **Multi-output architecture** — one shared backbone, four softmax heads. All four subsystems are diagnosed simultaneously, keeping inference fast and consistent.
- **StandardScaler preprocessing** — sensor readings span very different physical ranges (pressure in bar, temperature in °C, vibration in arbitrary units). Z-score normalization puts them on equal footing for gradient-based optimization.
- **Serialized scaler** — the fitted `StandardScaler` is saved alongside the model so that new data arriving at the API is transformed with identical statistics, preventing train/serve skew.
- **Flask REST API** — decouples the model from any frontend; any dashboard or alerting system can POST raw sensor readings and receive structured condition codes.

---

## Dataset

The dataset (`Final.csv`) is derived from the **ZeMA Hydraulic System Dataset** published by ZeMA gGmbH. It contains readings from 17 sensors collected during cyclic load operations on a hydraulic test rig. Each row represents one 60-second load cycle with aggregated sensor values and condition labels.

| Property | Detail |
|---|---|
| Samples | 2,205 load cycles |
| Feature columns | 17 sensor channels |
| Target columns | 4 (cooler, valve, pump, accumulator) |
| Sensor types | Pressure, temperature, vibration, motor power, volume flow, virtual cooling |
| Sampling rates | 1 Hz, 10 Hz, 100 Hz (aggregated per cycle) |

> **Note:** `Stable_Flag` is present in the raw data but is dropped before training. It is a metadata indicator, not a sensor reading, and including it would cause information leakage.

---

## Project Structure

```
.
├── main.ipynb                          # Full EDA, preprocessing, training, and evaluation notebook
├── text_to_csv.ipynb                   # Converts raw text dataset into csv format
├── backend.py                          # Flask API serving real-time predictions
├── Final.csv                           # Preprocessed dataset (ZeMA hydraulic system)
├── predictive_maintenance_model.keras  # Trained Keras model (generated after training)
├── scaler.pkl                          # Fitted StandardScaler (generated after training)
├── ui                                  # Folder contains frontend code(Dashboard)
├── archive                             # Folder contains raw dataset in text format
└── README.md
```

---

## Installation

**Prerequisites:** Python 3.8+

1. Clone the repository:

```bash
git clone https://github.com/your-username/hydraulic-condition-monitoring.git
cd hydraulic-condition-monitoring
```

2. Install dependencies:

```bash
pip install tensorflow scikit-learn pandas numpy flask joblib matplotlib seaborn
```

#### To see full fledged working of project with dashboar follow these steps.
1. Clone the repository:

```bash
git clone https://github.com/your-username/hydraulic-condition-monitoring.git
cd hydraulic-condition-monitoring
```

2. Install dependencies:

```bash
pip install tensorflow flask pandas numpy flask joblib
```

3. Run Backend Server:

```bash
python backend.py
```

4. Run Frontend Server:

```bash
cd ui && npm install && npm run dev
```

5. Head to  http://localhost:3000

---

## Usage

### Training the Model

Open and run `main.ipynb` from top to bottom. The notebook will:

1. Load and explore `Final.csv`
2. Visualize class distributions and feature correlations
3. Drop `Stable_Flag` and apply `StandardScaler` to sensor columns
4. Encode the four target variables with `OrdinalEncoder`
5. Split data 80/20 into train and test sets
6. Build and train the multi-output neural network for 200 epochs
7. Evaluate per-head accuracy on the test set
8. Save `predictive_maintenance_model.keras` and `scaler.pkl`

Both saved files are required before running the backend server.

### Running the Backend Server

```bash
python backend.py
```

The server starts on `http://127.0.0.1:5000` with debug mode enabled. You should see:

```
Starting backend server...
Model and scaler loaded successfully.
```

### Making Predictions

Send a POST request to `/predict` with a JSON body containing a flat array of the 17 scaled sensor feature values:

```bash
curl -X POST http://127.0.0.1:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"newDataArray": [0.12, -0.45, 1.02, 0.78, -0.33, 0.91, 0.04, -1.21, 0.56, 0.23, -0.67, 1.45, 0.33, -0.89, 0.61, 0.07, -0.14]}'
```

**Example response:**

```json
{
  "coolerCondition": 100,
  "valveCondition": 100,
  "pumpLeakage": 0,
  "accumulatorPressure": 130
}
```

> The values in `newDataArray` must already be scaled using the same `StandardScaler` statistics. If you are sending raw sensor readings, scale them client-side using the exported `scaler.pkl`, or extend the API to accept raw values and scale them server-side.

---

## Model Architecture

The model uses a shared encoder backbone that branches into four independent classification heads.

![layer flowchart diagram](https://github.com/user-attachments/assets/1c325245-440c-49e9-892c-1d9060e6e5dc)

| Hyperparameter | Value |
|---|---|
| Optimizer | Adam |
| Loss | Sparse Categorical Cross-Entropy (per head) |
| Epochs | 200 |
| Train/test split | 80% / 20% |
| Random state | 42 |

---

## Target Variables

Each output head predicts a different subsystem condition. The API maps integer class indices back to the original engineering values used to label the dataset:

### Cooler Condition (`coolerCondition`)

| Class | API value | Meaning |
|---|---|---|
| 0 | `3` | Close to total failure |
| 1 | `20` | Reduced efficiency |
| 2 | `100` | Full efficiency |

### Valve Condition (`valveCondition`)

| Class | API value | Meaning |
|---|---|---|
| 0 | `73` | Severe lag |
| 1 | `80` | Moderate lag |
| 2 | `90` | Small lag |
| 3 | `100` | Optimal switching |

### Internal Pump Leakage (`pumpLeakage`)

| Class | API value | Meaning |
|---|---|---|
| 0 | `0` | No leakage |
| 1 | `1` | Weak leakage |
| 2 | `2` | Severe leakage |

### Hydraulic Accumulator Pressure (`accumulatorPressure`)

| Class | API value | Meaning |
|---|---|---|
| 0 | `90` | Severely reduced pressure |
| 1 | `100` | Slightly reduced pressure |
| 2 | `115` | Near optimal pressure |
| 3 | `130` | Optimal pressure |

---

## Data Preprocessing

Two transformations are applied before training, and both must be replicated at inference time:

**1. StandardScaler (sensor features only)**

Applied to all 17 sensor columns. Targets are excluded. The formula is:

```
x_scaled = (x − μ) / σ
```

The fitted scaler is saved to `scaler.pkl` and loaded by the backend to transform incoming API requests.

**2. OrdinalEncoder (target columns)**

Applied to the four condition label columns, converting string categories to integer codes (0, 1, 2, …). This is required for `sparse_categorical_crossentropy` loss.

**Features used for training (17 columns):**

All columns in `Final.csv` except `Cooler_Condition`, `Valve_Condition`, `Internal_Pump_Leakage`, `Hydraulic_Accumulator`, and `Stable_Flag`.

---

## API Reference

### `POST /predict`

Accepts a single load cycle's sensor readings and returns condition codes for all four subsystems.

**Request body:**

```json
{
  "newDataArray": [float, float, ..., float]
}
```

The array must contain exactly 17 values corresponding to the 17 sensor feature columns in the order they appear in `Final.csv` (after dropping the target and flag columns), and must be pre-scaled using `scaler.pkl`.

**Response body:**

```json
{
  "coolerCondition": int,
  "valveCondition": int,
  "pumpLeakage": int,
  "accumulatorPressure": int
}
```

Return values are the original engineering labels (see [Target Variables](#target-variables)), not raw class indices.

**Status codes:**

| Code | Meaning |
|---|---|
| `200` | Prediction successful |
| `400` | Malformed JSON or missing `newDataArray` key |
| `500` | Internal server error (model or scaler not loaded) |

---

## Saved Artifacts

| File | Description |
|---|---|
| `predictive_maintenance_model.keras` | Trained multi-output Keras model. Generated by the last cell of `main.ipynb`. |
| `scaler.pkl` | Fitted `StandardScaler` serialized with `joblib`. Must be used to scale any new input before inference. |

Both files are produced by running `main.ipynb` to completion and are required for the backend server to start.

---

## Dependencies

| Package | Purpose |
|---|---|
| `tensorflow` | Neural network training and inference |
| `scikit-learn` | `StandardScaler`, `OrdinalEncoder`, `train_test_split` |
| `pandas` | Data loading and manipulation |
| `numpy` | Numerical operations |
| `flask` | REST API server |
| `joblib` | Scaler serialization |
| `matplotlib` | Plotting |
| `seaborn` | Statistical visualizations |
