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
  caption.textContent = `${work.title} · ${selected + 1} / ${works.length}`;
  original.href = work.image;
  previous.hidden = next.hidden = works.length < 2;
}

fetch(gallery.dataset.gallerySource)
  .then((response) => {
    if (!response.ok) throw new Error('Gallery unavailable');
    return response.json();
  })
  .then((items) => {
    works = gallery.dataset.galleryAlbum ? items.filter((work) => work.album === gallery.dataset.galleryAlbum) : items;
    empty.hidden = works.length > 0;
    let group = '';
    let row;
    let rowKey = '';
    works.forEach((work, index) => {
      if (work.group && work.group !== group) {
        group = work.group;
        const heading = document.createElement('h2');
        heading.className = 'album-subheading';
        heading.id = group === '北京' ? 'beijing-city' : 'beijing-pool';
        heading.textContent = group;
        gallery.append(heading);
      }
      const figure = document.createElement('figure');
      figure.className = 'gallery-item';
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `查看作品：${work.title}`);
      const thumbnail = document.createElement('img');
      thumbnail.src = work.thumbnail || work.image;
      thumbnail.alt = work.alt || work.title;
      thumbnail.loading = 'lazy';
      thumbnail.width = work.width;
      thumbnail.height = work.height;
      thumbnail.decoding = 'async';
      button.append(thumbnail);
      const text = document.createElement('figcaption');
      const title = document.createElement(work.group ? 'h3' : 'h2');
      title.textContent = work.title;
      text.append(title);
      if (work.description) {
        const description = document.createElement('p');
        description.textContent = work.description;
        text.append(description);
      }
      figure.append(button, text);
      if (gallery.classList.contains('photography')) {
        const key = `${work.group}-${work.row}`;
        if (key !== rowKey) {
          row = document.createElement('div');
          row.className = 'photo-row';
          gallery.append(row);
          rowKey = key;
        }
        figure.style.setProperty('--photo-ratio', work.width / work.height);
        row.append(figure);
      } else {
        gallery.append(figure);
      }
      button.addEventListener('click', () => {
        opener = button;
        showWork(index);
        viewer.showModal();
      });
    });
    gallery.querySelectorAll('.photo-row').forEach((row) => {
      const photos = Array.from(row.querySelectorAll('img'));
      row.style.setProperty('--row-ratio', photos.reduce((sum, photo) => sum + Number(photo.getAttribute('width')) / Number(photo.getAttribute('height')), 0));
      row.style.setProperty('--row-gaps', `${(photos.length - 1) * 24}px`);
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
