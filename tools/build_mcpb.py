#!/usr/bin/env python3
"""Build the Claude Desktop MCPB using the version in manifest.json."""
from pathlib import Path
import json
import zipfile

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
version = manifest["version"]
OUT = ROOT / "dist" / f"NexaFlow-AI-Switch-{version}.mcpb"
FILES = ["manifest.json", "icon.png", "server/index.js", "README.md"]
OUT.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(OUT, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for rel in FILES:
        path = ROOT / rel
        if not path.is_file():
            raise SystemExit(f"Missing required MCPB file: {rel}")
        archive.write(path, rel)
print(f"Built {OUT} ({OUT.stat().st_size:,} bytes)")
