# AGENTS.md

<!-- Project-specific context only. Codex config and hooks: .codex/ -->
<!-- Keep under 200 lines. If removing a line would not cause mistakes, cut it. -->

## Project Overview

<!-- Fill in:
- Name: [PROJECT_NAME]
- Stack: [e.g., Next.js 15, Tailwind, Prisma]
- Description: [What it does]
- Entry: [e.g., src/app/page.tsx]
-->

## Build, Test & Verify

<!-- The #1 way to improve Codex output: give it verification commands.
- Install: `bun install`
- Dev: `bun dev`
- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Type check: `bunx tsc --noEmit`
-->

## Code Style

<!-- Only what differs from defaults:
- 2-space indentation
- ES modules, named exports
-->

## Architecture

<!-- Key directories:
- src/api/ - route handlers
- src/lib/ - shared utilities
- src/components/ - UI components
-->

## Tools

Use `rg` not grep, `fd` not find. `tree` is not installed.


## Cross-Agent Synchronization

If this repository also contains Claude setup files (`CLAUDE.md` or `.claude/`), keep shared behavior mirrored across both agents.

- If this `AGENTS.md` memory or setup behavior changes, update `CLAUDE.md`.
- If `.codex/hooks/`, `.codex/hooks.json`, or `.codex/config.toml` changes, port equivalent behavior to `.claude/hooks/` or `.claude/settings.json`.
- If a `.agents/skills/` workflow changes shared behavior, update the matching `.claude/commands/` or `.claude/skills/` workflow.
- If `.codex/agents/*.toml` changes, update the matching `.claude/agents/*.md` when the behavior is useful in Claude.
- Keep `AGENT-*.md` as the shared repo memory-bank contract for both agents.

## Codex Setup

This project uses Codex-native setup files:

- `AGENTS.md` for durable project instructions.
- `.agents/skills/` for repo-shared Codex skills.
- `.codex/config.toml` for project Codex settings.
- `.codex/hooks.json` and `.codex/hooks/` for lifecycle hooks.
- `.codex/agents/` for custom Codex subagents.

Project-local `.codex/` config, hooks, rules, and agents load only when the project is trusted. Use `/hooks`, `/skills`, `/memories`, `/mcp`, and `/status` to inspect the active Codex setup.

---

## Memory System

This template uses explicit repo-local memory-bank files as the cross-agent project memory layer.

Do not ship pre-filled `AGENT-*.md` files in this template. They are generated in the target project from that project's actual code and state. Codex native memories under `~/.codex/memories/` are optional local recall and are not the source of truth for required project behavior.

### Initialization Flow

1. Copy `AGENTS.md`, `.agents/`, and `.codex/` into the target project.
2. Start Codex in the target project root and trust the project if prompted.
3. Use `/skills` to run `update-memory-bank`, or ask Codex to initialize the memory bank from the current project.
4. Codex must inspect actual project files before creating memory: project tree, build files, docs, configs, tests, and recent changes.
5. Use `update-memory-bank` after meaningful work or if memory files are missing/stale.

### Generated Memory Bank Files

| File | Purpose | Created From | Read When | Update When |
|------|---------|--------------|-----------|-------------|
| `AGENT-activeContext.md` | Current goal, recent work, blockers, next steps, known state | Current project status after setup | Session start/resume, before finalizing, before compact | Meaningful work changes state or next steps |
| `AGENT-patterns.md` | Reusable implementation and workflow patterns | Codebase conventions discovered during setup | Before implementation or refactoring | A repeated or changed pattern is verified |
| `AGENT-decisions.md` | Durable architecture/workflow decisions and tradeoffs | Existing architecture and decisions inferred from project docs/code | Before design choices | A lasting decision is made or superseded |
| `AGENT-troubleshooting.md` | Known errors, fixes, prevention notes | Existing known issues, test failures, setup notes, and later debugging work | When debugging or seeing repeated failures | A bug/setup issue is diagnosed and fixed |
| `AGENT-config-variables.md` | Config, env vars, hooks, MCP, safe examples | Config files, env examples, hooks, MCP, build/deploy settings | When touching settings, env, hooks, MCP, deploy config | Config shape or meaning changes |

### Required Read Rules

- At session start or resume, read `AGENT-activeContext.md` if it exists; if it does not exist after setup, create it from current project evidence before substantive work.
- Before implementation or refactoring, read `AGENT-patterns.md` if present.
- Before architecture or workflow decisions, read `AGENT-decisions.md` if present.
- When debugging, read `AGENT-troubleshooting.md` if present.
- When touching settings, env vars, hooks, MCP, or deploy config, read `AGENT-config-variables.md` if present.

### Required Update Rules

After meaningful work and before finalizing the turn:

1. If any generated memory file is missing, treat memory initialization as incomplete and create it from actual project evidence before finalizing.
2. Update `AGENT-activeContext.md` with current state, completed work, blockers, and next steps.
3. Update any specialized `AGENT-*.md` file whose subject changed.
4. Preserve historical/planning/troubleshooting context unless clearly obsolete.
5. State either `Memory status: updated ...` or `Memory status: no durable memory changes needed` in the final response.

The Stop hook is a best-effort guard for this memory status marker. The PreCompact hook reminds or blocks, depending on the installed Codex hook output contract, until memory has been reviewed or initialized.

---

## Context Layers

| Layer | Location | Loads | Shared | Resilient |
|-------|----------|-------|--------|-----------|
| Project context | `AGENTS.md` | At Codex session/run start | Git | No |
| Generated memory bank | `AGENT-*.md` | Required on demand by task type after setup | Optional | No |
| Repo skills | `.agents/skills/` | On demand | Git | Yes |
| Project Codex config | `.codex/config.toml` | Trusted projects only | Git | Yes |
| Project hooks | `.codex/hooks.json`, `.codex/hooks/` | Trusted projects only; reviewed via `/hooks` | Git | Yes |
| Project agents | `.codex/agents/*.toml` | Trusted projects only; explicit spawn | Git | Yes |
| Codex native memories | `~/.codex/memories/` | Optional local recall | No | Yes |

Use `/memories` to inspect Codex native memory settings. Use `AGENT-*.md` as the repo-visible project memory source of truth.
