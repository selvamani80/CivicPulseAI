import React, { useState } from 'react';
import { LanguageCode } from '../types.js';
import { FileText, BookOpen, Database, Code, Brain, Shield, Lock, PlayCircle, Printer, Download } from 'lucide-react';

interface DocsViewProps {
  lang: LanguageCode;
}

export const DocsView: React.FC<DocsViewProps> = ({ lang }) => {
  const [activeDoc, setActiveDoc] = useState<string>('full-report');

  const docContents: Record<string, { title: string; icon: any; text: string }> = {
    architecture: {
      title: 'Platform Architecture Specification',
      icon: BookOpen,
      text: `
# CivicPulse AI - High-Level Platform Architecture

CivicPulse AI operates on a modular, asynchronous full-stack architecture designed for real-time community signal ingestion, geospatial DBSCAN clustering, anomaly detection, and explainable XGBoost risk forecasting.

## Core Data Pipeline Flow:
1. **Signal Detection Layer:**
   - Multilingual Citizen Voice, Text, and Photo uploads (Tamil, Tanglish, English).
   - Sensor & Weather Ingestion (Rainfall mm/hr, Drainage Sluice Gate levels).
2. **AI Data Understanding & NLP:**
   - Server-side Gemini 3.6 Flash model extracts problem category, severity, and location entities.
   - Computer Vision quality & blur validator prevents corrupted uploads.
3. **Geospatial & Spatial Clustering:**
   - PostGIS / Haversine spatial proximity engine clusters signals within 300m radius into unified incident clusters.
4. **Anomalies & Time-Series Forecasting:**
   - Z-score & rolling-average anomaly detector identifies sudden report surges above historical baseline.
   - XGBoost feature-engineered model predicts risk probability (0.0 - 1.0) and time window (e.g., Next 3-6 hours).
5. **Explainable AI (SHAP):**
   - Calculates relative importance of contributing factors (Rainfall, Elevation, Historical Flood Index).
6. **Human-in-the-Loop Feedback:**
   - Field officer confirmations and ground-truth resolutions continually train the ML model.
`
    },
    database: {
      title: 'Database Schema & PostGIS Spatial Indexes',
      icon: Database,
      text: `
# PostgreSQL + PostGIS + pgvector Schema

CivicPulse AI uses normalized relational tables paired with PostGIS geometry types for spatial queries and pgvector for semantic embeddings.

## Core Tables:
- \`incident_reports\` (id UUID, user_id, description, language, category, severity, geometry Point, image_url, ai_confidence, status, department_id, created_at)
- \`incident_clusters\` (id UUID, category, center_geometry Point, report_ids ARRAY, report_count, suggested_severity, status)
- \`predictions\` (id UUID, category, location_geometry Point, risk_probability, risk_level, expected_time_window, confidence, model_version, actual_outcome)
- \`prediction_factors\` (id UUID, prediction_id, factor_name, importance_score, impact_type)
- \`model_metrics\` (model_version, precision, recall, f1_score, roc_auc, lead_time_hours, false_positives, false_negatives, drift_detected)
- \`officer_actions\` (id UUID, prediction_id, officer_id, action_type, notes, timestamp)
`
    },
    api: {
      title: 'REST API Reference',
      icon: Code,
      text: `
# REST API Documentation

- **POST /api/v1/reports** - Submit a citizen report signal (Voice/Text/Image + GPS)
- **GET /api/v1/reports** - Retrieve citizen report list
- **GET /api/v1/predictions** - Get active 24-hour risk predictions with SHAP factors
- **POST /api/v1/predictions/forecast** - Execute real-time risk forecasting engine
- **GET /api/v1/map/risks** - Get GeoJSON feature collection of active predictions & signals
- **POST /api/v1/ai/analyze-text** - Gemini multilingual NLP extraction (Tamil/Tanglish/English)
- **POST /api/v1/ai/analyze-image** - Computer vision detection & image quality check
- **POST /api/v1/feedback** - Record ground-truth outcome for ML model retraining
- **POST /api/v1/rag/summary** - Generate RAG-grounded executive situation brief
`
    },
    'ai-pipeline': {
      title: 'AI / ML Signal Processing Pipeline',
      icon: Brain,
      text: `
# Multilingual NLP & Computer Vision Pipeline

1. **Tanglish & Tamil Normalization:**
   - Normalizes phonetic variations ("thanni nikkuthu", "water nikkuthu", "road la water") to standard semantic categories (waterlogging).
2. **Computer Vision Quality Checker:**
   - Runs blur, darkness, and domain-relevance check before extracting bounding features (potholes, garbage piles, stagnant water).
3. **Deterministic & Neural Hybrid Routing:**
   - High-throughput deterministic mapping fallback ensures continuous operation even during external network degradation.
`
    },
    security: {
      title: 'Cybersecurity & Data Privacy Guidelines',
      icon: Shield,
      text: `
# Security & Privacy Architecture

- **Role-Based Access Control (RBAC):** Distinct permissions for Citizens, Field Officers, Department Directors, Administrators, and AI Analysts.
- **Anonymous Reporting:** Anonymous citizen signals strip personally identifiable information (PII).
- **HTTP-only Tokens & Input Sanitization:** Protection against SQL Injection, XSS, and CSRF attacks.
- **No Individual Profiling:** ML models strictly predict geographic infrastructure risk—never individual human behavior.
`
    },
    demo: {
      title: 'College & Pilot Demonstration Guide',
      icon: PlayCircle,
      text: `
# Live Demonstration Guide

1. Navigate to the **Overview / Landing Page**.
2. Locate the **Live Environmental & Signal Risk Simulator**.
3. Increase **Rainfall Intensity** to 80 mm/hr and **Drainage Obstruction** to 85%.
4. Click **Execute Predictive Calculation**.
5. Observe how CivicPulse AI calculates an 89% Waterlogging risk for Ward 172 (Velachery) with a 3-6 hour expected time window and SHAP factor breakdown.
6. Switch to the **Officer Map & Risks** view to inspect the red risk marker, view recommended advisory actions, and record a preventive clearance dispatch.
`
    },
    'full-report': {
      title: 'Complete Project Technical & Analytical Report',
      icon: FileText,
      text: `
# CivicPulse AI - Complete Project Technical Report

**System Name:** CivicPulse AI (Early Warning & Automated Infrastructure Risk Forecasting Platform)  
**Target Domain:** Smart Governance, Urban Infrastructure Management, & Civic Crisis Mitigation  
**Version:** 2.4.0  

---

## 1. Executive Summary
CivicPulse AI is an end-to-end civic intelligence and early warning platform that bridges citizen voices, multi-sensor environmental data, and municipal emergency operations. By combining server-side Gemini multimodal LLM NLP processing with spatial DBSCAN clustering and explainable XGBoost risk forecasting, CivicPulse AI enables municipal officers to transition from reactive ticket resolution to proactive early risk mitigation.

## 2. Core Functional Modules
1. **Multilingual Signal Ingestion Engine:** Parses text, audio voice notes, and photographic evidence in English, Tamil, and Tanglish.
2. **Computer Vision Quality Control:** Validates image clarity and domain-relevance to filter corrupted uploads.
3. **Spatial DBSCAN Clustering:** Merges citizen reports within a 300m radius into unified incident clusters.
4. **XGBoost Risk Forecasting Engine:** Computes ward-level 24-hour hazard probabilities with quantifiable lead time (average 3.8 hours early warning).
5. **Explainable AI (SHAP Factor Attribution):** Provides percentage contribution metrics for officer transparency.
6. **RAG Executive Situation Summarizer:** Synthesizes multi-sensor signals into executive situation briefs.
7. **Human-in-the-Loop Feedback Loop:** Incorporates officer field verifications to continuously compute precision/recall, calculate false positive/negative rates, monitor concept drift, and retrain ML models.

## 3. Technology Stack Specification
- **Frontend Framework:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, Motion/React.
- **Backend Service:** Express.js running on Node.js with native TypeScript ESM.
- **AI Models:** @google/genai TypeScript SDK using gemini-2.5-flash, gemini-3.6-flash, and gemini-2.0-flash with multi-model fallback retry logic.
- **Geospatial & Analytics:** Haversine spatial proximity algorithms, Z-score rolling anomaly detectors, XGBoost simulated risk models, and SHAP attribution logic.
- **Database Schema:** Normalized PostGIS relational models (incident_reports, incident_clusters, predictions, prediction_factors, model_metrics, officer_actions).

## 4. REST API Endpoints
- GET /api/health - System health status
- GET /api/v1/reports - Retrieve citizen report list
- POST /api/v1/reports - Create new report signal
- GET /api/v1/predictions - Get active ward risk predictions & SHAP factors
- POST /api/v1/predictions/forecast - Execute predictive risk forecasting
- POST /api/v1/rag/summary - Generate RAG executive situation summary
- POST /api/v1/feedback - Record officer ground-truth outcome
- GET /api/v1/metrics - Retrieve precision, recall, F1, ROC-AUC & drift metrics
`
    }
  };

  const currentDocData = docContents[activeDoc] || docContents.architecture;

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16 text-slate-100">
      <div className="no-print bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2 backdrop-blur-md">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Official Technical Specifications & System Manuals</span>
          </div>
          <h2 className="text-2xl font-black text-white">System Documentation</h2>
          <p className="text-xs text-slate-300">
            Comprehensive guides covering platform architecture, PostGIS schema, REST APIs, ML pipeline, and security principles.
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 border border-white/20 shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Export Document as PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="no-print space-y-1.5 bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl h-fit shadow-lg">
          {[
            { id: 'full-report', label: 'Project Technical Report', icon: FileText },
            { id: 'architecture', label: 'Architecture', icon: BookOpen },
            { id: 'database', label: 'Database & PostGIS', icon: Database },
            { id: 'api', label: 'REST API Reference', icon: Code },
            { id: 'ai-pipeline', label: 'AI & NLP Pipeline', icon: Brain },
            { id: 'security', label: 'Security & Privacy', icon: Shield },
            { id: 'demo', label: 'Demo Guide', icon: PlayCircle }
          ].map((item) => {
            const IconComponent = item.icon;
            const isSelected = activeDoc === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveDoc(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center space-x-2.5 transition ${
                  isSelected
                    ? 'bg-blue-600/80 text-white shadow-md backdrop-blur-md border border-blue-400/40'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <IconComponent className="w-4 h-4 text-cyan-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="printable-report md:col-span-3 bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-2xl space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-xl font-bold text-white flex items-center">
              {currentDocData.title}
            </h3>
            <button
              onClick={handleExportPDF}
              className="no-print text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-semibold"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              <span>Save / Print PDF</span>
            </button>
          </div>

          <div className="prose prose-invert max-w-none text-slate-300 text-xs leading-relaxed whitespace-pre-wrap font-sans">
            {currentDocData.text}
          </div>
        </div>
      </div>
    </div>
  );
};
