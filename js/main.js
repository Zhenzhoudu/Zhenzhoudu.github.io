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

const flowPreference = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
const flow = document.createElement('canvas');
flow.className = 'pointer-flow';
flow.setAttribute('aria-hidden', 'true');
const context = flow.getContext('2d');
let pointer = { x: 0, y: 0 };
let tail;
let lastMove = 0;
let frame = 0;

function resizeFlow() {
  const scale = Math.min(window.devicePixelRatio || 1, 1.5);
  flow.width = window.innerWidth * scale;
  flow.height = window.innerHeight * scale;
  context.setTransform(scale, 0, 0, scale, 0, 0);
}

function drawFlow(now) {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  const opacity = Math.max(0, 1 - (now - lastMove) / 140);
  if (!opacity || !tail || !flowPreference.matches || document.hidden) {
    frame = 0;
    tail = null;
    return;
  }
  const dx = pointer.x - tail.x;
  const dy = pointer.y - tail.y;
  const distance = Math.hypot(dx, dy);
  if (distance > 44) {
    tail.x = pointer.x - dx / distance * 44;
    tail.y = pointer.y - dy / distance * 44;
  }
  if (distance > 2) {
    const normal = { x: -dy / distance, y: dx / distance };
    const light = context.createLinearGradient(tail.x, tail.y, pointer.x, pointer.y);
    light.addColorStop(0, 'transparent');
    light.addColorStop(.6, `rgba(150, 191, 179, ${opacity * .08})`);
    light.addColorStop(1, `rgba(195, 215, 201, ${opacity * .18})`);
    for (const offset of [0, 2.5]) {
      context.beginPath();
      context.moveTo(tail.x + normal.x * offset, tail.y + normal.y * offset);
      context.quadraticCurveTo((tail.x + pointer.x) / 2 + normal.x * (3 + offset),
        (tail.y + pointer.y) / 2 + normal.y * (3 + offset), pointer.x, pointer.y);
      context.strokeStyle = light;
      context.lineWidth = offset ? .35 : .65;
      context.stroke();
    }
  }
  tail.x += (pointer.x - tail.x) * .4;
  tail.y += (pointer.y - tail.y) * .4;
  frame = requestAnimationFrame(drawFlow);
}

function updateFlowPreference() {
  if (flowPreference.matches) {
    document.body.append(flow);
    resizeFlow();
  } else {
    flow.remove();
    cancelAnimationFrame(frame);
    frame = 0;
  }
}

window.addEventListener('pointermove', (event) => {
  if (!flowPreference.matches || event.pointerType === 'touch') return;
  if (event.target.closest('p, h1, h2, h3, li, blockquote, figcaption, .post, .gallery-item, a, button, input, textarea, select, [contenteditable]')) {
    lastMove = 0;
    tail = null;
    return;
  }
  pointer = { x: event.clientX, y: event.clientY };
  if (!tail) tail = { ...pointer };
  lastMove = performance.now();
  if (!frame) frame = requestAnimationFrame(drawFlow);
}, { passive: true });
window.addEventListener('resize', resizeFlow, { passive: true });
flowPreference.addEventListener('change', updateFlowPreference);
updateFlowPreference();
