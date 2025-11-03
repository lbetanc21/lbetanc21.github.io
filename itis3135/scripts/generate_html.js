// scripts/generate_html.js
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn-generate-html");
  const form = document.getElementById("form");
  const result = document.getElementById("result");
  const jsonSection = document.getElementById("json_section");
  const htmlSection = document.getElementById("html_section");
  const h2 = document.querySelector("main h2");

  if (!btn) return;

  const get = (id) => document.getElementById(id)?.value.trim() || "";

  function resolveImagePath() {
    const fileInput = document.getElementById("profile_pic");
    const def = document.getElementById("default_image");
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      // Use the chosen file's name under images/
      return `images/${fileInput.files[0].name}`;
    }
    return def ? def.value : "";
  }

  function collectCourses() {
    const rows = Array.from(document.querySelectorAll(".course-entry"));
    return rows.map(row => {
      const dept = row.querySelector("[id^='course_dept_']")?.value?.trim() || "";
      const num  = row.querySelector("[id^='course_num_']")?.value?.trim() || "";
      const name = row.querySelector("[id^='course_name_']")?.value?.trim() || "";
      const reason = row.querySelector("[id^='course_reason_']")?.value?.trim() || "";
      return { department: dept, number: num, name, reason };
    });
  }

  function collectLinks() {
    const ids = ["link1","link2","link3","link4","link5"];
    return ids
      .map(id => get(id))
      .filter(href => href && href.length > 0);
  }

  // Build the HTML string (this is what will appear as code in the <code> block)
  function buildHtmlString() {
    const first = get("first_name");
    const middle = get("middle_name");
    const preferred = get("preferred_name");
    const last = get("last_name");

    const adj = get("mascot_adj");
    const divider = get("mascot_divider");
    const animal = get("mascot_animal");

    const imgSrc = resolveImagePath();
    const imgCap = get("img_caption");

    const personalStatement = get("personal_statement");

    const bullets = [
      get("bullet1"), // Personal
      get("bullet2"), // Academic
      get("bullet3"), // Professional
      get("bullet4"), // Skills
      get("bullet5"), // Interests
      get("bullet6"), // Goals
      get("bullet7")  // Fun
    ];

    const quote = get("quote_text");
    const quoteAuthor = get("quote_author");

    const funny = get("funny_thing");
    const share = get("share_thing");

    const courses = collectCourses();
    const links = collectLinks();

    const fullName = `${first}${middle ? " " + middle : ""} ${last}`;
    const displayName =
      preferred && preferred.trim().length > 0
        ? `${fullName} (${preferred})`
        : fullName;

    // Build lists
    const detailsList = `
<ul>
  <li><strong>Personal Background:</strong> ${bullets[0] || ""}</li>
  <li><strong>Academic Background:</strong> ${bullets[1] || ""}</li>
  <li><strong>Professional Background:</strong> ${bullets[2] || ""}</li>
  <li><strong>Skills &amp; Strengths:</strong> ${bullets[3] || ""}</li>
  <li><strong>Interests &amp; Hobbies:</strong> ${bullets[4] || ""}</li>
  <li><strong>Goals &amp; Ambitions:</strong> ${bullets[5] || ""}</li>
  <li><strong>Fun Fact:</strong> ${bullets[6] || ""}</li>
</ul>`.trim();

    const coursesList = `
<ul>
  ${courses
    .map(c => `<li><strong>${c.department} ${c.number} - ${c.name}:</strong> ${c.reason}</li>`)
    .join("\n  ")}
</ul>`.trim();

    const linksList = `
<ul>
  ${links.map(href => `<li><a href="${href}" target="_blank" rel="noopener">${href}</a></li>`).join("\n  ")}
</ul>`.trim();

    // The full HTML literal we want to DISPLAY (not render)
    const htmlLiteral = `
<h2>Introduction HTML</h2>
<h3>${displayName} ★ ${adj} ${divider} ${animal}</h3>
<figure>
  <img src="${imgSrc}" alt="Headshot of ${first} ${last}" />
  <figcaption>${imgCap}</figcaption>
</figure>

<section>
  <h3>About Me</h3>
  <p>${personalStatement}</p>
</section>

<section>
  <h3>Details</h3>
  ${detailsList}
</section>

<section>
  <h3>Courses I'm Taking</h3>
  ${coursesList}
</section>

<section>
  <h3>Quote</h3>
  <blockquote>“${quote}”</blockquote>
  <p>- ${quoteAuthor}</p>
</section>

<section>
  <h3>Extras</h3>
  ${funny ? `<p><strong>Funny thing:</strong> ${funny}</p>` : ``}
  ${share ? `<p><strong>Something I'd like to share:</strong> ${share}</p>` : ``}
</section>

<section>
  <h3>Links</h3>
  ${linksList}
</section>
`.trim();

    return htmlLiteral;
  }

  function renderHtmlAsCode(htmlString) {
    // Hide other views
    if (form) form.hidden = true;
    if (result) result.hidden = true;
    if (jsonSection) jsonSection.hidden = true;

    // Update H2 per assignment
    if (h2) h2.textContent = "Introduction HTML";

    // Build <pre><code class="language-html">…</code></pre>
    htmlSection.innerHTML = "";
    const title = document.createElement("h3");
    title.textContent = "Generated HTML (copyable)";
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.className = "language-html";

    // IMPORTANT: Use textContent to show tags as text (not render them)
    code.textContent = buildHtmlString();

    pre.appendChild(code);
    htmlSection.appendChild(title);
    htmlSection.appendChild(pre);
    htmlSection.hidden = false;

    // Highlight
    if (window.hljs) {
      window.hljs.highlightElement(code);
    }
  }

  btn.addEventListener("click", () => {
    const htmlStr = buildHtmlString();
    renderHtmlAsCode(htmlStr);
  });
});
