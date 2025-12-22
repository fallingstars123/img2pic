#!/usr/bin/env node

/*
 * Build PWA Script
 * This script builds the PWA version of the app with proper configurations
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Building img2pic PWA...\n');

try {
  // Check if all required files exist
  const requiredFiles = [
    'src-pwa/manifest.json',
    'src-pwa/custom-service-worker.js',
    'src-pwa/register-service-worker.js',
    'src-pwa/icons/icon-192x192.png',
    'src-pwa/icons/icon-512x512.png'
  ];

  console.log('📋 Checking required files...');
  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - Missing!`);
      process.exit(1);
    }
  }

  console.log('\n🔨 Building PWA with Quasar...');

  // Build the PWA
  execSync('quasar build -m pwa', { stdio: 'inherit' });

  console.log('\n✨ Build completed!');
  console.log('\n📁 Build artifacts are located in: dist/pwa');

  // Check if the build was successful
  const distDir = 'dist/pwa';
  if (fs.existsSync(distDir)) {
    const files = fs.readdirSync(distDir);
    console.log('\n📄 Generated files:');
    files.forEach(file => {
      console.log(`   - ${file}`);
    });
  }

  console.log('\n🎯 To test the PWA:');
  console.log('1. Run a local server in the dist/pwa directory');
  console.log('2. Open Chrome DevTools > Application > PWA');
  console.log('3. Check "Add to homescreen" availability');
  console.log('4. Test offline functionality');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}