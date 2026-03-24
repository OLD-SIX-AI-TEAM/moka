# Imarticle CLI

命令行图文卡片生成工具，基于 AI 生成精美的小红书风格图文卡片。

## 安装

```bash
cd cli
npm install
```

## 配置 API 密钥

### 方式1: 使用 CLI 配置

```bash
# 配置 Anthropic (Claude)
npm run start -- config --anthropic-key your_key_here

# 配置 OpenAI
npm run start -- config --openai-key your_key_here

# 配置阿里云百炼
npm run start -- config --aliyun-key your_key_here

# 查看当前配置
npm run start -- config --show
```

### 方式2: 使用环境变量

```bash
export ANTHROPIC_API_KEY=your_key_here
export OPENAI_API_KEY=your_key_here
export DASHSCOPE_API_KEY=your_key_here
```

## 使用方法

### 基本用法

```bash
# 直接输入文案
npm run start -- generate -t "你的文案内容" -o output.png

# 从文件读取文案
npm run start -- generate -f input.txt -o output.png

# 使用别名
npm run start -- g -t "你的文案内容" -o output.png
```

### 高级选项

```bash
# 分页模式
npm run start -- generate -t "文案内容" -m split -o slides.png

# 指定提供商和模型
npm run start -- generate -t "文案内容" -p openai --model gpt-4o -o output.png

# 指定图片宽度和质量
npm run start -- generate -t "文案内容" -w 1000 -q ultra -o output.png
```

### 参数说明

| 参数 | 简写 | 说明 | 默认值 |
|------|------|------|--------|
| `--text` | `-t` | 输入文案内容 | - |
| `--file` | `-f` | 从文件读取文案 | - |
| `--output` | `-o` | 输出图片路径 | `./output.png` |
| `--mode` | `-m` | 模式: single/split | `single` |
| `--provider` | `-p` | LLM提供商 | `anthropic` |
| `--model` | - | 模型名称 | 自动选择 |
| `--width` | `-w` | 图片宽度 | `800` |
| `--quality` | `-q` | 图片质量: hd/ultra | `hd` |

## 全局安装 (可选)

```bash
cd cli
npm link

# 之后可以直接使用
imarticle generate -t "文案内容" -o output.png
imarticle config --anthropic-key your_key
```

## 示例

```bash
# 生成单页卡片
imarticle generate -t "今天学习了React Hooks，感觉打开了新世界的大门！" -o react-hooks.png

# 生成分页卡片
imarticle generate -f article.txt -m split -o article-slides.png

# 使用阿里云百炼
imarticle generate -t "文案内容" -p aliyun -o output.png
```
