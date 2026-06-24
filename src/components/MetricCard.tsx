import React from "react";
import * as Icons from "lucide-react";

interface MetricCardProps {
  id: string;
  iconName: keyof typeof Icons;
  label: string;
  value: string;
  description: string;
  accentColor: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  iconName,
  label,
  value,
  description,
  accentColor
}) => {
  const IconComponent = Icons[iconName] as React.ComponentType<{ className?: string }>;

  return (
    <div
      id={`metric-card-${iconName.toLowerCase()}`}
      className="voss-glass rounded-xl p-6 border border-white/10 relative overflow-hidden transition-all duration-300 hover:border-voss-cyan/40 hover:-translate-y-1 group"
    >
      {/* Decorative pulse background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-voss-cyan/5 to-transparent rounded-full -mr-8 -mt-8 group-hover:scale-125 transition-transform duration-500" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`p-3 rounded-lg bg-slate-900/50 border border-white/5 text-${accentColor}`}>
          {IconComponent && <IconComponent className="w-6 h-6 animate-pulse" />}
        </div>
        <span className="text-xs font-mono text-slate-500 tracking-wider">LIVE RECORD</span>
      </div>

      <div className="relative z-10">
        <p className="text-sm font-medium text-slate-400 tracking-wide mb-1 uppercase font-display">{label}</p>
        <h3 className="text-3xl font-extrabold text-white tracking-tight font-outfit mb-2">
          {value}
        </h3>
        <p className="text-xs text-slate-500 font-sans leading-relaxed">
          {description}
        </p>
      </div>

      {/* Accent glowing border bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-voss-cyan/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </div>
  );
};
