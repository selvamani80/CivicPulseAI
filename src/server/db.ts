import {
  CitizenReport,
  RiskPrediction,
  IncidentCluster,
  ModelMetrics,
  Department,
  OfficerAction,
  UserProfile,
  ProblemCategory,
  IncidentSeverity,
  DemoSimulationConfig
} from '../types.js';

// Pre-seeded Tamil Nadu Departments
export const DEPARTMENTS: Department[] = [
  { id: 'dept-1', name: 'Greater Chennai Stormwater Drainage Dept', code: 'GCC-SWD', headName: 'Er. R. Murugan', activeIncidentsCount: 8 },
  { id: 'dept-2', name: 'Chennai Metropolitan Water Supply & Sewerage Board', code: 'CMWSSB', headName: 'Er. K. Anbarasan', activeIncidentsCount: 5 },
  { id: 'dept-3', name: 'Tamil Nadu Highways & Road Maintenance', code: 'TNHIGHWAYS', headName: 'Er. S. Selvakumar', activeIncidentsCount: 12 },
  { id: 'dept-4', name: 'Greater Chennai Corporation Waste Management', code: 'GCC-SWM', headName: 'Dr. V. Lakshmi', activeIncidentsCount: 6 },
  { id: 'dept-5', name: 'Tamil Nadu Generation and Distribution Corporation', code: 'TANGEDCO', headName: 'Er. M. Sundaram', activeIncidentsCount: 3 },
];

// Seed Users
export const USERS: UserProfile[] = [
  { id: 'usr-1', name: 'Kavitha Ramachandran', email: 'citizen.kavitha@gmail.com', role: 'citizen', wardAssigned: 'Madurai Ward 20' },
  { id: 'usr-2', name: 'Officer Vijay Kumar', email: 'vijay.field@tn.gov.in', role: 'field_officer', departmentId: 'dept-1', wardAssigned: 'Madurai Ward 20' },
  { id: 'usr-3', name: 'Director S. Ramanathan', email: 'ramanathan.dept@tn.gov.in', role: 'department_officer', departmentId: 'dept-1' },
  { id: 'usr-4', name: 'Admin Parthiban', email: 'admin@civicpulse.tn.gov.in', role: 'admin' },
  { id: 'usr-5', name: 'Dr. Anita AI Analyst', email: 'anita.ml@civicpulse.ai', role: 'ai_analyst' },
];

