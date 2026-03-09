import glob
import os
import re
from bs4 import BeautifulSoup

base_dir = "C:/Users/ovjup/Dropbox/Voss Neural Research LLC/01_VNR/Website/vossneuralresearch"

# --- THE CORRECT HEADER AND FOOTER HTML BLOCKS GATHERED FROM INDEX.HTML ---
CORRECT_TOP_NAV_HTML = """
  <nav
    style="position:fixed;top:0;left:0;right:0;z-index:1000;background:rgba(3,3,3,0.95);backdrop-filter:blur(12px);border-bottom:1px solid rgba(64,192,255,0.15);padding:0 24px;">
    <div
      style="max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:56px;">
      <a href="/" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
        <img src="/vnr-logo.png" alt="VNR" style="height:44px;width:auto;">
      </a>
      <div style="display:flex;gap:24px;font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:0.05em;">
        <a href="/" style="color:var(--accent);font-weight:700;text-decoration:none;">VNR SCAN</a>
        <a href="/overview/" style="color:#d4d4d4;text-decoration:none;opacity:0.8;">What AI Platforms Hide</a>
        <a href="/overview/#research" style="color:#d4d4d4;text-decoration:none;opacity:0.8;">Research</a>
        <a href="/suno-report/" style="color:#d4d4d4;text-decoration:none;opacity:0.8;">Tracker Report</a>
        <a href="/overview/#engage" style="color:#d4d4d4;text-decoration:none;opacity:0.8;">Engage</a>
        <a href="/overview/#about" style="color:#d4d4d4;text-decoration:none;opacity:0.8;">About</a>
      </div>
    </div>
  </nav>
"""

SUBPAGE_CSS = """
        /* USER STANDARDIZED VNR SUB-PAGE TEMPLATE CSS */
        :root {
            --bg: #030303;
            --card: #0a0a0a;
            --text: #e0e0e0;
            --text-sub: #a0a0a0; /* Increased contrast for readability */
            --accent: #40c0ff;
            --border: rgba(64, 192, 255, 0.15);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: var(--bg) !important; color: var(--text) !important; font-family: 'Inter', sans-serif !important; line-height: 1.7 !important; }

        /* FIXED SIDEBAR TOC */
        #scan-nav {
            position: fixed !important; left: 20px !important; top: 50% !important; transform: translateY(-50%) !important;
            z-index: 1000 !important; display: flex !important; flex-direction: column !important; gap: 8px !important;
            font-family: 'JetBrains Mono', monospace !important; width: 160px !important;
        }

        .snav {
            display: flex !important; align-items: center !important; gap: 10px !important; color: var(--text-sub) !important;
            text-decoration: none !important; font-size: 11px !important; font-weight: 600 !important;
            padding: 6px !important; transition: all 0.2s !important; border-left: 2px solid transparent !important;
        }

        .snav.active { color: #fff !important; border-left-color: var(--nav-color) !important; background: rgba(255,255,255,0.05) !important; }
        .snav .dot { width: 8px !important; height: 8px !important; border-radius: 50% !important; flex-shrink: 0 !important; }
        .snav.active .dot { box-shadow: 0 0 8px var(--nav-color) !important; }

        /* MAIN CONTENT AREA - Padding avoids overlap with TOC */
        .container, .p { max-width: 900px !important; margin: 0 auto !important; padding: 120px 40px 80px 200px !important; }

        .header { margin-bottom: 60px !important; border-bottom: 1px solid var(--border) !important; padding-bottom: 20px !important; }
        .header h1 { font-size: 36px !important; font-weight: 900 !important; color: #fff !important; margin-bottom: 10px !important; }
        .header .meta { font-family: 'JetBrains Mono', monospace !important; font-size: 12px !important; color: var(--accent) !important; }

        /* READABILITY BLOCKS */
        .section { padding: 40px 0 !important; scroll-margin-top: 100px !important; }
        h2 { scroll-margin-top: 100px !important; }
        
        .section h2, article h2, .container h2, .content-block h2 { 
            font-size: 24px !important; color: #fff !important; margin-bottom: 20px !important; 
            border-left: 4px solid var(--accent) !important; padding-left: 15px !important; 
        }
        
        p { margin-bottom: 20px !important; font-size: 16px !important; color: var(--text) !important; }
        
        /* FORENSIC HIGHLIGHT BOXES */
        .evidence-box, .eb, .risk-box, .mechanism-card, .stat-card, .rc {
            background: var(--card) !important; border: 1px solid var(--border) !important;
            padding: 25px !important; border-radius: 8px !important; margin: 20px 0 !important;
        }

        .terminal, .term {
            background: #0d1117 !important; font-family: 'JetBrains Mono', monospace !important;
            padding: 15px !important; border-radius: 5px !important; font-size: 13px !important; color: #88eeff !important;
            overflow-x: auto !important; border: 1px solid #333 !important;
        }

        @media (max-width: 900px) { #scan-nav { display: none !important; } .container, .p { padding: 100px 20px !important; } }
"""

