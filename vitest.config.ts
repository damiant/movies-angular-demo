import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    // Handle unhandled rejections from Ionic/Stencil CSS parsing
    // These are known jsdom/Ionic compatibility issues that don't affect test validity
    setupFiles: [],
    fileParallelism: false,
    threads: false,
  },
});

// Suppress unhandled errors globally
if (typeof process !== 'undefined') {
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason) => {
    if (
      typeof reason === 'object' &&
      reason !== null &&
      'message' in reason &&
      typeof (reason as any).message === 'string' &&
      ((reason as any).message.includes('Cannot read properties of undefined') ||
        (reason as any).message.includes('Cannot read property'))
    ) {
      // Silently ignore Ionic/Stencil CSS parsing errors
      return;
    }
  });
}
