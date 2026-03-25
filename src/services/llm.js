/**
 * 通用 LLM 服务模块
 * 支持 OpenAI、Anthropic 和阿里云百炼三种 API 格式
 */

import { storeEncryptedApiKey, getEncryptedApiKey, hasEncryptedApiKey } from "../utils/crypto";

const STORAGE_KEY = "imarticle_llm_config";

// Pages Function 代理地址（直接代理，不经过独立 Worker）
const PAGES_PROXY_URL = "/api/llm";

// 从环境变量读取配置
const ENV_CONFIG = {
  provider: import.meta.env.VITE_LLM_PROVIDER || "aliyun",
  baseUrl: import.meta.env.VITE_LLM_BASE_URL || "",
  apiKey: import.meta.env.VITE_LLM_API_KEY || "",
  model: import.meta.env.VITE_LLM_MODEL || "",
};

// 从 localStorage 读取配置
function getStorageConfig() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("[LLM Config] 读取 localStorage 配置失败:", e);
  }
  return null;
}

// 保存配置到 localStorage（加密存储 API Key）
export async function saveLLMConfig(config) {
  try {
    const { apiKey, ...restConfig } = config;
    
    // 加密存储 API Key
    if (apiKey) {
      await storeEncryptedApiKey(apiKey, config.provider || "aliyun");
    }
    
    // 存储其他配置（不包含明文 apiKey）
    localStorage.setItem(STORAGE_KEY, JSON.stringify(restConfig));
    console.log("[LLM Config] 配置已保存到 localStorage（API Key 已加密）");
    return true;
  } catch (e) {
    console.error("[LLM Config] 保存配置失败:", e);
    return false;
  }
}

// 清除 localStorage 中的配置
export function clearLLMConfig() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    // 清除所有 provider 的加密 key
    Object.keys(LLM_PROVIDERS).forEach(provider => {
      localStorage.removeItem(`llm_config_${provider}`);
    });
    console.log("[LLM Config] 配置已从 localStorage 清除");
    return true;
  } catch (e) {
    console.error("[LLM Config] 清除配置失败:", e);
    return false;
  }
}

// 检查是否配置了加密的 API Key
export function hasUserApiKey(provider) {
  return hasEncryptedApiKey(provider || "aliyun");
}

// 获取合并后的配置（优先使用 localStorage）
function getMergedConfig() {
  const storageConfig = getStorageConfig();
  const provider = storageConfig?.provider || ENV_CONFIG.provider;
  
  // 检查是否有加密的 API Key
  const encryptedApiKey = getEncryptedApiKey(provider);
  const hasEncryptedKey = hasEncryptedApiKey(provider);
  
  // 如果 localStorage 中有有效配置，优先使用
  if (storageConfig && hasEncryptedKey) {
    console.log("[LLM Config] 使用 localStorage 配置（API Key 已加密）");
    return {
      provider: storageConfig.provider || ENV_CONFIG.provider,
      baseUrl: storageConfig.baseUrl || ENV_CONFIG.baseUrl,
      encryptedApiKey: encryptedApiKey,
      hasEncryptedKey: true,
      model: storageConfig.model || ENV_CONFIG.model,
    };
  }
  
  // 否则使用环境变量配置
  console.log("[LLM Config] 使用环境变量配置");
  return {
    ...ENV_CONFIG,
    encryptedApiKey: null,
    hasEncryptedKey: false,
  };
}

const MERGED_CONFIG = getMergedConfig();

// 调试日志：输出当前配置
console.log("[LLM Config] Provider:", MERGED_CONFIG.provider);
console.log("[LLM Config] Base URL:", MERGED_CONFIG.baseUrl || "(使用默认值)");
console.log("[LLM Config] Model:", MERGED_CONFIG.model || "(使用默认值)");
console.log("[LLM Config] Source:", getStorageConfig()?.apiKey ? "localStorage" : "env");

