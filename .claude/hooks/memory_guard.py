#!/usr/bin/env python3
"""Claude Code memory-bank guard hooks.

SessionStart: add context reminding Claude how to use the memory bank.
PreCompact: block manual compaction until memory has been reviewed.
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
        note = "Memory bank is not initialized yet. Missing: " + ", ".join(missing) + ". Run /init now. During /init, Claude must analyze the current project, set autoMemoryDirectory to this project absolute memory/ path, and create these files from actual project evidence before substantive work. Use /update-memory-bank only as recovery if /init already ran and missed them."
    else:
        note = "Memory-bank files are present. Read AGENT-activeContext.md before substantive work and the specialized AGENT-*.md file required by the task."
    print_json({
        "hookSpecificOutput": {
            "hookEventName": "SessionStart",
            "additionalContext": note,
        }
    })


def pre_compact(payload):
    trigger = payload.get("trigger", "")
    if trigger == "manual":
        print_json({
            "decision": "block",
            "reason": (
                "Before manual /compact, initialize or update the memory bank from the current project: "
                "create/update AGENT-activeContext.md plus relevant AGENT-*.md files, ensure autoMemoryDirectory points to this project absolute memory/ path, then mirror concise facts into memory/. "
                "After updating, include 'Memory status: updated ...' or 'Memory status: no durable memory changes needed' and rerun /compact."
            ),
        })
    else:
        return


def main():
    payload = load_payload()
    event = payload.get("hook_event_name") or (sys.argv[1] if len(sys.argv) > 1 else "")
    if event == "SessionStart":
        session_start(payload)
    elif event == "PreCompact":
        pre_compact(payload)


if __name__ == "__main__":
    main()
