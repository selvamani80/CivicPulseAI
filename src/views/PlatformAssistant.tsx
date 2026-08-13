import React, { useState, useEffect, useRef } from 'react';
import { LanguageCode } from '../types.js';
import { translations } from '../lib/translations.js';
import { User } from 'firebase/auth';
import {
  Bot,
  User as UserIcon,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  HelpCircle,
  Compass,
  Lock,
  LogIn,
  RefreshCw,
  Mail,
  Phone,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface PlatformAssistantProps {
  lang: LanguageCode;
  userRole?: string;
  authUser: User | null;
  onOpenAuthModal: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  recommendations?: string[];
  timestamp: string;
}

export const PlatformAssistant: React.FC<PlatformAssistantProps> = ({
  lang,
  userRole = 'citizen',
  authUser,
  onOpenAuthModal
}) => {
  const t = translations[lang];

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: lang === 'ta'
        ? `வணக்கம்! நான் சிவிக்பல்ஸ் AI பிளாட்ஃபார்ம் உதவியாளர்.

மதுரை, காரைக்குடி, தேவகோட்டை, மற்றும் திருச்சி நகரங்களுக்கான சமூக புகார்கள், குரல் பதிவு, மின்னஞ்சல்/SMS எச்சரிக்கைகள் (selvaappdeveloper7475@gmail.com & 7539905792), மற்றும் AI வெள்ளக் கணிப்புகள் பற்றிய அனைத்து கேள்விகளுக்கும் பதிலளிக்க தயாராக உள்ளேன். நீங்கள் குரல் மூலம் (Mic) பேசலாம் அல்லது கீழேயுள்ள பரிந்துரைகளைத் தேர்ந்தெடுக்கலாம்.`
        : `Hello! I am your CivicPulse AI Platform Assistant & Recommendation Assistant.

I am specialized ONLY in answering platform capabilities, voice/photo reporting, automatic Email & SMS notifications (to selvaappdeveloper7475@gmail.com and 7539905792), tracking complaint tickets, and AI predictive flood risk models across Madurai, Karaikudi, Devakottai, and Trichy.

You can ask me questions using your voice (Microphone) or choose from the recommendations below!`,
      recommendations: [
        'How do I submit a civic report with Email & SMS alerts?',
        'How does the AI predict waterlogging in Goripalayam, Madurai?',
        'Where can I track my submitted complaint ticket?',
        'What preventative actions are recommended for Karaikudi and Trichy?'
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Voice Speech-To-Text (Recognition) State
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Voice Text-To-Speech (Synthesis) State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Setup Web Speech API SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputQuery(transcript);
          handleSendQuery(transcript);
        }
        setIsListening(false);
      };

      rec.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [lang]);

  const toggleVoiceListen = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        stopSpeechSynthesis();
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
        setIsListening(false);
      }
    }
  };

  // Text-To-Speech Output
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any active speech

    // Clean markdown symbols for cleaner speech
    const clean = text
      .replace(/[*#_`~]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/selvaappdeveloper7475@gmail.com/g, 'selva app developer email')
      .replace(/7539905792/g, '7 5 3 9 9 0 5 7 9 2');

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = lang === 'ta' ? 'ta-IN' : 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeechSynthesis = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    stopSpeechSynthesis();

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend.trim(),
          userRole,
          language: lang
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to get answer');
      }

      const answerText = data.data.answer;
      const recs = data.data.recommendations || [];

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: answerText,
        recommendations: recs,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);

      // Speak aloud if autoSpeak enabled
      if (autoSpeak) {
        speakText(answerText);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `asst-err-${Date.now()}`,
        sender: 'assistant',
        text: `CivicPulse AI platform integrates voice reporting, predictive risk modeling, and instant Email/SMS notification dispatch to selvaappdeveloper7475@gmail.com and 7539905792 across Madurai, Karaikudi, Devakottai, and Trichy.`,
        recommendations: [
          'How do I submit a civic report with Email & SMS alerts?',
          'Where can I track my submitted complaint ticket?'
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 border border-cyan-500/30 p-6 rounded-2xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[11px] font-semibold mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Voice-Enabled Platform Assistant</span>
            </div>
            <h1 className="text-xl font-black text-white">CivicPulse AI Platform Assistant & Recommendations</h1>
            <p className="text-xs text-slate-300">
              Interactive AI Assistant for platform capabilities, ticket status, email/SMS dispatches, and regional recommendations.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border ${
              autoSpeak
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Auto-read responses aloud"
          >
            {autoSpeak ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            <span>Voice Speech: {autoSpeak ? 'ON' : 'OFF'}</span>
          </button>

          {isSpeaking && (
            <button
              onClick={stopSpeechSynthesis}
              className="px-3 py-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold hover:bg-rose-500/30 transition flex items-center space-x-1"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Stop Voice</span>
            </button>
          )}
        </div>
      </div>

      {/* Preset Recommendation Quick Buttons */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Recommended Platform Queries (Click to Ask):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            'How do I submit a civic report with Email & SMS alerts?',
            'How does the AI predict waterlogging in Goripalayam, Madurai?',
            'Where can I track my submitted complaint ticket?',
            'What emergency actions are recommended for Karaikudi & Trichy?'
          ].map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(promptText)}
              className="px-3 py-1.5 bg-slate-950 hover:bg-cyan-950/60 text-slate-200 hover:text-cyan-300 text-xs font-medium rounded-xl border border-slate-800 hover:border-cyan-500/40 transition text-left cursor-pointer"
            >
              ⚡ {promptText}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl min-h-[420px] max-h-[520px] overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white shadow ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600'
              }`}
            >
              {msg.sender === 'user' ? <UserIcon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            <div
              className={`max-w-[82%] rounded-2xl p-4 space-y-3 shadow-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-600/90 text-white rounded-tr-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] opacity-75 border-b border-white/10 pb-1 mb-2">
                <span className="font-bold">
                  {msg.sender === 'user' ? 'You' : 'CivicPulse AI Assistant'}
                </span>
                <span>{msg.timestamp}</span>
              </div>

              <div className="text-xs leading-relaxed whitespace-pre-wrap font-sans">
                {msg.text}
              </div>

              {/* Recommendations Card if assistant */}
              {msg.sender === 'assistant' && msg.recommendations && msg.recommendations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                  <div className="text-[11px] font-bold text-cyan-400 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Follow-Up Recommendations:</span>
                  </div>
                  <div className="space-y-1.5">
                    {msg.recommendations.map((rec, rIdx) => (
                      <button
                        key={rIdx}
                        onClick={() => handleSendQuery(rec)}
                        className="w-full text-left p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-lg text-xs text-slate-300 hover:text-cyan-200 transition font-medium flex items-center space-x-2"
                      >
                        <span className="text-cyan-400 font-bold">→</span>
                        <span>{rec}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action bar for assistant message */}
              {msg.sender === 'assistant' && (
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1 text-cyan-400">
                      <Mail className="w-3 h-3" />
                      <span>selvaappdeveloper7475@gmail.com</span>
                    </span>
                    <span className="flex items-center space-x-1 text-amber-400">
                      <Phone className="w-3 h-3" />
                      <span>+91 7539905792</span>
                    </span>
                  </div>

                  <button
                    onClick={() => speakText(msg.text)}
                    className="p-1 hover:bg-slate-800 rounded text-cyan-300 hover:text-cyan-100 transition flex items-center space-x-1"
                    title="Read answer aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Read Aloud</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40">
              <Bot className="w-5 h-5 animate-spin" />
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-400 flex items-center space-x-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>CivicPulse AI is processing query & recommendations...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form with Voice SpeechRecognition */}
      <div className="bg-slate-900/90 border border-cyan-500/30 p-3 md:p-4 rounded-2xl shadow-xl space-y-2">
        {isListening && (
          <div className="p-2 bg-rose-950/80 border border-rose-500/40 rounded-xl text-xs text-rose-200 flex items-center justify-between animate-pulse">
            <div className="flex items-center space-x-2">
              <Mic className="w-4 h-4 text-rose-400 animate-bounce" />
              <span>Listening to your voice... Speak in Tamil or English!</span>
            </div>
            <button
              onClick={toggleVoiceListen}
              className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleVoiceListen}
            className={`p-3 rounded-xl transition border cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-lg shadow-rose-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-cyan-400 border-slate-700'
            }`}
            title="Click to speak your question"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
            placeholder="Ask anything about CivicPulse AI platform, complaint status, flood risks..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />

          <button
            onClick={() => handleSendQuery()}
            disabled={!inputQuery.trim() || isLoading}
            className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition inline-flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 text-xs"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
