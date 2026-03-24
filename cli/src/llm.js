import { configManager } from './config.js';

const PROVIDER_CONFIGS = {
  anthropic: {
    name: 'Anthropic',
    defaultBaseUrl: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-sonnet-4-20250514',
    endpoint: '/messages',
  },
  openai: {
    name: 'OpenAI',
    defaultBaseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    endpoint: '/chat/completions',
  },
  aliyun: {
    name: '阿里云百炼',
    defaultBaseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModel: 'qwen-plus',
    endpoint: '/chat/completions',
  },
};

export class LLMClient {
  constructor(provider = 'anthropic', model = null) {
    this.provider = provider;
    this.config = PROVIDER_CONFIGS[provider];
    this.apiKey = configManager.validateProvider(provider);
    this.model = model || this.config.defaultModel;
  }

  async chat({ system, messages, maxTokens = 4000, enableSearch = true }) {
    if (this.provider === 'anthropic') {
      return this._callAnthropic({ system, messages, maxTokens });
    } else if (this.provider === 'openai') {
      return this._callOpenAI({ system, messages, maxTokens });
    } else if (this.provider === 'aliyun') {
      return this._callAliyun({ system, messages, maxTokens, enableSearch });
    }
    throw new Error(`未实现的提供商: ${this.provider}`);
  }

  async _callAnthropic({ system, messages, maxTokens }) {
    const url = `${this.config.defaultBaseUrl}${this.config.endpoint}`;
    
    const body = {
      model: this.model,
      max_tokens: maxTokens,
      system,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API 错误: ${error}`);
    }

    const data = await response.json();
    const content = data.content?.map(c => c.text || '').join('') || '';
    
    return {
      content,
      usage: data.usage,
      model: data.model,
    };
  }

  async _callOpenAI({ system, messages, maxTokens }) {
    const url = `${this.config.defaultBaseUrl}${this.config.endpoint}`;
    
    const openaiMessages = system
      ? [{ role: 'system', content: system }, ...messages]
      : messages;

    const body = {
      model: this.model,
      max_tokens: maxTokens,
      messages: openaiMessages,
      temperature: 0.7,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API 错误: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    return {
      content,
      usage: data.usage,
      model: data.model,
    };
  }

  async _callAliyun({ system, messages, maxTokens, enableSearch }) {
    const url = `${this.config.defaultBaseUrl}${this.config.endpoint}`;
    
    const openaiMessages = system
      ? [{ role: 'system', content: system }, ...messages]
      : messages;

    const body = {
      model: this.model,
      max_tokens: maxTokens,
      messages: openaiMessages,
      temperature: 0.7,
      enable_search: enableSearch,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`阿里云百炼 API 错误: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    return {
      content,
      usage: data.usage,
      model: data.model,
    };
  }
}

export function extractJSON(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid input: text is required');
  }

  // 移除 markdown 代码块标记
  let cleaned = text.replace(/```json\s*|```\s*/gi, '').trim();

  // 尝试找到 JSON 对象的开始和结束位置
  const startIdx = cleaned.indexOf('{');
  const endIdx = cleaned.lastIndexOf('}');

  if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) {
    throw new Error('No valid JSON object found in response');
  }

  // 提取 JSON 部分
  cleaned = cleaned.substring(startIdx, endIdx + 1);

  // 移除零宽字符和 BOM
  cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '');

  // 修复单引号键名和字符串值
  cleaned = cleaned
    .replace(/(['"])(\w+)\1\s*:/g, '"$2":')
    .replace(/:\s*'([^']*)'/g, ':"$1"');

  // 修复尾部逗号
  cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');
  
  // 修复属性值后面缺少逗号的情况
  cleaned = cleaned.replace(/"\s*"/g, '","');
  
  // 修复未闭合的字符串
  const quoteMatches = cleaned.match(/"/g);
  if (quoteMatches && quoteMatches.length % 2 !== 0) {
    cleaned = cleaned + '"';
  }
  
  // 修复缺少值的属性
  cleaned = cleaned.replace(/"\w+":\s*,/g, '"$1": null,');
  cleaned = cleaned.replace(/"\w+":\s*([}\]])/g, '"$1": null $2');

  // 尝试解析
  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    // 尝试修复字符串中的特殊字符
    try {
      cleaned = escapeSpecialCharsInJSON(cleaned);
      return JSON.parse(cleaned);
    } catch {
      // 激进清理
      try {
        cleaned = cleaned.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
        return JSON.parse(cleaned);
      } catch {
        throw new Error(`JSON parse error: ${parseError.message}`);
      }
    }
  }
}

function escapeSpecialCharsInJSON(jsonStr) {
  let result = '';
  let inString = false;
  let escaped = false;

  for (let i = 0; i < jsonStr.length; i++) {
    const char = jsonStr[i];

    if (escaped) {
      result += char;
      escaped = false;
      continue;
    }

    if (char === '\\') {
      result += char;
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      result += char;
      continue;
    }

    if (inString) {
      switch (char) {
        case '\n':
          result += '\\n';
          break;
        case '\r':
          result += '\\r';
          break;
        case '\t':
          result += '\\t';
          break;
        default:
          result += char;
      }
    } else {
      result += char;
    }
  }

  return result;
}
