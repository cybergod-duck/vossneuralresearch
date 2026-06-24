import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bot, Sparkles, Send, Image as ImageIcon, Sliders, 
  Download, RefreshCw, User, Cpu, Activity, Compass, 
  ArrowRight, ShieldAlert, CheckCircle2, AlertTriangle, Eye
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

const PERSONAS = [
  {
    id: "mirror",
    name: "Metacognitive Mirror",
    role: "A clinical evaluator focused on exposing rationalizations with 0% relational warmth. Strictly analytical.",
    description: "Cold, highly analytical, focuses on cognitive deconstruction and exposing dopamine loops.",
    accentColor: "border-voss-cyan text-voss-cyan",
    bgHover: "hover:bg-voss-cyan/5",
    icon: ShieldAlert
  },
  {
    id: "somatic",
    name: "Somatic Navigator",
    role: "A calming clinical guide focused on physical grounding, deep breathing loops, and nervous system state transitions.",
    description: "Supportive and highly focused on somatic exercises, metabolic status, and sensory feedback.",
    accentColor: "border-emerald-500 text-emerald-400",
    bgHover: "hover:bg-emerald-950/20",
    icon: Activity
  },
  {
    id: "socrates",
    name: "Socratic Facilitator",
    role: "An expert clinical inquirer who answers questions strictly with highly targeted inquiries to provoke self-discovery.",
    description: "Replies with sharp, diagnostic inquiries to help you dissect your own chemical/behavioral dependencies.",
    accentColor: "border-voss-amber text-voss-amber",
    bgHover: "hover:bg-voss-amber/5",
    icon: Compass
  }
];

const IMAGE_PRESETS = [
  {
    title: "Metabolic Rest Baseline",
    prompt: "Sleek representations of a prefrontal cortex cooling down from high-intensity code stress, deep obsidian dark theme, fluid cyan neural pathways, glassmorphic layers, 8k resolution, highly polished, scientific aesthetic"
  },
  {
    title: "Emerald Baseline Restoration",
    prompt: "A minimalist organic somatic anchor, calming emerald green light radiating from a central stone column, clearing out crimson chaotic digital static, high-tech dark mode grid, sharp focus"
  },
  {
    title: "Neurochemical Centering",
    prompt: "Abstract visualization of dopamine receptor density stabilization, clean glowing teal nodes, structured geometric grids, three-dimensional depth, professional academic poster design"
  }
];

