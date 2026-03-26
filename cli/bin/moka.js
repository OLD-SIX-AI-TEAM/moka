#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { generateCard } from '../src/index.js';

program
  .name('moka')
  .description('moka CLI - 生成精美图文卡片')
  .version('1.0.0');

program
  .command('generate')
  .alias('g')
  .description('生成图文卡片')
  .option('-t, --text <text>', '输入文案内容')
  .option('-f, --file <file>', '从文件读取文案')
  .option('-o, --output <path>', '输出路径', './output.png')
  .option('-m, --mode <mode>', '模式: single(单页) | split(分页)', 'single')
  .option('-p, --provider <provider>', 'LLM提供商: anthropic | openai | aliyun', 'anthropic')
  .option('--model <model>', '模型名称')
  .option('--base-url <url>', '自定义API基础地址')
  .option('-w, --width <width>', '图片宽度', '800')
  .option('--height <height>', '图片高度(自动计算)')
  .option('-q, --quality <quality>', '图片质量: hd(2x) | ultra(4x)', 'hd')
  .option('--theme <theme>', '主题风格: auto | minimal | bold | warm | cool | dark', 'auto')
  .action(async (options) => {
    try {
      await generateCard(options);
    } catch (error) {
      console.error(chalk.red('错误:'), error.message);
      process.exit(1);
    }
  });

program
  .command('config')
  .description('配置API密钥')
  .option('--anthropic-key <key>', '设置Anthropic API Key')
  .option('--anthropic-url <url>', '设置Anthropic Base URL')
  .option('--openai-key <key>', '设置OpenAI API Key')
  .option('--openai-url <url>', '设置OpenAI Base URL')
  .option('--aliyun-key <key>', '设置阿里云百炼 API Key')
  .option('--aliyun-url <url>', '设置阿里云百炼 Base URL')
  .option('--show', '显示当前配置')
  .action(async (options) => {
    const { configManager } = await import('../src/config.js');

    if (options.show) {
      configManager.show();
      return;
    }

    const updates = {};
    if (options.anthropicKey) updates.ANTHROPIC_API_KEY = options.anthropicKey;
    if (options.anthropicUrl) updates.ANTHROPIC_BASE_URL = options.anthropicUrl;
    if (options.openaiKey) updates.OPENAI_API_KEY = options.openaiKey;
    if (options.openaiUrl) updates.OPENAI_BASE_URL = options.openaiUrl;
    if (options.aliyunKey) updates.DASHSCOPE_API_KEY = options.aliyunKey;
    if (options.aliyunUrl) updates.DASHSCOPE_BASE_URL = options.aliyunUrl;

    if (Object.keys(updates).length > 0) {
      configManager.set(updates);
      console.log(chalk.green('配置已更新'));
    } else {
      console.log(chalk.yellow('请提供要配置的选项，或使用 --show 查看当前配置'));
    }
  });

program.parse();
