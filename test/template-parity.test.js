'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = path.resolve(__dirname, '..');
const MEMORY_FILES = [
  'AGENT-activeContext.md',
  'AGENT-patterns.md',
  'AGENT-decisions.md',
  'AGENT-troubleshooting.md',
  'AGENT-config-variables.md'
];

const REQUIRED_CODEX_SKILL_MIRRORS = [
  'apply-thinking-to',
  'audit-session-metrics',
  'batch-operations-prompt',
  'ccusage-daily',
  'check-best-practices',
  'cleanup-context',
  'codex-docs-consultant',
  'consult-claude',
  'convert-to-test-driven-prompt',
  'convert-to-todowrite-tasklist-prompt',
  'create-readme-section',
  'create-release-note',
  'explain-architecture-pattern',
  'get-current-datetime',
  'refactor-code',
  'secure-prompts',
  'security-audit',
  'session-metrics',
  'task-breakdown',
  'update-memory-bank',
  'verify-codex-setup'
];

function walkFiles(base) {
  const files = [];
  function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else {
        files.push(path.relative(base, full).split(path.sep).join('/'));
      }
    }
  }
  walk(base);
  return files.sort();
}

function assertSameTree(left, right) {
  const leftFiles = walkFiles(left);
  const rightFiles = walkFiles(right);
  assert.deepEqual(leftFiles, rightFiles, 'file lists differ');
  for (const rel of leftFiles) {
    const leftContent = fs.readFileSync(path.join(left, rel));
    const rightContent = fs.readFileSync(path.join(right, rel));
    assert.deepEqual(leftContent, rightContent, rel);
  }
}

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function skillNames(base) {
  return fs.readdirSync(base, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function claudeAgentNames(base) {
  return fs.readdirSync(base)
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.replace(/\.md$/, ''))
    .sort();
}

function codexAgentNames(base) {
  return fs.readdirSync(base)
    .filter((name) => name.endsWith('.toml'))
    .map((name) => name.replace(/\.toml$/, ''))
    .sort();
}

test('dual Claude payload exactly matches claude-only payload', () => {
  assert.equal(read('templates/claude-only/CLAUDE.md'), read('templates/dual/CLAUDE.md'));
  assertSameTree(
    path.join(ROOT, 'templates/claude-only/.claude'),
    path.join(ROOT, 'templates/dual/.claude')
  );
});

test('dual Codex payload exactly matches codex-only payload', () => {
  assert.equal(read('templates/codex-only/AGENTS.md'), read('templates/dual/AGENTS.md'));
  assertSameTree(
    path.join(ROOT, 'templates/codex-only/.codex'),
    path.join(ROOT, 'templates/dual/.codex')
  );
  assertSameTree(
    path.join(ROOT, 'templates/codex-only/.agents'),
    path.join(ROOT, 'templates/dual/.agents')
  );
});

test('Codex contains native mirrors for portable Claude skill and command workflows', () => {
  const codex = skillNames(path.join(ROOT, 'templates/dual/.agents/skills'));
  for (const skill of REQUIRED_CODEX_SKILL_MIRRORS) {
    assert.equal(codex.includes(skill), true, 'missing Codex skill mirror: ' + skill);
    assert.equal(fs.existsSync(path.join(ROOT, 'templates/dual/.agents/skills', skill, 'SKILL.md')), true, 'missing SKILL.md for ' + skill);
  }
});

test('Claude and Codex share core agent concepts and Codex adds Claude CLI mirror', () => {
  const claude = claudeAgentNames(path.join(ROOT, 'templates/dual/.claude/agents'));
  const codex = codexAgentNames(path.join(ROOT, 'templates/dual/.codex/agents'));
  for (const agent of ['code-searcher', 'memory-bank-synchronizer', 'ux-design-expert']) {
    assert.equal(claude.includes(agent), true, 'Claude missing ' + agent);
    assert.equal(codex.includes(agent), true, 'Codex missing ' + agent);
  }
  assert.equal(claude.includes('codex-cli'), true);
  assert.equal(codex.includes('claude-cli'), true);
});

test('docs consultants are agent-specific', () => {
  const claude = skillNames(path.join(ROOT, 'templates/dual/.claude/skills'));
  const codex = skillNames(path.join(ROOT, 'templates/dual/.agents/skills'));
  assert.equal(claude.includes('claude-docs-consultant'), true);
  assert.equal(codex.includes('codex-docs-consultant'), true);
  assert.equal(codex.includes('claude-docs-consultant'), false);
});

test('all main instructions and guards reference the same memory-bank files', () => {
  const files = [
    'templates/dual/CLAUDE.md',
    'templates/dual/AGENTS.md',
    'templates/dual/.claude/hooks/memory_guard.py',
    'templates/dual/.codex/hooks/memory_guard.py',
    'templates/dual/.claude/commands/anthropic/update-memory-bank.md',
    'templates/dual/.claude/skills/update-memory-bank/SKILL.md',
    'templates/dual/.agents/skills/update-memory-bank/SKILL.md'
  ];
  for (const file of files) {
    const text = read(file);
    for (const memoryFile of MEMORY_FILES) {
      assert.equal(text.includes(memoryFile), true, file + ' missing ' + memoryFile);
    }
  }
});

test('Codex hook commands work in git and non-git project roots', () => {
  const hooks = JSON.parse(read('templates/dual/.codex/hooks.json'));
  const commands = [
    hooks.hooks.SessionStart[0].hooks[0].command,
    hooks.hooks.PreCompact[0].hooks[0].command,
    hooks.hooks.Stop[0].hooks[0].command,
    hooks.hooks.Stop[0].hooks[1].command
  ];
  for (const command of commands) {
    assert.match(command, /git rev-parse --show-toplevel 2>\/dev\/null \|\| pwd/);
    assert.match(command, /\$PROJECT_ROOT\/\.codex\/hooks\//);
  }
});

test('templates do not ship generated project memory or OS artifacts', () => {
  const files = walkFiles(path.join(ROOT, 'templates'));
  assert.equal(files.some((file) => file.endsWith('.DS_Store')), false);
  assert.equal(files.some((file) => file.startsWith('memory/') || file.includes('/memory/')), false);
  assert.equal(files.some((file) => /^AGENT-.*\.md$/.test(path.basename(file))), false);
});
