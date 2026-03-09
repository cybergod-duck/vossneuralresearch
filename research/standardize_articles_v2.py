import os
import re
from bs4 import BeautifulSoup

# Define base template (index.html structure)
BASE_TEMPLATE = """<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{TITLE}</title>
    {META_TAGS}

    <link rel='icon' type='image/png' href='{REL_PATH}vnr-icon.png'>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
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

        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; line-height: 1.6; overflow-x: hidden; }}

        /* Scanline overlay */
        body::before {{
            content: ''; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(64, 192, 255, 0.012) 2px, rgba(64, 192, 255, 0.012) 4px);
            pointer-events: none; z-index: 9999;
        }}

        /* Navbar Layout */
        .navbar {{
            display: flex; justify-content: space-between; align-items: center; padding: 16px 32px;
            background: rgba(3, 3, 3, 0.85); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border);
            position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
        }}
        .navbar-brand {{
            display: flex; align-items: center; gap: 12px; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; letter-spacing: 0.1em; color: #fff; text-decoration: none;
        }}
        .navbar-brand img {{ height: 24px; width: auto; }}
        .navbar-brand span {{ background: linear-gradient(135deg, var(--accent), var(--cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }}
        .nav-links {{ display: flex; gap: 24px; }}
        .nav-links a {{ font-family: 'JetBrains Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-sub); text-decoration: none; transition: color 0.2s; }}
        .nav-links a:hover {{ color: #fff; }}

        .container {{ display: flex; max-width: 1400px; margin: 0 auto; padding-top: 72px; min-height: 100vh; }}

        /* Left Sidebar: Extracted TOC */
        .sidebar {{
            width: 250px; flex-shrink: 0; padding: 40px 24px; position: sticky; top: 72px; height: calc(100vh - 72px); overflow-y: auto;
        }}
        .snav {{
            display: block; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-sub);
            text-decoration: none; padding: 8px 12px; margin-bottom: 8px; border-left: 2px solid transparent; transition: all 0.2s;
        }}
        .snav:hover {{ color: #fff; background: rgba(255, 255, 255, 0.02); }}
        .snav.active {{ font-weight: 700 !important; }}

        /* Main Content */
        .main-content {{ flex-grow: 1; padding: 40px 48px; max-width: 900px; }}

        /* Extracted Typography & Elements */
        h1 {{ font-size: 42px; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 24px; line-height: 1.1; }}
        h2 {{ font-size: 24px; font-weight: 700; margin: 40px 0 20px; color: #fff; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.06); }}
        h3 {{ font-size: 18px; font-weight: 600; margin: 32px 0 16px; color: #e0e0e0; }}
        p {{ margin-bottom: 20px; font-size: 15px; color: var(--text); line-height: 1.7; }}
        a {{ color: var(--accent); text-decoration: none; }}
        a:hover {{ text-decoration: underline; }}
        
        .section-tag {{
            font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.15em; color: var(--cyan); font-weight: 700; text-transform: uppercase; margin-bottom: 8px;
        }}
        .section {{ scroll-margin-top: 100px; animation: fadeUp 0.6s ease-out both; }}

        /* Tables & Data */
        .data-table {{ width: 100%; border-collapse: collapse; font-size: 13px; margin: 24px 0; background: var(--card); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }}
        .data-table th {{ font-family: 'JetBrains Mono', monospace; font-size: 10px; text-transform: uppercase; text-align: left; padding: 12px 16px; border-bottom: 2px solid var(--border); background: rgba(64,192,255,0.04); color: var(--text-sub); }}
        .data-table td {{ padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: top; }}
        .data-table tr:last-child td {{ border-bottom: none; }}
        
        /* Utility Classes */
        .terminal {{ background: #0d1117; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 20px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.8; overflow-x: auto; margin: 20px 0; }}
        .box-warning {{ background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.25); border-left: 4px solid var(--red); border-radius: 8px; padding: 24px; margin: 24px 0; }}
        .box-info {{ background: rgba(64,192,255,0.06); border: 1px solid rgba(64,192,255,0.25); border-left: 4px solid var(--cyan); border-radius: 8px; padding: 24px; margin: 24px 0; }}
        .box-success {{ background: rgba(34,197,94,0.06); border: 1px solid rgba(34,197,94,0.25); border-left: 4px solid var(--green); border-radius: 8px; padding: 24px; margin: 24px 0; }}

        @keyframes fadeUp {{ from {{ opacity: 0; transform: translateY(20px); }} to {{ opacity: 1; transform: translateY(0); }} }}

        /* Footer */
        .footer {{ padding: 32px 0; border-top: 1px solid rgba(255,255,255,0.06); margin-top: 60px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-sub); }}
    </style>
</head>

<body>
    <!-- Navigation Bar -->
    <nav class="navbar">
        <a href="{REL_PATH}index.html" class="navbar-brand">
            <img src="{REL_PATH}vnr-logo.png" alt="VNR Logo" onerror="this.style.display='none'">
            <span>VOSS NEURAL RESEARCH</span>
        </a>
        <div class="nav-links">
            <a href="{REL_PATH}research/index.html">Research</a>
            <a href="{REL_PATH}suno-report/index.html">Tracker Report</a>
            <a href="{REL_PATH}vnr-scan/index.html">VNR SCAN</a>
        </div>
    </nav>

    <div class="container">
        <!-- Sidebar Navigation (Auto-generated TOC) -->
        <aside class="sidebar">
            {TOC_LINKS}
        </aside>

        <!-- Main Content Area -->
        <main class="main-content">
            {CONTENT}
            
            <div class="footer">
                <div>VOSS NEURAL RESEARCH — Article Database</div>
                <div style="margin-top: 8px;">Document preserved for public record and forensic analysis.</div>
            </div>
        </main>
    </div>

    <!-- Active Navigation Script -->
    <script>
        (function () {{
            const navLinks = document.querySelectorAll('.snav');
            const sections = Array.from(navLinks).map(link => {{
                const href = link.getAttribute('href');
                if(!href || !href.startsWith('#')) return null;
                const id = href.slice(1);
                return {{ id, el: document.getElementById(id), link }};
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
                }}
            }}

            function onScroll() {{
                const scrollPosition = window.scrollY + 120;
                let currentSection = null;
                for (let i = sections.length - 1; i >= 0; i--) {{
                    const sectionTop = sections[i].el.getBoundingClientRect().top + window.scrollY;
                    if (sectionTop <= scrollPosition) {{
                        currentSection = sections[i];
                        break;
                    }}
                }}
                setActive(currentSection ? currentSection.link : null);
            }}

            navLinks.forEach(link => {{
                link.addEventListener('click', function (e) {{
                    e.preventDefault();
                    const targetEl = document.getElementById(this.getAttribute('href').slice(1));
                    if (targetEl) {{
                        const absoluteTop = targetEl.getBoundingClientRect().top + window.scrollY;
                        window.scrollTo({{ top: absoluteTop - 100, behavior: 'smooth' }});
                        setActive(this);
                    }}
                }});
            }});

            window.addEventListener('scroll', onScroll, {{ passive: true }});
            onScroll();
        }})();
    </script>
</body>
</html>
"""

