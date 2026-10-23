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
let points = [];
let pointer = { x: 0, y: 0 };
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
  const opacity = Math.max(0, 1 - (now - lastMove) / 260);
  if (!opacity || !flowPreference.matches || document.hidden) {
    frame = 0;
    return;
  }
  points[0] = { ...pointer };
  for (let i = 1; i < points.length; i++) {
    points[i].x += (points[i - 1].x - points[i].x) * .28;
    points[i].y += (points[i - 1].y - points[i].y) * .28;
  }
  const tail = points[points.length - 1];
  if (Math.hypot(pointer.x - tail.x, pointer.y - tail.y) > 1) {
    const light = context.createLinearGradient(tail.x, tail.y, pointer.x, pointer.y);
    light.addColorStop(0, 'transparent');
    light.addColorStop(.5, `rgba(135, 197, 184, ${opacity * .35})`);
    light.addColorStop(1, `rgba(229, 236, 211, ${opacity * .7})`);
    for (const offset of [0, 5]) {
      context.beginPath();
      context.moveTo(points[0].x, points[0].y + offset);
      for (let i = 1; i < points.length - 1; i++) {
        context.quadraticCurveTo(points[i].x, points[i].y + offset,
          (points[i].x + points[i + 1].x) / 2, (points[i].y + points[i + 1].y) / 2 + offset);
      }
      context.strokeStyle = light;
      context.lineWidth = offset ? .6 : 1.4;
      context.stroke();
    }
  }
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
  pointer = { x: event.clientX, y: event.clientY };
  if (!frame) points = Array.from({ length: 24 }, () => ({ ...pointer }));
  lastMove = performance.now();
  if (!frame) frame = requestAnimationFrame(drawFlow);
}, { passive: true });
window.addEventListener('resize', resizeFlow, { passive: true });
flowPreference.addEventListener('change', updateFlowPreference);
updateFlowPreference();
