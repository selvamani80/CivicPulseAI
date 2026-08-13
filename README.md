# CivicPulse AI
> **"Predicting Community Problems Before They Become Emergencies"**

CivicPulse AI is a complete production-quality web application and AI-powered predictive civic intelligence platform built for Tamil Nadu and Indian cities, towns, and villages.

Existing civic systems only allow citizens to log complaints after a crisis occurs. **CivicPulse AI** shifts the paradigm from reactive ticket management to **proactive early-warning prediction and community problem prevention**.

---

## 🚀 Key Differentiators & Cycle

**DETECT → UNDERSTAND → CLUSTER → PREDICT → PRIORITIZE → PREVENT → LEARN**

- **Multilingual Signal Detection:** Captures Tamil, Tanglish ("Road la water/thanni nikkuthu"), and English voice/text/photo inputs.
- **Computer Vision Quality Check:** Inspects image uploads for blur, darkness, and civic feature extraction (potholes, water stagnation, waste piles).
- **Geospatial Proximity Clustering:** Uses DBSCAN spatial clustering (300m radius) to group 50 citizen reports into 1 actionable problem cluster.
- **Predictive Risk & Anomaly Engine:** Forecasts waterlogging, drainage blockages, and road damage **3.8 hours before** official flood thresholds are reached.
- **Explainable AI (SHAP):** Provides field officers with exact contributing factors (e.g., Heavy Rainfall ↑, 5 Nearby Reports, Low Elevation Basin).
- **Human-in-the-Loop Feedback Engine:** Officer confirmations feed ground-truth outcomes directly back to train the ML system.

---

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Leaflet / React-Leaflet, Recharts, Lucide Icons, Motion.
- **Backend:** Node.js Express full-stack architecture running custom TypeScript server on port 3000.
- **AI / ML Services:** Server-side Gemini 3.6 Flash (`@google/genai`) for multilingual NLP, Tanglish parsing, computer vision quality checking, and RAG situation summary generation; XGBoost & Z-Score Anomaly detection engine.
- **Database & Spatial:** PostGIS geometry schema representation, Haversine spatial indexing, in-memory state engine.

---

## 💻 Running the Application

### Local Development Mode
```bash
# Start the Express + Vite server on port 3000
npm run dev
```

### Production Build & Launch
```bash
# Bundle frontend and compile backend CommonJS entry point
npm run build

# Start production server
npm run start
```

---

## 📑 System Documentation

Detailed technical manuals can be viewed inside the web app under **System Docs** or in the `/docs` directory:
- `docs/architecture.md` - Full system architecture & signal pipeline.
- `docs/database.md` - PostgreSQL + PostGIS schema & spatial indexes.
- `docs/api.md` - Complete REST API specification.
- `docs/ai-pipeline.md` - Multilingual NLP & Computer Vision details.
- `docs/ml-models.md` - XGBoost risk engine, SHAP factors, and MLOps metrics.
- `docs/deployment.md` - Docker and Cloud Run deployment instructions.
- `docs/security.md` - RBAC and cybersecurity protocols.
- `docs/privacy.md` - Data privacy, anonymization, and ethical AI standards.
- `docs/testing.md` - Test suites and validation workflows.
- `docs/demo.md` - Step-by-step pilot & college demonstration scenarios.
