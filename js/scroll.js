function initScroll() {
    const navLinks = document.querySelectorAll(".sidebar nav a");
    const sections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute("href")));
    const topBtn = document.getElementById("topBtn");

    function updateActive() {
        const fromTop = window.scrollY + window.innerHeight / 3;
        sections.forEach((section, index) => {
            if (!section) return;
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            if (fromTop >= top && fromTop < bottom) {
                navLinks.forEach(link => link.classList.remove("active"));
                navLinks[index].classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", () => {
        updateActive();
        topBtn.classList.toggle("visible", window.scrollY > 320);
    });

    updateActive();
}
