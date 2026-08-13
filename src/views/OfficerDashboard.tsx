import React, { useState } from 'react';
import { RiskPrediction, CitizenReport, LanguageCode, UserRole } from '../types.js';
import { translations } from '../lib/translations.js';
import { PredictionMap } from '../components/PredictionMap.js';
import { User } from 'firebase/auth';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Brain,
  ShieldCheck,
  Send,
  Zap,
  MapPin,
  X,
  UserCheck,
  Building2,
  FileText,
  Lock,
  LogIn
} from 'lucide-react';

interface OfficerDashboardProps {
  lang: LanguageCode;
  currentRole: UserRole;
  predictions: RiskPrediction[];
  reports: CitizenReport[];
  onRefreshPredictions: () => void;
  onRecordOutcome: (predictionId: string, outcome: 'occurred' | 'prevented' | 'false_positive', notes?: string) => void;
  onRecordOfficerAction: (predictionId: string, actionType: any, notes: string) => void;
  authUser?: User | null;
  onOpenAuthModal?: () => void;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  lang,
  predictions,
  reports,
  onRefreshPredictions,
  onRecordOutcome,
  onRecordOfficerAction,
  authUser,
  onOpenAuthModal
}) => {
  const t = translations[lang];

  if (!authUser) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 p-8 rounded-2xl shadow-2xl text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
          <Lock className="w-8 h-8 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white">{t.authRequiredTitle}</h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
            {t.authRequiredDesc}
          </p>
        </div>
        <button
          onClick={onOpenAuthModal}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition inline-flex items-center space-x-2 border border-white/20 cursor-pointer text-xs"
        >
          <LogIn className="w-4 h-4" />
          <span>{t.btnSignIn} / {t.btnSignUp}</span>
        </button>
      </div>
    );
  }

  const [selectedPrediction, setSelectedPrediction] = useState<RiskPrediction | null>(
    predictions.length > 0 ? predictions[0] : null
  );

  const [selectedWardFilter, setSelectedWardFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const [actionNotes, setActionNotes] = useState('');
  const [isPredicting, setIsPredicting] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Calculate Metrics
  const criticalCount = predictions.filter(p => p.riskProbability >= 0.8).length;
  const highCount = predictions.filter(p => p.riskProbability >= 0.6 && p.riskProbability < 0.8).length;

  const filteredPredictions = predictions.filter(p => {
    if (selectedWardFilter !== 'all' && p.location.ward !== selectedWardFilter) return false;
    if (selectedCategoryFilter !== 'all' && p.category !== selectedCategoryFilter) return false;
    return true;
  });

  const handlePredictClick = async () => {
    setIsPredicting(true);
    try {
      await fetch('/api/v1/predictions/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      onRefreshPredictions();
    } catch (err) {
      console.error('Forecast error:', err);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleConfirmAction = (outcome: 'prevented' | 'false_positive') => {
    if (!selectedPrediction) return;

    onRecordOutcome(selectedPrediction.id, outcome, actionNotes || 'Field officer confirmed on ground inspection.');
    onRecordOfficerAction(
      selectedPrediction.id,
      outcome === 'prevented' ? 'clearance' : 'verification',
      actionNotes || 'Status updated from field'
    );

    setActionSuccessMsg(
      outcome === 'prevented'
        ? 'Preventive action recorded! Ground truth saved for ML model training.'
        : 'Prediction flagged as False Positive. Ground truth recorded.'
    );
    setActionNotes('');
  };

  return (
    <div className="space-y-8 pb-16 text-slate-100">
      {/* Top Officer KPI Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg">
          <span className="text-slate-400 text-xs block font-medium">Active Predictions</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-white font-mono">{predictions.length}</span>
            <span className="text-[10px] text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-lg border border-cyan-500/30 backdrop-blur-xs">Live Forecast</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-rose-500/30 p-4 rounded-xl shadow-lg">
          <span className="text-rose-300 text-xs block font-medium">Critical Risks (≥80%)</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-rose-400 font-mono">{criticalCount}</span>
            <span className="text-[10px] text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-lg border border-rose-500/30 animate-pulse backdrop-blur-xs">Urgent Action</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg">
          <span className="text-slate-400 text-xs block font-medium">Citizen Signals Ingested</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-amber-300 font-mono">{reports.length}</span>
            <span className="text-[10px] text-slate-400">DBSCAN Clustered</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg">
          <span className="text-slate-400 text-xs block font-medium">Early Warning Lead Time</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-emerald-400 font-mono">3.8 Hours</span>
            <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-lg border border-emerald-500/30 backdrop-blur-xs">Saved Lead Time</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl col-span-2 lg:col-span-1 shadow-lg">
          <span className="text-slate-400 text-xs block font-medium">Model Precision & Accuracy</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-cyan-300 font-mono">91.4%</span>
            <span className="text-[10px] text-cyan-300">v1.3.0 XGBoost</span>
          </div>
        </div>
      </div>

      {/* Signature Button: Predict Next 24 Hours */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-4 h-4 animate-pulse" />
            <span>CivicPulse Signature AI Forecasting Pipeline</span>
          </div>
          <h2 className="text-lg font-bold text-white">Execute 24-Hour Predictive Risk Calculation</h2>
          <p className="text-xs text-slate-300">
            Triggers spatial correlation, historical flood index queries, and XGBoost anomaly detection across Madurai, Karaikudi, Devakottai, Trichy & municipal wards.
          </p>
        </div>

        <button
          onClick={handlePredictClick}
          disabled={isPredicting}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-cyan-500/25 transition flex items-center space-x-2 shrink-0 disabled:opacity-50 border border-white/20"
        >
          {isPredicting ? (
            <span className="animate-pulse">Analyzing Neural Risk Factors...</span>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              <span>🔮 Predict Next 24 Hours</span>
            </>
          )}
        </button>
      </div>

      {/* Interactive Map View */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-cyan-400" />
            Geospatial Prediction Map & Risk Hotspots
          </h3>
          <span className="text-xs text-slate-400">Click any risk marker to inspect SHAP factors</span>
        </div>

        <PredictionMap
          predictions={predictions}
          reports={reports}
          selectedPredictionId={selectedPrediction?.id}
          onSelectPrediction={(pred) => setSelectedPrediction(pred)}
          isDarkMode={true}
        />
      </div>

      {/* Prediction & Incident Detail Dual Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List Column */}
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl space-y-3 shadow-lg">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Risk Filter</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-slate-400 text-[10px] block mb-1">Ward</label>
                <select
                  value={selectedWardFilter}
                  onChange={(e) => setSelectedWardFilter(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/10 text-white rounded-lg p-2 focus:outline-none"
                >
                  <option value="all">All Regional Wards</option>
                  <option value="Ward 20">Madurai Ward 20 (Goripalayam)</option>
                  <option value="Ward 35">Madurai Ward 35 (Mattuthavani)</option>
                  <option value="Ward 12">Karaikudi Ward 12 (Sekkalai Road)</option>
                  <option value="Ward 18">Karaikudi Ward 18 (Alagappa Univ)</option>
                  <option value="Ward 5">Devakottai Ward 5 (Silambani Bazaar)</option>
                  <option value="Ward 10">Devakottai Ward 10 (Bus Stand)</option>
                  <option value="Ward 24">Trichy Ward 24 (Chatram Bus Stand)</option>
                  <option value="Ward 30">Trichy Ward 30 (Thillai Nagar)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 text-[10px] block mb-1">Category</label>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/10 text-white rounded-lg p-2 focus:outline-none capitalize"
                >
                  <option value="all">All Categories</option>
                  <option value="waterlogging">Waterlogging</option>
                  <option value="drainage_blockage">Drainage Blockage</option>
                  <option value="garbage_accumulation">Garbage</option>
                  <option value="road_damage">Road Damage</option>
                </select>
              </div>
            </div>
          </div>

          {/* Predictions List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredPredictions.map((pred) => {
              const isSelected = selectedPrediction?.id === pred.id;
              const prob = Math.round(pred.riskProbability * 100);

              return (
                <div
                  key={pred.id}
                  onClick={() => setSelectedPrediction(pred)}
                  className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-blue-500/20 border-cyan-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-md'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white capitalize">{pred.category.replace('_', ' ')}</span>
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold font-mono backdrop-blur-xs ${
                      prob >= 80
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : prob >= 60
                        ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {prob}% RISK
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                    {pred.location.areaName} ({pred.location.ward})
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/10">
                    <span className="flex items-center text-amber-300">
                      <Clock className="w-3 h-3 mr-1" />
                      {pred.expectedTimeWindow}
                    </span>
                    <span className="text-slate-500">
                      {pred.verified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Column: SHAP Factors, Advisory Actions & Human-in-the-Loop Actions */}
        <div className="lg:col-span-2 space-y-4">
          {selectedPrediction ? (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl space-y-6 shadow-2xl">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase backdrop-blur-xs">
                      AI PREDICTED PROBLEM
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Model: {selectedPrediction.modelVersion}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white capitalize mt-1">
                    {selectedPrediction.category.replace('_', ' ')}
                  </h3>
                  <p className="text-xs text-slate-300 flex items-center mt-0.5">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                    {selectedPrediction.location.areaName} • {selectedPrediction.location.ward} ({selectedPrediction.location.district})
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black text-rose-400 font-mono">
                    {Math.round(selectedPrediction.riskProbability * 100)}%
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Confidence: {Math.round(selectedPrediction.confidence * 100)}%</span>
                </div>
              </div>

              {actionSuccessMsg && (
                <div className="bg-emerald-950/80 border border-emerald-800 p-3 rounded-xl text-emerald-200 text-xs flex items-center justify-between">
                  <span>{actionSuccessMsg}</span>
                  <button onClick={() => setActionSuccessMsg(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>
              )}

              {/* Explainable AI SHAP Factors */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center">
                  <Brain className="w-4 h-4 mr-1.5 text-cyan-400" />
                  {t.contributingFactors}
                </h4>

                <div className="space-y-2">
                  {selectedPrediction.contributingFactors.map((f, i) => (
                    <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">✓ {f.factor}</span>
                        <span className="font-mono text-cyan-400 font-bold">
                          +{Math.round(f.importanceScore * 100)}% Weight
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{f.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Action */}
              <div className="bg-blue-950/40 border border-blue-800/50 p-4 rounded-xl space-y-1">
                <span className="text-xs font-bold text-blue-300 block uppercase tracking-wider">
                  {t.recommendedAction}
                </span>
                <p className="text-xs text-blue-100 font-medium leading-relaxed">
                  {selectedPrediction.recommendedAction}
                </p>
              </div>

              {/* Human-in-the-Loop Officer Actions Section */}
              <div className="border-t border-slate-800 pt-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center">
                  <UserCheck className="w-4 h-4 mr-1.5 text-emerald-400" />
                  Human-In-The-Loop Officer Verification & Dispatch
                </h4>

                <div className="space-y-3">
                  <textarea
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder="Enter on-field inspection notes, pump station status, or dispatch details..."
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleConfirmAction('prevented')}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t.btnVerify} & Confirm Action</span>
                    </button>

                    <button
                      onClick={() => handleConfirmAction('false_positive')}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center space-x-1.5"
                    >
                      <X className="w-4 h-4 text-rose-400" />
                      <span>{t.btnDismiss}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-slate-400">
              Select a risk prediction from the list to view SHAP factor breakdown.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
