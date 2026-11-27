const lightingControl = document.querySelector('[data-lighting]');
const lightingButtons = [...lightingControl.querySelectorAll('button')];
const variants = [];

function nightAsset(path) {
  return 'night/' + path.split('?')[0];
}

for (const image of document.querySelectorAll('main .card img')) {
  const source = image.getAttribute('src');
  if (!source.startsWith('images/') || source.startsWith('images/evening/')) continue;
  const link = image.closest('a');
  const href = link.hasAttribute('data-photo') ? link.getAttribute('href') : null;
  const srcset = image.getAttribute('srcset');
  const nightSet = srcset?.split(',').map(entry => {
    const [path, width] = entry.trim().split(/\s+/);
    return nightAsset(path) + ' ' + width;
  }).join(', ');
  variants.push({image, link, source, href, srcset, nightSet});
}

function applyLighting(mode) {
  const night = mode === 'night';
  for (const {image, link, source, href, srcset, nightSet} of variants) {
    if (srcset) image.setAttribute('srcset', night ? nightSet : srcset);
    image.setAttribute('src', night ? nightAsset(source) : source);
    if (href) link.setAttribute('href', night ? nightAsset(href) : href);
  }
  for (const button of lightingButtons) {
    button.setAttribute('aria-pressed', String(button.value === mode));
  }
}

let lightingMode = 'night';
try {
  if (sessionStorage.getItem('ldk-lighting') === 'day') lightingMode = 'day';
} catch {}
applyLighting(lightingMode);
lightingControl.hidden = false;
for (const button of lightingButtons) {
  button.addEventListener('click', () => {
    applyLighting(button.value);
    try { sessionStorage.setItem('ldk-lighting', button.value); } catch {}
  });
}
window.addEventListener('pageshow', event => {
  if (event.persisted) {
    try { applyLighting(sessionStorage.getItem('ldk-lighting') === 'day' ? 'day' : 'night'); } catch {}
  }
});