// Initial Seed Reports (Madurai, Karaikudi, Devakottai, Trichy)
const initialReports: CitizenReport[] = [
  {
    id: 'rep-101',
    userId: 'usr-1',
    userName: 'Kavitha Ramachandran',
    isAnonymous: false,
    description: 'Goripalayam Junction Madurai la heavy water stagnation near Vaigai river approach channel. Drainage clogged with debris.',
    language: 'tanglish',
    category: 'waterlogging',
    severity: 'high',
    location: {
      latitude: 9.9252,
      longitude: 78.1198,
      ward: 'Ward 20',
      areaName: 'Goripalayam Junction, Madurai',
      district: 'Madurai',
      elevationMeters: 101.2
    },
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    status: 'unverified',
    aiConfidence: 0.94,
    verified: false,
    clusterId: 'cluster-madurai-01',
    departmentId: 'dept-1',
    extractedEntities: ['Goripalayam Madurai', 'Vaigai channel clog', 'Water stagnation'],
    imageQualityOk: true,
    imageBlurScore: 0.12
  },
  {
    id: 'rep-102',
    userId: 'usr-anon-1',
    isAnonymous: true,
    description: 'Sekkalai Road Karaikudi near New Bus Stand 2 feet water standing after afternoon thunderstorm.',
    language: 'tanglish',
    category: 'waterlogging',
    severity: 'high',
    location: {
      latitude: 10.0689,
      longitude: 78.7801,
      ward: 'Ward 12',
      areaName: 'Sekkalai Road, Karaikudi',
      district: 'Sivaganga',
      elevationMeters: 77.5
    },
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'unverified',
    aiConfidence: 0.91,
    verified: false,
    clusterId: 'cluster-karaikudi-01',
    departmentId: 'dept-1',
    extractedEntities: ['Karaikudi New Bus Stand', 'Sekkalai Road', '2 feet water'],
    imageQualityOk: true
  },
  {
    id: 'rep-103',
    userId: 'usr-anon-2',
    isAnonymous: true,
    description: 'தேவகோட்டை சிலம்பணி பஜார் ரோட்டில் சாக்கடை அடைப்பு காரணமாக சாலையில் கழிவுநீர் வழிந்தோடுகிறது.',
    language: 'ta',
    category: 'drainage_blockage',
    severity: 'medium',
    location: {
      latitude: 9.9481,
      longitude: 78.8252,
      ward: 'Ward 5',
      areaName: 'Silambani Bazaar, Devakottai',
      district: 'Sivaganga',
      elevationMeters: 52.1
    },
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'unverified',
    aiConfidence: 0.96,
    verified: false,
    clusterId: 'cluster-devakottai-01',
    departmentId: 'dept-1',
    extractedEntities: ['சிலம்பணி பஜார் தேவகோட்டை', 'சாக்கடை அடைப்பு'],
    imageQualityOk: true
  },
  {
    id: 'rep-104',
    userId: 'usr-6',
    userName: 'Saravanan S',
    isAnonymous: false,
    description: 'Chatram Bus Stand Trichy major garbage dump blocking storm drain entry point.',
    language: 'en',
    category: 'garbage_accumulation',
    severity: 'medium',
    location: {
      latitude: 10.8285,
      longitude: 78.6945,
      ward: 'Ward 24',
      areaName: 'Chatram Bus Stand, Trichy',
      district: 'Tiruchirappalli',
      elevationMeters: 88.0
    },
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    status: 'field_verified',
    aiConfidence: 0.93,
    verified: true,
    clusterId: 'cluster-trichy-01',
    departmentId: 'dept-4',
    extractedEntities: ['Chatram Bus Stand Trichy', 'Garbage blocking drain'],
    imageQualityOk: true
  },
  {
    id: 'rep-105',
    userId: 'usr-7',
    userName: 'Karthik N',
    isAnonymous: false,
    description: 'Mattuthavani Bus Stand approach road Madurai deep asphalt pothole damaging vehicles.',
    language: 'en',
    category: 'pothole',
    severity: 'high',
    location: {
      latitude: 9.9492,
      longitude: 78.1560,
      ward: 'Ward 35',
      areaName: 'Mattuthavani Bus Terminus, Madurai',
      district: 'Madurai',
      elevationMeters: 105.0
    },
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    status: 'assigned',
    aiConfidence: 0.95,
    verified: true,
    departmentId: 'dept-3',
    extractedEntities: ['Mattuthavani Madurai', 'Deep pothole', 'Vehicle hazard'],
    imageQualityOk: true
  }
];

