#!/usr/bin/env python3
"""Compile tracked project Python sources without executing WIZ runtime code."""

from pathlib import Path
import sys


def main():
    failures = []
    paths = sorted(Path("src").rglob("*.py"))

    for path in paths:
        try:
            source = path.read_text(encoding="utf-8")
            compile(source, str(path), "exec")
        except (OSError, SyntaxError, UnicodeError) as error:
            failures.append(f"{path}: {error}")

    if failures:
        print("\n".join(failures), file=sys.stderr)
        return 1

    print(f"Checked {len(paths)} Python files.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
