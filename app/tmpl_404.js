import {html} from 'lit-html';

export const tmpl_404 = (data) => html`
  <article class="${data.id}">
    <p>Page not found.</p>
    <p>Go back to the <a href='/'>homepage</a>.</p>
  </article>
`
