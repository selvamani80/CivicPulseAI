import express from 'express';
import path from 'path';
import fs from 'fs';
import { dbStore, simulationConfig } from './src/server/db.js';
import { analyzeReportText, analyzeReportImage, generateRAGSituationSummary } from './src/server/gemini.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // Healthcheck endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'CivicPulse AI Backend',
      timestamp: new Date().toISOString()
    });
  });

  // 1. Citizen Reports API
  app.get('/api/v1/reports', (req, res) => {
    const reports = dbStore.getAllReports();
    res.json({ success: true, count: reports.length, data: reports });
  });

  app.get('/api/v1/reports/:id', (req, res) => {
    const report = dbStore.getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }
    res.json({ success: true, data: report });
  });

  app.post('/api/v1/reports', async (req, res) => {
    try {
      const { description, category, severity, location, isAnonymous, userName, imageUrl, audioUrl, departmentId } = req.body;

      if (!description || !location) {
        return res.status(400).json({ success: false, error: 'Description and location are required' });
      }

      // Run AI text analysis pipeline
      const nlpResult = await analyzeReportText(description);

      const created = dbStore.addReport({
        userId: isAnonymous ? 'usr-anon' : 'usr-citizen-1',
        userName: isAnonymous ? 'Anonymous Citizen' : (userName || 'Tamil Nadu Resident'),
        isAnonymous: !!isAnonymous,
        description,
        language: nlpResult.language,
        category: category || nlpResult.category,
        severity: severity || nlpResult.severity,
        location,
        imageUrl,
        audioUrl,
        aiConfidence: nlpResult.confidence,
        departmentId: departmentId || 'dept-1',
        extractedEntities: nlpResult.extractedEntities,
        imageQualityOk: true
      });

      res.status(201).json({
        success: true,
        message: 'Civic report signal submitted and queued for predictive clustering.',
        data: created
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Error processing report' });
    }
  });

  app.post('/api/v1/reports/:id/verify', (req, res) => {
    const { status } = req.body;
    const updated = dbStore.verifyReport(req.params.id, status || 'field_verified');
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }
    res.json({ success: true, data: updated });
  });

  // 2. AI Processing APIs
  app.post('/api/v1/ai/analyze-text', async (req, res) => {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: 'Text prompt is required' });
    }
    const result = await analyzeReportText(text);
    res.json({ success: true, data: result });
  });

  app.post('/api/v1/ai/analyze-image', async (req, res) => {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, error: 'Base64 image is required' });
    }
    const result = await analyzeReportImage(image);
    res.json({ success: true, data: result });
  });

  // 3. Predictions & Risk Engine API
  app.get('/api/v1/predictions', (req, res) => {
    const predictions = dbStore.getAllPredictions();
    res.json({ success: true, count: predictions.length, data: predictions });
  });

  app.get('/api/v1/predictions/:id', (req, res) => {
    const pred = dbStore.getPredictionById(req.params.id);
    if (!pred) {
      return res.status(404).json({ success: false, error: 'Prediction not found' });
    }
    res.json({ success: true, data: pred });
  });

  app.post('/api/v1/predictions/forecast', (req, res) => {
    const simConfig = req.body.simConfig;
    const predictions = dbStore.generateNext24HourPredictions(simConfig);
    res.json({
      success: true,
      message: '24-hour predictive risk assessment recalculated successfully.',
      timestamp: new Date().toISOString(),
      data: predictions
    });
  });

  // 4. Geospatial & Hotspot API
  app.get('/api/v1/map/risks', (req, res) => {
    const predictions = dbStore.getAllPredictions();
    const reports = dbStore.getAllReports();

    res.json({
      success: true,
      geoFeatures: {
        type: 'FeatureCollection',
        features: [
          ...predictions.map(p => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [p.location.longitude, p.location.latitude]
            },
            properties: {
              id: p.id,
              type: 'prediction',
              category: p.category,
              riskProbability: p.riskProbability,
              riskLevel: p.riskLevel,
              areaName: p.location.areaName,
              ward: p.location.ward,
              expectedTimeWindow: p.expectedTimeWindow
            }
          })),
          ...reports.map(r => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [r.location.longitude, r.location.latitude]
            },
            properties: {
              id: r.id,
              type: 'citizen_report',
              category: r.category,
              severity: r.severity,
              areaName: r.location.areaName,
              ward: r.location.ward,
              status: r.status
            }
          }))
        ]
      }
    });
  });

  // 5. Analytics & Model Performance
  app.get('/api/v1/analytics', (req, res) => {
    const reports = dbStore.getAllReports();
    const predictions = dbStore.getAllPredictions();
    const metrics = dbStore.getModelMetrics();

    const categoryBreakdown: Record<string, number> = {};
    reports.forEach(r => {
      categoryBreakdown[r.category] = (categoryBreakdown[r.category] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        activeReportsCount: reports.length,
        activePredictionsCount: predictions.length,
        criticalRisksCount: predictions.filter(p => p.riskProbability >= 0.8).length,
        averageLeadTimeHours: metrics.leadTimeHours,
        overallAccuracy: metrics.f1Score * 100,
        modelMetrics: metrics,
        categoryBreakdown
      }
    });
  });

  app.get('/api/v1/model-metrics', (req, res) => {
    const metrics = dbStore.getModelMetrics();
    res.json({ success: true, data: metrics });
  });

  // 6. Actions & Feedback Loop
  app.post('/api/v1/actions', (req, res) => {
    const action = req.body;
    const recorded = dbStore.addOfficerAction(action);
    res.status(201).json({ success: true, data: recorded });
  });

  app.post('/api/v1/feedback', (req, res) => {
    const { predictionId, actualOutcome, notes } = req.body;
    if (!predictionId || !actualOutcome) {
      return res.status(400).json({ success: false, error: 'Prediction ID and outcome are required' });
    }
    const updated = dbStore.recordPredictionOutcome(predictionId, actualOutcome, notes);
    res.json({ success: true, message: 'Ground truth recorded for ML feedback loop', data: updated });
  });

  // 7. RAG Situation Summary
  app.post('/api/v1/rag/summary', async (req, res) => {
    const { ward } = req.body;
    const wardName = ward || 'Ward 172 Velachery';
    const reports = dbStore.getAllReports().filter(r => r.location.ward.includes(wardName.split(' ')[0]));
    const predictions = dbStore.getAllPredictions().filter(p => p.location.ward.includes(wardName.split(' ')[0]));

    const summary = await generateRAGSituationSummary(wardName, reports, predictions);
    res.json({ success: true, ward: wardName, summary });
  });

  // 8. Demo Simulation Controller
  app.post('/api/v1/demo/simulate', (req, res) => {
    const { rainfallMmHr, citizenReportSurge, drainageClogIndex, selectedWard } = req.body;

    if (rainfallMmHr !== undefined) simulationConfig.rainfallMmHr = Number(rainfallMmHr);
    if (citizenReportSurge !== undefined) simulationConfig.citizenReportSurge = Number(citizenReportSurge);
    if (drainageClogIndex !== undefined) simulationConfig.drainageClogIndex = Number(drainageClogIndex);
    if (selectedWard !== undefined) simulationConfig.selectedWard = selectedWard;

    const newPredictions = dbStore.generateNext24HourPredictions(simulationConfig);

    res.json({
      success: true,
      message: `Surge simulation active for ${simulationConfig.selectedWard}. System recalculated risk scores.`,
      config: simulationConfig,
      predictionsCount: newPredictions.length
    });
  });

  // 9. Complete Technical Report Document Export API
  app.get('/api/v1/export-report', (req, res) => {
    const reportPath = path.join(process.cwd(), 'docs', 'COMPLETE_PROJECT_REPORT.md');
    if (fs.existsSync(reportPath)) {
      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="CivicPulse_AI_Project_Report.md"');
      return res.sendFile(reportPath);
    }
    res.status(404).json({ success: false, error: 'Report file not found' });
  });

  // Vite middleware setup for development / production serving
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CivicPulse AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
