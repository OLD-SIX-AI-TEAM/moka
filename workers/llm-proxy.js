/**
 * LLM API 代理 Worker
 * 解决前端直接调用 LLM API 的跨域问题
 * 支持通过请求头传递 API Key 和目标 URL
 */

// CORS 头部配置
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key, anthropic-version, x-target-url',
  'Access-Control-Max-Age': '86400',
};

// 允许的目标域名白名单（用于安全验证）
// 注意：这里只检查 hostname，不包含端口
const ALLOWED_DOMAINS = [
  'api.openai.com',
  'api.anthropic.com',
  'api.deepseek.com',
  'api.siliconflow.cn',
  // 添加你的自定义域名到白名单（支持 IP 地址）
  '45.120.102.120',
  'localhost',
  '127.0.0.1',
];

// 检查 URL 是否在白名单中
function isAllowedUrl(urlString) {
  try {
    const url = new URL(urlString);
    const hostname = url.hostname;
    console.log('[Debug] Checking URL:', urlString, 'Hostname:', hostname);
    return ALLOWED_DOMAINS.some(domain => {
      const match = hostname === domain || hostname.endsWith('.' + domain);
      if (match) console.log('[Debug] Matched domain:', domain);
      return match;
    });
  } catch (e) {
    console.error('[Debug] URL parsing error:', e.message);
    return false;
  }
}

export default {
  async fetch(request, env, ctx) {
    // 处理预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // 通用代理端点 - 通过请求头传递目标 URL 和认证信息
      if (path === '/api/proxy') {
        // 从请求头获取目标 URL
        const targetUrl = request.headers.get('x-target-url');
        if (!targetUrl) {
          return new Response(JSON.stringify({ error: 'Missing x-target-url header' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // 验证目标 URL 是否在白名单中（开发环境可暂时注释掉此检查）
        // if (!isAllowedUrl(targetUrl)) {
        //   return new Response(JSON.stringify({ 
        //     error: 'Target URL not allowed',
        //     message: 'Please add your domain to ALLOWED_DOMAINS in the Worker code',
        //     url: targetUrl 
        //   }), {
        //     status: 403,
        //     headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        //   });
        // }

        // 检查是否为 HTTP 地址（警告但不阻止）
        if (targetUrl.startsWith('http:')) {
          console.warn('[Warning] Requesting HTTP URL from HTTPS page:', targetUrl);
        }

        // 构建转发请求头
        const headers = {
          'Content-Type': 'application/json',
        };

        // 从原始请求头复制认证相关头部
        const authHeader = request.headers.get('authorization');
        if (authHeader) {
          headers['Authorization'] = authHeader;
        }

        const apiKey = request.headers.get('x-api-key');
        if (apiKey) {
          headers['x-api-key'] = apiKey;
        }

        const anthropicVersion = request.headers.get('anthropic-version');
        if (anthropicVersion) {
          headers['anthropic-version'] = anthropicVersion;
        }

        // 转发请求
        const response = await fetch(targetUrl, {
          method: request.method,
          headers,
          body: request.body,
        });

        // 复制响应状态和数据
        const responseHeaders = {
          ...corsHeaders,
          'Content-Type': response.headers.get('content-type') || 'application/json',
        };

        return new Response(response.body, {
          status: response.status,
          headers: responseHeaders,
        });
      }

      // Anthropic API 代理 - 使用 Worker 环境变量中的 Key（向后兼容）
      if (path.startsWith('/api/anthropic')) {
        const targetPath = path.replace('/api/anthropic', '');
        const targetUrl = `https://api.anthropic.com${targetPath}`;
        
        const response = await fetch(targetUrl, {
          method: request.method,
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: request.body,
        });

        return new Response(response.body, {
          status: response.status,
          headers: {
            ...corsHeaders,
            'Content-Type': response.headers.get('content-type') || 'application/json',
          },
        });
      }

      // OpenAI API 代理 - 使用 Worker 环境变量中的 Key（向后兼容）
      if (path.startsWith('/api/openai')) {
        const targetPath = path.replace('/api/openai', '');
        const targetUrl = `https://api.openai.com${targetPath}`;
        
        const response = await fetch(targetUrl, {
          method: request.method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
          },
          body: request.body,
        });

        return new Response(response.body, {
          status: response.status,
          headers: {
            ...corsHeaders,
            'Content-Type': response.headers.get('content-type') || 'application/json',
          },
        });
      }

      return new Response(JSON.stringify({ error: 'Not found', path }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
