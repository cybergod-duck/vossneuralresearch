import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Background & Base Typography
html = re.sub(
    r'\*\s*\{\s*box-sizing:\s*border-box;\s*\}',
    """* {
      box-sizing: border-box;
      font-family: 'JetBrains Mono', monospace !important;
    }""", html)

html = re.sub(
    r'body\s*\{[^}]*\}',
    """body {
      margin: 0;
      padding: 0;
      font-size: 14px;
      background: #0A0A0A;
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

# 2. Container: 100vw, 0px margins, eliminate "Near-Miss" spacing (0 gap, 0 padding, no border radius)
html = re.sub(
    r'\.page-container\s*\{[^}]*\}',
    """.page-container {
      flex: 1;
      width: 100vw;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      position: relative;
      z-index: 5;
      padding: 0;
      margin: 0;
      min-height: 0;
    }""", html)

html = re.sub(
    r'\.page\s*\{[^}]*\}',
    """.page {
      display: none;
      width: 100%;
      height: 100%;
      padding: 0;
      margin: 0;
      animation: fadeIn 0.5s ease forwards;
    }""", html)

html = re.sub(
    r'\.home-bento\s*\{[^}]*\}',
    """.home-bento {
      grid-template-columns: 1.2fr 1fr 1.2fr;
      grid-template-rows: 1fr 1fr;
      grid-template-areas:
        "audit audio theory"
        "audit logo framework";
      gap: 0;
    }""", html)

html = re.sub(
    r'\.data-box\s*\{[^}]*\}',
    """.data-box {
      background: var(--panel-bg);
      padding: 1.5rem;
      font-size: 14px;
      line-height: 1.4;
      border: 1px solid rgba(124, 58, 237, 0.25);
      box-shadow: none;
      border-radius: 0;
      position: relative;
      overflow: hidden;
    }""", html)

html = re.sub(
    r'\.side-panel\s*\{[^}]*\}',
    """.side-panel {
      flex: 1 1 300px;
      max-width: 420px;
      display: flex;
      flex-direction: column;
      gap: 0;
    }""", html)

# 3. Add Restricted Watermark CSS
watermark_css = """
    .restricted-watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 4rem;
      color: rgba(255, 0, 0, 0.05);
      border: 6px solid rgba(255, 0, 0, 0.05);
      padding: 1rem 2rem;
      pointer-events: none;
      z-index: 0;
      white-space: nowrap;
      font-weight: bold;
      letter-spacing: 10px;
    }
  </style>"""
html = html.replace('</style>', watermark_css)

# Apply watermark to the Silo cards (which start with <!-- SILO 1:, <!-- SILO 2:, <!-- SILO 3:)
silo_1_regex = r'(<!-- SILO 1:.*?<div class="data-box"[^>]*>)'
html = re.sub(silo_1_regex, r'\1\n            <div class="restricted-watermark">RESTRICTED</div>', html, flags=re.DOTALL)

silo_2_regex = r'(<!-- SILO 2:.*?<div class="data-box"[^>]*>)'
html = re.sub(silo_2_regex, r'\1\n            <div class="restricted-watermark">RESTRICTED</div>', html, flags=re.DOTALL)

silo_3_regex = r'(<!-- SILO 3:.*?<div class="data-box"[^>]*>)'
html = re.sub(silo_3_regex, r'\1\n            <div class="restricted-watermark">RESTRICTED</div>', html, flags=re.DOTALL)


# 4. Links: Map Repository cards to root directory "/0 Research Papers/"
html = html.replace('href="0%20Research%20Papers/', 'href="/0 Research Papers/')
html = html.replace('href="0 Research Papers/', 'href="/0 Research Papers/')

# 5. Operations Section: Fix clipping; Ensure 48px Somatic Hit-Box for all interactive elements.
html = re.sub(
    r'\.drawer-header\s*\{[^}]*\}',
    """.drawer-header {
      height: 5vh;
      min-height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9rem;
      color: var(--header-cyan);
      text-transform: uppercase;
      letter-spacing: 2px;
      cursor: pointer;
    }""", html)

# 6. Remove remaining animations DOM (pulse-core, pulse-aura, orbital-text, terminal)
# The CSS was disabled, but the user wants them fully removed.
html = re.sub(r'<div class="orbital-text">.*?</div>', '', html, flags=re.DOTALL)
html = re.sub(r'<div class="pulse-core"></div>', '', html)
html = re.sub(r'<div class="pulse-aura"></div>', '', html)
html = re.sub(r'<div class="terminal-container">.*?</div>', '', html, flags=re.DOTALL)

# Also remove them from the CSS just to be clean
html = re.sub(r'\.orbital-text\s*\{[^}]*\}', '', html)
html = re.sub(r'\.orbital-text\s*span\s*\{[^}]*\}', '', html)
html = re.sub(r'\.pulse-core\s*\{[^}]*\}', '', html)
html = re.sub(r'\.pulse-aura\s*\{[^}]*\}', '', html)
html = re.sub(r'\.terminal-container\s*\{[^}]*\}', '', html)
html = re.sub(r'\.terminal-line\s*\{[^}]*\}', '', html)
html = re.sub(r'\.terminal-line\s*span\s*\{[^}]*\}', '', html)


# Additional specific hit-box checks
html = re.sub(
    r'(button,\s*a\[download\],\s*\.nav-btn,\s*audio\s*\{[^}]*min-height:\s*)48px;',
    r'\g<1>48px; min-width: 48px;', html)

# Write modified HTML back to file
with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
