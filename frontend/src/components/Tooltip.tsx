import { useState } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  text: string;
  children?: React.ReactNode;
}

export default function Tooltip({ text, children }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      {children}
      <button
        type="button"
        className="ml-1.5 text-slate-400 hover:text-solar-gold transition-colors"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        aria-label="More information"
      >
        <Info size={14} />
      </button>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-navy-600 border border-white/10 rounded-lg shadow-xl z-50 min-w-[200px] max-w-[280px] whitespace-normal">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="w-2 h-2 bg-navy-600 border-r border-b border-white/10 transform rotate-45" />
          </div>
        </div>
      )}
    </div>
  );
}
