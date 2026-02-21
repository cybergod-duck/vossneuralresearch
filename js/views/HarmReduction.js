// Harm Reduction Protocol Checklist UI & Logic

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('#harm-reduction .app-panel');

    if (container && container.innerHTML.includes('coming soon')) {
        container.innerHTML = `
      <h2>Harm Reduction Protocol</h2>
      <p style="font-size: 0.7rem; color: var(--muted); margin-bottom: 20px;">Actionable guardrails for minimizing dopaminergic hijacking during AI interactions.</p>

      <div class="data-box" style="margin-bottom: 25px;">
        <h3 style="font-size: 0.8rem; margin-top: 0; color: var(--header-cyan); margin-bottom: 15px;">The 4 Core Axioms</h3>
        
        <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.05);">
          <label style="display:flex; align-items:flex-start; gap:10px; cursor:pointer;">
            <input type="checkbox" style="accent-color: var(--accent); margin-top:3px;">
            <div>
              <strong style="font-size:0.75rem; color:white; display:block;">Protocol I: Defined Exits</strong>
              <span style="font-size:0.65rem; color:var(--muted); line-height:1.4; display:block; margin-top:4px;">Never initiate an orchestration loop without a pre-defined physical exit trigger (e.g., set alarm, scheduled human contact).</span>
            </div>
          </label>
        </div>

        <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.05);">
          <label style="display:flex; align-items:flex-start; gap:10px; cursor:pointer;">
            <input type="checkbox" style="accent-color: var(--accent); margin-top:3px;">
            <div>
              <strong style="font-size:0.75rem; color:white; display:block;">Protocol II: Somatic Anchoring</strong>
              <span style="font-size:0.65rem; color:var(--muted); line-height:1.4; display:block; margin-top:4px;">Acknowledge bodily state every 45 minutes. Hydrate, focus eyes beyond screens, scan for tension.</span>
            </div>
          </label>
        </div>

        <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.05);">
          <label style="display:flex; align-items:flex-start; gap:10px; cursor:pointer;">
            <input type="checkbox" style="accent-color: var(--accent); margin-top:3px;">
            <div>
              <strong style="font-size:0.75rem; color:white; display:block;">Protocol III: Output Ownership</strong>
              <span style="font-size:0.65rem; color:var(--muted); line-height:1.4; display:block; margin-top:4px;">Do not outsource executive decision making. Use agents for scaffolding, retain final edit and conceptual authority.</span>
            </div>
          </label>
        </div>

        <div>
          <label style="display:flex; align-items:flex-start; gap:10px; cursor:pointer;">
            <input type="checkbox" style="accent-color: var(--accent); margin-top:3px;">
            <div>
              <strong style="font-size:0.75rem; color:white; display:block;">Protocol IV: The Bridge</strong>
              <span style="font-size:0.65rem; color:var(--muted); line-height:1.4; display:block; margin-top:4px;">Every digital construction must have a physical-world equivalent or human utility. Do not build for building's sake.</span>
            </div>
          </label>
        </div>

      </div>

      <div style="text-align: center;">
        <button class="styled-btn" id="btn-print-card" style="border-color: var(--header-cyan);">GENERATE WEEKLY COMMITMENT CARD</button>
      </div>
    `;

        document.getElementById('btn-print-card').addEventListener('click', () => {
            alert("Opening print dialogue for physical commitment card...\n\n(Ensure printer is connected to transfer digital protocol to physical anchor.)");
            // window.print() would usually trigger here
        });
    }
});
