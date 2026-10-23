const gallery = document.querySelector('[data-gallery-source]');
const empty = document.querySelector('.empty-gallery');
const viewer = document.querySelector('.image-viewer');
const image = viewer.querySelector('.viewer-image');
const caption = viewer.querySelector('.viewer-caption');
const original = viewer.querySelector('.viewer-original');
const previous = viewer.querySelector('.viewer-prev');
const next = viewer.querySelector('.viewer-next');
let works = [];
let selected = 0;
let opener;

function showWork(index) {
  selected = (index + works.length) % works.length;
  const work = works[selected];
  image.src = work.image;
  image.alt = work.alt || work.title;
  caption.textContent = work.title;
  original.href = work.image;
  previous.hidden = next.hidden = works.length < 2;
}

fetch(gallery.dataset.gallerySource)
  .then((response) => {
    if (!response.ok) throw new Error('Gallery unavailable');
    return response.json();
  })
  .then((items) => {
    works = items;
    empty.hidden = works.length > 0;
    works.forEach((work, index) => {
      const figure = document.createElement('figure');
      figure.className = 'gallery-item';
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `查看作品：${work.title}`);
      const thumbnail = document.createElement('img');
      thumbnail.src = work.thumbnail || work.image;
      thumbnail.alt = work.alt || work.title;
      thumbnail.loading = 'lazy';
      button.append(thumbnail);
      const text = document.createElement('figcaption');
      const title = document.createElement('h2');
      title.textContent = work.title;
      text.append(title);
      if (work.description) {
        const description = document.createElement('p');
        description.textContent = work.description;
        text.append(description);
      }
      figure.append(button, text);
      gallery.append(figure);
      button.addEventListener('click', () => {
        opener = button;
        showWork(index);
        viewer.showModal();
      });
    });
  })
  .catch(() => { empty.hidden = false; });

viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
previous.addEventListener('click', () => showWork(selected - 1));
next.addEventListener('click', () => showWork(selected + 1));
viewer.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') showWork(selected - 1);
  if (event.key === 'ArrowRight') showWork(selected + 1);
});
viewer.addEventListener('close', () => opener?.focus());
