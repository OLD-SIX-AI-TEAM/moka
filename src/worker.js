/**
 * Cloudflare Worker 入口 - 处理 API 路由和静态资源
 */

// 本地开发使用的内存存储（当 USAGE_KV 未配置时）
const localUsageStore = new Map();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key, anthropic-version',
  'Access-Control-Max-Age': '86400',
};

const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
};

/**
 * 使用 RSA 私钥解密数据
 * @param {string} encryptedBase64 - Base64 编码的加密数据
 * @param {string} privateKeyPem - PEM 格式的私钥
 * @returns {Promise<string>} - 解密后的文本
 */
async function decryptWithPrivateKey(encryptedBase64, privateKeyPem) {
  try {
    // 清理私钥格式
    const privateKeyBase64 = privateKeyPem
      .replace(/-----BEGIN PRIVATE KEY-----/g, '')
      .replace(/-----END PRIVATE KEY-----/g, '')
      .replace(/\s/g, '');
    
    // 将 Base64 转换为 Uint8Array
    const privateKeyBytes = Uint8Array.from(atob(privateKeyBase64), c => c.charCodeAt(0));
    
    // 导入私钥
    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyBytes.buffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      false,
      ['decrypt']
    );
    
    // 将加密的 Base64 转换为 Uint8Array
    const encryptedBytes = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
    
    // 解密
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP',
      },
      privateKey,
      encryptedBytes.buffer
    );
    
    // 转换为字符串
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('解密失败:', error);
    throw new Error('API Key 解密失败');
  }
}

// 使用限制配置
const USAGE_LIMITS = {
  dailyMaxRequests: 5,  // 每日最大请求数
  monthlyMaxRequests: 50,  // 每月最大请求数
  maxTokensPerRequest: 2000,  // 每次请求最大token数
};

// 获取今天的日期字符串 (YYYY-MM-DD)
function getToday() {
  return new Date().toISOString().split('T')[0];
}

// 获取本月字符串 (YYYY-MM)
function getThisMonth() {
  return new Date().toISOString().slice(0, 7);
}

// 检查使用限制
async function checkUsageLimits(env) {
  const today = getToday();
  const thisMonth = getThisMonth();

  // 获取当前使用量
  const dailyKey = `usage:daily:${today}`;
  const monthlyKey = `usage:monthly:${thisMonth}`;

  let dailyCount = 0;
  let monthlyCount = 0;

  if (env.USAGE_KV) {
    // 使用 Cloudflare KV
    dailyCount = parseInt(await env.USAGE_KV.get(dailyKey) || '0');
    monthlyCount = parseInt(await env.USAGE_KV.get(monthlyKey) || '0');
  } else {
    // 使用本地内存存储
    dailyCount = parseInt(localUsageStore.get(dailyKey) || '0');
    monthlyCount = parseInt(localUsageStore.get(monthlyKey) || '0');
  }

  return {
    dailyCount,
    monthlyCount,
    dailyRemaining: USAGE_LIMITS.dailyMaxRequests - dailyCount,
    monthlyRemaining: USAGE_LIMITS.monthlyMaxRequests - monthlyCount,
    exceeded: dailyCount >= USAGE_LIMITS.dailyMaxRequests || monthlyCount >= USAGE_LIMITS.monthlyMaxRequests,
  };
}

