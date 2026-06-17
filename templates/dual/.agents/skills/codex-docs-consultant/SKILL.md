---
name: codex-docs-consultant
description: Consult official OpenAI Codex documentation and local Codex manual guidance. Use when working on AGENTS.md, .codex/config.toml, hooks, skills, agents, MCP, plugins, memories, approvals, sandboxing, or any Codex feature requiring current docs.
---

# Codex Docs Consultant

Consult official Codex/OpenAI documentation before changing Codex setup behavior.

## Workflow

1. Identify the Codex feature involved: AGENTS.md, config, hooks, skills, agents, MCP, plugins, memories, approvals, sandboxing, or CLI behavior.
2. Prefer local Codex manual or official OpenAI documentation sources over memory.
3. Fetch only the docs needed for the current task.
4. Apply the docs to the repo's current files and report exact files checked.

## Rules

- Do not reuse Claude Code docs for Codex behavior unless the user explicitly asks for a comparison.
- If docs and local behavior differ, state both and mark the local observation as implementation evidence.
- Do not invent config keys. Verify config shape before recommending it.