// Initial Risk Predictions (Madurai, Karaikudi, Devakottai, Trichy)
const initialPredictions: RiskPrediction[] = [
  {
    id: 'pred-201',
    category: 'waterlogging',
    location: {
      latitude: 9.9252,
      longitude: 78.1198,
      ward: 'Ward 20',
      areaName: 'Goripalayam Low Basin, Madurai',
      district: 'Madurai',
      elevationMeters: 101.2
    },
    riskProbability: 0.88,
    riskLevel: 'critical',
    expectedTimeWindow: 'Next 1–3 hours',
    confidence: 0.94,
    contributingFactors: [
      { factor: 'Vaigai Channel Drainage Clogging', importanceScore: 0.42, impact: 'strong_positive', description: 'Rainfall at 42mm/hr in Goripalayam sector' },
      { factor: 'Surge in Citizen Signals', importanceScore: 0.28, impact: 'strong_positive', description: '3 independent reports recorded around Goripalayam junction' },
      { factor: 'Historical Flood Hotspot', importanceScore: 0.18, impact: 'positive', description: 'Low elevation zone prone to Vaigai overflow' },
      { factor: 'High Traffic Load', importanceScore: 0.12, impact: 'positive', description: 'Major transit artery connecting North Madurai' }
    ],
    recommendedAction: 'Dispatch Madurai Corporation emergency suction pump unit to Goripalayam canal gate immediately.',
    modelVersion: 'v1.3.0-xgboost-spatial',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    dataFreshnessMinutes: 8,
    verified: false,
    assignedOfficerId: 'usr-2',
    assignedOfficerName: 'Officer Vijay Kumar'
  },
  {
    id: 'pred-202',
    category: 'drainage_blockage',
    location: {
      latitude: 10.0689,
      longitude: 78.7801,
      ward: 'Ward 12',
      areaName: 'Sekkalai Road Commercial Zone, Karaikudi',
      district: 'Sivaganga',
      elevationMeters: 77.5
    },
    riskProbability: 0.79,
    riskLevel: 'high',
    expectedTimeWindow: 'Next 3–6 hours',
    confidence: 0.91,
    contributingFactors: [
      { factor: 'New Bus Stand Runoff Surge', importanceScore: 0.38, impact: 'strong_positive', description: 'Runoff accumulating along Sekkalai main artery' },
      { factor: 'Commercial Waste Inflow', importanceScore: 0.32, impact: 'positive', description: 'Retail debris partially blocking storm inlet channels' }
    ],
    recommendedAction: 'Deploy Karaikudi Municipality clearance squad to unblock Sekkalai storm drain inlet.',
    modelVersion: 'v1.3.0-xgboost-spatial',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    dataFreshnessMinutes: 12,
    verified: false
  },
  {
    id: 'pred-203',
    category: 'flood_risk',
    location: {
      latitude: 9.9481,
      longitude: 78.8252,
      ward: 'Ward 5',
      areaName: 'Silambani Bazaar Basin, Devakottai',
      district: 'Sivaganga',
      elevationMeters: 52.1
    },
    riskProbability: 0.82,
    riskLevel: 'critical',
    expectedTimeWindow: 'Next 2–4 hours',
    confidence: 0.92,
    contributingFactors: [
      { factor: 'Market Canal Blockage', importanceScore: 0.45, impact: 'strong_positive', description: 'Silambani market waste choking primary runoff canal' },
      { factor: 'Sudden Downpour Forecast', importanceScore: 0.35, impact: 'positive', description: '35mm rain predicted in Devakottai municipal area' }
    ],
    recommendedAction: 'Deploy de-silting excavator to Silambani bazaar canal to prevent widespread commercial flooding.',
    modelVersion: 'v1.3.0-xgboost-spatial',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    dataFreshnessMinutes: 15,
    verified: false
  },
  {
    id: 'pred-204',
    category: 'sewage_overflow',
    location: {
      latitude: 10.8220,
      longitude: 78.6850,
      ward: 'Ward 30',
      areaName: 'Thillai Nagar Main Road, Trichy',
      district: 'Tiruchirappalli',
      elevationMeters: 85.2
    },
    riskProbability: 0.74,
    riskLevel: 'high',
    expectedTimeWindow: 'Next 4–8 hours',
    confidence: 0.89,
    contributingFactors: [
      { factor: 'Manhole Backpressure Signal', importanceScore: 0.40, impact: 'strong_positive', description: 'Pressure sensor alerts along Thillai Nagar main line' },
      { factor: 'High Commercial Water Discharge', importanceScore: 0.34, impact: 'positive', description: 'Peak evening sewage flow volume' }
    ],
    recommendedAction: 'Dispatch Trichy Corporation super-sucker jetting machine to Thillai Nagar 10th Cross line.',
    modelVersion: 'v1.3.0-xgboost-spatial',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    dataFreshnessMinutes: 20,
    verified: false
  }
];

// Initial Model Metrics
let currentModelMetrics: ModelMetrics = {
  modelVersion: 'v1.3.0-xgboost-spatial',
  modelName: 'CivicPulse Unified Risk & Anomaly Engine',
  updatedAt: new Date().toISOString(),
  precision: 0.914,
  recall: 0.882,
  f1Score: 0.898,
  rocAuc: 0.941,
  leadTimeHours: 3.8, // Average 3.8 hours early warning
  totalPredictions: 1420,
  falsePositives: 48,
  falseNegatives: 32,
  driftDetected: false,
  categoryAccuracy: {
    waterlogging: 0.932,
    flood_risk: 0.915,
    garbage_accumulation: 0.894,
    road_damage: 0.876,
    pothole: 0.921,
    drainage_blockage: 0.908,
    sewage_overflow: 0.889
  }
};

// Simulation State
export let simulationConfig: DemoSimulationConfig = {
  rainfallMmHr: 45,
  citizenReportSurge: 18,
  drainageClogIndex: 82,
  selectedWard: 'Ward 172',
  isSimulating: false
};

// In-Memory Database Store
class InvertedCivicStore {
  private reports: CitizenReport[] = [...initialReports];
  private predictions: RiskPrediction[] = [...initialPredictions];
  private actions: OfficerAction[] = [];
  private metrics: ModelMetrics = { ...currentModelMetrics };

