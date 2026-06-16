---
name: get-current-datetime
description: Use when the user asks for the current system-local date or time and wants raw terminal output.
---

# Get Current Datetime

Run `date` and return only the raw command output unless the user requested a specific format.

Examples:

```bash
date
date +"%Y-%m-%d_%H%M%S"
date +"%Y-%m-%d %H:%M:%S %Z"
date +"%Y-%m-%dT%H:%M:%S%z"
```

