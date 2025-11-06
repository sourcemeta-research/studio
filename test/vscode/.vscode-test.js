const { defineConfig } = require('@vscode/test-cli');
const path = require('path');

const buildTestDir = path.resolve(__dirname, '../../build/test/vscode');

module.exports = defineConfig({
  files: '../../build/test/vscode/**/*.test.js',
  extensionDevelopmentPath: '../../vscode',
  cachePath: path.join(buildTestDir, '.vscode-test'),
  launchArgs: [
    '--user-data-dir', path.join(buildTestDir, '.vscode-test/user-data'),
    '--extensions-dir', path.join(buildTestDir, '.vscode-test/extensions'),
    // Add --disable-extensions to avoid interference from other extensions
    '--disable-extensions'
  ],
  mocha: {
    ui: 'tdd',
    timeout: 20000,
    color: true
  }
});
