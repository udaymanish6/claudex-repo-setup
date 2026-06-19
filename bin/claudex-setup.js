#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATE_DIR = path.join(ROOT, 'templates');
const PACKAGE = require(path.join(ROOT, 'package.json'));
const GITHUB_RELEASE_PACKAGE = `https://github.com/udaymanish6/claudex-repo-setup/releases/download/v${PACKAGE.version}/create-claudex-${PACKAGE.version}.tgz`;
const MODES = new Set(['claude', 'codex', 'dual']);
const MODE_TO_TEMPLATE = {
  claude: 'claude-only',
  codex: 'codex-only',
  dual: 'dual'
};

function usage() {
  return `Claudex Setup

Usage:
  create-claudex --mode <claude|codex|dual> [--target <dir>] [--yes]
  create-claudex init --mode <claude|codex|dual> [--target <dir>] [--yes]
  create-claudex check [--mode <claude|codex|dual>] [--target <dir>]
  create-claudex --version

Examples:
  npm exec --yes --package "${GITHUB_RELEASE_PACKAGE}" -- create-claudex init --mode dual
  npm exec --yes --package "${GITHUB_RELEASE_PACKAGE}" -- create-claudex init --mode claude --target /path/to/project --yes
  npm exec --yes --package "${GITHUB_RELEASE_PACKAGE}" -- create-claudex check --mode dual --target .
`;
}

function parseArgs(argv) {
  const firstArg = argv[2];
  const hasExplicitCommand = Boolean(firstArg && !firstArg.startsWith('-'));
  const args = { command: firstArg ? (hasExplicitCommand ? firstArg : 'init') : null, mode: null, target: process.cwd(), yes: false, version: false, help: false };
  for (let i = hasExplicitCommand ? 3 : 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else if (arg === '--version' || arg === '-v') {
      args.version = true;
    } else if (arg === '--yes' || arg === '-y') {
      args.yes = true;
    } else if (arg === '--mode') {
      args.mode = argv[++i];
    } else if (arg.startsWith('--mode=')) {
      args.mode = arg.slice('--mode='.length);
    } else if (arg === '--target') {
      args.target = argv[++i];
    } else if (arg.startsWith('--target=')) {
      args.target = arg.slice('--target='.length);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function normalizeMode(mode) {
  if (!mode) return null;
  const normalized = mode.trim().toLowerCase();
  if (!MODES.has(normalized)) {
    throw new Error(`Invalid mode: ${mode}. Expected claude, codex, or dual.`);
  }
  return normalized;
}

function templatePathForMode(mode) {
  return path.join(TEMPLATE_DIR, MODE_TO_TEMPLATE[mode]);
}

function ensureTemplate(mode) {
  const templatePath = templatePathForMode(mode);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }
  return templatePath;
}

function listTopLevelEntries(templatePath) {
  return fs.readdirSync(templatePath, { withFileTypes: true }).map((entry) => entry.name).sort();
}

function pathType(filePath) {
  if (!fs.existsSync(filePath)) return 'missing';
  return fs.statSync(filePath).isDirectory() ? 'directory' : 'file';
}

function buildInstallPlan(mode, target) {
  const templatePath = ensureTemplate(mode);
  const entries = listTopLevelEntries(templatePath);
  const actions = entries.map((entry) => {
    const source = path.join(templatePath, entry);
    const destination = path.join(target, entry);
    return {
      entry,
      source,
      destination,
      exists: fs.existsSync(destination),
      type: pathType(destination)
    };
  });
  return { mode, templatePath, target, actions };
}

function printInstallPlan(plan) {
  console.log(`Mode: ${plan.mode}`);
  console.log(`Target: ${plan.target}`);
  console.log('Files to add:');
  for (const action of plan.actions) {
    const status = action.exists ? `exists as ${action.type}` : 'new';
    console.log(`  - ${action.entry} (${status})`);
  }
}

function assertNoConflicts(plan) {
  const conflicts = plan.actions.filter((action) => action.exists);
  if (conflicts.length === 0) return;
  const names = conflicts.map((action) => `${action.entry} (${action.type})`).join(', ');
  throw new Error(`Target already contains setup paths: ${names}. Initial setup does not merge or overwrite existing files.`);
}

function askConfirmation(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(`${question} [y/N] `, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'y' || answer.trim().toLowerCase() === 'yes');
    });
  });
}

function copyPlan(plan) {
  fs.mkdirSync(plan.target, { recursive: true });
  for (const action of plan.actions) {
    fs.cpSync(action.source, action.destination, {
      recursive: true,
      force: false,
      errorOnExist: true,
      preserveTimestamps: true
    });
  }
}

function requiredEntries(mode) {
  if (mode === 'claude') return ['CLAUDE.md', '.claude'];
  if (mode === 'codex') return ['AGENTS.md', '.agents', '.codex'];
  return ['CLAUDE.md', 'AGENTS.md', '.claude', '.agents', '.codex'];
}

function checkTarget(mode, target) {
  const modes = mode ? [mode] : ['claude', 'codex', 'dual'];
  const results = modes.map((item) => {
    const missing = requiredEntries(item).filter((entry) => !fs.existsSync(path.join(target, entry)));
    return { mode: item, missing };
  });
  return results;
}

function printCheckResults(results, target) {
  console.log(`Target: ${target}`);
  for (const result of results) {
    if (result.missing.length === 0) {
      console.log(`${result.mode}: ok`);
    } else {
      console.log(`${result.mode}: missing ${result.missing.join(', ')}`);
    }
  }
}

async function run() {
  const args = parseArgs(process.argv);
  if (args.version) {
    console.log(PACKAGE.version);
    return 0;
  }

  if (args.help || !args.command) {
    console.log(usage());
    return 0;
  }

  const command = args.command.trim().toLowerCase();
  const target = path.resolve(args.target || process.cwd());

  if (command === 'init') {
    const mode = normalizeMode(args.mode);
    if (!mode) throw new Error('Missing required --mode for init.');
    const plan = buildInstallPlan(mode, target);
    printInstallPlan(plan);
    assertNoConflicts(plan);
    if (!args.yes) {
      const confirmed = await askConfirmation('Apply this setup?');
      if (!confirmed) {
        console.log('Aborted.');
        return 1;
      }
    }
    copyPlan(plan);
    const results = checkTarget(mode, target);
    printCheckResults(results, target);
    if (results.some((result) => result.missing.length > 0)) return 1;
    console.log('Install complete.');
    return 0;
  }

  if (command === 'check') {
    const mode = normalizeMode(args.mode);
    const results = checkTarget(mode, target);
    printCheckResults(results, target);
    return results.some((result) => result.missing.length > 0) ? 1 : 0;
  }

  throw new Error(`Unknown command: ${args.command}`);
}

run()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  });
