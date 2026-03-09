import os
import re
from bs4 import BeautifulSoup

# Define base template (index.html structure provided by user)
BASE_TEMPLATE = """<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{TITLE}</title>
  {META_TAGS}

  <link rel='icon' type='image/png' href='{REL_PATH}vnr-icon.png'>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap"
    rel="stylesheet">
  <style>
    :root {{
      --bg: #030303;
      --card: #0a0a0a;
      --text: #e0e0e0;
      --text-sub: #888;
      --accent: #40c0ff;
      --green: #22c55e;
      --red: #ef4444;
      --orange: #f97316;
      --cyan: #40c0ff;
      --border: rgba(64, 192, 255, 0.15);
    }}

    * {{
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }}

    body {{
      background: var(--bg);
      color: var(--text);
      font-family: 'Inter', sans-serif;
      line-height: 1.6;
      overflow-x: hidden;
    }}

    /* Scanline overlay */
    body::before {{
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: repeating-linear-gradient(0deg,
          transparent, transparent 2px,
          rgba(64, 192, 255, 0.012) 2px,
          rgba(64, 192, 255, 0.012) 4px);
      pointer-events: none;
      z-index: 9999;
    }}

    .container {{
      max-width: 1100px;
      margin: 0 auto;
      padding: 40px 24px 40px 140px;
    }}

    /* HEADER */
    .header {{
      text-align: center;
      margin-bottom: 48px;
      position: relative;
    }}

    .header .badge {{
      display: inline-block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.2em;
      color: var(--accent);
      background: rgba(64, 192, 255, 0.1);
      border: 1px solid rgba(64, 192, 255, 0.3);
      padding: 6px 18px;
      border-radius: 4px;
      margin-bottom: 20px;
      animation: pulse-badge 2s ease-in-out infinite;
    }}

    @keyframes pulse-badge {{
      0%,
      100% {{
        box-shadow: 0 0 0 0 rgba(64, 192, 255, 0.3);
      }}

      50% {{
        box-shadow: 0 0 20px 4px rgba(64, 192, 255, 0.15);
      }}
    }}

    .header h1 {{
      font-size: 42px;
      font-weight: 900;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }}

    .header h1 span {{
      background: linear-gradient(135deg, var(--accent), var(--cyan));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }}

    .header .subtitle {{
      font-size: 14px;
      color: var(--text-sub);
      font-family: 'JetBrains Mono', monospace;
    }}

    .header .scan-time {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--cyan);
      margin-top: 12px;
    }}

    /* STAT GRID */
    .stat-grid {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 40px;
    }}

    .stat-card {{
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 24px 16px;
      text-align: center;
      transition: all 0.3s ease;
    }}

    .stat-card:hover {{
      border-color: var(--accent);
      transform: translateY(-3px);
      box-shadow: 0 8px 32px rgba(64, 192, 255, 0.15);
    }}

    .stat-card .number {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 36px;
      font-weight: 800;
      margin-bottom: 4px;
    }}

    .stat-card .label {{
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-sub);
    }}

    .stat-card.critical .number {{ color: var(--accent); }}
    .stat-card.warning .number {{ color: var(--orange); }}
    .stat-card.info .number {{ color: var(--cyan); }}
    .stat-card.danger .number {{ color: var(--red); }}

    /* Forensic Alignment */
    .section {{
      padding-top: 32px;
      scroll-margin-top: 72px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      animation: fadeUp 0.6s ease-out both;
    }}

    @keyframes fadeUp {{
      from {{
        opacity: 0;
        transform: translateY(20px);
      }}

      to {{
        opacity: 1;
        transform: translateY(0);
      }}
    }}

    .section:first-child {{
      border-top: none;
    }}

    .section-header {{
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }}

    .section-tag {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.15em;
      color: var(--cyan);
      font-weight: 700;
      text-transform: uppercase;
    }}

    .section h2 {{
      font-size: 22px;
      font-weight: 700;
      color: #fff;
    }}

    p {{ margin-bottom: 20px; font-size: 15px; color: var(--text); line-height: 1.7; }}
    ul {{ margin-bottom: 20px; font-size: 15px; padding-left: 20px; color: var(--text); }}
    li {{ margin-bottom: 8px; }}
    a {{ color: var(--accent); text-decoration: none; }}
    a:hover {{ text-decoration: underline; }}

    /* Tables */
    .file-table, .data-table {{
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin: 24px 0;
    }}

    .file-table th, .data-table th {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-sub);
      text-align: left;
      padding: 12px 16px;
      border-bottom: 2px solid var(--border);
      background: rgba(64, 192, 255, 0.04);
    }}

    .file-table td, .data-table td {{
      padding: 12px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      vertical-align: top;
    }}

    .file-table tr:hover td, .data-table tr:hover td {{
      background: rgba(64, 192, 255, 0.04);
    }}

    /* Misc common elements */
    .terminal {{
      background: #0d1117;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      line-height: 1.8;
      overflow-x: auto;
      margin: 20px 0;
    }}
    .terminal .prompt {{ color: var(--green); }}
    .terminal .output {{ color: var(--text-sub); }}
    .terminal .hit {{ color: var(--accent); }}
    .terminal .warn {{ color: var(--orange); }}
    .terminal .crit {{ color: var(--red); font-weight: 700; }}

    /* FOOTER */
    .footer {{
      text-align: center;
      padding: 40px 0;
      border-top: 1px solid var(--border);
      margin-top: 40px;
    }}

    .footer .logo {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.2em;
      color: var(--text-sub);
    }}

    .footer .logo span {{
      background: linear-gradient(135deg, var(--accent), var(--cyan));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }}

    @media (max-width: 768px) {{
      .stat-grid {{
        grid-template-columns: repeat(2, 1fr);
      }}
      .header h1 {{
        font-size: 28px;
      }}
      .container {{ padding-left: 24px; padding-right: 24px; }}
    }}
  </style>
</head>

<body>
  <!-- NAV -->
  <nav
    style="position:fixed;top:0;left:0;right:0;z-index:1000;background:rgba(3,3,3,0.95);backdrop-filter:blur(12px);border-bottom:1px solid rgba(64,192,255,0.15);padding:0 24px;">
    <div
      style="max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:56px;">
      <a href="{REL_PATH}index.html" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
        <img src="{REL_PATH}vnr-logo.png" alt="VNR" style="height:44px;width:auto;" onerror="this.style.display='none'">
      </a>
      <div style="display:flex;gap:24px;font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:0.05em;">
        <a href="{REL_PATH}vnr-scan/index.html" style="color:var(--accent);font-weight:700;text-decoration:none;">VNR SCAN</a>
        <a href="{REL_PATH}overview/index.html" style="color:#d4d4d4;text-decoration:none;opacity:0.8;">What AI Platforms Hide</a>
        <a href="{REL_PATH}overview/index.html#research" style="color:#d4d4d4;text-decoration:none;opacity:0.8;">Research</a>
        <a href="{REL_PATH}suno-report/index.html" style="color:#d4d4d4;text-decoration:none;opacity:0.8;">Tracker Report</a>
        <a href="{REL_PATH}overview/index.html#engage" style="color:#d4d4d4;text-decoration:none;opacity:0.8;">Engage</a>
        <a href="{REL_PATH}overview/index.html#about" style="color:#d4d4d4;text-decoration:none;opacity:0.8;">About</a>
      </div>
    </div>
  </nav>

  <!-- SECTION NAV -->
  <style>
    #scan-nav {{
      position: fixed;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 999;
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-family: 'JetBrains Mono', monospace;
    }}

    #scan-nav .snav {{
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-sub);
      text-decoration: none;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.04em;
      transition: all 0.25s ease;
      background: transparent;
      border-left: 2px solid transparent;
    }}

    #scan-nav .snav:hover {{
      background: rgba(255, 255, 255, 0.04);
      color: #fff;
    }}

    #scan-nav .snav.active {{
      background: rgba(255, 255, 255, 0.06);
      border-left-color: var(--nav-color);
      color: #fff;
    }}

    #scan-nav .snav .dot {{
      width: 9px;
      height: 9px;
      border-radius: 50%;
      flex-shrink: 0;
      transition: box-shadow 0.3s;
    }}

    #scan-nav .snav.active .dot {{
      box-shadow: 0 0 8px 2px var(--nav-color);
    }}

    @media(max-width:900px) {{
      #scan-nav {{
        display: none !important;
      }}
    }}
  </style>
  <div id="scan-nav">
    {TOC_LINKS}
  </div>

  <div class="container" style="padding-top:72px;">

    {CONTENT}

    <!-- FOOTER -->
    <div class="footer">
      <div class="logo"><span>VOSS NEURAL RESEARCH</span></div>
      <div style="font-size:11px; color:var(--text-sub); margin-top:8px;">
        Document preserved for public record and forensic analysis.
      </div>
    </div>

  </div>
  <style>
    html {{
      scroll-behavior: smooth;
    }}

    .snav.active {{
      font-weight: 700 !important;
    }}
  </style>
  <script>
    (function () {{
      const navLinks = document.querySelectorAll('.snav');
      const sections = Array.from(navLinks).map(link => {{
        const href = link.getAttribute('href');
        if(!href || !href.startsWith('#')) return null;
        const id = href.slice(1);
        return {{
          id,
          el: document.getElementById(id),
          link
        }};
      }}).filter(s => s && s.el);

      function setActive(activeLink) {{
        navLinks.forEach(l => {{
          l.style.color = 'var(--text-sub)';
          l.style.borderLeftColor = 'transparent';
          l.classList.remove('active');
        }});
        if (activeLink) {{
          const color = activeLink.getAttribute('data-color') || 'var(--cyan)';
          activeLink.style.color = color;
          activeLink.style.borderLeftColor = color;
          activeLink.classList.add('active');
          // Update the CSS variable for the glow effect
          activeLink.style.setProperty('--nav-color', color);
        }}
      }}

      function onScroll() {{
        // Strike-zone offset: 80px from top provides the most natural 'snap'
        const scrollPosition = window.scrollY + 80;

        let currentSection = null;

        // Reverse find the section currently crossing the strike-zone
        for (let i = sections.length - 1; i >= 0; i--) {{
          const sectionTop = sections[i].el.getBoundingClientRect().top + window.scrollY;
          if (sectionTop <= scrollPosition) {{
            currentSection = sections[i];
            break;
          }}
        }}

        setActive(currentSection ? currentSection.link : null);
      }}

      // Smooth scroll and immediate active state toggle
      navLinks.forEach(link => {{
        link.addEventListener('click', function (e) {{
          e.preventDefault();
          const targetId = this.getAttribute('href').slice(1);
          const targetEl = document.getElementById(targetId);

          if (targetEl) {{
            const absoluteTop = targetEl.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({{
              top: absoluteTop - 72, // Surgical offset for header (56px nav + 16px breath)
              behavior: 'smooth'
            }});
            setActive(this);
          }}
        }});
      }});

      // Passive listener for performance
      window.addEventListener('scroll', onScroll, {{ passive: true }});
      // Initial check
      onScroll();
    }})();
  </script>
</body>
</html>
"""

