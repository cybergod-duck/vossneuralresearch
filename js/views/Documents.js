// Clinical Documents View UI Logic

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('#documents .app-panel');

    if (container && container.innerHTML.includes('coming soon')) {
        container.innerHTML = `
      <h2>Clinical Documents & Data</h2>
      <p style="font-size: 0.7rem; color: var(--muted); margin-bottom: 20px;">Downloadable artifacts, templates, and clinical summaries formulated for healthcare providers and empirical tracking.</p>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
        
        <div class="data-box" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <h3 style="margin:0 0 5px; font-size:0.8rem; color:var(--text);">Clinical Presentation Deck</h3>
            <span style="font-size:0.6rem; color:var(--header-cyan); display:block; margin-bottom:10px;">FORMAT: .PPTX</span>
            <p style="font-size:0.65rem; color:#cbd5e1; margin-bottom:15px; line-height:1.4;">Slide deck version of the white paper formatted for therapists. Includes visual diagrams of dopaminergic pathways, addiction transference cycles, and N=1 case study data.</p>
          </div>
          <a href="documents/Clinical_Presentation.pptx" download class="styled-btn" style="text-align:center; display:block; text-decoration:none;">DOWNLOAD DECK</a>
        </div>

        <div class="data-box" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <h3 style="margin:0 0 5px; font-size:0.8rem; color:var(--text);">Provider Handout</h3>
            <span style="font-size:0.6rem; color:var(--header-cyan); display:block; margin-bottom:10px;">FORMAT: .DOCX / .PDF</span>
            <p style="font-size:0.65rem; color:#cbd5e1; margin-bottom:15px; line-height:1.4;">One-page clinical summary. "What to know when your patient is using AI in recovery." Highlights red flags, questions to ask, and boundary recommendations.</p>
          </div>
          <a href="documents/Provider_Handout.docx" download class="styled-btn" style="text-align:center; display:block; text-decoration:none;">DOWNLOAD HANDOUT</a>
        </div>

        <div class="data-box" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <h3 style="margin:0 0 5px; font-size:0.8rem; color:var(--text);">Extended Research Report</h3>
            <span style="font-size:0.6rem; color:var(--header-cyan); display:block; margin-bottom:10px;">FORMAT: .DOCX</span>
            <p style="font-size:0.65rem; color:#cbd5e1; margin-bottom:15px; line-height:1.4;">Full literature review connecting stimulant neurobiology with AI behavioral addiction research. Includes proposed clinical trial design.</p>
          </div>
          <a href="documents/Extended_Research_Report.docx" download class="styled-btn" style="text-align:center; display:block; text-decoration:none;">DOWNLOAD REPORT</a>
        </div>

        <div class="data-box" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <h3 style="margin:0 0 5px; font-size:0.8rem; color:var(--text);">Recovery Metrics Spreadsheet</h3>
            <span style="font-size:0.6rem; color:var(--header-cyan); display:block; margin-bottom:10px;">FORMAT: .XLSX</span>
            <p style="font-size:0.65rem; color:#cbd5e1; margin-bottom:15px; line-height:1.4;">Daily log template for tracking AI hours, sleep quality, and craving intensity. Features automated correlation analysis charts.</p>
          </div>
          <a href="documents/Recovery_Metrics.xlsx" download class="styled-btn" style="text-align:center; display:block; text-decoration:none;">DOWNLOAD TRACKER</a>
        </div>

      </div>
    `;
    }
});
