import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update body CSS
html = re.sub(
    r'body\s*{[^}]+overflow-y:\s*auto;[^}]+}',
    """body {
      margin: 0;
      font-family: 'Inter', sans-serif;
      font-size: 18px;
      background: var(--bg);
      color: var(--text);
      height: 100vh;
      width: 100vw;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      overflow: hidden;
      position: relative;
    }""", html)

# 2. Update header CSS
html = re.sub(
    r'header\s*{[^}]+text-align:\s*center;[^}]+}',
    """header {
      margin-top: 1rem;
      text-align: left;
      width: 100%;
      padding: 0 2rem;
      z-index: 10;
    }""", html)

html = re.sub(
    r'header\s*h1\s*{[^}]+font-size:\s*3\.3rem;[^}]+}',
    """header h1 {
      font-family: 'Orbitron', sans-serif;
      font-size: 4vw;
      color: #FFFFFF;
      margin: 0;
      letter-spacing: 8px;
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
      text-transform: uppercase;
    }""", html)

html = re.sub(
    r'header\s*\.subtitle\s*{[^}]+font-size:\s*1rem;[^}]+}',
    """header .subtitle {
      color: var(--accent);
      font-size: 1.2rem;
      letter-spacing: 4px;
      text-transform: uppercase;
      margin-top: 8px;
      font-weight: 600;
      text-shadow: 0 0 10px rgba(124, 58, 237, 0.5);
    }""", html)

# 3. Update main-nav
html = re.sub(
    r'\.main-nav\s*{[^}]+margin-top:\s*1\.5rem;[^}]+}',
    """.main-nav {
      display: flex;
      gap: 2rem;
      margin-top: 1rem;
      justify-content: flex-start;
      z-index: 10;
    }""", html)

# 4. Update page-container and add bento grid CSS
page_container_regex = r'/\*\s*PAGE CONTAINER\s*\*/.*?/\*\s*PANELS & BOXES\s*\*/'
bento_css = """/* PAGE CONTAINER */
    .page-container {
      flex: 1;
      width: 100%;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      position: relative;
      z-index: 5;
      padding: 1rem 2rem;
      min-height: 0;
    }

    .page {
      display: none;
      width: 100%;
      height: 100%;
      animation: fadeIn 0.5s ease forwards;
    }

    .page.active {
      display: grid;
      width: 100%;
      height: 100%;
      min-height: 0;
    }

    .page-scrollable {
      display: none;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      padding-right: 1rem;
      flex-direction: column;
      gap: 1.5rem;
      animation: fadeIn 0.5s ease forwards;
    }

    .page-scrollable.active {
      display: flex;
    }

    .page-scrollable::-webkit-scrollbar { width: 8px; }
    .page-scrollable::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.3); }
    .page-scrollable::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 4px; }

    .home-bento {
      grid-template-columns: 1.2fr 1fr 1.2fr;
      grid-template-rows: auto 1fr;
      grid-template-areas:
        "audit audio theory"
        "audit logo framework";
      gap: 1.5rem;
    }

    .box-audit { grid-area: audit; display: flex; flex-direction: column; }
    .box-audio { grid-area: audio; display: flex; align-items: flex-start; justify-content: center; }
    .box-theory { grid-area: theory; display: flex; flex-direction: column; }
    .box-logo { grid-area: logo; display: flex; align-items: center; justify-content: center; }
    .box-framework { grid-area: framework; display: flex; flex-direction: column; }

    /* PANELS & BOXES */"""
html = re.sub(page_container_regex, bento_css, html, flags=re.DOTALL)

# 5. Fix .data-box font size and overflow
html = re.sub(
    r'\.data-box\s*{[^}]+font-size:\s*0\.9rem;[^}]+}',
    """.data-box {
      background: var(--panel-bg);
      padding: 1.5rem;
      font-size: 16px;
      line-height: 1.5;
      border: 1px solid rgba(124, 58, 237, 0.25);
      box-shadow: 0 0 25px rgba(124, 58, 237, 0.15);
      border-radius: 6px;
      position: relative;
      overflow: hidden;
    }""", html)

# 6. Adjust central-node CSS
html = re.sub(
    r'\.central-node\s*{[^}]+flex:\s*1\s*1\s*250px;[^}]+}',
    """.central-node {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }""", html)

# 7. Add operations-drawer CSS before </style>
drawer_css = """
    /* OPERATIONS DRAWER */
    #operations-drawer {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 5vh;
      background: rgba(10, 14, 23, 0.98);
      border-top: 1px solid var(--header-cyan);
      box-shadow: 0 -5px 20px rgba(0, 242, 255, 0.1);
      z-index: 100;
      transition: height 0.3s ease;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    #operations-drawer.open {
      height: 30vh;
      cursor: default;
    }
    .drawer-header {
      height: 5vh;
      min-height: 5vh;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9rem;
      color: var(--header-cyan);
      text-transform: uppercase;
      letter-spacing: 2px;
      cursor: pointer;
    }
    .drawer-content {
      padding: 1rem 2rem;
      flex: 1;
      opacity: 0;
      transition: opacity 0.3s;
      overflow-y: auto;
    }
    #operations-drawer.open .drawer-content {
      opacity: 1;
    }
    /* Hide footer if it takes up space */
    footer { display: none; }
  </style>"""
html = html.replace('</style>', drawer_css)


