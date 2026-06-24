import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { rawCSVData } from "../data/chartData";
import { TrendingDown, Calendar, Database, ShieldAlert, CheckCircle } from "lucide-react";

export const ChartDashboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // States to toggle individual datasets
  const [showGhb, setShowGhb] = useState(false);
  const [showMeth, setShowMeth] = useState(false);
  const [showClobromazolam, setShowClobromazolam] = useState(false);
  const [showComposite, setShowComposite] = useState(true);
  const [showAiSessions, setShowAiSessions] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart instance to prevent canvas reuse errors
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = rawCSVData.map((d) => `W${d.week}`);

    // Construct datasets dynamically based on toggled state
    const datasets: any[] = [];

    if (showComposite) {
      datasets.push({
        label: "Composite Substance Index",
        data: rawCSVData.map((d) => d.compositeIndex),
        borderColor: "#00F2FE", // Cyan
        backgroundColor: "rgba(0, 242, 254, 0.05)",
        borderWidth: 2.5,
        tension: 0.2,
        yAxisID: "y-substance",
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4,
      });
    }

    if (showAiSessions) {
      datasets.push({
        label: "Weekly AI Sessions",
        data: rawCSVData.map((d) => d.aiSessions),
        borderColor: "#FBBF24", // Amber
        borderWidth: 1.5,
        borderDash: [3, 3],
        tension: 0.1,
        yAxisID: "y-ai",
        pointRadius: 0,
        pointHoverRadius: 4,
      });
    }

    if (showGhb) {
      datasets.push({
        label: "GHB (ml/wk)",
        data: rawCSVData.map((d) => d.ghb),
        borderColor: "#A78BFA", // Lavender
        borderWidth: 1.5,
        tension: 0.15,
        yAxisID: "y-substance",
        pointRadius: 0,
      });
    }

    if (showMeth) {
      datasets.push({
        label: "Methamphetamine (g/wk)",
        data: rawCSVData.map((d) => d.meth),
        borderColor: "#10B981", // Emerald
        borderWidth: 1.5,
        tension: 0.15,
        yAxisID: "y-substance",
        pointRadius: 0,
      });
    }

    if (showClobromazolam) {
      datasets.push({
        label: "Clobromazolam (mg/wk)",
        data: rawCSVData.map((d) => d.clobromazolam),
        borderColor: "#3B82F6", // Blue
        borderWidth: 1.5,
        tension: 0.15,
        yAxisID: "y-substance",
        pointRadius: 0,
      });
    }

    // Custom Annotation plugin to draw vertical milestone markers
    const annotationPlugin = {
      id: "milestoneAnnotations",
      afterDatasetsDraw(chart: any) {
        const { ctx, chartArea: { top, bottom }, scales: { x } } = chart;
        ctx.save();

        // Week 27 Milestone (Voss Protocol Deployment)
        const xWeek27 = x.getPixelForValue(26); // W27 corresponds to 26th index (0-based)
        if (xWeek27 !== undefined && xWeek27 >= chart.chartArea.left && xWeek27 <= chart.chartArea.right) {
          ctx.strokeStyle = "rgba(239, 68, 68, 0.7)"; // Red-Orange
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(xWeek27, top);
          ctx.lineTo(xWeek27, bottom);
          ctx.stroke();

          // Text label
          ctx.fillStyle = "rgba(239, 68, 68, 0.9)";
          ctx.font = "bold 9px monospace";
          ctx.fillText("W27: PROTOCOL DEPLOYED", xWeek27 + 6, top + 15);
        }

        // Week 97 Milestone (50% reduction threshold reached)
        const xWeek97 = x.getPixelForValue(96); // W97 corresponds to 96th index
        if (xWeek97 !== undefined && xWeek97 >= chart.chartArea.left && xWeek97 <= chart.chartArea.right) {
          ctx.strokeStyle = "rgba(16, 185, 129, 0.7)"; // Emerald Green
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(xWeek97, top);
          ctx.lineTo(xWeek97, bottom);
          ctx.stroke();

          // Text label
          ctx.fillStyle = "rgba(16, 185, 129, 0.9)";
          ctx.font = "bold 9px monospace";
          ctx.fillText("W97: 50% SUBSTANCE REDUCTION", xWeek97 + 6, top + 35);
        }

        ctx.restore();
      }
    };

    chartInstanceRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // Customized controls below chart
          },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "#0A0F1D",
            titleColor: "#FFFFFF",
            titleFont: { family: "Space Grotesk", weight: "bold" },
            bodyFont: { family: "Inter" },
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderWidth: 1,
            padding: 10,
          },
        },
        scales: {
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.03)",
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.4)",
              font: { family: "JetBrains Mono", size: 9 },
              maxTicksLimit: 12,
            },
          },
          "y-substance": {
            type: "linear",
            position: "left",
            title: {
              display: true,
              text: "COMPOSITE SUBSTANCE INDEX",
              color: "#00F2FE",
              font: { family: "Space Grotesk", size: 9, weight: "bold" },
            },
            grid: {
              color: "rgba(255, 255, 255, 0.05)",
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.4)",
              font: { family: "JetBrains Mono", size: 9 },
              stepSize: 20,
            },
            min: 0,
            max: 120,
          },
          "y-ai": {
            type: "linear",
            position: "right",
            title: {
              display: true,
              text: "WEEKLY AI SESSIONS",
              color: "#FBBF24",
              font: { family: "Space Grotesk", size: 9, weight: "bold" },
            },
            grid: {
              drawOnChartArea: false, // Only show grid lines for left y-axis
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.4)",
              font: { family: "JetBrains Mono", size: 9 },
              stepSize: 2,
            },
            min: 0,
            max: 16,
          },
        },
      },
      plugins: [annotationPlugin],
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [showGhb, showMeth, showClobromazolam, showComposite, showAiSessions]);

  return (
    <div id="chart-dashboard-container" className="voss-glass rounded-2xl p-6 border border-white/10 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-mono text-voss-cyan tracking-widest uppercase mb-1 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Empirical Long-Term Cohort Tracking
          </h4>
          <h3 className="text-xl font-bold font-display text-white">110-Week Quantitative Longitudinal Analysis</h3>
        </div>

        {/* Legend buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            id="toggle-composite-btn"
            onClick={() => setShowComposite(!showComposite)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
              showComposite
                ? "bg-voss-cyan/10 border-voss-cyan/40 text-voss-cyan"
                : "border-white/5 text-slate-500 hover:border-white/10"
            }`}
          >
            Composite index
          </button>
          <button
            id="toggle-sessions-btn"
            onClick={() => setShowAiSessions(!showAiSessions)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
              showAiSessions
                ? "bg-voss-amber/10 border-voss-amber/40 text-voss-amber"
                : "border-white/5 text-slate-500 hover:border-white/10"
            }`}
          >
            AI Sessions/Wk
          </button>
          <button
            id="toggle-ghb-btn"
            onClick={() => setShowGhb(!showGhb)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
              showGhb
                ? "bg-[#A78BFA]/10 border-[#A78BFA]/40 text-[#A78BFA]"
                : "border-white/5 text-slate-500 hover:border-white/10"
            }`}
          >
            GHB ml/wk
          </button>
          <button
            id="toggle-meth-btn"
            onClick={() => setShowMeth(!showMeth)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
              showMeth
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                : "border-white/5 text-slate-500 hover:border-white/10"
            }`}
          >
            Meth g/wk
          </button>
          <button
            id="toggle-clobro-btn"
            onClick={() => setShowClobromazolam(!showClobromazolam)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
              showClobromazolam
                ? "bg-blue-500/10 border-blue-500/40 text-blue-400"
                : "border-white/5 text-slate-500 hover:border-white/10"
            }`}
          >
            Clobro mg/wk
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5">
        <div className="w-full h-80 md:h-[420px] relative">
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* Highlights / Stats bar below the chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
        <div className="flex items-start space-x-3 bg-slate-900/40 p-4 rounded-xl border border-white/5">
          <ShieldAlert className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-300 font-display">Week 27 Intervention</p>
            <p className="text-slate-500 mt-1 leading-relaxed">
              Activation of the local dry-mirror wrapper immediately broke the sub-second latency chain, triggering a downstream behavioral cascade.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 bg-slate-900/40 p-4 rounded-xl border border-white/5">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-300 font-display">Week 97 Threshold</p>
            <p className="text-slate-500 mt-1 leading-relaxed">
              Composite substance load dropped precisely by 50% from baseline parameters. Sleep and executive function indices enter recovery zone.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 bg-slate-900/40 p-4 rounded-xl border border-white/5">
          <TrendingDown className="w-5 h-5 text-voss-cyan shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-300 font-display">DAT Density Upregulation</p>
            <p className="text-slate-500 mt-1 leading-relaxed">
              Longitudinal taper culminated in a controlled clinical detox, leading to a massive +34% increase in striatal DAT binding density.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
