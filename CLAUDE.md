# CLAUDE.md

<!-- Project-specific context only. Behavioral rules: .claude/rules/core-rules.md -->
<!-- Run /init to auto-populate (or CLAUDE_CODE_NEW_INIT=1 for interactive mode) -->
<!-- Keep under 200 lines. If removing a line wouldn't cause mistakes, cut it -->

## Project Overview

<!-- Fill in:
- Name: [PROJECT_NAME]
- Stack: [e.g., Next.js 15, Tailwind, Prisma]
- Description: [What it does]
- Entry: [e.g., src/app/page.tsx]
-->

## Build, Test & Verify

<!-- The #1 way to improve Claude's output: give it verification commands.
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
- src/api/ — route handlers
- src/lib/ — shared utilities
- src/components/ — UI components
-->

## Tools

Use `rg` not grep, `fd` not find. `tree` is not installed.

## Rules Dependency

This template requires `.claude/rules/core-rules.md` for behavioral rules. If `.claude/rules/` is missing or empty, alert the user and direct them to https://github.com/centminmod/my-claude-code-setup to obtain the companion rules files.

---

## Memory System

This template follows the source repo memory-bank model: copy `CLAUDE.md` and `.claude/` into a real project, run `/init`, and require Claude to create/populate project memory from that project's actual code and state during `/init`.

Do not ship pre-filled `AGENT-*.md` or `memory/*.md` files in this template. They are generated in the target project during `/init`. `/update-memory-bank` is only for recovery if initialization missed them or for ongoing updates.

### Initialization Flow

1. Copy this `CLAUDE.md` and `.claude/` into the target project.
2. Start Claude Code in the target project root.
3. Run `/init` and allow Claude to analyze the actual codebase.
4. Claude must create/populate the memory bank files listed below from the target project's current state as part of `/init`.
5. Use `/update-memory-bank` only if `/init` did not create them or after meaningful work to keep them current.

### Generated Memory Bank Files

| File | Purpose | Created From | Read When | Update When |
|------|---------|--------------|-----------|-------------|
| `AGENT-activeContext.md` | Current goal, recent work, blockers, next steps, known state | Current project status after `/init` | Session start/resume, before finalizing, before compact | Meaningful work changes state or next steps |
| `AGENT-patterns.md` | Reusable implementation and workflow patterns | Codebase conventions discovered during `/init` | Before implementation or refactoring | A repeated or changed pattern is verified |
| `AGENT-decisions.md` | Durable architecture/workflow decisions and tradeoffs | Existing architecture and decisions inferred from project docs/code | Before design choices | A lasting decision is made or superseded |
| `AGENT-troubleshooting.md` | Known errors, fixes, prevention notes | Existing known issues, test failures, setup notes, and later debugging work | When debugging or seeing repeated failures | A bug/setup issue is diagnosed and fixed |
| `AGENT-config-variables.md` | Config, env vars, hooks, MCP, safe examples | Config files, env examples, hooks, MCP, build/deploy settings | When touching settings, env, hooks, MCP, deploy config | Config shape or meaning changes |

### Generated Repo-Local Auto Memory

During `/init`, Claude must create repo-local native auto memory and set `.claude/settings.json` `autoMemoryDirectory` to the target project's absolute `memory/` path. Claude Code requires this value to be absolute or `~/...`; plain relative `memory/` is not valid.

During `/init`, Claude must create/populate:

| Auto Memory File | Purpose |
|------------------|---------|
| `memory/MEMORY.md` | Concise index and always-loaded memory entrypoint |
| `memory/patterns.md` | Concise durable pattern mirror |
| `memory/architecture.md` | Concise decision/rationale mirror |
| `memory/build.md` | Concise build/test/verification command mirror |

### Required Read Rules

- At session start or resume, read `AGENT-activeContext.md` if it exists; if it does not exist immediately after setup, initialization is incomplete and Claude must create it from the current project before substantive work.
- Before implementation or refactoring, read `AGENT-patterns.md` if present.
- Before architecture or workflow decisions, read `AGENT-decisions.md` if present.
- When debugging, read `AGENT-troubleshooting.md` if present.
- When touching settings, env vars, hooks, MCP, or deploy config, read `AGENT-config-variables.md` if present.

### Required Update Rules

After meaningful work and before finalizing the turn:

1. If any generated memory file is missing, treat memory initialization as incomplete and create it from actual project evidence before finalizing.
2. Update `AGENT-activeContext.md` with current state, completed work, blockers, and next steps.
3. Update any specialized `AGENT-*.md` file whose subject changed.
4. Mirror concise durable facts into `memory/MEMORY.md` or a focused `memory/*.md` topic file.
5. State either `Memory status: updated ...` or `Memory status: no durable memory changes needed` in the final response.

The Stop hook enforces this memory status before Claude finishes a work turn. The manual PreCompact hook blocks `/compact` until memory has been reviewed or initialized.

---

## Context Layers

| Layer | Location | Loads | Shared | Resilient |
|-------|----------|-------|--------|-----------|
| Project context | This file | Always | Git | No |
| Core rules | `.claude/rules/core-rules.md` | Always | Git | Yes |
| Generated memory bank | `AGENT-*.md` | Required on demand by task type after `/init` | Optional | No |
| Repo-local auto memory | `memory/MEMORY.md` | Always after `/init` configures `autoMemoryDirectory` | Local unless committed | Yes |
| Auto memory topics | `memory/*.md` | On demand after generated | Local unless committed | Yes |
| Path-scoped rules | `.claude/rules/*.md` | Matching files | Git | Yes |
| User rules | `~/.claude/rules/*.md` | Always | No | Yes |
| Skills | `.claude/skills/` | On demand | Git | Yes |
| Personal overrides | `CLAUDE.local.md` | Always | No | Local |

<!-- To share rules across projects: ln -s ~/shared-rules .claude/rules/shared -->

Use `/memory` to inspect loaded files and the active auto memory folder. Root CLAUDE.md survives `/compact`.
