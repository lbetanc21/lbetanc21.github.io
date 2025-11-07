// contact.js — front-end form validation (read-only, no persistence)

function setError(input, message) {
  const errId = input.getAttribute("aria-describedby");
  if (!errId) return;
  const el = document.getElementById(errId);
  if (el) el.textContent = message || "";
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

function validateEmailFormat(value) {
  // Simple pattern for demo; HTML5 email type also helps
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateForm(form) {
  let ok = true;

  const name = form.name;
  if (!name.value.trim() || name.value.trim().length < 2) {
    setError(name, "Please enter your name (2+ characters).");
    ok = false;
  } else {
    setError(name, "");
  }

  const email = form.email;
  if (!email.value.trim() || !validateEmailFormat(email.value.trim())) {
    setError(email, "Please enter a valid email address.");
    ok = false;
  } else {
    setError(email, "");
  }

  const message = form.message;
  if (!message.value.trim() || message.value.trim().length < 10) {
    setError(message, "Please enter a message (10+ characters).");
    ok = false;
  } else {
    setError(message, "");
  }

  return ok;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const success = document.getElementById("success");

  if (!form) return;

  // Real-time feedback
  form.addEventListener("input", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement)) return;

    if (t.id === "email") {
      setError(t, t.value && !validateEmailFormat(t.value) ? "Invalid email format." : "");
    } else if (t.id === "name") {
      setError(t, t.value.trim().length < 2 ? "Name must be at least 2 characters." : "");
    } else if (t.id === "message") {
      setError(t, t.value.trim().length < 10 ? "Message must be at least 10 characters." : "");
    }
  });

  // Submit handling
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    success.hidden = true;

    if (validateForm(form)) {
      // Simulate success (read-only; no backend)
      form.reset();
      // Clear aria-invalid on reset fields
      ["name","email","message"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.setAttribute("aria-invalid", "false");
      });
      success.hidden = false;
      success.focus?.();
    }
  });

  // Reset clears errors
  form.addEventListener("reset", () => {
    ["nameError","emailError","messageError"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = "";
    });
    ["name","email","message"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.setAttribute("aria-invalid", "false");
    });
  });
});
