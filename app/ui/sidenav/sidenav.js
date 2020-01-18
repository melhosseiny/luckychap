import {render} from 'lit-html';

import {tmpl} from './tmpl.js';

export function Sidenav(spec) {
  let {id, slot} = spec;

  let init = () => {
    let sidenav = document.querySelector(id);

    render(tmpl({}, slot), sidenav);
  }

  init();

  let display = () => {
    sidenav.classList.add('active');
  }

  let hide = () => {
    document.querySelector(id).classList.remove('active');
  }

  let toggle = () => {
    if (isActive()) {
      hide();
    } else {
      display();
    }
  }

  let isActive = () => {
    return sidenav.classList.contains('active');
  }

  return Object.freeze({
    display,
    hide,
    toggle,
    isActive
  })
}
