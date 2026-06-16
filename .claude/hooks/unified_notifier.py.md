# Unified Notifier Hook

Dependency-light notification hook for Claude Code.

## Behavior

- Reads hook JSON from stdin.
- Sends a macOS notification for the configured hook event.
- Uses `terminal-notifier` when it is installed.
- Falls back to macOS `osascript display notification`.
- Exits cleanly when neither notification mechanism is available.

No logs, no TTS, no `uv`, and no third-party Python packages are required.

## Current Wiring

The project settings currently enable this script for the `Stop` event:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3",
            "args": [
              "${CLAUDE_PROJECT_DIR}/.claude/hooks/unified_notifier.py",
              "Stop"
            ]
          }
        ]
      }
    ]
  }
}
```

## Manual Test

```bash
printf '{"cwd":"'"$PWD"'","hook_event_name":"Stop"}' \
  | python3 .claude/hooks/unified_notifier.py Stop
```
