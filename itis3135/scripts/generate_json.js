// scripts/generate_json.js
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn-generate-json");
  const form = document.getElementById("form");
  const jsonSection = document.getElementById("json_section");
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
    // From fixed inputs link1..link5
    const ids = ["link1","link2","link3","link4","link5"];
    return ids
      .map((id, i) => {
        const href = get(id);
        if (!href) return null;
        return { name: `Link ${i+1}`, href };
      })
      .filter(Boolean);
  }

  function buildJsonString() {
    const data = {
      firstName: get("first_name"),
      preferredName: get("preferred_name"),
      middleInitial: get("middle_name"), // using middle_name since your form has full field
      lastName: get("last_name"),
      divider: get("mascot_divider"),
      mascotAdjective: get("mascot_adj"),
      mascotAnimal: get("mascot_animal"),
      image: resolveImagePath(),
      imageCaption: get("img_caption"),
      personalStatement: get("personal_statement"),
      personalBackground: get("bullet1"),
      professionalBackground: get("bullet3"),
      academicBackground: get("bullet2"),
      subjectBackground: get("bullet4"), // mapped from Skills & Strengths per your form
      primaryComputer: "", // not in form; leaving blank per spec
      courses: collectCourses(),
      links: collectLinks()
    };
    return JSON.stringify(data, null, 2); // pretty JSON, no trailing commas
  }

  function renderJson(jsonStr) {
    // Hide other views
    if (form) form.hidden = true;
    const result = document.getElementById("result");
    if (result) result.hidden = true;

    // Update H2 text per assignment
    if (h2) h2.textContent = "Introduction HTML";

    // Build the highlighted code block
    jsonSection.innerHTML = "";
    const title = document.createElement("h3");
    title.textContent = "Generated JSON";
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.className = "language-json";
    code.textContent = jsonStr;
    pre.appendChild(code);
    jsonSection.appendChild(title);
    jsonSection.appendChild(pre);
    jsonSection.hidden = false;

    // Highlight
    if (window.hljs) {
      window.hljs.highlightElement(code);
    }
  }

  btn.addEventListener("click", () => {
    const json = buildJsonString();
    renderJson(json);
  });
});
