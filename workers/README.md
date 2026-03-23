# LLM Proxy Worker 部署说明

## 概述

这个 Worker 用于解决前端直接调用 OpenAI/Anthropic API 时的 CORS 跨域问题。

## 部署步骤

### 1. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```

### 3. 部署 Worker

```bash
cd workers
wrangler deploy
```

或者使用提供的脚本：

```bash
./deploy-worker.sh
```

### 4. 配置环境变量

部署完成后，在 Cloudflare Dashboard 中设置环境变量：

1. 进入 **Workers & Pages**
2. 找到你的 Worker（默认名: `imarticle-llm-proxy`）
3. 点击 **Settings** > **Variables**
4. 添加以下变量：
   - `ANTHROPIC_API_KEY`: 你的 Anthropic API Key
   - `OPENAI_API_KEY`: 你的 OpenAI API Key（可选）

### 5. 配置 Pages Functions（如果需要）

如果你的 Cloudflare Pages 项目和 Worker 是分开的，需要配置 Pages Functions 来路由 API 请求到 Worker。

在 `functions/api/[[path]].js` 创建路由：

```javascript
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const workerUrl = `https://your-worker-name.your-subdomain.workers.dev${url.pathname}${url.search}`;
  
  return fetch(workerUrl, {
    method: context.request.method,
    headers: context.request.headers,
    body: context.request.body,
  });
}
```

## API 端点

部署后，前端可以通过以下端点调用：

- **Anthropic**: `/api/anthropic/v1/messages`
- **OpenAI**: `/api/openai/v1/chat/completions`
- **通用代理**: `/api/proxy?url=<目标URL>&key=<API Key>`

## 本地开发

本地开发时，前端会直接调用 API，不需要 Worker。

## 注意事项

1. **安全性**: API Key 存储在 Worker 环境变量中，不会暴露到前端
2. **CORS**: Worker 自动处理 CORS 预检请求
3. **错误处理**: Worker 会转发 API 的错误响应
