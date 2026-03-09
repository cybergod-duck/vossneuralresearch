"""
VNR Article Standardizer v2 — Regex-based (no BeautifulSoup)
Applies shared article.css, nav bar with cropped logo, and generates TOC for all articles.
"""
import os, re, glob

SITE_DIR = os.path.dirname(os.path.abspath(__file__))

# Nav bar HTML — uses the cropped vnr-logo.png
NAV_HTML = '''<nav class="vnr-nav">
<div class="vnr-nav-inner">
<a href="/" class="vnr-nav-logo"><img src="/vnr-logo.png" alt="VNR" style="height:44px;width:auto;"></a>
<div class="vnr-nav-links">
<a href="/" class="active">VNR SCAN</a>
<a href="/overview/">What AI Platforms Hide</a>
<a href="/overview/#research">Research</a>
<a href="/suno-report/">Tracker Report</a>
<a href="/overview/#engage">Engage</a>
<a href="/overview/#about">About</a>
</div>
</div>
</nav>'''

CSS_LINK = '<link rel="stylesheet" href="/article.css">'
FONT_LINK = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">'

# Articles to process
TARGETS = [
    'research/velvet-casino/index.html',
    'research/suno-privacy-audit-2026/index.html',
    'research/is-suno-safe-commercial/index.html',
    'research/suno-interactive-chat-2026/index.html',
    'research/ai-music-sovereignty-audit-2026/index.html',
    'research/suno-vs-vnr-scan/index.html',
    'suno-report/index.html',
]

def generate_toc(html):
    """Extract h2 tags and build a sidebar TOC."""
    h2s = re.findall(r'<h2[^>]*(?:id=["\']([^"\']*)["\'])?[^>]*>(.*?)</h2>', html, re.DOTALL)
    if not h2s:
        return ''
    
    colors = ['#40c0ff','#f5a623','#10b981','#ff4d4d','#a78bfa','#ec4899','#eab308']
    items = []
    for i, (existing_id, title) in enumerate(h2s):
        clean = re.sub(r'<[^>]+>', '', title).strip()
        # Short label: cut at colon or dash, cap at 20 chars
        label = re.split(r'[:\u2014\u2013–—]', clean)[0].strip()
        if len(label) > 20:
            label = label[:20].rsplit(' ', 1)[0]
        slug = existing_id or re.sub(r'[^a-z0-9]+', '-', clean.lower()).strip('-')
        color = colors[i % len(colors)]
        items.append(f'<a class="snav" href="#{slug}"><span class="dot" style="background:{color}"></span>{label}</a>')
    
    return '<nav id="scan-nav">\n' + '\n'.join(items) + '\n</nav>'

def ensure_h2_ids(html):
    """Make sure every h2 has an id attribute."""
    def add_id(match):
        full_tag = match.group(0)
        content = match.group(1)
        if 'id=' in full_tag:
            return full_tag
        clean = re.sub(r'<[^>]+>', '', content).strip()
        slug = re.sub(r'[^a-z0-9]+', '-', clean.lower()).strip('-')
        return full_tag.replace('<h2', f'<h2 id="{slug}"', 1)
    return re.sub(r'<h2[^>]*>(.*?)</h2>', add_id, html, flags=re.DOTALL)

def process_file(filepath):
    print(f'  Processing: {filepath}')
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # 1. Remove any old vnr-template-css blocks
    html = re.sub(r'<style id="vnr-template-css">.*?</style>', '', html, flags=re.DOTALL)
    
    # 2. Remove any old nav injections (previous standardization attempts)
    html = re.sub(r'<nav style="position:fixed.*?</nav>', '', html, flags=re.DOTALL)
    html = re.sub(r'<nav class="vnr-nav">.*?</nav>', '', html, flags=re.DOTALL)
    
    # 3. Remove old scan-nav TOC
    html = re.sub(r'<nav id="scan-nav">.*?</nav>', '', html, flags=re.DOTALL)
    
    # 4. Add font + CSS links before </head> if not already present
    if 'article.css' not in html:
        html = html.replace('</head>', f'{FONT_LINK}\n{CSS_LINK}\n</head>')
    
    # 5. Ensure h2s have ids
    html = ensure_h2_ids(html)
    
    # 6. Generate TOC
    toc = generate_toc(html)
    
    # 7. Inject nav + toc right after <body> (or <body ...>)
    body_match = re.search(r'<body[^>]*>', html)
    if body_match:
        insert_pos = body_match.end()
        html = html[:insert_pos] + '\n' + NAV_HTML + '\n' + toc + '\n' + html[insert_pos:]
    
    # 8. Wrap content in article-wrap if not already wrapped
    # Find the main content div — look for .p or .container class
    if 'class="article-wrap"' not in html:
        # Try to find existing wrapper (.p or .container)
        for cls in ['class="p"', 'class="container"']:
            if cls in html:
                html = html.replace(cls, 'class="article-wrap"', 1)
                break
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'    ✓ Done')

def main():
    print('VNR Article Standardizer v2')
    print('=' * 40)
    for target in TARGETS:
        path = os.path.join(SITE_DIR, target)
        if os.path.exists(path):
            process_file(path)
        else:
            print(f'  SKIP (not found): {target}')
    print('\nAll articles processed.')

if __name__ == '__main__':
    main()
