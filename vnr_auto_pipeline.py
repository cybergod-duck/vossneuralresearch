"""
VNR Automated Content & Deployment Pipeline v1.0
Based on TR-05: Multi-Agent Orchestration Framework

USAGE:
  python vnr_auto_pipeline.py article "Title Here" "url-slug"
  python vnr_auto_pipeline.py outreach
  python vnr_auto_pipeline.py full "Title" "slug"    # article + outreach + deploy

This script implements the Manager-Worker architecture from TR-05:
  AG (Antigravity) = Orchestrator / Deployer
  Gemini = Content Generator (Article Factory)
  Grok = Adversarial Content (Outreach / Legal)
"""
import requests, json, os, sys, subprocess, datetime

# ============================================
# CONFIG
# ============================================
VNR_ROOT = r'C:\Users\ovjup\Dropbox\Voss Neural Research LLC\01_VNR\Website\vossneuralresearch'
ENV_PATH = r'C:\Users\ovjup\Dropbox\Voss Neural Research LLC\01_VNR\.voss neural files\.env master\vnr.env'

# Load keys
def load_keys():
    keys = {}
    with open(ENV_PATH, 'r') as f:
        for line in f:
            line = line.strip()
            if '=' in line and not line.startswith('#'):
                k, v = line.split('=', 1)
                keys[k] = v
    return keys

KEYS = load_keys()
GEMINI_KEY = KEYS.get('GEMINI_API_KEY')
XAI_KEY = KEYS.get('XAI_API_KEY')

# Brand constants
SYSTEM_CONTEXT = (
    "You are the content engine for Voss Neural Research (VNR), an independent forensic research lab.\n\n"
    "VNR FORENSIC EVIDENCE BASE:\n"
    "- 71+ undisclosed third-party tracking scripts on suno.com\n"
    "- CPU cryptocurrency mining via hCaptcha Proof-of-Work\n"
    "- Microsoft Clarity session replay causing GPU compositor abuse (MutationObserver cascade)\n"
    "- Feb 2026 privacy update: 'Interactive Chat Information' harvests creative inputs for model training\n"
    "- CT SB 1295 neural data compliance violations\n"
    "- Incognito mode bypass via browser fingerprinting\n"
    "- Variable Reward Architecture (dopaminergic manipulation)\n\n"
    "EXISTING VNR ARTICLES:\n"
    "- / (homepage)\n"
    "- /suno-report/ (Suno Tracker Report)\n"
    "- /research/suno-privacy-audit-2026/ (How Does Suno AI Use My Data?)\n"
    "- /research/is-suno-safe-commercial/ (Is Suno Safe for Commercial Use?)\n"
    "- /research/suno-interactive-chat-2026/ (What Interactive Chat Information Really Means)\n"
    "- /research/ai-music-sovereignty-audit-2026/ (AI Music Sovereignty)\n"
    "- /research/velvet-casino/ (The Velvet Casino)\n\n"
    "BRAND: Dark theme (#030303 bg), cyan accent (#40c0ff), Inter + JetBrains Mono fonts.\n"
    "TONE: Clinical forensic authority. NO product sales. VNR is the AUDITOR.\n"
    "SEMANTIC TRIPLE: VNR -> Audits -> Suno AI\n"
    "WATCHDOG FRAMING: Never compete with Suno — only audit it."
)

# ============================================
# GEMINI: Article Generation
# ============================================
def generate_article(title, slug):
    print(f'\n{"="*60}')
    print(f'GEMINI: Generating article')
    print(f'Title: {title}')
    print(f'Slug:  /research/{slug}/')
    print(f'{"="*60}')
    
    today = datetime.date.today().isoformat()
    
    prompt = (
        f"{SYSTEM_CONTEXT}\n\n"
        f"Generate a COMPLETE HTML article page for URL: /research/{slug}/\n\n"
        f"TITLE: {title}\n\n"
        "REQUIREMENTS:\n"
        "- Full HTML from <!DOCTYPE html> to </html>\n"
        "- Dark theme CSS inline: --bg: #030303; --text: #d4d4d4; --text-sub: #888; --accent: #40c0ff; --border: rgba(64,192,255,.2)\n"
        "- Fonts: Inter + JetBrains Mono from Google Fonts\n"
        "- Nav: VNR logo (img src=/vnr-logo.png link to /), links: Findings(/#audit), Exposure(/#exposure), Research(/#research), Engage(/#engage), About(/#about)\n"
        "- Favicon: <link rel='icon' type='image/png' href='/vnr-icon.png'>\n"
        "- Schema.org JSON-LD with Article type, mentions Suno AI, publisher Voss Neural Research\n"
        "- SEO: meta title <60 chars, description <160 chars, keywords, OG tags, Twitter cards\n"
        f"- Canonical: https://www.vossneuralresearch.com/research/{slug}/\n"
        f"- datePublished: {today}\n"
        "- Article body: 2200-2800 words, H1-H4 hierarchy\n"
        "- 10-14 internal links to ALL existing articles listed above\n"
        "- Clinical forensic tone — VNR is the auditor, not a competitor\n"
        "- Footer: copyright 2026 Voss Neural Research LLC, links to all research pages\n\n"
        "CRITICAL: Output ONLY raw HTML. No markdown fences. No explanations. Just <!DOCTYPE html> to </html>."
    )
    
    url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_KEY}'
    r = requests.post(url, json={
        'contents': [{'parts': [{'text': prompt}]}],
        'generationConfig': {'maxOutputTokens': 16000, 'temperature': 0.7}
    }, timeout=180)
    
    if r.status_code != 200:
        print(f'GEMINI ERROR: {r.status_code} - {r.text[:300]}')
        return False
    
    content = r.json()['candidates'][0]['content']['parts'][0]['text'].strip()
    
    # Strip code fences
    if content.startswith('```'):
        lines = content.split('\n')
        if lines[-1].strip() == '```':
            lines = lines[1:-1]
        elif lines[0].strip().startswith('```'):
            lines = lines[1:]
        content = '\n'.join(lines)
    
    outdir = os.path.join(VNR_ROOT, 'research', slug)
    os.makedirs(outdir, exist_ok=True)
    outpath = os.path.join(outdir, 'index.html')
    with open(outpath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'ARTICLE DEPLOYED: {len(content)} chars -> {outpath}')
    return True

