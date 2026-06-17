---
name: update-memory-bank
description: Use when a project memory bank is missing, stale, or needs updating after meaningful work in a Claude Code project.
---

# Update Memory Bank

Recover or update the project memory bank from the current project state.

This skill mirrors the /update-memory-bank slash command. First-time generation is expected during /init; use this skill or the slash command when initialization missed files or memory is stale.

## Required Flow

1. Read CLAUDE.md and .claude/rules/core-rules.md.
2. Inspect the actual target project before writing memory: project tree, package/build files, existing docs, config, tests, and recently changed files.
3. If missing, create these root memory-bank files from project evidence:
   - AGENT-activeContext.md
   - AGENT-patterns.md
   - AGENT-decisions.md
   - AGENT-troubleshooting.md
   - AGENT-config-variables.md
4. If .claude/settings.json does not set autoMemoryDirectory to this project's absolute memory/ path, update it before creating mirrors.
5. If missing, create repo-local auto-memory mirrors:
   - memory/MEMORY.md
   - memory/patterns.md
   - memory/architecture.md
   - memory/build.md
6. Update AGENT-activeContext.md with current goal, completed work, blockers, next steps, and known working state.
7. Update specialized files only when relevant:
   - AGENT-patterns.md for reusable implementation/workflow patterns.
   - AGENT-decisions.md for durable decisions and tradeoffs.
   - AGENT-troubleshooting.md for diagnosed errors, fixes, and prevention notes.
   - AGENT-config-variables.md for settings, env vars, hooks, MCP, and safe config examples.
8. Mirror concise durable facts into memory/MEMORY.md or focused memory/*.md topic files.
9. Preserve historical/planning/troubleshooting context unless clearly obsolete.
10. Finish with Memory status: updated ... and list changed memory files.
