import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'configure-server',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url !== '/api/llm') {
            return next();
          }

          // 处理 CORS 预检请求
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, anthropic-version');
            res.setHeader('Access-Control-Max-Age', '86400');
            res.end();
            return;
          }

          // 只处理 POST 请求
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.end('Method not allowed');
            return;
          }

          try {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
              try {
                const data = JSON.parse(body);
                const { provider, baseUrl, apiKey, messages, system, max_tokens, model, stream } = data;

                console.log('[Local Proxy] 收到请求:', { provider, baseUrl, apiKey: apiKey ? apiKey.substring(0, 10) + '...' : 'null' });

                if (!apiKey) {
                  console.error('[Local Proxy] API Key 为空');
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(JSON.stringify({ error: 'API Key 不能为空' }));
                  return;
                }

                // 根据 provider 构建请求
                let targetUrl, headers, requestBody;

                if (provider === 'anthropic') {
                  // 使用 Anthropic 原生格式
                  // 火山引擎需要同时设置 x-api-key、Authorization 和 anthropic-version
                  const isVolces = baseUrl.includes('volces.com') || baseUrl.includes('ark.cn-beijing');
                  targetUrl = isVolces ? baseUrl.replace(/\/$/, '') : `${baseUrl.replace(/\/$/, '')}/messages`;
                  headers = {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    // 'Authorization': `Bearer ${apiKey}`,
                    'anthropic-version': '2023-06-01',
                  };
                  requestBody = {
                    model: model || 'claude-sonnet-4-20250514',
                    max_tokens: max_tokens || 4000,
                    system,
                    messages,
                    stream: stream || false,
                  };
                } else if (provider === 'openai' || provider === 'aliyun') {
                  targetUrl = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
                  headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                  };
                  requestBody = {
                    model: model || 'gpt-4o-mini',
                    max_tokens: max_tokens || 4000,
                    messages: system ? [{ role: 'system', content: system }, ...messages] : messages,
                    temperature: 0.7,
                    stream: stream || false,
                  };
                } else {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(JSON.stringify({ error: `不支持的 provider: ${provider}` }));
                  return;
                }

                console.log('[Local Proxy] 转发请求到:', targetUrl);
                console.log('[Local Proxy] Provider:', provider);
                console.log('[Local Proxy] Headers:', { ...headers, 'x-api-key': headers['x-api-key'] ? '***' : undefined });
                console.log('[Local Proxy] Request Body:', JSON.stringify(requestBody, null, 2));

                const response = await fetch(targetUrl, {
                  method: 'POST',
                  headers,
                  body: JSON.stringify(requestBody),
                });

                console.log('[Local Proxy] 响应状态:', response.status, response.statusText);

                res.statusCode = response.status;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');

                const responseData = await response.text();
                res.end(responseData);
              } catch (error) {
                console.error('[Local Proxy] Error:', error);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ error: error.message }));
              }
            });
          } catch (error) {
            console.error('[Local Proxy] Error:', error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify({ error: error.message }));
          }
        });
      }
    }
  ],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
  },
  server: {
    port: 5173,
    host: true,
  },
})
