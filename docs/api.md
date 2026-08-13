# REST API Documentation

## Signal Management API

### `POST /api/v1/reports`
Submits a new citizen signal report.
**Request Payload:**
```json
{
  "description": "Velachery 100ft road la water standing",
  "category": "waterlogging",
  "severity": "high",
  "location": {
    "latitude": 12.9782,
    "longitude": 80.2206,
    "ward": "Ward 172",
    "areaName": "Velachery 100ft Road",
    "district": "Chennai"
  },
  "isAnonymous": false
}
```

### `GET /api/v1/predictions`
Fetches active risk predictions with SHAP contributing factors.

### `POST /api/v1/predictions/forecast`
Triggers real-time ML forecast execution.

### `POST /api/v1/ai/analyze-text`
Parses Tamil, Tanglish, or English text into structured JSON via server-side Gemini AI.

### `POST /api/v1/ai/analyze-image`
Runs computer vision quality check and feature extraction on base64 photos.

### `POST /api/v1/feedback`
Records ground-truth outcome ('prevented', 'occurred', 'false_positive') for MLOps retraining.
