/**
 * LLM API 代理 - 直接调用版本
 * 部署在 Cloudflare Pages Functions，直接转发到 LLM API
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key, anthropic-version',
  'Access-Control-Max-Age': '86400',
};

export async function onRequest(context) {
  const { request, env } = context;

  // 处理预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const body = await request.json();
    const { provider = 'anthropic', messages, system, max_tokens = 4000, model, tools, enable_search } = body;

    console.log('[LLM Proxy] Provider:', provider, 'Model:', model, 'Enable Search:', enable_search);

    if (provider === 'anthropic') {
      return await callAnthropic(env, messages, system, max_tokens, model, tools, corsHeaders);
    } else if (provider === 'openai') {
      return await callOpenAI(env, messages, system, max_tokens, model, tools, corsHeaders);
    } else if (provider === 'aliyun') {
      return await callAliyun(env, messages, system, max_tokens, model, enable_search, corsHeaders);
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported provider' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('LLM Proxy Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function callAnthropic(env, messages, system, max_tokens, model, tools, corsHeaders) {
  const apiKey = env.ANTHROPIC_API_KEY;
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

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

async function callAliyun(env, messages, system, max_tokens, model, enable_search, corsHeaders) {
  const apiKey = env.DASHSCOPE_API_KEY;
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
    model: model || 'qwen-plus',
    max_tokens,
    messages: openaiMessages,
    temperature: 0.7,
    ...(enable_search !== undefined && { enable_search }),
  };

  const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();
  
  console.log('[Aliyun Proxy] Response status:', response.status, 'Model:', data.model);

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

async function callOpenAI(env, messages, system, max_tokens, model, tools, corsHeaders) {
  const apiKey = env.OPENAI_API_KEY;
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

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}
