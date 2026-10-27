const works = Array.from(document.querySelectorAll('[data-work]'));
const viewer = document.querySelector('.image-viewer');
const image = viewer.querySelector('.viewer-image');
const caption = viewer.querySelector('.viewer-caption');
const original = viewer.querySelector('.viewer-original');
const previous = viewer.querySelector('.viewer-prev');
const next = viewer.querySelector('.viewer-next');
let selected = 0;
let opener;

function showWork(index) {
  selected = (index + works.length) % works.length;
  const work = works[selected];
  image.src = work.href;
  image.alt = work.querySelector('img').alt;
  caption.textContent = `${work.dataset.title} · ${selected + 1} / ${works.length}`;
  original.href = work.href;
  previous.hidden = next.hidden = works.length < 2;
}

works.forEach((work, index) => work.addEventListener('click', (event) => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  opener = work;
  showWork(index);
  viewer.showModal();
}));

viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
previous.addEventListener('click', () => showWork(selected - 1));
next.addEventListener('click', () => showWork(selected + 1));
viewer.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') showWork(selected - 1);
  if (event.key === 'ArrowRight') showWork(selected + 1);
});
viewer.addEventListener('close', () => opener?.focus());
