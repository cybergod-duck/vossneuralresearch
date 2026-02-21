// Cognitive Load Offload Planner UI & Logic

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('#planner .app-panel');

    if (container && container.innerHTML.includes('coming soon')) {
        container.innerHTML = `
      <h2>Cognitive Load Offload Planner</h2>
      <p style="font-size: 0.7rem; color: var(--muted); margin-bottom: 20px;">Dump complex projects to structure AI-assisted scaffolding vs. human offline execution.</p>

      <div class="data-box" style="margin-bottom: 20px;">
        <label style="display:block; font-size:0.7rem; color:var(--header-cyan); margin-bottom:10px; font-family:'JetBrains Mono', monospace;">UNSTRUCTURED PROJECT DUMP:</label>
        <textarea id="planner-input" rows="4" style="width:100%; padding:10px; background:rgba(0,0,0,0.5); border:1px solid rgba(124,58,237,0.4); color:white; font-family:'Inter', sans-serif; resize:vertical; border-radius:4px;" placeholder="Describe everything that needs to happen..."></textarea>
        <button class="styled-btn" id="btn-structure" style="margin-top: 10px;">STRUCTURE WORKFLOW</button>
      </div>

      <div id="planner-output" style="display: none; margin-bottom:20px;">
        <div style="display:flex; gap:15px;">
          
          <div class="data-box" style="flex:1; border-color:rgba(124,58,237,0.6);">
            <h3 style="margin:0 0 10px; font-size:0.75rem; color:var(--accent);">AI SCAFFOLDING PHASE</h3>
            <ul style="padding-left:15px; margin:0; font-size:0.65rem; color:#cbd5e1; line-height:1.6;">
              <li style="margin-bottom:5px;">Generate base architectural outlines</li>
              <li style="margin-bottom:5px;">Synthesize raw data and format lists</li>
              <li>Provide debugging logic options</li>
            </ul>
          </div>

          <div class="data-box" style="flex:1; border-color:rgba(0,242,255,0.4);">
            <h3 style="margin:0 0 10px; font-size:0.75rem; color:var(--header-cyan);">HUMAN EXECUTION (OFFLINE)</h3>
            <ul style="padding-left:15px; margin:0; font-size:0.65rem; color:#cbd5e1; line-height:1.6;">
              <li style="margin-bottom:5px;">Creative decision-making & final polish</li>
              <li style="margin-bottom:5px;">Manual code integration & physical testing</li>
              <li>Stakeholder communication & empathy tasks</li>
            </ul>
          </div>

        </div>
      </div>

      <div class="data-box" style="text-align: center; background: rgba(0,0,0,0.4);">
        <h3 style="margin:0 0 10px; font-size:0.8rem; color:var(--text);">Session Timer</h3>
        <div id="timer-display" style="font-size: 2.5rem; font-family: 'Orbitron', sans-serif; color: var(--header-cyan); text-shadow: 0 0 15px rgba(0,242,255,0.4); margin-bottom: 15px;">45:00</div>
        
        <div style="display:flex; justify-content:center; gap:10px;">
          <button class="styled-btn" id="btn-start-timer" style="border-color: var(--header-cyan);">START INTERVAL</button>
          <button class="styled-btn" id="btn-reset-timer" style="opacity:0.7;">RESET</button>
        </div>
        <p style="font-size:0.55rem; color:var(--warning); margin-top:10px; display:none;" id="timer-alert">MANDATORY BREAK: Disconnect and initiate physical movement.</p>
      </div>
    `;

        // Structure logic
        document.getElementById('btn-structure').addEventListener('click', () => {
            const val = document.getElementById('planner-input').value.trim();
            if (val) document.getElementById('planner-output').style.display = 'block';
        });

        // Timer logic
        let time = 45 * 60; // 45 mins
        let interval;
        const display = document.getElementById('timer-display');
        const alertMsg = document.getElementById('timer-alert');

        function updateDisplay() {
            const m = Math.floor(time / 60).toString().padStart(2, '0');
            const s = (time % 60).toString().padStart(2, '0');
            display.innerText = `${m}:${s}`;
        }

        document.getElementById('btn-start-timer').addEventListener('click', (e) => {
            if (interval) return;
            e.target.innerText = "RUNNING...";
            e.target.style.opacity = '0.5';

            interval = setInterval(() => {
                time--;
                updateDisplay();
                if (time <= 0) {
                    clearInterval(interval);
                    display.style.color = "var(--danger)";
                    display.style.textShadow = "0 0 15px rgba(239,68,68,0.5)";
                    alertMsg.style.display = "block";
                }
            }, 1000);
        });

        document.getElementById('btn-reset-timer').addEventListener('click', () => {
            clearInterval(interval);
            interval = null;
            time = 45 * 60;
            updateDisplay();
            display.style.color = "var(--header-cyan)";
            display.style.textShadow = "0 0 15px rgba(0,242,255,0.4)";
            alertMsg.style.display = "none";
            const startBtn = document.getElementById('btn-start-timer');
            startBtn.innerText = "START INTERVAL";
            startBtn.style.opacity = '1';
        });
    }
});
