import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageGenerationSettings, ChatMessage } from "../types";
import { Image, MessageSquare, Send, Sparkles, Loader2, HelpCircle, Download, Monitor, RefreshCw } from "lucide-react";

export default function SynthesisLab() {
  // Chat state
  const [chatModel, setChatModel] = useState<"gemini-3.1-pro-preview" | "gemini-3.5-flash" | "gemini-3.1-flash-lite">("gemini-3.5-flash");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "Welcome to the Synthesis Lab. I can answer questions regarding Methamphetamine rewiring universality or the Voss Protocols. Choose an AI model to evaluate reasoning capabilities.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Image Generation state
  const [imageSettings, setImageSettings] = useState<ImageGenerationSettings>({
    prompt: "A highly complex neural synapse showing extreme dopamine transporter (DAT) downregulation under stimulant exposure, conceptual neon microscopic art, high-tech science illustration",
    aspectRatio: "16:9",
    imageSize: "1K", // Mandatory size selectors: 1K, 2K, 4K
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>("");
  const [generationError, setGenerationError] = useState("");

  const suggestedQuestions = [
    { label: "Brain vs Mind", text: "How does prefrontal hypofunction bypass intellectual self-narrative or high cognitive ability as a protective shield?" },
    { label: "Somatic Feedback Loops", text: "Explain how the mandatory Voss response delay breaks the somatic 'phone-in-hand' reinforcement feedback loop." },
    { label: "Subject Alpha Outcome", text: "Summarize the 18-month trajectory of Subject Alpha's substance reduction under the Voss Protocols." },
  ];

  // Call server chat endpoint
  const sendChatMessage = async (customMessage?: string) => {
    const textToSend = customMessage || inputText;
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsSending(true);

    try {
      // Map history to server payload format
      const historyPayload = messages.slice(1).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const systemInstruction = `You are a professional, neutral research scientist specializing in neurobiology and interface ergonomics.
Your knowledge base is strictly defined by these two synthesized papers:
1. "Methamphetamine Addiction's Indiscriminate Rewiring of Reward Circuitry" (Universality, DAT density, wanting vs liking disconnect, prefrontal hypofunction).
2. "The Voss Protocols: Mitigating Algorithmic Dopamine Loops and AI Dependency" (Variable Reward Architecture, interface friction, mandatory response delays, sycophancy elimination, single-subject Alpha 18-month trial).

Your responses must remain analytical, objective, third-person, and accurate to these texts. Avoid speculative or ungrounded medical claims outside these documents. Keep responses clear and structured.`;

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
          model: chatModel,
          systemInstruction,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to retrieve chat response");
      }

      const data = await response.json();

      const modelMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "model",
        text: data.text,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "model",
          text: "Communication error: Please verify that process.env.GEMINI_API_KEY is configured correctly inside your Secrets console.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // Call server image generation endpoint
  const generateVisualization = async () => {
    if (!imageSettings.prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGenerationError("");
    setGeneratedImageUrl("");

    try {
      const response = await fetch("/api/gemini/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imageSettings.prompt,
          aspectRatio: imageSettings.aspectRatio,
          imageSize: imageSettings.imageSize,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate visualization");
      }

      const data = await response.json();
      setGeneratedImageUrl(data.imageUrl);
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || "Model request failed. Ensure premium models are configured via show_aistudio_ui paid_model_flow.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-zinc-900 pb-4">
          <span className="text-xs font-mono text-amber-500 font-bold uppercase tracking-wider block">
            GEMINI INTELLIGENCE PLATFORM
          </span>
          <h2 className="text-2xl font-bold font-sans tracking-tight">
            Synthesis Lab & Neurobiological Visualizer
          </h2>
          <p className="text-sm text-zinc-400">
            Probe the literature with specialized models, or generate physical conceptual diagrams.
          </p>
        </div>

        {/* Dual Panels Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Part 1: Interactive Chatbot */}
          <div className="border border-zinc-900 bg-zinc-900/10 rounded-2xl p-5 md:p-6 flex flex-col h-[650px]">
            {/* Header / Selector */}
            <div className="space-y-3 pb-3 border-b border-zinc-900 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-amber-500" /> Literative Chat Q&A
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  Select Model Class:
                </span>
              </div>

              {/* Model Choice Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "gemini-3.1-pro-preview", label: "Pro Reasoning", color: "text-amber-500 border-amber-500/30" },
                  { id: "gemini-3.5-flash", label: "Flash Standard", color: "text-zinc-300 border-zinc-800" },
                  { id: "gemini-3.1-flash-lite", label: "Lite Fast", color: "text-zinc-400 border-zinc-850" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setChatModel(m.id as any)}
                    className={`py-1.5 rounded text-[10px] md:text-xs font-mono border transition-all cursor-pointer text-center ${
                      chatModel === m.id
                        ? "bg-amber-500/10 border-amber-500/50 text-amber-500 font-bold"
                        : "bg-zinc-900/30 border-zinc-900 text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Suggestions list */}
            <div className="mb-4">
              <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider block mb-1.5">
                Suggested Research Queries:
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendChatMessage(q.text)}
                    className="p-1.5 rounded bg-zinc-900 border border-zinc-850 text-[10px] font-mono text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
                    disabled={isSending}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Stream View */}
            <div className="flex-grow overflow-y-auto space-y-4 pr-1 mb-4 scrollbar-thin scrollbar-thumb-zinc-800">
              {messages.map((m) => {
                const isModel = m.role === "model";
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col max-w-[85%] ${
                      isModel ? "self-start" : "self-end ml-auto"
                    }`}
                  >
                    <span className="text-[9px] font-mono text-zinc-500 mb-1 px-1">
                      {isModel ? `${chatModel.toUpperCase()}` : "SUBJECT / RESEARCHER"} • {m.timestamp}
                    </span>
                    <div
                      className={`p-3 rounded-xl text-xs font-mono leading-relaxed text-justify ${
                        isModel
                          ? "bg-zinc-900 border border-zinc-850 text-zinc-300"
                          : "bg-amber-500 text-zinc-950 font-bold"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}
              {isSending && (
                <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Model is digesting query...</span>
                </div>
              )}
            </div>

            {/* Footer Form input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Ask ${chatModel}...`}
                className="flex-grow bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs font-mono focus:outline-none focus:border-amber-500/50 text-zinc-200"
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendChatMessage();
                }}
                disabled={isSending}
              />
              <button
                onClick={() => sendChatMessage()}
                disabled={isSending || !inputText.trim()}
                className="bg-amber-500 hover:bg-amber-450 text-zinc-950 px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Part 2: Image Generation Lab */}
          <div className="border border-zinc-900 bg-zinc-900/10 rounded-2xl p-5 md:p-6 flex flex-col h-[650px] justify-between">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <span className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-1.5">
                  <Image className="w-4 h-4 text-amber-500" /> Conceptual Cognitive Visualizer
                </span>
                <span className="text-[10px] font-mono text-zinc-500 bg-amber-500/5 border border-amber-500/20 px-2 py-0.5 rounded text-amber-500 font-bold">
                  gemini-3-pro-image-preview
                </span>
              </div>

              {/* Controls Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Size select - MANDATORY Affordance for 1K, 2K, 4K */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider block">
                    Resolution Size:
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-zinc-950 border border-zinc-800 rounded p-0.5">
                    {["1K", "2K", "4K"].map((size) => {
                      const isActive = imageSettings.imageSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setImageSettings({ ...imageSettings, imageSize: size as any })}
                          className={`py-1 text-[10px] font-mono rounded cursor-pointer text-center ${
                            isActive ? "bg-amber-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Aspect ratio */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider block">
                    Aspect Ratio:
                  </label>
                  <select
                    value={imageSettings.aspectRatio}
                    onChange={(e) => setImageSettings({ ...imageSettings, aspectRatio: e.target.value as any })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded text-xs font-mono text-zinc-300 px-2 py-1.5 focus:outline-none"
                  >
                    <option value="1:1">1:1 (Square)</option>
                    <option value="4:3">4:3 (Card)</option>
                    <option value="16:9">16:9 (Landscape)</option>
                    <option value="3:4">3:4 (Portrait)</option>
                    <option value="9:16">9:16 (Full Screen)</option>
                  </select>
                </div>
              </div>

              {/* Prompt box */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider block">
                  Diagram Prompt:
                </label>
                <textarea
                  value={imageSettings.prompt}
                  onChange={(e) => setImageSettings({ ...imageSettings, prompt: e.target.value })}
                  placeholder="Describe a neurobiological synapse, cognitive scaffold, or dopamine flow..."
                  className="w-full h-18 bg-zinc-950 border border-zinc-800 rounded-lg p-3.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-amber-500/50 resize-none leading-relaxed"
                />
              </div>

              {/* Action Button */}
              <button
                onClick={generateVisualization}
                disabled={isGenerating || !imageSettings.prompt.trim()}
                className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold tracking-tight cursor-pointer transition-all border flex items-center justify-center gap-1.5 ${
                  isGenerating
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-500"
                    : "bg-amber-500 border-amber-600 text-zinc-950 hover:bg-amber-450 hover:shadow-lg hover:shadow-amber-500/10"
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>DRAFTING CONCEPT GRAPHIC ({imageSettings.imageSize})...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>GENERATE CONCEPT DIAGRAM ({imageSettings.imageSize})</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Image frame */}
            <div className="flex-grow border border-zinc-900 bg-zinc-950 rounded-xl relative overflow-hidden flex items-center justify-center mt-4">
              {isGenerating ? (
                <div className="text-center space-y-2">
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block animate-pulse">
                    Synthesizing Visual Pixels...
                  </span>
                  <p className="text-[9px] text-zinc-600 font-mono">May take up to 10 seconds.</p>
                </div>
              ) : generatedImageUrl ? (
                <div className="w-full h-full relative group">
                  <img
                    src={generatedImageUrl}
                    alt="Synthesis Concept"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  {/* Download hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
                    <a
                      href={generatedImageUrl}
                      download="dopamine-scaffold-visualization.png"
                      className="bg-amber-500 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 hover:bg-amber-450"
                    >
                      <Download className="w-4 h-4" /> Download Graphic
                    </a>
                  </div>
                </div>
              ) : generationError ? (
                <div className="text-center p-6 space-y-2">
                  <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                  <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest block">
                    Generation Terminated
                  </span>
                  <p className="text-[10px] text-zinc-600 font-mono max-w-xs mx-auto">
                    {generationError}
                  </p>
                </div>
              ) : (
                <div className="text-center text-zinc-600 p-6 space-y-1.5">
                  <Monitor className="w-8 h-8 mx-auto text-zinc-800" />
                  <span className="text-[10px] font-mono uppercase tracking-widest block">
                    Conceptual Viewport Empty
                  </span>
                  <p className="text-[9px] text-zinc-500 font-mono max-w-xs">
                    Specify parameters above and click generate to visualize neurotransmitter mapping or interface schemas.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple fallback Icon
function AlertCircle(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" />
      <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" />
    </svg>
  );
}
