import {html} from 'lit-html';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';

import './color.css';
import './typography.css';
import './layout.css';
import './button.css';
import './form.css';

import style from './style.css';

export const tmpl = (data) => html`
  <div class="row cards flex-wrap">
    ${data.projects.map((project) => html`
      <div id="card-${project.id}" class="flex-child" data-date="${project.year}">
      </div>
    `)}
  </div>
`
