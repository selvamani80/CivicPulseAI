import React, { useState } from 'react';
import { LanguageCode, DemoSimulationConfig, RiskPrediction } from '../types.js';
import { translations } from '../lib/translations.js';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Sliders,
  Play,
  Layers,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Brain,
  BarChart3,
  Globe,
  ArrowRight
} from 'lucide-react';

interface LandingOverviewProps {
  lang: LanguageCode;
  onNavigateToCitizen: () => void;
  onNavigateToOfficer: () => void;
}

export const LandingOverview: React.FC<LandingOverviewProps> = ({
  lang,
  onNavigateToCitizen,
  onNavigateToOfficer
}) => {
  const t = translations[lang];

  // Live Demo Simulation State
  const [simConfig, setSimConfig] = useState<DemoSimulationConfig>({
    rainfallMmHr: 55,
    citizenReportSurge: 14,
    drainageClogIndex: 78,
    selectedWard: 'Ward 172',
    isSimulating: false
  });

  const [simResult, setSimResult] = useState<RiskPrediction | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const runLiveSimulation = async () => {
    setIsCalculating(true);
    try {
      const res = await fetch('/api/v1/demo/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simConfig)
      }).catch(() => null);

      if (res && res.ok) {
        await res.json().catch(() => null);
      }

      // Fetch predictions to display calculated outcome
      const predRes = await fetch('/api/v1/predictions').catch(() => null);
      if (predRes && predRes.ok) {
        const predData = await predRes.json().catch(() => null);
        if (predData?.data && predData.data.length > 0) {
          setSimResult(predData.data[0]);
        }
      }
    } catch {
      // Silence simulation errors
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-10 pb-16 text-slate-100">
      {/* Hero Header */}
      <section className="relative rounded-2xl bg-slate-900/60 backdrop-blur-xl p-8 md:p-12 border border-white/10 overflow-hidden shadow-2xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AI-Powered Predictive Civic Intelligence • Tamil Nadu Target</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Predicting Community Problems <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              Before They Become Emergencies
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            {t.taglineSub}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onNavigateToCitizen}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition flex items-center space-x-2 border border-white/20"
            >
              <span>{t.btnVoiceReport}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateToOfficer}
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold shadow-lg transition flex items-center space-x-2 backdrop-blur-md"
            >
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Launch Officer Intelligence Dashboard</span>
            </button>
          </div>
        </div>
      </section>

      {/* Core Paradigm Pipeline Diagram */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">The Predictive Intelligence Cycle</h2>
          <p className="text-sm text-slate-400">
            Moving away from reactive complaint management to proactive early warning and prevention.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { step: '01', title: 'DETECT', desc: 'Weak signals (Voice, Text, Image, Sensor)' },
            { step: '02', title: 'UNDERSTAND', desc: 'Tamil / Tanglish NLP & Computer Vision' },
            { step: '03', title: 'CLUSTER', desc: 'PostGIS DBSCAN Spatial Proximity' },
            { step: '04', title: 'PREDICT', desc: 'XGBoost Risk & Anomaly Forecasting' },
            { step: '05', title: 'PRIORITIZE', desc: '0-100 Urgency Impact Scoring' },
            { step: '06', title: 'PREVENT', desc: 'Advisory Dispatch to Field Officers' },
            { step: '07', title: 'LEARN', desc: 'Human-in-the-Loop Feedback Engine' }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-500/50 p-4 rounded-xl flex flex-col justify-between transition group shadow-lg"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-bold mb-2">
                <span>{item.step}</span>
                <span className="w-2 h-2 rounded-full bg-cyan-500/40 group-hover:bg-cyan-400"></span>
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition">{item.title}</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Live Simulation & Demo Simulator */}
      <section className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sliders className="w-4 h-4" />
              <span>Interactive College & Pilot Demonstration Mode</span>
            </div>
            <h2 className="text-xl font-bold text-white">Live Environmental & Signal Risk Simulator</h2>
            <p className="text-xs text-slate-400 mt-1">
              Adjust rainfall, citizen signal surge, and drainage clogging to see CivicPulse AI generate live predictions.
            </p>
          </div>

          <button
            onClick={runLiveSimulation}
            disabled={isCalculating}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg transition flex items-center space-x-2 disabled:opacity-50 shrink-0 border border-white/20"
          >
            {isCalculating ? (
              <span className="animate-pulse">Computing ML Risk Engine...</span>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-white" />
                <span>Execute Predictive Calculation</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sliders Box */}
          <div className="space-y-5 bg-white/5 backdrop-blur-md p-5 rounded-xl border border-white/10">
            {/* Rainfall Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Rainfall Intensity</span>
                <span className="font-mono text-cyan-400 font-bold">{simConfig.rainfallMmHr} mm/hr</span>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                value={simConfig.rainfallMmHr}
                onChange={(e) => setSimConfig({ ...simConfig, rainfallMmHr: Number(e.target.value) })}
                className="w-full accent-cyan-400 bg-slate-800 h-2 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 mm (Clear)</span>
                <span>50 mm (Heavy)</span>
                <span>120 mm (Extreme)</span>
              </div>
            </div>

            {/* Citizen Signal Surge Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Citizen Reports (Last Hr)</span>
                <span className="font-mono text-cyan-400 font-bold">{simConfig.citizenReportSurge} reports</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={simConfig.citizenReportSurge}
                onChange={(e) => setSimConfig({ ...simConfig, citizenReportSurge: Number(e.target.value) })}
                className="w-full accent-blue-500 bg-slate-800 h-2 rounded cursor-pointer"
              />
            </div>

            {/* Drainage Clog Index */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Drainage Obstruction Level</span>
                <span className="font-mono text-amber-400 font-bold">{simConfig.drainageClogIndex}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={simConfig.drainageClogIndex}
                onChange={(e) => setSimConfig({ ...simConfig, drainageClogIndex: Number(e.target.value) })}
                className="w-full accent-amber-400 bg-slate-800 h-2 rounded cursor-pointer"
              />
            </div>

            {/* Ward Selector */}
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Target Location / Ward</label>
              <select
                value={simConfig.selectedWard}
                onChange={(e) => setSimConfig({ ...simConfig, selectedWard: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-xs focus:outline-none"
              >
                <option value="Ward 172">Ward 172 (Velachery Basin, Chennai)</option>
                <option value="Ward 112">Ward 112 (Usman Rd T. Nagar, Chennai)</option>
                <option value="Ward 45">Ward 45 (Perambur Corridor, Chennai)</option>
                <option value="Ward 20">Ward 20 (Goripalayam, Madurai)</option>
                <option value="Ward 12">Ward 12 (Gandhipuram, Coimbatore)</option>
              </select>
            </div>
          </div>

          {/* Real-time Calculation Result Preview */}
          <div className="md:col-span-2 bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 flex flex-col justify-between shadow-xl">
            {simResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase backdrop-blur-xs">
                      PREDICTED PROBLEM
                    </span>
                    <h3 className="font-bold text-lg text-white capitalize">{simResult.category.replace('_', ' ')}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black font-mono text-rose-400">
                      {Math.round(simResult.riskProbability * 100)}% RISK
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono">Confidence: {Math.round(simResult.confidence * 100)}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/10 backdrop-blur-xs">
                    <span className="text-slate-400 block text-[10px]">Location</span>
                    <span className="font-semibold text-white">{simResult.location.areaName} ({simResult.location.ward})</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/10 backdrop-blur-xs">
                    <span className="text-slate-400 block text-[10px]">Expected Time Window</span>
                    <span className="font-semibold text-amber-300 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {simResult.expectedTimeWindow}
                    </span>
                  </div>
                </div>

                {/* SHAP Factor Breakdown */}
                <div>
                  <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center">
                    <Brain className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                    Top SHAP Contributing Risk Factors:
                  </h4>
                  <div className="space-y-1.5">
                    {simResult.contributingFactors.map((f, i) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-slate-900/50 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-xs">
                        <span className="text-slate-200">✓ {f.factor}</span>
                        <span className="text-cyan-400 font-mono font-semibold">+{Math.round(f.importanceScore * 100)}% impact</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-950/40 border border-blue-500/30 p-3 rounded-xl text-xs text-blue-200 backdrop-blur-md">
                  <strong className="text-blue-300 block mb-1">Recommended Preventive Action:</strong>
                  {simResult.recommendedAction}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <Brain className="w-10 h-10 text-cyan-400/50 animate-pulse" />
                <h3 className="text-sm font-semibold text-slate-300">Run Live Simulation to Calculate Prediction</h3>
                <p className="text-xs text-slate-400 max-w-md">
                  Adjust sliders on the left and click "Execute Predictive Calculation" to witness how CivicPulse AI transforms rainfall, clogging, and report density into structured early-warning predictions.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Comparison: Traditional Complaint Portal vs CivicPulse AI */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Traditional Complaint Systems</span>
          </div>
          <h3 className="text-lg font-bold text-white">Reactive & Fragmented</h3>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li className="flex items-start">
              <span className="text-rose-400 font-bold mr-2">✕</span>
              Waits for citizens to suffer major flooding before taking action.
            </li>
            <li className="flex items-start">
              <span className="text-rose-400 font-bold mr-2">✕</span>
              Treats 50 reports for 1 pothole as 50 separate ticket items, overwhelming officers.
            </li>
            <li className="flex items-start">
              <span className="text-rose-400 font-bold mr-2">✕</span>
              No geospatial prediction or weather signal correlation.
            </li>
            <li className="flex items-start">
              <span className="text-rose-400 font-bold mr-2">✕</span>
              Zero feedback loop to evaluate if action prevented damage.
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900/60 to-indigo-950/40 backdrop-blur-xl border border-cyan-500/30 p-6 rounded-2xl space-y-4 shadow-2xl">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>CivicPulse AI Platform</span>
          </div>
          <h3 className="text-lg font-bold text-white">Proactive & Predictive</h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start">
              <span className="text-cyan-400 font-bold mr-2">✓</span>
              <strong>3.8 Hours Early Warning:</strong> Predicts waterlogging before water accumulates.
            </li>
            <li className="flex items-start">
              <span className="text-cyan-400 font-bold mr-2">✓</span>
              <strong>DBSCAN Spatial Clustering:</strong> Groups 50 citizen signals into 1 actionable problem cluster.
            </li>
            <li className="flex items-start">
              <span className="text-cyan-400 font-bold mr-2">✓</span>
              <strong>Explainable SHAP AI:</strong> Shows officers exact reasons (rain ↑, low elevation, past flooding).
            </li>
            <li className="flex items-start">
              <span className="text-cyan-400 font-bold mr-2">✓</span>
              <strong>Human-in-the-Loop Feedback:</strong> Field officer confirmations continuously train ML models.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};
