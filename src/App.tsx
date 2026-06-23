import React, { useState } from "react";
import Header from "./components/Header";
import PaperReader from "./components/PaperReader";
import UniversalitySimulator from "./components/UniversalitySimulator";
import VossProtocolSandbox from "./components/VossProtocolSandbox";
import SynthesisLab from "./components/SynthesisLab";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("papers");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans select-none selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header & Navigation tab management */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main interactive viewport workspace */}
      <main className="flex-grow max-w-7xl w-full mx-auto pb-12">
        {activeTab === "papers" && <PaperReader />}
        {activeTab === "simulator" && <UniversalitySimulator />}
        {activeTab === "voss" && <VossProtocolSandbox />}
        {activeTab === "lab" && <SynthesisLab />}
      </main>

      {/* Academic Hub bottom footer bar */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-[10px] font-mono text-zinc-600 space-y-1">
        <p>© 2026 RECONSTRUCTIVE COGNITIVE SCAFFOLDS PROJECT • ALL RIGHTS RESERVED.</p>
        <p className="text-zinc-700">Synthesized and developed under compliance with the Voss Protocols.</p>
      </footer>
    </div>
  );
}
