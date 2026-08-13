import React, { useEffect, useState } from 'react';
import { UserRole, LanguageCode, RiskPrediction, CitizenReport } from './types.js';
import { Header } from './components/Header.js';
import { AuthModal } from './components/AuthModal.js';
import { auth } from './lib/firebase.js';
import { onAuthStateChanged, User } from 'firebase/auth';
import { LandingOverview } from './views/LandingOverview.js';
import { CitizenPortal } from './views/CitizenPortal.js';
import { EnquiryPortal } from './views/EnquiryPortal.js';
import { PlatformAssistant } from './views/PlatformAssistant.js';
import { OfficerDashboard } from './views/OfficerDashboard.js';
import { AIAnalyticsView } from './views/AIAnalyticsView.js';
import { AdminPanel } from './views/AdminPanel.js';
import { DocsView } from './views/DocsView.js';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [currentRole, setCurrentRole] = useState<UserRole>('citizen');
  const [lang, setLang] = useState<LanguageCode>('en');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const [predictions, setPredictions] = useState<RiskPrediction[]>([]);
  const [reports, setReports] = useState<CitizenReport[]>([]);

  // Firebase Auth State
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      if (!user) {
        setIsAuthModalOpen(true);
      } else {
        setIsAuthModalOpen(false);
        if (user.email === 'selvaappdeveloper7475@gmail.com') {
          setCurrentRole('officer');
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch Live Data
  const fetchData = async () => {
    try {
      const [predRes, repRes] = await Promise.all([
        fetch('/api/v1/predictions').catch(() => null),
        fetch('/api/v1/reports').catch(() => null)
      ]);

      if (predRes && predRes.ok) {
        const predData = await predRes.json().catch(() => null);
        if (predData?.data) setPredictions(predData.data);
      }
      if (repRes && repRes.ok) {
        const repData = await repRes.json().catch(() => null);
        if (repData?.data) setReports(repData.data);
      }
    } catch {
      // Silence transient fetch errors
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // 15s refresh
    return () => clearInterval(interval);
  }, []);

  const handleRecordOutcome = async (predictionId: string, outcome: 'occurred' | 'prevented' | 'false_positive', notes?: string) => {
    try {
      await fetch('/api/v1/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ predictionId, actualOutcome: outcome, notes })
      });
      fetchData();
    } catch (err) {
      console.error('Error recording outcome:', err);
    }
  };

  const handleRecordOfficerAction = async (predictionId: string, actionType: any, notes: string) => {
    try {
      await fetch('/api/v1/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          predictionId,
          officerId: 'usr-2',
          officerName: 'Officer Vijay Kumar',
          actionType,
          notes
        })
      });
      fetchData();
    } catch (err) {
      console.error('Error recording officer action:', err);
    }
  };

  const criticalCount = predictions.filter(p => p.riskProbability >= 0.8).length;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} font-sans antialiased transition-colors duration-200`}>
      <Header
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          if (role === 'citizen') setActiveTab('citizen');
          else if (role === 'field_officer' || role === 'department_officer') setActiveTab('dashboard');
          else if (role === 'ai_analyst') setActiveTab('analytics');
          else if (role === 'admin') setActiveTab('admin');
        }}
        lang={lang}
        onLangChange={setLang}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        criticalCount={criticalCount}
        authUser={authUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <main className="max-w-7xl mx-auto px-4 pt-6">
        {activeTab === 'overview' && (
          <LandingOverview
            lang={lang}
            onNavigateToCitizen={() => setActiveTab('citizen')}
            onNavigateToOfficer={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'citizen' && (
          <CitizenPortal
            lang={lang}
            onReportSubmitted={fetchData}
            myReports={reports}
            authUser={authUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'enquiry' && (
          <EnquiryPortal
            lang={lang}
            authUser={authUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'assistant' && (
          <PlatformAssistant
            lang={lang}
            userRole={currentRole}
            authUser={authUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          <OfficerDashboard
            lang={lang}
            currentRole={currentRole}
            predictions={predictions}
            reports={reports}
            onRefreshPredictions={fetchData}
            onRecordOutcome={handleRecordOutcome}
            onRecordOfficerAction={handleRecordOfficerAction}
            authUser={authUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'analytics' && (
          <AIAnalyticsView
            lang={lang}
            authUser={authUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            lang={lang}
            authUser={authUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'docs' && (
          <DocsView lang={lang} />
        )}
      </main>
    </div>
  );
}
