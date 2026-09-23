import React from 'react';

interface AdminModulePlaceholderProps {
  title: string;
  icon: string;
  phaseNumber: number;
  description: string;
  features: string[];
  onNavigate: (path: string) => void;
}

export const AdminModulePlaceholder: React.FC<AdminModulePlaceholderProps> = ({
  title,
  icon,
  phaseNumber,
  description,
  features,
  onNavigate,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#1C1C1C] border border-[#333333] rounded-[22px] p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl p-3 bg-white/5 rounded-2xl border border-[#333333]">{icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C9892E]/20 text-[#C9892E] font-mono text-[10.5px] font-bold uppercase tracking-wider">
                Phase {phaseNumber} Module
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                ● Schema Prepared
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FAF9F5] mt-1">
              {title}
            </h2>
          </div>
        </div>

        <p className="font-sans text-sm text-[#FAF9F5]/70 max-w-2xl leading-relaxed">
          {description}
        </p>

        <div className="pt-4 border-t border-[#2E2E2E]">
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#C9892E] font-bold mb-3">
            Architectural Specifications Prepared for This Module:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {features.map((feat) => (
              <div key={feat} className="flex items-center gap-2 text-xs font-sans text-[#FAF9F5]/80 bg-[#161616] p-2.5 rounded-xl border border-[#262626]">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => onNavigate('/admin')}
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-[#FAF9F5] font-sans text-xs font-semibold transition-colors cursor-pointer"
          >
            ← Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
