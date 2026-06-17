---
name: verify-claude-setup
description: Use when checking whether a repository's Claude Code setup files, hooks, skills, agents, rules, and memory-bank instructions are valid.
---

# Verify Claude Setup

Validate the repo's Claude-native setup without changing behavior unless the user asks for fixes.

## Checks

1. Confirm CLAUDE.md exists and contains project-specific setup plus memory-bank instructions.
2. Confirm .claude/settings.json parses and does not contain machine-specific auth, telemetry, notification, or provider keys.
3. Confirm .claude/settings.json defines only hooks that point to existing scripts or valid prompt hooks.
4. Confirm .claude/hooks/*.py compiles.
5. Confirm .claude/agents/*.md contains frontmatter with name and description.
6. Confirm .claude/skills/ contains valid skills with SKILL.md frontmatter.
7. Confirm .claude/rules/core-rules.md exists.
8. Confirm generated memory files are not shipped in reusable templates unless this is a real target project.
9. Report exact files checked, failures, and next actions.

Use /hooks, /memory, and /init inside Claude Code to verify runtime discovery.
