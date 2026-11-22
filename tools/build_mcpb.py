#!/usr/bin/env python3
"""Build the Claude Desktop MCPB from tracked source files."""
from pathlib import Path
import zipfile
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'dist' / 'NexaFlow-AI-Switch-1.7.0.mcpb'
FILES = ['manifest.json', 'icon.png', 'server/index.js', 'README.md']
OUT.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(OUT, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for rel in FILES:
        path = ROOT / rel
        if not path.is_file():
            raise SystemExit(f'Missing required MCPB file: {rel}')
        archive.write(path, rel)
print(f'Built {OUT} ({OUT.stat().st_size:,} bytes)')
