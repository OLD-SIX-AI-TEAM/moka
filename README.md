# 小红书排版生成器

AI驱动的爆款文案排版工具，专为小红书、微信公众号等内容创作者设计。

## 功能特性

- 🎨 **29种精美模板**：涵盖杂志风、便签风、极简线、手账风、撞色块、暗夜风、报纸风、胶片风、标签风等经典风格，以及奶油风、复古风、森系风、ins风、日系风、韩系风、极简风、波普风、文艺风、轻奢风等小红书热门风格，还有商务风、科技风、教育风、医疗风、财经风、法律风、美食风、旅游风、时尚风、母婴风等微信公众号专业风格
- 🌈 **8套配色方案**：珊瑚、抹茶、水墨、琥珀、梅子、青石、铁锈、松针
- 🤖 **AI智能生成**：支持 Claude、OpenAI 等多种 LLM 提供商，自动生成结构化排版内容（推荐Claude或者Kimi）
- ✨ **AI设计模式**：上传参考图片，AI 将根据图片风格智能生成独特设计
- ✏️ **实时编辑**：点击文字即可直接编辑，所见即所得
- 🖼️ **高清导出**：支持 2x 高清、4x 超清图片导出
- 📑 **分页模式**：支持多页卡片生成（封面+内容+结尾）
- 🔄 **拖拽排序**：支持段落和卡片拖拽排序
- 📱 **双平台支持**：针对小红书（情绪化、口语风）和微信公众号（专业、权威感）优化

## 技术栈

- **框架**: React 19 + Vite 6
- **样式**: CSS-in-JS
- **部署**: Cloudflare Pages + Cloudflare Workers
- **图片导出**: html-to-image（优先）+ html2canvas（降级）
- **AI服务**: 支持 Anthropic Claude、OpenAI GPT 等多种 LLM

## 本地开发

### 环境要求

- Node.js >= 20.0.0
- npm >= 10.0.0

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env` 并配置你的 LLM API 密钥：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# LLM 提供商: anthropic | openai
VITE_LLM_PROVIDER=anthropic

# API 基础地址（可选，留空使用默认）
VITE_LLM_BASE_URL=

# API 密钥
VITE_LLM_API_KEY=your_api_key_here

# 模型名称（可选，留空使用默认）
VITE_LLM_MODEL=
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 部署

### 部署到 Cloudflare Pages

#### 方法一：通过 Git 集成（推荐）

1. 将代码推送到 GitHub/GitLab 仓库
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
3. 进入 **Pages** > **Create a project**
4. 选择你的 Git 仓库
5. 配置构建设置：
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
6. 点击 **Save and Deploy**

#### 方法二：直接上传

1. 本地构建：`npm run build`
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
3. 进入 **Pages** > **Create a project** > **Upload assets**
4. 上传 `dist` 文件夹内的所有文件

### 部署 LLM Proxy Worker

为了解决前端直接调用 OpenAI/Anthropic API 时的 CORS 跨域问题，需要部署 Cloudflare Worker 作为代理。

详细步骤请参考 [workers/README.md](./workers/README.md)。

快速部署：

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署 Worker
cd workers
wrangler deploy

# 或使用脚本
./deploy-worker.sh
```

部署后在 Cloudflare Dashboard 中设置环境变量：
- `ANTHROPIC_API_KEY`: 你的 Anthropic API Key
- `OPENAI_API_KEY`: 你的 OpenAI API Key（可选）

## 项目结构

