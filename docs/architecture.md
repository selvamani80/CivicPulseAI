# System Architecture Specification

CivicPulse AI follows an event-driven, modular full-stack architecture built to ingest weak signals from citizens and environmental sensors, perform spatial-temporal clustering, and generate predictive risk alerts.

```
Citizens (Voice / Text / Image / GPS)
  ↓
AI Data Understanding (Gemini 3.6 Flash / OpenCV)
  ↓
Signal Extraction (Categories, Severity, Location Entities)
  ↓
Geospatial DBSCAN Clustering (PostGIS Proximity)
  ↓
Anomaly Detection (Z-score & Rolling Averages)
  ↓
XGBoost Risk Prediction Engine
  ↓
SHAP Explainable AI Factors
  ↓
Prioritized Officer Intelligence Dashboard
  ↓
Preventive Field Dispatch
  ↓
Human-in-the-Loop ML Feedback Loop
```

## Key Modules
1. **Frontend Application:** React 19 single-page app with mobile-first citizen reporting interface and rich officer command dashboard with Leaflet map layers.
2. **Backend Services:** Express Node server proxying API requests to Gemini AI, running spatial clustering algorithms, and managing risk engine calculations.
3. **Storage & State:** Normalized schema with PostGIS spatial indexing representations for wards in Chennai (Velachery, T. Nagar, Perambur, Royapettah), Madurai, and Coimbatore.
