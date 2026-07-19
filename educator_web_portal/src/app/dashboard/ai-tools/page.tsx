"use client";

import { 
  FileText, BrainCircuit, Globe, PlayCircle, Mic, HelpCircle, ArrowRight 
} from 'lucide-react';

interface AIToolItem {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'active' | 'beta' | 'maintenance';
}

export default function AITools() {
  const tools: AIToolItem[] = [
    {
      title: "AI Notes Generator",
      desc: "Generate complete, structured textbook study notes directly from uploaded lecture transcripts.",
      icon: FileText,
      status: "active"
    },
    {
      title: "AI Quiz Generator",
      desc: "Create interactive multiple choice check questions based on textbook chapters or video cues.",
      icon: BrainCircuit,
      status: "active"
    },
    {
      title: "AI Flashcards Compiler",
      desc: "Compile definitions and troubleshooting Q&As into study decks ready for student practice.",
      icon: BrainCircuit,
      status: "active"
    },
    {
      title: "AI Course Summary",
      desc: "Condense long mechanical blueprint manuals or safety videos into concise study bullet points.",
      icon: FileText,
      status: "active"
    },
    {
      title: "AI Translation Engine",
      desc: "Translate textbook pages and handouts into any of the 22 scheduled Indian languages.",
      icon: Globe,
      status: "active"
    },
    {
      title: "AI Subtitle Generator",
      desc: "Extract spoken speech from videos and generate aligned WebVTT subtitles in multiple target dialects.",
      icon: PlayCircle,
      status: "active"
    },
    {
      title: "AI Voice-over Dubber",
      desc: "Convert text translations into natural speech voices, overlaying dubbed tracks onto target lectures.",
      icon: Mic,
      status: "beta"
    },
    {
      title: "AI Tutor Companion",
      desc: "Setup training parameters and custom system prompts for your student classroom tutor chat bots.",
      icon: HelpCircle,
      status: "active"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Utilities Suite</h2>
        <p className="text-slate-400 mt-1">Placeholders for Llama 3 & Bhashini localization processing tools.</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((t, idx) => {
          const Icon = t.icon;
          return (
            <div 
              key={idx}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between gap-4 hover:border-slate-700 transition-colors group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-violet-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border capitalize ${
                    t.status === 'active' 
                      ? 'bg-violet-950/40 text-violet-400 border-violet-500/20' 
                      : 'bg-amber-950/40 text-amber-400 border-amber-500/20'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <h4 className="font-semibold text-white group-hover:text-violet-400 transition-colors">{t.title}</h4>
                <p className="text-xs text-slate-400 leading-normal">{t.desc}</p>
              </div>

              <button 
                onClick={() => alert(`Starting process for ${t.title}... (Mocked Console)`)}
                className="w-full mt-2 py-2 px-4 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>Launch Tool Console</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
