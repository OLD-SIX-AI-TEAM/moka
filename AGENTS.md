# AGENTS.md - 墨卡 Moka

AI驱动的爆款文案排版工具，专为小红书、微信公众号等内容创作者设计。

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev        # http://localhost:5173

# API keys are configured in the web UI (stored in browser localStorage)
```

## Project Structure

**Monorepo with two packages:**

- `/` - Web app (React 19 + Vite 6) - AI排版工具主界面
- `/cli/` - CLI tool (Node.js + Puppeteer) - 命令行图文卡片生成

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with API proxy |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Build + preview with Wrangler locally |
| `npm run deploy` | Build + deploy to Cloudflare |
| `npm run lint` | Run ESLint |
| `npm run generate-keys` | Generate RSA key pair for API key encryption |

## CLI Tool (Separate Package)

```bash
cd cli
npm install
npm run start -- generate -t "文案内容" -o output.png
```

## Environment Configuration

**用户 API 配置通过页面完成**：首次访问时会弹出配置弹窗，支持 OpenAI、Anthropic、阿里云百炼等提供商。配置保存在浏览器 localStorage 中。

**生产环境部署配置**（用于 Cloudflare Workers）：

```env
# 可选：默认 LLM API 密钥（当用户未配置时的备用）
DASHSCOPE_API_KEY=sk-xxx
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx
```

**Important:**
- Dev mode: Vite dev server proxies `/api/llm` to avoid CORS (see `vite.config.js`)
- Production: Cloudflare Worker handles API proxy with usage limits
- User API keys are encrypted with RSA before transmission

## Deployment

**Target:** Cloudflare Pages + Workers

- **Build output:** `dist/` directory
- **Worker entry:** `src/worker.js`
- **Config:** `wrangler.jsonc`

**Required secrets (set via `wrangler secret put`):**
- `RSA_PRIVATE_KEY` - For decrypting user API keys
- `RSA_PUBLIC_KEY` - For frontend encryption (also served via `/api/public-key`)
- `DASHSCOPE_API_KEY` or `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` - Fallback LLM keys

## Architecture Notes

- **Frontend:** React 19 with CSS-in-JS (no Tailwind)
- **State:** React hooks, no external state library
- **Image export:** `html-to-image` library (2x/4x HD export)
- **i18n:** Manual implementation (`src/i18n/en.js`, `src/i18n/zh.js`)
- **Templates:** 29 single-page + 26 split-page templates in `src/components/templates/`

## Code Style

- ESLint configured with React Hooks and React Refresh plugins
- Unused vars allowed if starting with uppercase: `varsIgnorePattern: '^[A-Z_]'`
- ES modules throughout (`"type": "module"`)

## Node Version

Node.js >= 20 (locked in `.nvmrc`)
