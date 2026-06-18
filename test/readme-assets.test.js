'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = path.resolve(__dirname, '..');

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

test('README links visual assets and GitHub release install', () => {
  const readme = read('README.md');
  for (const rel of [
    'assets/terminal-demo.gif',
    'assets/architecture.svg',
    'assets/before-after.svg'
  ]) {
    assert.equal(readme.includes(rel), true, rel + ' should be linked from README');
    assert.equal(fs.existsSync(path.join(ROOT, rel)), true, rel + ' should exist');
  }
  assert.match(readme, /github\/v\/release\/udaymanish6\/claudex-repo-setup/);
  assert.match(readme, /install-GitHub_release/);
  assert.match(readme, /github:udaymanish6\/claudex-repo-setup#v1\.0\.2/);
  assert.doesNotMatch(readme, new RegExp('create-claudex' + '@latest'));
  assert.doesNotMatch(readme, new RegExp('npm create ' + 'claudex'));
  assert.doesNotMatch(readme, /www\.npmjs\.com\/package\/create-claudex/);
  assert.match(readme, /tests-18%20passing/);
});

test('package tarball includes README assets', () => {
  const packageJson = require('../package.json');
  assert.equal(packageJson.files.includes('assets/'), true);
});
