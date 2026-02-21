// AI Dependency Assessment UI & Logic

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('#assessment .app-panel');

    const questions = [
        { text: "Do you experience distress or anxiety when unable to access core AI tools?", axis: "withdrawal" },
        { text: "Have your scheduled offline hours steadily decreased in favor of AI collaboration?", axis: "compulsive" },
        { text: "Do you use AI ideation primarily to regulate negative mood or low points?", axis: "regulation" },
        { text: "Has reliance on AI prompting replaced prior human-delegated workflows or socializing?", axis: "isolation" }
    ];

    let currentStep = 0;
    let scores = { withdrawal: 0, compulsive: 0, regulation: 0, isolation: 0 };

    if (container && container.innerHTML.includes('coming soon')) {
        renderAssessment();
    }

    function renderAssessment() {
        if (currentStep < questions.length) {
            const q = questions[currentStep];
            let html = `
        <div style="text-align: center; max-width: 500px; margin: 0 auto; padding-top: 2rem;">
          <span class="status-tag" style="position:relative; top:0; right:0; display:inline-block; margin-bottom:20px;">
            QUESTION ${currentStep + 1} OF ${questions.length}
          </span>
          <h2 style="font-size: 1.1rem; color: var(--text); line-height: 1.5; margin-bottom: 2rem; font-family: 'Inter', sans-serif; text-transform:none; text-shadow:none;">
            ${q.text}
          </h2>
          <div style="display:flex; gap: 15px; justify-content: center;">
            <button class="styled-btn btn-answer" data-val="3" style="width:100px;">Often</button>
            <button class="styled-btn btn-answer" data-val="1" style="width:100px;">Sometimes</button>
            <button class="styled-btn btn-answer" data-val="0" style="width:100px;">Rarely</button>
          </div>
        </div>
      `;
            container.innerHTML = html;

            container.querySelectorAll('.btn-answer').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    scores[q.axis] += parseInt(e.target.getAttribute('data-val'));
                    currentStep++;
                    renderAssessment();
                });
            });
        } else {
            renderResults();
        }
    }

    function renderResults() {
        const total = Object.values(scores).reduce((a, b) => a + b, 0);
        const maxScore = questions.length * 3;
        const percentage = total / maxScore;

        let color = percentage < 0.3 ? "var(--success)" : percentage < 0.7 ? "var(--warning)" : "var(--danger)";
        let profile = percentage < 0.3 ? "Baseline Integration" : percentage < 0.7 ? "Moderate Reliance" : "High Dependency Risk";
        let recommendation = percentage < 0.3 ? "Continue current protocols. Monitor for drift." :
            percentage < 0.7 ? "Implement mandatory 24-hour offline cycle weekly. Reinforce human accountability." :
                "Immediate protocol intervention required. Trigger complete dopamine detox cycle and notify accountability partner.";

        container.innerHTML = `
      <h2>Assessment Complete</h2>
      <div style="text-align: center; max-width: 600px; margin: 2rem auto 0;">
        <div style="font-size: 1.5rem; color: ${color}; font-family: 'Orbitron', sans-serif; margin-bottom: 5px; text-shadow: 0 0 15px ${color}88;">
          ${profile}
        </div>
        <p style="font-size: 0.8rem; color: var(--muted); margin-bottom: 30px;">Calculated Risk Profile: ${Math.round(percentage * 100)}% Match</p>
        
        <div class="data-box" style="text-align: left; margin-bottom: 20px;">
          <h3 style="margin:0 0 10px; font-size:0.75rem; color:var(--text);">Clinical Recommendation</h3>
          <p style="font-size: 0.7rem; color: #cbd5e1; line-height: 1.5; margin:0;">${recommendation}</p>
        </div>

        <button class="styled-btn" id="btn-restart-assessment">Recalibrate Baseline</button>
      </div>
    `;

        document.getElementById('btn-restart-assessment').addEventListener('click', () => {
            currentStep = 0;
            scores = { withdrawal: 0, compulsive: 0, regulation: 0, isolation: 0 };
            renderAssessment();
        });
    }
});
