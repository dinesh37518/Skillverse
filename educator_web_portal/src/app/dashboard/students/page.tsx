"use client";

import { useState } from 'react';
import { Users, Search, BookOpen, Star, Clock } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import { StudentProgress } from '../../../types';

export default function StudentRoster() {
  const [searchQuery, setSearchQuery] = useState('');

  const [roster] = useState<StudentProgress[]>([
    {
      id: 'std-1',
      student_name: 'Amit Patel',
      course_title: 'Hydraulic Systems',
      completion_rate: 85,
      quiz_average: 92,
      attendance_rate: 100,
      watch_time_mins: 145,
      last_active: '10 mins ago'
    },
    {
      id: 'std-2',
      student_name: 'Suresh Nair',
      course_title: 'PLC Fundamentals',
      completion_rate: 45,
      quiz_average: 78,
      attendance_rate: 85,
      watch_time_mins: 90,
      last_active: '2 hours ago'
    },
    {
      id: 'std-3',
      student_name: 'Pooja Sharma',
      course_title: 'Hydraulic Systems',
      completion_rate: 100,
      quiz_average: 96,
      attendance_rate: 100,
      watch_time_mins: 180,
      last_active: 'Yesterday'
    }
  ]);

  const filteredRoster = roster.filter(s =>
    s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.course_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: 'Student Name',
      accessor: (s: StudentProgress) => (
        <div>
          <p className="font-semibold text-white">{s.student_name}</p>
          <span className="text-xs text-slate-500">ID: {s.id}</span>
        </div>
      )
    },
    {
      header: 'Enrolled Course',
      accessor: (s: StudentProgress) => (
        <span className="text-slate-400 font-medium">{s.course_title}</span>
      )
    },
    {
      header: 'Completion Rate',
      accessor: (s: StudentProgress) => (
        <div className="flex items-center gap-3">
          <div className="w-20 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="bg-violet-600 h-full" 
              style={{ width: `${s.completion_rate}%` }}
            />
          </div>
          <span className="text-xs text-slate-400 font-bold">{s.completion_rate}%</span>
        </div>
      )
    },
    {
      header: 'Quiz Average',
      accessor: (s: StudentProgress) => (
        <span className="flex items-center gap-1 text-slate-400 font-semibold text-xs">
          <Star className="h-4 w-4 text-amber-500" /> {s.quiz_average}%
        </span>
      )
    },
    {
      header: 'Uptime Watch',
      accessor: (s: StudentProgress) => (
        <span className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
          <Clock className="h-4 w-4" /> {s.watch_time_mins} mins
        </span>
      )
    },
    {
      header: 'Last Active',
      accessor: (s: StudentProgress) => (
        <span className="text-slate-500 text-xs font-semibold">{s.last_active}</span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Student Roster</h2>
        <p className="text-slate-400 mt-1">Monitor course tracking benchmarks and evaluations grades.</p>
      </div>

      {/* Search Toolbar */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
        <input
          type="text"
          placeholder="Search students by name or course..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Roster list table */}
      <DataTable
        columns={columns}
        data={filteredRoster}
        emptyStateText="No students found matching your query."
      />
    </div>
  );
}
