import os
from bs4 import BeautifulSoup
import re

TEMPLATE = """<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | Voss Neural Research</title>
    <meta name="description" content="{description}">
    <meta name="keywords" content="{keywords}">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{description}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="{url}">
    <meta property="og:site_name" content="Voss Neural Research">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{title}">
    <meta name="twitter:description" content="{description}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="Voss Neural Research LLC">
    <link rel="canonical" href="{url}">
    {json_ld}
    <link rel='icon' type='image/png' href='/vnr-icon.png'>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {{
            --bg: #030303;
            --text: #d4d4d4;
            --text-sub: #888;
            --accent: #40c0ff;
            --magenta: #40c0ff;
            --purple: #40c0ff;
            --green: #10b981;
            --border: rgba(64, 192, 255, .2)
        }}

        * {{
            box-sizing: border-box;
            margin: 0;
            padding: 0
        }}

        html {{
            scrollbar-width: none;
            scroll-behavior: smooth
        }}

        body {{
            background: var(--bg);
            background-image: radial-gradient(circle at 30% 0%, rgba(64, 192, 255, .04) 0%, transparent 50%), radial-gradient(circle at 70% 100%, rgba(64, 192, 255, .03) 0%, transparent 40%);
            color: var(--text);
            font-family: 'Inter', sans-serif;
            line-height: 1.8
        }}

        .p {{
            max-width: 760px;
            margin: 0 auto;
            padding: 40px 24px 80px
        }}

        .nav {{
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 20px 0;
            margin-bottom: 40px;
            border-bottom: 1px solid rgba(255, 255, 255, .06)
        }}

        .nav div {{
            display: flex;
            align-items: center;
            gap: 16px;
        }}

        .nav a {{
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            color: var(--text-sub);
            text-decoration: none;
            text-transform: uppercase;
            letter-spacing: .1em;
            transition: color .2s
        }}

        .nav a:hover {{
            color: var(--accent)
        }}

        .nav .s {{
            color: rgba(255, 255, 255, .15)
        }}

        .tag {{
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            font-weight: 700;
            color: var(--purple);
            text-transform: uppercase;
            letter-spacing: .15em;
            margin-bottom: 16px
        }}

        .t {{
            font-size: 36px;
            font-weight: 800;
            line-height: 1.2;
            color: #fff;
            margin-bottom: 20px
        }}

        .t em, .t span {{
            background: linear-gradient(135deg, var(--magenta), var(--purple));
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            font-style: normal
        }}

        .meta {{
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            color: var(--text-sub);
            margin-bottom: 40px;
            display: flex;
            gap: 24px;
            flex-wrap: wrap
        }}

        .meta strong {{
            color: var(--accent)
        }}

        article h2 {{
            font-size: 24px;
            font-weight: 700;
            color: #fff;
            margin: 48px 0 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(255, 255, 255, .06)
        }}

        article h3 {{
            font-size: 18px;
            font-weight: 600;
            color: #e8e8e8;
            margin: 32px 0 12px
        }}

        article p {{
            margin-bottom: 20px;
            font-size: 16px
        }}

        article strong {{
            color: #fff;
            font-weight: 600
        }}

        article ul {{
            margin: 0 0 20px 20px;
            list-style: none
        }}

        article ul li {{
            position: relative;
            padding-left: 20px;
            margin-bottom: 10px;
            font-size: 15px
        }}

        article ul li::before {{
            content: '\\25B8';
            position: absolute;
            left: 0;
            color: var(--purple);
            font-weight: bold
        }}

        .eb, .evidence-box, .risk-box, .mechanism-card {{
            background: rgba(64, 192, 255, .06);
            border: 1px solid rgba(64, 192, 255, .2);
            border-left: 3px solid var(--purple);
            padding: 20px 24px;
            margin: 24px 0;
            border-radius: 4px
        }}

        .eb .l, .evidence-box .label, .risk-box h4, .mechanism-card h4 {{
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: .1em;
            color: var(--purple);
            margin-bottom: 8px
        }}

        .eb p, .evidence-box p, .risk-box p, .mechanism-card p {{
            font-size: 14px;
            margin-bottom: 0
        }}

        .cta, .callout {{
            background: rgba(64, 192, 255, .06);
            border: 1px solid rgba(64, 192, 255, .2);
            border-radius: 8px;
            padding: 24px;
            margin: 32px 0;
            text-align: center
        }}

        .cta a, .callout a {{
            display: inline-block;
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            font-weight: 700;
            color: #fff;
            background: linear-gradient(135deg, var(--magenta), var(--purple));
            padding: 12px 32px;
            border-radius: 6px;
            text-decoration: none;
            margin-top: 12px;
            transition: transform .2s, box-shadow .2s
        }}

        .cta a:hover, .callout a:hover {{
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(64, 192, 255, .3)
        }}

        .risk, .stat-row {{
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin: 32px 0
        }}

        .rc, .stat-card {{
            background: rgba(255, 255, 255, .02);
            border: 1px solid rgba(255, 255, 255, .08);
            border-radius: 8px;
            padding: 20px;
            text-align: center
        }}

        .rc .lv, .stat-card .num {{
            font-family: 'JetBrains Mono', monospace;
            font-size: 28px;
            font-weight: 800
        }}

        .rc .d, .stat-card .desc {{
            font-size: 12px;
            color: var(--text-sub);
            margin-top: 4px
        }}
        
        .ct {{
            width: 100%;
            border-collapse: collapse;
            margin: 32px 0
        }}

        .ct th {{
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: .1em;
            color: var(--text-sub);
            text-align: left;
            padding: 12px 16px;
            border-bottom: 2px solid rgba(255, 255, 255, .1)
        }}

        .ct td {{
            padding: 14px 16px;
            border-bottom: 1px solid rgba(255, 255, 255, .04);
            font-size: 14px
        }}

        .ct tr:hover {{
            background: rgba(64, 192, 255, .04)
        }}
        
        .ct .bad {{ color: #ef4444; font-weight: 600 }}
        .ct .good {{ color: var(--green); font-weight: 600 }}
        .ct .warn {{ color: #f59e0b; font-weight: 600 }}

        .ft {{
            margin-top: 60px;
            padding-top: 24px;
            border-top: 1px solid rgba(255, 255, 255, .06);
            text-align: center
        }}

        .ft a {{
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            color: var(--text-sub);
            text-decoration: none
        }}

        .ft .c {{
            font-size: 11px;
            color: #444;
            margin-top: 12px
        }}

        @media(max-width:600px) {{
            .t {{
                font-size: 26px
            }}

            .risk, .stat-row, .ct {{
                grid-template-columns: 1fr;
                font-size: 12px
            }}

            .meta {{
                flex-direction: column;
                gap: 8px
            }}
        }}
    </style>
</head>

<body>
    <div class="p">
        <nav class="nav">
            <a href="/" style="display: flex; align-items: center; border:none; text-decoration:none;"><img src="/vnr-logo.png" alt="VNR Logo" style="height:24px; margin-right:8px;"></a>
            <div>
                <a href="/">VNR Home</a><span class="s">/</span>
                <a href="/research/">Research</a><span class="s">/</span>
                <a href="{url}" style="color:var(--purple)">This Article</a>
            </div>
        </nav>

        <div class="tag">{tag}</div>
        <h1 class="t">{h1_title}</h1>
        <div class="meta">
            <span>By <strong>Voss Neural Research</strong></span>
            <span>Published: <strong>{published_date}</strong></span>
            {extra_meta}
        </div>

        {extra_header_blocks}

        <article>
            {article_content}
        </article>

        {related_links}

        <footer class="ft">
            <a href="/">Voss Neural Research</a>
            <p class="c">&copy; 2026 Voss Neural Research LLC. Auditing the Algorithmic Age.</p>
        </footer>
    </div>
</body>

</html>"""


