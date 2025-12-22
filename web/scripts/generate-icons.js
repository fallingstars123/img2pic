#!/usr/bin/env node

/*
 * Generate PWA icons script
 * This script creates the required icon sizes for PWA from a base icon
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Icon sizes required for PWA
const requiredSizes = [
  72, 96, 128, 144, 152, 192, 384, 512
];

const srcDir = path.join(__dirname, '../src-pwa/icons');

function generateIconPlaceholder(size) {
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(srcDir, filename);

  // If icon doesn't exist, copy from the closest available size
  if (!fs.existsSync(filepath)) {
    const availableSizes = [96, 128].filter(s => fs.existsSync(path.join(srcDir, `icon-${s}x${s}.png`)));

    if (availableSizes.length > 0) {
      const closestSize = availableSizes[0]; // Use the first available size
      const srcPath = path.join(srcDir, `icon-${closestSize}x${closestSize}.png`);

      console.log(`⚠️  Icon ${filename} not found. Using icon-${closestSize}x${closestSize}.png as placeholder.`);

      // Create a copy of the available icon as placeholder
      fs.copyFileSync(srcPath, filepath);
    } else {
      console.log(`❌ No source icons available to generate ${filename}`);
    }
  } else {
    console.log(`✅ Icon ${filename} already exists`);
  }
}

function generateBadge() {
  const badgePath = path.join(srcDir, 'badge-72x72.png');
  if (!fs.existsSync(badgePath)) {
    const icon96Path = path.join(srcDir, 'icon-96x96.png');
    if (fs.existsSync(icon96Path)) {
      console.log('⚠️  Badge-72x72.png not found. Using icon-96x96.png as placeholder.');
      fs.copyFileSync(icon96Path, badgePath);
    } else {
      console.log('❌ No source icon available to generate badge-72x72.png');
    }
  } else {
    console.log('✅ Badge badge-72x72.png already exists');
  }
}

console.log('🎨 Generating PWA icons...\n');

// Generate all required icon sizes
requiredSizes.forEach(size => generateIconPlaceholder(size));

// Generate badge
generateBadge();

console.log('\n✨ Icon generation complete!');
console.log('\n📝 Note: For production, replace these placeholder icons with properly sized icons.');
console.log('   You should create icons specifically designed for each size for best results.');