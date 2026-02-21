// SPA Router and Main Controller
document.addEventListener('DOMContentLoaded', () => {
  // Navigation elements
  const navLinks = document.querySelectorAll('.nav-link');
  const views = document.querySelectorAll('.view-container');
  const headerLogo = document.getElementById('header-logo');

  // Terminal Logic
  initTerminal();
  
  // Home View Orbital Logic
  initOrbital();

  // Router
  function navigateTo(hash) {
    // Default to home if empty
    if (!hash || hash === '#' || hash === '') hash = '#home';

    // Update active nav link
    navLinks.forEach(link => {
      if (link.getAttribute('href') === hash) link.classList.add('active');
      else link.classList.remove('active');
    });

    // Toggle views
    views.forEach(view => {
      if ('#' + view.id === hash) {
        if(view.id === 'home') view.classList.add('flex-active');
        else view.classList.add('active');
      } else {
        view.classList.remove('active');
        view.classList.remove('flex-active');
      }
    });

    // Trigger view-specific logic if needed
    if (hash === '#portfolio') renderPortfolio();
  }

  // Event Listeners
  window.addEventListener('hashchange', () => navigateTo(window.location.hash));
  headerLogo.addEventListener('click', () => window.location.hash = '#home');

  // Initial load
  navigateTo(window.location.hash);
});

// Terminal Feed Simulator
function initTerminal() {
  const terminal = document.getElementById('terminal');
  const logs = [
    "[SYSTEM] Initializing Antigravity orchestration layer...",
    "[AGENT-C] Role updated: Principal Architect (Self-Assigned)",
    "[NEURAL] Context synthesis: Identified 14 unbriefed claims in dataset.",
    "[SYSTEM] Scaling credits via Scale AI Tier... Status: PENDING",
    "[AGENT-F] Critique loop 04 completed. Precision: 99.8%",
    "[NEURAL] Memory persistence established via AlloyDB.",
    "[AGENT-O] Overmind heartbeat: NOMINAL"
  ];

  let logIndex = 0;
  function addLog() {
    if(!terminal) return;
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `<span>></span> ${logs[logIndex % logs.length]}`;
    terminal.appendChild(line);
    if (terminal.childNodes.length > 15) terminal.removeChild(terminal.firstChild);
    logIndex++;
    setTimeout(addLog, 2000 + Math.random() * 2000);
  }
  addLog();
}

// Orbital Text Animation for Home Page
function initOrbital() {
  const orbital = document.getElementById('orbital');
  if(!orbital) return;
  const phrases = [
    "SELF-EVOLVING PROTOCOL", "ROLE_SETTING: AUTONOMOUS", "CONTEXT_WINDOW: 1.2M",
    "CLAIM_SYNTHESIS: ENABLED", "OVERMIND_ACTIVE", "AGENT_COGNITION: EMERGENT"
  ];

  phrases.forEach((text, i) => {
    const span = document.createElement('span');
    span.innerText = text;
    const angle = (i / phrases.length) * 360;
    span.style.transform = `rotate(${angle}deg) translate(210px) rotate(-${angle}deg)`;
    orbital.appendChild(span);
  });
}

// Dynamic rendering for Portfolio
function renderPortfolio() {
  // Logic inside js/views/Manifestations.js will handle this, but can be managed here if simple
}
