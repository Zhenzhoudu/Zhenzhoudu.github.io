function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");
}

function initDarkMode() {
    const darkmodeBtn = document.getElementById("darkmodeBtn");
    if (!darkmodeBtn) return;
    darkmodeBtn.addEventListener("click", toggleDarkMode);
}

document.addEventListener("DOMContentLoaded", initDarkMode);
