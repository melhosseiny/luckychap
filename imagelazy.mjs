import Vibrant from 'node-vibrant'
import glob from 'glob';
import sizeOf from 'image-size';
import ffmpeg from 'fluent-ffmpeg';

import fs from 'fs';

const src = 'data/img';

let getPlaceholderGIF = function(width,height) {
  let binWidth = (width).toString(2).padStart(16,"0");
  let binHeight = (height).toString(2).padStart(16,"0");
  //console.log(binWidth, binHeight);

  let bytes = [binWidth.substring(8,16), binWidth.substring(0,8), binHeight.substring(8,16), binHeight.substring(0,8)];
  let hexBytes = bytes.map(b => parseInt(b,2).toString(16).padStart(2,"0"));

  let size = hexBytes.join("");
  //console.log(size);

  let header = Buffer.from('474946383961', 'hex');
  let logicalScreenDescriptor = Buffer.from(size + '800000', 'hex');
  let globalColorTable = Buffer.from('ffffff000000', 'hex');
  let graphicsControlExtension = Buffer.from('21f9040100000000', 'hex');
  let imageDescriptor = Buffer.from('2c00000000' + size + '00', 'hex');
  let imageData = Buffer.from('0200003b', 'hex');

  var gif = [
    header,
    logicalScreenDescriptor,
    globalColorTable,
    graphicsControlExtension,
    imageDescriptor,
    imageData
  ];

  return 'data:image/gif;base64,' + Buffer.concat(gif).toString('base64');
}

let getPlaceholderSVG = function(width, height) {
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 " + width + " " + height + "'%3E%3C/svg%3E";
}

let getPlaceholder = function(width,height) {
  let binWidth = (width-1).toString(2).padStart(14,"0");
  let binHeight = (height-1).toString(2).padStart(14,"0");
  let binSize = "0001" + binHeight + binWidth;
  //console.log(binWidth, binHeight, binSize);

  let bytes = [binSize.substring(0,8), binSize.substring(8,16), binSize.substring(16,24), binSize.substring(24,32)];
  let hexBytes = bytes.map(b => parseInt(b,2).toString(16).padStart(2,"0"));
  //console.log(bytes);
  //console.log(hexBytes);
  return 'data:image/webp;base64,' + Buffer.from("524946461a000000574542505650384c0d0000002f" + hexBytes.reverse().join("") + "071011118888fe0700",'hex').toString('base64');
}

let imageMetadata = [];

let files = glob.sync(src + "/**/*.{jpg,png}", {});
let palettes = files.map(async f => {
  let dimensions = sizeOf(f);
  // transparent webp placeholder 1px*1px
  let placeholder = getPlaceholder(dimensions.width, dimensions.height);
  // transparent gif placeholder 1px*1px
  let placeholderGIF = getPlaceholderGIF(dimensions.width, dimensions.height);
  let placeholderSVG = getPlaceholderSVG(dimensions.width, dimensions.height);
  let palette = Vibrant.from(f, {}).getPalette().catch(err => console.log(err));

  imageMetadata.push({
    destination: f.replace("data/",""),
    width: dimensions.width,
    height: dimensions.height,
    aspectRatio: dimensions.width / dimensions.height,
    placeholder: placeholder,
    placeholderGIF: placeholderGIF,
    placeholderSVG: placeholderSVG
  })
  return palette;
})

async function getImageMetadata () {
  let results = await Promise.all(palettes);
  results.forEach((palette, i) => {
    imageMetadata[i].color = palette.LightVibrant.getHex();
    imageMetadata[i].class = imageMetadata[i].destination.replace("/img","").split(".").join("-").split("/").join("-");
    imageMetadata[i].style = "img:global(:not(.yall-loaded))." + imageMetadata[i].class + " { background-color: " + imageMetadata[i].color + " }";
  })
  //console.log(imageMetadata);
  fs.writeFileSync('./data/img/lazy.json', JSON.stringify(imageMetadata, null, 2) , 'utf-8');
  //console.log(imageMetadata.map(img => img.style));
  fs.writeFileSync('./app/lazy.css', imageMetadata.map(img => img.style).join("\n"), 'utf-8');
}

getImageMetadata();

let videos = [
  'dist/vid/lc/hero.mp4',
  'dist/vid/lc/office.mp4'
]

ffmpeg.setFfmpegPath('ffmpeg.exe');
ffmpeg.setFfprobePath('ffprobe.exe');

let getVideoMetadata = async () => {
  const videoMetadata = await Promise.all(
    videos.map(video => {
      return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(video, (err, metadata) => resolve({
          destination: video,
          width: metadata.streams[0].width,
          height: metadata.streams[0].height,
          aspectRatio: metadata.streams[0].width / metadata.streams[0].height
        }));
      });
    })
  )
  fs.writeFileSync('./data/vid/lazy.json', JSON.stringify(videoMetadata, null, 2) , 'utf-8');
}

getVideoMetadata();