```
├── functions/              # Cloudflare Pages Functions
│   └── api/
│       └── proxy.js        # API 代理路由
├── public/                 # 静态资源
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/            # 图片资源
│   ├── components/        # 组件
│   │   ├── common/       # 通用组件
│   │   │   ├── DragRow.jsx
│   │   │   ├── EditableText.jsx
│   │   │   ├── Icons.jsx
│   │   │   └── LLMConfigModal.jsx
│   │   ├── templates/    # 模板组件
│   │   │   ├── single/   # 单页模板（29种）
│   │   │   │   ├── Editorial.jsx
│   │   │   │   ├── Notecard.jsx
│   │   │   │   ├── Minimal.jsx
│   │   │   │   ├── Artistic.jsx
│   │   │   │   ├── Business.jsx
│   │   │   │   └── ...
│   │   │   └── split/    # 分页模板（26种）
│   │   │       ├── ArtisticStyle.jsx
│   │   │       ├── BusinessStyle.jsx
│   │   │       └── ...
│   │   ├── AIDesignControls.jsx
│   │   ├── AIDesignGenerator.jsx
│   │   ├── AISplitStyleRenderer.jsx
│   │   ├── AIStyleRenderer.jsx
│   │   ├── ReferenceImageUploader.jsx
│   │   └── VersionHistory.jsx
│   ├── constants/         # 常量配置
│   │   └── index.js
│   ├── hooks/            # 自定义 Hooks
│   │   ├── useDragReorder.js
│   │   ├── useHtml2Canvas.js
│   │   └── useHtmlToImage.js
│   ├── prompts/          # AI Prompts
│   │   └── aiDesignPrompt.js
│   ├── services/         # 服务层
│   │   └── llm.js        # LLM 客户端封装
│   ├── App.jsx           # 主应用
│   ├── App.css           # 全局样式
│   ├── constants.js      # 常量定义
│   ├── index.css         # 入口样式
│   └── main.jsx          # 入口文件
├── workers/              # Cloudflare Worker
│   ├── README.md
│   ├── llm-proxy.js      # LLM 代理 Worker
│   └── wrangler.toml     # Wrangler 配置
├── _headers              # Cloudflare Headers 配置
├── _redirects            # Cloudflare Redirects 配置
├── .env.example          # 环境变量示例
├── .nvmrc                # Node 版本锁定
├── deploy-worker.sh      # Worker 部署脚本
├── eslint.config.js      # ESLint 配置
├── index.html            # HTML 入口
├── package.json
└── vite.config.js        # Vite 配置
```

## 模板分类

### 单页模板（29种）

#### 经典风格（9种）
- 杂志风、便签风、极简线、手账风、撞色块、暗夜风、报纸风、胶片风、标签风

#### 小红书热门风格（10种）
- 奶油风、复古风、森系风、ins风、日系风、韩系风、极简风、波普风、文艺风、轻奢风

#### 微信公众号风格（10种）
- 商务风、科技风、教育风、医疗风、财经风、法律风、美食风、旅游风、时尚风、母婴风

### 分页模板（26种）

支持封面页、内容页、结尾页的分页设计，包含上述大部分风格的对应分页版本。

## 使用说明

### 基础使用

1. 在左侧输入框中粘贴你的文案或话题
2. 选择模板风格（单页版）或卡片风格（分页版）
3. 选择配色方案
4. 点击「生成排版图」或「生成分页卡片」
5. 在预览区域查看生成的排版
6. 点击文字可直接编辑
7. 点击导出按钮下载高清图片

### AI设计模式

1. 选择「AI设计」模板
2. （可选）上传参考图片，AI 将参考图片风格
3. 输入文案内容
4. 点击生成，AI 将自动设计独特的排版风格
5. 支持版本历史，可回溯查看之前的设计

### 分页模式

1. 切换到「分页版」模式
2. 选择发布平台（小红书/微信推文）
3. 选择卡片风格
4. 输入文案，AI 将自动生成封面、内容页、结尾页
5. 支持拖拽排序调整页面顺序
6. 可单独导出当前页或一次性导出全部

## API 端点

部署 Worker 后，前端可通过以下端点调用：

- **Anthropic**: `/api/anthropic/v1/messages`
- **OpenAI**: `/api/openai/v1/chat/completions`
- **通用代理**: `/api/proxy?url=<目标URL>&key=<API Key>`

## 注意事项

1. **API Key 安全**: 生产环境请使用 Cloudflare Worker 代理，不要将 API Key 直接暴露在前端代码中
2. **图片导出**: 优先使用 html-to-image，如遇到问题会自动降级到 html2canvas
3. **浏览器兼容**: 推荐使用 Chrome、Edge、Safari 最新版本
4. **移动端**: 支持移动端浏览器访问，但建议使用桌面端获得最佳编辑体验

## 许可证

MIT License
