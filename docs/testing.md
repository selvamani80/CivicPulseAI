# System Testing & Validation

## Automated Test Suites
1. **API Integration Tests:** Verifies `/api/v1/reports`, `/api/v1/predictions`, `/api/v1/ai/analyze-text`, and `/api/v1/rag/summary`.
2. **Spatial Clustering Verification:** Asserts that DBSCAN properly groups reports within 300m radius.
3. **Model Metric Regression Tests:** Ensures Precision stays above 90% and Lead Time stays above 3 hours.
