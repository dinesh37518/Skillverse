"use client";

import { useState } from 'react';
import { FileSpreadsheet, Download, FileText, CheckCircle2, Filter } from 'lucide-react';

export default function ReportsGenerator() {
  const [reportType, setReportType] = useState('student');
  const [dateRange, setDateRange] = useState('30days');
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);

  const downloadCSVFile = (filename: string, csvContent: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateReportData = (type: string) => {
    if (type === 'student' || type === '0') {
      const csv = [
        "Student ID,Student Name,Email,Enrolled Course,Quiz Average (%),Course Progress (%),Last Login Timestamp,Preferred Language",
        "STU-1001,Ananya Sharma,ananya.s@gmail.com,Satellite Communication,96%,92%,2026-07-28 13:40:00,Tamil",
        "STU-1002,Karthik Raja,karthik.r@gmail.com,Satellite Communication,88%,78%,2026-07-28 12:15:00,Hindi",
        "STU-1003,Deepa Lakshmi,deepa.l@gmail.com,PLC Basics & Automation,94%,95%,2026-07-27 18:30:00,Telugu",
        "STU-1004,Ravi Kumar,ravi.k@gmail.com,Machine Learning & AI,92%,85%,2026-07-28 13:55:00,Bengali",
        "STU-1005,Priya Sundaram,priya.s@gmail.com,Electrical Engineering,90%,89%,2026-07-28 11:20:00,Malayalam",
        "STU-1006,Arjun Varma,arjun.v@gmail.com,Hydraulic Systems,95%,91%,2026-07-28 14:05:00,Assamese",
        "STU-1007,Meera Nair,meera.n@gmail.com,Robotics & Sensors,91%,87%,2026-07-28 10:45:00,Gujarati"
      ].join("\n");
      downloadCSVFile("student_progress_and_enrollment_matrix.csv", csv);
      setDownloadMessage("Downloaded: student_progress_and_enrollment_matrix.csv");
    } else if (type === 'educator' || type === '1') {
      const csv = [
        "Educator ID,Educator Name,Email,Department,Total Hosted Courses,Total Live Hours,Active Enrolled Students,Last Login Timestamp",
        "EDU-2001,Prof. Ramanathan,ramanathan@skillverse.ai,Electronics & Communication,5,128 hrs,1250,2026-07-28 13:50:00",
        "EDU-2002,Dr. Ananya Roy,ananya.roy@skillverse.ai,Computer Science & AI,4,96 hrs,890,2026-07-28 10:15:00",
        "EDU-2003,Prof. Priya Patel,priya.patel@skillverse.ai,Mechanical Engineering,3,74 hrs,640,2026-07-27 16:45:00",
        "EDU-2004,Dr. Suresh Nair,suresh.nair@skillverse.ai,Electrical Engineering,4,110 hrs,980,2026-07-28 11:30:00"
      ].join("\n");
      downloadCSVFile("educator_class_hours_and_load_log.csv", csv);
      setDownloadMessage("Downloaded: educator_class_hours_and_load_log.csv");
    } else if (type === 'ai' || type === '2') {
      const csv = [
        "AI Pipeline Node,Provider Gateway,Total API Hits,Token Allocation,Supported Languages,Avg Latency (ms),Status",
        "Gemini AI Text & Quiz Engine,Google Gemini 1.5 Flash,1450,485000 tokens,23 Scheduled Languages,320ms,Active",
        "Bhashini Scheduled Translator,MeitY Translation Gateway,8520,1240000 tokens,All 23 Indian Languages,280ms,Active",
        "Bhashini Voice Synthesis & Speech-to-Text,MeitY TTS/ASR Engine,1240,620000 tokens,Live Chrome Speech-to-Speech,190ms,Active"
      ].join("\n");
      downloadCSVFile("ai_usage_token_allocation_summaries.csv", csv);
      setDownloadMessage("Downloaded: ai_usage_token_allocation_summaries.csv");
    } else {
      const csv = [
        "Certificate ID,Student Name,Student Email,Course Title,Instructor Name,Completion Date,Grade,Certificate Status",
        "CERT-2026-9001,Ananya Sharma,ananya.s@gmail.com,Satellite Communication,Prof. Ramanathan,2026-07-20,A+ (96%),Verified & Issued",
        "CERT-2026-9002,Deepa Lakshmi,deepa.l@gmail.com,PLC Basics & Automation,Prof. Priya Patel,2026-07-22,A+ (94%),Verified & Issued",
        "CERT-2026-9003,Ravi Kumar,ravi.k@gmail.com,Machine Learning & AI,Dr. Ananya Roy,2026-07-25,A (92%),Verified & Issued",
        "CERT-2026-9004,Arjun Varma,arjun.v@gmail.com,Hydraulic Systems,Prof. Priya Patel,2026-07-26,A+ (95%),Verified & Issued"
      ].join("\n");
      downloadCSVFile("course_completion_and_certificate_ledger.csv", csv);
      setDownloadMessage("Downloaded: course_completion_and_certificate_ledger.csv");
    }

    setTimeout(() => setDownloadMessage(null), 4000);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    generateReportData(reportType);
  };

  const reports = [
    { title: "Student progress & enrollment matrix", desc: "Detailed records on quiz scores, course hours, student names, emails, and login timestamps.", format: "CSV", size: "2.4 MB", typeKey: "student" },
    { title: "Educator class hours log", desc: "Records live stream connections durations, classes counts, teacher emails, and departments.", format: "CSV", size: "1.1 MB", typeKey: "educator" },
    { title: "AI usage token allocation summaries", desc: "Monitors translation requests counts, Bhashini speech engines, and Gemini AI bounds.", format: "CSV", size: "640 KB", typeKey: "ai" },
    { title: "Course completion rates & certificate ledger", desc: "Lists authorized vocational certificate numbers, student names, and achievements rates.", format: "CSV", size: "820 KB", typeKey: "course" }
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Audit & Report Generator</h2>
        <p className="text-slate-400 mt-1">Export database analytics sheets, student rosters with names & emails, educator logs, and AI engine data directly to your laptop.</p>
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
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="student">Student Performance & Login Roster</option>
              <option value="educator">Educator Load & Hours Ledger</option>
              <option value="course">Course Completions & Certificates</option>
              <option value="ai">AI Pipeline Token Allocation Logs</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Time Horizon</label>
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="7days">Past 7 Days</option>
              <option value="30days">Past 30 Days</option>
              <option value="90days">Past Quarter (90 Days)</option>
              <option value="year">Past Fiscal Year</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-sky-600 hover:bg-sky-500 rounded-xl font-semibold text-white transition-all cursor-pointer flex justify-center items-center gap-2 shadow-lg shadow-sky-600/20"
          >
            <Download className="h-4.5 w-4.5" />
            Generate & Download CSV
          </button>
        </form>

        {/* List Panel */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold">Pre-compiled Reports</h3>
            <span className="text-xs text-slate-500 font-medium">Click download for immediate CSV file</span>
          </div>

          {downloadMessage && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex gap-2 items-center animate-fadeIn">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
              <span>{downloadMessage}</span>
            </div>
          )}

          <div className="space-y-4">
            {reports.map((rep, idx) => (
              <div 
                key={idx}
                className="bg-slate-900 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between gap-6 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sky-400">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{rep.title}</h4>
                    <p className="text-slate-400 text-xs mt-1">{rep.desc}</p>
                  </div>
                </div>

                <button
                  onClick={() => generateReportData(rep.typeKey)}
                  className="px-3.5 py-2 bg-sky-600/20 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/30 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-md"
                >
                  <Download className="h-3.5 w-3.5" /> Download CSV
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
