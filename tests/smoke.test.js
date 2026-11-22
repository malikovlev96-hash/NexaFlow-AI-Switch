'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

test('MCP server starts and speaks JSON-RPC', async () => {
  const child = spawn(process.execPath, [path.join(root, 'server/index.js')], { stdio: ['pipe', 'pipe', 'pipe'] });
  let stdout = '';
  let stderr = '';
  child.stdout.setEncoding('utf8'); child.stderr.setEncoding('utf8');
  child.stdout.on('data', chunk => stdout += chunk);
  child.stderr.on('data', chunk => stderr += chunk);
  const messages = [
    { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05' } },
    { jsonrpc: '2.0', id: 2, method: 'tools/list' },
    { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'autoswitch_status', arguments: {} } }
  ];
  child.stdin.write(messages.map(x => JSON.stringify(x)).join('\n') + '\n');
  child.stdin.end();
  const exitCode = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => { child.kill(); reject(new Error('MCP server smoke test timed out')); }, 8000);
    child.on('close', code => { clearTimeout(timer); resolve(code); });
    child.on('error', reject);
  });
  assert.equal(exitCode, 0, stderr);
  const replies = stdout.trim().split(/\r?\n/).map(line => JSON.parse(line));
  assert.equal(replies.length, 3);
  assert.equal(replies[0].result.serverInfo.version, JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8')).version);
  const names = replies[1].result.tools.map(tool => tool.name);
  assert.ok(names.includes('autoswitch_test_provider'));
  assert.ok(names.includes('autoswitch_models'));
  assert.equal(replies[2].result.content[0].type, 'text');
  assert.doesNotMatch(stdout, /API_KEY|sk-[A-Za-z0-9]/);
});

test('manifest JSON and MCPB entry point are valid', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
  assert.equal(manifest.manifest_version, '0.3');
  assert.equal(Object.hasOwn(manifest, 'mcpb_version'), false);
  assert.equal(manifest.server.entry_point, 'server/index.js');
  assert.equal(manifest.version, JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version);
  assert.equal(manifest.server.type, 'node');
});

test('mobile inline JavaScript parses', () => {
  const html = fs.readFileSync(path.join(root, 'mobile/index.html'), 'utf8');
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/gi)];
  assert.ok(scripts.length > 0);
  for (const match of scripts) new vm.Script(match[1], { filename: 'mobile/index.html' });
  assert.match(html, /sessionStorage\.setItem\('nexaflow_openrouter_key'/);
  assert.doesNotMatch(html, /localStorage\.setItem\('nexaflow_openrouter_key'/);
});

test('mobile manifest icon path exists and is not an empty placeholder', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'mobile/manifest.webmanifest'), 'utf8'));
  const iconPath = path.resolve(root, 'mobile', manifest.icons[0].src);
  assert.ok(fs.existsSync(iconPath));
  assert.ok(fs.statSync(iconPath).size > 1000);
});
