document.addEventListener("DOMContentLoaded", () => {
  // ===== jQuery UI Tabs Initialization (About Page) =====
  const tabs = document.querySelector("#skills-tabs");
  if (tabs && typeof $(tabs).tabs === "function") {
    $(tabs).tabs();
  }

  // ===== Smooth Scroll for Anchor Links (Optional) =====
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ===== Console Greeting (Optional for testing) =====
  console.log("%cStudent Tech Portfolio loaded successfully!", "color:#0077b6;font-weight:bold;");
});