def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    soup = BeautifulSoup(content, 'html.parser')

    # Extract basic meta
    title_el = soup.find('title')
    title = title_el.text.replace(" | Voss Neural Research", "") if title_el else ""
    
    desc_el = soup.find('meta', attrs={'name': 'description'})
    description = desc_el['content'] if desc_el else ""
    
    key_el = soup.find('meta', attrs={'name': 'keywords'})
    keywords = key_el['content'] if key_el else ""
    
    url_el = soup.find('link', rel='canonical')
    url = url_el['href'] if url_el else ""

    json_ld_el = soup.find('script', type='application/ld+json')
    json_ld = str(json_ld_el) if json_ld_el else ""

    # Extract Article Elements
    # The tag is usually the .tag, .article-tag, .paper-badge
    tag_list = soup.select('.tag, .article-tag, .paper-badge')
    tag = tag_list[0].text if tag_list else "VNR Research"

    h1_el = soup.find('h1')
    h1_title = "".join(str(c) for c in h1_el.contents) if h1_el else title

    # Dates and extra meta
    meta_els = soup.select('.meta span, .article-meta span, .paper-meta')
    published_date = "March 8, 2026"
    extra_meta = ""
    for el in meta_els:
        text = el.text
        if "Published:" in text:
            published_date = text.replace("Published:", "").strip()
            if "<strong>" not in str(el):
                published_date = published_date.replace("2026", "2026") # just text
                published_date = re.sub(r'Published:\s*', '', text)
        elif "By" not in text and "|" not in text:
            # Add to extra meta
            extra_meta += f'<span>{str(el.contents[0]) if not isinstance(el.contents[0], str) else el.decode_contents()}</span>\n'
    
    if "is-suno-safe" in filepath and not extra_meta:
        extra_meta = '<span>Risk Level: <strong style="color:#ef4444;">HIGH</strong></span>'
    elif "suno-privacy-audit" in filepath:
        extra_meta = '<span>Reading time: <strong>12 min</strong></span>'

    # Extrating pre-article blocks like stats, risks
    extra_header_blocks = ""
    risk_el = soup.find(class_="risk")
    stat_el = soup.find(class_="stat-row")
    if risk_el: extra_header_blocks += str(risk_el)
    if stat_el: extra_header_blocks += str(stat_el)

    # Article content
    article_el = soup.find('article')
    if not article_el:
        article_el = soup.find(class_="paper-body")
    if not article_el:
        # fallback, just get all p, h2, ul under container
        container = soup.find(class_='container')
        if container:
            article_content_parts = [str(tag) for tag in container.contents if tag.name in ['h2', 'h3', 'p', 'ul', 'ol', 'div', 'table']]
            article_content = "".join(article_content_parts)
        else:
            article_content = ""
    else:
        article_content = "".join(str(c) for c in article_el.contents)

    # Clean up formatting inside article (remove old classes that might clash or use the new ones seamlessly since they map)
    article_content = article_content.replace('class="article-content"', '')

    # Related links block (the 1fr 1fr grid)
    # Finding a div with margin-top 48px and grid
    grid_el = None
    for d in soup.find_all('div'):
        style = d.get('style', '')
        if 'grid-template-columns' in style and 'margin-top' in style:
            grid_el = d
            break
    
    related_links = str(grid_el) if grid_el else ""

    new_html = TEMPLATE
    new_html = new_html.replace("{title}", title)
    new_html = new_html.replace("{description}", description)
    new_html = new_html.replace("{keywords}", keywords)
    new_html = new_html.replace("{url}", url)
    new_html = new_html.replace("{json_ld}", json_ld)
    new_html = new_html.replace("{tag}", tag)
    new_html = new_html.replace("{h1_title}", h1_title)
    new_html = new_html.replace("{published_date}", published_date)
    new_html = new_html.replace("{extra_meta}", extra_meta)
    new_html = new_html.replace("{extra_header_blocks}", extra_header_blocks)
    new_html = new_html.replace("{article_content}", article_content)
    new_html = new_html.replace("{related_links}", related_links)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_html)

files = [
    r"C:\Users\ovjup\Dropbox\Voss Neural Research LLC\01_VNR\Website\vossneuralresearch\research\is-suno-safe-commercial\index.html",
    r"C:\Users\ovjup\Dropbox\Voss Neural Research LLC\01_VNR\Website\vossneuralresearch\research\suno-privacy-audit-2026\index.html",
    r"C:\Users\ovjup\Dropbox\Voss Neural Research LLC\01_VNR\Website\vossneuralresearch\research\suno-vs-vnr-scan\index.html",
    r"C:\Users\ovjup\Dropbox\Voss Neural Research LLC\01_VNR\Website\vossneuralresearch\research\ai-music-sovereignty-audit-2026\index.html",
    r"C:\Users\ovjup\Dropbox\Voss Neural Research LLC\01_VNR\Website\vossneuralresearch\research\suno-interactive-chat-2026\index.html",
    r"C:\Users\ovjup\Dropbox\Voss Neural Research LLC\01_VNR\Website\vossneuralresearch\research\velvet-casino\index.html"
]

for file in files:
    process_file(file)
    print(f"Processed: {file}")