def extract_meta_tags(soup):
    tags = []
    for meta in soup.find_all('meta'):
        if not meta.get('charset') and meta.get('name') != 'viewport':
            tags.append(str(meta))
    for script in soup.head.find_all('script') if soup.head else []:
        tags.append(str(script))
    return '\n  '.join(tags)

def extract_content_and_build_toc(soup):
    colors = ['#40c0ff', '#ef4444', '#f97316', '#eab308', '#22c55e', '#2563eb', '#db2777', '#a855f7']
    color_idx = 0
    main_content = ""
    toc_links = ""

    header = soup.find('div', class_='header') or soup.find('h1')
    if header:
        if header.name == 'h1':
            header_str = str(header)
        else:
            header_str = str(header)
        main_content += header_str + "\\n\\n"
        if header.name == 'div':
            header.extract()
            
    sections = soup.find_all(['h2', 'section', 'div'], class_=['section', 'article-section'])
    if not sections:
        sections = soup.find_all('h2')
        
    for i, section in enumerate(sections):
        section_id = section.get('id')
        if not section_id:
            section_id = f"section-{i}"
            section['id'] = section_id

        if section.name == 'h2':
            content_nodes = []
            curr = section.next_sibling
            while curr and getattr(curr, 'name', '') not in ['h2', 'h1', 'footer']:
                content_nodes.append(curr)
                curr = curr.next_sibling
                
            section_wrapper = BeautifulSoup(f'<div class="section" id="{section_id}"></div>', 'html.parser').div
            section_wrapper.append(section.extract())
            for node in content_nodes:
                 section_wrapper.append(node.extract())
            section = section_wrapper
            
        title_tag = section.find('h2') or section.find('h3')
        if title_tag:
             title = title_tag.text.strip()
        else:
             # Look for section-tag
             tag = section.find(class_='section-tag')
             title = tag.text.strip() if tag else f"Section {i+1}"
        
        color = colors[color_idx % len(colors)]
        color_idx += 1
        
        toc_links += f"""<a href="#{section_id}" class="snav" data-color="{color}" style="--nav-color:{color};">
      <span class="dot" style="background:{color};"></span>{title}</a>\\n    """

        for table in section.find_all('table'):
            classes = table.get('class', [])
            if 'data-table' not in classes and 'file-table' not in classes:
                table['class'] = classes + ['data-table']
            
        main_content += str(section) + "\\n"
        
    if not main_content:
       body_content = soup.body
       if body_content:
           for s in body_content.find_all('script'): s.extract()
           main_content = ''.join(str(c) for c in body_content.contents)
           
    return main_content, toc_links

