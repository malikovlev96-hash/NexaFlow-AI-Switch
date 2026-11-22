#!/usr/bin/env node
'use strict';
// AI AutoSwitch MCP server. Node.js 18+, no third-party dependencies.
const readline = require('node:readline');
const VERSION = '1.7.2';
const DEFAULT_TIMEOUT_MS = 30000;
const clean = (v) => typeof v === 'string' ? v.trim() : '';
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const providers = {
  xai: { label: 'xAI Grok', key: clean(process.env.XAI_API_KEY), model: clean(process.env.XAI_MODEL) || 'grok-4.1-fast', url: 'https://api.x.ai/v1/chat/completions' },
  groq: { label: 'Groq', key: clean(process.env.GROQ_API_KEY), model: clean(process.env.GROQ_MODEL) || 'openai/gpt-oss-120b', url: 'https://api.groq.com/openai/v1/chat/completions' },
  openrouter: { label: 'OpenRouter', key: clean(process.env.OPENROUTER_API_KEY), model: clean(process.env.OPENROUTER_MODEL) || 'openrouter/free', url: 'https://openrouter.ai/api/v1/chat/completions' },
  mistral: { label: 'Mistral', key: clean(process.env.MISTRAL_API_KEY), model: clean(process.env.MISTRAL_MODEL) || 'mistral-small-latest', url: 'https://api.mistral.ai/v1/chat/completions' },
  nvidia: { label: 'NVIDIA NIM', key: clean(process.env.NVIDIA_API_KEY), model: clean(process.env.NVIDIA_MODEL) || 'meta/llama-3.3-70b-instruct', url: 'https://integrate.api.nvidia.com/v1/chat/completions' },
  cohere: { label: 'Cohere', key: clean(process.env.COHERE_API_KEY), model: clean(process.env.COHERE_MODEL) || 'command-r7b-12-2024', url: 'https://api.cohere.com/compatibility/v1/chat/completions' },
  sambanova: { label: 'SambaNova', key: clean(process.env.SAMBANOVA_API_KEY), model: clean(process.env.SAMBANOVA_MODEL) || 'Meta-Llama-3.3-70B-Instruct', url: 'https://api.sambanova.ai/v1/chat/completions' },
  zai: { label: 'Z.ai', key: clean(process.env.ZAI_API_KEY), model: clean(process.env.ZAI_MODEL) || 'glm-4.7-flash', url: 'https://api.z.ai/api/paas/v4/chat/completions' },
  openai: { label: 'OpenAI', key: clean(process.env.OPENAI_API_KEY), model: clean(process.env.OPENAI_MODEL) || 'gpt-4.1-mini', url: 'https://api.openai.com/v1/chat/completions' },
  deepseek: { label: 'DeepSeek', key: clean(process.env.DEEPSEEK_API_KEY), model: clean(process.env.DEEPSEEK_MODEL) || 'deepseek-chat', url: 'https://api.deepseek.com/chat/completions' },
  cerebras: { label: 'Cerebras', key: clean(process.env.CEREBRAS_API_KEY), model: clean(process.env.CEREBRAS_MODEL) || 'llama-3.3-70b', url: 'https://api.cerebras.ai/v1/chat/completions' },
  together: { label: 'Together AI', key: clean(process.env.TOGETHER_API_KEY), model: clean(process.env.TOGETHER_MODEL) || 'meta-llama/Llama-3.3-70B-Instruct-Turbo', url: 'https://api.together.xyz/v1/chat/completions' },
  fireworks: { label: 'Fireworks AI', key: clean(process.env.FIREWORKS_API_KEY), model: clean(process.env.FIREWORKS_MODEL) || 'accounts/fireworks/models/llama-v3p3-70b-instruct', url: 'https://api.fireworks.ai/inference/v1/chat/completions' },
  huggingface: { label: 'Hugging Face', key: clean(process.env.HUGGINGFACE_API_KEY), model: clean(process.env.HUGGINGFACE_MODEL) || 'meta-llama/Llama-3.3-70B-Instruct', url: 'https://router.huggingface.co/v1/chat/completions' },
  github: { label: 'GitHub Models', key: clean(process.env.GITHUB_TOKEN), model: clean(process.env.GITHUB_MODEL) || 'openai/gpt-4.1-mini', url: 'https://models.github.ai/inference/chat/completions' },
  perplexity: { label: 'Perplexity', key: clean(process.env.PERPLEXITY_API_KEY), model: clean(process.env.PERPLEXITY_MODEL) || 'sonar', url: 'https://api.perplexity.ai/chat/completions' }
};
const gemini = { label: 'Google Gemini', key: clean(process.env.GEMINI_API_KEY), model: clean(process.env.GEMINI_MODEL) || 'gemini-2.5-flash' };
const cf = { label: 'Cloudflare Workers AI', key: clean(process.env.CLOUDFLARE_API_TOKEN), account: clean(process.env.CLOUDFLARE_ACCOUNT_ID), model: clean(process.env.CLOUDFLARE_MODEL) || '@cf/openai/gpt-oss-120b' };
const primary = (clean(process.env.PRIMARY_PROVIDER) || 'groq').toLowerCase();
const order = (clean(process.env.FALLBACK_ORDER) || 'gemini,openrouter,cerebras,deepseek,mistral,cloudflare,nvidia,cohere,sambanova,zai,together,fireworks,huggingface,github,perplexity,openai,xai')
  .split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
