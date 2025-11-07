// resources.js — fetch & display resource links dynamically
async function loadResources() {
  const region = document.getElementById("resources-region");

  try {
    const res = await fetch("data/resources.json");
    if (!res.ok) throw new Error("Failed to load JSON");
    const items = await res.json();

    region.innerHTML = items.map(it => `
      <article class="resource-card">
        <h3><a href="${it.url}" target="_blank" rel="noopener">${it.title}</a></h3>
        <p>${it.desc}</p>
      </article>
    `).join("");

  } catch (err) {
    region.innerHTML = `<p role="alert">⚠️ Could not load resources. Please try again later.</p>`;
    console.error("Resource load error:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadResources);
