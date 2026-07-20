import React, { useState, useEffect } from "react";
import { ShieldAlert, Activity, Cpu, Database, AlertCircle, Play, Layers, CheckCircle2, ChevronRight, Terminal as TerminalIcon } from "lucide-react";

export const VnrLive: React.FC = () => {
  const [activeSection, setActiveSection] = useState("scan-live");

  // Intersection observer to track active section for the sidebar TOC
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["scan-live", "scan-overview", "scan-gpu", "scan-browsers", "scan-incidents", "fortress-deployment"];
      let currentSection = "scan-live";
      
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            currentSection = sectionId;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative select-text font-sans">
      
      {/* SIDEBAR TABLE OF CONTENTS (2 cols) */}
      <div className="lg:col-span-2 hidden lg:block">
        <div className="sticky top-24 flex flex-col gap-1.5 font-mono text-[10px] uppercase tracking-wider">
          <span className="text-[9px] text-slate-500 font-bold mb-3 px-3">Live Navigation</span>
          
          <a 
            href="#scan-live" 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all border-l-2 ${
              activeSection === "scan-live" 
                ? "bg-slate-900/60 text-red-400 border-l-red-500 font-bold" 
                : "text-slate-400 hover:text-slate-200 border-l-transparent"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            Live Capture
          </a>

          <a 
            href="#scan-overview" 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all border-l-2 ${
              activeSection === "scan-overview" 
                ? "bg-slate-900/60 text-voss-cyan border-l-voss-cyan font-bold" 
                : "text-slate-400 hover:text-slate-200 border-l-transparent"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-voss-cyan" />
            Scan Results
          </a>

          <a 
            href="#scan-gpu" 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all border-l-2 ${
              activeSection === "scan-gpu" 
                ? "bg-slate-900/60 text-red-500 border-l-red-500 font-bold" 
                : "text-slate-400 hover:text-slate-200 border-l-transparent"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            GPU Abuse
          </a>

          <a 
            href="#scan-browsers" 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all border-l-2 ${
              activeSection === "scan-browsers" 
                ? "bg-slate-900/60 text-orange-400 border-l-orange-400 font-bold" 
                : "text-slate-400 hover:text-slate-200 border-l-transparent"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            Profiles
          </a>

          <a 
            href="#scan-incidents" 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all border-l-2 ${
              activeSection === "scan-incidents" 
                ? "bg-slate-900/60 text-yellow-400 border-l-yellow-400 font-bold" 
                : "text-slate-400 hover:text-slate-200 border-l-transparent"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
            Incidents
          </a>

          <a 
            href="#fortress-deployment" 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all border-l-2 ${
              activeSection === "fortress-deployment" 
                ? "bg-slate-900/60 text-blue-500 border-l-blue-500 font-bold" 
                : "text-slate-400 hover:text-slate-200 border-l-transparent"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Locker Mode
          </a>
        </div>
      </div>

      {/* MAIN DASHBOARD AREA (10 cols) */}
      <div className="lg:col-span-10 space-y-12">

        {/* Dashboard Header */}
        <div className="text-center pb-6 border-b border-white/5 relative">
          <div className="inline-block bg-voss-cyan/10 border border-voss-cyan/30 text-voss-cyan text-[10px] font-mono tracking-[0.25em] px-4 py-1.5 rounded mb-4 uppercase animate-pulse shadow-[0_0_15px_rgba(0,242,254,0.15)]">
            ⌬ VNR LIVE INTERCEPT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-2 uppercase">
            VNR <span className="bg-gradient-to-r from-voss-cyan to-voss-emerald bg-clip-text text-transparent">LIVE</span>
          </h1>
          <div className="text-red-500 font-mono text-sm tracking-[0.2em] font-bold mb-3">[suno.com]</div>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto font-mono">
            Real-time forensic audit of Suno AI's 71+ tracker stack, GPU compositor abuse, and undisclosed PoW computation.
          </p>
          <div className="text-[10px] font-mono text-voss-cyan mt-4 bg-slate-950/40 inline-block border border-white/5 px-4 py-1.5 rounded-full">
            SCAN EXECUTED: 2026-03-07 20:02:07 EST &nbsp;|&nbsp; MACHINE: LOCAL &nbsp;|&nbsp; OPERATOR: VOSS NEURAL RESEARCH
          </div>
        </div>

        {/* Recorded Evidence Video Frame */}
        <div className="max-w-2xl mx-auto border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black bg-slate-950/60">
          {/* Browser Bar Mock */}
          <div className="bg-slate-900 px-4 py-2.5 flex items-center border-b border-white/5">
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 block" />
            </div>
            <div className="mx-auto bg-slate-950/60 border border-white/5 px-6 py-1 rounded-lg font-mono text-[9px] text-slate-500 flex items-center gap-1.5 translate-x-[-12px]">
              <Lock className="w-2.5 h-2.5 text-slate-500" />
              <span>https://suno.com</span>
            </div>
          </div>
          {/* Video Mock/Placeholder using CSS styling and canvas styling */}
          <div className="relative aspect-video bg-black flex flex-col items-center justify-center p-6 text-center">
            {/* Pulsing Capture Circle */}
            <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-[9px] text-red-500 font-bold bg-black/60 px-2 py-1 rounded">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 block animate-ping" />
              LIVE FORENSIC INTERCEPT STREAM
            </div>
            
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/40 flex items-center justify-center mb-4 text-red-500 animate-pulse">
              <Play className="w-6 h-6 fill-red-500" />
            </div>
            <div className="text-xs font-mono text-slate-300 font-bold tracking-wide uppercase mb-1">
              SUNO-PROOF.MP4
            </div>
            <div className="text-[10px] font-mono text-slate-500 max-w-xs">
              Demonstration of interactive browser packet capture showing local socket leaks and Clarity Mutation loop.
            </div>
          </div>
          <div className="bg-slate-900/60 border-t border-white/5 px-4 py-2 flex justify-between font-mono text-[9px] text-slate-500">
            <span>● LIVE NETWORK DUMP</span>
            <span>FILESIZE: 8.64 MB</span>
          </div>
        </div>

        {/* 🚨 RED ALERT - HAR CAPTURE FINDINGS */}
        <div 
          id="scan-live" 
          className="border-2 border-red-500/40 bg-red-500/5 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.05)] scroll-mt-24"
        >
          <div className="bg-red-500 px-6 py-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-white block animate-ping" />
              <span className="font-mono text-xs font-extrabold tracking-wider uppercase">
                LIVE CAPTURE — HAR ANALYSIS RESULTS
              </span>
            </div>
            <span className="font-mono text-[10px] opacity-80">2026-03-09 10:00 UTC</span>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
              2,149 Requests in 17 Minutes — <span className="text-red-400">78 POST Requests per Minute</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-sans">
              Live HAR capture during an authenticated Suno session. <strong className="text-slate-100">1,326 outbound POST requests</strong> transmitting user identifiers, clip IDs, creative process events, and full DOM session recordings to <strong className="text-red-400">15+ third-party tracker networks</strong>. This is not analytics — this is exfiltration.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-slate-950/60 border border-white/5 rounded-xl p-4 text-center">
                <div className="font-mono text-2xl font-black text-red-500">2,149</div>
                <div className="text-[8px] text-slate-500 tracking-wider uppercase mt-1">Total Requests</div>
              </div>
              <div className="bg-slate-950/60 border border-white/5 rounded-xl p-4 text-center">
                <div className="font-mono text-2xl font-black text-red-500">1,326</div>
                <div className="text-[8px] text-slate-500 tracking-wider uppercase mt-1">POST (Egress)</div>
              </div>
              <div className="bg-slate-950/60 border border-white/5 rounded-xl p-4 text-center">
                <div className="font-mono text-2xl font-black text-amber-500">15+</div>
                <div className="text-[8px] text-slate-500 tracking-wider uppercase mt-1">Tracker Domains</div>
              </div>
              <div className="bg-slate-950/60 border border-white/5 rounded-xl p-4 text-center">
                <div className="font-mono text-2xl font-black text-red-500">78/min</div>
                <div className="text-[8px] text-slate-500 tracking-wider uppercase mt-1">Exfil Rate</div>
              </div>
              <div className="bg-slate-950/60 border border-white/5 rounded-xl p-4 text-center col-span-2 md:col-span-1">
                <div className="font-mono text-2xl font-black text-voss-cyan">6</div>
                <div className="text-[8px] text-slate-500 tracking-wider uppercase mt-1">Ad Networks</div>
              </div>
            </div>

            {/* Top Trackers */}
            <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4 font-mono text-[11px] leading-relaxed">
              <div className="text-red-500 font-bold mb-2.5 text-[10px] tracking-wider uppercase">TOP TRACKERS BY REQUEST COUNT</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div><span className="text-slate-500">TikTok:</span> <span className="text-slate-200 font-bold">203</span></div>
                <div><span className="text-slate-500">Sprig:</span> <span className="text-slate-200 font-bold">68</span></div>
                <div><span className="text-slate-500">Bing UET:</span> <span className="text-slate-200 font-bold">65</span></div>
                <div><span className="text-slate-500">Clarity:</span> <span className="text-slate-200 font-bold">63</span></div>
                <div><span className="text-slate-500">hCaptcha:</span> <span className="text-slate-200 font-bold">54</span></div>
                <div><span className="text-slate-500">AppLovin:</span> <span className="text-slate-200 font-bold">53</span></div>
                <div><span className="text-slate-500">Snapchat:</span> <span className="text-slate-200 font-bold">32</span></div>
                <div><span className="text-slate-500">Braze:</span> <span className="text-slate-200 font-bold">30</span></div>
              </div>
            </div>

            {/* Payload Summary */}
            <div className="bg-red-500/5 border border-red-500/20 border-l-4 border-l-red-500 rounded-lg p-5 space-y-2 text-xs">
              <div className="font-mono text-[9px] text-red-500 font-bold tracking-wider mb-2">PAYLOAD DATA EXFILTRATION SCHEMATIC</div>
              <div><strong className="text-slate-200 font-mono">Braze:</strong> <span className="text-slate-400">userId, clipIds, song_listen events, listen_duration metrics</span></div>
              <div><strong className="text-slate-200 font-mono">TikTok:</strong> <span className="text-slate-400">Pageview heartbeats every 5s, full browser UA, IP address</span></div>
              <div><strong className="text-slate-200 font-mono">Clarity:</strong> <span className="text-slate-400">Full DOM session replay - mouse moves, clicks, scrolls, typed prompts</span></div>
              <div><strong className="text-slate-200 font-mono">hCaptcha:</strong> <span className="text-slate-400">Self-hosted Proof-of-Work engine running on suno.com subdomains</span></div>
            </div>
          </div>
        </div>

        {/* OVERVIEW STATS GRID */}
        <div id="scan-overview" className="space-y-6 scroll-mt-24">
          <div className="border-b border-white/5 pb-4">
            <span className="font-mono text-[9px] text-voss-cyan tracking-widest uppercase">Forensic Summary</span>
            <h2 className="text-xl md:text-2xl font-bold font-display text-white">Diagnostic Scan Results</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="voss-glass rounded-xl p-6 text-center border border-white/5 hover:border-voss-cyan/30 transition-all">
              <div className="font-mono text-3xl font-extrabold text-voss-cyan mb-1">4</div>
              <div className="text-[9px] text-slate-500 tracking-wider uppercase">Browsers Scanned</div>
            </div>
            <div className="voss-glass rounded-xl p-6 text-center border border-white/5 hover:border-red-500/30 transition-all">
              <div className="font-mono text-3xl font-extrabold text-red-500 mb-1">3,094s</div>
              <div className="text-[9px] text-slate-500 tracking-wider uppercase">CPU Seconds Burned</div>
            </div>
            <div className="voss-glass rounded-xl p-6 text-center border border-white/5 hover:border-amber-500/30 transition-all">
              <div className="font-mono text-3xl font-extrabold text-amber-500 mb-1">1.8 GB</div>
              <div className="text-[9px] text-slate-500 tracking-wider uppercase">RAM Consumed</div>
            </div>
            <div className="voss-glass rounded-xl p-6 text-center border border-white/5 hover:border-voss-emerald/30 transition-all">
              <div className="font-mono text-3xl font-extrabold text-voss-emerald mb-1">71+</div>
              <div className="text-[9px] text-slate-500 tracking-wider uppercase">Third-Party Scripts</div>
            </div>
          </div>
        </div>

        {/* GPU ABUSE SECTION */}
        <div id="scan-gpu" className="space-y-6 scroll-mt-24">
          <div className="border-b border-white/5 pb-4">
            <span className="font-mono text-[9px] text-red-500 tracking-widest uppercase">Hardware Degradation</span>
            <h2 className="text-xl md:text-2xl font-bold font-display text-white">GPU Compositor Loop &amp; Warping</h2>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 border-l-4 border-l-red-500 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-mono font-bold text-red-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" /> GPU COMPOSITOR ABUSE LOGGED — WINDOWS WARPING
            </h3>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-sans">
              System experienced window warp distortion and compositing freezes at 20:00 EST. Chrome PID `32772` consumed <strong className="text-red-400 font-mono">2,303.7 CPU seconds</strong> (38+ minutes of continuous processing) with 183 MB RAM and 1,072 handles. This represents the signature Microsoft Clarity session replay loop. The compositor loop forces high-frequency page repaints on animated canvases, exhausting the GPU thread queues and DWM buffers.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-[11px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/10 text-slate-500 text-[9px] tracking-wider uppercase">
                    <th className="py-2.5 px-3">PID</th>
                    <th className="py-2.5 px-3">RAM</th>
                    <th className="py-2.5 px-3">CPU (sec)</th>
                    <th className="py-2.5 px-3">Handles</th>
                    <th className="py-2.5 px-3">Diagnostic Assessment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5 text-slate-400">
                    <td className="py-2 px-3">6148</td>
                    <td className="py-2 px-3">31 MB</td>
                    <td className="py-2 px-3">48.1</td>
                    <td className="py-2 px-3">442</td>
                    <td className="py-2 px-3 text-slate-500">Normal</td>
                  </tr>
                  <tr className="border-b border-white/5 text-slate-400">
                    <td className="py-2 px-3">11744</td>
                    <td className="py-2 px-3">25 MB</td>
                    <td className="py-2 px-3">128.6</td>
                    <td className="py-2 px-3">370</td>
                    <td className="py-2 px-3 text-amber-500">Elevated</td>
                  </tr>
                  <tr className="border-b border-white/5 text-slate-400">
                    <td className="py-2 px-3">16548</td>
                    <td className="py-2 px-3">31 MB</td>
                    <td className="py-2 px-3">43.9</td>
                    <td className="py-2 px-3">426</td>
                    <td className="py-2 px-3 text-slate-500">Normal</td>
                  </tr>
                  <tr className="border-b border-white/5 text-red-500 font-bold bg-red-950/10">
                    <td className="py-2 px-3">26892</td>
                    <td className="py-2 px-3">135 MB</td>
                    <td className="py-2 px-3">523.8</td>
                    <td className="py-2 px-3">491</td>
                    <td className="py-2 px-3">TRACKER RENDERER</td>
                  </tr>
                  <tr className="border-b border-white/5 text-red-500 font-bold bg-red-950/10">
                    <td className="py-2 px-3">28992</td>
                    <td className="py-2 px-3">133 MB</td>
                    <td className="py-2 px-3">838.0</td>
                    <td className="py-2 px-3">2,047</td>
                    <td className="py-2 px-3">HEAVY TELEMETRY ABUSE (2K HANDLES)</td>
                  </tr>
                  <tr className="border-b border-white/10 text-red-500 font-extrabold bg-red-950/20">
                    <td className="py-2 px-3">32772</td>
                    <td className="py-2 px-3">183 MB</td>
                    <td className="py-2 px-3">2,303.7</td>
                    <td className="py-2 px-3">1,072</td>
                    <td className="py-2 px-3">COMPOSITOR DEATH LOOP (WARPING SOURCE)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* BROWSER PROFILES SECTION */}
        <div id="scan-browsers" className="space-y-6 scroll-mt-24">
          <div className="border-b border-white/5 pb-4">
            <span className="font-mono text-[9px] text-orange-400 tracking-widest uppercase">Profile Diagnostics</span>
            <h2 className="text-xl md:text-2xl font-bold font-display text-white">Browser Profile Analysis</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="voss-glass rounded-xl p-5 border border-white/5 text-center">
              <h4 className="text-xs font-mono tracking-wider uppercase text-slate-300 mb-1">Chrome</h4>
              <div className="text-xs font-mono text-slate-500 mb-3">Default — 152.6 MB</div>
              <span className="inline-block px-2.5 py-1 bg-red-500/10 text-red-500 text-[9px] font-mono font-bold border border-red-500/20 rounded">
                ARTIFACTS PRESENT
              </span>
            </div>
            <div className="voss-glass rounded-xl p-5 border border-white/5 text-center">
              <h4 className="text-xs font-mono tracking-wider uppercase text-slate-300 mb-1">Brave</h4>
              <div className="text-xs font-mono text-slate-500 mb-3">Default — 266.9 MB</div>
              <span className="inline-block px-2.5 py-1 bg-red-500/10 text-red-500 text-[9px] font-mono font-bold border border-red-500/20 rounded">
                ARTIFACTS PRESENT
              </span>
            </div>
            <div className="voss-glass rounded-xl p-5 border border-white/5 text-center">
              <h4 className="text-xs font-mono tracking-wider uppercase text-slate-300 mb-1">Edge</h4>
              <div className="text-xs font-mono text-slate-500 mb-3">Default — 278.5 MB</div>
              <span className="inline-block px-2.5 py-1 bg-red-500/10 text-red-500 text-[9px] font-mono font-bold border border-red-500/20 rounded">
                ARTIFACTS PRESENT
              </span>
            </div>
            <div className="voss-glass rounded-xl p-5 border border-white/5 text-center">
              <h4 className="text-xs font-mono tracking-wider uppercase text-slate-300 mb-1">Comet</h4>
              <div className="text-xs font-mono text-slate-500 mb-3">Default — 3,330 MB</div>
              <span className="inline-block px-2.5 py-1 bg-red-500/15 text-red-400 text-[9px] font-mono font-bold border border-red-500/30 rounded">
                1.9 GB IndexedDB INFECTION
              </span>
            </div>
          </div>

          {/* Scanned Folder Path Console log */}
          <div className="bg-[#0d1117] border border-white/10 rounded-xl p-5 font-mono text-[11px] leading-relaxed text-slate-300">
            <div className="flex items-center gap-1.5 text-voss-cyan mb-2.5">
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>Get-ChildItem $chromeUD -Recurse -File | ForEach-Object { "{" } binary-scan $_ { "}" }</span>
            </div>
            <div className="text-slate-500 border-b border-white/5 pb-2 mb-3">Total files scanned: 2,667</div>
            
            <div className="space-y-3">
              <div>
                <span className="text-red-400 font-bold">[HIT]</span> <span className="text-slate-400">\ActorSafetyLists\8.6294.2057\listdata.json (718.5 KB)</span>
                <div className="text-[10px] text-slate-500 pl-6">&gt; Keyword match: suno=1</div>
              </div>
              <div>
                <span className="text-red-400 font-bold">[HIT]</span> <span className="text-slate-400">\component_crx_cache\06476966b53b...\model.tflite (2,673.3 KB)</span>
                <div className="text-[10px] text-slate-500 pl-6">&gt; Keyword match: suno=1, tapad=1</div>
              </div>
              <div>
                <span className="text-red-500 font-black">[ALERT]</span> <span className="text-slate-400">\Default\Extensions\aeblfdkhhhdcdjpifhhb...\background.js (2,954.1 KB)</span>
                <div className="text-[10px] text-slate-500 pl-6">&gt; Keyword match: suno=2 | criteo=4 | tapad=4 | maze.co=3 | doubleclick=45</div>
                <div className="text-[9px] text-red-400 pl-6 font-bold">(HP AI for Print group-policy extension injecting tracker domains)</div>
              </div>
              <div>
                <span className="text-red-400 font-bold">[HIT]</span> <span className="text-slate-400">\optimization_guide_model_store\...\ruleset1 (11.7 KB)</span>
                <div className="text-[10px] text-slate-500 pl-6">&gt; Keyword match: suno=1</div>
              </div>
            </div>
          </div>
        </div>

        {/* INCIDENT LOG: RECURRING EVENTS */}
        <div id="scan-incidents" className="space-y-6 scroll-mt-24">
          <div className="border-b border-white/5 pb-4">
            <span className="font-mono text-[9px] text-yellow-400 tracking-widest uppercase">Chronological History</span>
            <h2 className="text-xl md:text-2xl font-bold font-display text-white">Forensic Incident Journal</h2>
          </div>
          <div className="space-y-4 text-xs">
            
            {/* Incident 5 (Latest) */}
            <div className="bg-red-500/5 border border-red-500/20 border-l-4 border-l-red-500 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center text-red-400 font-mono text-[10px] font-bold">
                <span>🚨 INCIDENT #5 (CRITICAL RUNAWAY LEAK)</span>
                <span>2026-05-24 06:40 EST</span>
              </div>
              <p className="text-slate-300 font-sans leading-relaxed">
                Subject experienced extreme USB audio interface distortion (screeching static) and mouse input queue drifting. Forensics revealed Brave had automatically disabled the unpacked developer SunoShield extension. Telemetry scripts re-seeded instantly, causing handle leaks (3,830 handles on Perplexity Comet and 2,208 on Chrome) that starved the Windows thread scheduler and triggered critical DPC latency buffer underruns.
              </p>
              <div className="bg-slate-950/60 p-3 rounded font-mono text-[9.5px] leading-relaxed text-slate-400 border border-white/5">
                <span className="text-voss-cyan font-bold">$ Get-Process comet, chrome | Sort CPU -Desc</span><br />
                [PID 24540 (comet)]  CPU: 24,626.2s (6.8 hr)  RAM: 113.8MB  Handles: 1,459<br />
                [PID 26160 (comet)]  CPU:  5,417.6s           RAM: 264.3MB  Handles: 3,830 [LEAK]<br />
                [PID 42824 (chrome)] CPU:  7,368.0s           RAM: 1.35GB   Handles: 771   [LEAK]<br />
                [PID 41524 (chrome)] CPU:  1,924.3s           RAM: 158.3MB  Handles: 2,208 [LEAK]
              </div>
            </div>

            {/* Incident 4 */}
            <div className="voss-glass border-l-4 border-l-yellow-500 rounded-xl p-5 space-y-2">
              <div className="flex justify-between items-center text-yellow-500 font-mono text-[10px] font-bold">
                <span>⚠ INCIDENT #4 (PROGRESSIVE PERSISTENCE FINDING)</span>
                <span>2026-03-09 11:14 EST</span>
              </div>
              <p className="text-slate-400 font-sans leading-relaxed">
                Trackers successfully regenerated across Chrome and Brave even after complete deletion of standard cookies, local storage, and history. Forensics traced the re-seed vector to Chrome's built-in machine learning store directories and SQLite structures that bypass Incognito boundaries.
              </p>
            </div>

            {/* Incident 3 */}
            <div className="voss-glass border-l-4 border-l-red-500 rounded-xl p-5 space-y-2">
              <div className="flex justify-between items-center text-red-500 font-mono text-[10px] font-bold">
                <span>🚨 INCIDENT #3 (SYSTEM MEMORY STARVATION)</span>
                <span>2026-03-07 23:32 EST</span>
              </div>
              <p className="text-slate-400 font-sans leading-relaxed">
                Display driver crash and screen warping events occurred. Forensic memory dump showed system thrashing due to free physical RAM dipping below the 1.0 GB threshold (13.7 GB total size). High tracker DOM serialization buffers held in RAM forced DWM.exe to delay surface allocations.
              </p>
            </div>

          </div>
        </div>

        {/* FORTRESS DEPLOYMENT SECTION (LOCKER MODE) */}
        <div id="fortress-deployment" className="space-y-6 scroll-mt-24">
          <div className="border-b border-white/5 pb-4">
            <span className="font-mono text-[9px] text-blue-500 tracking-widest uppercase">Mitigation Layer</span>
            <h2 className="text-xl md:text-2xl font-bold font-display text-white">Fortress Deployment: Locker Mode</h2>
          </div>
          <div className="voss-glass border border-white/5 rounded-2xl p-6 space-y-4">
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-sans">
              Because browser-level ad blockers fail to inspect locally embedded inline scripts (Clarity DOM MutationObservers), the only viable baseline protection is OS-level domain redirection. **Locker Mode** redirects outbound telemetry packets back to the local loopback adapter (`0.0.0.0`) in the Windows hosts file.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="bg-slate-950/60 p-4 border border-white/5 rounded-xl">
                <div className="text-voss-cyan font-bold mb-2 text-[10px] uppercase">Currently Blocked telemetry (17 Domains)</div>
                <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> clarity.ms</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> sdk.iad-03.braze.com</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> bidder.criteo.com</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> graph.tapad.com</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> pagead2.googlesyndication.com</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> googleads.g.doubleclick.net</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> cdn.segment.com</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> browser-intake-us5-datadoghq.com</div>
                </div>
              </div>
              
              <div className="bg-slate-950/60 p-4 border border-white/5 rounded-xl">
                <div className="text-amber-500 font-bold mb-2 text-[10px] uppercase">hCaptcha Whitelist (Unblocked Tiers)</div>
                <div className="space-y-3 text-xs text-slate-400 leading-relaxed font-sans">
                  <p>
                    **hCaptcha.com** remains fully unblocked system-wide to maintain login and captcha compatibility across normal websites.
                  </p>
                  <p>
                    Surgical blocks (restricting hCaptcha PoW executions) are handled dynamically at the browser layer by the **SunoShield** extension rather than system-wide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
