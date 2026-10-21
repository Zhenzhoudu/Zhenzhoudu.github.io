const header = document.querySelector("#site-header");
const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#primary-links");
const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

function updateHeader() {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
}

function closeMenu({ restoreFocus = false } = {}) {
    menu?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (restoreFocus) menuToggle?.focus();
}

menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menu?.classList.toggle("is-open", !isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", () => closeMenu()));
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu?.classList.contains("is-open")) {
        closeMenu({ restoreFocus: true });
    }
});

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
    });
}, {
    rootMargin: "-35% 0px -55%",
    threshold: 0,
});

sections.forEach((section) => sectionObserver.observe(section));
document.querySelector("#year").textContent = new Date().getFullYear();
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
