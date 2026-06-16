# Claude to Codex Migration

Use this when a project already has Claude Code setup and you want to add Codex support without deleting Claude files.

## Starting State

```text
CLAUDE.md
.claude/
AGENT-*.md optional
```

## Add

```text
AGENTS.md
.agents/
.codex/
```

## Steps

1. Generate `AGENTS.md` from `CLAUDE.md`.
2. Preserve the shared `AGENT-*.md` memory-bank contract.
3. Convert `.claude/settings.json` behavior into `.codex/config.toml` and `.codex/hooks.json`.
4. Port useful `.claude/hooks/*.py` into `.codex/hooks/`.
5. Convert reusable `.claude/commands/` into `.agents/skills/`.
6. Convert useful `.claude/agents/*.md` into `.codex/agents/*.toml`.
7. Keep `.claude/` untouched during migration.

## End-of-Migration Statement

```text
Migration added Codex-native files and left the existing Claude setup untouched.
Do you want to keep the old Claude files for dual-agent use, or remove them now and make this Codex-only?
```

