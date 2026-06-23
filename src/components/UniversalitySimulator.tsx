import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PROFILES, EXPOSURE_STAGES } from "../data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ShieldAlert, HelpCircle, Activity, User, ChevronRight, Sparkles } from "lucide-react";

export default function UniversalitySimulator() {
  const [selectedProfileId, setSelectedProfileId] = useState<string>("student");
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);

  const selectedProfile = PROFILES.find((p) => p.id === selectedProfileId) || PROFILES[0];
  const currentStage = EXPOSURE_STAGES[currentStageIndex];

  // Data for the Recharts line graph showing progression across all stages
  const chartData = EXPOSURE_STAGES.map((stage) => ({
    name: stage.name.split(" ")[0],
    "DAT Density (%)": stage.datDensity,
    "Natural Liking (%)": stage.naturalLiking,
    "Sensitized Wanting (%)": stage.sensitizedWanting,
    "Prefrontal Control (%)": stage.prefrontalControl,
  }));

  // Custom tooltips for the graph
  const renderTooltip = (props: any) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded shadow-md text-xs font-mono text-zinc-300">
          <p className="font-bold text-amber-500 mb-1">{payload[0].payload.name}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} style={{ color: item.color }}>
              {item.name}: {item.value}%
            </p>
          ))}
        </div>
      );
    };
    return null;
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Module Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
          <div>
            <span className="text-xs font-mono text-amber-500 font-bold uppercase tracking-wider block">
              INTERACTIVE SYNTHESIS ENGINE
            </span>
            <h2 className="text-2xl font-bold font-sans tracking-tight">
              Indiscriminate Rewiring & Universality Simulator
            </h2>
            <p className="text-sm text-zinc-400">
              Select a demographic profile and increase chemical exposure to trace reward circuit remodeling.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-amber-500/5 border border-amber-500/20 text-amber-500 text-xs font-mono">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>HEURISTIC SIMULATION ACTIVE</span>
          </div>
        </div>

        {/* Outer Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Profile Selector - Left Rail (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-mono uppercase text-zinc-500 tracking-widest flex items-center gap-2">
              <User className="w-4 h-4" /> 1. Select Demographic Profile
            </h3>
            <div className="space-y-2.5">
              {PROFILES.map((profile) => {
                const isSelected = profile.id === selectedProfileId;
                return (
                  <button
                    key={profile.id}
                    onClick={() => setSelectedProfileId(profile.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer block relative overflow-hidden ${
                      isSelected
                        ? "bg-zinc-900 border-amber-500/40 shadow-lg shadow-amber-500/5"
                        : "bg-zinc-900/40 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/80"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                    )}
                    <span className="font-mono text-sm font-bold text-zinc-200 block">
                      {profile.name}
                    </span>
                    <span className="text-xs text-zinc-500 line-clamp-2 mt-1">
                      {profile.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Simulator Stage - Middle/Right (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Timeline Selector / Slider */}
            <div className="bg-zinc-900/50 border border-zinc-900 rounded-2xl p-5 md:p-6 space-y-5">
              <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-widest">
                2. Exposure Intensity Progression
              </h3>

              {/* Slider Controls */}
              <div className="flex items-center justify-between gap-4 font-mono text-xs text-zinc-400">
                <span>Phase 0: Baseline</span>
                <span className="text-amber-500 font-bold">Phase {currentStageIndex}: {currentStage.name}</span>
                <span>Phase 3: Capture</span>
              </div>

              <div className="relative pt-1">
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="1"
                  value={currentStageIndex}
                  onChange={(e) => setCurrentStageIndex(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-zinc-600 font-mono mt-2">
                  <span>0% Exposure</span>
                  <span>Low Intensity</span>
                  <span>Substantial Tolerance</span>
                  <span>Chronic Dependency</span>
                </div>
              </div>

              {/* Step Clickable Grid */}
              <div className="grid grid-cols-4 gap-2">
                {EXPOSURE_STAGES.map((stage) => {
                  const isActive = stage.phase === currentStageIndex;
                  return (
                    <button
                      key={stage.phase}
                      onClick={() => setCurrentStageIndex(stage.phase)}
                      className={`py-2 px-1 rounded text-[10px] md:text-xs font-mono border transition-all cursor-pointer text-center ${
                        isActive
                          ? "bg-amber-500/15 border-amber-500/50 text-amber-500 font-bold"
                          : "bg-zinc-900/30 border-zinc-900 text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      Stage {stage.phase}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Chart Visualizer */}
            <div className="border border-zinc-900 bg-zinc-900/20 rounded-2xl p-4 md:p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                  DOPAMINERGIC COMPENSATORY CURVE
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>Active Indicator</span>
                </div>
              </div>

              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="name" stroke="#71717a" fontSize={11} fontStyle="monospace" />
                    <YAxis stroke="#71717a" fontSize={11} domain={[0, 100]} />
                    <Tooltip content={renderTooltip} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 10, fontFamily: "monospace", paddingTop: 10 }} />
                    <Line
                      type="monotone"
                      dataKey="DAT Density (%)"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      dot={{ r: 5 }}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Natural Liking (%)"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Sensitized Wanting (%)"
                      stroke="#ef4444"
                      strokeWidth={2.5}
                      dot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Prefrontal Control (%)"
                      stroke="#f59e0b"
                      strokeWidth={2.5}
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Narratives Section */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedProfileId}-${currentStageIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid md:grid-cols-2 gap-6"
              >
                {/* General Physiology */}
                <div className="border border-zinc-900 bg-zinc-900/30 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">
                      Physiological Progression
                    </span>
                  </div>
                  <h5 className="text-sm font-sans font-bold text-zinc-100">
                    {currentStage.name}
                  </h5>
                  <p className="text-xs text-zinc-400 font-mono leading-relaxed text-justify">
                    {currentStage.generalDescription}
                  </p>
                </div>

                {/* Profile-Specific Impact */}
                <div className="border border-zinc-900 bg-zinc-900/30 p-5 rounded-2xl space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 text-zinc-800">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <User className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">
                      Subject Profile Impact
                    </span>
                  </div>
                  <h5 className="text-sm font-sans font-bold text-zinc-100">
                    {selectedProfile.name} Experience
                  </h5>

                  {/* Stage Logic Descriptions */}
                  <div className="text-xs font-mono text-zinc-400 space-y-2 leading-relaxed">
                    {currentStageIndex === 0 && (
                      <p>
                        <strong>Baseline State:</strong> Operates under standard premorbid conditions. {selectedProfile.description} Primary motivation: <span className="text-emerald-500">{selectedProfile.initialContext}</span>
                      </p>
                    )}
                    {currentStageIndex === 1 && (
                      <p>
                        <strong>Enhancement State:</strong> Highly responsive performance enhancement. Subjectively achieves high productivity, flow, or confidence. Relies on existing strengths, validating continued usage.
                      </p>
                    )}
                    {currentStageIndex === 2 && (
                      <p>
                        <strong>Tolerance Phase:</strong> Natural rewards begin losing their salience. The threshold is actively crossed. {selectedProfile.transitionMarker} The target is increasingly trapped.
                      </p>
                    )}
                    {currentStageIndex === 3 && (
                      <p>
                        <strong>Compulsive Capture:</strong> Full convergence. Initial socioeconomic structures or psychological shields are bypassed. <span className="text-rose-500">Prefrontal hypofunction:</span> {selectedProfile.neurobehavioralCorrelate}
                      </p>
                    )}

                    {/* Paper Quote */}
                    <div className="mt-4 border-l-2 border-amber-500/40 bg-amber-500/[0.02] p-3 rounded-r text-[11px] text-zinc-300 font-serif italic">
                      "{selectedProfile.quote}"
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
