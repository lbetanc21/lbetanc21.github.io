// generate_html.js — builds an HTML snippet from the form and displays it as highlighted code
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const val = (id) => (document.getElementById(id)?.value || "").trim();

  const escapeHtml = (s) =>
    s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

  function buildCoursesHTML() {
    const items = $$(".course-entry").map((e) => {
      const d = e.querySelector("[id^='course_dept_']")?.value.trim() || "";
      const n = e.querySelector("[id^='course_num_']")?.value.trim() || "";
      const nm = e.querySelector("[id^='course_name_']")?.value.trim() || "";
      const r = e.querySelector("[id^='course_reason_']")?.value.trim() || "";
      if (!(d || n || nm || r)) return "";
      return `    <li><strong>${d} ${n} - ${nm}:</strong> ${r}</li>`;
    }).filter(Boolean);

    return items.length
      ? `<ul>\n${items.join("\n")}\n</ul>`
      : `<ul>\n    <li>No courses listed.</li>\n</ul>`;
  }

  function buildLinksHTML() {
    const urls = ["link1","link2","link3","link4","link5"].map(val).filter(Boolean);
    if (urls.length === 0) return `<ul>\n    <li>No links provided.</li>\n</ul>`;
    return `<ul>\n${urls.map(u => `    <li><a href="${u}" target="_blank" rel="noopener">${u}</a></li>`).join("\n")}\n</ul>`;
  }

  function buildIntroHTMLLiteral() {
    const first = val("first_name");
    const mid = val("middle_name");
    const pref = val("preferred_name");
    const last = val("last_name");

    const adj = val("mascot_adj");
    const animal = val("mascot_animal");
    const divider = val("mascot_divider") || "•";

    // Use a real path string for the code output (not a blob)
    const imgSrc = val("default_image") || "images/default-profile.jpg";
    const imgCap = val("img_caption");

    const personal = val("personal_statement");
    const bullets = [1,2,3,4,5,6,7].map(i => val("bullet"+i));
    const quote = val("quote_text");
    const quoteAuth = val("quote_author");

    const ackStatement = val("ack_statement");
    const ackDate = val("ack_date");

    const nameLineParts = [
      first,
      mid ? `${mid.charAt(0)}.` : null,
      last,
      pref ? `"${pref}"` : null
    ].filter(Boolean);

    const nameLine = nameLineParts.join(" ");

    // Build literal HTML (this is what we will DISPLAY as code)
    const literal = `\
<h2>Introduction HTML</h2>
<h3>${nameLine} ★ ${adj} ${divider} ${animal}</h3>
<figure>
  <img
    src="${imgSrc}"
    alt="Profile image of ${first} ${last}"
  />
  <figcaption>${imgCap}</figcaption>
</figure>

<section>
  <h3>Personal Statement</h3>
  <p>${personal}</p>
</section>

<section>
  <h3>Details</h3>
  <ul>
    <li><strong>Personal Background:</strong> ${bullets[0] || ""}</li>
    <li><strong>Academic Background:</strong> ${bullets[1] || ""}</li>
    <li><strong>Professional Background:</strong> ${bullets[2] || ""}</li>
    <li><strong>Skills &amp; Strengths:</strong> ${bullets[3] || ""}</li>
    <li><strong>Interests &amp; Hobbies:</strong> ${bullets[4] || ""}</li>
    <li><strong>Goals &amp; Ambitions:</strong> ${bullets[5] || ""}</li>
    <li><strong>Fun Fact:</strong> ${bullets[6] || ""}</li>
  </ul>
</section>

<section>
  <h3>Courses I'm Taking</h3>
  ${buildCoursesHTML()}
</section>

<section>
  <h3>Favorite Quote</h3>
  <blockquote>&ldquo;${quote}&rdquo;</blockquote>
  <p>&mdash; ${quoteAuth}</p>
</section>

<section>
  <h3>Links</h3>
  ${buildLinksHTML()}
</section>

<section>
  <h3>Acknowledgment</h3>
  <p><strong>Statement:</strong> ${ackStatement}</p>
  <p><strong>Date:</strong> ${ackDate}</p>
</section>`;

    return literal;
  }

  function renderHTMLCodeBlock() {
    const form = $("#form");
    const result = $("#result") || (function(){
      const sec = document.createElement("section");
      sec.id = "result";
      form.after(sec);
      return sec;
    })();

    const htmlLiteral = buildIntroHTMLLiteral();

    result.innerHTML = `
      <article>
        <h3>Generated HTML</h3>
        <section aria-label="HTML output">
          <pre><code id="html_code" class="language-html">${escapeHtml(htmlLiteral)}</code></pre>
        </section>
        <div style="margin-top:.75rem;">
          <button id="start_over_btn" type="button">Start Over</button>
        </div>
      </article>
    `;

    // Change H2 per instructions
    const h2 = document.querySelector("h2");
    if (h2) h2.textContent = "Introduction HTML";

    // Replace the form
    form.hidden = true;
    result.hidden = false;

    // Syntax highlight
    if (window.hljs) {
      const code = $("#html_code");
      hljs.highlightElement(code);
    }

    // Start over → restore form
    $("#start_over_btn")?.addEventListener("click", () => {
      result.hidden = true;
      form.hidden = false;
      form.reset();
      // Remove dynamically added course blocks beyond the first
      const entries = $$(".course-entry");
      entries.slice(1).forEach((d) => d.remove());
      const h2b = document.querySelector("h2");
      if (h2b) h2b.textContent = "Introduction Form";
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Your HTML button uses id="btn-generate-html"
    $("#btn-generate-html")?.addEventListener("click", (e) => {
      e.preventDefault();
      renderHTMLCodeBlock();
    });
  });
})();
