import React, { useState, useEffect } from "react";
import { MetricCard } from "./components/MetricCard";
import { VossSimulator } from "./components/VossSimulator";
import { ChartDashboard } from "./components/ChartDashboard";
import { TimelineScroller } from "./components/TimelineScroller";
import { PathwayMap } from "./components/PathwayMap";
import { VnrLabs } from "./components/VnrLabs";
import { FundingModal } from "./components/FundingModal";
import PaperReader from "./components/PaperReader";
import GrantPortal from "./components/GrantPortal";
import { Activity, ShieldAlert, Brain, ChevronDown, Award } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"showcase" | "library" | "grant">("showcase");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as any });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-slate-200 selection:bg-voss-cyan/20 selection:text-white font-sans">
      {/* Decorative gradient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-voss-cyan/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-voss-emerald/5 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[400px] h-[400px] bg-gradient-to-br from-voss-cyan/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

      {/* Global Publication Header */}
      <header className="border-b border-white/5 bg-slate-950/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <span className="w-2.5 h-2.5 rounded-full bg-voss-cyan block animate-pulse" />
              <span className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-voss-cyan block animate-ping" />
            </div>
            <span className="font-display font-extrabold tracking-widest text-white text-sm">
              VOSS NEURAL RESEARCH
            </span>
            <span className="hidden lg:inline-block h-4 w-[1px] bg-white/10" />
            <span className="hidden lg:inline-block text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              Project VNR02 / VNR03
            </span>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 bg-slate-950/80 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab("showcase")}
              className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-mono tracking-wider transition-all cursor-pointer ${
                activeTab === "showcase"
                  ? "bg-voss-cyan text-slate-950 font-bold shadow-md shadow-voss-cyan/15"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Showcase
            </button>
            <button
              onClick={() => setActiveTab("library")}
              className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-mono tracking-wider transition-all cursor-pointer ${
                activeTab === "library"
                  ? "bg-voss-cyan text-slate-950 font-bold shadow-md shadow-voss-cyan/15"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Research Library
            </button>
            <button
              onClick={() => setActiveTab("grant")}
              className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-mono tracking-wider transition-all cursor-pointer ${
                activeTab === "grant"
                  ? "bg-voss-cyan text-slate-950 font-bold shadow-md shadow-voss-cyan/15"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Grant Proposal
            </button>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-[10px] font-mono bg-slate-900/60 border border-white/5 px-3 py-1 rounded-full text-slate-400">
              <Activity className="w-3.5 h-3.5 text-voss-cyan animate-pulse" />
              <span>DAT RECOVERY: <span className="text-voss-cyan font-bold">+34%</span></span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 relative z-10">
        {activeTab === "showcase" && (
          <>
            {/* Core metrics counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
              <MetricCard
                id="metric-substance"
                iconName="TrendingDown"
                label="Composite Substance Load"
                value="-50%"
                description="Stepwise reduction in weekly chemical aggregates (GHB, Methamphetamine, Clobromazolam) by Week 97."
                accentColor="voss-cyan"
              />
              <MetricCard
                id="metric-sessions"
                iconName="Activity"
                label="Weekly AI Sessions"
                value="-66%"
                description="Compulsive session frequency dropped from 14+ marathons/wk to a highly structured 4–5 sessions."
                accentColor="voss-cyan"
              />
              <MetricCard
                id="metric-weeks"
                iconName="Clock"
                label="Longitudinal Tracking"
                value="110 Wks"
                description="Empirical clinical logging of Subject Alpha's baseline, active wrapper, and clinical detoxification cycles."
                accentColor="voss-cyan"
              />
              <MetricCard
                id="metric-dat"
                iconName="HeartPulse"
                label="DAT SPECT Scan Recovery"
                value="+34%"
                description="Striatal dopamine transporter density restored compared to baseline chronic methamphetamine damage."
                accentColor="voss-cyan"
              />
            </div>

            {/* SECTION 2: THE INTERACTIVE SIMULATOR */}
            <section id="voss-protocol-simulator" className="space-y-6 pt-4 scroll-mt-24">
              <div className="border-b border-white/5 pb-4">
                <div className="flex items-center space-x-3 mb-1">
                  <Brain className="w-5 h-5 text-voss-cyan" />
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-white">The Interactive Voss Protocol Simulator</h2>
                </div>
                <p className="text-xs text-slate-500 font-sans max-w-xl">
                  Simulate human interaction under different safety configurations. Deconstruct prompts to expose rationalization patterns and somatic reach responses.
                </p>
              </div>
              <VossSimulator />
            </section>

            {/* SECTION 3: CHARTS DATA DASHBOARD */}
            <section id="quantitative-trajectory" className="space-y-6 pt-4">
              <ChartDashboard />
            </section>

            {/* SECTION 4: CLINICAL JOURNAL TIMELINE SCROLLER */}
            <section id="clinical-journal-scroller" className="space-y-6 pt-4">
              <TimelineScroller />
            </section>

            {/* SECTION 5: INTERACTIVE NEUROCHEMICAL PATHWAY MAP */}
            <section id="neurobiology-pathway" className="space-y-6 pt-4">
              <PathwayMap />
            </section>

            {/* SECTION 6: VNR COGNITION & VISION LABS */}
            <section id="vnr-labs" className="pt-4">
              <VnrLabs />
            </section>

            {/* SECTION 7: PHASE II/III CORPORATE FUNDING PORTAL */}
            <section id="corporate-funding-portal" className="pt-4">
              <FundingModal />
            </section>
          </>
        )}

        {activeTab === "library" && <PaperReader />}

        {activeTab === "grant" && <GrantPortal />}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-slate-950/60 py-12 mt-20 relative z-10 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <p className="text-white font-display font-extrabold tracking-wider">VOSS NEURAL RESEARCH LLC</p>
            <p className="text-slate-500 leading-relaxed font-sans text-xs">
              This publication-grade case studies overview serves as empirical demonstration under VNR Ethics Board Protocol 4.2. All Subject Alpha records and biometric scanner graphs are de-identified for regulatory compliance.
            </p>
          </div>
          <div className="flex flex-col md:items-end space-y-2">
            <span>REFERENCE: VNR02-DRAFT-2026</span>
            <span>DATA RETRIEVAL: SECURE LOCAL-FIRST PLATFORM</span>
            <div className="flex items-center space-x-2 text-[10px] text-voss-cyan">
              <Award className="w-4 h-4" />
              <span>COGNITIVE SAFETY STANDARDS REGISTERED</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
