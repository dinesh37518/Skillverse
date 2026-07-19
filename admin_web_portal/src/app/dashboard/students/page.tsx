"use client";

import { useState } from 'react';
import { Search, GraduationCap, Star, Calendar, Award } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import { Student } from '../../../types';

export default function StudentDirectory() {
  const [searchQuery, setSearchQuery] = useState('');

  const [students] = useState<Student[]>([
    {
      id: 'std-1',
      full_name: 'Amit Patel',
      email: 'amit.patel@gmail.com',
      courses_enrolled: 2,
      completion_rate: 85,
      certificates_earned: 1,
      attendance_rate: 100,
      last_active: '10 mins ago'
    },
    {
      id: 'std-2',
      full_name: 'Suresh Nair',
      email: 'suresh.nair@gmail.com',
      courses_enrolled: 1,
      completion_rate: 45,
      certificates_earned: 0,
      attendance_rate: 85,
      last_active: '2 hours ago'
    },
    {
      id: 'std-3',
      full_name: 'Pooja Sharma',
      email: 'pooja.sharma@gmail.com',
      courses_enrolled: 3,
      completion_rate: 100,
      certificates_earned: 2,
      attendance_rate: 100,
      last_active: 'Yesterday'
    }
  ]);

  const filteredStudents = students.filter(s =>
    s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: 'Student Name',
      accessor: (s: Student) => (
        <div>
          <p className="font-semibold text-white">{s.full_name}</p>
          <span className="text-xs text-slate-500">{s.email}</span>
        </div>
      )
    },
    {
      header: 'Enrolled Courses',
      accessor: (s: Student) => <span className="text-slate-400 font-semibold">{s.courses_enrolled} courses</span>
    },
    {
      header: 'Progress Metrics',
      accessor: (s: Student) => (
        <div className="flex items-center gap-3">
          <div className="w-20 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="bg-sky-600 h-full" 
              style={{ width: `${s.completion_rate}%` }}
            />
          </div>
          <span className="text-xs text-slate-400 font-bold">{s.completion_rate}%</span>
        </div>
      )
    },
    {
      header: 'Attendance',
      accessor: (s: Student) => <span className="text-slate-400 font-semibold">{s.attendance_rate}%</span>
    },
    {
      header: 'Certificates',
      accessor: (s: Student) => (
        <span className="flex items-center gap-1 text-sky-400 font-bold text-xs">
          <Award className="h-4 w-4 text-sky-500" /> {s.certificates_earned} earned
        </span>
      )
    },
    {
      header: 'Last Active',
      accessor: (s: Student) => <span className="text-slate-500 text-xs font-semibold">{s.last_active}</span>
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Student Directory</h2>
        <p className="text-slate-400 mt-1">Audit platform student accounts, inspect completion ratios, and track certifications.</p>
      </div>

      {/* Filter toolbar */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
        <input
          type="text"
          placeholder="Search students by name or email..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
        />
      </div>

      {/* Roster list table */}
      <DataTable
        columns={columns}
        data={filteredStudents}
        emptyText="No student profiles match active query query."
      />
    </div>
  );
}
