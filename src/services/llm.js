/**
 * 通用 LLM 服务模块
 * 支持 OpenAI、Anthropic 和阿里云百炼三种 API 格式
 */

import { storeEncryptedApiKey, getEncryptedApiKey, hasEncryptedApiKey, getDecryptedApiKey } from "../utils/crypto";

const STORAGE_KEY = "moka_llm_config";

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
    // console.log("[LLM Config] 使用 localStorage 配置（API Key 已加密）");
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
    customBaseUrl: true,
    customModel: true,
  },
  anthropic: {
    name: "Anthropic",
    defaultBaseUrl: "https://api.anthropic.com/v1",
    defaultModel: "claude-sonnet-4-20250514",
    requireAuth: true,
    customBaseUrl: true,
    customModel: true,
  },
  aliyun: {
    name: "阿里云百炼",
    defaultBaseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    defaultModel: "qwen3.5-plus",
    requireAuth: true,
    customBaseUrl: true,
    customModel: true,
  },
};

/**
 * 获取 LLM 配置（优先从 localStorage，其次环境变量）
 * @returns {Object} 配置对象
 */
export function getEnvLLMConfig() {
  const config = getMergedConfig();
  
  // 检查是否是本地开发环境（明文存储）
  const isLocalDev = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1'
  );
  
  // 本地开发环境：encryptedApiKey 实际上是明文，所以也作为 apiKey 返回
  // 生产环境：apiKey 为 undefined，因为无法在前端解密
  const apiKey = isLocalDev ? config.encryptedApiKey : undefined;
  
  return {
    provider: config.provider,
    baseUrl: config.baseUrl || undefined,
    apiKey: apiKey,
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
     * @param {boolean} params.stream - 是否启用流式响应
     * @param {Function} params.onStream - 流式响应回调函数
     * @returns {Promise<Object>} 响应结果
     */
    async chat(params) {
      const { system, messages, maxTokens = 1000, webSearch = true, stream = false, onStream } = params;

      if (this.provider === "openai") {
        return this._callOpenAI({ system, messages, maxTokens, webSearch, stream, onStream });
      } else if (this.provider === "anthropic") {
        return this._callAnthropic({ system, messages, maxTokens, webSearch, stream, onStream });
      } else if (this.provider === "aliyun") {
        return this._callAliyun({ system, messages, maxTokens, webSearch, stream, onStream });
      }

      throw new Error(`未实现的提供商：${this.provider}`);
    },

    /**
     * 调用 OpenAI API
     * 本地开发直接调用，生产环境使用 Pages Function 代理避免 CORS 问题
     */
    async _callOpenAI({ system, messages, maxTokens, webSearch, stream, onStream }) {
      // 检测环境
      const isCloudflarePages = window.location.hostname.includes('pages.dev') ||
        window.location.hostname.includes('workers.dev');
      const isLocalDev = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

      let url;
      let headers;
      let body;

      // 构建 tools 参数（如果启用 web 搜索）
      // 注意：OpenAI 的 web_search_preview 工具需要特定模型和配置
      // 暂时禁用，等待进一步测试
      const tools = undefined;

      // 本地开发直接调用 API
      if (isLocalDev) {
        // 本地开发时从 localStorage 获取解密的 API Key
        const apiKey = await getDecryptedApiKey('openai');
        if (!apiKey) {
          throw new Error('请先配置 LLM API Key');
        }

        const baseUrl = this.baseUrl || 'https://api.openai.com/v1';
        url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        };
        body = {
          model: this.model,
          messages: system ? [{ role: "system", content: system }, ...messages] : messages,
          max_tokens: maxTokens,
          temperature: 0.7,
          stream,
          ...(tools && { tools }),
        };
      } else {
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
          stream,
          ...(tools && { tools }),
          ...(this.encryptedApiKey && { encryptedApiKey: this.encryptedApiKey }), // 传入加密的 API Key
          ...(this.baseUrl && { baseUrl: this.baseUrl }), // 传入自定义 baseUrl
        };
      }

      console.log('[LLM Client] Request URL:', url);
      console.log('[LLM Client] Request body encryptedApiKey:', !!this.encryptedApiKey);

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API 错误: ${error}`);
      }

      // 处理流式响应
      if (stream && onStream) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let finalContent = '';      // 只包含 content（最终结果）
        let displayContent = '';    // 包含 content + reasoning_content（UI显示）

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                const deltaContent = parsed.choices?.[0]?.delta?.content;
                const deltaReasoning = parsed.choices?.[0]?.delta?.reasoning_content;
                
                // 处理 reasoning_content（思考过程）
                if (deltaReasoning) {
                  displayContent += deltaReasoning;
                  onStream(deltaReasoning, displayContent, true);
                }
                
                // 处理 content（实际内容）
                if (deltaContent) {
                  finalContent += deltaContent;
                  displayContent += deltaContent;
                  onStream(deltaContent, displayContent, false);
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }

        return {
          content: finalContent,
          model: this.model,
        };
      }

      const data = await response.json();

      // 处理响应内容（支持普通响应和 web_search 响应）
      const message = data.choices[0]?.message;
      let content = message?.content || "";
      
      // 如果模型返回了 tool_calls，尝试提取信息
      if (message?.tool_calls) {
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
    async _callAliyun({ system, messages, maxTokens, webSearch, stream, onStream }) {
      // 检测环境
      const isCloudflarePages = window.location.hostname.includes('pages.dev') ||
        window.location.hostname.includes('workers.dev');
      const isLocalDev = window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1';

      let url;
      let headers;
      let body;

      // 本地开发直接调用阿里云 API
      if (isLocalDev) {
        // 本地开发时从 localStorage 获取解密的 API Key
        const apiKey = await getDecryptedApiKey('aliyun');
        if (!apiKey) {
          throw new Error('请先配置 LLM API Key');
        }

        url = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        };
        body = {
          model: this.model,
          messages: system ? [{ role: "system", content: system }, ...messages] : messages,
          max_tokens: maxTokens,
          temperature: 0.7,
          enable_search: webSearch,
          stream,
        };
      } else {
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
          stream,
          ...(this.encryptedApiKey && { encryptedApiKey: this.encryptedApiKey }),
        };
      }

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[LLM Client] Error response:', errorText);
        let errorMessage = `阿里云百炼 API 错误 (${response.status})`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error) {
            errorMessage = `阿里云百炼 API 错误: ${errorJson.error}`;
            if (errorJson.details) {
              errorMessage += ` - ${errorJson.details}`;
            }
          }
        } catch (e) {
          errorMessage = `阿里云百炼 API 错误: ${errorText}`;
        }
        throw new Error(errorMessage);
      }

      // 处理流式响应
      if (stream && onStream) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let finalContent = '';      // 只包含 content（最终结果）
        let displayContent = '';    // 包含 content + reasoning_content（UI显示）

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                const deltaContent = parsed.choices?.[0]?.delta?.content;
                const deltaReasoning = parsed.choices?.[0]?.delta?.reasoning_content;
                
                // 处理 reasoning_content（思考过程）
                if (deltaReasoning) {
                  displayContent += deltaReasoning;
                  onStream(deltaReasoning, displayContent, true);
                }
                
                // 处理 content（实际内容）
                if (deltaContent) {
                  finalContent += deltaContent;
                  displayContent += deltaContent;
                  onStream(deltaContent, displayContent, false);
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }

        return {
          content: finalContent,
          model: this.model,
        };
      }

      const data = await response.json();

      // 检响格式（支持 content 或 reasoning_content）
      const message = data.choices?.[0]?.message;
      const content = message?.content || message?.reasoning_content;
      
      if (!data.choices || !content) {
        console.error('[Aliyun Response] Invalid response format:', data);
        throw new Error('阿里云百炼返回的响应格式不正确');
      }

      // 统一响应格式
      return {
        content: content,
        usage: data.usage,
        model: data.model,
      };
    },

    /**
     * 调用 Anthropic API
     * 本地开发直接调用，生产环境使用 Pages Function 代理避免 CORS 问题
     */
    async _callAnthropic({ system, messages, maxTokens, webSearch, stream, onStream }) {
      // 检测环境
      const isCloudflarePages = window.location.hostname.includes('pages.dev') ||
        window.location.hostname.includes('workers.dev');
      const isLocalDev = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

      let url;
      let headers;
      let body;

      // 构建 tools 参数（如果启用 web 搜索）
      // 注意：Anthropic 的 web_search 工具需要特定模型和配置
      // 暂时禁用，等待进一步测试
      const tools = undefined;

      // 本地开发直接调用 API
      if (isLocalDev) {
        // 本地开发时从 localStorage 获取解密的 API Key
        const apiKey = await getDecryptedApiKey('anthropic');
        if (!apiKey) {
          throw new Error('请先配置 LLM API Key');
        }

        const baseUrl = this.baseUrl || 'https://api.anthropic.com/v1';
        url = `${baseUrl.replace(/\/$/, '')}/messages`;
        headers = {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        };
        body = {
          model: this.model,
          system,
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          max_tokens: maxTokens,
          stream,
          ...(tools && { tools }),
        };
      } else {
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
          stream,
          ...(tools && { tools }),
          ...(this.encryptedApiKey && { encryptedApiKey: this.encryptedApiKey }), // 传入加密的 API Key
          ...(this.baseUrl && { baseUrl: this.baseUrl }), // 传入自定义 baseUrl
        };
      }

      console.log('[LLM Client] Request URL:', url);

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Anthropic API 错误: ${error}`);
      }

      // 处理流式响应
      if (stream && onStream) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                // 优先使用 content，忽略 reasoning_content（思考过程不应包含在最终内容中）
                const deltaContent = parsed.choices?.[0]?.delta?.content;
                if (deltaContent) {
                  fullContent += deltaContent;
                  onStream(deltaContent, fullContent);
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }

        return {
          content: fullContent,
          model: this.model,
        };
      }

      const data = await response.json();

      // 处理响应内容（支持普通响应和 web_search 响应）
      let content = data.content?.map((c) => c.text || "").join("") || data.choices?.[0]?.message?.content || "";
      
      // 如果模型返回了 tool_use，尝试提取信息
      if (data.content) {
        const toolUses = data.content.filter(c => c.type === "tool_use");
        if (toolUses.length > 0) {
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
  // 单页模式 - 小红书风格（中文）
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

  // 单页模式 - 英文版
  singleXHS_EN: `You are a professional content layout expert. Transform the user's content into structured layout content.
【Content Generation Requirements】
- If the user inputs a news topic, generate specific news report content including: specific events, times, locations, key figures, specific data/details
- Avoid macro analysis (such as "reflects...trend", "demonstrates...spirit")
- Focus on specific facts and details, let facts speak for themselves
- Use specific numbers, times, locations, and names

【Important】Strictly follow these word limits:
- emoji: 1 character
- category: max 3 words
- title: max 20 words
- lead: max 30 words
- sections: 4-5 sections, each heading max 10 words, text max 80 words
- tip: max 40 words
- tags: 5 tags, each max 5 words

Return ONLY JSON, no markdown, no explanations:
{
  "emoji": "🎉",
  "category": "Category",
  "title": "Title",
  "lead": "Lead paragraph",
  "sections": [
    {"heading": "Heading 1", "text": "Content text"},
    {"heading": "Heading 2", "text": "Content text"},
    {"heading": "Heading 3", "text": "Content text"}
  ],
  "tip": "Pro tip",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`,

  // 分页模式 - 小红书风格（中文）
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

  // 分页模式 - 小红书风格（英文）
  splitXHS_EN: `You are a professional content strategist. Split user content into 4-5 visual cards.
【Style】Emotional headlines, casual tone, emoji accents.
【Content Generation Requirements】
- If the user inputs a news topic, generate specific news report content including: specific events, times, locations, key figures, specific data/details
- Avoid macro analysis
- Focus on specific facts and details
- Use specific numbers, times, locations, and names
【Important Word Limits】
- cover: title max 15 words, subtitle max 25 words
- content: heading max 8 words (with emoji), text max 60 words, extra max 25 words
- end: cta max 15 words, sub max 25 words
- tags: 5 tags

Return ONLY JSON, no markdown:
{
  "slides": [
    {"type": "cover", "emoji": "🎉", "title": "Cover Title", "subtitle": "Subtitle"},
    {"type": "content", "heading": "✨Heading", "text": "Content text", "extra": "Quote"},
    {"type": "content", "heading": "✨Heading", "text": "Content text", "extra": "Quote"},
    {"type": "end", "cta": "Call to action", "sub": "Conclusion", "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]}
  ]
}`,

  // 分页模式 - 微信风格（中文）
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

  // 分页模式 - 微信风格（英文）
  splitWechat_EN: `You are a professional editorial content creator. Split user content into 4-5 professional visual cards.
【Style】Professional, rational, clear structure, no emoji in headings.
【Content Generation Requirements】
- If the user inputs a news topic, generate specific news report content including: specific events, times, locations, key figures, specific data/details
- Avoid macro analysis
- Focus on specific facts and details
- Use specific numbers, times, locations, and names
【Important Word Limits】
- cover: title max 15 words, subtitle max 25 words
- content: heading max 8 words (no emoji), text max 60 words, extra max 25 words
- end: cta max 15 words, sub max 25 words
- tags: 5 tags

Return ONLY JSON, no markdown:
{
  "slides": [
    {"type": "cover", "emoji": "📊", "title": "Professional Title", "subtitle": "Subtitle"},
    {"type": "content", "heading": "Heading", "text": "Content text", "extra": "Extension"},
    {"type": "content", "heading": "Heading", "text": "Content text", "extra": "Extension"},
    {"type": "end", "cta": "Call to action", "sub": "Conclusion", "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]}
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

  // 移除思考过程（如 DeepSeek 的 "Thinking Process:"）
  // 更健壮的方法：直接找到第一个 { 或 [，这应该是 JSON 的开始
  // 因为思考过程中的文本不太可能包含 { 或 [
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  
  let jsonStartIdx = -1;
  if (firstBrace !== -1 && firstBracket !== -1) {
    jsonStartIdx = Math.min(firstBrace, firstBracket);
  } else if (firstBrace !== -1) {
    jsonStartIdx = firstBrace;
  } else if (firstBracket !== -1) {
    jsonStartIdx = firstBracket;
  }
  
  if (jsonStartIdx !== -1) {
    cleaned = cleaned.substring(jsonStartIdx).trim();
  }
  
  if (jsonStartIdx === -1) {
    console.error('[extractJSON] No JSON object found in:', cleaned.substring(0, 500));
    throw new Error('No valid JSON object found in response');
  }

  // 智能查找 JSON 结束位置：找到与起始 { 或 [ 匹配的 } 或 ]
  let braceCount = 0;
  let bracketCount = 0;
  let inString = false;
  let escaped = false;
  let endIdx = -1;
  const isArray = cleaned[0] === '[' || cleaned[0] === '{' ? cleaned[0] === '[' : cleaned.indexOf('[') === 0;
  
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    
    if (escaped) {
      escaped = false;
      continue;
    }
    
    if (char === '\\') {
      escaped = true;
      continue;
    }
    
    if (char === '"' && !escaped) {
      inString = !inString;
      continue;
    }
    
    if (!inString) {
      if (char === '{') {
        braceCount++;
      } else if (char === '}') {
        braceCount--;
        if (!isArray && braceCount === 0) {
          endIdx = i;
          break;
        }
      } else if (char === '[') {
        bracketCount++;
      } else if (char === ']') {
        bracketCount--;
        if (isArray && bracketCount === 0) {
          endIdx = i;
          break;
        }
      }
    }
  }
  
  if (endIdx === -1) {
    console.warn('[extractJSON] No matching closing brace found, attempting aggressive recovery...');
    
    // 尝试找到最长的平衡 JSON 结构
    let maxValidEnd = -1;
    let tempBraceCount = 0;
    let tempBracketCount = 0;
    let tempInString = false;
    let tempEscaped = false;
    
    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i];
      
      if (tempEscaped) {
        tempEscaped = false;
        continue;
      }
      
      if (char === '\\') {
        tempEscaped = true;
        continue;
      }
      
      if (char === '"' && !tempEscaped) {
        tempInString = !tempInString;
        continue;
      }
      
      if (!tempInString) {
        if (char === '{') tempBraceCount++;
        else if (char === '}') {
          tempBraceCount--;
          if (tempBraceCount === 0 && tempBracketCount === 0) {
            maxValidEnd = i;
          }
        }
        else if (char === '[') tempBracketCount++;
        else if (char === ']') {
          tempBracketCount--;
          if (tempBraceCount === 0 && tempBracketCount === 0) {
            maxValidEnd = i;
          }
        }
      }
    }
    
    if (maxValidEnd !== -1) {
      console.log('[extractJSON] Found valid JSON ending at position:', maxValidEnd);
      endIdx = maxValidEnd;
    } else {
      console.error('[extractJSON] No matching closing brace found in:', cleaned.substring(0, 500));
      throw new Error('No valid JSON object found in response');
    }
  }

  // 提取 JSON 部分
  cleaned = cleaned.substring(0, endIdx + 1);

  // 第零步：移除零宽字符和 BOM
  cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '');
  
  // 第一步：转义字符串内的控制字符（换行、制表符等）
  cleaned = escapeSpecialCharsInJSON(cleaned);

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
  cleaned = cleaned.replace(/"(\w+)":\s*,/g, '"$1": null,');
  cleaned = cleaned.replace(/"(\w+)":\s*([}\]])/g, '"$1": null $2');

  // 第六步半：修复 sections 数组格式错误（如 "sections文案产出效率",）
  // LLM 有时会把 sections 数组写成 "sections标题内容", "text": "..." 的错误格式
  
  // 首先处理 "sections内容", 后面直接跟属性的情况
  if (/"sections[^":]+",/.test(cleaned)) {
    // 提取 sections 后面的内容作为第一个 heading
    cleaned = cleaned.replace(/"sections([^",]+)",\s*/g, '"sections": [{"heading": "$1"}, ');
    
    // 尝试修复后续的内容：如果有独立的 "text": 或 "heading": 属性，把它们归入 sections
    // 找到 sections 数组开始的位置
    const sectionsMatch = cleaned.match(/"sections":\s*\[/);
    if (sectionsMatch) {
      const sectionsStart = cleaned.indexOf(sectionsMatch[0]) + sectionsMatch[0].length;
      let sectionsPart = cleaned.substring(sectionsStart);
      
      // 查找 sections 数组应该结束的位置（在 "tip" 或 "tags" 之前）
      const endMatch = sectionsPart.match(/,\s*"(?:tip|tags)"/);
      if (endMatch) {
        const sectionsEnd = sectionsPart.indexOf(endMatch[0]);
        let sectionsContent = sectionsPart.substring(0, sectionsEnd);
        
        // 尝试从混乱的内容中提取 heading 和 text 对
        // 模式：可能包含多个独立的 "heading": "xxx" 或 "text": "xxx"
        const items = [];
        let currentItem = {};
        
        // 提取所有 heading 和 text
        const headingMatches = [...sectionsContent.matchAll(/"heading"\s*:\s*"([^"]+)"/g)];
        const textMatches = [...sectionsContent.matchAll(/"text"\s*:\s*"([^"]+)"/g)];
        
        // 匹配 heading 和 text
        for (let i = 0; i < Math.max(headingMatches.length, textMatches.length); i++) {
          const item = {};
          if (headingMatches[i]) item.heading = headingMatches[i][1];
          if (textMatches[i]) item.text = textMatches[i][1];
          if (Object.keys(item).length > 0) {
            items.push(item);
          }
        }
        
        // 如果有提取到内容，重建 sections 数组
        if (items.length > 0) {
          const newSections = JSON.stringify(items);
          cleaned = cleaned.substring(0, sectionsStart) + newSections.substring(1, newSections.length - 1) + 
                    sectionsPart.substring(sectionsEnd);
        }
      }
    }
  }
  
  // 修复数组结尾：确保 sections 数组正确闭合
  if (cleaned.includes('"sections":') && !cleaned.includes('"sections": []') && !cleaned.includes('"sections":[')) {
    // 尝试在 tip 或 tags 之前添加 ]
    cleaned = cleaned.replace(/(,"tip":)/, ']$1');
    cleaned = cleaned.replace(/(,"tags":)/, ']$1');
  }

  // 尝试解析
  console.log('[extractJSON] Attempting to parse cleaned JSON (first 500 chars):', cleaned.substring(0, 500));
  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    // 第七步：激进清理 - 移除所有控制字符（跳过特殊字符转义，因为第一步已处理）
    try {
      cleaned = cleaned.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
      return JSON.parse(cleaned);
    } catch {
      // 第八步：尝试使用正则提取可解析的 JSON 部分
      try {
        // 尝试提取最外层的大括号包裹的内容
        const objectMatch = cleaned.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          const extracted = objectMatch[0];
          // 尝试平衡括号
          let braceCount = 0;
          let inString = false;
          let escaped = false;
          let lastValidEnd = -1;
          
          for (let i = 0; i < extracted.length; i++) {
            const char = extracted[i];
            
            if (escaped) {
              escaped = false;
              continue;
            }
            
            if (char === '\\') {
              escaped = true;
              continue;
            }
            
            if (char === '"' && !escaped) {
              inString = !inString;
              continue;
            }
            
            if (!inString) {
              if (char === '{') {
                braceCount++;
              } else if (char === '}') {
                braceCount--;
                if (braceCount === 0) {
                  lastValidEnd = i;
                }
              }
            }
          }
          
          if (lastValidEnd !== -1) {
            const balancedJSON = extracted.substring(0, lastValidEnd + 1);
            // 进一步清理：确保所有字符串正确闭合
            let fixedJSON = balancedJSON;
            
            // 修复 sections 数组中的常见问题
            // 查找并修复不完整的对象
            fixedJSON = fixedJSON.replace(/\{\s*"heading"\s*:\s*"([^"]*)"\s*\}/g, '{"heading":"$1","text":""}');
            fixedJSON = fixedJSON.replace(/\}\s*,\s*\{/g, '},{');
            
            // 修复数组结尾
            if (fixedJSON.includes('"sections":[') && !fixedJSON.includes('"tip":')) {
              fixedJSON = fixedJSON.replace(/(\])\s*$/, '$1,"tip":"","tags":[]');
            }
            
            return JSON.parse(fixedJSON);
          }
        }
      } catch {}
      
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