const allIds = [...Object.keys(providers), 'gemini', 'cloudflare'];
const configured = id => id === 'gemini' ? !!gemini.key : id === 'cloudflare' ? !!(cf.key && cf.account) : !!providers[id]?.key;
const modelFor = id => id === 'gemini' ? gemini.model : id === 'cloudflare' ? cf.model : providers[id]?.model || '';
const labelFor = id => id === 'gemini' ? gemini.label : id === 'cloudflare' ? cf.label : providers[id]?.label || id;

const providerInfo = [
 ['xai','xAI / Grok','https://console.x.ai/','https://x.ai/api','Paid API'],
 ['groq','Groq','https://console.groq.com/keys','https://groq.com/pricing/','Free developer limits may apply'],
 ['gemini','Google Gemini','https://aistudio.google.com/apikey','https://ai.google.dev/gemini-api/docs/pricing','Selected models have free quota'],
 ['openrouter','OpenRouter','https://openrouter.ai/keys','https://openrouter.ai/pricing','Some models are free; check model-specific limits'],
 ['mistral','Mistral','https://console.mistral.ai/','https://mistral.ai/pricing/','Trial/paid; check account'],
 ['cloudflare','Cloudflare Workers AI','https://dash.cloudflare.com/','https://developers.cloudflare.com/workers-ai/platform/pricing/','Account plan and usage limits apply'],
 ['nvidia','NVIDIA NIM','https://build.nvidia.com/','https://build.nvidia.com/','Hosted trial limits vary'],
 ['cohere','Cohere','https://dashboard.cohere.com/api-keys','https://cohere.com/pricing','Trial limits'],
 ['sambanova','SambaNova','https://cloud.sambanova.ai/','https://cloud.sambanova.ai/','Availability varies'],
 ['zai','Z.ai','https://z.ai/','https://z.ai/','Check current plan'],
 ['openai','OpenAI','https://platform.openai.com/api-keys','https://openai.com/api/pricing/','Paid API'],
 ['deepseek','DeepSeek','https://platform.deepseek.com/api_keys','https://api-docs.deepseek.com/quick_start/pricing','Paid API; pricing varies'],
 ['cerebras','Cerebras','https://cloud.cerebras.ai/','https://www.cerebras.ai/pricing','Free developer limits may apply'],
 ['together','Together AI','https://api.together.ai/','https://www.together.ai/pricing','Trial credits/paid'],
 ['fireworks','Fireworks AI','https://fireworks.ai/','https://fireworks.ai/pricing','Trial credits/paid'],
 ['huggingface','Hugging Face','https://huggingface.co/settings/tokens','https://huggingface.co/pricing','Free credits/limits vary'],
 ['github','GitHub Models','https://github.com/marketplace/models','https://docs.github.com/en/github-models','Rate limits depend on account'],
 ['perplexity','Perplexity','https://www.perplexity.ai/settings/api','https://docs.perplexity.ai/guides/pricing','Paid API']
].map(([id,name,key_url,pricing_url,access]) => ({ id,name,key_url,pricing_url,access }));

