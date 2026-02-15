#!/usr/bin/env node

/**
 * Agri-Vani Pre-GitHub Checklist
 * Run this to verify everything is ready for GitHub
 */

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  { file: 'README.md', type: 'documentation' },
  { file: 'LICENSE', type: 'legal' },
  { file: '.gitignore', type: 'git' },
  { file: 'CONTRIBUTING.md', type: 'documentation' },
  { file: 'SETUP.md', type: 'documentation' },
  { file: 'QUICKSTART.md', type: 'documentation' },
  { file: 'SECURITY.md', type: 'security' },
  { file: 'package.json', type: 'config' },
  { file: 'setup.bat', type: 'script' },
  { file: 'setup.sh', type: 'script' },
  { file: 'server/.env.example', type: 'config' },
  { file: 'client/.env.example', type: 'config' },
  { file: '.github/workflows/ci.yml', type: 'workflow' },
  { file: '.github/ISSUE_TEMPLATE/bug_report.md', type: 'template' },
  { file: '.github/ISSUE_TEMPLATE/feature_request.md', type: 'template' },
];

const requiredServerModules = [
  'express',
  'mongoose',
  'dotenv',
  'cors',
  'axios',
  'bcryptjs',
  'jsonwebtoken',
];

const requiredClientModules = [
  'axios',
  'expo',
  'react-native',
  '@react-navigation/native',
];

console.log('\n🌾 Agri-Vani GitHub Readiness Checklist\n');
console.log('═'.repeat(50) + '\n');

let allGood = true;

// Check required files
console.log('📋 Checking Required Files...\n');
requiredFiles.forEach((item) => {
  const filePath = path.join(__dirname, item.file);
  const exists = fs.existsSync(filePath);
  const icon = exists ? '✅' : '❌';
  const status = exists ? 'OK' : 'MISSING';
  console.log(`${icon} ${item.file.padEnd(45)} [${status}]`);
  if (!exists) allGood = false;
});

// Check server dependencies
console.log('\n📦 Checking Server Dependencies...\n');
try {
  const serverPackage = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'server/package.json'), 'utf8')
  );
  const serverDeps = { ...serverPackage.dependencies, ...serverPackage.devDependencies };

  requiredServerModules.forEach((mod) => {
    const exists = mod in serverDeps;
    const icon = exists ? '✅' : '⚠️ ';
    console.log(`${icon} ${mod.padEnd(45)} [${exists ? 'OK' : 'NOT FOUND'}]`);
  });
} catch (e) {
  console.log('⚠️  Could not read server/package.json');
}

// Check client dependencies
console.log('\n📦 Checking Client Dependencies...\n');
try {
  const clientPackage = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'client/package.json'), 'utf8')
  );
  const clientDeps = { ...clientPackage.dependencies, ...clientPackage.devDependencies };

  requiredClientModules.forEach((mod) => {
    const exists = mod in clientDeps;
    const icon = exists ? '✅' : '⚠️ ';
    console.log(`${icon} ${mod.padEnd(45)} [${exists ? 'OK' : 'NOT FOUND'}]`);
  });
} catch (e) {
  console.log('⚠️  Could not read client/package.json');
}

// Check environment files
console.log('\n🔐 Checking Environment Configuration...\n');
const serverEnvPath = path.join(__dirname, 'server/.env');
const clientEnvPath = path.join(__dirname, 'client/.env');

const serverEnvExists = fs.existsSync(serverEnvPath);
const clientEnvExists = fs.existsSync(clientEnvPath);

console.log(`${serverEnvExists ? '✅' : '⚠️ '} server/.env${serverEnvExists ? ' exists' : ' (create from .env.example)'}`);
console.log(`${clientEnvExists ? '✅' : '⚠️ '} client/.env${clientEnvExists ? ' exists' : ' (create from .env.example)'}`);

// Final summary
console.log('\n' + '═'.repeat(50) + '\n');

if (allGood && serverEnvExists && clientEnvExists) {
  console.log('✅ Everything is ready for GitHub!\n');
  console.log('Next steps:');
  console.log('1. git add .');
  console.log('2. git commit -m "docs: add comprehensive docs for GitHub"');
  console.log('3. git push origin main\n');
} else {
  console.log('⚠️  Some items need attention:\n');
  if (!allGood) {
    console.log('  • Create missing files (see list above)');
  }
  if (!serverEnvExists) {
    console.log('  • Create server/.env from server/.env.example');
  }
  if (!clientEnvExists) {
    console.log('  • Create client/.env from client/.env.example');
  }
  console.log('');
}
