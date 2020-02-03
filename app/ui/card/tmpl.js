import {html} from 'lit-html';

import style from './style.css';

import Lazy from './../../../data/img/lazy.json';
import lazyStyles from './../../lazy.css';

export const tmpl = (data) => html`
  <a class="card ${data.type === 'bookclub'? ' compact' : ''}" href="/${data.id}">
    <article>
      <figure>
        ${getPicture(data)}
        <figcaption>
          ${data.year ? html`<time class="year">${data.year}</time>` : html``}
          ${data.title ? html`<h1>${data.title}</h1>` : html``}
          ${data.author ? html`<h2>${data.author}</h2>` : html``}
        </figcaption>
      </figure>
    </article>
  </a>
`

function getPicture(data) {
  const destination = `img/${data.id}/card.jpg`;
  const webp = destination.replace('jpg','webp');
  const matchLazy = Lazy.find(l => l.destination === destination);
  const lazyClass = lazyStyles[matchLazy.class];
  return html`
    <picture>
      <source data-srcset="${webp}" type='image/webp'>
      <img style="--aspect-ratio: ${matchLazy.aspectRatio}; min-width: ${getMinWidth(matchLazy.aspectRatio, 200)}px" class="lazy ${lazyClass}" src="${matchLazy.placeholderSVG}" data-src="${destination}" alt="${data.title}">
    </picture>
  `
}

function getMinWidth(aspectRatio, height) {
  return aspectRatio * height;
}
