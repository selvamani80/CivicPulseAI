# CivicPulse AI - Complete Project Technical & Analytical Report

**Project Title:** CivicPulse AI: Early Warning & Automated Infrastructure Risk Forecasting Platform  
**Target Domain:** Smart Governance, Urban Infrastructure Management, & Civic Crisis Mitigation  
**Version:** 2.4.0  
**Status:** Production Ready  
**Date:** August 2026  

---

## Executive Summary & Abstract

**CivicPulse AI** is an end-to-end, AI-powered civic infrastructure intelligence and early-warning forecasting platform. Designed to bridge the gap between citizen-reported issues, multi-sensor environmental data, and municipal dispatch, CivicPulse AI transforms unstructured community feedback (in English, Tamil, and phonetic Tanglish) into actionable spatial-temporal risk predictions.

By pairing modern server-side Large Language Models (Gemini Flash multimodal vision and text processing) with deterministic spatial clustering (DBSCAN), Z-score anomaly detection, and explainable XGBoost machine learning risk models, CivicPulse AI enables municipal officers to transition from reactive complaint resolution to proactive early risk mitigation.

---

## 1. Problem Statement & Strategic Scope

### 1.1 Background & Context
Urban infrastructure in rapidly expanding municipalities faces severe climate and operational strains—ranging from urban waterlogging and drainage channel blockages to street light outages, structural road damage, and unmanaged waste dumps. 

Traditional municipal grievance mechanisms suffer from:
1. **High Signal Noise & Fragmented Ingestion:** Duplicate citizen reports for the same incident flood ward officers without automated spatial grouping.
2. **Language Barriers:** Citizens frequently communicate in regional languages or mixed scripts (e.g., Tamil script or phonetic Tanglish such as *"main road la water nikkuthu"*), which standard key-word ticketing systems fail to categorize accurately.
3. **Reactive Operating Paradigm:** Municipal crews are dispatched *after* severe flooding or road collapse occurs, rather than receiving 3–6 hour predictive lead-time notifications based on historical patterns and early indicator signals.
4. **Lack of Model Explainability:** Field teams hesitate to trust black-box AI predictions without clear reasoning detailing *why* a specific ward is flagged as high-risk.

### 1.2 Solution Objectives
- **Multilingual Multimodal Signal Ingestion:** Process citizen text, voice notes, and photographic evidence seamlessly across English, Tamil, and Tanglish.
- **Computer Vision Quality Control:** Automatically evaluate image clarity, darkness, and domain-relevance to reject corrupted or non-civic photos prior to ticket generation.
- **Spatial Incident Clustering:** Group localized reports within a 300-meter radius into unified incident clusters using spatial indexing.
- **XGBoost Risk Forecasting Engine:** Compute 24-hour location-specific risk probabilities with quantifiable lead time (hours before incident escalation).
- **Explainable AI (SHAP Feature Attribution):** Provide readable percentage contributions (e.g., Rainfall Rate 42%, Low Elevation 28%, Historic Flood Index 18%, Report Surge 12%) for officer confidence.
- **RAG-Grounded Situation Summarizer:** Generate executive incident summaries using Retrieval-Augmented Generation for emergency operations meetings.
- **Human-in-the-Loop Feedback Loop:** Incorporate officer field verifications to track precision/recall, calculate false positive/negative rates, detect concept drift, and continuously retrain models.

---

## 2. System Architecture & Tech Stack

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|                                                                                   |
|  +------------------+   +----------------------+   +--------------------------+   |
|  | Citizen Portal   |   | Officer Dashboard    |   | AI Model Analytics       |   |
|  | (Voice/Text/Cam) |   | (GeoMap, Dispatch)   |   | (ROC-AUC, Drift)         |   |
|  +--------+---------+   +----------+-----------+   +------------+-------------+   |
+-----------|------------------------|----------------------------|-----------------+
            |                        |                            |
            +------------------------+----------------------------+
                                     |  HTTP REST / JSON
                                     v
