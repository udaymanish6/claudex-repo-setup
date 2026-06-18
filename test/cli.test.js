'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const ROOT = path.resolve(__dirname, '..');
const CLI = path.join(ROOT, 'bin', 'claudex-setup.js');

function tempProject() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'claudex-setup-'));
}

function runCli(args, options = {}) {
  return spawnSync(process.execPath, [CLI, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    ...options
  });
}

test('prints usage when no arguments are provided', () => {
  const result = runCli([]);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /Usage:/);
  assert.match(result.stdout, /github:udaymanish6\/create-claudex#v/);
  assert.doesNotMatch(result.stdout, new RegExp('npm create ' + 'claudex'));
  assert.doesNotMatch(result.stdout, new RegExp('npx create-' + 'claudex'));
});

test('prints package version', () => {
  const packageJson = require('../package.json');
  const result = runCli(['--version']);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(result.stdout.trim(), packageJson.version);
});

test('init claude installs Claude files only', () => {
  const target = tempProject();
  const result = runCli(['init', '--mode', 'claude', '--target', target, '--yes']);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(fs.existsSync(path.join(target, 'CLAUDE.md')), true);
  assert.equal(fs.existsSync(path.join(target, '.claude')), true);
  assert.equal(fs.existsSync(path.join(target, 'AGENTS.md')), false);
  assert.equal(fs.existsSync(path.join(target, '.codex')), false);
});

test('init codex installs Codex files only', () => {
  const target = tempProject();
  const result = runCli(['init', '--mode', 'codex', '--target', target, '--yes']);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(fs.existsSync(path.join(target, 'AGENTS.md')), true);
  assert.equal(fs.existsSync(path.join(target, '.agents')), true);
  assert.equal(fs.existsSync(path.join(target, '.codex')), true);
  assert.equal(fs.existsSync(path.join(target, 'CLAUDE.md')), false);
  assert.equal(fs.existsSync(path.join(target, '.claude')), false);
});

test('init dual installs Claude and Codex files', () => {
  const target = tempProject();
  const result = runCli(['init', '--mode', 'dual', '--target', target, '--yes']);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  for (const entry of ['CLAUDE.md', 'AGENTS.md', '.claude', '.agents', '.codex']) {
    assert.equal(fs.existsSync(path.join(target, entry)), true, `${entry} should exist`);
  }
});

test('default command initializes when only mode is provided', () => {
  const target = tempProject();
  const result = runCli(['--mode', 'dual', '--target', target, '--yes']);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(fs.existsSync(path.join(target, 'CLAUDE.md')), true);
  assert.equal(fs.existsSync(path.join(target, 'AGENTS.md')), true);
});

test('init refuses to overwrite existing setup files', () => {
  const target = tempProject();
  fs.writeFileSync(path.join(target, 'CLAUDE.md'), 'existing instructions\n');

  const result = runCli(['init', '--mode', 'claude', '--target', target, '--yes']);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /already contains setup paths/);
  assert.equal(fs.readFileSync(path.join(target, 'CLAUDE.md'), 'utf8'), 'existing instructions\n');
});

test('check reports installed dual setup', () => {
  const target = tempProject();
  const install = runCli(['init', '--mode', 'dual', '--target', target, '--yes']);
  assert.equal(install.status, 0, install.stderr || install.stdout);

  const check = runCli(['check', '--mode', 'dual', '--target', target]);

  assert.equal(check.status, 0, check.stderr || check.stdout);
  assert.match(check.stdout, /dual: ok/);
});
