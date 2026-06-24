import React, { useState } from "react";
import { ShieldCheck, Mail, Users, FileText, Send, X, Trophy, Sparkles, Building } from "lucide-react";

export const FundingModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    fundingAmount: "$250,000",
    reason: ""
  });
  const [proposalId, setProposalId] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomId = Math.floor(100000 + Math.random() * 900000);
    setProposalId(`VNR03-GRANT-${randomId}`);
    setIsSubmitted(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // Let success screen fade away after closing
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        organization: "",
        fundingAmount: "$250,000",
        reason: ""
      });
    }, 200);
  };

  return (
    <div id="funding-portal-wrapper" className="voss-glass rounded-2xl p-6 md:p-8 border border-white/10 relative overflow-hidden">
      {/* Decorative pulse background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-radial from-voss-cyan/5 to-transparent rounded-full -ml-32 -mt-32 pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Pitch content on Left */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center space-x-3 text-voss-cyan">
            <span className="w-2 h-2 rounded-full bg-voss-cyan animate-ping" />
            <span className="text-xs font-mono uppercase tracking-widest">Phase II / III Strategic Expansion</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold font-display text-white leading-tight">
            VNR03 Cohort Expansion & Enterprise Safety Standards
          </h2>

          <p className="text-sm text-slate-400 leading-relaxed font-sans">
            Following the successful clinical detoxification of Subject Alpha, Voss Neural Research is scaling interventions to a randomized multicenter cohort study (N=15 professionals). Our objective is to codify cognitive safety standards and build cross-platform browser integration middlewares.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
            <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 space-y-2">
              <Users className="w-5 h-5 text-voss-cyan animate-pulse" />
              <p className="font-bold text-slate-200">VNR03 Cohort (N=15)</p>
              <p className="text-slate-500 leading-relaxed">Scaling to fifteen technical knowledge professionals presenting comorbid digital-chemical loops.</p>
            </div>
            <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 space-y-2">
              <ShieldCheck className="w-5 h-5 text-voss-emerald" />
              <p className="font-bold text-slate-200">Commercial SDK Wrapper</p>
              <p className="text-slate-500 leading-relaxed">Developing enterprise integrations to enforce cognitive friction compliance in professional workforces.</p>
            </div>
            <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 space-y-2">
              <Trophy className="w-5 h-5 text-voss-amber" />
              <p className="font-bold text-slate-200">Global Safety Standards</p>
              <p className="text-slate-500 leading-relaxed">Establishing independent audits for engagement optimization ethics in AI platforms.</p>
            </div>
          </div>
        </div>

        {/* CTA Button on Right */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5 text-center space-y-4 max-w-sm w-full">
            <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest">GRANT COLLABORATION</h4>
            <p className="text-sm font-bold text-white font-display">Review Board & Funding Portal</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Venture Capital and Grant Committees are invited to submit screening letters for Phase II/III programmatic investment.
            </p>
            <button
              id="apply-for-grant-btn"
              onClick={() => setIsOpen(true)}
              className="w-full py-3 rounded-xl bg-voss-cyan text-slate-950 font-mono text-xs font-bold tracking-wider hover:bg-white hover:scale-[1.01] hover:shadow-lg hover:shadow-voss-cyan/10 transition-all duration-300 cursor-pointer"
            >
              APPLY FOR GRANT COLLABORATIVE
            </button>
          </div>
        </div>
      </div>

      {/* Modern Backdrop blur Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            id="modal-backdrop"
            onClick={closeModal}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Card */}
          <div
            id="modal-content"
            className="relative bg-[#0A0F1D] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center space-x-2 text-voss-cyan">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-mono uppercase tracking-widest">GRANT COLLABORATION SUBMISSION</span>
              </div>
              <button
                id="close-modal-btn"
                onClick={closeModal}
                className="text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6">
              {!isSubmitted ? (
                /* FORM STEP */
                <form id="grant-application-form" onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Full Name</label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Dr. Michael Vance"
                        className="w-full bg-slate-950 border border-white/5 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-voss-cyan/50 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Email Address</label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="vance@neuralresearch.org"
                        className="w-full bg-slate-950 border border-white/5 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-voss-cyan/50 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Organization / Committee</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                      <input
                        required
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        placeholder="Voss Neural Research LLC"
                        className="w-full bg-slate-950 border border-white/5 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-voss-cyan/50 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Target Funding Support</label>
                    <select
                      name="fundingAmount"
                      value={formData.fundingAmount}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950 border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-voss-cyan/50 text-xs cursor-pointer"
                    >
                      <option value="$100,000">$100,000 - Seed Phase II Expansion</option>
                      <option value="$250,000">$250,000 - Intermediate Cohort Study (N=15)</option>
                      <option value="$1,000,000+">$1,000,000+ - Full Programmatic Integration & Safety Audits</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Brief Statement of Intent</label>
                    <textarea
                      required
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Discuss scientific and investment objectives..."
                      className="w-full bg-slate-950 border border-white/5 rounded-lg p-3 text-white placeholder-slate-600 focus:outline-none focus:border-voss-cyan/50 text-xs resize-none"
                    />
                  </div>

                  <button
                    id="submit-proposal-btn"
                    type="submit"
                    className="w-full py-3 rounded-xl bg-voss-cyan text-slate-950 font-mono text-xs font-bold tracking-widest uppercase flex items-center justify-center space-x-2 hover:bg-white transition-all duration-300 mt-6 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>SUBMIT PROPOSAL TO COMMITTEE</span>
                  </button>
                </form>
              ) : (
                /* SUCCESS STATE */
                <div id="grant-success-screen" className="text-center py-8 space-y-4 animate-scale-up">
                  <div className="w-16 h-16 bg-voss-cyan/10 border border-voss-cyan/30 rounded-full flex items-center justify-center mx-auto mb-2 text-voss-cyan">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold font-display text-white">Proposal Processed</h3>
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-white/5 font-mono text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                    <span className="text-voss-cyan font-bold block mb-1">GRANT ID: {proposalId}</span>
                    A VNR Research Coordinator will reach out to schedule biochemical and programmatic screening. Relational warmth remains restricted.
                  </div>
                  <button
                    id="success-dismiss-btn"
                    onClick={closeModal}
                    className="px-6 py-2.5 rounded-xl border border-white/10 hover:border-white/25 text-slate-300 font-mono text-xs transition-all duration-300 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
