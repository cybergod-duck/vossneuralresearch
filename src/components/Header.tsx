import { motion } from "motion/react";
import { Brain, FileText, ShieldAlert } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950 text-zinc-100 py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-lg text-amber-500">
            <Brain className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-mono tracking-tight font-bold text-amber-500">
              Dopamine & AI Scaffolds Hub
            </h1>
            <p className="text-xs text-zinc-400 font-mono">
              INTERACTIVE SYNTHESIS • NEUROBIOLOGICAL REWIRING • THE VOSS PROTOCOLS
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "papers", label: "Read Papers", icon: FileText },
            { id: "simulator", label: "Rewiring Simulator", icon: ShieldAlert },
            { id: "voss", label: "Voss Console", icon: Brain },
            { id: "lab", label: "Research Lab", icon: Brain },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200 border border-zinc-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Meta context panel */}
      <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Status: Analytical Active Mirror</span>
        </div>
        <div className="flex gap-4">
          <span>Target Subject: Alpha & Universality Cohort</span>
          <span>Date Scale: 2023 – 2026</span>
        </div>
      </div>
    </header>
  );
}
