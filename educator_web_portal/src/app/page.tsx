"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, UserCheck, ShieldCheck, Server, Sparkles, 
  Video, UploadCloud, Radio, MessageSquare, Globe2, ArrowRight, CheckCircle2, Lock, Send, FileText, ExternalLink, Play
} from 'lucide-react';

export default function CommonUnifiedGateway() {
  const [activeTab, setActiveTab] = useState<'gateway' | 'student_simulator'>('gateway');

  // Student App Simulator States
  const [studentEmail, setStudentEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [dubbingLang, setDubbingLang] = useState('Hindi');
  const [docDoubt, setDocDoubt] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoSummary, setVideoSummary] = useState('');

  const handleSendEmailOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode === '123456' || otpCode.length === 6) {
      setOtpVerified(true);
    } else {
      alert("Enter valid 6-digit OTP (Try 123456)");
    }
  };

  const handleDocAsk = (e: React.FormEvent) => {
    e.preventDefault();
    setChatResponse(`AI Chatbot (${dubbingLang}): Regarding document '${docDoubt}': The lecture guide confirms safety clearance benchmarks, voltage grounding rules, and standard maintenance workflows.`);
  };

  const handleVideoSummarize = (e: React.FormEvent) => {
    e.preventDefault();
    setVideoSummary(`Video Link Summary (${dubbingLang}): Analysis of '${videoUrl}' shows key steps for double-grounding safety and 3-phase motor insulation continuity testing.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-4 md:p-10">
      {/* ── Top Header Banner with "Education for all" Branding ── */}
      <header className="max-w-6xl mx-auto w-full flex justify-between items-center pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-3 rounded-2xl shadow-md text-white">
            <GraduationCap className="h-7 w-7" />
          </div>
          <div>
            <h1 className="font-extrabold text-2xl tracking-tight text-slate-900">SkillVerse AI</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Sparkles className="h-3.5 w-3.5 text-violet-600" />
              <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">Education for all</span>
            </div>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-2 bg-slate-200 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('gateway')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'gateway'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Role Gateway Links
          </button>
          <button
            onClick={() => setActiveTab('student_simulator')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'student_simulator'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Interactive Student App Simulator</span>
          </button>
        </div>
      </header>

      {/* ── Central Gateway View ── */}
      {activeTab === 'gateway' ? (
        <main className="max-w-6xl mx-auto w-full my-8 space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Unified Multilingual Learning Gateway
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Select your portal role below. All systems feature real-time AI voice dubbing, pre-live automated translation, and document doubt resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Card 1: Student App */}
            <div className="bg-white border border-slate-200 hover:border-violet-400 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="p-4 bg-violet-100 text-violet-700 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-violet-50 text-violet-700 rounded-full">
                  Student App
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-4 mb-2">Student Portal</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Email OTP verification, live classes with Instagram-style voice dubbing (Korean, JP, CN, DE, ES, HI, etc.), and AI doubt resolution for docs and video links.
                </p>

                <ul className="space-y-2 text-xs font-semibold text-slate-600 mb-8 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                    <span>Email ID OTP & Password Setup</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                    <span>Instagram-Style Live Audio Dubbing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                    <span>Multilingual AI Chatbot Assistant</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('student_simulator')}
                  className="w-full py-3.5 px-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Open Interactive Student Simulator</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="http://localhost:8080"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Launch Direct Flutter Web Target (Port 8080)</span>
                </a>
              </div>
            </div>

            {/* Card 2: Educator Web Portal */}
            <div className="bg-white border border-slate-200 hover:border-indigo-400 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="p-4 bg-indigo-100 text-indigo-700 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                  <UserCheck className="h-8 w-8" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                  Educator Portal
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-4 mb-2">Educator Portal</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  3-tier Upload Center (Main Video, Referral Video/Link, Documents), Live Studio with SMS alerts, and privacy-protected attendee rosters.
                </p>

                <ul className="space-y-2 text-xs font-semibold text-slate-600 mb-8 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    <span>3-Section Upload Hub</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    <span>Live Studio + SMS Alert Broadcast</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    <span>Privacy Attendee Roster (Masked Phones)</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/dashboard"
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Launch Educator Hub (Port 3000)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Card 3: Admin Web Portal */}
            <div className="bg-white border border-slate-200 hover:border-emerald-400 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="p-4 bg-emerald-100 text-emerald-700 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                  Admin Portal
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-4 mb-2">Admin Portal</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Provision N number of educators with assigned Email & Password credentials, manage student accounts, and monitor system translation pipelines.
                </p>

                <ul className="space-y-2 text-xs font-semibold text-slate-600 mb-8 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>Provision Unlimited (N) Educators</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>Assign Educator Emails & Passwords</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>Platform Analytics & AI Moderation</span>
                  </li>
                </ul>
              </div>

              <a
                href="http://localhost:3002/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Launch Admin Hub (Port 3002)</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Backend Quick Access Card */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
                <Server className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Backend FastAPI AI Service</h4>
                <p className="text-xs text-slate-500">Interactive Swagger API Documentation & Live Sockets</p>
              </div>
            </div>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Open Swagger API Docs (Port 8000)
            </a>
          </div>
        </main>
      ) : (
        /* ── Student App Interactive Web Simulator ── */
        <main className="max-w-5xl mx-auto w-full my-8 space-y-8">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 rounded-2xl text-white shadow-lg flex justify-between items-center flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Interactive Web Simulator</span>
              </div>
              <h2 className="text-2xl font-extrabold">Student App Hub</h2>
              <p className="text-violet-100 text-xs mt-1">Test Email OTP Verification, Live Instagram-Style Dubbing, and Multilingual Chatbot Doubts.</p>
            </div>
            <button
              onClick={() => setActiveTab('gateway')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Back to Role Links
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Feature 1: Email OTP & Password Lifecycle */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="p-2.5 bg-violet-100 text-violet-700 rounded-xl">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">1. Email OTP & Password Lifecycle</h3>
                  <p className="text-xs text-slate-500">Student First-Time Signup & Password Change</p>
                </div>
              </div>

              {!otpSent ? (
                <form onSubmit={handleSendEmailOtp} className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700">Enter Student Email Address</label>
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    required
                    placeholder="student@skillverse.ai"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Send 6-Digit Verification OTP to Email
                  </button>
                </form>
              ) : !otpVerified ? (
                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  <div className="p-3 bg-violet-50 text-violet-800 rounded-lg text-xs font-semibold">
                    🔑 OTP Sent to <strong>{studentEmail}</strong>. (Try mock code: <strong>123456</strong>)
                  </div>
                  <label className="block text-xs font-bold text-slate-700">Enter 6-Digit Email OTP</label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    maxLength={6}
                    placeholder="123456"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-center font-bold tracking-widest focus:ring-2 focus:ring-violet-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Verify Email OTP & Continue
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Email Verified! Set or Change Account Password below.</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">New Account Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => alert("Password updated successfully!")}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Save New Password & Login
                  </button>
                </div>
              )}
            </div>

            {/* Feature 2: Instagram-Style Live Voice Dubbing */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="p-2.5 bg-red-100 text-red-700 rounded-xl">
                  <Radio className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">2. Instagram-Style Live Voice Dubbing</h3>
                  <p className="text-xs text-slate-500">Real-Time Spoken Speech Audio Translation</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">Select Preferred Live Dubbing Language</label>
                <select
                  value={dubbingLang}
                  onChange={(e) => setDubbingLang(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:ring-2 focus:ring-violet-500 focus:outline-none"
                >
                  <option value="Hindi">Hindi (हिंदी Live Dub)</option>
                  <option value="Tamil">Tamil (தமிழ் Live Dub)</option>
                  <option value="Telugu">Telugu (తెలుగు Live Dub)</option>
                  <option value="Korean">Korean (한국어 Live Dub)</option>
                  <option value="Japanese">Japanese (日本語 Live Dub)</option>
                  <option value="Chinese">Chinese (中文 Live Dub)</option>
                  <option value="German">German (Deutsch Live Dub)</option>
                  <option value="Spanish">Spanish (Español Live Dub)</option>
                  <option value="French">French (Français Live Dub)</option>
                  <option value="English">English Dub</option>
                </select>

                <div className="bg-slate-900 p-4 rounded-xl text-white space-y-2 border border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-red-400 flex items-center gap-1">
                      <Radio className="h-3 w-3 animate-ping" /> LIVE INSTA-STYLE AUDIO & SUBTITLE TRANSLATION
                    </span>
                    <span className="text-slate-400 font-bold">{dubbingLang} Dub Active</span>
                  </div>
                  <div className="p-3 bg-black/60 rounded-lg border border-violet-500/30">
                    <p className="text-[11px] font-bold text-violet-300 mb-0.5">Real-Time Translated Subtitle Overlay ({dubbingLang}):</p>
                    <p className="text-xs text-white font-semibold">
                      {
                        dubbingLang === "Tamil" ? "மின்சார வயரிங் மற்றும் பிரேக்கர் அமைப்புகளை சரிபார்க்கவும். [Live Tamil Subtitles]" :
                        dubbingLang === "Hindi" ? "विद्युत तारों और ब्रेकर सेटिंग्स की जांच करें। [Live Hindi Subtitles]" :
                        dubbingLang === "Telugu" ? "విద్యుత్ వైరింగ్ మరియు బ్రేకర్ సెట్టింగ్‌లను తనిఖీ చేయండి. [Live Telugu Subtitles]" :
                        dubbingLang === "Korean" ? "전기 배선 및 브레이커 설정을 확인하십시오. [Live Korean Subtitles]" :
                        dubbingLang === "Japanese" ? "電気配線とブレーカーの設定を確認してください。 [Live Japanese Subtitles]" :
                        dubbingLang === "Chinese" ? "请检查电气线路和断路器设置。[Live Chinese Subtitles]" :
                        dubbingLang === "German" ? "Überprüfen Sie die elektrische Verkabelung und die Leistungsschaltereinstellungen. [Live German Subtitles]" :
                        dubbingLang === "Spanish" ? "Verifique el cableado eléctrico y la configuración de los disyuntores. [Live Spanish Subtitles]" :
                        dubbingLang === "French" ? "Vérifiez le câblage électrique et les réglages du disjoncteur. [Live French Subtitles]" :
                        "Verify electrical wiring and circuit breaker clearances before power on. [Live English Subtitles]"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Multilingual AI Chatbot Document Doubt Resolver */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm md:col-span-2">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">3. Multilingual AI Document & Video Link Doubt Resolver</h3>
                  <p className="text-xs text-slate-500">Ask Doubts on Uploaded Educator Docs or External Video Links</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Document Doubt */}
                <form onSubmit={handleDocAsk} className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700">Ask Question on Educator Document</label>
                  <input
                    type="text"
                    value={docDoubt}
                    onChange={(e) => setDocDoubt(e.target.value)}
                    placeholder="e.g. What are the PPE safety rules in chapter 2?"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Ask AI Chatbot in {dubbingLang}
                  </button>
                </form>

                {/* Video Link Doubt */}
                <form onSubmit={handleVideoSummarize} className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700">Paste External Video / Portal URL</label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=example"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Summarize Video in {dubbingLang}
                  </button>
                </form>
              </div>

              {chatResponse && (
                <div className="p-4 bg-violet-50 border border-violet-200 text-violet-950 text-xs font-medium rounded-xl">
                  {chatResponse}
                </div>
              )}

              {videoSummary && (
                <div className="p-4 bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs font-medium rounded-xl">
                  {videoSummary}
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* ── Footer ── */}
      <footer className="max-w-6xl mx-auto w-full border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
        <p>© 2026 SkillVerse AI. All rights reserved. — <strong className="text-violet-600">Education for all</strong></p>
      </footer>
    </div>
  );
}
