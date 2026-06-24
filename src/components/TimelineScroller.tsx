import React, { useState } from "react";
import { timelineMilestones } from "../data/timelineData";
import { Calendar, Quote, Shield, HeartPulse, Activity } from "lucide-react";

export const TimelineScroller: React.FC = () => {
  const [activeId, setActiveId] = useState(timelineMilestones[0].id);

  const activeMilestone = timelineMilestones.find((m) => m.id === activeId) || timelineMilestones[0];

  return (
    <div id="timeline-scroller-section" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-mono text-voss-cyan tracking-widest uppercase mb-1 flex items-center">
            <Quote className="w-4 h-4 mr-2 animate-pulse" />
            THE LONGITUDINAL SUBJECTIVE JOURNEY
          </h4>
          <h3 className="text-2xl font-bold font-display text-white">Subject Alpha Clinical Journal Log</h3>
        </div>

        {/* Clickable Quick Navigation Bar */}
        <div className="flex flex-wrap gap-2">
          {timelineMilestones.map((m) => (
            <button
              key={m.id}
              id={`timeline-nav-${m.id}`}
              onClick={() => setActiveId(m.id)}
              className={`px-3 py-2 rounded-lg border text-xs font-mono transition-all duration-200 cursor-pointer ${
                activeId === m.id
                  ? "bg-voss-cyan/15 border-voss-cyan/50 text-white shadow-md"
                  : "voss-glass border-white/5 text-slate-400 hover:border-white/10 hover:text-white"
              }`}
            >
              {m.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Scrollable Timeline Indicators on Left (Hidden on Mobile) */}
        <div className="hidden lg:col-span-4 lg:flex flex-col space-y-4">
          {timelineMilestones.map((m) => {
            const isActive = activeId === m.id;
            return (
              <button
                key={m.id}
                id={`timeline-side-btn-${m.id}`}
                onClick={() => setActiveId(m.id)}
                className={`text-left p-5 rounded-xl border transition-all duration-300 relative cursor-pointer ${
                  isActive
                    ? "bg-slate-900/60 border-voss-cyan/40 shadow-lg"
                    : "voss-glass border-white/5 hover:bg-slate-900/30"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-voss-cyan rounded-l-xl" />
                )}
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{m.period}</span>
                </div>
                <h4 className={`text-sm font-bold font-display transition-colors ${isActive ? "text-voss-cyan" : "text-white"}`}>
                  {m.title}
                </h4>
                <p className="text-xs text-slate-500 mt-2 line-clamp-1 leading-relaxed">{m.description}</p>
              </button>
            );
          })}
        </div>

        {/* Content Box on Right */}
        <div className="lg:col-span-8 flex flex-col justify-between voss-glass rounded-2xl p-6 md:p-8 border border-white/10 relative overflow-hidden min-h-[480px]">
          {/* Neon background effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-voss-cyan/5 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-4">
              <div>
                <span className="text-[10px] font-mono text-voss-cyan uppercase bg-voss-cyan/10 px-2 py-0.5 rounded border border-voss-cyan/20">
                  MILESTONE JOURNAL DATASET
                </span>
                <h3 className="text-xl font-bold font-display text-white mt-1.5">{activeMilestone.title}</h3>
              </div>
              <div className="flex items-center text-xs font-mono text-slate-500 space-x-1.5">
                <Calendar className="w-4 h-4" />
                <span>{activeMilestone.period}</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-sans bg-slate-950/20 p-4 rounded-xl border border-white/5">
              {activeMilestone.description}
            </p>

            {/* Prominent Quote box */}
            <div className="relative bg-slate-950/60 p-6 rounded-xl border border-voss-cyan/20 overflow-hidden">
              <Quote className="absolute -top-4 -left-4 w-16 h-16 text-voss-cyan/5 shrink-0" />
              <div className="relative z-10">
                <p className="text-xs font-mono text-voss-cyan mb-2 tracking-widest uppercase flex items-center">
                  <Shield className="w-4 h-4 mr-2 animate-pulse text-voss-cyan" />
                  Clinical Journal Excerpt
                </p>
                <p className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-line italic">
                  {activeMilestone.journalLog}
                </p>
              </div>
            </div>
          </div>

          {/* Biological Metric Stats below Quote */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/5 relative z-10">
            {activeMilestone.metrics?.map((metric, i) => (
              <div key={i} className="bg-slate-950/40 p-3 rounded-lg border border-white/5 text-center sm:text-left">
                <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider truncate">{metric.label}</span>
                <span className="text-lg font-extrabold text-white font-display block mt-1">{metric.value}</span>
                <span className="text-[9px] font-mono text-voss-cyan mt-0.5 block truncate">{metric.change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
