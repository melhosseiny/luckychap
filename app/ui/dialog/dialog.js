import {render} from 'lit-html';

import {tmpl} from './tmpl.js';

import dialogPolyfill from 'dialog-polyfill';

export function Dialog(spec) {
  let {id, toast, progress} = spec;

  let init = () => {
    let dialog = document.querySelector(id);

    dialogPolyfill.registerDialog(dialog);
    render(tmpl({}), dialog);

    let submitBtn = document.querySelector("#contact-dialog #submit-btn");
    let cancelBtn = document.querySelector("#contact-dialog #cancel-btn");
    let contactForm = document.querySelector("#contact-form");

    cancelBtn.addEventListener("click", () => close());
    contactForm.addEventListener("submit", (event) => submit(event, contactForm));
    if (!submitBtn.form) {
      submitBtn.addEventListener("click", (event) => submit(event, contactForm));
    }
  }

  let show = () => {
    document.querySelector(id).showModal();
  }

  let close = () => {
    document.querySelector(id).close();
  }

  let submit = (event, form) => {
    event.preventDefault();

    let object = {};
    if (new FormData().forEach) {
      new FormData(form).forEach((value, key) => {object[key] = value});
    } else {
      /* temp fix for IE11 */
      object[form.name.name] = form.name.value;
      object[form.email.name] = form.email.value;
      object[form.message.name] = form.message.value;
    }

    progress.display();
    fetch('/contact', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(object)
    })
    .then(response => {
      progress.hide();
      if (response.ok) {
        toast.display("Message sent!");
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .catch(error => toast.display("Uh oh! Message not sent."));

    close();
  }

  return Object.freeze({
    init,
    show,
    close,
    submit
  })
}
