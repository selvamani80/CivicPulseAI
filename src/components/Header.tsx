import React from 'react';
import { UserRole, LanguageCode } from '../types.js';
import { translations } from '../lib/translations.js';
import { User, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase.js';
import {
  ShieldAlert,
  Globe,
  UserCheck,
  Activity,
  MapPin,
  BarChart3,
  Settings,
  FileText,
  Radio,
  Sun,
  Moon,
  LogIn,
  LogOut,
  User as UserIcon
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  lang: LanguageCode;
  onLangChange: (lang: LanguageCode) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  criticalCount: number;
  authUser?: User | null;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  lang,
  onLangChange,
  activeTab,
  onTabChange,
  isDarkMode,
  onToggleDarkMode,
  criticalCount,
  authUser,
  onOpenAuthModal
}) => {
  const t = translations[lang];

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <header className="no-print sticky top-0 z-50 bg-slate-950/75 backdrop-blur-md text-white border-b border-white/10 shadow-2xl">
      {/* Top Banner Ticker */}
      <div className="bg-slate-950/80 backdrop-blur-sm px-4 py-1 text-xs flex justify-between items-center text-slate-300 border-b border-white/10">
        <div className="flex items-center space-x-3 overflow-hidden">
          <span className="flex items-center text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">
            <Radio className="w-3 h-3 mr-1.5 animate-pulse text-emerald-400" />
            Tamil Nadu Signal Grid Active
          </span>
          <span className="text-slate-600">|</span>
          <span className="truncate text-slate-300">
            Detected 3 active signal clusters in Ward 172 (Velachery) & Ward 112 (T. Nagar) • Early Warning Lead Time: <strong>3.8 Hours</strong>
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] shrink-0 ml-4">
          <span className="bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30 font-medium flex items-center backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-ping"></span>
            {criticalCount} Critical Risks
          </span>
          <button
            onClick={onToggleDarkMode}
            className="p-1 hover:bg-white/10 rounded-lg transition text-slate-400 hover:text-white border border-transparent hover:border-white/10"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-300" />}
          </button>
        </div>
      </div>

      {/* Main Header Nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div
            onClick={() => onTabChange('overview')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform border border-white/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  {t.appTitle}
                </h1>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5 rounded font-mono uppercase backdrop-blur-xs">
                  v1.3
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Predictive Community Intelligence Platform
              </p>
            </div>
          </div>

          {/* Language Toggle Mobile */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => onLangChange(lang === 'en' ? 'ta' : 'en')}
              className="px-2 py-1 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 flex items-center space-x-1 backdrop-blur-md"
            >
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-sm no-scrollbar">
          {[
            { id: 'overview', icon: Activity, label: t.navOverview },
            { id: 'citizen', icon: ShieldAlert, label: t.navReport },
            { id: 'dashboard', icon: MapPin, label: t.navPredictionMap },
            { id: 'analytics', icon: BarChart3, label: t.navAnalytics },
            { id: 'admin', icon: Settings, label: t.navAdmin },
            { id: 'docs', icon: FileText, label: t.navDocs },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition whitespace-nowrap border ${
                  isActive
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-medium shadow-[0_0_15px_rgba(59,130,246,0.25)] backdrop-blur-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Role Switcher & Language desktop */}
        <div className="hidden md:flex items-center space-x-3 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={() => onLangChange(lang === 'en' ? 'ta' : 'en')}
            className="px-2.5 py-1.5 text-xs rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 flex items-center space-x-1.5 transition backdrop-blur-md shadow-xs"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium">{lang === 'en' ? 'தமிழ் (TA)' : 'English (EN)'}</span>
          </button>

          {/* Role Selector */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 text-xs backdrop-blur-md">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400 ml-1 mr-1" />
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="citizen" className="bg-slate-900 text-white">{t.roleCitizen}</option>
              <option value="field_officer" className="bg-slate-900 text-white">{t.roleFieldOfficer}</option>
              <option value="department_officer" className="bg-slate-900 text-white">{t.roleDeptOfficer}</option>
              <option value="admin" className="bg-slate-900 text-white">{t.roleAdmin}</option>
              <option value="ai_analyst" className="bg-slate-900 text-white">{t.roleAIAnalyst}</option>
            </select>
          </div>

          {/* Firebase Authentication State */}
          {authUser ? (
            <div className="flex items-center space-x-2 bg-slate-900/90 border border-cyan-500/30 pl-2 pr-1 py-1 rounded-xl text-xs">
              {authUser.photoURL ? (
                <img src={authUser.photoURL} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-cyan-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {(authUser.displayName || authUser.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <span className="font-semibold text-slate-200 truncate max-w-[100px]">
                {authUser.displayName || authUser.email?.split('@')[0]}
              </span>
              <button
                onClick={handleSignOut}
                title="Sign Out"
                className="p-1 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 rounded-lg transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 flex items-center space-x-1.5 transition border border-white/20"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t.btnSignIn}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
