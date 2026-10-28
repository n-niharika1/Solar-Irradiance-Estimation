import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  text?: string;
}

export default function LoadingSpinner({ size = 24, className = '', text }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 size={size} className="animate-spin text-solar-gold" />
      {text && <span className="text-sm text-slate-400">{text}</span>}
    </div>
  );
}
