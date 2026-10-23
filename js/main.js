const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#primary-links');

function closeMenu(restoreFocus = false) {
  menu.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  if (restoreFocus) menuToggle.focus();
}

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-open', open);
});
menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.classList.contains('is-open')) closeMenu(true);
});
document.querySelector('#year').textContent = new Date().getFullYear();

const scenes = Array.from(document.querySelectorAll('.cover-scene'));
if (scenes.length) {
  const choices = Array.from(document.querySelectorAll('.scene-choice'));
  const pause = document.querySelector('.scene-pause');
  let active = 0;
  let timer;
  let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function showScene(index) {
    active = index;
    scenes.forEach((scene, i) => scene.classList.toggle('is-active', i === active));
    choices.forEach((choice, i) => {
      choice.classList.toggle('is-active', i === active);
      choice.setAttribute('aria-pressed', String(i === active));
    });
  }

  function updatePlayback() {
    clearInterval(timer);
    pause.setAttribute('aria-pressed', String(paused));
    pause.textContent = paused ? '播放轮播' : '暂停轮播';
    if (!paused) timer = setInterval(() => showScene((active + 1) % scenes.length), 14000);
  }

  choices.forEach((choice, i) => choice.addEventListener('click', () => {
    showScene(i);
    updatePlayback();
  }));
  pause.addEventListener('click', () => {
    paused = !paused;
    updatePlayback();
  });
  updatePlayback();
}