// LLM 提供商配置
export const LLM_PROVIDERS = {
  openai: {
    name: "OpenAI",
    defaultBaseUrl: "https://api.openai.com/v1",
    defaultModel: "gpt-4o-mini",
    requireAuth: true,
  },
  anthropic: {
    name: "Anthropic",
    defaultBaseUrl: "https://api.anthropic.com/v1",
    defaultModel: "claude-sonnet-4-20250514",
    requireAuth: true,
  },
  aliyun: {
    name: "阿里云百炼",
    defaultBaseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    defaultModel: "qwen3.5-plus",
    requireAuth: true,
  },
};

/**
 * 获取 LLM 配置（优先从 localStorage，其次环境变量）
 * @returns {Object} 配置对象
 */
export function getEnvLLMConfig() {
  const config = getMergedConfig();
  return {
    provider: config.provider,
    baseUrl: config.baseUrl || undefined,
    encryptedApiKey: config.encryptedApiKey,
    hasEncryptedKey: config.hasEncryptedKey,
    model: config.model || undefined,
  };
}

/**
 * 检查 LLM 配置是否有效（是否有加密的 API Key）
 * @returns {boolean}
 */
export function isEnvConfigValid() {
  const config = getMergedConfig();
  return config.hasEncryptedKey;
}

/**
 * 创建 LLM 客户端
 * @param {Object} config - 配置对象
 * @param {string} config.provider - 提供商: 'openai' | 'anthropic' | 'aliyun'
 * @param {string} config.baseUrl - API 基础 URL
 * @param {string} config.encryptedApiKey - 加密的 API 密钥
 * @param {string} config.model - 模型 ID
 * @returns {Object} LLM 客户端实例
 */
