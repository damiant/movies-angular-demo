#!/usr/bin/env node
/**
 * Patch @ionic/core package.json to add exports for components directory.
 * This fixes ES module resolution issues when running tests with Node.js/Vitest.
 * See: https://github.com/ionic-team/ionic-framework/issues/29618
 */

const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, '../node_modules/@ionic/core/package.json');

// Check if @ionic/core is installed
if (!fs.existsSync(pkgPath)) {
  console.log('⚠️  @ionic/core not found, skipping patch');
  process.exit(0);
}

try {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  
  // Check if exports already exist and have the components fix
  if (pkg.exports && pkg.exports['./components']) {
    console.log('✓ @ionic/core exports already patched');
    process.exit(0);
  }
  
  // Add exports field with components directory mapping
  pkg.exports = {
    "./components": {
      "import": "./components/index.js",
      "require": "./components/index.js"
    },
    "./components/*": {
      "import": "./components/*",
      "require": "./components/*"
    }
  };
  
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('✓ Patched @ionic/core package.json exports');
} catch (error) {
  console.error('❌ Failed to patch @ionic/core:', error.message);
  process.exit(1);
}
