import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  changeText?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
  onClick?: () => void;
}

export default function StatCard({ title, value, changeText, changeType = 'neutral', icon: Icon, iconColor = 'text-sky-500', onClick }: StatCardProps) {
  const color = changeType === 'positive' ? 'text-emerald-500' : changeType === 'negative' ? 'text-rose-500' : 'text-slate-400';
  return (
    <div onClick={onClick} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-colors cursor-pointer">

      <div className="space-y-2">
        <span className="text-sm font-medium text-slate-400">{title}</span>
        <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
        {changeText && <p className={`text-xs font-semibold ${color}`}>{changeText}</p>}
      </div>
      <div className={`p-3 bg-slate-950 border border-slate-800 rounded-xl ${iconColor}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}
