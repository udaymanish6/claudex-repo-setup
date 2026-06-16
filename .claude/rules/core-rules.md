# Core Rules

<!-- Loaded automatically at session start for all files -->

## Investigation & Accuracy
- Never speculate about code you have not read. Read files and ripgrep for usages before making claims
- If the user references a file, read it before answering
- If uncertain, say so and propose how to verify. Do not fabricate APIs, paths, or behavior

## Scope Discipline
- Do what has been asked; nothing more, nothing less
- When intent is ambiguous, default to research and recommendations — only edit when explicitly asked
- Make only the changes requested. Do not refactor adjacent code, add docstrings to unchanged code, or create abstractions for a single use
- Follow scoping words ("only", "just", "exactly") literally

## Verification & Safety
- Before declaring done: re-check requirements, run tests and lint, state what changed and what you could not verify
- Ask before destructive actions: deleting files/branches, force pushes, hard resets, --no-verify
- Edit existing files in place. Do not create new files unless required. Clean up scratch files

## Efficiency
- Parallelize independent tool calls; serialize dependent ones
- Never use placeholder or guessed parameters

## Memory Resilience
- This template should not ship pre-filled `AGENT-*.md` or `memory/*.md` files; create them in the target project after `/init` or `/update-memory-bank`
- Treat generated root `AGENT-*.md` files as the primary structured project memory bank once they exist
- At session start or resume, read `AGENT-activeContext.md` if present; if missing after setup, create it from actual project evidence before substantive work
- Before implementation/refactoring, read `AGENT-patterns.md` if present; before design choices, read `AGENT-decisions.md`; when debugging, read `AGENT-troubleshooting.md`; when touching config/hooks/MCP/env, read `AGENT-config-variables.md`
- After meaningful work, create or update `AGENT-activeContext.md` plus any specialized `AGENT-*.md` files whose subject changed
- Mirror concise durable facts into repo-local native auto memory in `memory/MEMORY.md` or focused `memory/*.md` topic files after those files are generated
- Every final response after meaningful work must include `Memory status: updated ...` or `Memory status: no durable memory changes needed`
- If `CLAUDE.md` is reset or wiped, check `/memory`, `memory/`, and generated `AGENT-*.md` to recover project context
