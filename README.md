# Claudex Setup

> One command to add Claude Code, Codex, or both to any project with a shared repo memory bank.

[![npm package](https://img.shields.io/badge/npm-create--claudex-CB3837?logo=npm&logoColor=white)](https://www.npmjs.com/package/create-claudex)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude_Code-ready-111827)](https://code.claude.com/)
[![Codex](https://img.shields.io/badge/Codex-ready-111827)](https://openai.com/codex/)

Claudex Setup is a dependency-free project initializer for AI coding setups. It gives you clean Claude-only, Codex-only, or dual-agent project files without making every new repo start from scratch.

```bash
npm create claudex -- --mode dual
```

Use it when you want Claude Code and Codex to keep their native files while sharing one explicit project memory convention.

## Why It Exists

Claude Code uses `CLAUDE.md` and `.claude/`. Codex uses `AGENTS.md`, `.codex/`, and `.agents/`. If you use both, the usual setup drifts fast: one agent learns a rule, the other does not; one hook changes, the other stays stale; memory gets scattered across local machine state.

Claudex solves the boring setup work:

- Native Claude files stay native.
- Native Codex files stay native.
- Shared project memory lives in repo-visible `AGENT-*.md` files.
- The installer refuses to overwrite existing setup files.
- The same template can start Claude-only, Codex-only, or dual-agent projects.

## Quick Start

Install into the current project:

```bash
cd /path/to/project
npm create claudex -- --mode dual
```

Choose the setup mode:

```bash
npm create claudex -- --mode claude  # CLAUDE.md + .claude/
npm create claudex -- --mode codex   # AGENTS.md + .agents/ + .codex/
npm create claudex -- --mode dual    # Claude and Codex together
```

Install into another folder:

```bash
npm create claudex -- --mode dual --target /path/to/project
```

Skip confirmation in scripts or CI:

```bash
npm create claudex -- --mode dual --target /path/to/project --yes
```

Verify an installed setup:

```bash
npx create-claudex check --mode dual --target /path/to/project
```

## What Gets Installed

| Mode | Command | Files | Best for |
|---|---|---|---|
| Claude only | `npm create claudex -- --mode claude` | `CLAUDE.md`, `.claude/` | Projects using Claude Code only |
| Codex only | `npm create claudex -- --mode codex` | `AGENTS.md`, `.agents/`, `.codex/` | Projects using Codex only |
| Dual agent | `npm create claudex -- --mode dual` | Claude + Codex files | Projects that want both agents aligned |

Template source folders:

```text
templates/claude-only/  # CLAUDE.md + .claude/
templates/codex-only/   # AGENTS.md + .agents/ + .codex/
templates/dual/         # both native setups together
migration/              # one-agent-to-the-other migration guides
```

Generated project memory is not shipped in this template. Target projects create it from their real code and state.

## Safety Model

The initializer is intentionally conservative. It refuses to overwrite any of these existing paths:

```text
CLAUDE.md
AGENTS.md
.claude/
.codex/
.agents/
```

`--yes` skips the confirmation prompt. It does not mean force overwrite.

For existing projects that already have agent files, use the migration guides as a manual review path instead of blindly replacing project instructions.

## Shared Project Memory

Both Claude and Codex templates use the same generated memory-bank files:

```text
AGENT-activeContext.md
AGENT-patterns.md
AGENT-decisions.md
AGENT-troubleshooting.md
AGENT-config-variables.md
```

These files are the cross-agent project memory source of truth. Claude native memory and Codex native memories are optional local recall layers; they are not the shared repo contract.

The split is deliberate:

| File | Purpose |
|---|---|
| `AGENT-activeContext.md` | Current goal, recent work, blockers, next steps |
| `AGENT-patterns.md` | Reusable implementation and testing patterns |
| `AGENT-decisions.md` | Durable architecture and workflow decisions |
| `AGENT-troubleshooting.md` | Known failures, root causes, fixes, prevention notes |
| `AGENT-config-variables.md` | Environment variables, config surfaces, safe examples |

## Claude vs Codex Mapping

| Purpose | Claude | Codex |
|---|---|---|
| Main instructions | `CLAUDE.md` | `AGENTS.md` |
| Settings/config | `.claude/settings.json` | `.codex/config.toml` |
| Hook config | `.claude/settings.json` hooks | `.codex/hooks.json` |
| Hook scripts | `.claude/hooks/` | `.codex/hooks/` |
| Skills/workflows | `.claude/skills/` | `.agents/skills/` |
| Slash commands | `.claude/commands/` | Convert reusable commands to `.agents/skills/` |
| Subagents | `.claude/agents/*.md` | `.codex/agents/*.toml` |
| Rules | `.claude/rules/*.md` | `AGENTS.md` plus optional `.codex/rules/*.rules` |
| MCP | Claude-specific config if needed | `[mcp_servers.*]` in `.codex/config.toml` |
| Shared memory | `AGENT-*.md` | `AGENT-*.md` |

## Use Claude Only

```bash
cd /path/to/project
npm create claudex -- --mode claude
claude
```

Inside Claude Code:

```text
/init
/hooks
/memory
/update-memory-bank
```

Claude should initialize project memory from the target project's actual code and state.

## Use Codex Only

```bash
cd /path/to/project
npm create claudex -- --mode codex
codex
```

Inside Codex:

```text
/status
/hooks
/skills
/memories
/mcp
```

Use the `update-memory-bank` skill to create or refresh `AGENT-*.md` from the current project.

## Use Both

```bash
cd /path/to/project
npm create claudex -- --mode dual
```

Claude and Codex then use their own native files while sharing `AGENT-*.md`.

Keep mirrored behavior aligned:

- If `CLAUDE.md` memory behavior changes, update `AGENTS.md`.
- If `AGENTS.md` memory behavior changes, update `CLAUDE.md`.
- If `.claude/hooks/` changes, port equivalent behavior to `.codex/hooks/`.
- If `.codex/hooks/` changes, port equivalent behavior to `.claude/hooks/`.
- If a Claude command is reusable in Codex, convert it to a skill under `.agents/skills/`.
- If a Codex skill changes shared workflow behavior, update the equivalent Claude command or skill.

## Migrate Later

Use `migration/claude-to-codex.md` when a project starts with Claude and later adds Codex.

Use `migration/codex-to-claude.md` when a project starts with Codex and later adds Claude.

Each migration adds the second agent setup and leaves the old setup untouched first. End every migration with a user decision:

```text
Do you want to keep the old agent files for dual-agent use, or remove them now and make this single-agent only?
```

## Codex Memory Note

Codex native memories live under `~/.codex/memories/` through `CODEX_HOME`. There is no documented project setting that redirects only native memories into a repo folder. For reusable projects, keep required memory in repo-visible `AGENT-*.md` files.

## Validation

Package validation:

```bash
npm test
npm run check
```

Template validation:

```bash
jq empty templates/claude-only/.claude/settings.json
jq empty templates/dual/.claude/settings.json
python3 -m py_compile templates/claude-only/.claude/hooks/*.py
python3 -m py_compile templates/dual/.claude/hooks/*.py
python3 -m py_compile templates/codex-only/.codex/hooks/*.py
python3 -m py_compile templates/dual/.codex/hooks/*.py
python3.11 -c 'import tomllib; tomllib.load(open("templates/codex-only/.codex/config.toml","rb")); tomllib.load(open("templates/dual/.codex/config.toml","rb"))'
jq empty templates/codex-only/.codex/hooks.json
jq empty templates/dual/.codex/hooks.json
git status --short
```

## Make The Repo Easier To Discover

For GitHub visibility, use a description that explains the value immediately:

```text
One-command Claude Code + Codex project setup with shared repo memory.
```

Recommended GitHub topics:

```text
claude-code codex agents ai-coding memory-bank developer-tools npm-create ai-agents
```

Useful launch checklist:

- Publish the npm package as `create-claudex`.
- Add the GitHub topics above.
- Pin the repo on your GitHub profile.
- Add a short terminal GIF or screenshot showing `npm create claudex -- --mode dual`.
- Post a concise demo to communities where Claude Code and Codex users already are.
- Lead with the problem: keeping `CLAUDE.md` and `AGENTS.md` aligned across projects.
- Ask for stars only after showing the one-command setup and safety behavior.

## Credits

Claudex Setup builds on Claude Code memory-bank ideas from George Liu / Centmin Mod's MIT-licensed [centminmod/my-claude-code-setup](https://github.com/centminmod/my-claude-code-setup), especially the `CLAUDE.md` memory-bank workflow, Template 3 progressive-disclosure direction, companion `.claude/rules/` pattern, and `/init`-driven project memory population.

This project repackages and narrows that work into a dependency-free npm initializer with Claude-only, Codex-only, and dual-agent modes, plus the shared `AGENT-*.md` memory-bank contract for projects that use both agents.

## Maintenance Rules

- Keep the repo root as template documentation, not a live project setup.
- Do not commit generated `AGENT-*.md`, `memory/`, `.codex-home/`, or snapshots of `~/.codex/memories/`.
- Do not add root `.mcp.json`.
- Keep Claude files under `.claude/` and Codex files under `.codex/` or `.agents/`.
