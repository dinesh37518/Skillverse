"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUploader from '../../../components/FileUploader';
import { 
  ArrowLeft, CheckCircle2, Video, FileText, Link as LinkIcon, 
  Sparkles, Globe2, ShieldCheck, Play, ExternalLink, Loader2
} from 'lucide-react';

export default function UploadCenter() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'main_video' | 'referral_video' | 'documents'>('main_video');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [referralLink, setReferralLink] = useState('');
  const [referralType, setReferralType] = useState<'file' | 'link'>('link');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetLang, setTargetLang] = useState('All Preferred Languages');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'referral_video' && referralType === 'link' && !referralLink) {
      alert("Please enter a valid external video URL.");
      return;
    }
    if ((activeTab !== 'referral_video' || referralType === 'file') && !selectedFile) {
      alert("Please select a resource file to upload.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSubmitted(true);
      setTimeout(() => {
        router.push('/dashboard/content');
      }, 2500);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* ── Top Header Banner with "Education for all" Branding ── */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-center flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-white mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Education for all</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Multilingual Educator Upload Hub</h2>
            <p className="text-violet-100 text-sm mt-1 max-w-xl">
              Post main course lectures, referral video links, and reference documents. Content is automatically translated for all students prior to live sessions.
            </p>
          </div>
          <button 
            onClick={() => router.push('/dashboard/content')}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl backdrop-blur-md text-sm font-semibold transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Library
          </button>
        </div>
      </div>

      {/* ── 3 Section Navigation Tabs ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tab 1: Main Video Upload */}
        <button
          onClick={() => { setActiveTab('main_video'); setSelectedFile(null); }}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeTab === 'main_video'
              ? 'bg-white border-violet-500 shadow-md ring-2 ring-violet-500/20'
              : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-violet-100 text-violet-700 rounded-xl">
              <Video className="h-6 w-6" />
            </div>
            <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">Section 1</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">1. Main Course Video</h3>
            <p className="text-slate-500 text-xs mt-1">Upload primary video lectures for student course modules.</p>
          </div>
        </button>

        {/* Tab 2: Referral Video Section */}
        <button
          onClick={() => { setActiveTab('referral_video'); setSelectedFile(null); }}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeTab === 'referral_video'
              ? 'bg-white border-violet-500 shadow-md ring-2 ring-violet-500/20'
              : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl">
              <LinkIcon className="h-6 w-6" />
            </div>
            <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">Section 2</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">2. Referral Video Section</h3>
            <p className="text-slate-500 text-xs mt-1">Post reference video files or YouTube/portal links.</p>
          </div>
        </button>

        {/* Tab 3: Documents Upload Section */}
        <button
          onClick={() => { setActiveTab('documents'); setSelectedFile(null); }}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeTab === 'documents'
              ? 'bg-white border-violet-500 shadow-md ring-2 ring-violet-500/20'
              : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">Section 3</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">3. Documents Upload</h3>
            <p className="text-slate-500 text-xs mt-1">Upload PDF guides, DOCX, PPTX slides, or reference images.</p>
          </div>
        </button>
      </div>

      {/* ── Main Submission Form ── */}
      {isSubmitted ? (
        <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center space-y-4 shadow-sm">
          <div className="inline-flex bg-emerald-100 p-4 rounded-full text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Upload & Translation Pipeline Started!</h3>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            Your content is being auto-translated into student preferred languages (Hindi, Tamil, Telugu, Korean, Japanese, German, Spanish, French, English) prior to live sessions.
          </p>
        </div>
      ) : (
        <form onSubmit={handleUploadSubmit} className="bg-white border border-slate-200 p-8 rounded-2xl space-y-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {activeTab === 'main_video' && 'Upload Main Course Lecture Video'}
                {activeTab === 'referral_video' && 'Upload Referral Video or Link'}
                {activeTab === 'documents' && 'Upload Reference Documents & Study Guides'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Fill details and select source content below.</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-violet-50 text-violet-700 text-xs font-semibold rounded-lg">
              <Globe2 className="h-4 w-4" />
              <span>Pre-Live Auto Translation Active</span>
            </div>
          </div>

          {/* Special Referral Video Selector */}
          {activeTab === 'referral_video' && (
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Referral Source Type</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setReferralType('link')}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    referralType === 'link'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <ExternalLink className="h-4 w-4" />
                  External Video URL Link
                </button>
                <button
                  type="button"
                  onClick={() => setReferralType('file')}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    referralType === 'file'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Video className="h-4 w-4" />
                  Referral Video File Upload
                </button>
              </div>

              {referralType === 'link' && (
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Paste External Video / Educational Portal Link</label>
                  <input
                    type="url"
                    value={referralLink}
                    onChange={(e) => setReferralLink(e.target.value)}
                    placeholder="e.g. https://www.youtube.com/watch?v=example or https://educational-portal.com/video/101"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-violet-500" />
                    AI Chatbot will automatically index transcript and summarize doubts in student preferred languages.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* File Upload Box (If applicable) */}
          {(activeTab !== 'referral_video' || referralType === 'file') && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Select Media File</label>
              <FileUploader
                onFileSelect={(file) => setSelectedFile(file)}
                allowedFormats={
                  activeTab === 'documents' 
                    ? ['.pdf', '.docx', '.pptx', '.txt', '.png', '.jpg']
                    : ['.mp4', '.mov', '.avi', '.webm']
                }
                maxSizeMB={150}
              />
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Industrial Hydraulics Troubleshooting Guide"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Auto-Translation Language</label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="All Preferred Languages">All Preferred Languages (Auto-Detect)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
                <option value="Telugu">Telugu (తెలుగు)</option>
                <option value="Korean">Korean (한국어)</option>
                <option value="Japanese">Japanese (日本語)</option>
                <option value="Chinese">Chinese (中文)</option>
                <option value="German">German (Deutsch)</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="French">French (Français)</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description / Key Notes</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe key concepts covered..."
              className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing Upload & Translation Tasks...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-5 w-5" />
                <span>Submit to Library & Auto-Translate</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
