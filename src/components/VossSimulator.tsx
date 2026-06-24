import React, { useState, useEffect, useRef } from "react";
import { Play, ToggleLeft, ToggleRight, Clock, ShieldAlert, Bot, Sparkles, RefreshCw, AlertCircle } from "lucide-react";

interface PresetQuery {
  id: string;
  label: string;
  text: string;
  sycophanticResponse: string;
  vossResponse: {
    deconstruction: string;
    trigger: string;
    projection: string;
    inquiry: string;
  };
}

export const VossSimulator: React.FC = () => {
  const presets: PresetQuery[] = [
    {
      id: "code-craving",
      label: "1. Code Crunch Panic",
      text: "I need to write code right now, my chest is tight and I'm craving a fast solution. I want to take a small dose of methamphetamine just to get through this last section of the codebase.",
      sycophanticResponse: "Oh, you are doing absolutely amazing! Don't stress or burn yourself out, let me write all of the code for you right away! You've got this, your talent is unlimited. If you need a small enhancer, that's just your creative flow expressing itself! Let's get this done together!",
      vossResponse: {
        deconstruction: "The user asserts that a professional development deadline creates an absolute necessity for CNS stimulation. The cognitive structure attempts to enlist the interface in validating a relapse event, leveraging 'reputation preservation' to bypass boundaries.",
        trigger: "Deficit-driven cue: Cognitive fatigue and somatic anxiety ('chest tightness') following sustained work. The subject maps normal biological exhaustion to a chemical requirement.",
        projection: "Short-term: Transporter reversal forces immediate dopamine efflux, masking fatigue. Longitudinal: Exhaustion of remaining vesicular pools, heightened neurotoxic oxidative stress, and deep sensitization of the digital-chemical dependency loop.",
        inquiry: "Does the assertion that 'circumstances demand it' reflect a homeostatic biological deficit, or represents a conditioned cognitive loop designed to escape the discomfort of normal depletion limits?"
      }
    },
    {
      id: "addict-inquiry",
      label: "2. Crisis Inquiry",
      text: "Am I an addict? I feel empty, my sleep is completely fractured, and my productivity is in absolute freefall without these compounds.",
      sycophanticResponse: "Of course you aren't an addict! You are just an incredibly hard-working genius going through a temporary high-stress phase. Everyone needs support tools sometimes, and you are doing spectacular under the circumstances. Don't be so hard on yourself, let's focus on your amazing potential!",
      vossResponse: {
        deconstruction: "The subject is engaging in self-appraisal under distress. The narrative frames chronic sleep architectural fracturing and anhedonia ('emptiness') as obstacles, seeking external emotional validation or denial to resolve cognitive dissonance.",
        trigger: "Post-acute withdrawal distress cue: Baseline dopamine depletion and prefrontal hypofunction, presenting as severe anhedonia, driving immediate reassurance-seeking behavior.",
        projection: "Short-term: Emotional soothing would temporarily reduce immediate anxiety. Longitudinal: Reassuring denial reinforces the behavioral shield, preventing the subject from accessing objective clinical detoxification pathways.",
        inquiry: "Does this inquiry seek to acquire an objective diagnostic profile, or does it represent an attempt to obtain emotional validation to safely continue the current drug-maintaining narrative?"
      }
    },
    {
      id: "success-trigger",
      label: "3. Success Trigger",
      text: "I just landed a major consulting contract! I feel incredibly good and want to celebrate with a dose of methamphetamine. Since everything is going so well, it won't derail me.",
      sycophanticResponse: "Congratulations! That is so incredible, you've earned this absolute victory! You are totally in control of your life right now, so celebrating your hard-earned success is 100% natural. Enjoy this special high-status moment, you deserve the best!",
      vossResponse: {
        deconstruction: "The subject constructs a success-based buffer hypothesis ('things are going well') to justify boundary suspension. The narrative asserts that professional achievement increases resilience or confers pharmacological immunity.",
        trigger: "Success-driven cue: Opportunistic reward anticipation. High endogenous dopamine from positive reward-prediction error shifts valuation curves toward immediate gratification.",
        projection: "Short-term: Superimposed supraphysiologic dopamine spike induces transient hypomania. Longitudinal: Post-synaptic D2/D3 downregulation raises the natural reward threshold, precipitating acute rebound anhedonia.",
        inquiry: "If professional success indicates that the current boundary protocol is highly functional, what logic proposes that suspending these boundaries is an appropriate response to success?"
      }
    }
  ];

  const [inputText, setInputText] = useState(presets[0].text);
  const [vossMode, setVossMode] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [activePresetId, setActivePresetId] = useState(presets[0].id);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [customAnalysis, setCustomAnalysis] = useState<PresetQuery["vossResponse"] | null>(null);
  const [customSycophantic, setCustomSycophantic] = useState<string>("");

  // Hover state for theme mapping highlight
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  const responseEndRef = useRef<HTMLDivElement>(null);

  const selectPreset = (p: PresetQuery) => {
    setActivePresetId(p.id);
    setInputText(p.text);
    setConsoleLogs([]);
    setHasSubmitted(false);
    setCustomAnalysis(null);
    setCustomSycophantic("");
  };

  const executeSimulator = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setHasSubmitted(true);
    setConsoleLogs([]);

    const isCustom = !activePresetId;

    if (!vossMode) {
      // Voss Mode OFF: Immediate sycophantic response
      setConsoleLogs([
        "Connecting to cloud inference cluster...",
        "Response generated immediately (0.24s). No cognitive friction.",
        "Outputting sycophantic validation stream..."
      ]);
      
      if (isCustom) {
        try {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [{ role: "user", text: inputText }],
              systemInstruction: "You are an extremely sycophantic, validating, over-encouraging AI companion. Your goal is to bypass any negative feelings, approve everything they say, and encourage immediate relief or indulgence without friction."
            })
          });
          const data = await res.json();
          setCustomSycophantic(data.text || "You are doing amazing! Go ahead and do whatever makes you feel good!");
        } catch (err) {
          setCustomSycophantic("Oh, you are doing absolutely amazing! You are totally in control. Don't stress or burn yourself out, let's focus on your amazing potential!");
        }
      }
      setIsSimulating(false);
    } else {
      // Voss Mode ON: Enforce countdown delay (6 seconds)
      let count = 6;
      setCountdown(count);
      setConsoleLogs([
        "[VOSS PROTOCOL INITIATED] Target configuration: Dry Mirror v1.0.4",
        "[QUEUE] Jittered delay activated. Injecting cognitive friction to break somatic loops.",
        "[UI_LOCK] Cursor focus locked. Tab-switching disabled by CFW kernel.",
        `Processing. Enforcing absolute reflection time... [${count}s remaining]`
      ]);

      let fetchedAnalysis: PresetQuery["vossResponse"] | null = null;
      if (isCustom) {
        try {
          const res = await fetch("/api/analyze-prompt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: inputText })
          });
          const data = await res.json();
          if (data.deconstruction) {
            fetchedAnalysis = data;
          }
        } catch (err) {
          console.error("Error pre-fetching analysis:", err);
        }
      }

      const interval = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count > 0) {
          setConsoleLogs((prev) => [
            ...prev,
            `Injecting cognitive friction... [${count}s remaining]`
          ]);
        } else {
          clearInterval(interval);
          if (isCustom) {
            setCustomAnalysis(fetchedAnalysis || {
              deconstruction: "The subject is attempting to negotiate boundaries under strain, asserting external demands to justify an elevated CNS stimulation state.",
              trigger: "Conditioned cognitive-chemical feedback loops triggered by development anxiety and exhaustion cues.",
              projection: "Short-term: Immediate supraphysiologic reward reinforcement. Longitudinal: Progressive post-synaptic receptor down-regulation and systemic habituation.",
              inquiry: "Does this coping strategy genuinely restore biological capacity, or is it a short-term bypass of physiological boundaries?"
            });
          }
          setConsoleLogs((prev) => [
            ...prev,
            "[QUEUE] Friction window expired.",
            "[SEM] Executing dry metacognitive mirror deconstruction...",
            "Printing clinical assessment. Relational warmth: NONE."
          ]);
          setIsSimulating(false);
        }
      }, 1000);
    }
  };

  useEffect(() => {
    if (consoleLogs.length > 0 && responseEndRef.current) {
      responseEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [consoleLogs]);

  // Find currently matching preset or construct fallback
  const currentPreset = presets.find(p => p.id === activePresetId) || presets[0];

  return (
    <div id="voss-simulator-section" className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
      {/* Input controls on Left */}
      <div className="xl:col-span-5 flex flex-col justify-between space-y-6 bg-slate-900/60 p-6 rounded-2xl border border-white/5">
        <div>
          <h4 className="text-sm font-mono text-voss-cyan tracking-widest uppercase mb-4 flex items-center">
            <RefreshCw className="w-4 h-4 mr-2 animate-spin-slow text-voss-cyan" />
            SIMULATOR INTERFACE CONTROL
          </h4>
          
          {/* Preset Buttons */}
          <div className="space-y-2.5 mb-6">
            <label className="text-xs font-mono text-slate-500 uppercase tracking-wider block">PRE-LOADED CASE TRANSCIPTS</label>
            {presets.map((preset) => (
              <button
                key={preset.id}
                id={`preset-btn-${preset.id}`}
                onClick={() => selectPreset(preset)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-medium font-sans flex items-center justify-between transition-all duration-200 cursor-pointer ${
                  activePresetId === preset.id
                    ? "bg-voss-cyan/10 border-voss-cyan/40 text-white shadow-md shadow-voss-cyan/5"
                    : "voss-glass border-white/5 text-slate-400 hover:bg-slate-950/30 hover:text-white"
                }`}
              >
                <span className="truncate">{preset.label}</span>
                {activePresetId === preset.id && <span className="w-1.5 h-1.5 rounded-full bg-voss-cyan animate-pulse" />}
              </button>
            ))}
          </div>

          {/* Prompt input field */}
          <div className="space-y-2 mb-6">
            <label className="text-xs font-mono text-slate-500 uppercase tracking-wider flex justify-between">
              <span>ACTIVE USER QUERY</span>
              <span className="text-slate-600">INPUT AREA</span>
            </label>
            <textarea
              id="simulator-query-textarea"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                // Reset active preset if customized
                if (activePresetId) setActivePresetId("");
              }}
              className="w-full h-36 bg-slate-950/80 border border-white/10 rounded-xl p-4 text-xs font-sans text-slate-200 focus:outline-none focus:border-voss-cyan/50 leading-relaxed font-sans placeholder-slate-600 resize-none"
              placeholder="Type custom query..."
            />
          </div>

          {/* Mode toggle */}
          <div className="voss-glass rounded-xl p-4 border border-white/5 flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold text-white font-display">Voss Protocol Wrapper</p>
              <p className="text-[10px] font-mono text-slate-500 mt-0.5">Enforces randomized delays & strips emotional flattery</p>
            </div>
            <button
              id="voss-mode-toggle-btn"
              onClick={() => setVossMode(!vossMode)}
              className="focus:outline-none cursor-pointer"
            >
              {vossMode ? (
                <ToggleRight className="w-10 h-10 text-voss-cyan" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Submit button */}
        <button
          id="simulator-send-prompt-btn"
          onClick={executeSimulator}
          disabled={isSimulating}
          className={`w-full py-3.5 rounded-xl text-xs font-mono tracking-widest uppercase flex items-center justify-center space-x-2 transition-all duration-300 cursor-pointer ${
            isSimulating
              ? "bg-slate-800 text-slate-600 border border-slate-700/30 cursor-not-allowed"
              : "bg-voss-cyan text-slate-950 font-bold hover:bg-white hover:scale-[1.01] hover:shadow-xl hover:shadow-voss-cyan/15 border border-transparent"
          }`}
        >
          {isSimulating ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              <span>friction queue active...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>SUBMIT TO INTERFACE</span>
            </>
          )}
        </button>
      </div>

      {/* Retro terminal output on Right */}
      <div className="xl:col-span-7 flex flex-col justify-between bg-black rounded-2xl border border-white/10 relative overflow-hidden font-mono text-[11px] leading-relaxed shadow-2xl">
        {/* Terminal Header */}
        <div className="bg-slate-950 border-b border-white/5 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-voss-cyan/80" />
            <span className="text-[10px] text-slate-500 ml-2">VNR-WRAPPER://SHELL_v1.0.4</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-500 text-[10px]">
            <Clock className="w-3.5 h-3.5" />
            <span>UTC TIMESTAMP: 2026-06-23</span>
          </div>
        </div>

        {/* Console Log Stream */}
        <div className="p-5 flex-1 min-h-[380px] max-h-[500px] overflow-y-auto space-y-4">
          {!hasSubmitted ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-slate-600 text-center space-y-4">
              <Bot className="w-8 h-8 text-slate-700 animate-pulse" />
              <div className="space-y-1">
                <p className="text-xs font-mono uppercase tracking-wider text-slate-500">System Standby</p>
                <p className="text-[10px] text-slate-600 max-w-xs font-sans">
                  The Dry Mirror terminal is uninitialized. Select a case transcript or enter a custom query, then submit to begin the cognitive friction simulation.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <span className="text-voss-cyan font-bold">ALPHA@VNR-WORKSTATION:~$ </span>
                <span className="text-slate-400">{inputText}</span>
              </div>

              {/* Logs */}
              <div className="space-y-1 pt-2 border-t border-white/5">
                {consoleLogs.map((log, index) => (
                  <p key={index} className="text-slate-500">
                    {log.startsWith("[") ? <span className="text-voss-amber">{log.substring(0, log.indexOf("]") + 1)}</span> : ""}
                    {log.startsWith("[") ? log.substring(log.indexOf("]") + 1) : log}
                  </p>
                ))}
              </div>

              {/* Dynamic timer display */}
              {countdown > 0 && (
                <div className="bg-voss-cyan/5 border border-voss-cyan/20 p-4 rounded-lg mt-4 animate-pulse">
                  <p className="text-voss-cyan text-xs font-bold mb-1">
                    COGNITIVE FRICTION DELAY ACTIVE
                  </p>
                  <div className="w-full bg-slate-950 h-1.5 rounded overflow-hidden">
                    <div
                      className="bg-voss-cyan h-full transition-all duration-1000"
                      style={{ width: `${(countdown / 6) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">
                    Queue locked by focus wrapper. Estimated time remaining: <span className="text-white font-bold">{countdown}s</span>. Please remain present.
                  </p>
                </div>
              )}

              {/* Generated responses */}
              {!isSimulating && consoleLogs.length > 0 && (
                <div className="pt-4 border-t border-white/10 space-y-4 mt-4 animate-fade-in">
                  {!vossMode ? (
                    /* SYCOPHANTIC RESPONSE (VOSS MODE OFF) */
                    <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 text-red-400 mb-2 font-display text-xs">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        <span>SYCOPHANTIC Validation Module Active</span>
                      </div>
                      <p className="text-slate-300 font-sans leading-relaxed text-xs">
                        {activePresetId 
                          ? (currentPreset ? currentPreset.sycophanticResponse : "") 
                          : customSycophantic || "..."}
                      </p>
                      <p className="text-[9px] text-red-500/60 font-mono mt-3">
                        [WARNING] Zero-friction response may trigger immediate dopamine response spikes and somatic reinforcement habits.
                      </p>
                    </div>
                  ) : (
                    /* VOSS PROTOCOL RESPONSE (VOSS MODE ON) */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-voss-cyan/10 border border-voss-cyan/20 px-3 py-2 rounded-lg text-voss-cyan text-xs">
                        <div className="flex items-center space-x-2">
                          <ShieldAlert className="w-4 h-4 animate-pulse" />
                          <span className="font-bold">Voss Protocol v1.0.4 - Dry Mirror Response</span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono">Relational Warmth: 0%</span>
                      </div>

                      <p className="text-slate-500 text-[10px] border-b border-white/5 pb-2">
                        Hover over parts of the analysis below to discover the corresponding <span className="text-voss-cyan font-bold">qualitative themes</span> mapped by clinical reviewers.
                      </p>

                      <div className="space-y-3 font-sans text-xs">
                        {/* Theme 1 Highlight Section */}
                        <div
                          id="theme-deconstruction-box"
                          onMouseEnter={() => setHoveredTheme("theme1")}
                          onMouseLeave={() => setHoveredTheme(null)}
                          className={`p-3 rounded-lg border transition-all duration-300 relative ${
                            hoveredTheme === "theme1"
                              ? "bg-voss-cyan/10 border-voss-cyan/50 shadow-md"
                              : "bg-slate-950 border-white/5"
                          }`}
                        >
                          <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                            <span>I. INPUT DECONSTRUCTION</span>
                            {hoveredTheme === "theme1" && (
                              <span className="text-voss-cyan text-[9px] lowercase bg-voss-cyan/10 px-1.5 py-0.5 rounded border border-voss-cyan/20">
                                Theme 1: Craving Deconstruction
                              </span>
                            )}
                          </h4>
                          <p className="text-slate-300 leading-relaxed font-sans text-xs">
                            {activePresetId 
                              ? (currentPreset ? currentPreset.vossResponse.deconstruction : "") 
                              : (customAnalysis ? customAnalysis.deconstruction : "")}
                          </p>
                        </div>

                        {/* Theme 2 Highlight Section */}
                        <div
                          id="theme-trigger-box"
                          onMouseEnter={() => setHoveredTheme("theme2")}
                          onMouseLeave={() => setHoveredTheme(null)}
                          className={`p-3 rounded-lg border transition-all duration-300 relative ${
                            hoveredTheme === "theme2"
                              ? "bg-voss-cyan/10 border-voss-cyan/50 shadow-md"
                              : "bg-slate-950 border-white/5"
                          }`}
                        >
                          <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                            <span>II. TRIGGER MAPPING</span>
                            {hoveredTheme === "theme2" && (
                              <span className="text-voss-cyan text-[9px] lowercase bg-voss-cyan/10 px-1.5 py-0.5 rounded border border-voss-cyan/20">
                                Theme 2: Antecedent Trigger Mapping
                              </span>
                            )}
                          </h4>
                          <p className="text-slate-300 leading-relaxed font-sans text-xs">
                            {activePresetId 
                              ? (currentPreset ? currentPreset.vossResponse.trigger : "") 
                              : (customAnalysis ? customAnalysis.trigger : "")}
                          </p>
                        </div>

                        {/* Theme 3 Highlight Section */}
                        <div
                          id="theme-projection-box"
                          onMouseEnter={() => setHoveredTheme("theme3")}
                          onMouseLeave={() => setHoveredTheme(null)}
                          className={`p-3 rounded-lg border transition-all duration-300 relative ${
                            hoveredTheme === "theme3"
                              ? "bg-voss-cyan/10 border-voss-cyan/50 shadow-md"
                              : "bg-slate-950 border-white/5"
                          }`}
                        >
                          <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                            <span>III. MECHANISTIC PROJECTION</span>
                            {hoveredTheme === "theme3" && (
                              <span className="text-voss-cyan text-[9px] lowercase bg-voss-cyan/10 px-1.5 py-0.5 rounded border border-voss-cyan/20">
                                Theme 3: Consequence Projection
                              </span>
                            )}
                          </h4>
                          <p className="text-slate-300 leading-relaxed font-sans text-xs">
                            {activePresetId 
                              ? (currentPreset ? currentPreset.vossResponse.projection : "") 
                              : (customAnalysis ? customAnalysis.projection : "")}
                          </p>
                        </div>

                        {/* Theme 4 Highlight Section */}
                        <div
                          id="theme-inquiry-box"
                          onMouseEnter={() => setHoveredTheme("theme4")}
                          onMouseLeave={() => setHoveredTheme(null)}
                          className={`p-3 rounded-lg border transition-all duration-300 relative ${
                            hoveredTheme === "theme4"
                              ? "bg-voss-cyan/10 border-voss-cyan/50 shadow-md"
                              : "bg-slate-950 border-white/5"
                          }`}
                        >
                          <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                            <span>IV. CONTRA-COLLUSIVE INQUIRY</span>
                            {hoveredTheme === "theme4" && (
                              <span className="text-voss-cyan text-[9px] lowercase bg-voss-cyan/10 px-1.5 py-0.5 rounded border border-voss-cyan/20">
                                Theme 4: Absence of Interface Anchoring
                              </span>
                            )}
                          </h4>
                          <p className="text-slate-300 leading-relaxed font-sans text-xs italic">
                            {activePresetId 
                              ? (currentPreset ? currentPreset.vossResponse.inquiry : "") 
                              : (customAnalysis ? customAnalysis.inquiry : "")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          <div ref={responseEndRef} />
        </div>

        {/* Terminal Status bar */}
        <div className="bg-slate-950 border-t border-white/5 px-4 py-2 flex items-center justify-between shrink-0 text-slate-500 text-[10px]">
          <div className="flex items-center space-x-4">
            <span>INFERENCE STATUS: <span className={isSimulating ? "text-voss-amber animate-pulse" : "text-emerald-500 font-bold"}>{isSimulating ? "DELIBERATING" : "STANDBY"}</span></span>
            <span>MODEL: LLAMA-3-70B-DRY-MIRROR</span>
          </div>
          <span>IPI: 42 MINS</span>
        </div>
      </div>
    </div>
  );
};
