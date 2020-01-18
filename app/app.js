// polyfills
import intersectionObserver from 'intersection-observer';
import 'whatwg-fetch';
import '@webcomponents/template';

import {render} from 'lit-html';
import {installRouter} from 'pwa-helpers/router.js';
import commonmark from 'commonmark';
import yall from 'yall-js';

import {Dialog} from './ui/dialog/dialog';
import {Progress} from './ui/progress/progress';
import {Toast} from './ui/toast/toast';
import {Card} from './ui/card/card';
import {Sidenav} from './ui/sidenav/sidenav';

import {Project} from './project/project.js';
import projects from './../data/projects.json';

import {tmpl} from './tmpl.js';
import {tmplNav, tmplHeader} from './tmpl_header.js';

let toTitleCase = function(s) {
  return s.replace(/_/g, ' ')[0].toUpperCase() +
    s.replace(/_/g, ' ').substr(1).toLowerCase();
}

let handleNavigation = function(location) {
  navigate(decodeURIComponent(location.pathname));
};

let navigate = function(path) {
  const page = path === '/' ? 'index' : path.slice(1);
  loadPage(page);
}

let progress = Progress({id: "#progress"});

const loadPage = function(page) {
  switch(page) {
    case 'index':
    case 'film':
    case 'tv':
    case 'bookclub':
      if (page === 'index') {
        document.querySelector('#header').dataset.cover = "video";
      }
      //progress.display();
      let filteredProjects = page === 'index' ? projects : projects.filter(project => project.type === page);
      filteredProjects = filteredProjects.sort((a, b) => b.year - a.year);
      if (page === 'index') {
        render(tmplHeader({clickableLogo: false, cover: "video", videoSrc: "vid/lc/hero.mp4"}), document.querySelector('#header'));
      } else {
        render(tmplHeader({title: {
          film: 'Film',
          tv: 'TV',
          bookclub: 'Book Club'
        }[page]}), document.querySelector('#header'));
      }
      render(tmpl({projects: filteredProjects}), document.querySelector('#main'));
      let cards = filteredProjects.map(project => Card({id: `#card-${project.id}`}));
      cards.forEach((card, i) => {
        card.init(filteredProjects[i])
      });
      break;
    case 'about':
    case 'jobs':
      document.querySelector('#header').dataset.cover = "video";
      render(tmplHeader({title: toTitleCase(page), cover: "video", videoSrc: "vid/lc/office.mp4"}), document.querySelector('#header'));
      Project({id: page}).view();
      break;
    case 'tos':
      render(tmplHeader({title: "Terms of Service"}), document.querySelector('#header'));
      Project({id: page}).view();
      break;
    case 'privacy':
      render(tmplHeader({title: "Privacy Policy"}), document.querySelector('#header'));
      Project({id: page}).view();
      break;
    default:
      document.querySelector('#header').dataset.cover = "img";
      let projectData = projects.find(project => project.id === page);
      render(tmplHeader({title: projectData ? projectData.title : toTitleCase(page), id: page, cover: projectData ? "img" : undefined}), document.querySelector('#header'));
      let project = Project({id: page});
      project.view();
  }
}

Event.prototype.composedPath = function() {
  return [];
}

installRouter((location) => handleNavigation(location));

// lazy loading
yall({
  observeChanges: true,
  observeRootSelector: "#main",
  events: {
    // The object key is sent as the first argument to `addEventListener`,
    // which is the event. The corresponding value can be the callback if you
    // don't want to send any options to `addEventListener`.
    load: function (event) {
      if (!event.target.classList.contains("lazy") && event.target.nodeName === "IMG") {
        event.target.classList.add("yall-loaded");
      }
    }
  }
});

// ui components
let toast = Toast({id: '#toast'});

let contactDialog = Dialog({id: '#contact-dialog', toast: toast, progress: progress});
contactDialog.init();

let contactBtn = document.querySelector("#contact-btn");
contactBtn.addEventListener("click", (event) => {
  event.preventDefault();
  contactDialog.show()
});

let sidenav = Sidenav({id: '#sidenav', slot: tmplNav({hamburger: false})});
let hamburgerBtn = document.querySelector("#hamburger");

hamburgerBtn.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  sidenav.toggle();
})

document.body.addEventListener("click", (event) => {
  if (sidenav.isActive() && !event.target.closest('#sidenav')) {
    sidenav.hide();
  }
})