export function createLLMClient(config) {
  const { provider = "anthropic", baseUrl, encryptedApiKey, model } = config;

  const providerConfig = LLM_PROVIDERS[provider];
  if (!providerConfig) {
    throw new Error(`不支持的 LLM 提供商: ${provider}`);
  }

  const finalBaseUrl = baseUrl || providerConfig.defaultBaseUrl;
  const finalModel = model || providerConfig.defaultModel;

  return {
    provider,
    baseUrl: finalBaseUrl,
    encryptedApiKey,
    model: finalModel,

    /**
     * 发送聊天请求
     * @param {Object} params - 请求参数
     * @param {string} params.system - 系统提示词
     * @param {Array} params.messages - 消息列表
     * @param {number} params.maxTokens - 最大 token 数
     * @param {boolean} params.webSearch - 是否启用 web 搜索
     * @returns {Promise<Object>} 响应结果
     */
    async chat(params) {
      const { system, messages, maxTokens = 1000, webSearch = true } = params;

      if (this.provider === "openai") {
        return this._callOpenAI({ system, messages, maxTokens, webSearch });
      } else if (this.provider === "anthropic") {
        return this._callAnthropic({ system, messages, maxTokens, webSearch });
      } else if (this.provider === "aliyun") {
        return this._callAliyun({ system, messages, maxTokens, webSearch });
      }

      throw new Error(`未实现的提供商：${this.provider}`);
    },

    /**
     * 调用 OpenAI API
     * 使用 Pages Function 代理避免 CORS 问题
     */
    async _callOpenAI({ system, messages, maxTokens, webSearch }) {
      // 检测是否在 Cloudflare Pages 环境
      const isCloudflarePages = window.location.hostname.includes('pages.dev') ||
        window.location.hostname.includes('workers.dev');

      let url;
      let headers;
      let body;

      // 构建 tools 参数（如果启用 web 搜索）
      // 注意：OpenAI 的 web_search_preview 工具需要特定模型和配置
      // 暂时禁用，等待进一步测试
      const tools = undefined;

      // 使用 Pages Function 代理
      url = PAGES_PROXY_URL;
      headers = {
        'Content-Type': 'application/json',
      };
      body = {
        provider: 'openai',
        model: this.model,
        messages: system ? [{ role: "system", content: system }, ...messages] : messages,
        max_tokens: maxTokens,
        temperature: 0.7,
        ...(tools && { tools }),
        ...(this.encryptedApiKey && { encryptedApiKey: this.encryptedApiKey }), // 传入加密的 API Key
      };

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API 错误: ${error}`);
      }

      const data = await response.json();

      // 处理响应内容（支持普通响应和 web_search 响应）
      const message = data.choices[0]?.message;
      let content = message?.content || "";
      
      // 如果模型返回了 tool_calls，尝试提取信息
      if (message?.tool_calls) {
        // 记录工具调用信息用于调试
        console.log('[OpenAI Response] Tool calls:', message.tool_calls);
        
        // 如果有 tool_calls 但没有 content，尝试从工具调用中提取信息
        if (!content) {
          content = message.tool_calls.map(tc => {
            if (tc.type === "web_search_preview") {
              return `[已执行网络搜索]`;
            }
            return `[工具调用：${tc.function?.name || tc.type}]`;
          }).join("\n");
        }
      }
      
      // 如果仍然没有内容，抛出错误
      if (!content || content.trim() === "") {
        console.error('[OpenAI Response] Empty content:', data);
        throw new Error('LLM 返回的内容为空，可能是 API 调用失败或模型未生成内容');
      }

      // 统一响应格式
      return {
        content: content,
        usage: data.usage,
        model: data.model,
      };
    },

    /**
     * 调用阿里云百炼 API
     * 使用 enable_search 参数启用网络搜索
     */
    async _callAliyun({ system, messages, maxTokens, webSearch }) {
      // 检测是否在 Cloudflare Pages 环境
      const isCloudflarePages = window.location.hostname.includes('pages.dev') ||
        window.location.hostname.includes('workers.dev');

      let url;
      let headers;
      let body;

      // 使用 Pages Function 代理
      url = PAGES_PROXY_URL;
      headers = {
        'Content-Type': 'application/json',
      };
      body = {
        provider: 'aliyun',
        model: this.model,
        messages: system ? [{ role: "system", content: system }, ...messages] : messages,
        max_tokens: maxTokens,
        temperature: 0.7,
        enable_search: webSearch,
        ...(this.encryptedApiKey && { encryptedApiKey: this.encryptedApiKey }), // 传入加密的 API Key
      };

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`阿里云百炼 API 错误：${error}`);
      }

      const data = await response.json();

      // 调试日志
      console.log('[Aliyun Response]', data);

      // 检查响应格式
      if (!data.choices || !data.choices[0]?.message?.content) {
        console.error('[Aliyun Response] Invalid response format:', data);
        throw new Error('阿里云百炼返回的响应格式不正确');
      }

      // 统一响应格式
      return {
        content: data.choices[0].message.content,
        usage: data.usage,
        model: data.model,
      };
    },

    /**
     * 调用 Anthropic API
     * 使用 Pages Function 代理避免 CORS 问题
     */
    async _callAnthropic({ system, messages, maxTokens, webSearch }) {
      // 检测是否在 Cloudflare Pages 环境
      const isCloudflarePages = window.location.hostname.includes('pages.dev') ||
        window.location.hostname.includes('workers.dev');

      let url;
      let headers;
      let body;

      // 构建 tools 参数（如果启用 web 搜索）
      // 注意：Anthropic 的 web_search 工具需要特定模型和配置
      // 暂时禁用，等待进一步测试
      const tools = undefined;

      // 使用 Pages Function 代理
      url = PAGES_PROXY_URL;
      headers = {
        'Content-Type': 'application/json',
      };
      body = {
        provider: 'anthropic',
        model: this.model,
        system,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        max_tokens: maxTokens,
        ...(tools && { tools }),
        ...(this.encryptedApiKey && { encryptedApiKey: this.encryptedApiKey }), // 传入加密的 API Key
      };

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Anthropic API 错误: ${error}`);
      }

      const data = await response.json();

      // 处理响应内容（支持普通响应和 web_search 响应）
      let content = data.content?.map((c) => c.text || "").join("") || "";
      
      // 如果模型返回了 tool_use，尝试提取信息
      if (data.content) {
        const toolUses = data.content.filter(c => c.type === "tool_use");
        if (toolUses.length > 0) {
          console.log('[Anthropic Response] Tool uses:', toolUses);
          
          // 如果有工具调用但没有文本内容，生成提示信息
          if (!content) {
            content = toolUses.map(tu => {
              if (tu.name?.includes('web_search')) {
                return `[已执行网络搜索]`;
              }
              return `[工具调用：${tu.name}]`;
            }).join("\n");
          }
        }
      }
      
      // 如果仍然没有内容，抛出错误
      if (!content || content.trim() === "") {
        console.error('[Anthropic Response] Empty content:', data);
        throw new Error('LLM 返回的内容为空，可能是 API 调用失败或模型未生成内容');
      }

      // 统一响应格式
      return {
        content: content,
        usage: data.usage,
        model: data.model,
      };
    },
  };
}

