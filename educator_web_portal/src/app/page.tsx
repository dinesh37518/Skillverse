"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, UserCheck, ShieldCheck, Server, Sparkles, 
  Radio, MessageSquare, ArrowRight, CheckCircle2, Lock, ExternalLink
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-10 selection:bg-violet-500/30 selection:text-violet-200">
      {/* ── Top Header Banner with "Education for all" Branding ── */}
      <header className="max-w-6xl mx-auto w-full flex justify-between items-center pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-violet-600/30 rounded-2xl blur-md" />
            <div className="relative bg-gradient-to-br from-violet-600 to-indigo-600 p-3 rounded-2xl shadow-lg shadow-violet-600/20 text-white">
              <GraduationCap className="h-7 w-7" />
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-2">
              SkillVerse <span className="text-violet-400">AI</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Sparkles className="h-3.5 w-3.5 text-violet-400 animate-pulse" />
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Education for all</span>
            </div>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('gateway')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'gateway'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/20 border border-violet-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Role Gateway Links
          </button>
          <button
            onClick={() => setActiveTab('student_simulator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'student_simulator'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/20 border border-violet-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <GraduationCap className="h-4 w-4 text-violet-300" />
            <span>Interactive Student App Simulator</span>
          </button>
        </div>
      </header>

      {/* ── Central Gateway View ── */}
      {activeTab === 'gateway' ? (
        <main className="max-w-6xl mx-auto w-full my-8 space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider text-violet-400">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>Enterprise Multilingual Platform</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Unified Multilingual Learning Gateway
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Select your portal role below. All systems feature real-time AI voice dubbing, pre-live automated translation, and document doubt resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Card 1: Student App */}
            <div className="bg-slate-900/70 border border-slate-800/80 hover:border-violet-500/50 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-violet-600/10 transition-all duration-300 flex flex-col justify-between group backdrop-blur-md">
              <div>
                <div className="p-4 bg-violet-950/60 border border-violet-500/30 text-violet-400 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform shadow-md shadow-violet-600/10">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-full">
                  Student Portal
                </span>
                <h3 className="text-2xl font-bold text-white mt-4 mb-2">Student Portal</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Email OTP verification, live classes with Instagram-style voice dubbing (Korean, JP, CN, DE, ES, HI, etc.), and AI doubt resolution for docs and video links.
                </p>

                <ul className="space-y-2.5 text-xs font-semibold text-slate-300 mb-8 border-t border-slate-800/80 pt-4">
                  <li className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-violet-400 shadow-sm shadow-violet-400/50" />
                    <span>Email ID OTP & Password Setup</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-violet-400 shadow-sm shadow-violet-400/50" />
                    <span>Instagram-Style Live Audio Dubbing</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-violet-400 shadow-sm shadow-violet-400/50" />
                    <span>Multilingual AI Chatbot Assistant</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('student_simulator')}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/25 border border-violet-400/30 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Open Interactive Student Simulator</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="http://localhost:8080"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-violet-400" />
                  <span>Launch Direct Flutter Web Target (Port 8080)</span>
                </a>
              </div>
            </div>

            {/* Card 2: Educator Web Portal */}
            <div className="bg-slate-900/70 border border-slate-800/80 hover:border-indigo-500/50 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-indigo-600/10 transition-all duration-300 flex flex-col justify-between group backdrop-blur-md">
              <div>
                <div className="p-4 bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform shadow-md shadow-indigo-600/10">
                  <UserCheck className="h-8 w-8" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full">
                  Educator Portal
                </span>
                <h3 className="text-2xl font-bold text-white mt-4 mb-2">Educator Portal</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  3-tier Upload Center (Main Video, Referral Video/Link, Documents), Live Studio with SMS alerts, and privacy-protected attendee rosters.
                </p>

                <ul className="space-y-2.5 text-xs font-semibold text-slate-300 mb-8 border-t border-slate-800/80 pt-4">
                  <li className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50" />
                    <span>3-Section Upload Hub</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50" />
                    <span>Live Studio + SMS Alert Broadcast</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50" />
                    <span>Privacy Attendee Roster (Masked Phones)</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/dashboard"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 border border-indigo-400/30 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Launch Educator Hub (Port 3000)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Card 3: Admin Web Portal */}
            <div className="bg-slate-900/70 border border-slate-800/80 hover:border-emerald-500/50 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-emerald-600/10 transition-all duration-300 flex flex-col justify-between group backdrop-blur-md">
              <div>
                <div className="p-4 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform shadow-md shadow-emerald-600/10">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
                  Admin Portal
                </span>
                <h3 className="text-2xl font-bold text-white mt-4 mb-2">Admin Portal</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Provision N number of educators with assigned Email & Password credentials, manage student accounts, and monitor system translation pipelines.
                </p>

                <ul className="space-y-2.5 text-xs font-semibold text-slate-300 mb-8 border-t border-slate-800/80 pt-4">
                  <li className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                    <span>Provision Unlimited (N) Educators</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                    <span>Assign Educator Emails & Passwords</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                    <span>Platform Analytics & AI Moderation</span>
                  </li>
                </ul>
              </div>

              <a
                href="http://localhost:3002/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 border border-emerald-400/30 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Launch Admin Hub (Port 3002)</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Backend Quick Access Card */}
          <div className="bg-slate-900/70 border border-slate-800/80 p-6 rounded-2xl flex items-center justify-between flex-wrap gap-4 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-violet-400">
                <Server className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <span>Backend FastAPI AI Service</span>
                  <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                </h4>
                <p className="text-xs text-slate-400">Interactive Swagger API Documentation & Live Sockets</p>
              </div>
            </div>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer hover:scale-[1.02]"
            >
              Open Swagger API Docs (Port 8000)
            </a>
          </div>
        </main>
      ) : (
        /* ── Student App Interactive Web Simulator ── */
        <main className="max-w-5xl mx-auto w-full my-8 space-y-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-violet-900/90 via-indigo-900/80 to-slate-900 p-8 rounded-3xl border border-violet-500/30 text-white shadow-2xl backdrop-blur-md flex justify-between items-center flex-wrap gap-4">
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-500/20 border border-violet-400/30 rounded-full text-[10px] font-bold uppercase tracking-wider text-violet-300 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-violet-300" />
                <span>Interactive Web Simulator</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">Student App Hub</h2>
              <p className="text-slate-300 text-xs mt-1.5 max-w-xl leading-relaxed">
                Test Email OTP Verification, Live Instagram-Style Dubbing, and Multilingual Chatbot Doubts in a real-time simulator environment.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('gateway')}
              className="relative z-10 px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Back to Role Links
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Feature 1: Email OTP & Password Lifecycle */}
            <div className="bg-slate-900/70 border border-slate-800/80 p-6 rounded-3xl space-y-5 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <div className="p-2.5 bg-violet-950/80 border border-violet-500/30 text-violet-400 rounded-xl">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider block">Security Portal</span>
                  <h3 className="font-bold text-white text-base">1. Email OTP & Password Lifecycle</h3>
                </div>
              </div>

              {!otpSent ? (
                <form onSubmit={handleSendEmailOtp} className="space-y-4">
                  <label className="block text-xs font-bold text-slate-300">Enter Student Email Address</label>
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    required
                    placeholder="student@skillverse.ai"
                    className="w-full px-4 py-3 text-sm rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-violet-600/20 border border-violet-400/30 transition-all cursor-pointer"
                  >
                    Send 6-Digit Verification OTP to Email
                  </button>
                </form>
              ) : !otpVerified ? (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3.5 bg-violet-950/60 border border-violet-500/30 text-violet-200 rounded-xl text-xs font-medium">
                    🔑 OTP Sent to <strong className="text-white">{studentEmail}</strong>. (Try mock code: <strong className="text-violet-300">123456</strong>)
                  </div>
                  <label className="block text-xs font-bold text-slate-300">Enter 6-Digit Email OTP</label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    maxLength={6}
                    placeholder="123456"
                    className="w-full px-4 py-3 text-sm rounded-xl bg-slate-950/80 border border-slate-800 text-white text-center font-bold tracking-widest focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 border border-emerald-400/30 transition-all cursor-pointer"
                  >
                    Verify Email OTP & Continue
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Email Verified! Set or Change Account Password below.</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">New Account Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 text-sm rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => alert("Password updated successfully!")}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-md border border-slate-700 transition-all cursor-pointer"
                  >
                    Save New Password & Login
                  </button>
                </div>
              )}
            </div>

              {/* Feature 2: Instagram-Style Live Speech-to-Speech (S2S) Voice Dubbing */}
              <div className="bg-slate-900/70 border border-slate-800/80 p-6 rounded-3xl space-y-5 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                  <div className="p-2.5 bg-rose-950/80 border border-rose-500/30 text-rose-400 rounded-xl">
                    <Radio className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block">Live Audio Stream</span>
                    <h3 className="font-bold text-white text-base">2. Instagram-Style Speech-to-Speech (S2S) Dubbing</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-300">Select Preferred Dubbing Language (22 Indian + English)</label>
                  <select
                    value={dubbingLang}
                    onChange={(e) => setDubbingLang(e.target.value)}
                    className="w-full px-4 py-3 text-sm rounded-xl bg-slate-950/80 border border-slate-800 text-violet-300 font-bold focus:ring-2 focus:ring-violet-500 focus:outline-none cursor-pointer"
                  >
                    {[
                      'English', 'Assamese', 'Bengali', 'Bodo', 'Dogri', 'Gujarati', 
                      'Hindi', 'Kannada', 'Kashmiri', 'Konkani', 'Maithili', 'Malayalam', 
                      'Manipuri', 'Marathi', 'Nepali', 'Odia', 'Punjabi', 'Sanskrit', 
                      'Santali', 'Sindhi', 'Tamil', 'Telugu', 'Urdu'
                    ].map((lang) => (
                      <option key={lang} value={lang}>
                        {lang} Dubbed Audio (S2S Speech-to-Speech)
                      </option>
                    ))}
                  </select>

                  <div className="bg-slate-950 p-5 rounded-2xl text-white space-y-3 border border-slate-800/90 shadow-inner">
                    <div className="flex justify-between items-center text-xs flex-wrap gap-2">
                      <span className="font-bold text-rose-400 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                        </span>
                        SPEECH-TO-SPEECH (S2S) DUBBED AUDIO STREAM
                      </span>
                      <span className="text-violet-400 font-bold text-[11px] bg-violet-950/80 px-2.5 py-0.5 rounded-full border border-violet-500/30">
                        {dubbingLang} Audio Active
                      </span>
                    </div>

                    <div className="p-4 bg-slate-900/90 rounded-xl border border-violet-500/20 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                        <span>🎙️ Educator Original Speech: English</span>
                        <span className="text-emerald-400 font-bold">🔊 S2S Synthesized Dub: {dubbingLang}</span>
                      </div>
                      <p className="text-xs text-slate-100 font-medium leading-relaxed">
                        {
                          dubbingLang === "Tamil" ? "மின்சார வயரிங் மற்றும் பிரேக்கர் அமைப்புகளை சரிபார்க்கவும். [S2S Tamil Voice Synthesized Audio]" :
                          dubbingLang === "Hindi" ? "विद्युत तारों और ब्रेकर सेटिंग्स की जांच करें। [S2S Hindi Voice Synthesized Audio]" :
                          dubbingLang === "Telugu" ? "విద్యుత్ వైరింగ్ మరియు బ్రేకర్ సెట్టింగ్‌లను తనిఖీ చేయండి. [S2S Telugu Voice Synthesized Audio]" :
                          dubbingLang === "Bengali" ? "বৈদ্যুতিক তারের এবং ব্রেকার সেটিংস পরীক্ষা করুন। [S2S Bengali Voice Synthesized Audio]" :
                          dubbingLang === "Marathi" ? "इलेक्ट्रिकल वायरिंग आणि ब्रेकर सेटिंग्ज तपासा. [S2S Marathi Voice Synthesized Audio]" :
                          dubbingLang === "Gujarati" ? "ઇલેક્ટ્રિકલ વાયરિંગ અને બ્રેકર સેટિંગ્સ તપાસો. [S2S Gujarati Voice Synthesized Audio]" :
                          dubbingLang === "Kannada" ? "ವಿದ್ಯುತ್ ವೈರಿಂಗ್ ಮತ್ತು ಬ್ರೇಕರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ. [S2S Kannada Voice Synthesized Audio]" :
                          dubbingLang === "Malayalam" ? "ഇലക്ട്രിക്കൽ വയറിംഗും ബ്രേക്കർ ക്രമീകരണങ്ങളും പരിശോധിക്കുക. [S2S Malayalam Voice Synthesized Audio]" :
                          `Verify electrical wiring and circuit breaker clearances before power on. [S2S ${dubbingLang} Voice Synthesized Audio]`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 3: Empathetic AI Tutor & Mental Well-Being Companion */}
              <div className="bg-slate-900/70 border border-slate-800/80 p-6 rounded-3xl space-y-5 shadow-xl backdrop-blur-md md:col-span-2">
                <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                  <div className="p-2.5 bg-violet-950/80 border border-violet-500/30 text-violet-400 rounded-xl">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider">AI Empathetic Companion</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        ❤️ Mental Support & Academic Helper
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base">3. Empathetic AI Tutor & Mental Well-Being Guide ({dubbingLang})</h3>
                  </div>
                </div>

                <div className="p-3 bg-violet-950/40 border border-violet-500/30 rounded-xl text-xs text-violet-200 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-violet-400 shrink-0" />
                  <span>
                    <strong>Educator Study Material Policy:</strong> All uploaded lesson files and study guides open <em>exclusively</em> inside our AI Chat Agent, automatically translated into your preferred language (<strong>{dubbingLang}</strong>).
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Document Doubt / Emotional Support */}
                  <form onSubmit={handleDocAsk} className="space-y-3">
                    <label className="block text-xs font-bold text-slate-300">Talk to Empathetic AI (Academic or Mental Stress)</label>
                    <input
                      type="text"
                      value={docDoubt}
                      onChange={(e) => setDocDoubt(e.target.value)}
                      placeholder="e.g. I'm feeling stressed about my exam / Explain PPE safety rules"
                      className="w-full px-4 py-3 text-sm rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-violet-600/20 border border-violet-400/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles className="h-4 w-4 text-violet-300" />
                      <span>Ask Empathetic AI Tutor in {dubbingLang}</span>
                    </button>
                  </form>

                  {/* Video Link Doubt */}
                  <form onSubmit={handleVideoSummarize} className="space-y-3">
                    <label className="block text-xs font-bold text-slate-300">Paste Educational Video URL for S2S Summary</label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=example"
                      className="w-full px-4 py-3 text-sm rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 border border-indigo-400/30 transition-all cursor-pointer"
                    >
                      Summarize Video in {dubbingLang}
                    </button>
                  </form>
                </div>

                {chatResponse && (
                  <div className="p-4 bg-violet-950/50 border border-violet-500/30 text-violet-200 text-xs font-medium rounded-xl leading-relaxed space-y-1">
                    <p className="text-[10px] uppercase font-bold text-violet-400 tracking-wider">Empathetic AI Mentor Response ({dubbingLang}):</p>
                    <p>{chatResponse}</p>
                  </div>
                )}

                {videoSummary && (
                  <div className="p-4 bg-indigo-950/50 border border-indigo-500/30 text-indigo-200 text-xs font-medium rounded-xl leading-relaxed space-y-1">
                    <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">S2S Video Summary ({dubbingLang}):</p>
                    <p>{videoSummary}</p>
                  </div>
                )}
              </div>
          </div>
        </main>
      )}

      {/* ── Footer ── */}
      <footer className="max-w-6xl mx-auto w-full border-t border-slate-800/80 pt-6 text-center text-xs text-slate-500">
        <p>© 2026 SkillVerse AI. All rights reserved. — <strong className="text-violet-400">Education for all</strong></p>
      </footer>
    </div>
  );
}
