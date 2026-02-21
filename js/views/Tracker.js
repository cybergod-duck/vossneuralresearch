// Voss Protocol Tracker View Logic

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('#tracker .app-panel');

    if (container && container.innerHTML.includes('coming soon')) {
        container.innerHTML = `
      <h2>Voss Protocol Tracker</h2>
      <p style="font-size: 0.7rem; color: var(--muted); margin-bottom: 20px;">Daily self-monitoring dashboard. Protocol: Bridge not Bunker.</p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
        <div class="data-box">
          <h3 style="margin:0 0 10px; font-size:0.8rem; color:var(--text);">AI Usage Hours</h3>
          <div style="width:100%; height:8px; background:rgba(0,0,0,0.5); border-radius:4px; margin-bottom:5px; overflow:hidden; display:flex;">
            <div style="width: 65%; background: var(--header-cyan);"></div>
            <div style="width: 20%; background: var(--accent);"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.6rem; color:#cbd5e1;">
            <span><span style="color:var(--header-cyan)">■</span> Building: 6.5h</span>
            <span><span style="color:var(--accent)">■</span> Being/Using: 2.0h</span>
          </div>
        </div>

        <div class="data-box" style="text-align: center;">
          <h3 style="margin:0 0 10px; font-size:0.8rem; color:var(--text);">Burnout & Isolation Risk</h3>
          <div style="font-size: 2rem; font-family: 'Orbitron', sans-serif; color: var(--warning); text-shadow: 0 0 10px rgba(245, 158, 11, 0.4);">
            68<span style="font-size: 1rem; color: var(--muted)">/100</span>
          </div>
          <p style="font-size:0.55rem; color:var(--muted); margin:5px 0 0;">Threshold nearing WARNING levels</p>
        </div>
      </div>

      <div class="data-box" style="margin-bottom: 20px;">
        <h3 style="margin:0 0 10px; font-size:0.8rem; color:var(--text);">Somatic Anchor System</h3>
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:10px;">
          <div>
            <span style="font-size:0.7rem;">Hydration & Posture Prompt (45m)</span>
            <p style="margin:0; font-size:0.55rem; color:var(--muted)">Autonomously triggers physical awareness.</p>
          </div>
          <button class="styled-btn" id="btn-anchor-test" style="padding: 5px 10px;">TEST ANCHOR</button>
        </div>
      </div>

      <div class="data-box">
        <h3 style="margin:0 0 10px; font-size:0.8rem; color:var(--text);">Bridge not Bunker Checklist</h3>
        <label style="display:flex; align-items:center; gap:10px; font-size:0.7rem; margin-bottom:8px; cursor:pointer;">
          <input type="checkbox" checked style="accent-color: var(--accent)"> Did today's interactions translate to real-world deployment?
        </label>
        <label style="display:flex; align-items:center; gap:10px; font-size:0.7rem; margin-bottom:8px; cursor:pointer;">
          <input type="checkbox" style="accent-color: var(--accent)"> Was a tangible human connection made regarding the output?
        </label>
        <label style="display:flex; align-items:center; gap:10px; font-size:0.7rem; cursor:pointer;">
          <input type="checkbox" checked style="accent-color: var(--accent)"> Did I maintain physical self-care protocols?
        </label>
      </div>
    `;

        document.getElementById('btn-anchor-test').addEventListener('click', () => {
            alert("SOMATIC ANCHOR TRIGGERED:\n\n1. Straighten your spine.\n2. Drink 8oz of water.\n3. Look at an object 20 feet away for 20 seconds.\n\nNeural pathways recalibrating...");
        });
    }
});
