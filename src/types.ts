export type UserRole = 'citizen' | 'field_officer' | 'department_officer' | 'admin' | 'ai_analyst';

export type LanguageCode = 'en' | 'ta';

export type ProblemCategory =
  | 'waterlogging'
  | 'flood_risk'
  | 'garbage_accumulation'
  | 'road_damage'
  | 'pothole'
  | 'drainage_blockage'
  | 'streetlight_failure'
  | 'water_supply_issue'
  | 'sewage_overflow'
  | 'fallen_tree'
  | 'traffic_obstruction'
  | 'public_infrastructure_damage'
  | 'illegal_dumping'
  | 'other';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IncidentStatus =
  | 'unverified'
  | 'ai_predicted'
  | 'field_verified'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'false_positive';

export interface Location {
  latitude: number;
  longitude: number;
  ward: string;
  areaName: string;
  district: string;
  elevationMeters?: number;
}

export interface CitizenReport {
  id: string;
  userId: string;
  userName?: string;
  isAnonymous: boolean;
  description: string;
  language: 'ta' | 'en' | 'tanglish';
  category: ProblemCategory;
  severity: IncidentSeverity;
  location: Location;
  imageUrl?: string;
  audioUrl?: string;
  createdAt: string; // ISO String
  status: IncidentStatus;
  aiConfidence: number;
  verified: boolean;
  clusterId?: string;
  departmentId: string;
  extractedEntities?: string[];
  imageQualityOk?: boolean;
  imageBlurScore?: number;
}

export interface IncidentCluster {
  id: string;
  category: ProblemCategory;
  centerLocation: Location;
  reportIds: string[];
  reportCount: number;
  firstReportTime: string;
  lastReportTime: string;
  status: IncidentStatus;
  suggestedSeverity: IncidentSeverity;
}

export interface RiskContributingFactor {
  factor: string;
  importanceScore: number; // 0 to 1
  impact: 'positive' | 'negative' | 'strong_positive';
  description: string;
}

export interface RiskPrediction {
  id: string;
  category: ProblemCategory;
  location: Location;
  riskProbability: number; // 0.0 to 1.0
  riskLevel: IncidentSeverity;
  expectedTimeWindow: string; // e.g. "Next 6-12 hours"
  confidence: number; // 0.0 to 1.0
  contributingFactors: RiskContributingFactor[];
  recommendedAction: string;
  modelVersion: string;
  createdAt: string;
  dataFreshnessMinutes: number;
  verified: boolean;
  actualOutcome?: 'occurred' | 'prevented' | 'false_positive' | 'unknown';
  verificationNotes?: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
}

export interface ModelMetrics {
  modelVersion: string;
  modelName: string;
  updatedAt: string;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  leadTimeHours: number;
  totalPredictions: number;
  falsePositives: number;
  falseNegatives: number;
  driftDetected: boolean;
  driftReason?: string;
  categoryAccuracy: Record<string, number>;
}

export interface OfficerAction {
  id: string;
  predictionId?: string;
  reportId?: string;
  officerId: string;
  officerName: string;
  actionType: 'inspection' | 'clearance' | 'maintenance' | 'dispatch' | 'verification';
  notes: string;
  timestamp: string;
  evidenceImageUrl?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headName: string;
  activeIncidentsCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId?: string;
  wardAssigned?: string;
}

export interface ComplaintEnquiryTicket {
  id: string;
  ticketNumber: string;
  type: 'complaint' | 'enquiry';
  category: string;
  subject: string;
  description: string;
  priority: IncidentSeverity;
  contactEmail: string;
  contactPhone: string;
  wardLocation: string;
  district: string;
  status: 'Pending' | 'Under Review' | 'In Progress' | 'Resolved';
  createdAt: string;
  officialResponse?: string;
  dispatchedEmail?: boolean;
  dispatchedSms?: boolean;
}

export interface NotificationLog {
  id: string;
  reportOrTicketId: string;
  type: 'email' | 'sms' | 'both';
  emailRecipient: string;
  phoneRecipient: string;
  subject: string;
  content: string;
  status: 'delivered' | 'sent';
  timestamp: string;
}

export interface DemoSimulationConfig {
  rainfallMmHr: number;
  citizenReportSurge: number;
  drainageClogIndex: number;
  selectedWard: string;
  isSimulating: boolean;
}
