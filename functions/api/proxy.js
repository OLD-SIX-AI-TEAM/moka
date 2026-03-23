// 将 /api/proxy 请求转发到 Worker
export async function onRequest(context) {
  const workerUrl = 'https://imarticle-llm-proxy.renmengkai.workers.dev/api/proxy';
  
  // 复制请求头
  const headers = new Headers(context.request.headers);
  headers.delete('host');
  
  return fetch(workerUrl, {
    method: context.request.method,
    headers: headers,
    body: context.request.body,
  });
}
