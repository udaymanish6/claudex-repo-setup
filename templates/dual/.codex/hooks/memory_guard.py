#!/usr/bin/env python3
"""Codex memory-bank guard hooks.

This is a best-effort Codex companion to the Claude memory guard. Codex hook
schema support can vary by release, so the script emits conservative JSON and
keeps all checks side-effect free.
"""

import json
import sys
from pathlib import Path


REQUIRED = [
    "AGENT-activeContext.md",
    "AGENT-patterns.md",
    "AGENT-decisions.md",
    "AGENT-troubleshooting.md",
    "AGENT-config-variables.md",
]


def load_payload():
    try:
        raw = sys.stdin.read()
        return json.loads(raw) if raw.strip() else {}
    except Exception:
        return {}


def project_root(payload):
    cwd = payload.get("cwd") or "."
    return Path(cwd).resolve()


def missing_files(root):
    return [name for name in REQUIRED if not (root / name).exists()]


def print_json(obj):
    print(json.dumps(obj, separators=(",", ":")))


def session_start(payload):
    root = project_root(payload)
    missing = missing_files(root)
    if missing:
        note = (
            "Memory bank is not initialized yet. Missing: "
            + ", ".join(missing)
            + ". Use the update-memory-bank skill now. Codex must inspect the actual project before substantive work and create these files from evidence."
        )
    else:
        note = (
            "Memory-bank files are present. Read AGENT-activeContext.md before substantive work and read the specialized AGENT-*.md file required by the task."
        )
    print_json({"hookSpecificOutput": {"hookEventName": "SessionStart", "additionalContext": note}})


def pre_compact(payload):
    trigger = payload.get("trigger", "")
    print_json(
        {
            "decision": "block" if trigger in ("manual", "auto", "") else "continue",
            "reason": (
                "Before compacting, initialize or update AGENT-activeContext.md and any relevant AGENT-*.md files from the current project. "
                "After updating, include 'Memory status: updated ...' or 'Memory status: no durable memory changes needed'."
            ),
        }
    )


def stop(payload):
    transcript = json.dumps(payload)
    if "Memory status:" in transcript:
        return
    print_json(
        {
            "decision": "block",
            "reason": (
                "Meaningful work must end with a memory review marker. Update or review AGENT-*.md, then finish with "
                "'Memory status: updated ...' or 'Memory status: no durable memory changes needed'."
            ),
        }
    )


def main():
    payload = load_payload()
    event = payload.get("hook_event_name") or (sys.argv[1] if len(sys.argv) > 1 else "")
    if event == "SessionStart":
        session_start(payload)
    elif event == "PreCompact":
        pre_compact(payload)
    elif event == "Stop":
        stop(payload)


if __name__ == "__main__":
    main()

