# Cybersecurity Guidelines

1. **Role-Based Access Control (RBAC):**
   - Citizen: Ingest signals, view local public alerts.
   - Field Officer: Inspect predictions, verify ground truth, dispatch teams.
   - Department Director: View department KPIs and assign resources.
   - Administrator / AI Analyst: Manage model thresholds, review drift analytics, and generate RAG reports.
2. **API Protection:**
   - Server-side Gemini API key isolation.
   - Input sanitization against SQL Injection and Cross-Site Scripting (XSS).
