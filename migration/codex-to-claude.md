# Codex to Claude Migration

Use this when a project already has Codex setup and you want to add Claude Code support without deleting Codex files.

## Starting State

```text
AGENTS.md
.agents/
.codex/
AGENT-*.md optional
```

## Add

```text
CLAUDE.md
.claude/
```

## Steps

1. Generate `CLAUDE.md` from `AGENTS.md`.
2. Preserve the shared `AGENT-*.md` memory-bank contract.
3. Convert `.codex/config.toml` and `.codex/hooks.json` behavior into `.claude/settings.json`.
4. Port useful `.codex/hooks/*.py` into `.claude/hooks/`.
5. Convert useful `.agents/skills/` into `.claude/skills/`.
6. Convert useful `.codex/agents/*.toml` into `.claude/agents/*.md`.
7. Add `.claude/commands/` only for workflows that benefit from Claude slash commands.
8. Keep `.codex/` and `.agents/` untouched during migration.

## End-of-Migration Statement

```text
Migration added Claude-native files and left the existing Codex setup untouched.
Do you want to keep the old Codex files for dual-agent use, or remove them now and make this Claude-only?
```

