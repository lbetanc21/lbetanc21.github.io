// scripts/generate_json.js — tailored to Luis's intro_form.html

(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const val = (id) => (document.getElementById(id)?.value || "").trim();

  function firstCharOrEmpty(s) {
    return (s || "").trim().charAt(0) || "";
  }

  // Read COURSES from .course-entry blocks using your id prefixes
  function readCourses() {
    return $$(".course-entry").map(block => {
      const dept = block.querySelector("[id^='course_dept_']")?.value.trim() || "";
      const number = block.querySelector("[id^='course_num_']")?.value.trim() || "";
      const name = block.querySelector("[id^='course_name_']")?.value.trim() || "";
      const reason = block.querySelector("[id^='course_reason_']")?.value.trim() || "";
      return { department: dept, number, name, reason };
    }).filter(c => c.department || c.number || c.name || c.reason);
  }

  // Read LINKS from #link1..#link5 and turn into {name, href}
  function readLinks() {
    const ids = ["link1","link2","link3","link4","link5"];
    const out = [];
    ids.forEach(id => {
      const href = val(id);
      if (!href) return;
      try {
        const u = new URL(href);
        out.push({ name: u.hostname.replace(/^www\\./, ""), href });
      } catch {
        out.push({ name: href, href }); // fallback if not a valid URL
      }
    });
    return out;
  }

  function computeImagePath() {
    // Prefer explicit default path string (required for JSON); ignore Blob URLs
    const explicit = val("default_image");
    if (explicit) return explicit;
    // If a file was picked, you may want to still output a project-relative path string,
    // but since we don't upload files here, leave it empty or keep the default.
    return "";
  }

  function buildJSON() {
    const data = {
      // === exact assignment keys ===
      firstName: val("first_name"),
      preferredName: val("preferred_name"),
      middleInitial: (val("middleInitial") || firstCharOrEmpty(val("middle_name"))).toUpperCase(),
      lastName: val("last_name"),
      divider: val("mascot_divider"),
      mascotAdjective: val("mascot_adj"),
      mascotAnimal: val("mascot_animal"),
      image: computeImagePath(), // e.g., "images/headshot.jpeg"
      imageCaption: val("img_caption"),
      personalStatement: val("personal_statement"),
      personalBackground: val("bullet1"),
      professionalBackground: val("bullet3"),
      academicBackground: val("bullet2"),
      subjectBackground: val("subjectBackground") || "",   // (optional) add this field in HTML to fill
      primaryComputer: val("primaryComputer") || "",       // (optional) add this field in HTML to fill
      courses: readCourses(),
      links: readLinks()
    };

    return JSON.stringify(data, null, 2);
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, ch => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[ch]));
  }

  function renderJSON() {
    const jsonText = buildJSON();

    const form = $("#form");
    const result = $("#result") || (function(){
      const sec = document.createElement("section");
      sec.id = "result";
      form.after(sec);
      return sec;
    })();

    result.innerHTML = `
      <article>
        <h3>Generated JSON</h3>
        <section aria-label="JSON output">
          <pre><code id="json_code" class="language-json">${escapeHtml(jsonText)}</code></pre>
        </section>
        <div style="margin-top:.75rem;">
          <button id="start_over_btn" type="button">Start Over</button>
        </div>
      </article>
    `;

    // Change H2 as required
    const h2 = document.querySelector("h2");
    if (h2) h2.textContent = "Introduction HTML";

    // Hide form, show result
    form.hidden = true;
    result.hidden = false;

    // Highlight
    if (window.hljs) {
      const code = $("#json_code");
      hljs.highlightElement(code);
    }

    // Start over (restores form & title)
    $("#start_over_btn")?.addEventListener("click", () => {
      result.hidden = true;
      form.hidden = false;
      form.reset();
      // remove extra course entries beyond the first
      $$(".course-entry").slice(1).forEach(d => d.remove());
      const h2b = document.querySelector("h2");
      if (h2b) h2b.textContent = "Introduction Form";
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Bind to your actual button id:
    $("#btn-generate-json")?.addEventListener("click", (e) => {
      e.preventDefault();
      renderJSON();
    });
  });
})();
