---
name: update-memory-bank
description: Use when a project memory bank is missing, stale, or needs updating after meaningful work in a Codex project.
---

# Update Memory Bank

Recover or update the repo-local memory bank from actual project state.

## Required Flow

1. Read `AGENTS.md`.
2. Inspect the actual target project before writing memory: project tree, package/build files, docs, config, tests, and recently changed files.
3. If missing, create these root memory-bank files from project evidence:
   - `AGENT-activeContext.md`
   - `AGENT-patterns.md`
   - `AGENT-decisions.md`
   - `AGENT-troubleshooting.md`
   - `AGENT-config-variables.md`
4. Update `AGENT-activeContext.md` with current goal, completed work, blockers, next steps, and known working state.
5. Update specialized files only when relevant:
   - `AGENT-patterns.md` for reusable implementation/workflow patterns.
   - `AGENT-decisions.md` for durable decisions and tradeoffs.
   - `AGENT-troubleshooting.md` for diagnosed errors, fixes, and prevention notes.
   - `AGENT-config-variables.md` for settings, env vars, hooks, MCP, and safe config examples.
6. Preserve historical/planning/troubleshooting context unless clearly obsolete.
7. Finish with `Memory status: updated ...` and list changed memory files.

Codex native memories under `~/.codex/memories/` are optional local recall. Do not use them as the required repo memory source of truth.

