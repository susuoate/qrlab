import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectDirectory = dirname(dirname(fileURLToPath(import.meta.url)));
const iconMaster = join(projectDirectory, 'public', 'icons', 'master-app-icon.png');

function createIcoFromPngs(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(count, 4); // count

  let offset = 6 + count * 16;
  const dirEntries = [];
  for (const { width, height, buffer } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(buffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    dirEntries.push(entry);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers.map((p) => p.buffer)]);
}

async function run() {
  console.log('Generating Google Search compliant favicons and app icons from master-app-icon.png...');

  // 1. Google 48px multiple squares: 48x48, 96x96, 192x192, 512x512
  const b16 = await sharp(iconMaster).resize(16, 16).ensureAlpha().png().toBuffer();
  const b32 = await sharp(iconMaster).resize(32, 32).ensureAlpha().png().toBuffer();
  const b48 = await sharp(iconMaster).resize(48, 48).ensureAlpha().png().toBuffer();
  const b96 = await sharp(iconMaster).resize(96, 96).ensureAlpha().png().toBuffer();
  const b180 = await sharp(iconMaster).resize(180, 180).ensureAlpha().png().toBuffer();
  const b192 = await sharp(iconMaster).resize(192, 192).ensureAlpha().png().toBuffer();
  const b512 = await sharp(iconMaster).resize(512, 512).ensureAlpha().png().toBuffer();

  // Save standalone PNGs in public/icons/ and public/
  await writeFile(join(projectDirectory, 'public', 'icons', 'icon-48.png'), b48);
  await writeFile(join(projectDirectory, 'public', 'icons', 'icon-96.png'), b96);
  await writeFile(join(projectDirectory, 'public', 'icons', 'icon-192.png'), b192);
  await writeFile(join(projectDirectory, 'public', 'icons', 'icon-512.png'), b512);
  await writeFile(join(projectDirectory, 'public', 'icons', 'icon-maskable-512.png'), b512);
  await writeFile(join(projectDirectory, 'public', 'apple-touch-icon.png'), b180);

  // 2. Build multi-resolution .ico (16, 32, 48)
  const icoBuffer = createIcoFromPngs([
    { width: 16, height: 16, buffer: b16 },
    { width: 32, height: 32, buffer: b32 },
    { width: 48, height: 48, buffer: b48 },
  ]);

  await writeFile(join(projectDirectory, 'public', 'favicon.ico'), icoBuffer);
  await writeFile(join(projectDirectory, 'app', 'favicon.ico'), icoBuffer);

  // 3. Next.js App Router dynamic icon and apple-icon in app/
  await writeFile(join(projectDirectory, 'app', 'icon.png'), b512);
  await writeFile(join(projectDirectory, 'app', 'apple-icon.png'), b180);

  // 4. Update public/favicon.svg to embed the master icon as high-res vector wrapper
  const base64Png = b512.toString('base64');
  const svgContent = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <image width="512" height="512" xlink:href="data:image/png;base64,${base64Png}"/>
</svg>\n`;
  await writeFile(join(projectDirectory, 'public', 'favicon.svg'), svgContent, 'utf-8');

  console.log('Successfully generated all Google Search favicons, .ico, .svg, and Next.js app icons!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
