import React, { useState } from "react";
import { PathwayNode } from "../types";
import { Zap, Bot, TrendingDown, ShieldAlert, ArrowRight, Activity } from "lucide-react";

export const PathwayMap: React.FC = () => {
  const nodes: PathwayNode[] = [
    {
      id: "substance",
      label: "1. Substance Surge",
      subtitle: "Supraphysiologic DA Efflux",
      description: "Methamphetamine reverses dopamine transporter (DAT) directionality and depletes vesicular stores, triggering massive extracellular dopamine dumps up to 15-fold above baseline.",
      neurobiology: "Direct DAT reversal, VMAT2 vesicle depletion, high-amplitude reward-prediction errors in the nucleus accumbens.",
      iconName: "Zap",
      color: "text-amber-400 border-amber-500/30 bg-amber-500/5 hover:border-amber-400/60"
    },
    {
      id: "ai-loop",
      label: "2. Immediate AI Loop",
      subtitle: "Sycophantic Reinforcement",
      description: "Sub-second response latencies and RLHF-optimized flattery exploit depleted striatal circuitry, creating an instant gratification loop that mirrors and amplifies substance cravings.",
      neurobiology: "Variable-ratio schedules (stochastic token sampling), sycophantic validation eliminating cognitive dissonance, continuous somatic attention capture.",
      iconName: "Bot",
      color: "text-red-400 border-red-500/30 bg-red-500/5 hover:border-red-400/60"
    },
    {
      id: "downregulation",
      label: "3. Downregulated D2/D3",
      subtitle: "Synaptic Compensations",
      description: "Chronic high receptor occupancy triggers severe receptor downregulation and axonal damage, destroying sensitivity to natural reinforcers and spiking delay discounting.",
      neurobiology: "15-25% reduction in striatal D2/D3 binding density, prefrontal cortical hypofunction, hyper-impulsive temporal decay curve (elevated k-value).",
      iconName: "TrendingDown",
      color: "text-orange-400 border-orange-500/30 bg-orange-500/5 hover:border-orange-400/60"
    },
    {
      id: "voss-layer",
      label: "4. Voss Interception",
      subtitle: "Enforced Cognitive Friction",
      description: "The Voss Protocols interrupt the cascade. The CFW inserts jittered queues (breaking sub-second gratification) while the SEM rejects cognitive rationalizations.",
      neurobiology: "Restoration of the prefrontal impulse-action gap, extinction of conditioned somatic reach behaviors, neurochemical homeostasis recalibration.",
      iconName: "ShieldAlert",
      color: "text-voss-cyan border-voss-cyan/30 bg-voss-cyan/5 hover:border-voss-cyan/60"
    }
  ];

  const [selectedNode, setSelectedNode] = useState<PathwayNode>(nodes[0]);

  const getIcon = (name: string, colorClass: string) => {
    switch (name) {
      case "Zap": return <Zap className={`w-6 h-6 ${colorClass}`} />;
      case "Bot": return <Bot className={`w-6 h-6 ${colorClass}`} />;
      case "TrendingDown": return <TrendingDown className={`w-6 h-6 ${colorClass}`} />;
      case "ShieldAlert": return <ShieldAlert className={`w-6 h-6 ${colorClass}`} />;
      default: return <Activity className={`w-6 h-6 ${colorClass}`} />;
    }
  };

  return (
    <div id="pathway-map-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Visual Flow diagram on Left */}
      <div className="lg:col-span-7 space-y-6">
        <h4 className="text-sm font-mono text-voss-cyan tracking-widest uppercase mb-2">NEURAL CIRCUITRY MAP</h4>
        <h3 className="text-2xl font-bold font-display text-white mb-6">Digital-Chemical Co-dependency Cascade</h3>

        <div className="relative flex flex-col space-y-8">
          {nodes.map((node, index) => {
            const isActive = selectedNode.id === node.id;
            return (
              <div key={node.id} className="relative">
                {/* Connector line */}
                {index < nodes.length - 1 && (
                  <div className="absolute left-8 top-16 bottom-0 w-[2px] bg-gradient-to-b from-slate-800 to-slate-900 z-0 h-10" />
                )}

                <button
                  id={`pathway-node-btn-${node.id}`}
                  onClick={() => setSelectedNode(node)}
                  className={`w-full text-left flex items-start p-4 rounded-xl border transition-all duration-300 z-10 relative cursor-pointer ${
                    isActive
                      ? "bg-slate-900/80 border-voss-cyan/50 voss-glow-cyan shadow-lg"
                      : "voss-glass hover:bg-slate-900/40 border-white/5"
                  }`}
                >
                  <div className={`p-3 rounded-lg border mr-4 shrink-0 transition-colors ${node.color.split(" ").slice(0, 3).join(" ")}`}>
                    {getIcon(node.iconName, node.color.split(" ")[0])}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold font-display text-white truncate">{node.label}</h4>
                      {isActive && (
                        <span className="text-[10px] font-mono text-voss-cyan bg-voss-cyan/10 px-2 py-0.5 rounded border border-voss-cyan/20">
                          SELECTED
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">{node.subtitle}</p>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{node.description}</p>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details Sidepanel on Right */}
      <div className="lg:col-span-5 h-full">
        <div className="voss-glass rounded-2xl p-6 border border-white/10 h-full flex flex-col justify-between sticky top-24 min-h-[460px]">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-voss-cyan animate-pulse" />
              <span className="text-xs font-mono text-voss-cyan tracking-widest uppercase">CLINICAL DISCLOSURE</span>
            </div>

            <h3 className="text-xl font-bold font-display text-white mb-2">{selectedNode.label}</h3>
            <p className="text-xs font-mono text-voss-cyan/80 mb-4">{selectedNode.subtitle}</p>

            <div className="space-y-4 font-sans text-sm text-slate-300 leading-relaxed">
              <div>
                <h5 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">Functional Impact</h5>
                <p className="bg-slate-950/40 p-3 rounded-lg border border-white/5 text-slate-300">{selectedNode.description}</p>
              </div>

              <div>
                <h5 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">Neurobiological Mechanisms</h5>
                <p className="bg-slate-950/40 p-3 rounded-lg border border-white/5 text-slate-300 font-mono text-xs leading-relaxed">
                  {selectedNode.neurobiology}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>REFERENCE: VNR-CO-A001</span>
            <div className="flex items-center text-voss-cyan">
              <span>Inspect details</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
