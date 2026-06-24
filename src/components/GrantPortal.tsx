import React from "react";
import { Award, Briefcase, Calendar, ShieldCheck, DollarSign, Brain, Users, Cpu, FileText, ExternalLink } from "lucide-react";

export default function GrantPortal() {
  const aims = [
    {
      num: 1,
      title: "IDE Plugin & Browser Extension Engineering",
      objective: "Translate the local command-line Python wrapper into a lightweight, fleet-managed VS Code extension and Chrome browser plugin.",
      deliverables: [
        "Focus-lock mechanisms that prevent context-switching during queue delays.",
        "Customizable, jittered response delays (15s to 90s) calibrated to user input frequencies.",
        "Client-side regex and small model classifier for real-time sycophancy detection."
      ]
    },
    {
      num: 2,
      title: "Multi-Center Cohort Study (N=15)",
      objective: "Conduct a 12-month longitudinal study targeting high-frequency AI assistant users in software engineering presenting with comorbid stimulant dependency.",
      deliverables: [
        "Primary endpoints: Weekly AI session frequency, Mean Inter-Prompt Interval (IPI).",
        "Secondary endpoints: Weekly substance screening, Delay Discounting (k-value) curves, PHQ-9, and GAD-7 scores.",
        "Physiological validation: Pre- and post-study PET/SPECT neuroimaging to measure striatal D2/D3 receptor availability and DAT binding density."
      ]
    },
    {
      num: 3,
      title: "Economic ROI & Enterprise Policy Modeling",
      objective: "Quantify the financial return of Cognitive Friction implementation within corporate workforces.",
      deliverables: [
        "Track code review quality, commit frequency, on-call response latency, and employee retention across three participating technology partner companies (847 total engineers).",
        "Formulate standardized Corporate Cognitive Hygiene (CCH) framework guidelines for enterprise procurement."
      ]
    }
  ];

  const budgetItems = [
    { category: "Software Engineering", allocation: 160000, details: "Development of VS Code and Chrome extension prototypes, SQLite data aggregation syncs, and configuration schemas.", qty: "1.5 FTE" },
    { category: "Clinical Neuroscience", allocation: 120000, details: "Clinical check-ins, psychiatric assessments (DSM-5 audits), and data analysis.", qty: "1.0 FTE" },
    { category: "Neuroimaging Support", allocation: 80000, details: "Pre- and post-study SPECT/PET scans to measure striatal dopamine transporter (DAT) density and receptor availability.", qty: "30 scans" },
    { category: "Participant Stipends", allocation: 45000, details: "Compensation for longitudinal clinical monitoring, survey compliance, and scan attendance.", qty: "N=15 cohort" },
    { category: "Operational Overhead", allocation: 45000, details: "Direct administrative expenses, secure server infrastructure, and publication fees.", qty: "Direct" }
  ];

  return (
    <div className="space-y-10 pt-8 animate-fade-in">
      {/* Introduction Banner */}
      <div className="bg-[#0D1527]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-voss-cyan/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-voss-cyan/10 border border-voss-cyan/20 px-3 py-1 rounded-full text-[10px] font-mono text-voss-cyan uppercase tracking-widest">
              <Award className="w-3.5 h-3.5 text-voss-cyan" />
              <span>ACTIVE GRANT PROPOSAL PORTAL</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-medium text-white tracking-tight leading-snug">
              Decontamination of Algorithmic Dopamine Loops and Cognitive Depletion
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl font-sans leading-relaxed">
              Voss Neural Research (VNR) Grant Proposal VNR-02-B. Establishing client-side and browser-level cognitive wrappers to decouple combined digital-chemical loop co-dependencies in high-intensity software engineering environments.
            </p>
          </div>
          
          <div className="shrink-0 bg-slate-950 border border-white/5 p-4 rounded-xl text-center md:text-left min-w-[200px]">
            <span className="text-[9px] font-mono text-slate-500 block uppercase">Requested Funding</span>
            <span className="text-2xl font-mono text-white font-extrabold flex items-center justify-center md:justify-start mt-0.5">
              <DollarSign className="w-6 h-6 text-voss-cyan" />
              <span>450,000</span>
            </span>
            <span className="text-[9px] font-mono text-voss-cyan font-bold block mt-1">12-MONTH DURATION</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Specific Aims & Budget (Left column) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Abstract */}
          <div className="bg-[#0D1527]/40 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-voss-cyan text-[10px] font-mono uppercase tracking-widest">
              <FileText className="w-3.5 h-3.5" />
              <span>Project Abstract</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-serif leading-relaxed text-justify">
              Generative AI coding assistants have been widely adopted across corporate technology teams to accelerate software development. However, their sub-second latency and sycophantic reinforcement characteristics exploit conserved human mesolimbic dopamine pathways, inducing what we define as the <strong>Algorithmic Dopamine Loop (ADL)</strong>. In high-intensity software engineering environments, ADL manifests as compulsive prompt-chaining, cognitive depletion, and elevated burnout rates, with a high comorbidity of central nervous system stimulant abuse (amphetamine/methamphetamine).
            </p>
            <p className="text-xs sm:text-sm text-slate-300 font-serif leading-relaxed text-justify">
              Project Voss proposes the validation and scaling of the <strong>Voss Protocols</strong>—specifically the <strong>Cognitive Friction Wrapper (CFW)</strong> and the <strong>Sycophancy-Eliminator Module (SEM)</strong>. Following a successful pilot study (N=12) that demonstrated an 86% reduction in weekly AI session frequency and a 78% reduction in co-occurring stimulant consumption, this proposal outlines the engineering of fleet-managed client-side plugins, a larger cohort validation study, and the development of Corporate Cognitive Hygiene enterprise benchmarks.
            </p>
          </div>

          {/* Section 2: Specific Aims */}
          <div className="bg-[#0D1527]/40 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center space-x-2 text-voss-cyan text-[10px] font-mono uppercase tracking-widest">
              <Brain className="w-3.5 h-3.5" />
              <span>Specific Aims</span>
            </div>

            <div className="space-y-6">
              {aims.map((aim) => (
                <div key={aim.num} className="border border-white/5 bg-slate-950/40 p-5 rounded-xl space-y-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-lg bg-voss-cyan/10 border border-voss-cyan/35 font-mono text-xs font-bold text-voss-cyan flex items-center justify-center">
                      {aim.num}
                    </span>
                    <h3 className="text-xs sm:text-sm font-sans font-bold text-white uppercase tracking-wider">
                      {aim.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed pl-8">
                    {aim.objective}
                  </p>
                  <ul className="list-disc pl-14 text-[11px] text-slate-300 font-sans space-y-1 leading-relaxed">
                    {aim.deliverables.map((del, i) => (
                      <li key={i}>{del}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Budget Details */}
          <div className="bg-[#0D1527]/40 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 overflow-x-auto">
            <div className="flex items-center space-x-2 text-voss-cyan text-[10px] font-mono uppercase tracking-widest mb-2">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Budget Justification & Allocation</span>
            </div>

            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-500 font-mono uppercase text-[9px] tracking-wider">
                  <th className="py-2.5 pb-3">Category</th>
                  <th className="py-2.5 pb-3 text-center">FTE / Qty</th>
                  <th className="py-2.5 pb-3 text-right">Allocation</th>
                  <th className="py-2.5 pb-3 pl-6 hidden md:table-cell">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {budgetItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-semibold text-white">{item.category}</td>
                    <td className="py-3 text-center font-mono text-[10px] text-slate-400">{item.qty}</td>
                    <td className="py-3 text-right font-mono font-bold text-voss-cyan">${item.allocation.toLocaleString()}</td>
                    <td className="py-3 pl-6 text-[10px] text-slate-400 leading-relaxed hidden md:table-cell">{item.details}</td>
                  </tr>
                ))}
                <tr className="border-t border-white/10 font-bold bg-slate-950/40">
                  <td className="py-3 text-white">Total Requested</td>
                  <td className="py-3 text-center"></td>
                  <td className="py-3 text-right font-mono text-voss-cyan font-extrabold">${budgetItems.reduce((acc, curr) => acc + curr.allocation, 0).toLocaleString()}</td>
                  <td className="py-3 pl-6 hidden md:table-cell"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* PI Profile & Compliance (Right column) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Investigator Profile */}
          <div className="bg-[#0D1527]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-voss-cyan to-voss-emerald" />
            <div className="flex items-center space-x-2 text-voss-cyan text-[10px] font-mono uppercase tracking-widest mb-4">
              <Users className="w-3.5 h-3.5" />
              <span>PRINCIPAL INVESTIGATOR</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-display font-bold text-white">Timothy Chappell</h3>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                  Systems Security Architect & Forensic Engineer
                </span>
                <span className="text-[9px] font-mono text-voss-cyan font-bold block">
                  FOUNDER, VOSS NEURAL RESEARCH LLC
                </span>
              </div>

              <div className="border-t border-white/5 pt-3 text-[11px] text-slate-300 font-sans space-y-2 leading-relaxed">
                <p>
                  Specialist in browser-level runtime security, systems forensics, reverse engineering, and low-level performance debugging.
                </p>
                <p>
                  Author of the industry-recognized book <strong className="text-white italic">"Dopamine Jackpot: AI Engineered Addiction"</strong> (Published March 2026), examining real-time behavioral loops, anti-fingerprinting, and telemetry exploitation.
                </p>
              </div>

              <div className="border-t border-white/5 pt-3 space-y-2">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Key Competencies</span>
                <div className="flex flex-wrap gap-1.5">
                  {["Reverse Engineering", "Manifest V3 Sandbox Injection", "Windows OS Forensics", "DPC Latency Analysis", "TypeScript / C++"].map((c, i) => (
                    <span key={i} className="text-[8px] font-mono bg-slate-950 border border-white/5 px-2 py-0.5 rounded text-slate-400">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/5 pt-3">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Contact & Verification</span>
                <div className="flex flex-col space-y-1 mt-1 font-mono text-[9px] text-voss-cyan">
                  <span className="flex items-center space-x-1">
                    <Briefcase className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>tim@vossneural.com</span>
                  </span>
                  <a href="https://bcprojects.co" target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:underline cursor-pointer">
                    <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>bcprojects.co</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Ethics & Compliance Statement */}
          <div className="bg-[#0D1527]/40 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-voss-cyan text-[10px] font-mono uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ETHICS & REGULATORY COMPLIANCE</span>
            </div>

            <div className="space-y-3 font-sans text-xs text-slate-400 leading-relaxed">
              <div className="bg-slate-950/60 border border-emerald-500/20 p-3 rounded-lg text-[10px] text-emerald-400 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono font-bold block">REGISTERED ETHICS PROTOCOL</span>
                  <span>Human research conducted under VNR Ethics Board Protocol 4.2 compliance. All data sets fully de-identified.</span>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed">
                All participant telemetry, scan data, and behavioral logging gathered in the N=12 pilot study (and planned for the N=15 cohort study) strictly conform to institutional de-identification and clinical storage directives. 
              </p>
              <p className="text-[11px] leading-relaxed">
                Study subjects retain absolute client-side sovereignty over their interaction logs, allowing them to delete, export, or audit their data local-first without central storage vulnerabilities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