def extract_meta_tags(soup):
    tags = []
    # Find all meta tags that are not viewport or charset (which are already in the template)
    for meta in soup.find_all('meta'):
        if not meta.get('charset') and meta.get('name') != 'viewport':
            tags.append(str(meta))
            
    # Include script tags in head (like application/ld+json)
    for script in soup.head.find_all('script') if soup.head else []:
        tags.append(str(script))
        
    return '\n    '.join(tags)

def extract_content_and_build_toc(soup):
    colors = ['var(--cyan)', 'var(--red)', 'var(--orange)', 'var(--green)', '#a855f7', '#db2777']
    color_idx = 0
    
    # Try to find exactly what to extract as content
    main_content = ""
    toc_links = ""
    
    # First, let's extract the header/title if it exists
    header = soup.find('div', class_='header') or soup.find('h1')
    if header:
        # Wrap raw h1 if needed
        if header.name == 'h1':
            header_str = str(header)
        else:
            header_str = str(header)
        main_content += header_str + "\\n\\n"
        
        # If it was a div.header, remove it so we don't process its content twice
        if header.name == 'div':
            header.extract()
            
    # Now find all logic sections for TOC
    sections = soup.find_all(['h2', 'section', 'div'], class_=['section', 'article-section'])
    
    # If no explicit sections with classes, just find h2s
    if not sections:
        sections = soup.find_all('h2')
        
    for i, section in enumerate(sections):
        section_id = section.get('id')
        if not section_id:
            section_id = f"section-{i}"
            section['id'] = section_id

        # Wrap in section div if it's just an h2
        if section.name == 'h2':
            # Fast forward to next h2 to get content
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
            
        # Add to TOC
        title_tag = section.find('h2') or section.find('h3')
        title = title_tag.text.strip() if title_tag else f"Section {i+1}"
        
        # Add color
        color = colors[color_idx % len(colors)]
        color_idx += 1
        
        toc_links += f"""<a href="#{section_id}" class="snav" data-color="{color}">
                <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:{color}; margin-right:8px; opacity:0.7;"></span>
                {title}
            </a>\\n            """

        # Update styling inside the section for standard classes
        # Convert any old tables to data-tables
        for table in section.find_all('table'):
            table['class'] = table.get('class', []) + ['data-table']
            
        main_content += str(section) + "\\n"
        
        
    # If no sections at all, just grab body
    if not main_content:
       body_content = soup.body
       if body_content:
           # clear scripts
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

    # Get Title
    title = soup.title.string if soup.title else "VNR Article"

    # Get Meta Tags
    meta_tags = extract_meta_tags(soup)

    # Extract Content and TOC
    content, toc_links = extract_content_and_build_toc(soup)
    
    # If no TOC links were generated, generate a default one
    if not toc_links:
        toc_links = '<a href="#top" class="snav" data-color="var(--cyan)">Article Overview</a>'

    # Build new HTML
    new_html = BASE_TEMPLATE.replace('{TITLE}', title)
    new_html = new_html.replace('{META_TAGS}', meta_tags)
    new_html = new_html.replace('{REL_PATH}', rel_path)
    new_html = new_html.replace('{TOC_LINKS}', toc_links)
    new_html = new_html.replace('{CONTENT}', content)

    # Write the new content to the file
    with open(file_path, 'w', encoding='utf-8') as f:
         f.write(new_html)

if __name__ == "__main__":
    base_dir = r"C:\Users\ovjup\Dropbox\Voss Neural Research LLC\01_VNR\Website\vossneuralresearch\research"
    articles = [
        "is-suno-safe-commercial",
        "suno-privacy-audit-2026",
        "suno-vs-vnr-scan",
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

    print("\\nHomogenization Complete. All articles now share the homepage template.")
