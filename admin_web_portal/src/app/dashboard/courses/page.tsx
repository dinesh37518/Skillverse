"use client";

import { useState } from 'react';
import { Search, Filter, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import { Course } from '../../../types';

export default function CourseManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [courses, setCourses] = useState<Course[]>([
    {
      id: 'course-1',
      title: 'Hydraulic Systems safety controls',
      educator_name: 'Priya Patel',
      category: 'Mechanical',
      language: 'Hindi',
      status: 'published',
      students_enrolled: 145,
      created_at: '2026-07-01T10:00:00Z'
    },
    {
      id: 'course-2',
      title: 'PLC Ladder Logic basics setup',
      educator_name: 'Ravi Kumar',
      category: 'Electrical',
      language: 'English',
      status: 'pending_approval',
      students_enrolled: 0,
      created_at: '2026-07-06T08:00:00Z'
    },
    {
      id: 'course-3',
      title: 'Introduction to Joint Assembly mortise',
      educator_name: 'Ravi Kumar',
      category: 'Carpentry',
      language: 'Malayalam',
      status: 'archived',
      students_enrolled: 82,
      created_at: '2026-06-20T14:30:00Z'
    }
  ]);

  const handleApprove = (id: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: 'published' as const };
      }
      return c;
    }));
    alert("Course approved successfully and published!");
  };

  const handleArchive = (id: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: 'archived' as const };
      }
      return c;
    }));
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this course syllabus?")) {
      setCourses(prev => prev.filter(c => c.id !== id));
    }
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.educator_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'Course Information',
      accessor: (c: Course) => (
        <div>
          <p className="font-semibold text-white">{c.title}</p>
          <span className="text-xs text-slate-500">Instructor: {c.educator_name} • {c.category}</span>
        </div>
      )
    },
    {
      header: 'Language',
      accessor: (c: Course) => <span className="text-slate-400">{c.language}</span>
    },
    {
      header: 'Students Enrolled',
      accessor: (c: Course) => <span className="text-slate-400 font-semibold">{c.students_enrolled}</span>
    },
    {
      header: 'Audit Status',
      accessor: (c: Course) => {
        const styles = {
          published: 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20',
          draft: 'bg-amber-950/40 text-amber-400 border-amber-500/20',
          pending_approval: 'bg-indigo-950/40 text-indigo-400 border-indigo-500/20',
          archived: 'bg-slate-950/40 text-slate-400 border-slate-800'
        };
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[c.status]}`}>
            {c.status.replace('_', ' ').toUpperCase()}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      accessor: (c: Course) => (
        <div className="flex gap-2 justify-end">
          {c.status === 'pending_approval' && (
            <button 
              onClick={() => handleApprove(c.id)}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-emerald-500 hover:text-emerald-400 transition-colors"
              title="Approve Course"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
          )}
          {c.status !== 'archived' && (
            <button 
              onClick={() => handleArchive(c.id)}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Archive Course"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
          <button 
            onClick={() => handleDelete(c.id)}
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
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Syllabus & Course Audit</h2>
        <p className="text-slate-400 mt-1">Review active courses, manage catalog tags, and authorize syllabus publication requests.</p>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search courses by name or educator..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="h-4.5 w-4.5 text-slate-500" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table list */}
      <DataTable
        columns={columns}
        data={filteredCourses}
        emptyText="No courses match the active filters."
      />
    </div>
  );
}
