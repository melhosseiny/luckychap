import {render} from 'lit-html';

import commonmark from 'commonmark';
import {Transform} from './../md-helpers/transform'

import {tmpl} from './tmpl.js';
import {tmpl_title} from './../tmpl_title.js';
import {tmplHeader} from './../tmpl_header.js';
import {tmpl_404} from './../tmpl_404.js';

import Lazy from './../../data/img/lazy.json';
import lazyStyles from './../lazy.css';

import {Progress} from './../ui/progress/progress';

let reader = new commonmark.Parser();
let writer = new commonmark.HtmlRenderer();
let transform = Transform();

let progress = Progress({id: "#progress"});

export function Project(spec) {
  let {id} = spec;

  let toTitleCase = function(s) {
    return s.replace(/_/g, ' ')[0].toUpperCase() +
      s.replace(/_/g, ' ').substr(1).toLowerCase();
  }

  let view = async function() {
    progress.display();
    try {
      let data = await import('../../data/'+ id + '.md');
      let parsed = reader.parse(data.default);
      var walker = parsed.walker();
      let event, node;

      while ((event = walker.next())) {
        node = event.node;
        //console.log(node)
        if (event.entering) {
          switch (node.type) {
            case 'html_block':
              if (node.literal.indexOf('img') !== -1 && node._htmlBlockType !== 2) {
                //console.log(node);
                transform.lazyLoadImgInHtmlBlock(node, Lazy, lazyStyles);
              }
              break;
            case 'image':
              transform.lazyLoadImgNode(node, Lazy, lazyStyles);
              break;
          }
        }
      }

      let markup = writer.render(parsed);

      progress.hide();
      document.querySelector('#header').dataset.cover = "img";
      render(tmpl_title({title: "LuckyChap Entertainment - " + toTitleCase(id)}), document.querySelector("title"));
      render(tmpl({id: id, markup: markup}), document.querySelector('#main'));
    } catch (error) {
      progress.hide();
      render(tmplHeader({title: "Uh oh"}), document.querySelector('#header'));
      render(tmpl_404({id: id}), document.querySelector('#main'));
      console.log("Routing error:", error.message);
    }
  }

  return Object.freeze({
    view
  })
}
