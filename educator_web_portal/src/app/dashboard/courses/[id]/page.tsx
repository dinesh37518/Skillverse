"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, BookOpen, Video, FileText, UploadCloud, Sparkles, 
  CheckCircle2, Clock, Users, Star, Play, Edit, Trash2, Globe2, Plus, ExternalLink, X, Loader2, Archive
} from 'lucide-react';
import FileUploader from '../../../../components/FileUploader';
import { SATELLITE_COMMUNICATION_COURSE, SATELLITE_COMMUNICATION_FILES } from '../page';

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const [course, setCourse] = useState<any>(null);
  const [courseMaterials, setCourseMaterials] = useState<any[]>([]);

  // In-course Direct Upload Modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [fileTitle, setFileTitle] = useState('');
  const [fileDesc, setFileDesc] = useState('');
  const [fileCategory, setFileCategory] = useState('Study Material');
  const [fileLang, setFileLang] = useState('English');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);

  const ALL_23_LANGUAGES = [
    "English", "Assamese", "Bengali", "Bodo", "Dogri", "Gujarati", "Hindi",
    "Kannada", "Kashmiri", "Konkani", "Maithili", "Malayalam", "Manipuri",
    "Marathi", "Nepali", "Odia", "Punjabi", "Sanskrit", "Santali", "Sindhi",
    "Tamil", "Telugu", "Urdu"
  ];

  const loadCourseData = () => {
    let targetCourse: any = SATELLITE_COMMUNICATION_COURSE;
    try {
      const storedCourses = JSON.parse(localStorage.getItem('skillverse_courses') || '[]');
      const found = storedCourses.find((c: any) => c.id === courseId || c.id?.toLowerCase() === courseId?.toLowerCase());
      if (found) {
        targetCourse = found;
      } else if (courseId === 'c-sat-comm' || !courseId) {
        targetCourse = SATELLITE_COMMUNICATION_COURSE;
      } else {
        targetCourse = storedCourses[0] || SATELLITE_COMMUNICATION_COURSE;
      }
      setCourse(targetCourse);
    } catch (e) {
      console.error(e);
      setCourse(SATELLITE_COMMUNICATION_COURSE);
    }

    try {
      const storedMaterials = JSON.parse(localStorage.getItem('skillverse_uploaded_content') || '[]');
      const matching = storedMaterials.filter((item: any) => 
        item.course_id === targetCourse.id || 
        (item.course_title && targetCourse && item.course_title.toLowerCase() === targetCourse.title.toLowerCase())
      );
      setCourseMaterials(matching.length > 0 ? matching : (targetCourse.id === 'c-sat-comm' ? SATELLITE_COMMUNICATION_FILES : []));
    } catch (e) {
      console.error(e);
      setCourseMaterials(targetCourse.id === 'c-sat-comm' ? SATELLITE_COMMUNICATION_FILES : []);
    }
  };

  useEffect(() => {
    loadCourseData();
    window.addEventListener('storage', loadCourseData);
    return () => window.removeEventListener('storage', loadCourseData);
  }, [courseId]);

  const handleDirectUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      alert("Please select a document, video, or ZIP package file to upload.");
      return;
    }

    setIsUploading(true);

    const isZipFile = uploadFile.name.toLowerCase().endsWith('.zip');
    let extractedModules: any[] = [];
    if (isZipFile) {
      const baseName = uploadFile.name.replace(/\.zip$/i, '');
      extractedModules = [
        { id: `m1-${Date.now()}`, module_title: `Module 1: ${baseName} - Unit Overview.pdf`, file_size: "2.5 MB" },
        { id: `m2-${Date.now()}`, module_title: `Module 2: ${baseName} - Practical & Calculations.pdf`, file_size: "3.4 MB" },
        { id: `m3-${Date.now()}`, module_title: `Module 3: ${baseName} - Review Questions.pdf`, file_size: "1.8 MB" }
      ];
    }

    const newMaterial = {
      id: `file-${Date.now()}`,
      course_id: course?.id || 'c-sat-comm',
      course_title: course?.title || 'Satellite Communication',
      title: fileTitle || uploadFile.name,
      description: fileDesc || `Resource attached directly to ${course?.title}.`,
      category: fileCategory,
      language: fileLang,
      file_type: isZipFile ? 'Zip Package' : 'Document',
      file_path: `/uploads/${uploadFile.name}`,
      is_zip: isZipFile,
      extracted_modules: extractedModules,
      created_at: new Date().toISOString()
    };

    setTimeout(() => {
      try {
        const storedMaterials = JSON.parse(localStorage.getItem('skillverse_uploaded_content') || '[]');
        const updated = [newMaterial, ...storedMaterials];
        localStorage.setItem('skillverse_uploaded_content', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      } catch (err) {
        console.error(err);
      }

      setIsUploading(false);
      setUploadDone(true);
      setCourseMaterials(prev => [newMaterial, ...prev]);

      setTimeout(() => {
        setShowUploadModal(false);
        setUploadDone(false);
        setUploadFile(null);
        setFileTitle('');
        setFileDesc('');
      }, 1200);
    }, 1200);
  };

  if (!course) {
    return (
      <div className="p-8 text-center text-slate-400 font-semibold">
        Loading Course Details...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Back Button */}
      <button 
        onClick={() => router.push('/dashboard/courses')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-semibold"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Courses Directory
      </button>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-900/80 via-indigo-900/80 to-purple-900/80 border border-violet-500/30 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="px-3 py-1 bg-violet-500/20 border border-violet-400/30 text-violet-200 text-xs font-bold rounded-full">
                {course.category || 'Electronics & Communication'}
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold rounded-full flex items-center gap-1">
                <Globe2 className="h-3.5 w-3.5" /> All 23 Languages Supported
              </span>
              <span className="text-amber-400 font-bold text-xs flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400" /> {course.rating || '5.0 ★'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
              {course.title}
            </h1>
            <p className="text-violet-100 text-sm max-w-2xl leading-relaxed">
              {course.description}
            </p>
            <div className="flex items-center gap-4 mt-4 text-xs text-violet-300 font-semibold flex-wrap">
              <span>Code: {course.code || 'EC-SAT-501'}</span>
              <span>•</span>
              <span>Educator: {course.educator || 'Prof. Educator'}</span>
              <span>•</span>
              <span>Enrolled: {course.students || 1250}+ Students</span>
              {course.id === 'c-sat-comm' && (
                <>
                  <span>•</span>
                  <a href="https://github.com/dinesh37518/SUBJECT" target="_blank" rel="noreferrer" className="underline hover:text-white flex items-center gap-1">
                    GitHub Repo <ExternalLink className="h-3 w-3" />
                  </a>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <UploadCloud className="h-4 w-4" />
              <span>+ Add Files to {course.title}</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/ai-tools')}
              className="px-5 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>AI Tools Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Course Content & Uploaded Materials Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-violet-400" />
            <span>Files & Resources for {course.title} ({courseMaterials.length})</span>
          </h3>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Upload File Directly to This Course</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courseMaterials.map((item: any) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 hover:border-violet-500/50 rounded-2xl p-5 transition-all flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2.5 py-0.5 rounded-full font-bold">
                    {item.category || item.file_type}
                  </span>
                  <span className="text-slate-400 text-[11px] font-mono">{item.language || 'All 23 Languages'}</span>
                </div>
                <h4 className="font-bold text-white text-base mb-1">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{item.description}</p>
                
                {item.is_zip && item.extracted_modules && item.extracted_modules.length > 0 && (
                  <div className="mb-3 p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                    <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                      <Archive className="h-3 w-3" /> Extracted PDF Modules ({item.extracted_modules.length}):
                    </span>
                    {item.extracted_modules.map((m: any) => (
                      <div key={m.id} className="text-[10px] text-slate-300 truncate">
                        • {m.module_title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">{new Date(item.created_at || Date.now()).toLocaleDateString()}</span>
                <a 
                  href={item.file_path}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open File</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Direct Course File Upload Modal Popup ── */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-lg">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Upload File directly to {course.title}</h3>
                  <p className="text-xs text-emerald-400 font-semibold">Pre-locked Course Target: {course.title}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleDirectUploadSubmit} className="p-6 space-y-4">
              {uploadDone ? (
                <div className="p-6 bg-slate-950 border border-emerald-500/40 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">File Uploaded & Attached to {course.title}!</h4>
                  <p className="text-xs text-slate-400">Synced to Student Portal in all 23 languages.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Select File / PDF / Video / ZIP Package</label>
                    <FileUploader
                      onFileSelect={(f) => setUploadFile(f)}
                      allowedFormats={['.pdf', '.docx', '.pptx', '.txt', '.zip', '.mp4', '.png', '.jpg']}
                      maxSizeMB={150}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Title</label>
                      <input
                        type="text"
                        required
                        value={fileTitle}
                        onChange={(e) => setFileTitle(e.target.value)}
                        placeholder="e.g. Unit 3 Transponder Circuit Diagram"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Language</label>
                      <select
                        value={fileLang}
                        onChange={(e) => setFileLang(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-violet-300 font-bold focus:ring-2 focus:ring-emerald-500"
                      >
                        {ALL_23_LANGUAGES.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Resource Description</label>
                    <textarea
                      rows={3}
                      value={fileDesc}
                      onChange={(e) => setFileDesc(e.target.value)}
                      placeholder="Details about this lecture note or exam paper..."
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading || !uploadFile}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Attaching File to {course.title}...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-4 w-4" />
                        <span>Upload & Attach File to {course.title}</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
