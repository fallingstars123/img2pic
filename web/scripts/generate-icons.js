#!/usr/bin/env node

/**
 * Generate PWA Icons from SVG
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.resolve(__dirname, '../public/icons');

// SVG icon template - pixel art style
const svgTemplate = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!-- Background -->
  <rect width="512" height="512" fill="#027be3" rx="64" ry="64"/>

  <!-- Pixel grid pattern -->
  <defs>
    <pattern id="pixelGrid" width="32" height="32" patternUnits="userSpaceOnUse">
      <rect width="32" height="32" fill="none" stroke="#ffffff" stroke-opacity="0.15" stroke-width="2"/>
    </pattern>
  </defs>

  <!-- Inner background with pixel grid -->
  <rect x="32" y="32" width="448" height="448" fill="#026bb5" rx="48" ry="48"/>
  <rect x="32" y="32" width="448" height="448" fill="url(#pixelGrid)" rx="48" ry="48"/>

  <!-- Pixel art icon - centered and scaled larger -->
  <g transform="translate(56, 116) scale(1.6)">
    <!-- Left side - image icon -->
    <rect x="0" y="16" width="64" height="48" fill="#ffffff" rx="4"/>
    <circle cx="24" cy="32" r="8" fill="#027be3"/>
    <path d="M8 48 L24 36 L36 44 L48 32 L56 40 L56 56 L8 56 Z" fill="#4fc3f7"/>

    <!-- Arrow -->
    <path d="M72 40 L104 40 L104 56 L128 40 L104 24 L104 40 Z" fill="#ffd54f"/>

    <!-- Right side - pixel grid -->
    <g fill="#ffffff">
      <!-- Row 1 -->
      <rect x="144" y="8" width="16" height="16" rx="2"/>
      <rect x="168" y="8" width="16" height="16" rx="2"/>
      <rect x="192" y="8" width="16" height="16" rx="2"/>
      <rect x="216" y="8" width="16" height="16" rx="2"/>
      <!-- Row 2 -->
      <rect x="144" y="32" width="16" height="16" rx="2"/>
      <rect x="168" y="32" width="16" height="16" rx="2"/>
      <rect x="192" y="32" width="16" height="16" rx="2"/>
      <rect x="216" y="32" width="16" height="16" rx="2"/>
      <!-- Row 3 -->
      <rect x="144" y="56" width="16" height="16" rx="2"/>
      <rect x="168" y="56" width="16" height="16" rx="2"/>
      <rect x="192" y="56" width="16" height="16" rx="2"/>
      <rect x="216" y="56" width="16" height="16" rx="2"/>
      <!-- Row 4 -->
      <rect x="144" y="80" width="16" height="16" rx="2"/>
      <rect x="168" y="80" width="16" height="16" rx="2"/>
      <rect x="192" y="80" width="16" height="16" rx="2"/>
      <rect x="216" y="80" width="16" height="16" rx="2"/>
    </g>

    <!-- Highlight pixels -->
    <rect x="160" y="24" width="8" height="8" fill="#4fc3f7" rx="1"/>
    <rect x="184" y="48" width="8" height="8" fill="#4fc3f7" rx="1"/>
    <rect x="208" y="72" width="8" height="8" fill="#4fc3f7" rx="1"/>
  </g>
</svg>
`.trim();

// Icon sizes needed for PWA
const iconSizes = [
  { size: 72, name: 'badge-72x72.png' },
  { size: 96, name: 'favicon-96x96.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'favicon-128x128.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
];

// Additional favicon sizes
const faviconSizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
];

async function generateIcons() {
  console.log('🎨 Generating PWA icons from SVG...\n');

  // Ensure icons directory exists
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // Create SVG buffer
  const svgBuffer = Buffer.from(svgTemplate);

  // Generate icons
  const allSizes = [...iconSizes, ...faviconSizes];

  for (const { size, name } of allSizes) {
    const outputPath = path.join(iconsDir, name);

    await sharp(svgBuffer, { density: 300 })
      .resize(size, size, {
        fit: 'cover',
        position: 'center',
        kernel: 'lanczos3'
      })
      .png({
        quality: 90,
        compressionLevel: 9
      })
      .toFile(outputPath);

    console.log(`✅ Generated ${name} (${size}x${size})`);
  }

  console.log('\n✨ All icons generated successfully!');
  console.log(`📁 Icons saved to: ${iconsDir}`);
}

generateIcons().catch(console.error);
