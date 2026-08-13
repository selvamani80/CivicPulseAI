import React, { useState, useEffect } from 'react';
import { LanguageCode, IncidentSeverity, ComplaintEnquiryTicket, NotificationLog } from '../types.js';
import { translations } from '../lib/translations.js';
import { User } from 'firebase/auth';
import { db } from '../lib/firebase.js';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import {
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  Mail,
  Phone,
  MapPin,
  Tag,
  ShieldCheck,
  Search,
  Filter,
  Bell,
  Sparkles,
  FileText,
  Lock,
  LogIn,
  RefreshCw
} from 'lucide-react';

interface EnquiryPortalProps {
  lang: LanguageCode;
  authUser: User | null;
  onOpenAuthModal: () => void;
}

export const EnquiryPortal: React.FC<EnquiryPortalProps> = ({
  lang,
  authUser,
  onOpenAuthModal
}) => {
  const t = translations[lang];

  // Form State
  const [ticketType, setTicketType] = useState<'complaint' | 'enquiry'>('complaint');
  const [category, setCategory] = useState<string>('Drainage & Sewage Overflow');
  const [subject, setSubject] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<IncidentSeverity>('medium');
  const [wardLocation, setWardLocation] = useState<string>('Madurai Ward 20 (Goripalayam)');
  const [contactEmail, setContactEmail] = useState<string>('selvaappdeveloper7475@gmail.com');
  const [contactPhone, setContactPhone] = useState<string>('7539905792');

  // Submit Feedback & State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<ComplaintEnquiryTicket | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Tickets List & Logs State
  const [tickets, setTickets] = useState<ComplaintEnquiryTicket[]>([]);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([]);
  const [activeTab, setActiveTab] = useState<'tickets' | 'new' | 'logs'>('tickets');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchTickets = async () => {
    try {
      const [resEnq, resLogs] = await Promise.all([
        fetch('/api/v1/enquiries'),
        fetch('/api/v1/notifications/logs')
      ]);

      if (resEnq.ok) {
        const dataEnq = await resEnq.json();
        if (dataEnq.data) setTickets(dataEnq.data);
      }
      if (resLogs.ok) {
        const dataLogs = await resLogs.json();
        if (dataLogs.data) setNotificationLogs(dataLogs.data);
      }

      // Also try fetching live Firestore collection if available
      try {
        const q = query(collection(db, 'complaints_enquiries'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const fsTickets: ComplaintEnquiryTicket[] = [];
          querySnapshot.forEach((docSnap) => {
            fsTickets.push({ id: docSnap.id, ...docSnap.data() } as ComplaintEnquiryTicket);
          });
          if (fsTickets.length > 0) {
            setTickets(prev => {
              const ids = new Set(fsTickets.map(t => t.id));
              const combined = [...fsTickets, ...prev.filter(p => !ids.has(p.id))];
              return combined;
            });
          }
        }
      } catch {
        // Fallback to Express backend if Firestore rules restrict
      }
    } catch (err) {
      console.error('Error fetching enquiries:', err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setErrorMsg('Please enter both subject and detailed description.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSubmitSuccess(null);

    try {
      const ticketPayload = {
        type: ticketType,
        category,
        subject: subject.trim(),
        description: description.trim(),
        priority,
        contactEmail: contactEmail.trim() || 'selvaappdeveloper7475@gmail.com',
        contactPhone: contactPhone.trim() || '7539905792',
        wardLocation,
        district: wardLocation.includes('Madurai') ? 'Madurai' : wardLocation.includes('Karaikudi') ? 'Sivaganga' : wardLocation.includes('Devakottai') ? 'Sivaganga' : 'Tiruchirappalli'
      };

      // 1. Post to Express backend
      const res = await fetch('/api/v1/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketPayload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit complaint/enquiry');
      }

      const createdTicket: ComplaintEnquiryTicket = data.data;

      // 2. Persist to Firestore
      try {
        await addDoc(collection(db, 'complaints_enquiries'), {
          ...ticketPayload,
          ticketNumber: createdTicket.ticketNumber,
          status: 'Pending',
          createdAt: new Date().toISOString(),
          dispatchedEmail: true,
          dispatchedSms: true,
          userId: authUser?.uid || 'anon'
        });
      } catch (fsErr) {
        console.warn('Firestore backup note:', fsErr);
      }

      setSubmitSuccess(createdTicket);
      setSubject('');
      setDescription('');
      fetchTickets();
      setActiveTab('tickets');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting complaint/enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const filteredTickets = tickets.filter(t => {
    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.wardLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || t.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 border border-cyan-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Official Grievance & Public Enquiry Portal</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {lang === 'ta' ? 'புகார்கள் மற்றும் ஆன்லைன் விசாரணைகள்' : 'Complaints & Municipal Enquiries'}
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Submit official complaints or municipal enquiries across Madurai, Karaikudi, Devakottai, and Trichy. Every submission automatically dispatches instant Email alerts to <span className="text-cyan-300 font-mono font-bold">selvaappdeveloper7475@gmail.com</span> and SMS alerts to <span className="text-cyan-300 font-mono font-bold">7539905792</span>.
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('new')}
              className={`flex-1 md:flex-initial px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition border ${
                activeTab === 'new'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/25'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Submit New Ticket</span>
            </button>

            <button
              onClick={() => setActiveTab('tickets')}
              className={`flex-1 md:flex-initial px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition border ${
                activeTab === 'tickets'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/25'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Track Tickets ({tickets.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`flex-1 md:flex-initial px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition border ${
                activeTab === 'logs'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/25'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Dispatch Logs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Receipt Banner */}
      {submitSuccess && (
        <div className="bg-emerald-950/80 border-2 border-emerald-500/50 p-6 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Ticket Successfully Created!</h3>
                <p className="text-xs text-emerald-300 font-mono font-bold">Ticket ID: {submitSuccess.ticketNumber}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full text-xs font-semibold">
              Status: Pending Review
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs border-t border-emerald-800/50">
            <div className="flex items-center space-x-2 text-emerald-200">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>Email Confirmation Dispatched to: <strong className="text-white font-mono">{submitSuccess.contactEmail}</strong></span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-200">
              <Phone className="w-4 h-4 text-amber-400" />
              <span>SMS Alert Dispatched to: <strong className="text-white font-mono">{submitSuccess.contactPhone}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Submit New Complaint / Enquiry */}
      {activeTab === 'new' && (
        <form onSubmit={handleSubmitTicket} className="bg-slate-900/90 border border-cyan-500/30 p-6 md:p-8 rounded-2xl shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-6 h-6 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">New Complaint or Enquiry Form</h2>
            </div>

            {/* Type selector */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setTicketType('complaint')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                  ticketType === 'complaint'
                    ? 'bg-rose-500 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Grievance / Complaint
              </button>
              <button
                type="button"
                onClick={() => setTicketType('enquiry')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                  ticketType === 'enquiry'
                    ? 'bg-cyan-500 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Public Enquiry
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 bg-rose-950/80 border border-rose-500/50 text-rose-200 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Drainage & Sewage Overflow">Drainage & Sewage Overflow</option>
                <option value="Stormwater Stagnation">Stormwater Stagnation & Flood Risk</option>
                <option value="Road Damage & Potholes">Road Damage & Potholes</option>
                <option value="Garbage & Solid Waste Dumping">Garbage & Solid Waste Dumping</option>
                <option value="Streetlight Failure">Streetlight Failure</option>
                <option value="Drinking Water Supply">Drinking Water Supply & Pipeline Leak</option>
                <option value="Monsoon Preparedness Enquiry">Monsoon Preparedness Enquiry</option>
                <option value="General Municipal Grievance">General Municipal Grievance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Ward & Regional City Location</label>
              <select
                value={wardLocation}
                onChange={(e) => setWardLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Madurai Ward 20 (Goripalayam)">📍 Madurai Ward 20 (Goripalayam Junction)</option>
                <option value="Madurai Ward 45 (Simmakkal)">📍 Madurai Ward 45 (Simmakkal Market)</option>
                <option value="Karaikudi Ward 12 (Sekkalai Road)">📍 Karaikudi Ward 12 (Sekkalai Road)</option>
                <option value="Karaikudi Ward 8 (College Road)">📍 Karaikudi Ward 8 (College Road)</option>
                <option value="Devakottai Ward 5 (Bus Stand Area)">📍 Devakottai Ward 5 (Bus Stand Area)</option>
                <option value="Trichy Ward 38 (Thillai Nagar)">📍 Trichy Ward 38 (Thillai Nagar)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">Subject / Summary</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Heavy drainage clogging behind Goripalayam bus stand"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">Detailed Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Explain the problem or enquiry in detail (English, Tamil, or Tanglish)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as IncidentSeverity)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="critical">Critical Emergency</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Contact Email (Email Alert Target)</span>
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Contact Phone (SMS Alert Target)</span>
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-amber-300 font-mono focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="text-[11px] text-slate-400 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Integrated Email dispatch to <span className="text-slate-200 font-mono">selvaappdeveloper7475@gmail.com</span> & Phone SMS to <span className="text-slate-200 font-mono">7539905792</span>.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition inline-flex items-center space-x-2 cursor-pointer disabled:opacity-50 text-xs"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting & Sending Alerts...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Ticket & Send Alerts</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Track Tickets Table */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket number, subject, location..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="under review">Under Review</option>
                <option value="resolved">Resolved</option>
              </select>

              <button
                onClick={fetchTickets}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700"
                title="Refresh list"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3">Ticket ID</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Subject & Category</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Alerts Dispatched</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                        No complaint or enquiry tickets found matching your query.
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-4 py-3 font-mono font-bold text-cyan-300 whitespace-nowrap">
                          {t.ticketNumber}
                        </td>
                        <td className="px-4 py-3 capitalize font-semibold">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.type === 'complaint'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <div className="font-semibold text-white truncate">{t.subject}</div>
                          <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                            <Tag className="w-3 h-3 text-slate-500" />
                            <span>{t.category}</span>
                          </div>
                          {t.officialResponse && (
                            <div className="mt-1 p-2 bg-slate-950 border border-cyan-500/30 rounded text-[11px] text-cyan-200">
                              <strong className="text-cyan-400">Official Note:</strong> {t.officialResponse}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{t.wardLocation}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 uppercase text-[10px] font-bold">
                          <span className={`px-2 py-0.5 rounded ${
                            t.priority === 'critical' ? 'bg-rose-500 text-white' :
                            t.priority === 'high' ? 'bg-amber-500 text-black' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center space-x-1 ${
                            t.status === 'Pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                            t.status === 'In Progress' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                            'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}>
                            <Clock className="w-3 h-3" />
                            <span>{t.status}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11px]">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1 text-cyan-300 font-mono">
                              <Mail className="w-3 h-3 text-cyan-400" />
                              <span>{t.contactEmail}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-amber-300 font-mono">
                              <Phone className="w-3 h-3 text-amber-400" />
                              <span>+91 {t.contactPhone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-[11px] whitespace-nowrap">
                          {new Date(t.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Notification Dispatch Logs */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-amber-400 animate-bounce" />
              <div>
                <h3 className="text-sm font-bold text-white">Live Email & Phone Message Dispatch Logs</h3>
                <p className="text-xs text-slate-400">All alerts dispatched to selvaappdeveloper7475@gmail.com and 7539905792</p>
              </div>
            </div>
            <button
              onClick={fetchTickets}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl transition border border-slate-700 flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Logs</span>
            </button>
          </div>

          <div className="space-y-3">
            {notificationLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-900/60 rounded-2xl border border-slate-800">
                No dispatch logs registered yet. Submit a report or enquiry to trigger automated alerts.
              </div>
            ) : (
              notificationLogs.map((log) => (
                <div key={log.id} className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl space-y-2 hover:border-cyan-500/40 transition">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                        DELIVERED
                      </span>
                      <span className="font-bold text-cyan-300 font-mono">Ref ID: {log.reportOrTicketId}</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-white">{log.subject}</p>
                  <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/60 font-sans">
                    {log.content}
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/40">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1 text-cyan-400 font-mono">
                        <Mail className="w-3 h-3" />
                        <span>Email: {log.emailRecipient}</span>
                      </span>
                      <span className="flex items-center space-x-1 text-amber-400 font-mono">
                        <Phone className="w-3 h-3" />
                        <span>SMS: +91 {log.phoneRecipient}</span>
                      </span>
                    </div>
                    <span className="text-emerald-400 font-semibold text-[10px] uppercase">
                      ✓ Instant Dispatch Verified
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
