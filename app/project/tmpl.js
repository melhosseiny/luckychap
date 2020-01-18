import {html} from 'lit-html';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';

import style from './style.css';

export const tmpl = (data) => html`
<article class="${data.id}">
  ${unsafeHTML(data.markup)}
</article>
`