SUBPAGE_JS = """
        // Restored TOC JavaScript
        const navLinks = document.querySelectorAll('.snav');
        const sections = document.querySelectorAll('.section, h2[id]');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= sectionTop - 120) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (current && link.getAttribute('href') && link.getAttribute('href').includes(current)) {
                    link.classList.add('active');
                }
            });
        });
"""

COLORS = ["#40c0ff", "#ef4444", "#f97316", "#eab308", "#22c55e", "#2563eb", "#db2777", "#a855f7"]

# 1. Extract Footer from index.html (We hardcoded the top_nav above for absolute precision)
with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as f:
    soup_truth = BeautifulSoup(f, "html.parser")
    
footer = soup_truth.find("footer")
top_nav_soup = BeautifulSoup(CORRECT_TOP_NAV_HTML, "html.parser").find("nav")

font_link = None
for link in soup_truth.find_all("link"):
    if "fonts.googleapis.com" in link.get("href", ""):
        font_link = link
        break

files_to_update = glob.glob(os.path.join(base_dir, "research", "*", "index.html"))
files_to_update.append(os.path.join(base_dir, "suno-report", "index.html"))
files_to_update.append(os.path.join(base_dir, "vnr-scan", "index.html"))
files_to_update.append(os.path.join(base_dir, "overmind", "index.html"))

for filepath in files_to_update:
    if not os.path.exists(filepath):
        continue
    if os.path.abspath(filepath) == os.path.abspath(os.path.join(base_dir, "index.html")):
        continue
        
    print(f"Applying VNR Template + Precise Logo to: {filepath}")
    with open(filepath, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")

    # Clean old elements we are replacing
    for old in soup.find_all("nav"): old.decompose()
    for old in soup.find_all("footer"): old.decompose()
    
    if soup.find(id="vnr-template-css"):
        soup.find(id="vnr-template-css").decompose()
    if soup.find(id="vnr-toc-js"):
        soup.find(id="vnr-toc-js").decompose()
        
    # Inject Top Nav and Footer
    soup.body.insert(0, BeautifulSoup(str(top_nav_soup), "html.parser").findChild())
    if footer:
        soup.body.append(BeautifulSoup(str(footer), "html.parser").findChild())

    # Add Fonts
    existing_font_links = [l for l in soup.find_all("link") if "fonts.googleapis.com" in l.get("href", "")]
    for e in existing_font_links: e.decompose()
    
    # We use the template's specified fonts explicitly
    template_font_link = BeautifulSoup('<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">', "html.parser").findChild()
    if soup.head:
        soup.head.append(template_font_link)
        
    # Inject Template CSS OVERRIDING ALL OTHERS AT THE END
    style_tag = soup.new_tag("style", id="vnr-template-css")
    style_tag.string = SUBPAGE_CSS
    if soup.head:
        soup.head.append(style_tag)

    # Generate TOC (Side Nav)
    h2s = soup.find_all("h2")
    nav_links = []
    
    for i, h2 in enumerate(h2s):
        if not h2.get("id"):
            base_id = re.sub(r'[^a-z0-9]+', '-', h2.get_text().lower()).strip('-')
            if not base_id: base_id = f"section-{i}"
            h2["id"] = base_id
            
        color = COLORS[i % len(COLORS)]
        text = h2.get_text().strip()
        nav_links.append(f'<a href="#{h2["id"]}" class="snav" data-color="{color}" style="--nav-color:{color};"><span class="dot" style="background:{color};"></span>{text}</a>')

    # Check if we have .container or .p wrapper already
    body_container = soup.find("div", class_=lambda c: c and ("container" in c or c == "p"))
    # No emergency wrapping needed - the .p class CSS will handle it

    if nav_links:
        nav_html = f'<nav id="scan-nav">\n' + '\n'.join(nav_links) + '\n</nav>'
        nav_soup = BeautifulSoup(nav_html, "html.parser")
        
        # Place TOC immediately after top_nav
        soup.body.insert(1, BeautifulSoup(str(nav_soup), "html.parser").findChild())

    # Inject TOC JS
    js_tag = soup.new_tag("script", id="vnr-toc-js")
    js_tag.string = SUBPAGE_JS
    soup.body.append(js_tag)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(str(soup).replace("&lt;", "<").replace("&gt;", ">"))
        
print("VNR Sub-Page Template applied + Cropped Logo Nav embedded.")
