import type { ReactNode } from 'react';

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  badge?: string;
  highlighted?: boolean;
}

export default function InfoCard({ icon, title, description, badge, highlighted = false }: InfoCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        highlighted
          ? 'border-solar-gold/30 bg-gradient-to-br from-amber-500/10 to-amber-600/5 shadow-lg shadow-amber-500/5'
          : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
      }`}
    >
      {badge && (
        <span className="absolute top-3 right-3 rounded-full bg-solar-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-solar-gold">
          {badge}
        </span>
      )}
      <div
        className={`mb-4 inline-flex rounded-lg p-2.5 ${
          highlighted ? 'bg-solar-gold/20 text-solar-gold' : 'bg-white/5 text-slate-400 group-hover:text-solar-gold'
        } transition-colors`}
      >
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-400">{description}</p>
    </div>
  );
}
