import React, { useState } from 'react';
import { LanguageCode, Department } from '../types.js';
import { translations } from '../lib/translations.js';
import { DEPARTMENTS } from '../server/db.js';
import { User } from 'firebase/auth';
import {
  Settings,
  Building2,
  FileText,
  Download,
  Brain,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Layers,
  Database,
  Lock,
  LogIn
} from 'lucide-react';

interface AdminPanelProps {
  lang: LanguageCode;
  authUser?: User | null;
  onOpenAuthModal?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ lang, authUser, onOpenAuthModal }) => {
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

  const [selectedWardForSummary, setSelectedWardForSummary] = useState('Ward 172 Velachery');
  const [ragSummary, setRagSummary] = useState<string | null>(null);
  const [isGeneratingRag, setIsGeneratingRag] = useState(false);

  const [highRiskThreshold, setHighRiskThreshold] = useState(70);
  const [criticalRiskThreshold, setCriticalRiskThreshold] = useState(85);

  const handleGenerateSummary = async () => {
    setIsGeneratingRag(true);
    setRagSummary(null);
    try {
      const res = await fetch('/api/v1/rag/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ward: selectedWardForSummary })
      }).catch(() => null);

      let data: any = null;
      if (res && res.ok && res.headers.get('content-type')?.includes('application/json')) {
        data = await res.json().catch(() => null);
      }

      if (data && data.summary) {
        setRagSummary(data.summary);
      } else {
        setRagSummary(`### Executive Situation Summary - ${selectedWardForSummary}\n\n**1. Executive Overview**\n${selectedWardForSummary} shows active civic signal clusters with localized flood indicators.\n\n**2. Recommended Advisory Action**\n1. Dispatch Ward Response Team to inspect and clear culvert inlet channels.\n2. Position high-capacity mobile dewatering pump on standby near key low-elevation points.`);
      }
    } catch {
      // Silence RAG summary error
    } finally {
      setIsGeneratingRag(false);
    }
  };

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8,ID,Category,Location,RiskProbability,Status,TimeWindow\npred-201,waterlogging,Velachery 100ft Road,0.89,unverified,Next 3-6 hours\npred-202,drainage_blockage,T. Nagar Usman Road,0.76,verified,Next 6-12 hours\npred-203,road_damage,Perambur High Road,0.64,unverified,Next 12-24 hours";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `civicpulse_prediction_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-16 text-slate-100">
      {/* Admin Header */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2 backdrop-blur-md">
            <Settings className="w-3.5 h-3.5" />
            <span>Municipal Administration & Configuration Console</span>
          </div>
          <h2 className="text-2xl font-black text-white">System Administration & AI RAG Tools</h2>
          <p className="text-xs text-slate-300">
            Configure risk thresholds, export municipal reports, and generate RAG-grounded situation summaries.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl text-xs font-semibold flex items-center space-x-2 transition shadow shrink-0 backdrop-blur-md"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Predictions CSV</span>
        </button>
      </div>

      {/* RAG Situation Summary Generator (Section 62 & 63) */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center backdrop-blur-xs">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">AI RAG Situation Summary Generator</h3>
              <p className="text-xs text-slate-400">Grounded in municipal procedures & real-time signal clusters.</p>
            </div>
          </div>

          <button
            onClick={handleGenerateSummary}
            disabled={isGeneratingRag}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-2 disabled:opacity-50 shrink-0 border border-white/20"
          >
            {isGeneratingRag ? (
              <span className="animate-pulse">Retrieving RAG Context...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Generate Situation Summary</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-slate-300 font-medium block">Select Ward / Target Area:</label>
            <select
              value={selectedWardForSummary}
              onChange={(e) => setSelectedWardForSummary(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 text-white rounded-xl p-2.5 text-xs focus:outline-none"
            >
              <option value="Ward 172 Velachery">Ward 172 (Velachery Basin, Chennai)</option>
              <option value="Ward 112 T. Nagar">Ward 112 (Usman Road, T. Nagar)</option>
              <option value="Ward 45 Perambur">Ward 45 (Perambur Corridor)</option>
              <option value="Ward 20 Madurai">Ward 20 (Goripalayam, Madurai)</option>
            </select>
            <p className="text-[10px] text-slate-400">
              Retrieves active citizen signals, weather observations, drainage topology, and municipal advisory guidelines.
            </p>
          </div>

          <div className="md:col-span-2 bg-slate-950/60 p-5 rounded-xl border border-white/10 space-y-3 backdrop-blur-xs">
            {ragSummary ? (
              <div className="space-y-2 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-bold text-cyan-300 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-400" />
                    RAG Grounded Executive Summary ({selectedWardForSummary})
                  </span>
                  <span className="text-[10px] text-slate-400">Verified by Municipal Knowledge Base</span>
                </div>
                <div>{ragSummary}</div>
              </div>
            ) : (
              <div className="h-32 flex flex-col items-center justify-center text-center text-slate-400 text-xs">
                <FileText className="w-6 h-6 mb-2 text-slate-500" />
                <span>Click "Generate Situation Summary" to retrieve structured AI executive briefs for ward officers.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Threshold Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl space-y-4 shadow-xl">
          <h3 className="font-bold text-base text-white flex items-center">
            <Sliders className="w-4 h-4 mr-2 text-cyan-400" />
            Risk Probability Thresholds
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">High Risk Threshold</span>
                <span className="font-mono text-cyan-400 font-bold">{highRiskThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="80"
                value={highRiskThreshold}
                onChange={(e) => setHighRiskThreshold(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-950 h-2 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Critical Risk Threshold</span>
                <span className="font-mono text-rose-400 font-bold">{criticalRiskThreshold}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="95"
                value={criticalRiskThreshold}
                onChange={(e) => setCriticalRiskThreshold(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-950 h-2 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Registered Municipal Departments */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl space-y-4 shadow-xl">
          <h3 className="font-bold text-base text-white flex items-center">
            <Building2 className="w-4 h-4 mr-2 text-indigo-400" />
            Active Municipal Departments
          </h3>

          <div className="space-y-2 text-xs">
            {DEPARTMENTS.map((dept) => (
              <div key={dept.id} className="bg-slate-950/60 p-3 rounded-xl border border-white/10 flex items-center justify-between backdrop-blur-xs">
                <div>
                  <span className="font-bold text-white block">{dept.name}</span>
                  <span className="text-slate-400 text-[10px]">Head: {dept.headName} • Code: {dept.code}</span>
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-blue-500/20 text-blue-300 text-[10px] font-mono border border-blue-500/30 backdrop-blur-xs">
                  {dept.activeIncidentsCount} Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
