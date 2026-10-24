const menuButton = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".mobile-sidebar");
const backdrop = document.querySelector(".menu-backdrop");
const closeTriggers = document.querySelectorAll("[data-menu-close]");
const sidebarLinks = document.querySelectorAll(".sidebar-nav a");

function setMenuState(isOpen, restoreFocus = true) {
  if (!menuButton || !sidebar || !backdrop) return;

  document.body.classList.toggle("menu-open", isOpen);
  sidebar.classList.toggle("open", isOpen);
  backdrop.classList.toggle("open", isOpen);
  sidebar.setAttribute("aria-hidden", String(!isOpen));
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
  sidebar.inert = !isOpen;

  if (isOpen) {
    sidebar.querySelector(".sidebar-close")?.focus();
  } else if (restoreFocus) {
    menuButton.focus();
  }
}

if (menuButton && sidebar && backdrop) {
  sidebar.inert = true;

  menuButton.addEventListener("click", () => {
    setMenuState(!sidebar.classList.contains("open"));
  });

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => setMenuState(false));
  });

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false, false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sidebar.classList.contains("open")) {
      setMenuState(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 920 && sidebar.classList.contains("open")) {
      setMenuState(false, false);
    }
  });
}

const benefitTrack = document.querySelector(".benefit-track");

if (benefitTrack && benefitTrack.dataset.ready !== "true") {
  [...benefitTrack.children].forEach((benefit) => {
    const clone = benefit.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    benefitTrack.appendChild(clone);
  });
  benefitTrack.dataset.ready = "true";
}

document.querySelectorAll(".faq-item").forEach((item) => {
  const button = item.querySelector("button");
  const answer = item.querySelector(".faq-answer");
  if (!button || !answer) return;

  button.addEventListener("click", () => {
    const willOpen = !item.classList.contains("open");

    document.querySelectorAll(".faq-item.open").forEach((openItem) => {
      if (openItem === item) return;
      openItem.classList.remove("open");
      openItem.querySelector("button")?.setAttribute("aria-expanded", "false");
      openItem
        .querySelector(".faq-answer")
        ?.setAttribute("aria-hidden", "true");
    });

    item.classList.toggle("open", willOpen);
    button.setAttribute("aria-expanded", String(willOpen));
    answer.setAttribute("aria-hidden", String(!willOpen));
  });
});

const quickLinks = [
  ...document.querySelectorAll(".mobile-bottom-nav > a[href^='#']"),
];
const observedSections = quickLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

quickLinks[0]?.classList.add("active");

if ("IntersectionObserver" in window && observedSections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) return;

      quickLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${visibleEntry.target.id}`,
        );
      });
    },
    { rootMargin: "-30% 0px -58%", threshold: [0, 0.2, 0.5] },
  );

  observedSections.forEach((section) => sectionObserver.observe(section));
}
