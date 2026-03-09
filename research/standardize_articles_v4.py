import os
import re
from bs4 import BeautifulSoup

# Define base template (index.html structure provided by user with general content containers)
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
    
    .header-badge {{
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
      max-width: 800px;
      margin: 0 auto;
    }}

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

    .section-tag {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.15em;
      color: var(--cyan);
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 8px;
    }}

    .section h2 {{
      font-size: 22px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 16px;
    }}
    
    .section h3 {{
        font-size: 18px;
        font-weight: 600;
        color: #fff;
        margin: 24px 0 12px;
    }}

    /* Standard Article Content Formatting */
    .content-block {{
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 24px;
        margin-bottom: 32px;
    }}

    p {{ margin-bottom: 20px; font-size: 15px; color: var(--text); line-height: 1.7; }}
    ul, ol {{ margin-bottom: 20px; font-size: 15px; padding-left: 20px; color: var(--text); }}
    li {{ margin-bottom: 8px; line-height: 1.6; }}
    a {{ color: var(--accent); text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 0.2s; }}
    a:hover {{ border-bottom-color: var(--accent); }}

    /* Highlight Boxes */
    .box {{
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 32px;
    }}
    .box-info {{
      background: rgba(64, 192, 255, 0.06);
      border: 1px solid rgba(64, 192, 255, 0.25);
      border-left: 4px solid var(--cyan);
    }}
    .box-warning {{
      background: rgba(249, 115, 22, 0.06);
      border: 1px solid rgba(249, 115, 22, 0.25);
      border-left: 4px solid var(--orange);
    }}
    .box-critical {{
      background: rgba(239, 68, 68, 0.06);
      border: 1px solid rgba(239, 68, 68, 0.25);
      border-left: 4px solid var(--red);
    }}
    .box-success {{
      background: rgba(34, 197, 94, 0.06);
      border: 1px solid rgba(34, 197, 94, 0.25);
      border-left: 4px solid var(--green);
    }}

    /* Tables */
    .data-table {{
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin: 24px 0;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
    }}

    .data-table th {{
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

    .data-table td {{
      padding: 12px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      vertical-align: top;
      color: var(--text);
    }}

    .data-table tr:hover td {{
      background: rgba(64, 192, 255, 0.04);
    }}
    
    .data-table tr:last-child td {{
        border-bottom: none;
    }}

    /* Code & Terminal */
    .terminal, pre {{
      background: #0d1117;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      line-height: 1.8;
      overflow-x: auto;
      margin: 20px 0;
      color: var(--text-sub);
    }}
    
    code {{
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        background: rgba(255, 255, 255, 0.08);
        padding: 2px 6px;
        border-radius: 4px;
        color: var(--cyan);
    }}

    /* Images */
    .article-image {{
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        border: 1px solid var(--border);
        box-shadow: 0 12px 40px rgba(0,0,0,0.5);
        margin: 24px 0;
    }}

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
        <span style="font-family:'JetBrains Mono', monospace; font-size:12px; font-weight:700; letter-spacing:0.1em; background:linear-gradient(135deg, var(--accent), var(--cyan)); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">VNR</span>
      </a>
      <div style="display:flex;gap:24px;font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:0.05em;">
        <a href="{REL_PATH}vnr-scan/index.html" style="color:#d4d4d4;text-decoration:none;opacity:0.8;">VNR SCAN</a>
        <a href="{REL_PATH}overview/index.html" style="color:#d4d4d4;text-decoration:none;opacity:0.8;">What AI Platforms Hide</a>
        <a href="{REL_PATH}research/index.html" style="color:var(--accent);font-weight:700;text-decoration:none;">Research</a>
        <a href="{REL_PATH}suno-report/index.html" style="color:#d4d4d4;text-decoration:none;opacity:0.8;">Tracker Report</a>
        <a href="{REL_PATH}overview/index.html#engage" style="color:#d4d4d4;text-decoration:none;opacity:0.8;">Engage</a>
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
    {HEADER_HTML}

    {CONTENT}

    <!-- FOOTER -->
    <div class="footer">
      <div class="logo"><span>VOSS NEURAL RESEARCH</span> — Article Database</div>
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

def build_header(soup, title):
    # Try to find an existing h1
    h1 = soup.find('h1')
    
    subtitle = ""
    # Look for a subtitle in a p next to h1 or in a .subtitle class
    if h1 and h1.find_next_sibling('p'):
        subtitle = h1.find_next_sibling('p').text.strip()
        h1.find_next_sibling('p').extract() # Remove from main flow
    
    if h1:
        # Extract title parts
        parts = h1.text.split('—')
        if len(parts) > 1:
            main_title = f"{parts[0].strip()} <span>{parts[1].strip()}</span>"
        else:
            main_title = f"{h1.text.strip()}"
        h1.extract() # Remove from main flow
    else:
        main_title = title

    return f"""
    <div class="header">
      <div class="header-badge">VNR RESEARCH RECORD</div>
      <h1>{main_title}</h1>
      {f'<div class="subtitle">{subtitle}</div>' if subtitle else ''}
    </div>
"""

def clean_element(element):
    """Recursively clean up container wrappers that aren't needed"""
    if not element: return ""
    
    # Process code blocks
    for pre in element.find_all('pre'):
        pre['class'] = ['terminal']
        
    for code in element.find_all('code'):
        if not 'terminal' in code.parent.get('class', []):
            pass # Inline code styling handles this
            
    # Process tables
    for table in element.find_all('table'):
        table['class'] = ['data-table']
        
    # Process images
    for img in element.find_all('img'):
        img['class'] = ['article-image']
        
    # Convert div containers to content-block if they look like discrete items
    for div in element.find_all('div', recursive=False):
        # Only class-less divs or old content divs
        if not div.get('class') or 'content' in div.get('class', []):
            div['class'] = ['content-block']
            
    return "".join(str(c) for c in element.contents)

def extract_content_and_build_toc(soup):
    colors = ['#40c0ff', '#ef4444', '#f97316', '#eab308', '#22c55e', '#2563eb', '#db2777', '#a855f7']
    color_idx = 0
    main_content = ""
    toc_links = ""

    # Clear out any old headers, navs, footers so we only parse remaining content
    for nav in soup.find_all('nav'): nav.extract()
    for footer in soup.find_all('footer'): footer.extract()
    for footer in soup.find_all('div', class_='footer'): footer.extract()
    
    # Also strip script tags from body
    if soup.body:
        for script in soup.body.find_all('script'): script.extract()

    # Find sections
    sections = soup.find_all(['h2', 'section', 'div'], class_=['section', 'article-section'])
    
    # If no structural sections exist, let's build them from H2s
    if not sections:
        h2s = soup.find_all('h2')
        if not h2s:
            # No h2s at all, wrap the whole body in one section
            if soup.body:
                main_content = f"""
                <div class="section" id="article-body">
                    <div class="content-block">
                        {clean_element(soup.body)}
                    </div>
                </div>"""
            return main_content, ""
            
        # We have H2s, process them
        for i, h2 in enumerate(h2s):
            section_id = h2.get('id', f"section-{i}")
            title = h2.text.strip()
            
            # Build TOC
            color = colors[color_idx % len(colors)]
            color_idx += 1
            toc_links += f"""<a href="#{section_id}" class="snav" data-color="{color}" style="--nav-color:{color};">
          <span class="dot" style="background:{color};"></span>{title}</a>\\n    """
            
            # Gather content until next h2
            content_nodes = []
            curr = h2.next_sibling
            while curr and getattr(curr, 'name', '') not in ['h2', 'h1', 'footer']:
                content_nodes.append(curr.extract())
                curr = h2.next_sibling
            
            # Wrap content
            content_html = ""
            for node in content_nodes:
                content_html += str(node)
                
            main_content += f"""
            <div class="section" id="{section_id}">
                <div class="section-tag" style="color:{color};">Part {i+1}</div>
                <h2>{title}</h2>
                <div class="content-block">
                    {content_html}
                </div>
            </div>
            """
            
    else:
        # We found explicit sections
        for i, section in enumerate(sections):
            section_id = section.get('id', f"section-{i}")
            
            title_tag = section.find('h2') or section.find('h3')
            title = title_tag.text.strip() if title_tag else f"Section {i+1}"
            
            color = colors[color_idx % len(colors)]
            color_idx += 1
            
            toc_links += f"""<a href="#{section_id}" class="snav" data-color="{color}" style="--nav-color:{color};">
          <span class="dot" style="background:{color};"></span>{title}</a>\\n    """
            
            # Update the section formatting to match VNR SCAN style
            section['class'] = ['section']
            section['id'] = section_id
            
            if not section.find(class_='section-tag'):
                tag = BeautifulSoup(f'<div class="section-tag" style="color:{color};">Part {i+1}</div>', 'html.parser')
                if title_tag:
                    title_tag.insert_before(tag)
                else:
                    section.insert(0, tag)
            else:
                 tag = section.find(class_='section-tag')
                 tag['style'] = f"color:{color};"
                
            # If there's no content-block, wrap the non-header bits
            kids = []
            for child in section.contents:
                if getattr(child, 'name', '') not in ['h2', 'h3', 'div'] or (getattr(child, 'name', '') == 'div' and 'section-tag' not in getattr(child, 'get', lambda x, y: [])('class', [])):
                    kids.append(child)
            
            if kids:
                block = BeautifulSoup('<div class="content-block"></div>', 'html.parser').div
                for child in list(kids):
                   child_copy = child.extract()
                   block.append(child_copy)
                section.append(block)

            main_content += str(section) + "\\n"
           
    return main_content, toc_links

def process_file(file_path, rel_path, is_suno_report=False):
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
    header_html = build_header(soup, title)
    content, toc_links = extract_content_and_build_toc(soup)
    
    if not toc_links:
        toc_links = '<a href="#article-body" class="snav" data-color="#40c0ff" style="--nav-color:#40c0ff;"><span class="dot" style="background:#40c0ff;"></span>Article Overview</a>'

    new_html = BASE_TEMPLATE.replace('{TITLE}', title)
    new_html = new_html.replace('{META_TAGS}', meta_tags)
    new_html = new_html.replace('{REL_PATH}', rel_path)
    new_html = new_html.replace('{HEADER_HTML}', header_html)
    new_html = new_html.replace('{TOC_LINKS}', toc_links)
    new_html = new_html.replace('{CONTENT}', content)
    
    # Fix the active reporting links based on what page this is
    if is_suno_report:
        new_html = new_html.replace('<a href="{REL_PATH}suno-report/index.html" style="color:#d4d4d4;text-decoration:none;opacity:0.8;">Tracker Report</a>', '<a href="{REL_PATH}suno-report/index.html" style="color:var(--accent);font-weight:700;text-decoration:none;">Tracker Report</a>')
        new_html = new_html.replace('<a href="{REL_PATH}vnr-scan/index.html" style="color:var(--accent);font-weight:700;text-decoration:none;">VNR SCAN</a>', '<a href="{REL_PATH}vnr-scan/index.html" style="color:#d4d4d4;text-decoration:none;opacity:0.8;">VNR SCAN</a>')
        
        # Override header for Suno Report to match style
        new_html = new_html.replace('VNR RESEARCH RECORD', 'FORENSIC AUDIT')

    with open(file_path, 'w', encoding='utf-8') as f:
         f.write(new_html)

if __name__ == "__main__":
    base_dir = r"C:\Users\ovjup\Dropbox\Voss Neural Research LLC\01_VNR\Website\vossneuralresearch\research"
    # Testing on a subset to review
    articles = [
        "is-suno-safe-commercial",
        "ai-music-sovereignty-audit-2026",
    ]

    for article in articles:
        article_path = os.path.join(base_dir, article, 'index.html')
        if os.path.exists(article_path):
            process_file(article_path, "../../")
            
    # Standardize the suno-report as well
    report_path = r"C:\Users\ovjup\Dropbox\Voss Neural Research LLC\01_VNR\Website\vossneuralresearch\suno-report\index.html"
    if os.path.exists(report_path):
        process_file(report_path, "../", is_suno_report=True)

    print("\\nHomogenization Script v4 generated. Ready to run.")
