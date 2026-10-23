const links = Array.from(document.querySelectorAll('.sidebar nav a'));
const sections = links.map((link) => document.querySelector(link.getAttribute('href')));
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    links.forEach((link) => {
      if (link.getAttribute('href') === `#${entry.target.id}`) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  });
}, { rootMargin: '-10% 0px -65% 0px', threshold: 0 });
sections.forEach((section) => observer.observe(section));
document.querySelector('#print').addEventListener('click', () => window.print());
