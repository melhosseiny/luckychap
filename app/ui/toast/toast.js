import {render} from 'lit-html';

import {tmpl} from './tmpl.js';

export function Toast(spec) {
  let {id} = spec;

  let display = (message, delay = 3000) => {
    let toast = document.querySelector(id);

    render(tmpl({message: message}), toast);
    toast.classList.add('active');
    if (delay !== 0) {
      setTimeout(() => toast.classList.remove('active'), delay);
    }
  }

  let hide = () => {
    document.querySelector(id).classList.remove('active');
  }

  return Object.freeze({
    display,
    hide
  })
}
