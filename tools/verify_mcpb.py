#!/usr/bin/env python3
"""Verify required MCPB entries, JSON manifest and archive integrity."""
from pathlib import Path
import json, sys, zipfile
p = Path(sys.argv[1] if len(sys.argv) > 1 else 'dist/NexaFlow-AI-Switch-1.7.0.mcpb')
required = {'manifest.json', 'icon.png', 'server/index.js', 'README.md'}
with zipfile.ZipFile(p) as z:
    names = set(z.namelist())
    missing = required - names
    if missing:
        raise SystemExit(f'Missing archive entries: {sorted(missing)}')
    bad = z.testzip()
    if bad:
        raise SystemExit(f'CRC failure in {bad}')
    manifest = json.loads(z.read('manifest.json'))
    if manifest.get('server', {}).get('entry_point') != 'server/index.js':
        raise SystemExit('Invalid MCP server entry point')
print(f'OK: {p} ({p.stat().st_size:,} bytes, {len(required)} required files)')
