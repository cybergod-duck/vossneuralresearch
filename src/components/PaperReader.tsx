import React, { useState } from "react";
import { motion } from "motion/react";
import { PAPERS_TEXT } from "../data";
import { BookOpen, Award, ArrowUpRight, CheckCircle } from "lucide-react";

export default function PaperReader() {
  const [selectedPaper, setSelectedPaper] = useState<"paper1" | "paper2">("paper1");

  const paper = PAPERS_TEXT[selectedPaper];

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-[500px] p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Selector Header */}
        <div className="flex border-b border-zinc-800 mb-8 pb-3 items-center justify-between">
          <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
            ARCHIVAL RESEARCH ARCHIVE
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPaper("paper1")}
              className={`px-3 py-1.5 rounded text-xs font-mono border transition-all cursor-pointer ${
                selectedPaper === "paper1"
                  ? "bg-amber-500/10 border-amber-500/50 text-amber-500 font-bold"
                  : "bg-transparent border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Paper 1: Rewiring Universality
            </button>
            <button
              onClick={() => setSelectedPaper("paper2")}
              className={`px-3 py-1.5 rounded text-xs font-mono border transition-all cursor-pointer ${
                selectedPaper === "paper2"
                  ? "bg-amber-500/10 border-amber-500/50 text-amber-500 font-bold"
                  : "bg-transparent border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Paper 2: The Voss Protocols
            </button>
          </div>
        </div>

        {/* Paper Container */}
        <motion.div
          key={selectedPaper}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Header Card */}
          <div className="border border-zinc-850 bg-zinc-900/40 p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full"></div>
            <div className="flex items-center gap-2 text-amber-500 text-xs font-mono mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>THE PEER REVIEW • IN-DEPTH REPRINT</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-sans tracking-tight font-bold text-zinc-100 leading-tight">
              {paper.title}
            </h2>
            <p className="text-sm text-zinc-400 font-serif mt-2 italic border-l-2 border-zinc-800 pl-4 py-1">
              {paper.subtitle}
            </p>
          </div>

          {/* Abstract */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono text-amber-500 uppercase tracking-widest flex items-center gap-2">
              <Award className="w-4 h-4" /> ABSTRACT
            </h3>
            <p className="text-zinc-300 font-serif text-base leading-relaxed text-justify">
              {paper.abstract}
            </p>
          </div>

          {/* Intro Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono text-amber-500 uppercase tracking-widest flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> INTRODUCTION & MECHANISM
            </h3>
            <p className="text-zinc-300 font-serif text-base leading-relaxed text-justify">
              {paper.introduction}
            </p>
          </div>

          {/* Voss-specific details */}
          {selectedPaper === "paper2" && (
            <div className="space-y-4 border-t border-zinc-900 pt-6">
              <h3 className="text-xs font-mono text-amber-500 uppercase tracking-widest">
                CORE PROTOCOLS OF INTERFACE FRICTION
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {PAPERS_TEXT.paper2.vossCoreProtocols.map((protocol, i) => (
                  <div
                    key={i}
                    className="border border-zinc-850 bg-zinc-900/30 p-4 rounded-lg hover:border-zinc-800 transition-all"
                  >
                    <span className="text-xs font-mono text-amber-500 font-bold uppercase tracking-wider block mb-1">
                      Protocol #{i + 1}: {protocol.name}
                    </span>
                    <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                      {protocol.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Methodology */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono text-amber-500 uppercase tracking-widest">
              METHODOLOGY
            </h3>
            <p className="text-zinc-300 font-serif text-base leading-relaxed text-justify">
              {paper.methodology}
            </p>
          </div>

          {/* Conclusion */}
          <div className="space-y-3 border-t border-zinc-900 pt-6">
            <h3 className="text-xs font-mono text-amber-500 uppercase tracking-widest">
              CONCLUSION & CLINICAL IMPLICATIONS
            </h3>
            <p className="text-zinc-300 font-serif text-base leading-relaxed text-justify">
              {paper.conclusion}
            </p>
          </div>

          {/* Meta Info */}
          <div className="border border-zinc-900 bg-zinc-950 p-4 rounded-lg flex justify-between items-center text-xs font-mono text-zinc-500">
            <span>WORD COUNT: ~8,120</span>
            <div className="flex gap-4">
              <span>STATUS: REPRINTED</span>
              <a
                href="#simulator"
                className="flex items-center gap-1 text-amber-500 hover:underline cursor-pointer"
              >
                Launch Companion Simulator <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
