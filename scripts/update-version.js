#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { resolve } from 'path';

const root = resolve(process.cwd());

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function writeJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function readToml(path) {
  return readFileSync(path, 'utf-8');
}

function writeToml(path, content) {
  writeFileSync(path, content, 'utf-8');
}

function bumpVersion(current, type) {
  const [major, minor, patch] = current.split('.').map(Number);
  switch (type) {
    case 'major': return `${major + 1}.0.0`;
    case 'minor': return `${major}.${minor + 1}.0`;
    case 'patch': return `${major}.${minor}.${patch + 1}`;
    default:
      if (/^\d+\.\d+\.\d+$/.test(type)) return type;
      throw new Error(`Invalid version or bump type: ${type}. Use patch, minor, major, or x.y.z`);
  }
}

function updateTomlVersion(content, newVersion) {
  return content.replace(/^version\s*=\s*"[^"]+"/m, `version = "${newVersion}"`);
}

function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: node scripts/update-version.js <patch|minor|major|x.y.z>');
    process.exit(1);
  }

  const pkgPath = resolve(root, 'package.json');
  const cargoPath = resolve(root, 'src-tauri/Cargo.toml');
  const lockPath = resolve(root, 'package-lock.json');

  const pkg = readJson(pkgPath);
  const current = pkg.version;
  const next = bumpVersion(current, arg);

  console.log(`Updating version: ${current} -> ${next}`);

  // Update package.json
  pkg.version = next;
  writeJson(pkgPath, pkg);
  console.log('✓ package.json updated');

  // Update package-lock.json (name + version fields at top level)
  try {
    const lock = readJson(lockPath);
    if (lock.name === pkg.name) lock.version = next;
    if (lock.packages && lock.packages[''] && lock.packages[''].name === pkg.name) {
      lock.packages[''].version = next;
    }
    writeJson(lockPath, lock);
    console.log('✓ package-lock.json updated');
  } catch {
    console.log('⚠ package-lock.json not found or failed to update');
  }

  // Update Cargo.toml
  try {
    const cargo = readToml(cargoPath);
    const updatedCargo = updateTomlVersion(cargo, next);
    writeToml(cargoPath, updatedCargo);
    console.log('✓ src-tauri/Cargo.toml updated');
  } catch {
    console.log('⚠ src-tauri/Cargo.toml not found or failed to update');
  }

  // Git commit
  execSync('git add package.json package-lock.json src-tauri/Cargo.toml', { stdio: 'inherit', cwd: root });
  execSync(`git commit -m "chore(release): v${next}"`, { stdio: 'inherit', cwd: root });

  // Git tag
  execSync(`git tag v${next}`, { stdio: 'inherit', cwd: root });

  // Push commit and tag separately to ensure tag is always pushed
  execSync('git push origin main', { stdio: 'inherit', cwd: root });
  execSync(`git push origin v${next}`, { stdio: 'inherit', cwd: root });

  console.log(`\n✅ Released v${next}`);
}

main();
