import {html} from 'lit-html';

import style from './style.css';

export const tmpl = (data) => html`
  <div class="${style.linearProgress} ${style.linearProgressPrimary}">
    <span class="${style.linearProgressInner}"></span>
  </div>
  <div class="${style.linearProgress} ${style.linearProgressSecondary}">
    <span class="${style.linearProgressInner}"></span>
  </div>
`
