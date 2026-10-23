(() => {
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let mode = 'auto';
  try {
    const saved = localStorage.getItem('zzdong-cv-theme');
    if (['auto', 'light', 'dark'].includes(saved)) mode = saved;
  } catch {}

  function applyTheme() {
    document.documentElement.dataset.theme = mode === 'auto'
      ? (systemTheme.matches ? 'dark' : 'light') : mode;
    document.querySelectorAll('[data-theme-choice]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === mode));
    });
  }

  applyTheme();
  systemTheme.addEventListener('change', applyTheme);
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    document.querySelectorAll('[data-theme-choice]').forEach((button) => {
      button.addEventListener('click', () => {
        mode = button.dataset.themeChoice;
        try { localStorage.setItem('zzdong-cv-theme', mode); } catch {}
        applyTheme();
      });
    });
  });
})();
