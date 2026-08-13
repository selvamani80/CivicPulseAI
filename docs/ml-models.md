# Machine Learning Models & MLOps Architecture

## XGBoost Risk & Anomaly Forecasting Model
- **Model Version:** `v1.3.0-xgboost-spatial`
- **Features Used:**
  - Rainfall Intensity (mm/hr)
  - 1-hour & 3-hour Citizen Report Densities
  - Ground Elevation & Basin Slope Index
  - Historical Inundation Hotspot Score
  - Drainage Sluice Gate Clogging Coefficient
- **Performance:**
  - Precision: 91.4%
  - Recall: 88.2%
  - F1 Score: 0.898
  - ROC-AUC: 0.941
  - Average Early Warning Lead Time: 3.8 Hours

## Explainable AI (SHAP)
Provides feature attribution scores explaining why a specific location was assigned high risk.