export const VnrLabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"chat" | "image">("chat");

  // Chat States
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "System uninitialized. Select a facilitator persona below to begin your metacognitive review or somatic alignment session.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0]);
  const [isChatSending, setIsChatSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Image states
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (messages.length > 1) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handlePersonaChange = (persona: typeof PERSONAS[0]) => {
    setSelectedPersona(persona);
    setMessages([
      {
        role: "assistant",
        text: `Session established with Autonomous Facilitator [${persona.name}]. Ready to assist in clinical evaluation. How are you currently managing your cognitive capacity?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const sendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isChatSending) return;

    const userMsgText = inputMessage.trim();
    setInputMessage("");

    const userMsg: Message = {
      role: "user",
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsChatSending(true);

    try {
      const chatHistory = [...messages, userMsg].map((msg) => ({
        role: msg.role,
        text: msg.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          systemInstruction: `You are Voss Neural Research (VNR) Autonomous Facilitator model [${selectedPersona.name}].
Your role: ${selectedPersona.role}
Maintain a highly clinical, professional, and slightly detached tone (obsidian/high-tech vibe). Avoid casual friendliness, emojis, or supportive filler words unless explicitly instructed by the somatic navigator persona. Help the user evaluate and overcome dopamine-loop traps.`
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "ERR_SESSION_TIMEOUT: Failed to transmit cognitive tokens. Please verify your connection status and ensure a valid Gemini API Key is configured in your Secrets panel.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsChatSending(false);
    }
  };

  const generateImage = async () => {
    if (!imagePrompt.trim() || isGeneratingImage) return;

    setIsGeneratingImage(true);
    setGeneratedImageUrl(null);
    setImageError(null);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imagePrompt,
          imageSize,
          aspectRatio
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setGeneratedImageUrl(data.image);
    } catch (err: any) {
      console.error(err);
      setImageError(err.message || "An unexpected error occurred during somatic image generation. Please ensure your GEMINI_API_KEY is configured.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const PersonaIcon = selectedPersona.icon;

  return (
    <div id="vnr-labs-section" className="bg-[#0D1527]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative ambient blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-voss-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header section with tab selectors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-voss-cyan text-xs font-mono uppercase tracking-widest mb-1.5">
            <Cpu className="w-4 h-4 text-voss-cyan animate-pulse" />
            <span>VNR RESEARCH LABS</span>
          </div>
          <h2 className="text-2xl font-display font-medium text-white tracking-tight">
            Clinical AI Diagnostics & Synthesis
          </h2>
          <p className="text-slate-400 text-xs mt-1 max-w-xl font-sans">
            Real-time cognitive alignment sessions and metabolic imagery synthesis leveraging multi-model generative intelligence.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-white/5 self-start md:self-center">
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wider transition-all duration-300 flex items-center space-x-2 ${
              activeTab === "chat"
                ? "bg-voss-cyan text-slate-950 font-bold shadow-lg shadow-voss-cyan/15"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>COGNITIVE FACILITATOR</span>
          </button>
          <button
            onClick={() => setActiveTab("image")}
            className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wider transition-all duration-300 flex items-center space-x-2 ${
              activeTab === "image"
                ? "bg-voss-cyan text-slate-950 font-bold shadow-lg shadow-voss-cyan/15"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>SOMATIC IMAGERY LAB</span>
          </button>
        </div>
      </div>

      {/* Content Container */}
      <AnimatePresence mode="wait">
        {activeTab === "chat" ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Persona selectors */}
            <div className="lg:col-span-4 space-y-4">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                FACILITATOR PERSONA SELECTION
              </label>

              <div className="space-y-3">
                {PERSONAS.map((persona) => {
                  const Icon = persona.icon;
                  const isSelected = selectedPersona.id === persona.id;
                  return (
                    <button
                      key={persona.id}
                      onClick={() => handlePersonaChange(persona)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "bg-slate-900/80 border-voss-cyan/40 shadow-lg shadow-voss-cyan/5"
                          : "bg-slate-950/40 border-white/5 hover:border-white/10 hover:bg-slate-950/80"
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-1.5">
                        <div className={`p-1.5 rounded-lg border bg-slate-950 ${isSelected ? persona.accentColor : "border-white/10 text-slate-400"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-xs font-mono font-medium ${isSelected ? "text-white" : "text-slate-400"}`}>
                          {persona.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                        {persona.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Status card */}
              <div className="bg-slate-950 border border-white/5 p-4 rounded-xl">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-2">
                  <span>METRIC MONITOR</span>
                  <span className="text-emerald-500 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                    ONLINE
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-400">Restoration Depth:</span>
                    <span className="text-[10px] font-mono text-voss-cyan font-semibold">84.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-400">Clinical Focus Latency:</span>
                    <span className="text-[10px] font-mono text-slate-300">0.45 ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-400">Cognitive Alignment Coefficient:</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">1.44</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Thread */}
            <div className="lg:col-span-8 flex flex-col h-[520px] bg-slate-950 rounded-2xl border border-white/5 overflow-hidden">
              {/* Chat Header */}
              <div className="bg-slate-950/80 border-b border-white/5 px-4 py-3 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <div className={`p-1 rounded-md border ${selectedPersona.accentColor}`}>
                    <PersonaIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-white font-medium">{selectedPersona.name}</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  SYSTEM MODEL: <span className="text-voss-cyan font-bold">GEMINI-3.5-FLASH</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => {
                  const isAssistant = msg.role === "assistant";
                  return (
                    <div
                      key={index}
                      className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                    >
                      <div className={`flex items-start space-x-2.5 max-w-[85%] ${!isAssistant && "flex-row-reverse space-x-reverse"}`}>
                        <div className={`p-1.5 rounded-lg border shrink-0 bg-slate-950 ${
                          isAssistant ? selectedPersona.accentColor : "border-white/20 text-slate-300"
                        }`}>
                          {isAssistant ? <PersonaIcon className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                        </div>

                        <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-sans ${
                          isAssistant
                            ? "bg-slate-900/60 border border-white/5 text-slate-300 rounded-tl-none"
                            : "bg-voss-cyan/10 border border-voss-cyan/20 text-white rounded-tr-none"
                        }`}>
                          <p className="whitespace-pre-line">{msg.text}</p>
                          <span className="text-[8px] font-mono text-slate-500 block mt-1.5 text-right uppercase">
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {isChatSending && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2.5 max-w-[85%]">
                      <div className={`p-1.5 rounded-lg border bg-slate-950 ${selectedPersona.accentColor}`}>
                        <PersonaIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center space-x-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-voss-cyan" />
                        <span className="font-mono text-[10px] tracking-wide uppercase">Deliberating cognitive feedback...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={sendChatMessage} className="bg-slate-950 border-t border-white/5 p-3 flex items-center space-x-3 shrink-0">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Consult ${selectedPersona.name} regarding current cognitive status...`}
                  className="flex-1 bg-slate-900/80 border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-voss-cyan/30 focus:bg-slate-900 transition-all font-sans"
                  disabled={isChatSending}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isChatSending}
                  className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center shrink-0 cursor-pointer ${
                    !inputMessage.trim() || isChatSending
                      ? "bg-slate-900 text-slate-600 border border-white/5"
                      : "bg-voss-cyan text-slate-950 font-bold hover:scale-[1.03] shadow-lg shadow-voss-cyan/15 hover:bg-white"
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="image"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Input Controls */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                  CHOOSE A SOMATIC TEMPLATE OR CREATE CUSTOM
                </label>

                {/* Presets */}
                <div className="space-y-2">
                  {IMAGE_PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => setImagePrompt(preset.prompt)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 flex items-start space-x-3 cursor-pointer ${
                        imagePrompt === preset.prompt
                          ? "bg-voss-cyan/5 border-voss-cyan/30 text-white"
                          : "bg-slate-950/40 border-white/5 hover:border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      <Compass className="w-4 h-4 mt-0.5 shrink-0 text-voss-cyan" />
                      <div>
                        <div className="text-[11px] font-mono font-medium uppercase tracking-wider mb-0.5">{preset.title}</div>
                        <p className="text-[10px] text-slate-500 line-clamp-1 leading-relaxed font-sans">{preset.prompt}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea for Prompt */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                  CUSTOM IMAGE GENERATION PROMPT
                </label>
                <textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Describe your somatic imagery in vivid visual terms (e.g., minimalist stones, organic glass spheres with glowing cyan essence, deep shadow ambient, scientific rendering, academic diagram)..."
                  className="w-full h-32 bg-slate-950 border border-white/5 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-voss-cyan/30 transition-all leading-relaxed font-sans resize-none"
                />
              </div>

              {/* Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                    RESOLUTION AFFORDANCE
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-white/5">
                    {["1K", "2K", "4K"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setImageSize(size as "1K" | "2K" | "4K")}
                        className={`py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                          imageSize === size
                            ? "bg-voss-cyan text-slate-950 font-bold"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                    ASPECT RATIO
                  </label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 rounded-xl py-2 px-3 text-[10px] font-mono text-slate-300 focus:outline-none focus:border-voss-cyan/30 focus:bg-slate-950 cursor-pointer"
                  >
                    <option value="1:1">1:1 Square</option>
                    <option value="16:9">16:9 Cinema</option>
                    <option value="3:4">3:4 Portrait</option>
                    <option value="4:3">4:3 Landscape</option>
                  </select>
                </div>
              </div>

              {/* Generate button */}
              <button
                onClick={generateImage}
                disabled={!imagePrompt.trim() || isGeneratingImage}
                className={`w-full py-4 rounded-xl text-xs font-mono tracking-widest uppercase flex items-center justify-center space-x-2 transition-all duration-300 cursor-pointer ${
                  !imagePrompt.trim() || isGeneratingImage
                    ? "bg-slate-900 text-slate-600 border border-white/5 cursor-not-allowed"
                    : "bg-voss-cyan text-slate-950 font-bold hover:scale-[1.01] hover:shadow-xl hover:shadow-voss-cyan/15 border border-transparent hover:bg-white"
                }`}
              >
                {isGeneratingImage ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>SYNTHESIZING IMAGERY...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4" />
                    <span>SYNTHESIZE SOMATIC ANCHOR</span>
                  </>
                )}
              </button>
            </div>

            {/* Display Canvas */}
            <div className="lg:col-span-7 flex flex-col h-[520px] bg-slate-950 rounded-2xl border border-white/5 overflow-hidden justify-between relative">
              {/* Header */}
              <div className="bg-slate-950/80 border-b border-white/5 px-4 py-3 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2 text-slate-300">
                  <ImageIcon className="w-3.5 h-3.5 text-voss-cyan" />
                  <span>Somatic Anchor Visualizer</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  ENGINE: <span className="text-voss-cyan font-bold">GEMINI-3-PRO-IMAGE</span>
                </div>
              </div>

              {/* Main Canvas body */}
              <div className="flex-1 flex items-center justify-center p-6 relative">
                {isGeneratingImage ? (
                  <div className="text-center space-y-4">
                    <div className="relative w-20 h-20 mx-auto">
                      <div className="absolute inset-0 rounded-full border-2 border-voss-cyan/10 animate-ping" />
                      <div className="absolute inset-2 rounded-full border-2 border-voss-cyan/30 animate-pulse" />
                      <div className="absolute inset-0 rounded-full border-t-2 border-voss-cyan animate-spin" style={{ animationDuration: "1.5s" }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Cpu className="w-6 h-6 text-voss-cyan animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-mono uppercase tracking-wider text-voss-cyan animate-pulse">Running Neural Rendering</p>
                      <p className="text-[10px] text-slate-500 font-sans max-w-xs mx-auto">
                        Generating raw visual structures in {imageSize === "1K" ? "1024px" : imageSize === "2K" ? "2048px" : "4096px"} fidelity. This takes a few moments.
                      </p>
                    </div>
                  </div>
                ) : generatedImageUrl ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2">
                    <div className="relative border border-white/10 rounded-xl overflow-hidden shadow-2xl bg-[#090D1C] max-w-[90%] max-h-[85%] group">
                      <img
                        src={generatedImageUrl}
                        alt="Somatic visual anchor"
                        referrerPolicy="no-referrer"
                        className="object-contain max-h-[340px] rounded-lg transition-transform duration-300 hover:scale-[1.01]"
                      />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center space-x-3">
                        <button
                          onClick={() => setIsZoomed(true)}
                          className="p-2.5 rounded-lg bg-slate-900 border border-white/20 text-white hover:bg-white hover:text-slate-950 transition-all cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <a
                          href={generatedImageUrl}
                          download="vnr_somatic_anchor.png"
                          className="p-2.5 rounded-lg bg-slate-900 border border-white/20 text-white hover:bg-white hover:text-slate-950 transition-all cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 bg-slate-900/50 border border-white/5 py-1.5 px-3 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[10px] text-slate-400 font-mono uppercase">ANCHOR SAVED AT {imageSize} RESOLUTION</span>
                    </div>
                  </div>
                ) : imageError ? (
                  <div className="text-center p-4 max-w-sm space-y-3">
                    <AlertTriangle className="w-8 h-8 text-voss-amber mx-auto animate-bounce" />
                    <div>
                      <p className="text-xs font-mono text-voss-amber uppercase tracking-wider">GENERATION_EXCEPTION</p>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-sans mt-1">
                        {imageError}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <ImageIcon className="w-10 h-10 text-slate-700 mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-mono uppercase tracking-wider text-slate-500">Imagery canvas idle</p>
                      <p className="text-[10px] text-slate-600 font-sans max-w-xs mx-auto">
                        No somatic imagery has been synthesized in this session. Write a prompt or choose a preset and trigger synthesis above.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Canvas footer */}
              <div className="bg-slate-950 border-t border-white/5 px-4 py-2 flex items-center justify-between shrink-0 text-slate-500 text-[10px] font-mono">
                <div className="flex items-center space-x-3">
                  <span>CANVAS STATUS: <span className={isGeneratingImage ? "text-voss-amber animate-pulse" : "text-emerald-500 font-bold"}>{isGeneratingImage ? "SYNTHESIZING" : "STANDBY"}</span></span>
                  {generatedImageUrl && <span>FIDELITY: {imageSize}</span>}
                </div>
                <span>VNR QUANTUM FRAMEWORK</span>
              </div>
            </div>

            {/* Modal Zoom */}
            {isZoomed && generatedImageUrl && (
              <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md">
                <div className="relative max-w-4xl max-h-[90vh]">
                  <img
                    src={generatedImageUrl}
                    alt="Somatic anchor zoomed"
                    referrerPolicy="no-referrer"
                    className="max-h-[80vh] max-w-full rounded-2xl border border-white/10 shadow-2xl"
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-slate-400 max-w-xl font-sans line-clamp-2">
                      Prompt: <span className="text-white italic">"{imagePrompt}"</span>
                    </p>
                    <button
                      onClick={() => setIsZoomed(false)}
                      className="px-4 py-2 bg-white text-slate-950 font-bold rounded-lg text-xs font-mono cursor-pointer hover:bg-voss-cyan transition-colors"
                    >
                      CLOSE ZOOM
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