// 记录使用量
async function recordUsage(env, tokens = 1) {
  const today = getToday();
  const thisMonth = getThisMonth();

  const dailyKey = `usage:daily:${today}`;
  const monthlyKey = `usage:monthly:${thisMonth}`;

  console.log('[recordUsage] Checking USAGE_KV:', !!env.USAGE_KV);

  if (env.USAGE_KV) {
    // 使用 Cloudflare KV
    const dailyCount = parseInt(await env.USAGE_KV.get(dailyKey) || '0');
    const monthlyCount = parseInt(await env.USAGE_KV.get(monthlyKey) || '0');

    console.log('[recordUsage] Current KV counts - daily:', dailyCount, 'monthly:', monthlyCount);

    await env.USAGE_KV.put(dailyKey, String(dailyCount + 1), { expirationTtl: 86400 * 2 });
    await env.USAGE_KV.put(monthlyKey, String(monthlyCount + 1), { expirationTtl: 86400 * 35 });

    console.log('[recordUsage] Updated KV counts - daily:', dailyCount + 1, 'monthly:', monthlyCount + 1);
  } else {
    // 使用本地内存存储
    const dailyCount = parseInt(localUsageStore.get(dailyKey) || '0');
    const monthlyCount = parseInt(localUsageStore.get(monthlyKey) || '0');

    console.log('[recordUsage] Current local counts - daily:', dailyCount, 'monthly:', monthlyCount);

    localUsageStore.set(dailyKey, String(dailyCount + 1));
    localUsageStore.set(monthlyKey, String(monthlyCount + 1));

    console.log('[recordUsage] Updated local counts - daily:', dailyCount + 1, 'monthly:', monthlyCount + 1);
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 处理预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // API 路由处理
    if (path === '/api/llm') {
      return handleLLM(request, env);
    }

    if (path === '/api/proxy') {
      return handleProxy(request, env);
    }

    // 获取使用限制状态
    if (path === '/api/usage') {
      const usage = await checkUsageLimits(env);
      return new Response(JSON.stringify({
        dailyMax: USAGE_LIMITS.dailyMaxRequests,
        monthlyMax: USAGE_LIMITS.monthlyMaxRequests,
        dailyUsed: usage.dailyCount,
        monthlyUsed: usage.monthlyCount,
        dailyRemaining: usage.dailyRemaining,
        monthlyRemaining: usage.monthlyRemaining,
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    // 获取 RSA 公钥（用于前端加密）
    if (path === '/api/public-key') {
      const publicKey = env.RSA_PUBLIC_KEY;
      if (!publicKey) {
        return new Response(JSON.stringify({ error: 'Public key not configured' }), {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        });
      }
      return new Response(JSON.stringify({ publicKey }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    // 其他请求交给静态资源处理
    const response = await env.ASSETS.fetch(request);
    
    // 添加安全头部到静态资源响应
    const newHeaders = new Headers(response.headers);
    Object.entries(securityHeaders).forEach(([key, value]) => {
      newHeaders.set(key, value);
    });
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};

async function handleLLM(request, env) {
  // 只接受 POST 请求
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: `Method ${request.method} not allowed` }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { provider = 'anthropic', messages, system, max_tokens = 4000, model, tools, enable_search, encryptedApiKey, stream = false } = body;
    
    // 限制 max_tokens
    const limitedMaxTokens = Math.min(max_tokens, USAGE_LIMITS.maxTokensPerRequest);

    // 解密用户提供的 API Key
    let userApiKey = null;
    if (encryptedApiKey && env.RSA_PRIVATE_KEY) {
      try {
        userApiKey = await decryptWithPrivateKey(encryptedApiKey, env.RSA_PRIVATE_KEY);
        console.log('[LLM Proxy] Provider:', provider, 'Model:', model, 'Enable Search:', enable_search, 'UseUserKey: true (decrypted)', 'Stream:', stream);
      } catch (e) {
        console.error('[LLM Proxy] 解密失败:', e);
        return new Response(JSON.stringify({ error: 'API Key 解密失败，请重新配置' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else {
      console.log('[LLM Proxy] Provider:', provider, 'Model:', model, 'Enable Search:', enable_search, 'UseUserKey: false', 'Stream:', stream);
    }

    // 如果没有用户 API Key，检查使用限制
    if (!userApiKey) {
      const usage = await checkUsageLimits(env);
      if (usage.exceeded) {
        return new Response(JSON.stringify({ 
          error: 'Usage limit exceeded',
          message: `今日已使用 ${usage.dailyCount}/${USAGE_LIMITS.dailyMaxRequests} 次，本月已使用 ${usage.monthlyCount}/${USAGE_LIMITS.monthlyMaxRequests} 次`,
          dailyRemaining: usage.dailyRemaining,
          monthlyRemaining: usage.monthlyRemaining,
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    let result;
    if (provider === 'anthropic') {
      result = await callAnthropic(env, messages, system, limitedMaxTokens, model, tools, corsHeaders, userApiKey, stream);
    } else if (provider === 'openai') {
      result = await callOpenAI(env, messages, system, limitedMaxTokens, model, tools, corsHeaders, userApiKey, stream);
    } else if (provider === 'aliyun') {
      result = await callAliyun(env, messages, system, limitedMaxTokens, model, enable_search, corsHeaders, userApiKey, stream);
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported provider' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // 如果没有使用用户 API Key，记录使用量
    if (!userApiKey) {
      console.log('[LLM Proxy] Recording usage, USAGE_KV exists:', !!env.USAGE_KV);
      await recordUsage(env);
    } else {
      console.log('[LLM Proxy] Using user API key, skipping usage record');
    }

    return result;
  } catch (error) {
    console.error('LLM Proxy Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function callAnthropic(env, messages, system, max_tokens, model, tools, corsHeaders, userApiKey, stream = false) {
  const apiKey = userApiKey || env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const requestBody = {
    model: model || 'claude-sonnet-4-20250514',
    max_tokens,
    system,
    messages,
    stream,
    ...(tools && { tools }),
  };

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(requestBody),
  });

  // 如果是流式响应，直接透传
  if (stream) {
    return new Response(response.body, {
      status: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
      },
    });
  }

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

async function callAliyun(env, messages, system, max_tokens, model, enable_search, corsHeaders, userApiKey, stream = false) {
  const apiKey = userApiKey || env.DASHSCOPE_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'DASHSCOPE_API_KEY not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const openaiMessages = system
    ? [{ role: 'system', content: system }, ...messages]
    : messages;

  const requestBody = {
    model: model || 'qwen3.5-plus',
    max_tokens,
    messages: openaiMessages,
    temperature: 0.7,
    stream,
    ...(enable_search !== undefined && { enable_search }),
  };

  console.log('[Aliyun Proxy] Request:', { model: requestBody.model, stream, messageCount: openaiMessages.length });

  const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  console.log('[Aliyun Proxy] Response status:', response.status);

  // 如果响应不成功，返回错误信息
  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Aliyun Proxy] Error response:', errorText);
    return new Response(JSON.stringify({ error: `API 错误: ${response.status}`, details: errorText }), {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 如果是流式响应，直接透传
  if (stream) {
    return new Response(response.body, {
      status: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
      },
    });
  }

  const data = await response.json();
  
  console.log('[Aliyun Proxy] Response model:', data.model);

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

async function callOpenAI(env, messages, system, max_tokens, model, tools, corsHeaders, userApiKey, stream = false) {
  const apiKey = userApiKey || env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const openaiMessages = system
    ? [{ role: 'system', content: system }, ...messages]
    : messages;

  const requestBody = {
    model: model || 'gpt-4o-mini',
    max_tokens,
    messages: openaiMessages,
    temperature: 0.7,
    stream,
    ...(tools && { tools }),
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  // 如果是流式响应，直接透传
  if (stream) {
    return new Response(response.body, {
      status: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
      },
    });
  }

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

async function handleProxy(request, env) {
  const targetUrl = request.headers.get('x-target-url');
  if (!targetUrl) {
    return new Response(JSON.stringify({ error: 'Missing x-target-url header' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 构建转发请求头
  const headers = {
    'Content-Type': 'application/json',
  };

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

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
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
