import {html} from 'lit-html';

import Lazy from './../data/img/lazy.json';
import lazyStyles from './lazy.css';

export const tmplNav = (data) => html`
  <nav class="actions">
    <a class="btn" href="/film">
      Film
    </button>
    <a class="btn" href="/tv">
      TV
    </a>
    <a class="btn" href="/bookclub">
      Book Club
    </a>
    ${ data.hamburger ? html`
      <a id="hamburger" class="hamburger btn icon" href="#">
        <i class="material-icons">menu</i>
      </a>
    ` : html`` }
  </nav>
`

export const tmplHeader = (data) => html`
  <div class="overlay"></div>
  <div class="toolbar">
    <div class="brand">
      ${ data.clickableLogo === false ? html`
          <img class="profile" src="img/lc/logo.png" alt="LuckyChap Entertainment">
        ` : html`
          <a href="/">
            <img class="profile" src="img/lc/logo.png" alt="LuckyChap Entertainment">
          </a>
        `
      }
    </div>
    ${tmplNav({hamburger: true})}
  </div>
  ${ data.cover === "video" ? html`
      <video autoplay muted loop>
        <source src="${getWebm(data.videoSrc)}" type="video/webm">
        <source src="${data.videoSrc}" type="video/mp4">
      </video>
      <i class="material-icons more-indicator">arrow_downward</i>
    ` : html``
  }
  ${ data.cover === "img" ? html`
    ${getCoverImg(data)}
  `: html``
  }
  ${ data.title ? html`
    <h1 class="title">${data.title}</h1>
  `: html``
  }
`

function getCoverImg(data) {
  const destination = `img/${data.id}/cover.jpg`;
  const webp = destination.replace('jpg','webp');
  const matchLazy = Lazy.find(l => l.destination === destination);
  const lazyClass = lazyStyles[matchLazy.class];
  return html`
    <picture>
      <source data-srcset="${webp}" type='image/webp'>
      <img class="lazy ${lazyClass}" src="${matchLazy.placeholderGIF}" data-src="${destination}" alt="${data.title}">
    </picture>
  `
}

function getWebm(videoSrc) {
  return videoSrc.replace('mp4','webm');
}
