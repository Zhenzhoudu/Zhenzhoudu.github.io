async function initApp() {
    const loading = document.getElementById("loading");
    const topBtn = document.getElementById("topBtn");

    setTimeout(() => {
        loading.style.opacity = "0";
        loading.style.pointerEvents = "none";
        document.body.style.overflow = "auto";
    }, 850);

    document.querySelectorAll(".fade-up").forEach((node, index) => {
        window.setTimeout(() => node.classList.add("visible"), 120 * index);
    });

    topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    await initLanguage();
    initScroll();
    initAnimations();
}

document.addEventListener("DOMContentLoaded", initApp);
