#!/usr/bin/env python3
"""Verify MCPB archive structure, official manifest version and archive integrity."""
from pathlib import Path
import json
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
if manifest.get("manifest_version") != "0.3":
    raise SystemExit("manifest.json must declare manifest_version 0.3")
if "mcpb_version" in manifest:
    raise SystemExit("Unsupported legacy field mcpb_version; use manifest_version")
if manifest.get("server", {}).get("type") != "node":
    raise SystemExit("MCPB server type must be node")
if manifest.get("server", {}).get("entry_point") != "server/index.js":
    raise SystemExit("Invalid MCP server entry point")
if manifest.get("version") != json.loads((ROOT / "package.json").read_text(encoding="utf-8")).get("version"):
    raise SystemExit("Manifest version does not match package.json")
default_path = ROOT / "dist" / f"NexaFlow-AI-Switch-{manifest['version']}.mcpb"
path = Path(sys.argv[1]) if len(sys.argv) > 1 else default_path
required = {"manifest.json", "icon.png", "server/index.js", "README.md"}
with zipfile.ZipFile(path) as archive:
    missing = required - set(archive.namelist())
    if missing:
        raise SystemExit(f"Missing archive entries: {sorted(missing)}")
    bad = archive.testzip()
    if bad:
        raise SystemExit(f"CRC failure in {bad}")
    packaged_manifest = json.loads(archive.read("manifest.json"))
    if packaged_manifest.get("manifest_version") != "0.3":
        raise SystemExit("Packaged manifest must declare manifest_version 0.3")
    if "mcpb_version" in packaged_manifest:
        raise SystemExit("Packaged manifest contains unsupported mcpb_version")
    if packaged_manifest.get("server", {}).get("entry_point") != "server/index.js":
        raise SystemExit("Invalid packaged MCP server entry point")
    if packaged_manifest.get("version") != manifest["version"]:
        raise SystemExit("MCPB version does not match source manifest")
print(f"OK: {path} ({path.stat().st_size:,} bytes, {len(required)} required files)")
