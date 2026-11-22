# Каталог провайдеров NexaFlow

В MCP-сервере определены 18 endpoint-адаптеров. Ссылки ниже ведут на официальные страницы ключей и тарифов. Бесплатность указана как характер доступа/возможные квоты, а не как обещание бесплатных вызовов.

| Провайдер | Получить API-ключ | Цены / тарифы | Примечание |
|---|---|---|---|
| xAI / Grok | https://console.x.ai/ | https://x.ai/api | API-тариф; проверять актуальные цены в консоли |
| Groq | https://console.groq.com/keys | https://groq.com/pricing/ | Возможны бесплатные developer limits |
| Google Gemini | https://aistudio.google.com/apikey | https://ai.google.dev/gemini-api/docs/pricing | У некоторых моделей есть бесплатная квота |
| OpenRouter | https://openrouter.ai/keys | https://openrouter.ai/pricing | У отдельных моделей нулевая опубликованная цена; квоты ограничены |
| Mistral | https://console.mistral.ai/ | https://mistral.ai/pricing/ | Trial/paid; зависит от аккаунта |
| Cloudflare Workers AI | https://dash.cloudflare.com/ | https://developers.cloudflare.com/workers-ai/platform/pricing/ | Зависит от тарифа Cloudflare |
| NVIDIA NIM | https://build.nvidia.com/ | https://build.nvidia.com/ | Пробный доступ и ограничения меняются |
| Cohere | https://dashboard.cohere.com/api-keys | https://cohere.com/pricing | Trial limits |
| SambaNova | https://cloud.sambanova.ai/ | https://cloud.sambanova.ai/ | Доступность и лимиты зависят от аккаунта |
| Z.ai | https://z.ai/ | https://z.ai/ | Проверять текущий тариф в кабинете |
| OpenAI | https://platform.openai.com/api-keys | https://openai.com/api/pricing/ | API оплачивается отдельно от ChatGPT |
| DeepSeek | https://platform.deepseek.com/api_keys | https://api-docs.deepseek.com/quick_start/pricing | Тариф зависит от модели и кеширования |
| Cerebras | https://cloud.cerebras.ai/ | https://www.cerebras.ai/pricing | Возможны бесплатные developer limits |
| Together AI | https://api.together.ai/ | https://www.together.ai/pricing | Trial credits/paid |
| Fireworks AI | https://fireworks.ai/ | https://fireworks.ai/pricing | Trial credits/paid |
| Hugging Face | https://huggingface.co/settings/tokens | https://huggingface.co/pricing | Free credits/limits могут меняться |
| GitHub Models | https://github.com/marketplace/models | https://docs.github.com/en/github-models | Доступ и rate limits зависят от аккаунта |
| Perplexity | https://www.perplexity.ai/settings/api | https://docs.perplexity.ai/guides/pricing | API оплачивается по тарифу Perplexity |

## Модели и стоимость

Динамический каталог `autoswitch_models` использует официальный публичный каталог OpenRouter (`https://openrouter.ai/api/v1/models`). В нём доступны модельный ID, имя, context length и цены `prompt`/`completion` в USD за токен. Приложение отображает эквивалентную стоимость за 1 млн токенов.

Для остальных провайдеров проект не подменяет отсутствие живых данных придуманными цифрами: их модели/цены проверяются в официальных консолях и по ссылкам выше. Нулевая цена в OpenRouter не гарантирует бесплатную квоту, uptime или доступ из конкретного региона.
