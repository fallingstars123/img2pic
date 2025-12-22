/*
 * PWA Boot File
 * This file registers the service worker for the PWA
 */

import { App } from 'vue';

export default async ({ app }: { app: App }) => {
  // Only register service worker in production or when explicitly enabled
  if (process.env.NODE_ENV === 'production' || process.env.DEV_PWA === 'true') {
    try {
      // Import the service worker registration file
      await import('../../src-pwa/register-service-worker.js');
      console.log('PWA boot file loaded successfully');
    } catch (error) {
      console.error('Failed to load PWA:', error);
    }
  } else {
    console.log('PWA is disabled in development mode. Set DEV_PWA=true to enable.');
  }
};