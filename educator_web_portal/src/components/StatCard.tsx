import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  changeText?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
}

export default function StatCard({
  title,
  value,
  changeText,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-violet-500'
}: StatCardProps) {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-emerald-400';
    if (changeType === 'negative') return 'text-rose-400';
    return 'text-slate-400';
  };

  const getBorderGlow = () => {
    if (changeType === 'positive') return 'hover:border-emerald-500/30 hover:shadow-emerald-500/5';
    if (changeType === 'negative') return 'hover:border-rose-500/30 hover:shadow-rose-500/5';
    return 'hover:border-violet-500/30 hover:shadow-violet-500/5';
  };

  return (
    <div className={`group bg-slate-900/60 backdrop-blur-sm border border-slate-800/80 p-6 rounded-2xl flex items-center justify-between transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl ${getBorderGlow()}`}>
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
        {changeText && (
          <p className={`text-xs font-semibold ${getChangeColor()}`}>{changeText}</p>
        )}
      </div>
      <div className={`p-3.5 bg-slate-950/80 border border-slate-800/60 rounded-xl ${iconColor} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}