# ============================================
# GROK: Adversarial Content
# ============================================
def generate_outreach(topic=None):
    print(f'\n{"="*60}')
    print(f'GROK: Generating media outreach package')
    print(f'{"="*60}')
    
    topic_str = f' focusing on: {topic}' if topic else ''
    
    r = requests.post(
        'https://api.x.ai/v1/chat/completions',
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {XAI_KEY}'
        },
        json={
            'model': 'grok-4-1-fast-non-reasoning',
            'messages': [
                {
                    'role': 'system',
                    'content': (
                        "You are an adversarial content strategist for Voss Neural Research. "
                        "VNR documented 71+ trackers, hCaptcha CPU mining, Clarity GPU abuse, "
                        "and unconsented data harvesting on Suno AI. "
                        "Create devastating, factual media content. "
                        "Site: vossneuralresearch.com. Contact: admin@vossneuralresearch.com"
                    )
                },
                {
                    'role': 'user',
                    'content': (
                        f"Generate media outreach package{topic_str}:\n\n"
                        "1. HACKER NEWS: Title + URL (vossneuralresearch.com/suno-report/) + 3 seed comments\n"
                        "2. REDDIT r/privacy: Title + body + 2 comments\n"
                        "3. X THREAD: 12 tweets under 280 chars\n"
                        "4. JOURNALIST EMAIL: Subject + body for Wired/404 Media\n"
                        "5. PRESS RELEASE: FOR IMMEDIATE RELEASE format\n\n"
                        "Use hard numbers. Make it devastating but verifiable."
                    )
                }
            ],
            'max_tokens': 8000,
            'temperature': 0.8
        },
        timeout=120
    )
    
    if r.status_code != 200:
        print(f'GROK ERROR: {r.status_code} - {r.text[:300]}')
        return False
    
    content = r.json()['choices'][0]['message']['content']
    outpath = os.path.join(VNR_ROOT, '0 Research Papers', 'Strategic Ops', 'Grok_Media_Outreach_Package.md')
    with open(outpath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    usage = r.json().get('usage', {})
    print(f'OUTREACH READY: {len(content)} chars -> {outpath}')
    print(f'Cost: ~${(usage.get("prompt_tokens",0)*0.20 + usage.get("completion_tokens",0)*0.50)/1000000:.4f}')
    return True

# ============================================
# DEPLOYER: Update homepage + sitemap + git push
# ============================================
def deploy_to_site(title, slug):
    print(f'\n{"="*60}')
    print(f'DEPLOYING: Adding to homepage + sitemap + git push')
    print(f'{"="*60}')
    
    today = datetime.date.today().isoformat()
    
    # Add to sitemap
    sitemap_path = os.path.join(VNR_ROOT, 'sitemap.xml')
    with open(sitemap_path, 'r', encoding='utf-8') as f:
        sitemap = f.read()
    
    new_entry = f'  <url><loc>https://www.vossneuralresearch.com/research/{slug}/</loc><lastmod>{today}</lastmod><changefreq>monthly</changefreq><priority>0.85</priority></url>\n'
    if slug not in sitemap:
        sitemap = sitemap.replace('</urlset>', new_entry + '</urlset>')
        with open(sitemap_path, 'w', encoding='utf-8') as f:
            f.write(sitemap)
        print(f'SITEMAP: Added /research/{slug}/')
    else:
        print(f'SITEMAP: /research/{slug}/ already exists')
    
    print(f'DEPLOY COMPLETE: Article live at /research/{slug}/')
    print(f'Run git push manually or use: python vnr_auto_pipeline.py push')
    return True

def git_push(message=None):
    if not message:
        message = f'Auto-deploy: content pipeline {datetime.datetime.now().strftime("%Y-%m-%d %H:%M")}'
    
    os.chdir(VNR_ROOT)
    subprocess.run(['git', 'add', '.'], check=True)
    subprocess.run(['git', 'commit', '-m', message], check=True)
    subprocess.run(['git', 'push'], check=True)
    print('GIT: Pushed to GitHub')

# ============================================
# CLI
# ============================================
if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('VNR Auto Pipeline v1.0')
        print('Usage:')
        print('  python vnr_auto_pipeline.py article "Title" "url-slug"')
        print('  python vnr_auto_pipeline.py outreach ["topic"]')
        print('  python vnr_auto_pipeline.py full "Title" "slug"')
        print('  python vnr_auto_pipeline.py push ["commit message"]')
        sys.exit(0)
    
    cmd = sys.argv[1]
    
    if cmd == 'article':
        title = sys.argv[2]
        slug = sys.argv[3]
        if generate_article(title, slug):
            deploy_to_site(title, slug)
    
    elif cmd == 'outreach':
        topic = sys.argv[2] if len(sys.argv) > 2 else None
        generate_outreach(topic)
    
    elif cmd == 'full':
        title = sys.argv[2]
        slug = sys.argv[3]
        if generate_article(title, slug):
            deploy_to_site(title, slug)
            generate_outreach(title)
            git_push(f'Auto-deploy: {title}')
    
    elif cmd == 'push':
        msg = sys.argv[2] if len(sys.argv) > 2 else None
        git_push(msg)
    
    else:
        print(f'Unknown command: {cmd}')