def process_file(file_path, rel_path):
    print(f"Standardizing: {file_path}")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            html = f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return

    soup = BeautifulSoup(html, 'html.parser')
    title = soup.title.string if soup.title else "VNR Article"
    meta_tags = extract_meta_tags(soup)
    content, toc_links = extract_content_and_build_toc(soup)
    
    if not toc_links:
        toc_links = '<a href="#top" class="snav" data-color="#40c0ff" style="--nav-color:#40c0ff;"><span class="dot" style="background:#40c0ff;"></span>Article Overview</a>'

    new_html = BASE_TEMPLATE.replace('{TITLE}', title)
    new_html = new_html.replace('{META_TAGS}', meta_tags)
    new_html = new_html.replace('{REL_PATH}', rel_path)
    new_html = new_html.replace('{TOC_LINKS}', toc_links)
    new_html = new_html.replace('{CONTENT}', content)

    with open(file_path, 'w', encoding='utf-8') as f:
         f.write(new_html)

if __name__ == "__main__":
    base_dir = r"C:\Users\ovjup\Dropbox\Voss Neural Research LLC\01_VNR\Website\vossneuralresearch\research"
    articles = [
        "is-suno-safe-commercial",
        "ai-music-sovereignty-audit-2026",
        "suno-interactive-chat-2026",
        "velvet-casino"
    ]

    for article in articles:
        article_path = os.path.join(base_dir, article, 'index.html')
        if os.path.exists(article_path):
            process_file(article_path, "../../")
            
    # Also standardize the suno-report since it's an article-like page
    report_path = r"C:\Users\ovjup\Dropbox\Voss Neural Research LLC\01_VNR\Website\vossneuralresearch\suno-report\index.html"
    if os.path.exists(report_path):
        process_file(report_path, "../")

    print("\\nHomogenization Complete. All articles now share the strict VNR SCAN template.")
