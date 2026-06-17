---
name: consult-claude
description: Consult Claude Code from Codex for a second model perspective when Claude CLI is installed and authenticated. Use for complex code review, architecture, debugging, or migration questions where a Claude perspective is useful.
---

# Consult Claude

Run Claude Code as an optional second-opinion tool from a Codex session.

## Required Flow

1. Confirm the user wants an external Claude perspective.
2. Check whether Claude CLI is available:

```bash
command -v claude
claude --version
```

3. If Claude is unavailable or unauthenticated, do not fail the main task. Report that Claude consultation is unavailable and continue with Codex-native analysis.
4. If available, pass a scoped read-only prompt with exact project path and requested output format.
5. Treat Claude output as advisory. Verify claims against local files before reporting them as facts.

## Output

Return:

- Claude response summary
- Verified agreements
- Disagreements or unverified claims
- Final Codex synthesis with file references