function listStatus() {
 return allIds.map(id => ({ provider:id, name:labelFor(id), configured:configured(id), model:modelFor(id), access:providerInfo.find(p=>p.id===id)?.access || 'Check provider pricing' }));
}
function providerHint(status) {
 if (status === 401) return 'Проверь API-ключ: он неверен, отозван или относится к другому проекту.';
 if (status === 403) return 'Доступ запрещён: проверь права ключа, регион, биллинг и доступность модели для аккаунта.';
 if (status === 404) return 'Endpoint или ID модели не найден. Проверь актуальный model ID и документацию провайдера.';
 if (status === 429) return 'Превышен лимит запросов/квоты. Подожди сброса лимита или проверь тариф и баланс.';
 if (status >= 500) return 'Временная ошибка на стороне провайдера. Можно повторить позже или использовать резервного провайдера.';
 if (status === 400 || status === 422) return 'Провайдер отклонил параметры запроса. Проверь совместимость модели, max_tokens и формат сообщений.';
 return 'Проверь настройки провайдера и его официальную документацию.';
}
function parseBody(raw) {
 if (!raw) return {};
 try { return JSON.parse(raw); } catch { return { raw }; }
}
function errorMessage(data, raw='') {
 const e = data?.error;
 if (typeof e === 'string') return e;
 return e?.message || e?.detail || data?.message || data?.detail || data?.errors?.[0]?.message || data?.error_description || data?.raw || raw.slice(0, 500) || 'Unknown API error';
}
function retryDelay(response, attempt) {
 const h = response?.headers?.get?.('retry-after');
 if (h) {
  const seconds = Number(h);
  if (Number.isFinite(seconds)) return Math.min(2500, Math.max(250, seconds * 1000));
  const date = Date.parse(h);
  if (Number.isFinite(date)) return Math.min(2500, Math.max(250, date - Date.now()));
 }
 return attempt === 0 ? 700 : 1400;
}
async function requestJson(url, options={}, timeout=DEFAULT_TIMEOUT_MS) {
 let lastError;
 for (let attempt=0; attempt<2; attempt++) {
  let response;
  try {
   response = await fetch(url, { ...options, signal: AbortSignal.timeout(timeout) });
  } catch (err) {
   const e = new Error(err?.name === 'TimeoutError' || err?.name === 'AbortError' ? `Request timed out after ${Math.round(timeout/1000)}s` : `Network error: ${err?.message || 'connection failed'}`);
   e.code = err?.code; e.retryable = true; lastError = e;
   if (attempt === 0) { await sleep(400); continue; }
   throw e;
  }
  const raw = await response.text();
  const data = parseBody(raw);
  if (response.ok) return data;
  const e = new Error(`HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ''}: ${errorMessage(data, raw)}`);
  e.status = response.status; e.providerData = data; e.hint = providerHint(response.status);
  const method = String(options.method || 'GET').toUpperCase();
  const retryable = (method === 'GET' && (response.status === 408 || response.status === 425 || response.status === 429 || response.status >= 500)) || (method !== 'GET' && [425,429].includes(response.status));
  if (retryable && attempt === 0) { await sleep(retryDelay(response, attempt)); continue; }
  throw e;
 }
 throw lastError || new Error('Request failed');
}
async function post(url,key,body,extra={}) {
 return requestJson(url,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json',...extra},body:JSON.stringify(body)});
}
function extractChatText(data) {
 const message = data?.choices?.[0]?.message;
 const content = message?.content;
 if (typeof content === 'string' && content.trim()) return content;
 if (Array.isArray(content)) {
  const joined = content.map(x=>typeof x==='string'?x:(typeof x?.text==='string'?x.text:'')).join('');
  if (joined.trim()) return joined;
 }
 if (content != null && String(content).trim()) return String(content);
 if (message?.refusal) return String(message.refusal);
 const reason = data?.choices?.[0]?.finish_reason;
 throw new Error(`Provider returned no assistant text${reason ? ` (finish_reason: ${reason})` : ''}. Check model compatibility and output limits.`);
}
async function askOne(id,prompt,system,modelOverride,options={}) {
 const model=clean(modelOverride)||modelFor(id);
 if (!model) throw new Error(`Unknown provider or empty model: ${id}`);
 const temperature = Number.isFinite(options.temperature) ? Math.max(0,Math.min(2,options.temperature)) : 0.7;
 const maxTokens = Number.isInteger(options.max_tokens) ? Math.max(1,Math.min(8192,options.max_tokens)) : 2048;
 if (id==='gemini') {
  if (!gemini.key) throw new Error('Gemini API key is not configured');
  const url=`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const body={contents:[{role:'user',parts:[{text:prompt}]}],generationConfig:{temperature,maxOutputTokens:maxTokens}};
  if (system) body.systemInstruction={parts:[{text:system}]};
  const d=await requestJson(url,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':gemini.key},body:JSON.stringify(body)});
  const candidate=d.candidates?.[0];
  const text=candidate?.content?.parts?.map(x=>typeof x.text==='string'?x.text:'').join('');
  if (text?.trim()) return {text,model};
  if (d.promptFeedback?.blockReason) throw new Error(`Gemini blocked the prompt: ${d.promptFeedback.blockReason}`);
  if (candidate?.finishReason) throw new Error(`Gemini returned no text (finishReason: ${candidate.finishReason}).`);
  throw new Error('Gemini returned no text candidate.');
 }
 if (id==='cloudflare') {
  if (!cf.key||!cf.account) throw new Error('Cloudflare token or account ID missing');
  const url=`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(cf.account)}/ai/run/${model}`;
  const d=await post(url,cf.key,{messages:[...(system?[{role:'system',content:system}]:[]),{role:'user',content:prompt}],temperature,max_tokens:maxTokens});
  if (d.success===false) throw new Error(`Cloudflare: ${(d.errors||[]).map(x=>x.message||x.code).join('; ')||'request failed'}`);
  const answer=d.result?.response ?? d.result?.output_text ?? d.result?.generated_text;
  if (typeof answer==='string'&&answer.trim()) return {text:answer,model,usage:d.result?.usage||d.result?.usage_metadata||null};
  throw new Error('Cloudflare returned no text response for this model. Verify model ID and chat task support.');
 }
 const p=providers[id];
 if (!p) throw new Error(`Unsupported provider: ${id}`);
 if (!p.key) throw new Error(`${id} API key is not configured`);
 const body={model,messages:[...(system?[{role:'system',content:system}]:[]),{role:'user',content:prompt}],temperature,max_tokens:maxTokens};
 const extra=id==='openrouter'?{'X-Title':'AI AutoSwitch'}:{};
 const d=await post(p.url,p.key,body,extra);
 return {text:extractChatText(d),model,usage:d.usage||null};
}
async function ask(prompt,preferred,modelOverride,options={}) {
 if (!clean(prompt)) throw new Error('Prompt cannot be empty.');
 if (prompt.length > 100000) throw new Error('Prompt is too long (maximum 100,000 characters).');
 const first=(clean(preferred)||primary||'groq').toLowerCase();
 if (!allIds.includes(first)) throw new Error(`Unknown provider "${first}". Supported: ${allIds.join(', ')}`);
 const candidates=[first,...order,...allIds].filter((x,i,a)=>allIds.includes(x)&&a.indexOf(x)===i);
 const errors=[]; const attempted=[]; const skipped=[];
 for (const id of candidates) {
  if (!configured(id)) { skipped.push(id); continue; }
  attempted.push(id);
  try {
   const result=await askOne(id,prompt,options.system||'You are responding through AI AutoSwitch. Answer the user directly and accurately.',id===first?modelOverride:'',options);
   return {ok:true,provider:id,provider_name:labelFor(id),model:result.model,answer:result.text,usage:result.usage||null,attempted,skipped,failed:errors};
  } catch(e) {
   errors.push({provider:id,error:e.message,http_status:e.status||null,code:e.code||null,hint:e.hint||null});
   // Do not spray requests across providers for configuration/model errors.
   // Fail over only for transient/network/rate-limit/server failures.
   const canFailover = e.retryable === true || [408,425,429].includes(e.status) || (Number(e.status)>=500);
   if (!canFailover) break;
  }
 }
 if (!attempted.length) throw new Error('No API keys configured. Add at least one provider key in Claude extension settings, then run autoswitch_status.');
 const summary=errors.map(x=>`${x.provider}${x.http_status?` [HTTP ${x.http_status}]`:''}: ${x.error}`).join(' | ');
 const e=new Error(`All configured providers failed. ${summary}`);
 e.details={attempted,skipped,failed:errors};
 throw e;
}
async function catalogStats() {
 const d=await requestJson('https://openrouter.ai/api/v1/models',{headers:{Accept:'application/json'}},20000);
 if (!Array.isArray(d.data)) throw new Error('OpenRouter catalog response has an unexpected format.');
 const free=d.data.filter(m=>m.pricing?.prompt!=null&&m.pricing?.completion!=null&&Number(m.pricing.prompt)===0&&Number(m.pricing.completion)===0).length;
 return {source:'OpenRouter live catalog',total_models:d.data.length,listed_zero_price_models:free,other_or_unknown_price_models:d.data.length-free,notice:'Counts reflect OpenRouter listed prices, not guaranteed account access, quota, or availability.'};
}
async function modelCatalog({query='',freeOnly=false,limit=100,offset=0,sortBy='free'}={}) {
 const d=await requestJson('https://openrouter.ai/api/v1/models',{headers:{Accept:'application/json'}},20000);
 if (!Array.isArray(d.data)) throw new Error('OpenRouter catalog response has an unexpected format.');
 let rows=d.data.map(m=>{
  const input=m.pricing?.prompt, output=m.pricing?.completion;
  const free=input!=null&&output!=null&&Number(input)===0&&Number(output)===0;
  return {id:m.id,name:m.name||m.id,context_length:m.context_length||null,pricing:{prompt:input??null,completion:output??null},free,provider:(m.id||'').split('/')[0]||'unknown',description:(m.description||'').slice(0,240)};
 });
 const q=clean(query).toLowerCase();
 if(q) rows=rows.filter(x=>(x.id+' '+x.name+' '+x.provider+' '+x.description).toLowerCase().includes(q));
 if(freeOnly) rows=rows.filter(x=>x.free);
 const sorters={
  free:(a,b)=>Number(b.free)-Number(a.free)||a.provider.localeCompare(b.provider)||a.id.localeCompare(b.id),
  name:(a,b)=>a.name.localeCompare(b.name),
  context:(a,b)=>(b.context_length||0)-(a.context_length||0),
  price:(a,b)=>(Number(a.pricing.prompt)||0)-(Number(b.pricing.prompt)||0)
 };
 const sorter=sorters[sortBy]||sorters.free; rows.sort(sorter);
 const n=Math.max(1,Math.min(Number.isFinite(Number(limit))?Math.floor(Number(limit)):100,250));
 const start=Math.max(0,Math.min(Number.isFinite(Number(offset))?Math.floor(Number(offset)):0,10000));
 return {source:'OpenRouter live catalog',catalog_total:d.data.length,total_matching:rows.length,returned:Math.min(n,Math.max(0,rows.length-start)),offset:start,sort_by:sortBy,free_filter:!!freeOnly,notice:'Zero listed input/output price does not guarantee account access, quota, uptime, or free use by every provider. This is the OpenRouter catalog, not a complete list of every provider model.',models:rows.slice(start,start+n)};
}

async function estimateOpenRouterCost({model,prompt,outputTokens=1000}={}) {
 const id=clean(model);
 if(!id) throw new Error('Provide an exact OpenRouter model ID, for example meta-llama/llama-3.3-70b-instruct:free.');
 if(typeof prompt!=='string'||!prompt.trim()) throw new Error('Provide the prompt text to estimate input size.');
 const d=await requestJson('https://openrouter.ai/api/v1/models',{headers:{Accept:'application/json'}},20000);
 const row=d.data?.find(x=>x.id===id);
 if(!row) throw new Error(`Model "${id}" was not found in the live OpenRouter catalog. Check autoswitch_models for the exact ID.`);
 const inputRate=Number(row.pricing?.prompt), outputRate=Number(row.pricing?.completion);
 if(!Number.isFinite(inputRate)||!Number.isFinite(outputRate)) throw new Error('OpenRouter has no usable input/output price for this model.');
 const inputTokens=Math.max(1,Math.ceil(prompt.length/4));
 const out=Math.max(1,Math.min(100000,Math.floor(Number(outputTokens)||1000)));
 const inputCost=inputTokens*inputRate, outputCost=out*outputRate;
 return {model:id,name:row.name||id,estimated_input_tokens:inputTokens,assumed_output_tokens:out,price_per_million_tokens:{input_usd:inputRate*1e6,output_usd:outputRate*1e6},estimated_cost_usd:{input:inputCost,output:outputCost,total:inputCost+outputCost},listed_free:inputRate===0&&outputRate===0,method:'Input tokens estimated as ceil(characters / 4); output tokens are the user-supplied assumption.',notice:'Estimate only. Actual tokenization, cached tokens, provider routing, taxes, account discounts, and billing may differ.'};
}
async function recommendOpenRouter({task='',freeOnly=true,limit=8}={}) {
 const q=clean(task);
 if(!q) throw new Error('Describe the task, e.g. coding, translation, long document analysis, or fast chat.');
 const data=await modelCatalog({query:q,freeOnly:!!freeOnly,limit:Math.max(1,Math.min(20,Number(limit)||8)),offset:0,sortBy:freeOnly?'free':'price'});
 return {...data,task:q,recommendation_basis:'Catalog text match, listed price, and context length only. This is not a quality benchmark and does not guarantee account access or uptime.',tip:'Try two or three candidates with autoswitch_compare before relying on one for important work.'};
}

async function mapLimit(items, limit, worker) {
 const results = new Array(items.length);
 let next = 0;
 const runners = Array.from({length:Math.min(limit,items.length)}, async () => {
  while (true) {
   const index = next++;
   if (index >= items.length) return;
   results[index] = await worker(items[index]);
  }
 });
 await Promise.all(runners);
 return results;
}

function send(obj) { process.stdout.write(JSON.stringify(obj)+'\n'); }
function toolResult(id,text,isError=false) { return {jsonrpc:'2.0',id,result:{content:[{type:'text',text}],isError}}; }
const toolDefs=[
 {name:'autoswitch_help',description:'Show setup instructions, available tools and limitations.',inputSchema:{type:'object',properties:{},additionalProperties:false}},
 {name:'autoswitch_status',description:'Show which provider API keys are configured and selected model IDs. Never reveals API keys.',inputSchema:{type:'object',properties:{},additionalProperties:false}},
 {name:'autoswitch_providers',description:'List all supported providers with official API-key pages, pricing pages and free/trial notes.',inputSchema:{type:'object',properties:{},additionalProperties:false}},
 {name:'autoswitch_models',description:'Search the live OpenRouter model catalog with IDs, context length, prices and listed free status. Supports pagination and sorting.',inputSchema:{type:'object',properties:{query:{type:'string'},free_only:{type:'boolean'},limit:{type:'integer',minimum:1,maximum:250},offset:{type:'integer',minimum:0,maximum:10000},sort_by:{type:'string',enum:['free','name','context','price']}},additionalProperties:false}},
 {name:'autoswitch_free_models',description:'List OpenRouter models with both listed input and output prices at zero. This does not guarantee free quota or availability.',inputSchema:{type:'object',properties:{query:{type:'string'},limit:{type:'integer',minimum:1,maximum:250},offset:{type:'integer',minimum:0,maximum:10000},sort_by:{type:'string',enum:['free','name','context','price']}},additionalProperties:false}},
 {name:'autoswitch_catalog_stats',description:'Show total OpenRouter catalog size and count of models with zero listed input/output prices.',inputSchema:{type:'object',properties:{},additionalProperties:false}},
 {name:'autoswitch_recommend',description:'Find OpenRouter model candidates for a described task, optionally prioritizing models with zero listed prices. Recommendations are based on catalog metadata, not quality benchmarks.',inputSchema:{type:'object',properties:{task:{type:'string',minLength:1,maxLength:500},free_only:{type:'boolean'},limit:{type:'integer',minimum:1,maximum:20}},required:['task'],additionalProperties:false}},
 {name:'autoswitch_estimate_cost',description:'Estimate an OpenRouter model call cost from the live listed per-token price, prompt text length, and assumed output token count. This is an estimate, not a bill quote.',inputSchema:{type:'object',properties:{model:{type:'string',minLength:1,maxLength:300},prompt:{type:'string',minLength:1,maxLength:100000},output_tokens:{type:'integer',minimum:1,maximum:100000}},required:['model','prompt'],additionalProperties:false}},
 {name:'autoswitch_compare',description:'Run the same prompt against up to five selected configured providers and compare their responses. May consume quota or money.',inputSchema:{type:'object',properties:{prompt:{type:'string',minLength:1,maxLength:50000},providers:{type:'array',items:{type:'string',enum:allIds},minItems:1,maxItems:5,uniqueItems:true},system:{type:'string',maxLength:30000},temperature:{type:'number',minimum:0,maximum:2},max_tokens:{type:'integer',minimum:1,maximum:8192}},required:['prompt','providers'],additionalProperties:false}},
 {name:'autoswitch_test',description:'Send a small test request to each configured provider and return per-provider HTTP errors. May consume quota.',inputSchema:{type:'object',properties:{},additionalProperties:false}},
 {name:'autoswitch_test_provider',description:'Validate one configured provider API key and model with a minimal live request. May consume quota.',inputSchema:{type:'object',properties:{provider:{type:'string',enum:allIds}},required:['provider'],additionalProperties:false}},
 {name:'autoswitch_ask',description:'Send a prompt through a selected provider and automatically fall back to other configured providers. Accepts optional model, system prompt, temperature and max output tokens.',inputSchema:{type:'object',properties:{prompt:{type:'string',minLength:1,maxLength:100000},provider:{type:'string',enum:allIds},model:{type:'string',maxLength:300},system:{type:'string',maxLength:30000},temperature:{type:'number',minimum:0,maximum:2},max_tokens:{type:'integer',minimum:1,maximum:8192}},required:['prompt'],additionalProperties:false}}
];
const rl=readline.createInterface({input:process.stdin,crlfDelay:Infinity});
rl.on('line',async line=>{
 let m;
 try {m=JSON.parse(line);} catch { send({jsonrpc:'2.0',id:null,error:{code:-32700,message:'Parse error: invalid JSON'}}); return; }
 const id=m.id;
 if(m.method==='initialize') {send({jsonrpc:'2.0',id,result:{protocolVersion:m.params?.protocolVersion||'2024-11-05',capabilities:{tools:{}},serverInfo:{name:'ai-autoswitch',version:VERSION}}});return;}
 if(typeof m.method==='string'&&m.method.startsWith('notifications/')) return;
 if(m.method==='ping') {if(id!==undefined)send({jsonrpc:'2.0',id,result:{}});return;}
 if(m.method==='tools/list') {send({jsonrpc:'2.0',id,result:{tools:toolDefs}});return;}
 if(m.method==='tools/call') {
  const name=m.params?.name; const a=m.params?.arguments||{};
  try {
   if(name==='autoswitch_help') {
    const help={version:VERSION,tools:toolDefs.map(t=>t.name),quickStart:['Add at least one API key in Claude extension settings.','Run autoswitch_status.','Run autoswitch_test to diagnose API access (may consume quota).','Use autoswitch_ask with a prompt; optionally set provider, exact model, system prompt and output limit.','Use autoswitch_compare to compare up to five configured providers.','Use autoswitch_recommend to shortlist models for a task.','Use autoswitch_estimate_cost to estimate OpenRouter costs before sending a large prompt.'],providerIds:providerInfo.map(x=>x.id),limitations:['MCP tools run only when Claude invokes them.','This extension cannot intercept Claude subscription limits or display a custom installer popup.','The live model list is OpenRouter-only; other providers may expose additional models.','Free labels and quotas can change; check provider terms.']};
    send(toolResult(id,JSON.stringify(help,null,2)));return;
   }
   if(name==='autoswitch_status') {send(toolResult(id,JSON.stringify({version:VERSION,primary,fallbackOrder:order,providers:listStatus()},null,2)));return;}
   if(name==='autoswitch_providers') {send(toolResult(id,JSON.stringify(providerInfo,null,2)));return;}
   if(name==='autoswitch_models'||name==='autoswitch_free_models') {
    const data=await modelCatalog({query:a.query||'',freeOnly:name==='autoswitch_free_models'||a.free_only===true,limit:a.limit??100,offset:a.offset??0,sortBy:a.sort_by||'free'});
    send(toolResult(id,JSON.stringify(data,null,2)));return;
   }
   if(name==='autoswitch_catalog_stats') {send(toolResult(id,JSON.stringify(await catalogStats(),null,2)));return;}
   if(name==='autoswitch_recommend') {send(toolResult(id,JSON.stringify(await recommendOpenRouter({task:a.task,freeOnly:a.free_only!==false,limit:a.limit??8}),null,2)));return;}
   if(name==='autoswitch_estimate_cost') {send(toolResult(id,JSON.stringify(await estimateOpenRouterCost({model:a.model,prompt:a.prompt,outputTokens:a.output_tokens??1000}),null,2)));return;}
   if(name==='autoswitch_compare') {
    const ids=a.providers;
    if(!Array.isArray(ids)||ids.length<1||ids.length>5||ids.some(x=>!allIds.includes(x))||new Set(ids).size!==ids.length) throw new Error('Choose 1 to 5 unique supported provider IDs.');
    if(!clean(a.prompt)||a.prompt.length>50000) throw new Error('Prompt must contain 1 to 50,000 characters.');
    const results=await Promise.all(ids.map(async pid=>{
     if(!configured(pid)) return {provider:pid,ok:false,error:'API key is not configured'};
     try {const r=await askOne(pid,a.prompt,clean(a.system)||'You are responding through AI AutoSwitch. Answer directly.', '',{temperature:a.temperature,max_tokens:a.max_tokens});return {provider:pid,provider_name:labelFor(pid),ok:true,model:r.model,answer:r.text};}
     catch(e){return {provider:pid,provider_name:labelFor(pid),ok:false,http_status:e.status||null,error:e.message};}
    }));
    send(toolResult(id,JSON.stringify({compared:results.length,successful:results.filter(x=>x.ok).length,results,note:'Each provider call may consume quota or incur charges.'},null,2)));return;
   }
   if(name==='autoswitch_test_provider') {
    const pid=a.provider;
    if(!allIds.includes(pid)) throw new Error(`Unknown provider: ${pid}`);
    if(!configured(pid)) throw new Error(`${labelFor(pid)} is not configured. Add its API key in Claude Desktop extension settings.`);
    try {
     const r=await askOne(pid,'Reply with exactly: OK','Reply with exactly the word OK.','',{max_tokens:16,temperature:0});
     send(toolResult(id,JSON.stringify({provider:pid,name:labelFor(pid),ok:true,model:r.model,reply:String(r.text).slice(0,80),note:'A live test request was sent and may consume quota.'},null,2)));
    } catch(e) {
     send(toolResult(id,JSON.stringify({provider:pid,name:labelFor(pid),ok:false,http_status:e.status||null,error:e.message,hint:e.hint||'Check the provider console and model ID.',note:'The API key was not included in this report.'},null,2),true));
    }
    return;
   }
   if(name==='autoswitch_test') {
    const results=await mapLimit(allIds.filter(configured),4,async pid=>{
     try {const r=await askOne(pid,'Reply with exactly: OK','Reply with exactly the word OK.','',{max_tokens:16,temperature:0});return {provider:pid,ok:true,model:r.model,reply:String(r.text).slice(0,80)};}
     catch(e) {return {provider:pid,ok:false,model:modelFor(pid),http_status:e.status||null,error:e.message,hint:e.hint||null};}
    });
    send(toolResult(id,JSON.stringify({tested:results.length,successful:results.filter(x=>x.ok).length,failed:results.filter(x=>!x.ok).length,results,note:'Tests can consume provider quota. API keys are never included in this report.'},null,2)));return;
   }
   if(name==='autoswitch_ask') {
    const out=await ask(String(a.prompt||''),a.provider,a.model,{system:clean(a.system),temperature:a.temperature,max_tokens:a.max_tokens});
    send(toolResult(id,JSON.stringify(out,null,2)));return;
   }
   send({jsonrpc:'2.0',id,error:{code:-32602,message:`Unknown tool: ${name||'(missing)'}`}});
  } catch(e) {
   const hint=e.hint?`\nHow to fix: ${e.hint}`:'';
   const detail=e.details?`\nDetails: ${JSON.stringify(e.details)}`:'';
   process.stderr.write(JSON.stringify({level:'error',time:new Date().toISOString(),message:e.message,status:e.status||null})+'\n');
   send(toolResult(id,`${e.message}${hint}${detail}`,true));
  }
  return;
 }
 if(id!==undefined) send({jsonrpc:'2.0',id,error:{code:-32601,message:'Method not found'}});
});
