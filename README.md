# 小红书排版生成器

AI驱动的爆款文案排版工具，专为小红书内容创作者设计。

## 功能特性

- 🎨 **9种精美模板**：杂志风、便签风、极简线、手账风、撞色块、暗夜风、报纸风、胶片风、标签风
- 🌈 **8套配色方案**：珊瑚、抹茶、水墨、琥珀、梅子、青石、铁锈、松针
- 🤖 **AI智能生成**：基于 Claude API 自动生成结构化排版内容
- ✏️ **实时编辑**：点击文字即可直接编辑
- 🖼️ **高清导出**：支持 2x、3x 高清图片导出
- 📑 **分页模式**：支持多页卡片生成（开发中）
- 🔄 **拖拽排序**：支持段落和卡片拖拽排序

## 技术栈

- **框架**: React 19 + Vite 6
- **样式**: CSS-in-JS
- **部署**: Cloudflare Pages
- **图片导出**: html2canvas

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 部署到 Cloudflare Pages

### 方法一：通过 Git 集成（推荐）

1. 将代码推送到 GitHub/GitLab 仓库
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
3. 进入 **Pages** > **Create a project**
4. 选择你的 Git 仓库
5. 配置构建设置：
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
6. 点击 **Save and Deploy**

### 方法二：直接上传

1. 本地构建：`npm run build`
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
3. 进入 **Pages** > **Create a project** > **Upload assets**
4. 上传 `dist` 文件夹内的所有文件

## 项目结构

```
├── public/                 # 静态资源
├── src/
│   ├── components/         # 组件
│   │   ├── common/        # 通用组件
│   │   │   ├── EditableText.jsx
│   │   │   ├── DragRow.jsx
│   │   │   └── Icons.jsx
│   │   └── templates/     # 模板组件
│   │       └── single/    # 单页模板
│   ├── constants/         # 常量配置
│   ├── hooks/            # 自定义 Hooks
│   ├── App.jsx           # 主应用
│   └── main.jsx          # 入口
├── _headers              # Cloudflare Headers 配置
├── _redirects            # Cloudflare Redirects 配置
├── index.html
├── package.json
└── vite.config.js
```

## 环境要求

- Node.js >= 20.0.0
- npm >= 10.0.0

## 许可证

MIT License
