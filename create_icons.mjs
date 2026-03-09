import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';

// ISU-branded MyState icon as SVG
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#D4102E"/>
      <stop offset="50%" stop-color="#A00D24"/>
      <stop offset="100%" stop-color="#7A0A1C"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.3" cy="0.25" r="0.7">
      <stop offset="0%" stop-color="white" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#F1BE48"/>
      <stop offset="50%" stop-color="#FFD470"/>
      <stop offset="100%" stop-color="#F1BE48"/>
    </linearGradient>
    <linearGradient id="stripe" x1="0.7" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="#F1BE48" stop-opacity="0.22"/>
      <stop offset="50%" stop-color="#F1BE48" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#F1BE48" stop-opacity="0.22"/>
    </linearGradient>
    <clipPath id="roundClip">
      <rect x="0" y="0" width="512" height="512" rx="80" ry="80"/>
    </clipPath>
  </defs>

  <g clip-path="url(#roundClip)">
    <!-- Background -->
    <rect width="512" height="512" fill="url(#bg)"/>
    <rect width="512" height="512" fill="url(#glow)"/>

    <!-- Gold diagonal stripe -->
    <polygon points="369,0 383,0 157,512 143,512" fill="url(#stripe)"/>

    <!-- Campanile tower -->
    <g fill="rgba(255,255,255,0.93)">
      <!-- Spire tip -->
      <polygon points="256,41 253,71 259,71"/>
      <!-- Spire pole -->
      <rect x="254" y="31" width="4" height="14"/>
      <!-- Tower body -->
      <rect x="234" y="71" width="44" height="250" rx="2"/>
      <!-- Windows row 1 -->
      <rect x="241" y="101" width="8" height="18" rx="1" fill="rgba(160,13,36,0.55)"/>
      <rect x="263" y="101" width="8" height="18" rx="1" fill="rgba(160,13,36,0.55)"/>
      <!-- Windows row 2 -->
      <rect x="241" y="151" width="8" height="18" rx="1" fill="rgba(160,13,36,0.55)"/>
      <rect x="263" y="151" width="8" height="18" rx="1" fill="rgba(160,13,36,0.55)"/>
      <!-- Windows row 3 -->
      <rect x="241" y="201" width="8" height="18" rx="1" fill="rgba(160,13,36,0.55)"/>
      <rect x="263" y="201" width="8" height="18" rx="1" fill="rgba(160,13,36,0.55)"/>
      <!-- Windows row 4 -->
      <rect x="241" y="251" width="8" height="18" rx="1" fill="rgba(160,13,36,0.55)"/>
      <rect x="263" y="251" width="8" height="18" rx="1" fill="rgba(160,13,36,0.55)"/>
      <!-- Base pedestal -->
      <polygon points="226,321 286,321 294,352 218,352" />
    </g>

    <!-- "MY" text -->
    <text x="256" y="448" text-anchor="middle" font-family="Arial Black, Impact, sans-serif"
          font-weight="900" font-size="138" fill="white" letter-spacing="-2">MY</text>

    <!-- Gold underline -->
    <rect x="136" y="460" width="240" height="6" rx="3" fill="url(#goldLine)"/>

    <!-- Bottom shadow overlay -->
    <rect x="0" y="435" width="512" height="77" fill="url(#bg)" opacity="0.12"/>
  </g>
</svg>`;

async function generate() {
  mkdirSync('public/icons', { recursive: true });

  // 512px icon
  await sharp(Buffer.from(svg))
    .resize(512, 512)
    .png()
    .toFile('public/icons/icon-512.png');

  // 192px icon
  await sharp(Buffer.from(svg))
    .resize(192, 192)
    .png()
    .toFile('public/icons/icon-192.png');

  console.log('✓ Generated public/icons/icon-512.png (512x512)');
  console.log('✓ Generated public/icons/icon-192.png (192x192)');
}

generate().catch(console.error);
