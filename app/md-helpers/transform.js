export function Transform(spec) {
  let lazyLoadImgNode = function(node, lazy, lazyStyles) {
    node._type = 'html_block';
    let matchLazy = lazy.filter(l => l.destination === node.destination)[0];
    node.literal = "<figure><picture><source data-srcset='" + matchLazy.destination.replace("png", "webp").replace("jpg", "webp") + "' type='image/webp'><img class='lazy " + lazyStyles[matchLazy.class] + "' src='" + matchLazy.placeholderSVG + "' data-src='" + matchLazy.destination + "' alt='Ghost released on meta'></picture></figure>"
    node.destination = null;
    node._parent._type = 'document';
    console.log(node);
    return node;
  }

  let lazyLoadImgInHtmlBlock = function(node, lazy, lazyStyles) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(node.literal, 'text/html');
    let imgs = doc.querySelectorAll('img');
    [...imgs].map(img => {
      let srcParts = img.src.split('/');
      let relPath = srcParts.slice(3,srcParts.length).join("/");
      let matchLazy = lazy.filter(l => l.destination === relPath)[0];
      //console.log(matchLazy);
      img.setAttribute('data-src', matchLazy.destination);
      img.setAttribute('src', matchLazy.placeholderSVG);
      img.classList.add('lazy');
      img.classList.add(lazyStyles[matchLazy.class]);

      let picture = doc.createElement('picture');
      let source = doc.createElement('source');
      source.setAttribute('type','image/webp');
      source.setAttribute('data-srcset', matchLazy.destination.replace("png","webp").replace("jpg","webp"));
      picture.appendChild(source);
      img.parentNode.insertBefore(picture,img);
      picture.appendChild(img);

    })
    let s = new XMLSerializer();
    let serializedDom = s.serializeToString(doc.body.children[0]).replace(' xmlns="http://www.w3.org/1999/xhtml"',"");
    //console.log(serializedDom);
    node.literal = serializedDom;
    return node;
  }

  return Object.freeze({
    lazyLoadImgNode,
    lazyLoadImgInHtmlBlock
  });
}
