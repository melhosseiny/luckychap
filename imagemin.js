import imagemin from 'imagemin';
import guetzli from 'imagemin-guetzli';
import pngquant from 'imagemin-pngquant';
import webp from 'imagemin-webp';

import fs from 'fs';
import path from 'path';

const src = 'data/img';
const out = 'dist/img';

// exceptions
let exceptions = [
  
]

let optimize = async function(dir, childDir) {
  const files = await imagemin([
    dir + '/*.{jpg,png}',
    ...exceptions.map(e => '!' + e)
  ], out + '/' + childDir, {
    plugins: [
      //guetzli({quality: 84}),
      pngquant({
        quality: [0.6, 0.8],
        strip: true
      })
    ]
  });

  console.log("Optimize JPG and PNG", childDir, files.length);
  //=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
}

let jpgToWebp = async function(dir, childDir) {
  const files = await imagemin([dir + '/*.jpg'], out + '/' + childDir, {
    plugins: [
      webp({
        quality: 80
      })
    ]
  });

  console.log("JPG to WebP", childDir, files.length);
}

let pngToWebp = async function(dir, childDir) {
  const files = await imagemin([
    dir + '/*.png',
    '!' + src + '/author_tools/tile.png',
    '!' + src + '/author_tools/word.png'
  ], out + '/' + childDir, {
    plugins: [
      webp({
        quality: 80
      })
    ]
  });

  console.log("PNG to WebP", childDir, files.length);
}

let pngToLosslessWebp = async function() {
  const files = await imagemin(exceptions, out + '/author_tools', {
    plugins: [
      webp({
        lossless: true
      })
    ]
  });

  console.log("PNG to lossless WebP", files.length);
}

fs.readdirSync(src).forEach( f => {
  let dirPath = path.join(src, f);
  //console.log(dirPath, f);
  if (fs.statSync(dirPath).isDirectory()) {
    optimize(dirPath, f);
    jpgToWebp(dirPath, f);
    pngToWebp(dirPath, f);
  }
});

pngToLosslessWebp();
exceptions.forEach((e) => fs.copyFileSync(e, e.replace(src, out)));
