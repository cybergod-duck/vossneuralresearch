---
description: How to create a new VNR research article using the standardized template
---

# Creating a New VNR Research Article

## Prerequisites
- The article template lives at: `research/_article-template.html`
- The shared CSS lives at: `article.css` (root of website)
- The VNR logo: `/vnr-logo.png` and icon: `/vnr-icon.png`

## Steps

1. **Create the article folder**
   ```
   mkdir research/<article-slug>
   ```

2. **Copy the template**
   ```
   cp research/_article-template.html research/<article-slug>/index.html
   ```

3. **Fill in the placeholders** — Replace all `{{PLACEHOLDER}}` values:
   - `{{SLUG}}` — URL slug (e.g., `suno-privacy-audit-2026`)
   - `{{ARTICLE_TITLE}}` — Full article title
   - `{{META_DESCRIPTION}}` — 160-char description for SEO
   - `{{KEYWORDS}}` — Comma-separated SEO keywords
   - `{{DATE_ISO}}` — ISO date (e.g., `2026-03-09`)

4. **Configure the header block**:
   - **Tag**: Always `VNR Forensic Investigation`
   - **Title**: Use `<span>` for gradient-colored subtitle
   - **Meta**: Author (Voss Neural Research), Published date, Reading time
   - **Stat boxes**: Exactly 3 stats — impactful numbers with short labels
     - Example: `71+` / Hidden Trackers, `0` / IP Protections, `100%` / Data Harvested

5. **Build the TOC sidebar** (`#scan-nav`):
   - One `<a class="snav">` per `<h2>` section
   - Use dot colors in this order: `#40c0ff`, `#f5a623`, `#10b981`, `#ff4d4d`, `#a78bfa`, `#ec4899`, `#eab308`
   - Keep link text short (truncated section name)
   - Keep the Related links block at the bottom

6. **Write article content** inside `<article>`:
   - Use `<h2 id="slugified-title">` for section headers (these power the TOC)
   - Use `<div class="eb">` for evidence/key-finding boxes
   - Use `<div class="risk-box">` for risk assessment callouts
   - Use `<div class="cta">` for call-to-action blocks
   - Use `<table class="ct">` for comparison tables
   - Use `.bad`, `.good`, `.warn` classes on `<td>` for color-coded cells

7. **Verify locally** — Run `python -m http.server 8042` and check:
   - [ ] Tag says "VNR Forensic Investigation"
   - [ ] Reading time is present
   - [ ] 3 stat boxes render correctly
   - [ ] TOC sidebar highlights on scroll
   - [ ] "Research" is active (blue) in top nav
   - [ ] Section colors match TOC dot colors

## Standard Format Checklist
| Element | Required Value |
|---------|---------------|
| Tag | `VNR Forensic Investigation` |
| Author | `Voss Neural Research` |
| Meta | Published date + Reading time |
| Stat boxes | Exactly 3 |
| Nav active | `Research` |
| TOC sidebar | One entry per h2 + Related links |
