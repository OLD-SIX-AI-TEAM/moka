// 将 /api/proxy 请求转发到 Worker
export async function onRequest(context) {
  const workerUrl = 'https://imarticle-llm-proxy.renmengkai.workers.dev/api/proxy';
  
  // 复制请求头
  const headers = new Headers(context.request.headers);
  headers.delete('host');
  
  // 确保必要的头部被正确转发
  const requiredHeaders = ['x-target-url', 'authorization', 'x-api-key', 'anthropic-version'];
  
  const response = await fetch(workerUrl, {
    method: context.request.method,
    headers: headers,
    body: context.request.body,
  });

  // 如果 Worker 返回错误，记录详细信息
  if (!response.ok) {
    const errorText = await response.clone().text();
    console.error('Worker proxy error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorText,
      targetUrl: headers.get('x-target-url'),
    });
  }

  return response;
}
