"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FileUploader from '../../../components/FileUploader';
import { 
  ArrowLeft, CheckCircle2, Video, FileText, Link as LinkIcon, 
  Sparkles, Globe2, ShieldCheck, Play, ExternalLink, Loader2, Archive, FileCode
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [extractedPdfModules, setExtractedPdfModules] = useState<any[]>([]);

  const ALL_23_LANGUAGES = [
    "All Preferred Languages", "English", "Assamese", "Bengali", "Bodo", "Dogri", "Gujarati", "Hindi",
    "Kannada", "Kashmiri", "Konkani", "Maithili", "Malayalam", "Manipuri",
    "Marathi", "Nepali", "Odia", "Punjabi", "Sanskrit", "Santali", "Sindhi",
    "Tamil", "Telugu", "Urdu"
  ];

  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('c1');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('skillverse_courses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAvailableCourses(parsed);
          setSelectedCourse(parsed[0].id);
        } else {
          setAvailableCourses([{ id: 'c-general', title: 'General Course & Vocational Materials' }]);
          setSelectedCourse('c-general');
        }
      } else {
        setAvailableCourses([{ id: 'c-general', title: 'General Course & Vocational Materials' }]);
        setSelectedCourse('c-general');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'referral_video' && referralType === 'link' && !referralLink) {
      alert("Please enter a valid external video URL.");
      return;
    }
    if ((activeTab !== 'referral_video' || referralType === 'file') && !selectedFile) {
      alert("Please select a resource or ZIP file to upload.");
      return;
    }

    setIsProcessing(true);

    const targetCourseObj = availableCourses.find(c => c.id === selectedCourse) || availableCourses[0] || { id: 'c-gen', title: 'General Course' };

    const isZipFile = selectedFile ? selectedFile.name.toLowerCase().endsWith('.zip') : false;

    // Simulate ZIP module extraction into separate PDF files for student download
    let extractedModules: any[] = [];
    if (isZipFile && selectedFile) {
      const baseName = selectedFile.name.replace(/\.zip$/i, '');
      extractedModules = [
        {
          id: `mod-1-${Date.now()}`,
          module_title: `Module 1: ${baseName} - Primary Theory & Protocols.pdf`,
          file_size: "2.4 MB",
          download_url: "/uploads/extracted_module_1.pdf"
        },
        {
          id: `mod-2-${Date.now()}`,
          module_title: `Module 2: ${baseName} - Diagrams & Formula Calculations.pdf`,
          file_size: "3.8 MB",
          download_url: "/uploads/extracted_module_2.pdf"
        },
        {
          id: `mod-3-${Date.now()}`,
          module_title: `Module 3: ${baseName} - Practical Lab Checklist & Safety.pdf`,
          file_size: "1.9 MB",
          download_url: "/uploads/extracted_module_3.pdf"
        }
      ];
      setExtractedPdfModules(extractedModules);
    } else {
      setExtractedPdfModules([]);
    }

    const newItem = {
      id: `uploaded-${Date.now()}`,
      course_id: targetCourseObj.id,
      course_title: targetCourseObj.title,
      title: title || (selectedFile ? selectedFile.name : "Educational Resource"),
      description: description || `Uploaded resource bound to ${targetCourseObj.title}.`,
      category: targetCourseObj.title,
      language: targetLang === 'All Preferred Languages' ? 'English' : targetLang,
      tags: [activeTab, targetLang, isZipFile ? 'ZIP Package' : 'Direct Upload'],
      difficulty: 'Intermediate',
      file_path: referralType === 'link' ? referralLink : (selectedFile ? `/uploads/${selectedFile.name}` : '/uploads/resource.pdf'),
      file_type: isZipFile ? 'Zip Archive (PDF Package)' : (activeTab === 'documents' ? 'PDF Document' : 'Video Lecture'),
      is_zip: isZipFile,
      extracted_modules: extractedModules,
      status: 'completed',
      created_at: new Date().toISOString()
    };

    setTimeout(() => {
      try {
        const existing = JSON.parse(localStorage.getItem('skillverse_uploaded_content') || '[]');
        localStorage.setItem('skillverse_uploaded_content', JSON.stringify([newItem, ...existing]));
        window.dispatchEvent(new Event('storage'));
      } catch (err) {
        console.error("Failed to persist upload:", err);
      }

      setIsProcessing(false);
      setUploadSuccess(true);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <button 
        onClick={() => router.push('/dashboard/content')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-semibold"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Media & Content Library
      </button>

      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Upload Center & ZIP Extractor</h2>
        <p className="text-slate-400 text-xs mt-1">
          Upload main lectures, reference materials, or **ZIP packages**. ZIP archives will be extracted into individual PDF modules for students.
        </p>
      </div>

      {uploadSuccess ? (
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="p-4 bg-emerald-950/60 border border-emerald-500/30 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Upload & Processing Complete!</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            Your file and materials have been saved and synced across all 23 languages to the Student Portal.
          </p>

          {extractedPdfModules.length > 0 && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-left space-y-2 max-w-lg mx-auto">
              <span className="text-xs font-bold text-violet-400 flex items-center gap-1.5">
                <Archive className="h-4 w-4" /> Extracted Separate PDF Modules ({extractedPdfModules.length}):
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {extractedPdfModules.map((mod) => (
                  <li key={mod.id} className="flex items-center justify-between p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="truncate font-semibold">{mod.module_title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{mod.file_size}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setUploadSuccess(false);
                setSelectedFile(null);
                setTitle('');
                setDescription('');
                setExtractedPdfModules([]);
              }}
              className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-lg"
            >
              Upload Another Resource / ZIP
            </button>
            <button
              onClick={() => router.push('/dashboard/content')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              View Content Library
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {/* Tabs header */}
          <div className="flex border-b border-slate-800 gap-2">
            <button
              onClick={() => { setActiveTab('main_video'); setSelectedFile(null); }}
              className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'main_video' 
                  ? 'border-violet-500 text-violet-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Video className="h-4 w-4" /> Main Lecture Video
            </button>
            <button
              onClick={() => { setActiveTab('referral_video'); setSelectedFile(null); }}
              className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'referral_video' 
                  ? 'border-violet-500 text-violet-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <LinkIcon className="h-4 w-4" /> External Video Link
            </button>
            <button
              onClick={() => { setActiveTab('documents'); setSelectedFile(null); }}
              className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'documents' 
                  ? 'border-violet-500 text-violet-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="h-4 w-4" /> PDF, Documents & ZIP Package
            </button>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-5">
            {/* File Uploader Input with ZIP Support */}
            {activeTab === 'referral_video' ? (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                    <input type="radio" checked={referralType === 'link'} onChange={() => setReferralType('link')} /> External Video Link (YouTube / Vimeo)
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                    <input type="radio" checked={referralType === 'file'} onChange={() => setReferralType('file')} /> Upload Referral File / ZIP
                  </label>
                </div>

                {referralType === 'link' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Video Link URL</label>
                    <input
                      type="url"
                      value={referralLink}
                      onChange={(e) => setReferralLink(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                ) : (
                  <FileUploader
                    onFileSelect={(f) => setSelectedFile(f)}
                    allowedFormats={['.mp4', '.mov', '.pdf', '.zip']}
                    maxSizeMB={150}
                  />
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Select Media / ZIP Archive</label>
                <FileUploader
                  onFileSelect={(file) => setSelectedFile(file)}
                  allowedFormats={
                    activeTab === 'documents' 
                      ? ['.pdf', '.docx', '.pptx', '.txt', '.zip', '.png', '.jpg']
                      : ['.mp4', '.mov', '.avi', '.webm', '.zip']
                  }
                  maxSizeMB={150}
                />
              </div>
            )}

            {/* Course Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Attach to Target Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold focus:ring-2 focus:ring-violet-500"
              >
                {availableCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Title & Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Resource Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Complete Satellite Communication Module Package"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Target Language (23 Languages)</label>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-violet-300 font-semibold focus:ring-2 focus:ring-violet-500"
                >
                  {ALL_23_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details about this lecture or ZIP module contents..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing Upload & Extracting ZIP Modules...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>Upload & Publish Resource to Student Portal</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
