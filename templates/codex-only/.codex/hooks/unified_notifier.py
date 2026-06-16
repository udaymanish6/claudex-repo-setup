#!/usr/bin/env python3
"""Dependency-light Codex notification hook.

Reads Codex hook JSON from stdin and sends a macOS notification. It uses
terminal-notifier when installed, then falls back to osascript. No logs, no TTS,
and no third-party Python packages are required.
"""

import argparse
import json
import os
import shutil
import subprocess
import sys


def notify(title: str, subtitle: str, message: str) -> None:
    terminal_notifier = shutil.which("terminal-notifier")
    if terminal_notifier:
        subprocess.run(
            [
                terminal_notifier,
                "-title",
                title,
                "-subtitle",
                subtitle,
                "-message",
                message,
                "-sound",
                "default",
                "-timeout",
                "10",
            ],
            check=False,
            timeout=5,
        )
        return

    osascript = shutil.which("osascript")
    if osascript:
        script = (
            f"display notification {json.dumps(message)} "
            f"with title {json.dumps(title)} subtitle {json.dumps(subtitle)}"
        )
        subprocess.run([osascript, "-e", script], check=False, timeout=5)


def message_for(event: str, data: dict) -> tuple[str, str]:
    cwd = data.get("cwd") or ""
    dirname = os.path.basename(cwd) if cwd else "current directory"

    if event == "Stop":
        return "Session Complete", f"Finished working in {dirname}."
    if event == "SessionStart":
        return "Session Started", f"New Codex session started from {data.get('source', 'session')}."
    if event == "SubagentStop":
        return "Subagent Complete", "A subagent task has finished."
    if event == "PreCompact":
        return "Memory Compaction", f"Compacting memory ({data.get('trigger', 'auto')} trigger)."

    return "Codex", f"{event} event occurred."


def main() -> int:
    parser = argparse.ArgumentParser(description="Codex notifier hook")
    parser.add_argument("hook_event", help="Codex hook event name")
    args = parser.parse_args()

    try:
        data = json.load(sys.stdin)
    except json.JSONDecodeError:
        data = {}

    subtitle, message = message_for(args.hook_event, data)
    try:
        notify("Codex", subtitle, message)
    except Exception:
        return 0
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

