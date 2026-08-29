import assert from 'node:assert/strict';
import jpeg from 'jpeg-js';
import jsQR from 'jsqr';
import QRCode from 'qrcode';

const urls = [
  'https://example.com/',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://facebook.com/susuoate',
  'http://127.0.0.1:3000/test?mode=qr',
  'https://sub.example.co.th/products/42#details',
  'https://example.com/search?q=hello%20world&lang=th',
  'https://xn--12c2c3a.example/path',
  'https://example.com/%E0%B8%97%E0%B8%94%E0%B8%AA%E0%B8%AD%E0%B8%9A',
  'https://example.com/a-very-long-path/with/multiple/segments?campaign=qr-lab&source=jpeg&medium=test',
  'https://openai.com/',
  'https://github.com/susuoate/qrlab',
  'https://qrlab-th-public-plato-122b.vercel.app/',
];

function rasterize(symbol, scale = 10, margin = 4) {
  const moduleCount = symbol.modules.size;
  const width = (moduleCount + margin * 2) * scale;
  const data = new Uint8ClampedArray(width * width * 4);
  data.fill(255);

  for (let row = 0; row < moduleCount; row += 1) {
    for (let column = 0; column < moduleCount; column += 1) {
      if (!symbol.modules.data[row * moduleCount + column]) continue;
      const startX = (column + margin) * scale;
      const startY = (row + margin) * scale;

      for (let y = 0; y < scale; y += 1) {
        for (let x = 0; x < scale; x += 1) {
          const offset = ((startY + y) * width + startX + x) * 4;
          data[offset] = 18;
          data[offset + 1] = 59;
          data[offset + 2] = 58;
          data[offset + 3] = 255;
        }
      }
    }
  }

  return { data, width, height: width };
}

function decode(image) {
  return jsQR(image.data, image.width, image.height, {
    inversionAttempts: 'dontInvert',
  })?.data;
}

for (const url of urls) {
  const symbol = QRCode.create(url, { errorCorrectionLevel: 'H' });
  const lossless = rasterize(symbol);
  assert.equal(decode(lossless), url, `Lossless decode failed: ${url}`);

  const encodedJpeg = jpeg.encode({
    data: Buffer.from(lossless.data),
    width: lossless.width,
    height: lossless.height,
  }, 95);
  const decodedJpeg = jpeg.decode(encodedJpeg.data, {
    formatAsRGBA: true,
    useTArray: true,
  });
  const jpegImage = {
    data: new Uint8ClampedArray(decodedJpeg.data),
    width: decodedJpeg.width,
    height: decodedJpeg.height,
  };
  assert.equal(decode(jpegImage), url, `JPEG decode failed: ${url}`);
  console.log(`PASS ${url}`);
}

console.log(`\nDecoded ${urls.length} URLs successfully in lossless and JPEG formats.`);
