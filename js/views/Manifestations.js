// Manifestations Portfolio View Logic

document.addEventListener('DOMContentLoaded', () => {
    const projects = [
        {
            title: "CRM Index",
            url: "https://crmindex.net/",
            description: "AI-Driven Orchestration & Automations. A foundational node constructed during peak dopaminergic states.",
            active: true
        },
        {
            title: "Overmind Genesis",
            url: "https://overmind-genesis.com/",
            description: "Ritualistic Terminal Infrastructure. Interface for direct multi-agent intelligence mesh control.",
            active: true
        },
        {
            title: "Simple As That",
            url: "#", // User requested not linking directly as it is in production
            description: "Under Construction. An emerging network node structured during abstinence phases to rebuild executive function.",
            active: false
        }
    ];

    const grid = document.getElementById('portfolio-grid');

    if (grid) {
        projects.forEach(proj => {
            const card = document.createElement('a');
            card.className = 'portfolio-card';
            card.href = proj.url;
            if (proj.active) {
                card.target = "_blank";
                card.rel = "noopener noreferrer";
            } else {
                card.style.opacity = "0.7";
                card.style.cursor = "default";
                card.addEventListener('click', (e) => e.preventDefault());
            }

            card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3>${proj.title}</h3>
          ${!proj.active ? '<span style="font-size:0.5rem; color:var(--warning); border:1px solid var(--warning); padding:1px 4px; border-radius:2px;">IN DEV</span>' : ''}
        </div>
        <p style="margin-top: 10px; line-height: 1.5;">${proj.description}</p>
      `;
            grid.appendChild(card);
        });
    }
});
