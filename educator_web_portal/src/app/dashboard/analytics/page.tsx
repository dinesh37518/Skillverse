"use client";

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Legend
} from 'recharts';
import { COURSE_CATEGORIES } from '../../../lib/constants';

export default function AnalyticsDashboard() {
  const enrollmentData = [
    { name: 'Jan', students: 400, courses: 3 },
    { name: 'Feb', students: 600, courses: 4 },
    { name: 'Mar', students: 800, courses: 4 },
    { name: 'Apr', students: 950, courses: 5 },
    { name: 'May', students: 1100, courses: 6 },
    { name: 'Jun', students: 1248, courses: 8 },
  ];

  const watchTimeData = [
    { name: 'Mon', minutes: 120 },
    { name: 'Tue', minutes: 180 },
    { name: 'Wed', minutes: 240 },
    { name: 'Thu', minutes: 210 },
    { name: 'Fri', minutes: 300 },
    { name: 'Sat', minutes: 380 },
    { name: 'Sun', minutes: 450 },
  ];

  const categoryShare = [
    { name: 'Electrical', count: 18 },
    { name: 'Mechanical', count: 12 },
    { name: 'Plumbing', count: 8 },
    { name: 'Carpentry', count: 7 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Student Performance Analytics</h2>
        <p className="text-slate-400 mt-1">Real-time statistics covering course engagement and completions.</p>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Enrollment growth LineChart */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-semibold">Student Enrollment Growth</h3>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} 
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="students" stroke="#7c3aed" strokeWidth={2.5} name="Total Students" />
                <Line type="monotone" dataKey="courses" stroke="#06b6d4" strokeWidth={2} name="Active Courses" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Watch Time area chart */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-semibold">Weekly Watch Time (Minutes)</h3>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={watchTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} 
                  labelStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="minutes" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} strokeWidth={2} name="Watch Time" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share bar chart */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 lg:col-span-2">
          <h3 className="text-base font-semibold">Resources Count by Vocational Branch</h3>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryShare}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} 
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} name="Files Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
