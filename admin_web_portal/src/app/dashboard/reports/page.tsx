"use client";

import { useState } from 'react';
import { FileSpreadsheet, Download, Calendar, Filter, FileText, CheckCircle2 } from 'lucide-react';

export default function ReportsGenerator() {
  const [reportType, setReportType] = useState('student');
  const [dateRange, setDateRange] = useState('30days');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const reports = [
    { title: "Student progress & enrollment matrix", desc: "Detailed records on quiz scores, course hours and student profiles.", format: "CSV", size: "2.4 MB" },
    { title: "Educator class hours log", desc: "Records live stream connections durations, classes counts and departments.", format: "PDF", size: "1.1 MB" },
    { title: "AI usage token allocation summaries", desc: "Monitors translation requests counts and Groq query bounds.", format: "CSV", size: "640 KB" },
    { title: "Course completion rates & certificate ledger", desc: "Lists authorized vocational certificate numbers and achievements rates.", format: "PDF", size: "820 KB" }
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Audit & Report Generator</h2>
        <p className="text-slate-400 mt-1">Export database analytics sheets, student rosters, and AI engine logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Form Panel */}
        <form onSubmit={handleGenerate} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-base font-semibold border-b border-slate-800 pb-2">Export Parameters</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Report Category</label>
            <select
              value={reportType}
              onChange={e => setReportType(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-400 focus:outline-none"
            >
              <option value="student">Student Performance Ledger</option>
              <option value="educator">Educator Load Ledger</option>
              <option value="course">Course Completions Index</option>
              <option value="ai">AI Pipeline Token Allocation Logs</option>
              <option value="platform">Platform General Audit Logs</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Time Horizon</label>
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-400 focus:outline-none"
            >
              <option value="7days">Past 7 Days</option>
              <option value="30days">Past 30 Days</option>
              <option value="90days">Past Quarter (90 Days)</option>
              <option value="year">Past Fiscal Year</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-sky-600 hover:bg-sky-500 rounded-xl font-semibold text-white transition-all cursor-pointer flex justify-center items-center gap-2"
          >
            <Download className="h-4.5 w-4.5" />
            Generate Document
          </button>
        </form>

        {/* List Panel */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold">Pre-compiled Reports</h3>
            <span className="text-xs text-slate-500 font-medium">Updated 4 hours ago</span>
          </div>

          {downloadSuccess && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex gap-2 items-center">
              <CheckCircle2 className="h-5 w-5" />
              <span>Report generated successfully. Check your local downloads folder.</span>
            </div>
          )}

          <div className="space-y-4">
            {reports.map((rep, idx) => (
              <div 
                key={idx}
                className="bg-slate-900 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between gap-6 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-sky-400">
                    {rep.format === 'CSV' ? <FileSpreadsheet className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{rep.title}</h4>
                    <p className="text-slate-400 text-xs mt-1">{rep.desc}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setDownloadSuccess(true);
                    setTimeout(() => setDownloadSuccess(false), 2500);
                  }}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:bg-slate-850 text-xs font-semibold text-slate-300 hover:text-white rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
