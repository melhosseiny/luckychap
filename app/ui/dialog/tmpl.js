import {html} from 'lit-html';

import 'dialog-polyfill/dist/dialog-polyfill.css'
import style from './style.css';

export const tmpl = (data) => html`
  <form id="contact-form" action="" method="">
    <div>
      <label for="name">Name</label>
      <input name="name" required>
    </div>
    <div>
      <label for="email">E-mail</label>
      <input name="email" type=email required>
    </div>
    <div>
      <label for="message">Message</label>
      <textarea name="message" cols="10" required></textarea>
    </div>
  </form>
  <footer>
    <button id="cancel-btn">Cancel</button>
    <button type="submit" id="submit-btn" form="contact-form">Submit</button>
  </footer>
`
