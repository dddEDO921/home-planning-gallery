const cards = Array.from(document.querySelectorAll('[data-photo]'));
const dialog = document.querySelector('dialog');
const large = document.querySelector('#large');
const title = document.querySelector('#photo-title');
const counter = document.querySelector('#counter');
let index = 0;
let returnFocus;

function show(nextIndex) {
  index = (nextIndex + cards.length) % cards.length;
  const card = cards[index];
  large.src = card.href;
  large.alt = card.dataset.photo;
  title.textContent = card.dataset.photo;
  counter.textContent = `${index + 1} / ${cards.length}`;
}

if (typeof dialog.showModal === 'function') {
  cards.forEach((card, position) => card.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    returnFocus = card;
    show(position);
    dialog.showModal();
  }));
  document.querySelector('#close').addEventListener('click', () => dialog.close());
  document.querySelector('#prev').addEventListener('click', () => show(index - 1));
  document.querySelector('#next').addEventListener('click', () => show(index + 1));
  dialog.addEventListener('close', () => returnFocus?.focus());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') show(index - 1);
    if (event.key === 'ArrowRight') show(index + 1);
  });
}
