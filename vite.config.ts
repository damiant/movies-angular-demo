/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
    // Suppress unhandled errors from Ionic components during tests
    onConsoleLog(log: string): false | void {
      if (log.includes('CSSStyleSheet') || log.includes('@ionic/core')) {
        return false;
      }
    },
  },
});
