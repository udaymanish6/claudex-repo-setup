---
name: verify-codex-setup
description: Use when checking whether a repository's Codex setup files, hooks, skills, agents, MCP policy, and memory-bank instructions are valid.
---

# Verify Codex Setup

Validate the repo's Codex-native setup without changing behavior unless the user asks for fixes.

## Checks

1. Confirm `AGENTS.md` exists and contains project-specific setup plus memory-bank instructions.
2. Confirm `.agents/skills/` contains valid skills with `SKILL.md` frontmatter.
3. Confirm `.codex/config.toml` parses and does not contain machine-specific auth, telemetry, notification, or provider keys.
4. Confirm `.codex/hooks.json` parses and points to existing scripts.
5. Confirm `.codex/hooks/*.py` compiles.
6. Confirm `.codex/agents/*.toml` contains `name`, `description`, and `developer_instructions`.
7. Confirm there is no root `.mcp.json`; Codex MCP belongs in `config.toml` under `[mcp_servers.*]` if needed.
8. Confirm generated memory files are not shipped in reusable templates unless this is a real target project.
9. Report exact files checked, failures, and next actions.

Use `/hooks`, `/skills`, `/memories`, `/mcp`, and `/status` inside Codex to verify runtime discovery.

