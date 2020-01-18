import {render} from 'lit-html';

import {tmpl} from './tmpl.js';

export function Card(spec) {
  let {id} = spec;

  let init = (data) => {
    let card = document.querySelector(id);
    console.log(id, card);

    render(tmpl(data), card);
  }

  return Object.freeze({
    init
  })
}