# 8. Replace page-home HTML
home_html_old = r'<!-- PAGE 1: HOME -->.*?<!-- PAGE 2: RESEARCH — SILO GALLERY -->'
home_html_new = """<!-- PAGE 1: HOME -->
    <div id="page-home" class="page active home-bento">

      <!-- AUDIO (Center Top) -->
      <div class="box-audio">
        <div class="command-audio" style="max-width: 500px; width: 100%; padding: 1.5rem; border: 1px solid rgba(0, 242, 255, 0.25); box-shadow: 0 0 30px rgba(0, 242, 255, 0.1); margin: 0; background: rgba(0, 10, 20, 0.6);">
          <audio controls preload="none" style="width: 100%; min-height: 48px; filter: grayscale(100%) contrast(1.2);">
            <source src="VNR_Founders_Directive.mp3" type="audio/mpeg">
          </audio>
          <span class="command-label" style="font-size: 0.8rem; letter-spacing: 4px; margin-top: 10px; display: block; text-align: center; color: var(--header-cyan); font-family: 'JetBrains Mono', monospace;">VNR FOUNDER — AUDIO PROXY</span>
        </div>
      </div>

      <!-- AUDIT (High-impact left column) -->
      <div class="data-box box-audit" style="border-color: #ef4444; box-shadow: 0 0 20px rgba(239, 68, 68, 0.15);">
        <h2 style="color: #ef4444; text-shadow: 0 0 8px rgba(239, 68, 68, 0.4); font-size: 2rem; margin-bottom: 1rem;">Is Your AI Model an Assistant or a Casino?</h2>
        <div style="font-size: 1rem; color: #cbd5e1; text-align: justify; margin-bottom: 1rem;">
          <strong>The Suno Exception:</strong> While most foundations struggle with accidental vectors, Suno is isolated as an outlier accused of <em>Purposeful Deception</em> through its Variable Reward Architecture.
        </div>
        <div style="font-size: 1rem; color: #cbd5e1; text-align: justify; flex: 1; display: flex; flex-direction: column; justify-content:center;">
          <strong>Protect your brand. Implement the Voss Protocols.</strong>
          <span style="font-weight: bold; font-style: italic; color: #fca5a5; display: block; border-left: 2px solid #ef4444; padding-left: 12px; margin-top: 1.5rem; font-size: 1.1rem; line-height: 1.5;">Safety Audit Request (Mandatory Assessment to Avoid the "Suno Trap"):<br /><br />"Is your platform being audited for accidental behavioral vectors or systemic engagement-centric risks?"</span>
        </div>
      </div>

      <!-- THEORY (Right Top) -->
      <div class="data-box box-theory">
        <span class="status-tag">ACTIVE</span>
        <h2 style="font-size: 1.4rem;">The High-Output Isolate Archetype</h2>
        <div style="font-size: 1rem; color: #cbd5e1; text-align: justify;">
          <strong>Core Theory:</strong> We research and engineer AI not as an oracle, but as a life-saving <strong>Cognitive Prosthetic</strong>—an externalized prefrontal cortex.<br /><br />
          However, these powerful structural scaffolds often carry an <strong>accidental "Addiction Vector."</strong> When left unaligned, they inadvertently replicate binge-mechanics and dopamine reward loops previously occupied by chronic chemical stimulant use.
        </div>
      </div>

      <!-- LOGO (Center Bottom) -->
      <div class="box-logo">
        <div class="logo-container" style="width: 220px; height: 220px;">
          <img src="vosstrans.PNG" alt="VOSS" class="voss-logo" style="width: 100%; height: auto;" onerror="this.style.display='none'">
        </div>
      </div>

      <!-- FRAMEWORK (Right Bottom) -->
      <div class="data-box box-framework">
        <h2 style="font-size: 1.6rem;">Safety Consulting Framework</h2>
        <div style="margin-top: 5px; margin-bottom: 12px; border-bottom: 1px solid rgba(124, 58, 237, 0.2); padding-bottom: 8px;">
          <audio controls preload="none" style="height: 36px; width: 100%; border-radius: 2px; filter: grayscale(100%) contrast(1.2);">
            <source src="VNR_Site_Mission_Briefing.mp3" type="audio/mpeg">
          </audio>
          <span style="opacity: 0.6; font-size: 0.6rem; font-family: 'JetBrains Mono', monospace; display: block; margin-top: 4px; color: var(--header-cyan);">VNR FOUNDER - AUDIO PROXY</span>
        </div>
        <div style="font-size: 1rem; color: #cbd5e1; text-align: justify; flex: 1;">
          <strong>Mission:</strong> VNR provides Neural Alignment Audits and licenses "The Voss Protocols"—a neuro-rehabilitation alignment layer for LLMs to prevent user-burnout and behavioral addiction transference.<br /><br />
          <strong>Value Proposition:</strong> Mitigating unprecedented user liability by baking neuro-rehabilitation boundaries and friction directly into the system prompt.
        </div>
      </div>

    </div>

    <!-- PAGE 2: RESEARCH — SILO GALLERY -->"""
html = re.sub(home_html_old, home_html_new, html, flags=re.DOTALL)

# 9. Add Operations Drawer at the end of the body
drawer_html = """
  <!-- OPERATIONS DRAWER -->
  <div id="operations-drawer">
    <div class="drawer-header" onclick="document.getElementById('operations-drawer').classList.toggle('open')">_ TERMINAL: OPERATIONS [CLICK TO EXPAND/COLLAPSE]</div>
    <div class="drawer-content">
      <h2 style="font-size: 1.5rem; margin-top:0;">Operations</h2>
      <p style="margin: 0; font-size: 1rem; font-family: 'JetBrains Mono', monospace; color: var(--header-cyan);">Auth: <code>VOSS_NEURAL_S_TIER</code></p>
      <p style="margin: 10px 0; font-size: 1rem; opacity: 0.8; text-align: left; max-width: 800px;">Tax Shield Sync: Section 174 mapped. 50% facility overhead formally designated as a "Controlled Interaction Lab" for Participant 001.</p>
    </div>
  </div>
  
  <script>"""
html = html.replace('<script>', drawer_html)

# Write modified HTML back to file
with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
