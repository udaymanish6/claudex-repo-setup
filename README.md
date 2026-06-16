# Claudex Setup

Claudex Setup is a reusable Claude Code project template. It gives a project a clean `CLAUDE.md`, a curated `.claude/` directory, memory-bank rules, hooks, slash commands, agents, and skills without adding stale source-repo files.

The template is intentionally small at the root:

```text
Claudex-Setup/
|-- CLAUDE.md
|-- README.md
`-- .claude/
```

Use it when you want a new or existing project to start with a consistent Claude Code setup.

## Requirements

- Claude Code installed and available on your machine.
- A target project folder where you want to use this setup.
- Basic terminal access.

No Node, Python package install, Docker setup, or MCP server is required by the template itself.

## Quick Start

From this template folder:

```bash
cp -R CLAUDE.md .claude /path/to/your/project/
cd /path/to/your/project
claude
```

Inside Claude Code, run:

```text
/init
```

Then ask Claude to verify the setup:

```text
Check this Claude setup, confirm memory is initialized, and tell me what files were created.
```

## What Gets Copied

Copy only these into a project:

- `CLAUDE.md`
- `.claude/`

Do not copy generated memory files from another project. Memory must be created from the target project's real code and current state.

## What This Template Includes

| Path | Purpose |
|------|---------|
| `CLAUDE.md` | Main project instructions, setup flow, and memory-bank contract |
| `.claude/settings.json` | Claude Code settings, hooks, model default, and memory toggle |
| `.claude/rules/` | Core behavioral rules used by the template |
| `.claude/hooks/` | Memory guard and terminal notification hooks |
| `.claude/commands/` | Reusable slash-command prompts |
| `.claude/agents/` | Subagents for memory sync, code search, UX review, datetime, and Codex CLI handoff |
| `.claude/skills/` | Reusable project skills |

## What This Template Does Not Include

This repository deliberately does not include:

- Generated `AGENT-*.md` memory-bank files.
- Generated `memory/` auto-memory files.
- Root `.mcp.json`.
- Project-specific changelog, license, Docker files, or stale source metadata.

Those files either belong to the target project or should be added only when that project actually needs them.

## Initialization Flow

After copying the template into a target project, `/init` should analyze that project and create project-specific memory.

Expected generated memory-bank files:

```text
AGENT-activeContext.md
AGENT-patterns.md
AGENT-decisions.md
AGENT-troubleshooting.md
AGENT-config-variables.md
```

Expected repo-local native memory files:

```text
memory/MEMORY.md
memory/patterns.md
memory/architecture.md
memory/build.md
```

The target project's `.claude/settings.json` should also set `autoMemoryDirectory` to the absolute path of that project's `memory/` directory.

Example:

```json
{
  "autoMemoryDirectory": "/Users/example/projects/my-app/memory"
}
```

A plain relative value like `memory/` is not used because the template expects an absolute or home-relative path.

## Daily Use

Use Claude Code normally after initialization. The template tells Claude when to read or update each memory file:

- Read `AGENT-activeContext.md` at session start or resume.
- Read `AGENT-patterns.md` before implementation or refactoring.
- Read `AGENT-decisions.md` before architecture or workflow decisions.
- Read `AGENT-troubleshooting.md` when debugging.
- Read `AGENT-config-variables.md` when touching settings, environment variables, hooks, MCP, or deployment config.

After meaningful work, Claude should update relevant memory and finish with one of these markers:

```text
Memory status: updated ...
Memory status: no durable memory changes needed
```

The Stop hook checks for that marker. The manual PreCompact hook blocks `/compact` until memory has been initialized or reviewed.

## Useful Commands

Inside Claude Code:

```text
/init
/memory
/update-memory-bank
/cleanup-context
```

From a terminal, useful checks are:

```bash
jq empty .claude/settings.json
find . -maxdepth 2 -type f | sort
git status --short
```

If the project has generated memory, you can inspect it with:

```bash
ls -la AGENT-*.md memory/
```

## MCP Policy

This template does not ship root `.mcp.json`.

If a project needs MCP servers, add them later for that specific project using Claude Code's current MCP workflow. Keep generic MCP config out of this template so the setup stays portable.

## Recommended First Prompt In A New Project

After copying the template and running `/init`, a good first prompt is:

```text
Verify this Claude Code setup end to end. Confirm CLAUDE.md, .claude/settings.json, hooks, rules, commands, agents, skills, generated AGENT-*.md files, and repo-local memory/ are valid for this project. Fix only setup issues.
```

## Maintaining This Template

When updating this template:

- Keep the root minimal: `CLAUDE.md`, `README.md`, `.claude/`, and `.git/`.
- Do not commit generated `AGENT-*.md` or `memory/` from a real project.
- Do not add root `.mcp.json` unless the template policy changes.
- Keep README instructions aligned with `CLAUDE.md` and `.claude/settings.json`.
- Run validation before committing.

Recommended validation:

```bash
jq empty .claude/settings.json
python3 -m py_compile .claude/hooks/*.py
git status --short
```

## Git

This folder is intended to be versioned as the clean source template. After editing, review the diff and commit the template files:

```bash
git status --short
git diff -- README.md CLAUDE.md .claude
git add README.md CLAUDE.md .claude
git commit -m "Initialize Claudex setup template"
```
