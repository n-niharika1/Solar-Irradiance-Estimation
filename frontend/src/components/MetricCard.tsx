import type { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  color?: 'gold' | 'green' | 'blue' | 'red';
}

const colorMap = {
  gold: 'from-amber-500/10 to-amber-600/5 border-amber-500/20',
  green: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20',
  blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/20',
  red: 'from-red-500/10 to-red-600/5 border-red-500/20',
};

const textColorMap = {
  gold: 'text-amber-400',
  green: 'text-emerald-400',
  blue: 'text-blue-400',
  red: 'text-red-400',
};

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color = 'gold',
}: MetricCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-gradient-to-br p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${colorMap[color]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <p className={`mt-2 text-3xl font-bold ${textColorMap[color]}`}>{value}</p>
          {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
        </div>
        {icon && <div className={`${textColorMap[color]} opacity-60`}>{icon}</div>}
      </div>
    </div>
  );
}
