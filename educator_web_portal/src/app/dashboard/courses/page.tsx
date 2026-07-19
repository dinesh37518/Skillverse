"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Plus, Edit2, Archive, CheckCircle, Trash2 } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import { Course } from '../../../types';

export default function CourseManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 'course-1',
      title: 'Hydraulic Systems for Industrial Plants',
      description: 'Master hydraulic systems safety limits and valve controls.',
      category: 'Mechanical',
      language: 'Hindi',
      duration_hours: 12,
      is_published: true,
      status: 'published',
      created_at: '2026-07-01T10:00:00Z',
      updated_at: '2026-07-06T12:00:00Z'
    },
    {
      id: 'course-2',
      title: 'PLC Programming Fundamentals',
      description: 'Introduction to basic ladder logic and automation registries.',
      category: 'Electrical',
      language: 'English',
      duration_hours: 15,
      is_published: false,
      status: 'draft',
      created_at: '2026-07-04T08:00:00Z',
      updated_at: '2026-07-04T08:00:00Z'
    },
    {
      id: 'course-3',
      title: 'Basic Carpentry Joint Assemblies',
      description: 'Detailed practical training for mortise and tenon wood joining.',
      category: 'Carpentry',
      language: 'Malayalam',
      duration_hours: 6,
      is_published: true,
      status: 'published',
      created_at: '2026-06-20T14:30:00Z',
      updated_at: '2026-06-25T16:00:00Z'
    }
  ]);

  const handleAction = (courseId: string, action: 'publish' | 'archive' | 'delete') => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        if (action === 'publish') return { ...c, is_published: true, status: 'published' as const };
        if (action === 'archive') return { ...c, is_published: false, status: 'archived' as const };
      }
      return c;
    }).filter(c => !(action === 'delete' && c.id === courseId)));
    
    alert(`Course ${courseId} status changed: ${action}`);
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'Course Title',
      accessor: (c: Course) => (
        <div>
          <p className="font-semibold text-white">{c.title}</p>
          <span className="text-xs text-slate-500">{c.category} • {c.duration_hours} hrs</span>
        </div>
      )
    },
    {
      header: 'Language',
      accessor: (c: Course) => <span className="text-slate-400">{c.language}</span>
    },
    {
      header: 'Status',
      accessor: (c: Course) => {
        const styles = {
          published: 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20',
          draft: 'bg-amber-950/40 text-amber-400 border-amber-500/20',
          archived: 'bg-slate-950/40 text-slate-400 border-slate-800'
        };
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[c.status]}`}>
            {c.status.toUpperCase()}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      accessor: (c: Course) => (
        <div className="flex gap-2 justify-end" onClick={e => e.stopPropagation()}>
          <button 
            onClick={() => router.push(`/dashboard/courses/edit/${c.id}`)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Edit Details"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          {c.status !== 'published' && (
            <button 
              onClick={() => handleAction(c.id, 'publish')}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-emerald-500 hover:text-emerald-400 transition-colors"
              title="Publish Course"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
          )}
          {c.status !== 'archived' && (
            <button 
              onClick={() => handleAction(c.id, 'archive')}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-400 transition-colors"
              title="Archive Course"
            >
              <Archive className="h-4 w-4" />
            </button>
          )}
          <button 
            onClick={() => handleAction(c.id, 'delete')}
            className="p-1.5 hover:bg-red-950/40 rounded-lg text-red-500 hover:text-red-400 transition-colors"
            title="Delete Course"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
      className: 'text-right'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Course Builder</h2>
          <p className="text-slate-400 mt-1">Create, edit, and organize vocational syllabuses and categories.</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/courses/create')}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold text-white transition-colors cursor-pointer"
        >
          <Plus className="h-5 w-5" />
          Create Course
        </button>
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
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="h-4.5 w-4.5 text-slate-500" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as 'all' | 'published' | 'draft' | 'archived')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Courses List Table */}
      <DataTable
        columns={columns}
        data={filteredCourses}
        onRowClick={(c) => router.push(`/dashboard/courses/edit/${c.id}`)}
        emptyStateText="No courses match your active search filter."
      />
    </div>
  );
}
