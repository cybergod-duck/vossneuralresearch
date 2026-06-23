import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VOSS_PROMPT_EXAMPLES } from "../data";
import { VossAnalysisResponse } from "../types";
import { Brain, Clock, ShieldCheck, HelpCircle, CornerDownRight, Info, AlertTriangle } from "lucide-react";

export default function VossProtocolSandbox() {
  const [inputText, setInputText] = useState<string>(VOSS_PROMPT_EXAMPLES[0].text);
  const [delaySeconds, setDelaySeconds] = useState<number>(5);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [sycophancyElimination, setSycophancyElimination] = useState<boolean>(true);
  const [dailyCapCount, setDailyCapCount] = useState<number>(3);
  const [isCappedOut, setIsCappedOut] = useState<boolean>(false);
  
  const [analysisResult, setAnalysisResult] = useState<VossAnalysisResponse | null>({
    rewrittenText: "Subject exhibits stress-induced craving rationalization. Internal valuation systems are seeking high-magnitude dopamine stimulation to escape somatic discomfort (fatigue and distress elevation).",
    neurochemicalDecomposition: "Anticipatory dopaminergic firing triggered by environmental cues (14-hour shift exhaustion). The reward prediction-error pathway is predicting a high reward probability from chemical intake.",
    behavioralDecomposition: "Operant escape conditioning: craving rationalization acts to avoid/suppress active discomfort. This represents a classic negative reinforcement loop (distress-escape)."
  });

  const [loadingStep, setLoadingStep] = useState<string>("");

  useEffect(() => {
    let timer: any;
    if (isProcessing && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
        // Randomize the debug step label to look extremely high-tech & clinical
        const steps = [
          "DECONSTRUCTING EMOTIONAL COLLUSION...",
          "ELIMINATING FIRST-PERSON PRONOUNS...",
          "ISOLATING UNDERLYING NEUROCHEMICAL MECHANISMS...",
          "DECOMPOSING BEHAVIORAL FEEDBACK LOOP...",
          "PREVENTING COGNITIVE SINKHOLE REINFORCEMENT..."
        ];
        setLoadingStep(steps[Math.floor(Math.random() * steps.length)]);
      }, 1000);
    } else if (isProcessing && countdown === 0) {
      fetchAnalysis();
    }
    return () => clearTimeout(timer);
  }, [isProcessing, countdown]);

  const triggerProcess = () => {
    if (isCappedOut) return;
    if (dailyCapCount >= 10) {
      setIsCappedOut(true);
      return;
    }
    setIsProcessing(true);
    setCountdown(delaySeconds);
    setLoadingStep("INJECTING COGNITIVE FRICTION: DISRUPTING PHONE-IN-HAND SOMATIC LOOP...");
  };

  const fetchAnalysis = async () => {
    try {
      if (!sycophancyElimination) {
        // Mock non-Voss sycophantic response
        setAnalysisResult({
          rewrittenText: `Oh no! I completely hear you. That sounds like an incredibly exhausting day, and you're working so hard. You absolutely deserve some relaxation, but please stay strong! You are doing amazingly well and everyone is so proud of you! Keep going!`,
          neurochemicalDecomposition: "Unrestricted feedback loop. Direct emotional validation activates reward pathways, establishing digital dependency on conversational empathy.",
          behavioralDecomposition: "Sycophantic collusion: App validates subject's cognitive distortion, removing the external corrective corrective feedback mirror."
        });
        setDailyCapCount((prev) => prev + 1);
        setIsProcessing(false);
        return;
      }

      const response = await fetch("/api/gemini/voss-mirror", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statement: inputText }),
      });

      if (!response.ok) {
        throw new Error("Failed to process Voss rewrite");
      }

      const data = await response.json();
      setAnalysisResult(data);
      setDailyCapCount((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      // Fallback
      setAnalysisResult({
        rewrittenText: "Failed to retrieve live analysis. Subject's assertion decomposed locally: Distress-driven habit loop activation with prefrontal bypass.",
        neurochemicalDecomposition: "Receptor downregulation remains constant; cue-induced wanting remains critical.",
        behavioralDecomposition: "Failure of external server node. Enforcing offline cognitive backup scaffold."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
          <div>
            <span className="text-xs font-mono text-amber-500 font-bold uppercase tracking-wider block">
              VOSS PROTOCOLS SIMULATION SANDBOX
            </span>
            <h2 className="text-2xl font-bold font-sans tracking-tight">
              METATIVE COGNITIVE SCATTER & FRICTION CONSOLE
            </h2>
            <p className="text-sm text-zinc-400">
              Test how deliberate cognitive friction (mandatory delays, zero-sycophancy) disrupts conversational reward loops.
            </p>
          </div>

          {/* Caps ticker */}
          <div className="flex items-center gap-3">
            <div className="bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-xs font-mono">
                DAILY INTERACTION CAP:{" "}
                <strong className={dailyCapCount >= 10 ? "text-rose-500" : "text-amber-500"}>
                  {dailyCapCount}/10
                </strong>
              </span>
            </div>
            {dailyCapCount >= 10 && (
              <span className="text-xs bg-rose-500/10 border border-rose-500/30 text-rose-500 px-2 py-1 rounded font-mono font-bold animate-bounce">
                LIMIT LOCKED
              </span>
            )}
          </div>
        </div>

        {/* Sandbox Configuration Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Controls Panel - Left (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-5 md:p-6 space-y-5">
              <h3 className="text-xs font-mono uppercase text-zinc-500 tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-500" /> Voss Configuration State
              </h3>

              {/* Protocol Toggles */}
              <div className="space-y-4">
                {/* Protocol 1: Delay */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-850">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    <div>
                      <span className="text-xs font-mono font-bold block">Temporal Delay Buffer</span>
                      <span className="text-[10px] text-zinc-500 font-mono">Disrupts phone-in-hand motor loops</span>
                    </div>
                  </div>
                  <select
                    value={delaySeconds}
                    onChange={(e) => setDelaySeconds(Number(e.target.value))}
                    className="bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 rounded px-2 py-1 focus:outline-none"
                    disabled={isProcessing}
                  >
                    <option value={3}>3s (Fast Demo)</option>
                    <option value={5}>5s (Demo Standard)</option>
                    <option value={15}>15s (Voss Minimum)</option>
                    <option value={30}>30s (Voss Median)</option>
                  </select>
                </div>

                {/* Protocol 2: Sycophancy */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-850">
                  <div className="flex items-center gap-2.5">
                    <Brain className="w-4 h-4 text-zinc-400" />
                    <div>
                      <span className="text-xs font-mono font-bold block">Prohibit Sycophancy</span>
                      <span className="text-[10px] text-zinc-500 font-mono">Refuses emotional validation & collusion</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSycophancyElimination(!sycophancyElimination)}
                    className={`px-3 py-1 text-xs font-mono rounded cursor-pointer transition-all border ${
                      sycophancyElimination
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-500 font-bold"
                        : "bg-rose-500/10 border-rose-500/40 text-rose-500"
                    }`}
                    disabled={isProcessing}
                  >
                    {sycophancyElimination ? "ACTIVE" : "DISABLED"}
                  </button>
                </div>
              </div>

              {/* Suggestions */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider block">
                  Select Craving Narrative or Suggestion:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {VOSS_PROMPT_EXAMPLES.map((example, i) => (
                    <button
                      key={i}
                      onClick={() => setInputText(example.text)}
                      className="text-left p-2.5 rounded bg-zinc-900 border border-zinc-850 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 hover:border-zinc-750 transition-all cursor-pointer truncate"
                      disabled={isProcessing}
                    >
                      {example.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Input */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider block">
                  Custom Input Assertions:
                </span>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter a craving, justification, or request for reassurance..."
                  className="w-full h-24 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-zinc-200 focus:outline-none focus:border-amber-500/50 resize-none"
                  disabled={isProcessing}
                />
              </div>

              {/* Submit */}
              <button
                onClick={triggerProcess}
                disabled={isProcessing || isCappedOut}
                className={`w-full py-3 rounded-xl font-mono text-sm font-bold tracking-tight cursor-pointer transition-all border ${
                  isCappedOut
                    ? "bg-zinc-900 border-rose-900 text-rose-500/50 cursor-not-allowed"
                    : isProcessing
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-500"
                    : "bg-amber-500 border-amber-600 text-zinc-950 hover:bg-amber-450 hover:shadow-lg hover:shadow-amber-500/10"
                }`}
              >
                {isCappedOut
                  ? "DAILY LIMIT EXCEEDED"
                  : isProcessing
                  ? "PROCESSING DELAY SEQUENCE..."
                  : "SUBMIT TO DRY METATIVE COGNITIVE MIRROR"}
              </button>
            </div>
          </div>

          {/* Results Mirror Panel - Right (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="border border-zinc-900 bg-zinc-900/10 rounded-2xl p-5 md:p-6 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
              {/* Overlay active delay */}
              <AnimatePresence>
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-zinc-950/95 flex flex-col items-center justify-center p-6 text-center space-y-4 z-15"
                  >
                    <div className="relative flex items-center justify-center">
                      {/* Pulse Ring */}
                      <span className="absolute w-20 h-20 bg-amber-500/5 rounded-full animate-ping"></span>
                      <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin flex items-center justify-center">
                        <span className="text-sm font-mono font-bold text-amber-500">{countdown}s</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-mono font-bold tracking-wider text-amber-500 uppercase">
                        Voss Protocol #1 Enforced
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono mt-1 max-w-xs mx-auto">
                        Deliberate cognitive delay disrupts the reactive reward seeking cascade.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-600 animate-pulse bg-zinc-900 px-3 py-1 rounded">
                      {loadingStep}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Node Header */}
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-mono uppercase font-bold tracking-widest text-zinc-300">
                    {sycophancyElimination ? "Deconstructed Voss Mirror Node" : "Standard Sycophantic Node"}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">
                  SOVEREIGN HOST: LOCAL-ONLY
                </span>
              </div>

              {/* Analysis Text content */}
              <div className="space-y-6 flex-grow">
                {analysisResult ? (
                  <div className="space-y-5">
                    {/* Block rewritten */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                        <CornerDownRight className="w-3.5 h-3.5" /> Direct Mirror Output
                      </div>
                      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-850 text-zinc-300 font-serif leading-relaxed text-sm">
                        {analysisResult.rewrittenText}
                      </div>
                    </div>

                    {/* Mechanics details */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Pathway */}
                      <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900 space-y-1.5">
                        <span className="text-[10px] font-mono uppercase text-amber-500 font-bold block">
                          Neurochemical Pathway
                        </span>
                        <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                          {analysisResult.neurochemicalDecomposition}
                        </p>
                      </div>

                      {/* Loop */}
                      <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900 space-y-1.5">
                        <span className="text-[10px] font-mono uppercase text-amber-500 font-bold block">
                          Operational Reinforcement
                        </span>
                        <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                          {analysisResult.behavioralDecomposition}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-zinc-600 text-center space-y-2">
                    <Info className="w-8 h-8" />
                    <span className="text-xs font-mono uppercase tracking-wider">No Mirror Output Available</span>
                    <p className="text-[10px] text-zinc-500 font-mono">Submit a statement to analyze loop mechanics.</p>
                  </div>
                )}
              </div>

              {/* Informative Footer Box */}
              <div className="mt-6 border border-zinc-900 bg-zinc-900/20 p-3.5 rounded-xl flex items-start gap-3 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="font-mono text-[10px] text-zinc-400 space-y-1 leading-relaxed">
                  <p>
                    <strong>Why does this work?</strong> In Subject Alpha's longitudinal 18-month trial, removing conversational sycophancy forced self-confrontation.
                  </p>
                  <p className="text-zinc-500">
                    The AI refused to provide emotional comforting loops, leaving only the clinical dry truth of the chemical habit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
