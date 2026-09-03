import sharp from 'sharp';

const width = 4096;
const height = 2304;

const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Deep Space Background Gradients -->
    <radialGradient id="spaceCenter" cx="55%" cy="48%" r="65%">
      <stop offset="0%" stop-color="#1B1340"/>
      <stop offset="35%" stop-color="#100C2B"/>
      <stop offset="70%" stop-color="#070617"/>
      <stop offset="100%" stop-color="#03030A"/>
    </radialGradient>

    <!-- Cosmic Aurora Waves -->
    <linearGradient id="aurora1" x1="0%" y1="30%" x2="100%" y2="70%">
      <stop offset="0%" stop-color="#00F5D4" stop-opacity="0.25"/>
      <stop offset="40%" stop-color="#7B2CBF" stop-opacity="0.35"/>
      <stop offset="80%" stop-color="#FF007F" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </linearGradient>

    <linearGradient id="aurora2" x1="100%" y1="20%" x2="0%" y2="80%">
      <stop offset="0%" stop-color="#0C79D8" stop-opacity="0.3"/>
      <stop offset="50%" stop-color="#6A00F4" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#FF007F" stop-opacity="0"/>
    </linearGradient>

    <!-- Vibrant Gradient for Geometry -->
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F5D4"/>
      <stop offset="50%" stop-color="#9D4EDD"/>
      <stop offset="100%" stop-color="#FF007F"/>
    </linearGradient>

    <linearGradient id="orbitGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F5D4" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#FF007F" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#7B2CBF" stop-opacity="0.1"/>
    </linearGradient>

    <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="40" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Solid Background (No Transparency) -->
  <rect width="${width}" height="${height}" fill="url(#spaceCenter)"/>

  <!-- Fluid Celestial Aurora Light Bands -->
  <path d="M-200,800 C800,400 1600,1400 2800,900 C3600,500 4200,1100 4400,1000 L4400,2400 L-200,2400 Z" fill="url(#aurora1)" />
  <path d="M-200,1400 C900,1700 2000,800 3100,1200 C3800,1500 4200,700 4400,600 L4400,0 L-200,0 Z" fill="url(#aurora2)" />

  <!-- Ambient Light Spheres -->
  <circle cx="2800" cy="1050" r="850" fill="#7B2CBF" opacity="0.16" filter="url(#softGlow)"/>
  <circle cx="3400" cy="800" r="550" fill="#00F5D4" opacity="0.14" filter="url(#softGlow)"/>
  <circle cx="1200" cy="1400" r="700" fill="#FF007F" opacity="0.09" filter="url(#softGlow)"/>

  <!-- Geometric Grid & Star Lines (Platonic Harmony) -->
  <g opacity="0.25" stroke="url(#accentGrad)" stroke-width="2" fill="none">
    <line x1="400" y1="400" x2="1100" y2="700" />
    <line x1="1100" y1="700" x2="800" y2="1300" />
    <line x1="800" y1="1300" x2="400" y2="400" />
    <circle cx="400" cy="400" r="8" fill="#00F5D4"/>
    <circle cx="1100" cy="700" r="6" fill="#FF007F"/>
    <circle cx="800" cy="1300" r="7" fill="#FFFFFF"/>

    <line x1="3300" y1="500" x2="3800" y2="850" />
    <line x1="3800" y1="850" x2="3500" y2="1450" />
    <line x1="3500" y1="1450" x2="3300" y2="500" />
    <circle cx="3300" cy="500" r="9" fill="#00F5D4"/>
    <circle cx="3800" cy="850" r="7" fill="#FF007F"/>
    <circle cx="3500" cy="1450" r="8" fill="#FFFFFF"/>
  </g>

  <!-- Big Cosmic Orbital Rings in Right/Center Area -->
  <g transform="translate(2650, 1120)">
    <!-- Huge Planetary Orbit Ellipses -->
    <ellipse cx="0" cy="0" rx="980" ry="320" transform="rotate(-26)" fill="none" stroke="url(#orbitGlow)" stroke-width="6" stroke-dasharray="16 24" opacity="0.45"/>
    <ellipse cx="0" cy="0" rx="920" ry="280" transform="rotate(-26)" fill="none" stroke="url(#orbitGlow)" stroke-width="10" opacity="0.8"/>
    
    <!-- Central Celestial Emblem -->
    <circle cx="0" cy="0" r="440" fill="url(#spaceCenter)" stroke="url(#accentGrad)" stroke-width="14"/>

    <!-- Monogram P Silhouette -->
    <g transform="translate(-170, -320)">
      <rect x="0" y="30" width="85" height="580" rx="42" fill="url(#accentGrad)"/>
      <path d="M85 30 H240 C350 30 430 100 430 215 C430 330 350 400 240 400 H85 Z" fill="none" stroke="url(#accentGrad)" stroke-width="85" stroke-linejoin="round" stroke-linecap="round"/>
      <circle cx="235" cy="215" r="50" fill="#00F5D4" filter="url(#softGlow)"/>
      <circle cx="235" cy="215" r="25" fill="#FFFFFF"/>
    </g>

    <!-- Front Overlapping Orbital Arc -->
    <path d="M-820,240 C-600,450 10,420 720, -20" fill="none" stroke="url(#accentGrad)" stroke-width="22" stroke-linecap="round" filter="url(#softGlow)"/>
    <circle cx="680" cy="10" r="30" fill="#00F5D4" filter="url(#softGlow)"/>
    <circle cx="680" cy="10" r="16" fill="#FFFFFF"/>
  </g>

  <!-- Branding Typography on Left Area -->
  <g transform="translate(480, 1160)" font-family="'Segoe UI', -apple-system, Roboto, sans-serif">
    <text x="0" y="0" font-size="124" font-weight="900" letter-spacing="24" fill="#FFFFFF">PLATOIS</text>
    <text x="0" y="110" font-size="78" font-weight="700" letter-spacing="34" fill="#00F5D4">PLUTONIAN</text>
    <text x="4" y="180" font-size="34" font-weight="400" letter-spacing="12" fill="rgba(255,255,255,0.65)">DIGITAL SOFTWARE &amp; INNOVATION LAB</text>
  </g>

  <!-- Fine Star Field Particles -->
  <circle cx="600" cy="300" r="4" fill="#ffffff" opacity="0.8"/>
  <circle cx="1500" cy="250" r="5" fill="#00F5D4" opacity="0.7"/>
  <circle cx="2100" cy="400" r="6" fill="#FF007F" opacity="0.6"/>
  <circle cx="1800" cy="1900" r="4" fill="#ffffff" opacity="0.7"/>
  <circle cx="3900" cy="350" r="6" fill="#00F5D4" opacity="0.9"/>
  <circle cx="3700" cy="2000" r="5" fill="#FF007F" opacity="0.8"/>
  <circle cx="350" cy="1950" r="4.5" fill="#00F5D4" opacity="0.6"/>
  <circle cx="2800" cy="2150" r="5" fill="#ffffff" opacity="0.7"/>
</svg>`;

async function run() {
  const outPathJpg = 'C:\\Users\\oate_\\Desktop\\PlatoisPlutonian_Developer_Header_4096x2304.jpg';
  const outPathStore = 'store-assets/PlatoisPlutonian_Developer_Header_4096x2304.jpg';

  // Render to JPEG with quality 85 to ensure 4K resolution stays well within 1 MB limit (around 500-700 KB)
  await sharp(Buffer.from(svg))
    .resize(width, height)
    .jpeg({ quality: 86, chromaSubsampling: '4:4:4' })
    .toFile(outPathJpg);

  await sharp(Buffer.from(svg))
    .resize(width, height)
    .jpeg({ quality: 86, chromaSubsampling: '4:4:4' })
    .toFile(outPathStore);

  console.log('Successfully generated developer header image at:', outPathJpg);
}

run();