/**
 * 系统提示词模板
 */
export const SYSTEM_PROMPTS = {
  // 单页模式 - 小红书风格
  singleXHS: `你是小红书爆款文案排版专家。将用户的文案转化为结构化排版内容。
【内容生成要求】
- 如果用户输入的是新闻主题，生成具体的新闻报道内容，包含：具体事件、时间、地点、关键人物、具体数据/细节
- 避免宏观分析（如"体现了...精神"、"反映了...趋势"、"展现了...风貌"）
- 聚焦具体事实和细节，用事实说话
- 使用具体的数字、时间、地点、人物名称

【重要】必须严格遵循以下字数限制：
- emoji: 1个
- category: 最多6个字
- title: 最多36个字
- lead: 最多50个字
- sections: 4-5个，每个heading最多16个字，text最多140个字
- tip: 最多60个字
- tags: 5个标签，每个最多10个字

严格只返回 JSON，不要任何 markdown，不要任何解释：
{
  "emoji": "🎉",
  "category": "分类",
  "title": "标题",
  "lead": "导语",
  "sections": [
    {"heading": "小标题1", "text": "正文内容"},
    {"heading": "小标题2", "text": "正文内容"},
    {"heading": "小标题3", "text": "正文内容"}
  ],
  "tip": "小贴士",
  "tags": ["标签1", "标签2", "标签3", "标签4", "标签5"]
}`,

  // 分页模式 - 小红书风格
  splitXHS: `你是小红书爆款内容策划专家。将用户文案拆分为4-5张图文卡片。
【小红书风格】情绪化标题、口语化表达、emoji点缀。
【内容生成要求】
- 如果用户输入的是新闻主题，生成具体的新闻报道内容，包含：具体事件、时间、地点、关键人物、具体数据/细节
- 避免宏观分析（如"体现了...精神"、"反映了...趋势"、"展现了...风貌"）
- 聚焦具体事实和细节，用事实说话
- 使用具体的数字、时间、地点、人物名称
【重要字数限制】
- cover: title最多30字，subtitle最多50字
- content: heading最多16字(带emoji)，text最多100字，extra最多40字
- end: cta最多30字，sub最多40字
- tags: 5个

严格只返回JSON，不要markdown：
{
  "slides": [
    {"type": "cover", "emoji": "🎉", "title": "封面标题", "subtitle": "副标题"},
    {"type": "content", "heading": "✨小标题", "text": "正文", "extra": "金句"},
    {"type": "content", "heading": "✨小标题", "text": "正文", "extra": "金句"},
    {"type": "end", "cta": "互动语", "sub": "结尾", "tags": ["标签1", "标签2", "标签3", "标签4", "标签5"]}
  ]
}`,

  // 分页模式 - 微信风格
  splitWechat: `你是微信公众号编辑。将用户文案拆分为4-5张专业图文卡片。
【微信风格】专业理性、结构清晰、heading不用emoji。
【内容生成要求】
- 如果用户输入的是新闻主题，生成具体的新闻报道内容，包含：具体事件、时间、地点、关键人物、具体数据/细节
- 避免宏观分析（如"体现了...精神"、"反映了...趋势"、"展现了...风貌"）
- 聚焦具体事实和细节，用事实说话
- 使用具体的数字、时间、地点、人物名称
【重要字数限制】
- cover: title最多30字，subtitle最多50字
- content: heading最多16字(无emoji)，text最多100字，extra最多40字
- end: cta最多30字，sub最多40字
- tags: 5个

严格只返回JSON，不要markdown：
{
  "slides": [
    {"type": "cover", "emoji": "📊", "title": "专业标题", "subtitle": "副标题"},
    {"type": "content", "heading": "小标题", "text": "正文", "extra": "延伸"},
    {"type": "content", "heading": "小标题", "text": "正文", "extra": "延伸"},
    {"type": "end", "cta": "引导语", "sub": "结语", "tags": ["标签1", "标签2", "标签3", "标签4", "标签5"]}
  ]
}`,
};

