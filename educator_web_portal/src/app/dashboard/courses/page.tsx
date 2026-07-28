"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Plus, Edit2, Archive, CheckCircle, Trash2, RefreshCw, ExternalLink, FileText, Table } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import { Course } from '../../../types';

export const SATELLITE_COMMUNICATION_COURSE = {
  id: 'c-sat-comm',
  title: 'Satellite Communication',
  code: 'EC-SAT-501',
  category: 'Electronics & Communication',
  language: 'All 23 Languages',
  duration_hours: 45,
  educator: 'Prof. Educator',
  rating: '5.0 ★',
  students: 1250,
  is_published: true,
  status: 'published',
  description: 'Complete Satellite Communication course covering satellite orbits, link budget, transponders, earth station technology, 2-mark question banks, Part-B spreadsheets, and university semester exam question papers.',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const SATELLITE_COMMUNICATION_FILES = [
  {
    id: 'sat-file-1',
    course_id: 'c-sat-comm',
    course_title: 'Satellite Communication',
    title: 'SC Syllabus.pdf',
    description: 'Official Satellite Communication Unit-wise Syllabus & Learning Outcomes.',
    category: 'Syllabus',
    language: 'English',
    file_type: 'PDF Document',
    file_path: 'https://raw.githubusercontent.com/dinesh37518/SUBJECT/main/SC%20Syllabus.pdf',
    created_at: new Date().toISOString()
  },
  {
    id: 'sat-file-2',
    course_id: 'c-sat-comm',
    course_title: 'Satellite Communication',
    title: '2 MARKS Question bank.pdf',
    description: '2 Marks Short Question & Answer Bank for all 5 Units.',
    category: 'Question Bank',
    language: 'English',
    file_type: 'PDF Document',
    file_path: 'https://raw.githubusercontent.com/dinesh37518/SUBJECT/main/2%20MARKS%20Question%20bank.pdf',
    created_at: new Date().toISOString()
  },
  {
    id: 'sat-file-3',
    course_id: 'c-sat-comm',
    course_title: 'Satellite Communication',
    title: 'SC Part B.xlsx',
    description: 'Part-B 13/16 Marks Important Questions Matrix & Unit Breakdown Spreadsheet.',
    category: 'Spreadsheet',
    language: 'English',
    file_type: 'Excel Spreadsheet',
    file_path: 'https://raw.githubusercontent.com/dinesh37518/SUBJECT/main/SC%20Part%20B.xlsx',
    created_at: new Date().toISOString()
  },
  {
    id: 'sat-file-4',
    course_id: 'c-sat-comm',
    course_title: 'Satellite Communication',
    title: 'APR MAY 2025.pdf',
    description: 'University Semester Examination Question Paper (April / May 2025).',
    category: 'Exam Paper',
    language: 'English',
    file_type: 'PDF Document',
    file_path: 'https://raw.githubusercontent.com/dinesh37518/SUBJECT/main/APR%20MAY%202025.pdf',
    created_at: new Date().toISOString()
  },
  {
    id: 'sat-file-5',
    course_id: 'c-sat-comm',
    course_title: 'Satellite Communication',
    title: 'NOV DEC 2024.pdf',
    description: 'University Semester Examination Question Paper (Nov / Dec 2024).',
    category: 'Exam Paper',
    language: 'English',
    file_type: 'PDF Document',
    file_path: 'https://raw.githubusercontent.com/dinesh37518/SUBJECT/main/NOV%20DEC%202024.pdf',
    created_at: new Date().toISOString()
  },
  {
    id: 'sat-file-6',
    course_id: 'c-sat-comm',
    course_title: 'Satellite Communication',
    title: 'NOV DEC 2025.pdf',
    description: 'University Semester Examination Question Paper (Nov / Dec 2025).',
    category: 'Exam Paper',
    language: 'English',
    file_type: 'PDF Document',
    file_path: 'https://raw.githubusercontent.com/dinesh37518/SUBJECT/main/NOV%20DEC%202025.pdf',
    created_at: new Date().toISOString()
  },
  {
    id: 'sat-file-7',
    course_id: 'c-sat-comm',
    course_title: 'Satellite Communication',
    title: 'APR MAY 2026 21 REG.pdf',
    description: 'Model Examination Question Paper - 2021 Regulation (April / May 2026).',
    category: 'Model Paper',
    language: 'English',
    file_type: 'PDF Document',
    file_path: 'https://raw.githubusercontent.com/dinesh37518/SUBJECT/main/APR%20MAY%202026%2021%20REG.pdf',
    created_at: new Date().toISOString()
  },
  {
    id: 'sat-file-8',
    course_id: 'c-sat-comm',
    course_title: 'Satellite Communication',
    title: 'APR MAY 2026 23 REG.pdf',
    description: 'Model Examination Question Paper - 2023 Regulation (April / May 2026).',
    category: 'Model Paper',
    language: 'English',
    file_type: 'PDF Document',
    file_path: 'https://raw.githubusercontent.com/dinesh37518/SUBJECT/main/APR%20MAY%202026%2023%20REG.pdf',
    created_at: new Date().toISOString()
  }
];

export default function CourseManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [courses, setCourses] = useState<Course[]>([]);

  const seedDefaultCourses = () => {
    try {
      // Enforce strictly ONLY Satellite Communication course
      const finalCourses = [SATELLITE_COMMUNICATION_COURSE];
      localStorage.setItem('skillverse_courses', JSON.stringify(finalCourses));

      // Enforce strictly ONLY Satellite Communication files
      const finalUploads = [...SATELLITE_COMMUNICATION_FILES];
      localStorage.setItem('skillverse_uploaded_content', JSON.stringify(finalUploads));

      setCourses(finalCourses as any);
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error(e);
      setCourses([SATELLITE_COMMUNICATION_COURSE as any]);
    }
  };


  useEffect(() => {
    seedDefaultCourses();
    window.addEventListener('storage', seedDefaultCourses);
    return () => window.removeEventListener('storage', seedDefaultCourses);
  }, []);

  const handleClearAllCourses = () => {
    if (confirm("Are you sure you want to clear all existing courses?")) {
      localStorage.setItem('skillverse_courses', JSON.stringify([]));
      localStorage.setItem('skillverse_uploaded_content', JSON.stringify([]));
      window.dispatchEvent(new Event('storage'));
      setCourses([]);
    }
  };

  const columns = [
    {
      header: "Title & Details",
      accessor: (c: Course) => (
        <div>
          <span className="font-semibold text-white text-sm hover:text-violet-400 transition-colors block">{c.title}</span>
          <span className="text-xs text-slate-400 line-clamp-1">{c.description || (c as any).desc}</span>
        </div>
      )
    },
    {
      header: "Category",
      accessor: (c: Course) => (
        <span className="px-2.5 py-1 bg-violet-500/20 text-violet-300 rounded-full text-xs border border-violet-500/30 font-semibold">
          {c.category || (c as any).badge || 'Electronics'}
        </span>
      )
    },
    {
      header: "Language",
      accessor: (c: Course) => (
        <span className="text-xs font-mono text-violet-300">
          {c.language || 'All 23 Languages'}
        </span>
      )
    },
    {
      header: "Status",
      accessor: (c: Course) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-emerald-950/50 text-emerald-400 border-emerald-500/30">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {c.status || 'published'}
        </span>
      )
    },
    {
      header: "Actions",
      accessor: (c: Course) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => router.push(`/dashboard/courses/${c.id}`)}
            className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            title="Manage Course & Files"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Manage</span>
          </button>
        </div>
      )
    }
  ];

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.category && c.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Course Management Directory</h2>
          <p className="text-slate-400 text-xs mt-1">Manage vocational courses, syllabus resources, and repository files.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={seedDefaultCourses}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-300 transition-all cursor-pointer shadow-md"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Sync Default Courses & Repository Files</span>
          </button>
          <button
            onClick={handleClearAllCourses}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 rounded-xl text-xs font-bold text-red-300 transition-all cursor-pointer shadow-md"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Courses</span>
          </button>
          <button
            onClick={() => router.push('/dashboard/courses/create')}
            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl font-bold text-xs text-white transition-all cursor-pointer shadow-lg shadow-violet-600/20"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Add New Course</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search courses by name or category..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="h-4.5 w-4.5 text-slate-500" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as 'all' | 'published' | 'draft' | 'archived')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Courses List Table */}
      {courses.length === 0 ? (
        <div className="p-12 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-4 shadow-xl">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-violet-400">
            <CheckCircle className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No active courses in directory.</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Click "Sync Satellite Communication Course" to reload the Satellite Communication repository course and files.
            </p>
          </div>
          <button
            onClick={seedDefaultCourses}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Load Default Educator Courses
          </button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredCourses}
          onRowClick={(c) => router.push(`/dashboard/courses/${c.id}`)}
          emptyStateText="No courses match your active search filter."
        />
      )}
    </div>
  );
}
