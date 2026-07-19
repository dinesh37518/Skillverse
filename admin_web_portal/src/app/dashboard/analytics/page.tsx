"use client";

import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Legend, PieChart, Pie, Cell
} from 'recharts';

export default function PlatformAnalytics() {
  const userGrowth = [
    { month: 'Jan', students: 1200, educators: 18 },
    { month: 'Feb', students: 1800, educators: 22 },
    { month: 'Mar', students: 2500, educators: 25 },
    { month: 'Apr', students: 3100, educators: 28 },
    { month: 'May', students: 4000, educators: 32 },
    { month: 'Jun', students: 4821, educators: 34 },
  ];

  const languageUsage = [
    { name: 'Hindi', value: 40 },
    { name: 'English', value: 25 },
    { name: 'Malayalam', value: 15 },
    { name: 'Bengali', value: 12 },
    { name: 'Odia', value: 8 },
  ];

  const videoUsage = [
    { name: 'Mon', views: 80 },
    { name: 'Tue', views: 120 },
    { name: 'Wed', views: 160 },
    { name: 'Thu', views: 140 },
    { name: 'Fri', views: 190 },
    { name: 'Sat', views: 240 },
    { name: 'Sun', views: 310 },
  ];

  const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Platform Metrics & Analytics</h2>
        <p className="text-slate-400 mt-1">Review user onboarding paths, localized translations, and live streaming indexes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User growth */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-semibold">User Onboarding Growth</h3>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                <Legend />
                <Line type="monotone" dataKey="students" stroke="#0284c7" strokeWidth={2.5} name="Total Students" />
                <Line type="monotone" dataKey="educators" stroke="#10b981" strokeWidth={2} name="Total Trainers" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Language usage pie */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-semibold">Primary Platform Languages Usage (%)</h3>
          <div className="h-80 w-full text-xs flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageUsage}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {languageUsage.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Video Usage area */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 lg:col-span-2">
          <h3 className="text-base font-semibold">Weekly Video Views count</h3>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={videoUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                <Area type="monotone" dataKey="views" stroke="#0284c7" fill="#0284c7" fillOpacity={0.1} strokeWidth={2.5} name="Views" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
