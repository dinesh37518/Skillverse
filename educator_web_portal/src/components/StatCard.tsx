import { LucideIcon, ChevronRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  changeText?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
  onClick?: () => void;
}

export default function StatCard({
  title,
  value,
  changeText,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-violet-500',
  onClick
}: StatCardProps) {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-emerald-400 font-semibold';
    if (changeType === 'negative') return 'text-rose-400 font-semibold';
    return 'text-slate-400 font-medium';
  };

  const getBorderGlow = () => {
    if (changeType === 'positive') return 'hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10';
    if (changeType === 'negative') return 'hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-500/10';
    return 'hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10';
  };

  return (
    <div 
      onClick={onClick}
      className={`group bg-slate-900/70 backdrop-blur-md border border-slate-800/90 p-6 rounded-2xl flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${onClick ? 'cursor-pointer' : ''} ${getBorderGlow()}`}
    >
      <div className="space-y-1.5 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider block">{title}</span>
          {onClick && (
            <span className="text-[9px] font-bold text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              Click to view <ChevronRight className="h-3 w-3 inline" />
            </span>
          )}
        </div>
        <h3 className="text-3xl font-extrabold tracking-tight text-white">{value}</h3>
        {changeText && (
          <p className={`text-xs ${getChangeColor()} flex items-center gap-1 mt-1`}>
            <span>{changeText}</span>
          </p>
        )}
      </div>
      <div className={`p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-xl ${iconColor} group-hover:scale-110 transition-transform duration-300 shadow-md shrink-0 ml-3`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}

