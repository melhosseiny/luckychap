import {render} from 'lit-html';

import {tmpl} from './tmpl.js';

export function Progress(spec) {
  let {id} = spec;

  let display = () => {
    render(tmpl({}), document.querySelector(id));
    document.querySelector(id).classList.add('active');
  }

  let hide = () => {
    document.querySelector(id).classList.remove('active');
  }

  return Object.freeze({
    display,
    hide
  })
}
