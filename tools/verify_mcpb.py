#!/usr/bin/env python3
"""Verify required MCPB entries, manifest version and archive integrity."""
from pathlib import Path
import json
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
default_path = ROOT / "dist" / f"NexaFlow-AI-Switch-{manifest['version']}.mcpb"
path = Path(sys.argv[1]) if len(sys.argv) > 1 else default_path
required = {"manifest.json", "icon.png", "server/index.js", "README.md"}
with zipfile.ZipFile(path) as archive:
    names = set(archive.namelist())
    missing = required - names
    if missing:
        raise SystemExit(f"Missing archive entries: {sorted(missing)}")
    bad = archive.testzip()
    if bad:
        raise SystemExit(f"CRC failure in {bad}")
    packaged_manifest = json.loads(archive.read("manifest.json"))
    if packaged_manifest.get("server", {}).get("entry_point") != "server/index.js":
        raise SystemExit("Invalid MCP server entry point")
    if packaged_manifest.get("version") != manifest["version"]:
        raise SystemExit("MCPB version does not match source manifest")
print(f"OK: {path} ({path.stat().st_size:,} bytes, {len(required)} required files)")
