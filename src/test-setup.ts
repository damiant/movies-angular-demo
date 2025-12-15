import './polyfills';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock customElements if not available
if (typeof customElements === 'undefined') {
  (global as any).customElements = {
    define: () => {},
    get: () => undefined,
    whenDefined: () => Promise.resolve(),
  };
}

// Mock adoptedStyleSheets for Stencil/Ionic
// Create a class that extends Array to have the writable length property
class AdoptedStyleSheets extends Array<any> {}
Object.defineProperty(document, 'adoptedStyleSheets', {
  value: new AdoptedStyleSheets(),
  writable: true,
  configurable: true,
});

// Suppress unhandled promise rejections from Ionic CSS parsing in tests
// These don't affect test functionality
if (typeof process !== 'undefined') {
  const originalEmit = process.emit.bind(process);
  (process.emit as any) = function (event: string, error: any) {
    if (
      event === 'unhandledRejection' &&
      error?.message?.includes('length')
    ) {
      // Suppress CSS parsing errors from Ionic components
      return false;
    }
    return originalEmit.apply(process, arguments as any);
  };
}
