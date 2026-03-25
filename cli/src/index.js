import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { LLMClient, extractJSON } from './llm.js';
import { AI_DESIGN_PROMPT_SINGLE, AI_DESIGN_PROMPT_SPLIT } from './prompts.js';
import { renderToImage } from './renderer.js';

/**
 * 生成图文卡片
 */
export async function generateCard(options) {
  const {
    text,
    file,
    output,
    mode = 'single',
    provider = 'anthropic',
    model,
    width = '800',
    quality = 'hd',
  } = options;

  // 获取输入文本
  let inputText = text;
  if (file) {
    if (!fs.existsSync(file)) {
      throw new Error(`文件不存在: ${file}`);
    }
    inputText = await fs.readFile(file, 'utf-8');
  }

  if (!inputText || !inputText.trim()) {
    throw new Error('请提供文案内容，使用 -t 或 -f 参数');
  }

  console.log(chalk.cyan('🎨 moka CLI - 图文卡片生成器'));
  console.log(chalk.gray(`模式: ${mode === 'single' ? '单页' : '分页'}`));
  console.log(chalk.gray(`提供商: ${provider}`));
  console.log('');

  // 步骤1: 调用AI生成设计
  const spinner = ora('正在生成设计方案...').start();
  
  try {
    const client = new LLMClient(provider, model);
    const prompt = mode === 'single' ? AI_DESIGN_PROMPT_SINGLE : AI_DESIGN_PROMPT_SPLIT;
    
    const response = await client.chat({
      system: prompt,
      messages: [{
        role: 'user',
        content: `请根据以下文案内容生成设计方案：\n\n${inputText}`
      }],
      maxTokens: 4000,
      enableSearch: true,
    });

    spinner.text = '正在解析设计数据...';
    
    const designData = extractJSON(response.content);
    
    // 验证数据结构
    if (mode === 'single') {
      if (!designData.styleConfig || !designData.content) {
        throw new Error('AI返回的数据格式不正确，缺少 styleConfig 或 content');
      }
    } else {
      if (!designData.styleConfig || !designData.slides) {
        throw new Error('AI返回的数据格式不正确，缺少 styleConfig 或 slides');
      }
    }

    spinner.text = '正在渲染图片...';

    // 步骤2: 渲染为图片
    const result = await renderToImage(designData, {
      mode,
      width: parseInt(width),
      quality,
      outputPath: output,
    });

    spinner.succeed('图片生成成功!');
    
    // 输出结果信息
    console.log('');
    console.log(chalk.green('✓ 输出文件:'), path.resolve(output));
    console.log(chalk.gray(`  尺寸: ${result.width} x ${result.height}px`));
    console.log(chalk.gray(`  缩放: ${result.scale}x`));
    
    // 输出内容概要
    if (mode === 'single') {
      console.log('');
      console.log(chalk.cyan('内容概要:'));
      console.log(`  标题: ${designData.content.title}`);
      console.log(`  分类: ${designData.content.category}`);
      console.log(`  区块: ${designData.content.sections?.length || 0} 个`);
      console.log(`  标签: ${designData.content.tags?.join(', ')}`);
    } else {
      console.log('');
      console.log(chalk.cyan('内容概要:'));
      console.log(`  页数: ${designData.slides?.length || 0} 页`);
      const cover = designData.slides?.find(s => s.type === 'cover');
      if (cover) {
        console.log(`  标题: ${cover.title}`);
      }
    }

  } catch (error) {
    spinner.fail('生成失败');
    throw error;
  }
}
