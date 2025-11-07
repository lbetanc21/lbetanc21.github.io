/* Simple data source (no backend) */
const PROJECTS = [
  {
    title: "Responsive Web Design",
    desc: "Multi-page site demonstrating semantic HTML, layout, and accessibility.",
    tech: ["HTML/CSS"],
    link: "index.html"
  },
  {
    title: "JavaScript Interactivity",
    desc: "Interactive widgets and state updates using vanilla JS.",
    tech: ["JavaScript"],
    link: "projects.html"
  },
  {
    title: "Skills Tabs (jQuery UI)",
    desc: "Organized skills on the About page using accessible Tabs.",
    tech: ["jQuery UI", "JavaScript"],
    link: "about.html"
  },
  {
    title: "Resources via JSON",
    desc: "Loads helpful links from a local JSON file using fetch (read-only).",
    tech: ["JSON/AJAX", "JavaScript"],
    link: "resources.html"
  }
];

/* DOM refs */
const grid = document.getElementById("projectsGrid");
const qInput = document.getElementById("q");
const techSelect = document.getElementById("tech");
const countEl = document.getElementById("resultCount");
const clearBtn = document.getElementById("clearFilters");

/* Render helpers */
function renderProjects(items) {
  grid.innerHTML = items.map(p => `
    <article class="project-card">
      <h3><a href="${p.link}">${p.title}</a></h3>
      <p class="project-meta">${p.tech.map(t => `<span class="tag">${t}</span>`).join(" ")}</p>
      <p>${p.desc}</p>
      <p><a href="${p.link}">Open →</a></p>
    </article>
  `).join("");

  const n = items.length;
  const tech = techSelect.value ? ` in ${techSelect.value}` : "";
  countEl.textContent = n === 0
    ? "No projects found."
    : `${n} project${n>1?"s":""} match your filters${tech}.`;
}

/* Filtering logic */
function normalize(s){ return s.toLowerCase().trim(); }

function applyFilters() {
  const q = normalize(qInput.value);
  const tech = techSelect.value;

  const filtered = PROJECTS.filter(p => {
    const textHit = !q || (p.title + " " + p.desc).toLowerCase().includes(q);
    const techHit = !tech || p.tech.includes(tech);
    return textHit && techHit;
  });

  renderProjects(filtered);
}

/* Small debounce so we don't filter on every keystroke instantly */
let t;
function debouncedApply() {
  clearTimeout(t);
  t = setTimeout(applyFilters, 120);
}

/* Events */
if (qInput) qInput.addEventListener("input", debouncedApply);
if (techSelect) techSelect.addEventListener("change", applyFilters);
if (clearBtn) clearBtn.addEventListener("click", () => {
  qInput.value = "";
  techSelect.value = "";
  applyFilters();
});

/* Init */
document.addEventListener("DOMContentLoaded", () => renderProjects(PROJECTS));
