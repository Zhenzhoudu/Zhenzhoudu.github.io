const translations = { zh: {}, en: {} };
let currentLanguage = "zh";

async function loadLanguageFiles() {
    try {
        const [zh, en] = await Promise.all([
            fetch("lang/zh.json").then(res => res.json()),
            fetch("lang/en.json").then(res => res.json()),
        ]);
        translations.zh = zh;
        translations.en = en;
    } catch (error) {
        console.error("Language files load failed:", error);
    }
}

function applyLanguage(lang) {
    currentLanguage = lang;
    document.querySelectorAll("[data-i18n]").forEach(node => {
        const key = node.dataset.i18n;
        if (translations[lang] && translations[lang][key]) {
            node.textContent = translations[lang][key];
        }
    });

    const button = document.getElementById("languageBtn");
    if (button) {
        button.textContent = lang === "zh" ? "English" : "中文";
    }
}

async function initLanguage() {
    await loadLanguageFiles();
    applyLanguage("zh");
    const button = document.getElementById("languageBtn");
    if (button) {
        button.addEventListener("click", () => {
            applyLanguage(currentLanguage === "zh" ? "en" : "zh");
        });
    }
}
