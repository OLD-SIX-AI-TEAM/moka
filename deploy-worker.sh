#!/bin/bash

# 部署 LLM Proxy Worker 到 Cloudflare

echo "🚀 部署 LLM Proxy Worker..."

cd workers

# 检查是否安装了 wrangler
if ! command -v wrangler &> /dev/null; then
    echo "❌ 未安装 wrangler CLI"
    echo "请运行: npm install -g wrangler"
    exit 1
fi

# 检查是否登录
if ! wrangler whoami &> /dev/null; then
    echo "🔑 请先登录 Cloudflare:"
    wrangler login
fi

# 部署 Worker
echo "📦 部署 Worker..."
wrangler deploy

echo "✅ 部署完成!"
echo ""
echo "⚠️  重要: 请在 Cloudflare Dashboard 中设置环境变量:"
echo "   - ANTHROPIC_API_KEY: 你的 Anthropic API Key"
echo "   - OPENAI_API_KEY: 你的 OpenAI API Key (可选)"
