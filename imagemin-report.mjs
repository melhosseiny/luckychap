import imagemin from 'imagemin';
import guetzli from 'imagemin-guetzli';
import pngquant from 'imagemin-pngquant';
import webp from 'imagemin-webp';

import fs from 'fs';
import path from 'path';

const src = 'data/img';
const out = 'dist/img';

import glob from 'glob';

let formatPercent = function(ratio) {
  return Math.round(ratio * 100) + "%";
}

let formatBytes = function(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

let compare = function(ext) {
  let filesSrc = glob.sync(src + "/**/*." + ext, {});
  let filesOut = glob.sync(out + "/**/*.{jpg,png,webp}", {});
  filesSrc.forEach(f => {
    let srcSize = fs.statSync(f).size;
    let match = f.replace(src,out).replace("png","").replace("jpg","");
    let filesOut = glob.sync(match + "{jpg,png,webp}", {});
    console.log('\x1b[36m%s\x1b[0m', f, srcSize);
    filesOut.forEach(fo => {
      let outSize = fs.statSync(fo).size;
      let ratio = outSize / srcSize;
      let ext = fo.split(".")[fo.split(".").length-1];
      console.log(ratio > 1? "\x1b[31m" : "\x1b[0m", fo, outSize, formatPercent(ratio));
    })
  });
}

let filesOrigin = glob.sync(src + "/**/*.{jpg,png}", {});
let sizeOrigin = filesOrigin.map(f => fs.statSync(f).size);
let totalSizeOrigin = sizeOrigin.reduce((a,b) => a + b);
console.log("Origin total", formatBytes(totalSizeOrigin));

let filesWebp = glob.sync(out + "/**/*.webp", {});
let sizeWebp = filesWebp.map(f => fs.statSync(f).size);
let totalSizeWebp = sizeWebp.reduce((a,b) => a + b);
console.log("WebP total", formatBytes(totalSizeWebp), formatPercent(totalSizeWebp/totalSizeOrigin));

let filesJpgPng = glob.sync(out + "/**/*.{png,jpg}", {});
let sizeJpgPng = filesJpgPng.map(f => fs.statSync(f).size);
let totalSizeJpgPng = sizeJpgPng.reduce((a,b) => a + b);
console.log("JPG/PNG total", formatBytes(totalSizeJpgPng), formatPercent(totalSizeJpgPng/totalSizeOrigin));

compare("jpg");
compare("png");
