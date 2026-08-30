import { access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectDirectory = dirname(dirname(fileURLToPath(import.meta.url)));
const icon = join(projectDirectory, 'public', 'icons', 'app-icon.svg');
const foreground = join(projectDirectory, 'public', 'icons', 'app-icon-foreground.svg');

const androidDensities = {
  mdpi: [48, 108],
  hdpi: [72, 162],
  xhdpi: [96, 216],
  xxhdpi: [144, 324],
  xxxhdpi: [192, 432],
};

for (const [density, [launcherSize, foregroundSize]] of Object.entries(androidDensities)) {
  const directory = join(projectDirectory, 'android', 'app', 'src', 'main', 'res', `mipmap-${density}`);
  await Promise.all([
    sharp(icon).resize(launcherSize, launcherSize).flatten({ background: '#07172f' }).png().toFile(join(directory, 'ic_launcher.png')),
    sharp(icon).resize(launcherSize, launcherSize).flatten({ background: '#07172f' }).png().toFile(join(directory, 'ic_launcher_round.png')),
    sharp(foreground).resize(foregroundSize, foregroundSize).png().toFile(join(directory, 'ic_launcher_foreground.png')),
  ]);
}

const iosIcon = join(projectDirectory, 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset', 'AppIcon-512@2x.png');
await sharp(icon).resize(1024, 1024).flatten({ background: '#07172f' }).removeAlpha().png().toFile(iosIcon);

const splashFiles = [
  'android/app/src/main/res/drawable/splash.png',
  ...['land', 'port'].flatMap((orientation) =>
    ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'].map(
      (density) => `android/app/src/main/res/drawable-${orientation}-${density}/splash.png`,
    ),
  ),
  'ios/App/App/Assets.xcassets/Splash.imageset/splash-2732x2732.png',
  'ios/App/App/Assets.xcassets/Splash.imageset/splash-2732x2732-1.png',
  'ios/App/App/Assets.xcassets/Splash.imageset/splash-2732x2732-2.png',
];

for (const relativePath of splashFiles) {
  const output = join(projectDirectory, relativePath);
  await access(output);
  const { width, height } = await sharp(output).metadata();
  const markSize = Math.round(Math.min(width, height) * 0.42);
  const mark = await sharp(icon).resize(markSize, markSize).png().toBuffer();
  const splash = await sharp({ create: { width, height, channels: 3, background: '#07172f' } })
    .composite([{ input: mark, gravity: 'center' }])
    .png()
    .toBuffer();
  await sharp(splash).toFile(output);
}

console.log('Generated QR LAB native icons and splash screens.');
