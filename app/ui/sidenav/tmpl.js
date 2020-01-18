import {html} from 'lit-html';

import style from './style.css';

export const tmpl = (data, slot) => html`
  ${slot}
`
