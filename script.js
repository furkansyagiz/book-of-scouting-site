const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const modalButtons = document.querySelectorAll("[data-modal-target]");
const closeButtons = document.querySelectorAll(".modal-close");
const sections = document.querySelectorAll("main section");

if (menuToggle && siteNav) {
  // Mobile navigation toggle with explicit aria state control.
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("open");
  });
}

for (const link of navLinks) {
  // Close mobile menu after selecting a destination.
  link.addEventListener("click", () => {
    if (!menuToggle || !siteNav) {
      return;
    }
    menuToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("open");
  });
}

for (const btn of modalButtons) {
  // Open each policy modal by target id and guard for unsupported states.
  btn.addEventListener("click", () => {
    const modalId = btn.getAttribute("data-modal-target");
    if (!modalId) {
      return;
    }
    const modal = document.getElementById(modalId);
    if (modal && typeof modal.showModal === "function") {
      modal.showModal();
    }
  });
}

for (const close of closeButtons) {
  // Close the closest dialog to keep markup flexible and reusable.
  close.addEventListener("click", () => {
    const dialog = close.closest("dialog");
    if (dialog) {
      dialog.close();
    }
  });
}

for (const section of sections) {
  section.classList.add("reveal");
}

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12 }
);

for (const section of sections) {
  observer.observe(section);
}

/**
 * Opening a URL with a hash (e.g. /#testimonials) scrolls immediately; IntersectionObserver + content-visibility
 * can miss the first frame on mobile. Force the matched main section visible and unobserve once.
 */
function revealSectionFromHash() {
  const raw = window.location.hash.slice(1);
  if (!raw) return;
  let id;
  try {
    id = decodeURIComponent(raw.replace(/\+/g, " "));
  } catch {
    id = raw;
  }
  const el = document.getElementById(id);
  if (!el || !el.matches("main section")) return;
  el.classList.add("visible");
  observer.unobserve(el);
}

window.addEventListener("hashchange", revealSectionFromHash);

// Run after observer is wired; rAF + delayed pass catches iOS/WebKit fragment scroll settling.
requestAnimationFrame(revealSectionFromHash);
setTimeout(revealSectionFromHash, 0);
setTimeout(revealSectionFromHash, 150);
