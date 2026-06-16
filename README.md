# Claudex Setup

Claudex Setup is a reusable template for Claude Code, Codex, or projects that use both. It keeps each agent's native files separate while sharing one explicit project memory-bank convention.

## Template Modes

```text
templates/claude-only/  # CLAUDE.md + .claude/
templates/codex-only/   # AGENTS.md + .agents/ + .codex/
templates/dual/         # both native setups together
migration/              # one-agent-to-the-other migration guides
```

Generated project memory is not shipped in this template. Target projects create it from their real code and state.

## Shared Project Memory

Both Claude and Codex templates use the same generated memory-bank files:

```text
AGENT-activeContext.md
AGENT-patterns.md
AGENT-decisions.md
AGENT-troubleshooting.md
AGENT-config-variables.md
```

These files are the cross-agent project memory source of truth. Claude native memory and Codex native memories are optional tool-specific recall layers, not the shared repo contract.

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
cp -R templates/claude-only/CLAUDE.md templates/claude-only/.claude /path/to/project/
cd /path/to/project
claude
```

Inside Claude Code:

```text
/init
/hooks
/memory
/update-memory-bank
```

## Use Codex Only

```bash
cp -R templates/codex-only/AGENTS.md templates/codex-only/.agents templates/codex-only/.codex /path/to/project/
cd /path/to/project
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
cp -R templates/dual/CLAUDE.md templates/dual/AGENTS.md templates/dual/.claude templates/dual/.agents templates/dual/.codex /path/to/project/
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

## Maintenance Rules

- Keep the repo root as template documentation, not a live project setup.
- Do not commit generated `AGENT-*.md`, `memory/`, `.codex-home/`, or snapshots of `~/.codex/memories/`.
- Do not add root `.mcp.json`.
- Keep Claude files under `.claude/` and Codex files under `.codex/` or `.agents/`.
