const { defineConfig } = require('@vscode/test-cli');

module.exports = defineConfig({
  files: 'out/vscode/src/test/suite/**/*.test.js',
  launchArgs: [
    // Add --disable-extensions to avoid interference from other extensions
    '--disable-extensions'
  ],
  mocha: {
    ui: 'tdd',
    timeout: 20000,
    color: true
  }
});
