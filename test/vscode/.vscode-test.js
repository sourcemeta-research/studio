const { defineConfig } = require('@vscode/test-cli');
const path = require('path');

const buildTestDir = path.resolve(__dirname, '../../build/test/vscode');

const config = {
  files: '../../build/test/vscode/**/*.test.js',
  cachePath: path.join(buildTestDir, '.vscode-test'),
  launchArgs: [
    '--user-data-dir', path.join(buildTestDir, '.vscode-test/user-data'),
    '--extensions-dir', path.join(buildTestDir, '.vscode-test/extensions')
  ],
  mocha: {
    ui: 'tdd',
    timeout: 20000,
    color: true
  }
};

if (!process.env.VSIX) {
  config.extensionDevelopmentPath = '../../vscode';
  config.launchArgs.push('--disable-extensions');
}

module.exports = defineConfig(config);
