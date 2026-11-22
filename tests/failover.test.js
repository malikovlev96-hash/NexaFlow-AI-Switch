'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

async function invokeAsk(firstStatus) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nexaflow-mock-'));
  const preload = path.join(dir, 'mock-fetch.cjs');
  fs.writeFileSync(preload, `
    global.__calls = [];
    global.fetch = async (url, options) => {
      global.__calls.push(String(url));
      if (String(url).includes('api.openai.com')) return new Response(JSON.stringify({error:{message:'mock response'}}), {status:${firstStatus}});
      return new Response(JSON.stringify({choices:[{message:{content:'groq fallback ok'}}]}), {status:200,headers:{'content-type':'application/json'}});
    };
  `);
  const child = spawn(process.execPath, ['--require', preload, path.join(root, 'server/index.js')], {
    env: { ...process.env, NODE_OPTIONS: '', OPENAI_API_KEY: 'test-openai', GROQ_API_KEY: 'test-groq', PRIMARY_PROVIDER: 'openai', FALLBACK_ORDER: 'groq' },
    stdio: ['pipe', 'pipe', 'pipe']
  });
  let stdout = '', stderr = '';
  child.stdout.setEncoding('utf8'); child.stderr.setEncoding('utf8');
  child.stdout.on('data', x => stdout += x); child.stderr.on('data', x => stderr += x);
  child.stdin.end(JSON.stringify({jsonrpc:'2.0',id:7,method:'tools/call',params:{name:'autoswitch_ask',arguments:{prompt:'hello'}}})+'\n');
  const code = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => { child.kill(); reject(new Error('mock request timeout')); }, 5000);
    child.on('close', value => { clearTimeout(timer); resolve(value); });
    child.on('error', reject);
  });
  assert.equal(code, 0, stderr);
  const reply = JSON.parse(stdout.trim().split(/\r?\n/)[0]);
  fs.rmSync(dir, {recursive:true,force:true});
  return {reply, stderr};
}

test('401 stops failover and returns a key diagnostic', async () => {
  const {reply} = await invokeAsk(401);
  const message = reply.result.content[0].text;
  assert.match(message, /HTTP 401/);
  assert.match(message, /API-ключ/);
  assert.doesNotMatch(message, /groq fallback ok/);
});

test('503 can fail over to the next configured provider', async () => {
  const {reply} = await invokeAsk(503);
  const data = JSON.parse(reply.result.content[0].text);
  assert.equal(data.ok, true);
  assert.equal(data.provider, 'groq');
  assert.deepEqual(data.attempted, ['openai','groq']);
});