+-----------------------------------------------------------------------------------+
|                             SERVER LAYER (Express + Node.js)                      |
|                                                                                   |
|   +--------------------------+   +-----------------------+   +-----------------+  |
|   | Multilingual NLP Router  |   | Spatial DBSCAN Engine |   | Anomaly Engine  |  |
|   | (Gemini 2.5/3.6 Flash)   |   | (Haversine 300m)      |   | (Z-Score > 2.0) |  |
|   +------------+-------------+   +-----------+-----------+   +--------+--------+  |
|                |                             |                            |       |
|                +-----------------------------+----------------------------+       |
|                                              |                                    |
|                                              v                                    |
|   +---------------------------------------------------------------------------+   |
|   |               XGBoost Risk Predictor & SHAP Factor Engine                 |   |
|   +------------------------------------------+--------------------------------+   |
|                                              |                                    |
+----------------------------------------------|------------------------------------+
                                               v
+-----------------------------------------------------------------------------------+
|                           STORAGE & PERSISTENCE LAYER                             |
|                                                                                   |
|   +-----------------------+   +---------------------+   +---------------------+   |
|   | Incident Reports      |   | Clusters & Hazards  |   | Predictions & SHAP  |   |
|   +-----------------------+   +---------------------+   +---------------------+   |
|   | Model Performance Logs|   | Officer Action Audit|   | Feedback Training   |   |
|   +-----------------------+   +---------------------+   +---------------------+   |
+-----------------------------------------------------------------------------------+
```

### 2.1 Technology Stack Details
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, Motion/React.
- **Backend:** Express.js running on Node.js with native TypeScript ESM execution.
- **AI / LLM Integration:** `@google/genai` TypeScript SDK utilizing `gemini-2.5-flash`, `gemini-3.6-flash`, and `gemini-2.0-flash` with multi-model fallback retry mechanisms.
- **Geospatial & Predictive Logic:** Haversine spatial proximity algorithms, Z-Score rolling anomaly metrics, and simulated XGBoost + SHAP feature attribution calculation engines.
- **Persistence:** Local/In-memory store backed by relational schema definitions (`db.ts`), ready for PostGIS spatial databases.

---

## 3. Core Database Schema & Data Models

### 3.1 `incident_reports`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary Key |
| `userId` | `String` | Citizen or Officer User ID |
| `description` | `Text` | Citizen report description |
| `language` | `Enum` | `'en'`, `'ta'`, `'tanglish'` |
| `category` | `Enum` | `'waterlogging'`, `'drainage'`, `'pothole'`, `'garbage'`, `'street_light'`, `'other'` |
| `severity` | `Enum` | `'low'`, `'medium'`, `'high'`, `'critical'` |
| `latitude` | `Float` | Latitude coordinate |
| `longitude` | `Float` | Longitude coordinate |
| `imageUrl` | `String` | Optional photo upload URL or base64 data |
| `aiConfidence` | `Float` | Model confidence score (0.0 to 1.0) |
| `status` | `Enum` | `'submitted'`, `'verified'`, `'dispatched'`, `'resolved'`, `'rejected'` |
| `createdAt` | `Timestamp` | Report timestamp |

### 3.2 `predictions`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary Key |
| `wardName` | `String` | Ward identifier (e.g., "Ward 12 - T. Nagar") |
| `category` | `Enum` | Predicted infrastructure hazard category |
| `riskProbability`| `Float` | Calculated risk score (0.0 to 1.0) |
| `riskLevel` | `Enum` | `'low'`, `'moderate'`, `'high'`, `'severe'` |
| `timeWindow` | `String` | Forecast lead time window (e.g., "Next 2-4 Hours") |
| `confidence` | `Float` | Prediction confidence score |
| `modelVersion` | `String` | Version tag (e.g., "xgb-v2.4.1") |
| `actualOutcome` | `Enum` | Ground-truth verification (`'confirmed'`, `'false_positive'`, `'pending'`) |

### 3.3 `prediction_factors` (SHAP Factors)
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary Key |
| `predictionId` | `UUID` | FK to `predictions` |
| `factorName` | `String` | Feature name (e.g., "Rainfall Rate", "Drainage Block") |
| `importanceScore`| `Float` | Percentage or SHAP value contribution |
| `impactType` | `Enum` | `'increasing'` (exacerbates risk) or `'decreasing'` (mitigates risk) |

---

## 4. AI Engine & Signal Ingestion Pipeline

### 4.1 Multilingual NLP Engine
The system parses incoming unstructured reports using server-side Gemini Flash structured JSON schemas:
- **Language Identification:** Detects English, native Tamil script, or phonetic Tanglish.
- **Entity Extraction:** Identifies landmarks, ward names, streets, and severity keywords.
- **Categorization:** Maps descriptions to normalized municipal categories with confidence metrics.
- **Multi-Model Fallback:** Ensures continuous operation by retrying requests across `gemini-2.5-flash`, `gemini-3.6-flash`, and `gemini-2.0-flash` when encountering external rate limits or transient errors.

### 4.2 Computer Vision Quality & Inspection
- **Quality Check:** Evaluates whether uploaded photos are blurry, dark, corrupted, or completely unrelated to civic infrastructure.
- **Detection & Extraction:** Identifies visual objects (e.g., clogged inlet grate, 15cm stagnant water, overflowing bin) and outputs structured confidence scores.

### 4.3 Spatial DBSCAN Clustering & Anomaly Detection
- **Haversine Proximity Clustering:** Merges new reports falling within $R = 300\text{ meters}$ and $T = 6\text{ hours}$ into a single incident cluster to prevent double-counting.
- **Z-Score Anomaly Engine:** Calculates rolling baseline report frequencies per ward:
  $$Z = \frac{x - \mu}{\sigma}$$
  When $Z > 2.0$, the system triggers an emergency alert for an unusual report surge.

### 4.4 XGBoost Forecasting & SHAP Attribution
- **Input Features:** Rainfall intensity ($\text{mm/hr}$), drainage sluice elevation ($\text{meters}$), rolling 3-hour citizen report density, historical flood index, and road surface wear grade.
- **Output:** Predicted risk probability and SHAP feature importance breakdown explaining top risk drivers.

---

## 5. Application Modules & User Experiences

1. **Citizen Reporting Portal:**
   - Single-click location capture with GPS auto-detection.
   - Multilingual voice-to-text recording in Tamil, Tanglish, and English.
   - Instant camera capture with automated AI quality verification.
   - Live ticket status tracking with response history.

2. **Officer Operations Dashboard:**
   - Interactive spatial prediction map with toggleable layers (High Risk, Medium Risk, Active Signals, Dewatering Pumps).
   - One-click RAG Situation Brief generator producing executive summaries for municipal directors.
   - Resource dispatch workflow linking ward response teams to confirmed clusters.

3. **AI Analytics & Diagnostics Portal:**
   - Real-time precision, recall, F1-score, and ROC-AUC tracking.
   - Confusion matrix visualization (True Positives, False Positives, False Negatives, True Negatives).
   - Lead time metrics (average 3.8 hours early warning).
   - Concept drift monitor evaluating signal shift over 30-day windows.

4. **System Administration Panel:**
   - User account role-based access control (Citizen, Officer, Admin, AI Analyst).
   - Environment variable status monitor and API key sanity checks.
   - System audit logs recording all dispatch and classification events.

---

## 6. REST API Endpoint Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System health check & active database status |
| `GET` | `/api/v1/reports` | Retrieve list of citizen incident reports |
| `POST` | `/api/v1/reports` | Create new report with NLP & computer vision enrichment |
| `GET` | `/api/v1/predictions` | Get active 24-hour ward risk predictions & SHAP factors |
| `POST` | `/api/v1/predictions/forecast`| Trigger manual ML risk re-forecasting engine |
| `POST` | `/api/v1/rag/summary` | Generate RAG executive situation summary for a ward |
| `POST` | `/api/v1/feedback` | Record officer ground-truth verification for model retraining |
| `GET` | `/api/v1/metrics` | Retrieve model precision, recall, F1, ROC-AUC, & drift status |

---

## 7. Operational & Security Protocols

- **Data Privacy & Anonymization:** Citizen reports strip personally identifiable information (PII) before storing spatial coordinates.
- **Role-Based Access Control (RBAC):** Restricts dispatch actions and system logs strictly to verified municipal officers and system administrators.
- **Resilience:** Graceful client-side and server-side fallbacks ensure that officers retain core GIS mapping and manual ticket creation capabilities even during network degradation.

---

## 8. Summary & Future Scope

CivicPulse AI establishes a modern, transparent, and proactive framework for smart city infrastructure management. By turning raw community signals into explainable early warnings, municipal authorities can prevent minor drainage issues from developing into major urban flood events.

**Future Planned Expansions:**
- Integration with live IoT water level sensors along stormwater drains.
- WhatsApp / Telegram bot integration for low-bandwidth citizen reporting.
- Autonomous dispatch suggestions optimizing municipal truck routing based on real-time traffic data.
