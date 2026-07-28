"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2, CheckCircle2 } from 'lucide-react';

interface EditCoursePageProps {
  params: Promise<{ id: string }>;
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Mechanical');
  const [language, setLanguage] = useState('English');
  const [description, setDescription] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const DEFAULT_COURSES = [
      { id: 'course-1', title: 'Satellite Communication Orbits & Link Budget', category: 'Electronics & Communication', language: 'Hindi', description: 'Master satellite orbits, link budget equations, and transponder frequency controls.' },
      { id: 'course-2', title: 'PLC Programming Fundamentals', category: 'Electrical', language: 'English', description: 'Introduction to basic ladder logic and automation registries.' },
      { id: 'course-3', title: 'Basic Carpentry Joint Assemblies', category: 'Carpentry', language: 'Malayalam', description: 'Detailed practical training for mortise and tenon wood joining.' }
    ];

    try {
      const stored = localStorage.getItem('skillverse_courses');
      let customCourses: any[] = [];
      if (stored) customCourses = JSON.parse(stored);
      const allCourses = [...customCourses, ...DEFAULT_COURSES];
      const match = allCourses.find(c => c.id === courseId || c.id.endsWith(courseId)) || allCourses[0];
      
      setTitle(match.title || '');
      setCategory(match.category || 'Mechanical');
      setLanguage(match.language || 'English');
      setDescription(match.description || match.desc || '');
    } catch (e) {
      console.error(e);
    }
  }, [courseId]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      router.push(`/dashboard/courses/${courseId}`);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <button 
        onClick={() => router.push('/dashboard/courses')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-semibold"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Course List
      </button>

      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Edit Course Details</h2>
        <p className="text-slate-400 text-xs mt-1">Update syllabus details, category, or language preference.</p>
      </div>

      {saved ? (
        <div className="p-8 bg-slate-900 border border-emerald-500/30 rounded-2xl text-center space-y-3">
          <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Course Updated Successfully!</h3>
          <p className="text-xs text-slate-400">Redirecting to course details...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-5 shadow-xl">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Course Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="Mechanical">Mechanical</option>
                <option value="Electrical">Electrical</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Carpentry">Carpentry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Primary Teaching Language</label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-800">
            <button
              type="submit"
              className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl font-bold text-xs text-white transition-all cursor-pointer flex items-center gap-2"
            >
              <Save className="h-4 w-4" /> Save Course Changes
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard/courses')}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-xs text-slate-300 transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