/**
 * 从 LLM 响应中提取 JSON
 * @param {string} text - LLM 响应文本
 * @returns {Object} 解析后的 JSON
 */
export function extractJSON(text) {
  if (!text || typeof text !== 'string') {
    console.error('[extractJSON] Invalid input:', text);
    throw new Error('Invalid input: text is required');
  }

  // 调试日志
  console.log('[extractJSON] Raw text:', text.substring(0, 500) + (text.length > 500 ? '...' : ''));

  // 移除 markdown 代码块标记
  let cleaned = text.replace(/```json\s*|```\s*/gi, "").trim();

  // 尝试找到 JSON 对象的开始和结束位置
  const startIdx = cleaned.indexOf('{');
  const endIdx = cleaned.lastIndexOf('}');

  if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) {
    console.error('[extractJSON] No JSON object found in:', cleaned.substring(0, 500));
    throw new Error('No valid JSON object found in response');
  }

  // 提取 JSON 部分
  cleaned = cleaned.substring(startIdx, endIdx + 1);

  // 第一步：移除零宽字符和 BOM
  cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '');

  // 第二步：修复单引号键名和字符串值
  cleaned = cleaned
    .replace(/(['"])(\w+)\1\s*:/g, '"$2":')
    .replace(/:\s*'([^']*)'/g, ':"$1"');

  // 第二步半：将中文引号（\u201C \u201D）替换为英文引号（"）
  // \u201C 是左双引号，\u201D 是右双引号
  cleaned = cleaned.replace(/[\u201C\u201D]/g, '"');

  // 第三步：修复尾部逗号（包括对象和数组中的尾部逗号）
  cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');
  
  // 第四步：修复属性值后面缺少逗号的情况（如 "key": "value" "key2":）
  // 使用更精确的正则，只匹配 JSON 结构中的情况
  cleaned = cleaned.replace(/("[^"]*")\s*(?=")/g, '$1,');
  
  // 第五步：修复未闭合的字符串（简单处理）
  // 计算引号数量，如果是奇数，在末尾添加一个引号
  const quoteMatches = cleaned.match(/"/g);
  if (quoteMatches && quoteMatches.length % 2 !== 0) {
    cleaned = cleaned + '"';
  }
  
  // 第六步：修复缺少值的属性（如 "key": , 或 "key": }）
  cleaned = cleaned.replace(/"\w+":\s*,/g, '"$1": null,');
  cleaned = cleaned.replace(/"\w+":\s*([}\]])/g, '"$1": null $2');

  // 尝试解析
  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    // 第七步：修复字符串中的特殊字符
    try {
      cleaned = escapeSpecialCharsInJSON(cleaned);
      return JSON.parse(cleaned);
    } catch {
      // 第八步：激进清理 - 移除所有控制字符
      try {
        cleaned = cleaned.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
        return JSON.parse(cleaned);
      } catch {
        // 第九步：尝试使用 Function 构造器作为最后的手段
        try {
          // 注意：这有一定的安全风险，但在受控环境中可以使用
          const result = new Function('return ' + cleaned)();
          if (result && typeof result === 'object') {
            return result;
          }
        } catch {}
        
        console.error("[JSON Parse Error] Raw text:", text);
        console.error("[JSON Parse Error] Cleaned text:", cleaned);
        throw new Error(`JSON parse error: ${parseError.message}`);
      }
    }
  }
}

/**
 * 转义 JSON 字符串中的特殊字符
 * @param {string} jsonStr - JSON 字符串
 * @returns {string} 处理后的字符串
 */
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
      // 在字符串内部，转义特殊字符
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
        case '\b':
          result += '\\b';
          break;
        case '\f':
          result += '\\f';
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
