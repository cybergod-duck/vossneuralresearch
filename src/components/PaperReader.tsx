import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PAPERS, Paper } from "../data/papersData";
import { BookOpen, Download, Clipboard, Check, FileText, ArrowRight } from "lucide-react";

export default function PaperReader() {
  const [selectedId, setSelectedId] = useState<string>("vnr01");
  const [copied, setCopied] = useState(false);

  const paper = PAPERS.find((p) => p.id === selectedId) || PAPERS[0];

  const copyCitation = () => {
    navigator.clipboard.writeText(paper.citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // A lightweight Markdown-to-JSX parser for academic presentation
  const renderMarkdown = (md: string) => {
    const lines = md.split("\n");
    let inList = false;
    let listItems: string[] = [];
    let inCode = false;
    let codeContent: string[] = [];
    const elements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      // Handle Code Blocks
      if (line.trim().startsWith("```")) {
        if (inCode) {
          elements.push(
            <pre key={`code-${index}`} className="bg-slate-950/80 border border-white/5 p-4 rounded-lg font-mono text-[11px] text-voss-cyan overflow-x-auto my-4 max-w-full leading-relaxed">
              <code>{codeContent.join("\n")}</code>
            </pre>
          );
          codeContent = [];
          inCode = false;
        } else {
          inCode = true;
        }
        return;
      }

      if (inCode) {
        codeContent.push(line);
        return;
      }

      // Handle Lists
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        if (!inList) {
          inList = true;
        }
        listItems.push(line.replace(/^[-*]\s+/, ""));
        return;
      } else {
        if (inList) {
          elements.push(
            <ul key={`list-${index}`} className="list-disc pl-6 my-4 space-y-2 text-slate-300 font-sans text-xs sm:text-sm">
              {listItems.map((item, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineStyles(item) }} />
              ))}
            </ul>
          );
          listItems = [];
          inList = false;
        }
      }

      // Handle Headers
      if (line.trim().startsWith("### ")) {
        const text = line.replace("### ", "");
        elements.push(
          <h4 key={`h3-${index}`} className="text-sm sm:text-base font-display font-semibold text-white tracking-wide uppercase mt-6 mb-3">
            {text}
          </h4>
        );
      } else if (line.trim().startsWith("## ")) {
        const text = line.replace("## ", "");
        elements.push(
          <h3 key={`h2-${index}`} className="text-base sm:text-lg font-display font-bold text-voss-cyan tracking-wide border-b border-white/5 pb-2 mt-8 mb-4 uppercase">
            {text}
          </h3>
        );
      } else if (line.trim().startsWith("# ")) {
        const text = line.replace("# ", "");
        elements.push(
          <h2 key={`h1-${index}`} className="text-lg sm:text-xl font-display font-extrabold text-white tracking-tight mt-10 mb-6 border-b border-white/10 pb-3">
            {text}
          </h2>
        );
      }
      // Handle Horizontal Rules
      else if (line.trim() === "---") {
        elements.push(<hr key={`hr-${index}`} className="border-white/5 my-8" />);
      }
      // Handle Paragraphs
      else if (line.trim().length > 0) {
        elements.push(
          <p
            key={`p-${index}`}
            className="text-xs sm:text-sm md:text-base leading-relaxed text-slate-300 font-serif text-justify mb-5"
            dangerouslySetInnerHTML={{ __html: parseInlineStyles(line) }}
          />
        );
      }
    });

    // Handle trailing lists or code blocks
    if (inList) {
      elements.push(
        <ul key="list-trailing" className="list-disc pl-6 my-4 space-y-2 text-slate-300 font-sans text-xs sm:text-sm">
          {listItems.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineStyles(item) }} />
          ))}
        </ul>
      );
    }
    if (inCode) {
      elements.push(
        <pre key="code-trailing" className="bg-slate-950/80 border border-white/5 p-4 rounded-lg font-mono text-[11px] text-voss-cyan overflow-x-auto my-4 max-w-full leading-relaxed">
          <code>{codeContent.join("\n")}</code>
        </pre>
      );
    }

    return elements;
  };

  // Helper to parse inline styles like **bold** and `code`
  const parseInlineStyles = (txt: string): string => {
    let html = txt;
    // Escape HTML special chars first
    html = html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Replace bold **text** or __text__
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong class='text-white font-semibold'>$1</strong>");
    html = html.replace(/__(.*?)__/g, "<strong class='text-white font-semibold'>$1</strong>");

    // Replace inline code `code`
    html = html.replace(/`(.*?)`/g, "<code class='bg-slate-900 px-1.5 py-0.5 rounded font-mono text-voss-cyan text-[11px] border border-white/5'>$1</code>");

    return html;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
      {/* Paper selection sidebar */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-[#0D1527]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center space-x-2 text-voss-cyan text-[10px] font-mono uppercase tracking-widest mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>RESEARCH LIBRARY INDEX</span>
          </div>

          <div className="space-y-3">
            {PAPERS.map((p) => {
              const isSelected = p.id === selectedId;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 border-voss-cyan/40 shadow-md shadow-voss-cyan/5"
                      : "bg-transparent border-white/5 hover:border-white/10 hover:bg-slate-950/40"
                  }`}
                >
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                    {p.id.toUpperCase()} • PUBLISHED REPRINT
                  </span>
                  <span className={`text-xs font-sans font-semibold leading-snug block ${isSelected ? "text-white" : "text-slate-300 group-hover:text-white"}`}>
                    {p.title}
                  </span>
                  <div className="flex items-center space-x-1 mt-2 text-[10px] text-voss-cyan opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Read Paper</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Paper details and actions card */}
        <div className="bg-[#0D1527]/40 border border-white/5 p-5 rounded-2xl text-xs space-y-4">
          <div>
            <span className="text-[10px] font-mono text-slate-500 block uppercase">Metadata Citation</span>
            <p className="text-slate-400 font-sans mt-1 leading-relaxed">{paper.citation}</p>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              onClick={copyCitation}
              className="flex-1 py-2 bg-slate-900 border border-white/10 rounded-lg font-mono text-[10px] tracking-wider text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">COPIED!</span>
                </>
              ) : (
                <>
                  <Clipboard className="w-3.5 h-3.5" />
                  <span>COPY CITATION</span>
                </>
              )}
            </button>

            <button className="flex-1 py-2 bg-slate-900 border border-white/10 rounded-lg font-mono text-[10px] tracking-wider text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center space-x-1.5 cursor-pointer">
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full paper content view */}
      <div className="lg:col-span-8">
        <AnimatePresence mode="wait">
          <motion.article
            key={selectedId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-[#0D1527]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl relative"
          >
            {/* Header Reprint Ribbon */}
            <div className="flex items-center space-x-2 text-[10px] text-voss-cyan font-mono border-b border-white/10 pb-4 mb-6">
              <FileText className="w-4 h-4 text-voss-cyan animate-pulse" />
              <span className="uppercase tracking-widest font-semibold">{paper.authors}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 uppercase tracking-widest">{paper.date}</span>
            </div>

            {/* Paper Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white tracking-tight leading-tight mb-3">
              {paper.title}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-400 font-serif italic border-l-2 border-voss-cyan pl-4 py-1.5 mb-8">
              {paper.subtitle}
            </p>

            {/* Abstract Callout */}
            <div className="bg-slate-950/50 border border-white/5 p-5 sm:p-6 rounded-2xl mb-8 leading-relaxed">
              <span className="text-[10px] font-mono text-voss-cyan tracking-widest block uppercase mb-2 font-bold">
                Abstract
              </span>
              <p className="text-xs sm:text-sm text-slate-300 font-serif leading-relaxed text-justify">
                {paper.abstract}
              </p>
            </div>

            {/* Main Body Text (Markdown Rendered) */}
            <div className="prose prose-invert max-w-none text-slate-300">
              {renderMarkdown(paper.markdown)}
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}
