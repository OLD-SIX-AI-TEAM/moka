# LLM Proxy Worker 部署说明

## 概述

这个 Cloudflare Worker 用于解决前端直接调用 OpenAI/Anthropic 等 LLM API 时的 CORS 跨域问题，同时保护 API Key 不被暴露到前端代码中。

## 支持的 API 提供商

- **Anthropic Claude** - `api.anthropic.com`
- **OpenAI** - `api.openai.com`
- **DeepSeek** - `api.deepseek.com`
- **SiliconFlow** - `api.siliconflow.cn`
- **自定义 API** - 支持通过白名单配置添加其他兼容 OpenAI API 格式的服务

## 部署步骤

### 1. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```

这将打开浏览器让你授权访问 Cloudflare 账户。

### 3. 部署 Worker

#### 方式一：使用 Wrangler 命令

```bash
cd workers
wrangler deploy
```

#### 方式二：使用提供的脚本

```bash
./deploy-worker.sh
```

部署成功后，会输出 Worker 的访问地址，例如：
```
https://imarticle-llm-proxy.your-account.workers.dev
```

### 4. 配置环境变量

部署完成后，需要在 Cloudflare Dashboard 中设置 API Key：

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages**
3. 找到你的 Worker（默认名: `imarticle-llm-proxy`）
4. 点击 **Settings** > **Variables**
5. 添加以下环境变量：

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `ANTHROPIC_API_KEY` | Anthropic API Key | 可选（使用 Claude 时必需） |
| `OPENAI_API_KEY` | OpenAI API Key | 可选（使用 GPT 时必需） |

**注意**：设置环境变量后，需要重新部署 Worker 才能生效。

### 5. 配置前端项目

#### 如果使用 Cloudflare Pages + Functions（推荐）

如果你的前端项目也部署在 Cloudflare Pages 上，可以配置 Pages Functions 来路由 API 请求到 Worker。

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

#### 如果使用通用代理模式

前端可以直接调用 Worker 的 `/api/proxy` 端点，通过请求头传递目标 URL 和 API Key：

```javascript
const response = await fetch('https://your-worker.workers.dev/api/proxy', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-target-url': 'https://api.anthropic.com/v1/messages',
    'x-api-key': 'your-api-key', // 或通过 Authorization 头部传递
  },
  body: JSON.stringify({
    model: 'claude-3-sonnet-20240229',
    messages: [{ role: 'user', content: 'Hello' }],
    max_tokens: 1000,
  }),
});
```

## API 端点

部署后，可通过以下端点调用：

### 通用代理端点（推荐）

```
POST /api/proxy
```

请求头：
- `x-target-url`: 目标 API 的完整 URL（必需）
- `Authorization`: Bearer Token 认证（可选）
- `x-api-key`: API Key 认证（可选）
- `anthropic-version`: Anthropic API 版本（调用 Claude 时必需）

### Anthropic 专用端点（向后兼容）

```
POST /api/anthropic/v1/messages
```

使用 Worker 环境变量中配置的 `ANTHROPIC_API_KEY`。

### OpenAI 专用端点（向后兼容）

```
POST /api/openai/v1/chat/completions
```

使用 Worker 环境变量中配置的 `OPENAI_API_KEY`。

## 安全说明

### 域名白名单

Worker 代码中定义了允许的目标域名白名单（`ALLOWED_DOMAINS`）：

```javascript
const ALLOWED_DOMAINS = [
  'api.openai.com',
  'api.anthropic.com',
  'api.deepseek.com',
  'api.siliconflow.cn',
  // 添加你的自定义域名
];
```

如需添加自定义 API 域名，请修改 `llm-proxy.js` 中的白名单配置。

### 安全建议

1. **生产环境**：建议启用域名白名单验证（取消代码中的注释）
2. **API Key 管理**：将 API Key 存储在 Worker 环境变量中，不要暴露到前端
3. **HTTPS 强制**：Worker 会自动处理 HTTPS 请求，避免明文传输

## 本地开发

本地开发时，前端可以直接调用 LLM API（需要配置 CORS 插件或使用浏览器禁用安全策略模式），不需要通过 Worker。

在 `.env` 文件中配置 API Key：

```env
VITE_LLM_PROVIDER=anthropic
VITE_LLM_API_KEY=your-api-key
```

## 故障排查

### 部署失败

1. 检查 Wrangler 是否已登录：`wrangler whoami`
2. 检查 `wrangler.toml` 配置是否正确
3. 查看详细错误信息：`wrangler deploy --verbose`

### API 调用失败

1. 检查环境变量是否已正确设置
2. 查看 Worker 日志：Cloudflare Dashboard > Workers > 你的 Worker > Logs
3. 确认目标 URL 在白名单中（如果启用了白名单验证）

### CORS 错误

1. 确认请求方法在允许列表中（GET, POST, OPTIONS）
2. 检查请求头是否包含 `Content-Type` 和 `Authorization`
3. 确认 Worker 已正确部署并返回 CORS 头部

## 更新 Worker

修改代码后重新部署：

```bash
cd workers
wrangler deploy
```

## 删除 Worker

```bash
cd workers
wrangler delete
```

## 相关文件

- `llm-proxy.js` - Worker 主代码
- `wrangler.toml` - Wrangler 配置文件
- `deploy-worker.sh` - 快速部署脚本