  // Reports
  public getAllReports(): CitizenReport[] {
    return [...this.reports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getReportById(id: string): CitizenReport | undefined {
    return this.reports.find(r => r.id === id);
  }

  public addReport(report: Omit<CitizenReport, 'id' | 'createdAt' | 'status' | 'verified'>): CitizenReport {
    const newReport: CitizenReport = {
      ...report,
      id: `rep-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      status: 'unverified',
      verified: false
    };

    // Auto-cluster check
    const cluster = this.findOrCreateCluster(newReport);
    if (cluster) {
      newReport.clusterId = cluster.id;
    }

    this.reports.unshift(newReport);

    // Trigger dynamic risk recalculation
    this.recalculateRisksForLocation(newReport.location);

    return newReport;
  }

  public verifyReport(id: string, status: 'field_verified' | 'resolved' | 'false_positive'): CitizenReport | undefined {
    const r = this.getReportById(id);
    if (r) {
      r.status = status;
      r.verified = status === 'field_verified' || status === 'resolved';
      this.recalculateRisksForLocation(r.location);
    }
    return r;
  }

  // Clusters (Geospatial proximity + category similarity)
  private findOrCreateCluster(report: CitizenReport): IncidentCluster | null {
    const radiusMeters = 300;
    const nearby = this.reports.filter(r => {
      if (r.category !== report.category) return false;
      const dist = this.calculateDistanceMeters(
        r.location.latitude, r.location.longitude,
        report.location.latitude, report.location.longitude
      );
      return dist <= radiusMeters;
    });

    if (nearby.length > 0) {
      const clusterId = nearby[0].clusterId || `cluster-${report.category}-${Date.now()}`;
      nearby.forEach(n => n.clusterId = clusterId);
      return {
        id: clusterId,
        category: report.category,
        centerLocation: report.location,
        reportIds: [...nearby.map(n => n.id), report.id],
        reportCount: nearby.length + 1,
        firstReportTime: nearby[nearby.length - 1].createdAt,
        lastReportTime: new Date().toISOString(),
        status: 'unverified',
        suggestedSeverity: nearby.length + 1 >= 3 ? 'high' : 'medium'
      };
    }
    return null;
  }

  // Risk Predictions
  public getAllPredictions(): RiskPrediction[] {
    return [...this.predictions].sort((a, b) => b.riskProbability - a.riskProbability);
  }

  public getPredictionById(id: string): RiskPrediction | undefined {
    return this.predictions.find(p => p.id === id);
  }

  public recordPredictionOutcome(id: string, outcome: 'occurred' | 'prevented' | 'false_positive', notes?: string): RiskPrediction | undefined {
    const p = this.getPredictionById(id);
    if (p) {
      p.actualOutcome = outcome;
      p.verified = true;
      p.verificationNotes = notes;

      // Update model metrics based on ground truth
      if (outcome === 'false_positive') {
        this.metrics.falsePositives += 1;
        this.metrics.precision = Math.max(0.70, this.metrics.precision - 0.003);
      } else if (outcome === 'occurred' || outcome === 'prevented') {
        this.metrics.precision = Math.min(0.98, this.metrics.precision + 0.002);
        this.metrics.recall = Math.min(0.98, this.metrics.recall + 0.002);
      }
      this.metrics.f1Score = Number(((2 * this.metrics.precision * this.metrics.recall) / (this.metrics.precision + this.metrics.recall)).toFixed(3));
    }
    return p;
  }

  // Dynamic Risk Engine Calculation
  public generateNext24HourPredictions(simConfig?: DemoSimulationConfig): RiskPrediction[] {
    const wardToPredict = simConfig?.selectedWard || 'Ward 172';
    const rain = simConfig ? simConfig.rainfallMmHr : simulationConfig.rainfallMmHr;
    const clog = simConfig ? simConfig.drainageClogIndex : simulationConfig.drainageClogIndex;
    const surge = simConfig ? simConfig.citizenReportSurge : simulationConfig.citizenReportSurge;

    // Ward locations lookup (Madurai, Karaikudi, Devakottai, Trichy)
    const wardLocations: Record<string, { lat: number; lng: number; area: string; elev: number; dist: string }> = {
      'Madurai Ward 20': { lat: 9.9252, lng: 78.1198, area: 'Goripalayam Junction', elev: 101.2, dist: 'Madurai' },
      'Madurai Ward 35': { lat: 9.9492, lng: 78.1560, area: 'Mattuthavani Bus Terminus', elev: 105.0, dist: 'Madurai' },
      'Karaikudi Ward 12': { lat: 10.0689, lng: 78.7801, area: 'Sekkalai Road & New Bus Stand', elev: 77.5, dist: 'Sivaganga' },
      'Karaikudi Ward 18': { lat: 10.0745, lng: 78.7892, area: 'Alagappa University Area', elev: 80.0, dist: 'Sivaganga' },
      'Devakottai Ward 5': { lat: 9.9481, lng: 78.8252, area: 'Silambani Bazaar Road', elev: 52.1, dist: 'Sivaganga' },
      'Devakottai Ward 10': { lat: 9.9510, lng: 78.8280, area: 'Devakottai Bus Stand', elev: 53.0, dist: 'Sivaganga' },
      'Trichy Ward 24': { lat: 10.8285, lng: 78.6945, area: 'Chatram Bus Stand Junction', elev: 88.0, dist: 'Tiruchirappalli' },
      'Trichy Ward 30': { lat: 10.8220, lng: 78.6850, area: 'Thillai Nagar Main Road', elev: 85.2, dist: 'Tiruchirappalli' }
    };

    const targetLoc = wardLocations[wardToPredict] || wardLocations['Madurai Ward 20'];

    // Math model for waterlogging risk
    const baseRainRisk = Math.min(0.95, (rain / 80) * 0.55 + (clog / 100) * 0.35 + (surge / 20) * 0.10);
    const riskProb = Number(Math.max(0.20, baseRainRisk).toFixed(2));

    const newPred: RiskPrediction = {
      id: `pred-sim-${Date.now()}`,
      category: riskProb > 0.7 ? 'waterlogging' : 'drainage_blockage',
      location: {
        latitude: targetLoc.lat,
        longitude: targetLoc.lng,
        ward: wardToPredict,
        areaName: targetLoc.area,
        district: targetLoc.dist,
        elevationMeters: targetLoc.elev
      },
      riskProbability: riskProb,
      riskLevel: riskProb > 0.8 ? 'critical' : riskProb > 0.6 ? 'high' : riskProb > 0.4 ? 'medium' : 'low',
      expectedTimeWindow: riskProb > 0.8 ? 'Next 1–3 hours' : riskProb > 0.6 ? 'Next 3–6 hours' : 'Next 6–12 hours',
      confidence: Number((0.85 + Math.random() * 0.1).toFixed(2)),
      contributingFactors: [
        { factor: 'Live Rainfall Intensity', importanceScore: 0.44, impact: 'strong_positive', description: `Simulated rainfall at ${rain} mm/hr in ${wardToPredict}` },
        { factor: 'Drainage Channel Clogging', importanceScore: 0.32, impact: 'strong_positive', description: `Drainage obstruction level at ${clog}%` },
        { factor: 'Citizen Signal Density', importanceScore: 0.16, impact: 'positive', description: `${surge} incoming citizen reports in last hour` },
        { factor: 'Topographic Vulnerability', importanceScore: 0.08, impact: 'positive', description: `Elevation is ${targetLoc.elev}m above MSL` }
      ],
      recommendedAction: `Inspect storm channel D-${Math.floor(Math.random() * 50 + 1)} in ${wardToPredict} and deploy standby mobile dewatering pump unit.`,
      modelVersion: 'v1.3.0-xgboost-spatial',
      createdAt: new Date().toISOString(),
      dataFreshnessMinutes: 1,
      verified: false
    };

    // Keep predictions list updated without duplication
    this.predictions = [newPred, ...this.predictions.filter(p => p.id !== newPred.id)].slice(0, 15);
    return this.predictions;
  }

  private recalculateRisksForLocation(loc: { latitude: number; longitude: number; ward: string }) {
    // Spatial search and update probabilities
    const nearbyReports = this.reports.filter(r => r.location.ward === loc.ward);
    if (nearbyReports.length >= 3) {
      const existing = this.predictions.find(p => p.location.ward === loc.ward);
      if (existing) {
        existing.riskProbability = Math.min(0.98, existing.riskProbability + 0.08);
        existing.confidence = Math.min(0.96, existing.confidence + 0.03);
      }
    }
  }

  // Model Metrics
  public getModelMetrics(): ModelMetrics {
    return this.metrics;
  }

  // Actions
  public addOfficerAction(action: Omit<OfficerAction, 'id' | 'timestamp'>): OfficerAction {
    const act: OfficerAction = {
      ...action,
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    this.actions.unshift(act);

    if (action.predictionId) {
      const pred = this.getPredictionById(action.predictionId);
      if (pred) {
        pred.verified = true;
        pred.actualOutcome = 'prevented';
      }
    }

    return act;
  }

  public getOfficerActions(): OfficerAction[] {
    return this.actions;
  }

  // Distance helper
  private calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}

export const dbStore = new InvertedCivicStore();
