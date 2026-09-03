import sharp from 'sharp';

const svg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="spaceGlow" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#1E1645"/>
      <stop offset="45%" stop-color="#0F0C29"/>
      <stop offset="100%" stop-color="#050411"/>
    </radialGradient>
    
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F5D4"/>
      <stop offset="40%" stop-color="#7B2CBF"/>
      <stop offset="100%" stop-color="#FF007F"/>
    </linearGradient>

    <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F5D4" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#FF007F" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#7B2CBF" stop-opacity="0.2"/>
    </linearGradient>

    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Solid Background (No Transparency) -->
  <rect width="512" height="512" fill="url(#spaceGlow)"/>

  <!-- Ambient Celestial Glows -->
  <circle cx="256" cy="235" r="170" fill="#7B2CBF" opacity="0.18" filter="url(#glow)"/>
  <circle cx="330" cy="170" r="110" fill="#00F5D4" opacity="0.14" filter="url(#glow)"/>
  <circle cx="170" cy="290" r="90" fill="#FF007F" opacity="0.12" filter="url(#glow)"/>

  <!-- Starfield Dots -->
  <circle cx="110" cy="110" r="2" fill="#ffffff" opacity="0.6"/>
  <circle cx="420" cy="90" r="2.5" fill="#00F5D4" opacity="0.8"/>
  <circle cx="85" cy="380" r="2" fill="#ffffff" opacity="0.5"/>
  <circle cx="410" cy="400" r="3" fill="#FF007F" opacity="0.7"/>
  <circle cx="380" cy="260" r="1.5" fill="#ffffff" opacity="0.7"/>
  <circle cx="130" cy="210" r="2" fill="#00F5D4" opacity="0.6"/>

  <!-- Cosmic Orbital Rings behind Planet -->
  <ellipse cx="256" cy="236" rx="195" ry="68" transform="rotate(-28 256 236)" fill="none" stroke="url(#orbitGrad)" stroke-width="4" stroke-dasharray="6 10" opacity="0.4"/>
  <ellipse cx="256" cy="236" rx="185" ry="58" transform="rotate(-28 256 236)" fill="none" stroke="url(#orbitGrad)" stroke-width="6" opacity="0.75"/>

  <!-- Core Celestial Planet Emblem -->
  <circle cx="256" cy="236" r="110" fill="url(#spaceGlow)" stroke="url(#primaryGrad)" stroke-width="5"/>

  <!-- Stylized Monogram P (Plato + Pluto) -->
  <g transform="translate(212, 154)">
    <rect x="0" y="8" width="22" height="152" rx="11" fill="url(#primaryGrad)"/>
    <path d="M22 8 H64 C94 8 114 26 114 56 C114 86 94 104 64 104 H22 Z" fill="none" stroke="url(#primaryGrad)" stroke-width="22" stroke-linejoin="round" stroke-linecap="round"/>
    
    <!-- Radiant Cosmic Sparkle in P -->
    <circle cx="62" cy="56" r="14" fill="#00F5D4" filter="url(#glow)"/>
    <circle cx="62" cy="56" r="7" fill="#FFFFFF"/>
  </g>

  <!-- Front Orbital Ring Overlap -->
  <path d="M75 295 C115 338 240 326 385 220" fill="none" stroke="url(#primaryGrad)" stroke-width="8" stroke-linecap="round" filter="url(#glow)"/>
  <circle cx="370" cy="230" r="8" fill="#00F5D4" filter="url(#glow)"/>
  <circle cx="370" cy="230" r="4" fill="#FFFFFF"/>

  <!-- Developer Wordmark at bottom -->
  <g text-anchor="middle" font-family="'Segoe UI', -apple-system, sans-serif">
    <text x="256" y="440" font-size="25" font-weight="900" letter-spacing="7" fill="#FFFFFF">PLATOIS</text>
    <text x="256" y="468" font-size="16" font-weight="700" letter-spacing="9" fill="#00F5D4">PLUTONIAN</text>
  </g>
</svg>`;

async function run() {
  const outPath = 'C:\\Users\\oate_\\Desktop\\PlatoisPlutonian_Developer_Icon_512x512.png';
  await sharp(Buffer.from(svg))
    .resize(512, 512)
    .flatten({ background: '#050411' })
    .png()
    .toFile(outPath);

  await sharp(Buffer.from(svg))
    .resize(512, 512)
    .flatten({ background: '#050411' })
    .png()
    .toFile('store-assets/PlatoisPlutonian_Developer_Icon_512x512.png');

  console.log('Successfully generated developer icon at:', outPath);
}

run();
