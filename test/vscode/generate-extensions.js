#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

if (process.argv.length !== 3) {
  console.error('Usage: generate-extensions.js <extension-directory>');
  process.exit(1);
}

const extensionDir = process.argv[2];
const packageJsonPath = path.join(extensionDir, 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.error(`Error: package.json not found at ${packageJsonPath}`);
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const extensionId = `${packageJson.publisher}.${packageJson.name}`;
const extensionDirName = path.basename(extensionDir);

const extensionsJson = [{
  identifier: {
    id: extensionId
  },
  version: packageJson.version,
  location: {
    $mid: 1,
    path: `/${extensionDirName}`,
    scheme: 'file'
  },
  relativeLocation: extensionDirName,
  metadata: {
    isApplicationScoped: false,
    isBuiltin: false,
    isSystem: false
  }
}];

console.log(JSON.stringify(extensionsJson));
