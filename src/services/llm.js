/**
 * 通用 LLM 服务模块
 * 支持 OpenAI、Anthropic 和阿里云百炼三种 API 格式
 */

import { storeEncryptedApiKey, getEncryptedApiKey, hasEncryptedApiKey, getDecryptedApiKey, clearCachedPublicKey } from "../utils/crypto";
import { isLocalDevEnv, isTauriEnv } from "../utils/env.js";
import { extractJSON } from "./json-extractor";

const STORAGE_KEY = "moka_llm_config";

// Pages Function 代理地址（直接代理，不经过独立 Worker）
const PAGES_PROXY_URL = "/api/llm";

/**
 * Tauri 环境下直接调用 LLM API
 * @param {string} provider - 提供商
 * @param {string} baseUrl - API 基础 URL
 * @param {string} apiKey - API 密钥
 * @param {Object} requestBody - 请求体
 * @returns {Promise<Response>} - fetch Response
 */
async function tauriDirectFetch(provider, baseUrl, apiKey, requestBody) {
  let targetUrl, headers;

  if (provider === 'anthropic') {
    targetUrl = `${baseUrl.replace(/\/$/, '')}/messages`;
    headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    };
  } else {
    targetUrl = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };
  }

  return fetch(targetUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
  });
}

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
      console.log('[LLM Config] 开始存储 API Key，provider:', config.provider || "aliyun");
      await storeEncryptedApiKey(apiKey, config.provider || "aliyun");
      console.log('[LLM Config] API Key 存储成功');
    }

    // 存储其他配置（不包含明文 apiKey）
    localStorage.setItem(STORAGE_KEY, JSON.stringify(restConfig));
    console.log('[LLM Config] 配置保存成功:', restConfig);

    return true;
  } catch (e) {
    console.error("[LLM Config] 保存配置失败:", e);
    throw e; // 抛出错误让调用者处理
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
    // 清除缓存的公钥
    localStorage.removeItem('moka_rsa_keypair');
    // 清除内存中缓存的公钥
    clearCachedPublicKey();
  
    return true;
  } catch (e) {
    console.error("[LLM Config] 清除配置失败:", e);
    return false;
  }
}

// 处理 API 错误响应
async function handleAPIError(response) {
  const errorText = await response.text();
  console.error('[LLM Client] Error response:', errorText);

  let errorData;
  try {
    errorData = JSON.parse(errorText);
  } catch {
    errorData = { error: errorText };
  }

  // 检查是否是解密失败错误
  if (errorData.code === 'DECRYPT_FAILED' || errorData.shouldClearConfig) {
    console.warn('[LLM Client] 检测到密钥解密失败，自动清除配置');
    clearLLMConfig();

    // 抛出一个更友好的错误
    const error = new Error('API Key 已失效，请重新配置');
    error.code = 'KEY_ROTATION';
    error.shouldReconfigure = true;
    error.originalError = errorData.error;
    throw error;
  }

  // 其他错误
  const errorMessage = errorData.error || errorData.message || `API 错误 (${response.status})`;
  throw new Error(errorMessage);
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

  console.log('[LLM Config] 读取配置:', {
    provider,
    hasStorageConfig: !!storageConfig,
    hasEncryptedKey,
    encryptedApiKeyLength: encryptedApiKey?.length || 0,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'server'
  });

  // 如果 localStorage 中有有效配置，优先使用
  if (storageConfig && hasEncryptedKey) {
    console.log("[LLM Config] 使用 localStorage 配置（API Key 已存储）");
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
    defaultModel: "qwen3.6-plus",
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
  const isLocalDev = isLocalDevEnv();

  // 本地开发环境（包括局域网）：encryptedApiKey 实际上是明文，所以也作为 apiKey 返回
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
 * 测试 LLM 配置是否可用
 * @param {Object} config - 配置对象
 * @param {string} config.provider - 提供商
 * @param {string} config.baseUrl - API 基础 URL
 * @param {string} config.apiKey - API 密钥（明文）
 * @param {string} config.model - 模型 ID
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function testLLMConfig(config) {
  const { provider = "aliyun", baseUrl, apiKey, model } = config;
  const providerConfig = LLM_PROVIDERS[provider];

  if (!providerConfig) {
    return { success: false, message: `不支持的提供商: ${provider}` };
  }

  const finalBaseUrl = baseUrl || providerConfig.defaultBaseUrl;
  const finalModel = model || providerConfig.defaultModel;

  const isLocalDev = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );

  // 构建测试请求体
  const testMessages = [{ role: "user", content: "Hi" }];
  let body;

  if (provider === 'openai' || provider === 'aliyun') {
    body = {
      provider,
      model: finalModel,
      messages: testMessages,
      max_tokens: 10,
      stream: false,
      ...(finalBaseUrl && { baseUrl: finalBaseUrl }),
      ...(isLocalDev ? { apiKey } : {}),
    };
  } else if (provider === 'anthropic') {
    body = {
      provider,
      model: finalModel,
      system: "You are a helpful assistant.",
      messages: testMessages,
      max_tokens: 10,
      stream: false,
      ...(finalBaseUrl && { baseUrl: finalBaseUrl }),
      ...(isLocalDev ? { apiKey } : {}),
    };
  }

  try {
    let response;
    if (isTauriEnv()) {
      const directBody = provider === 'anthropic'
        ? { model: finalModel, max_tokens: 10, system: "You are a helpful assistant.", messages: testMessages, stream: false }
        : { model: finalModel, messages: testMessages, max_tokens: 10, temperature: 0.7, stream: false };
      response = await tauriDirectFetch(provider, finalBaseUrl, apiKey, directBody);
    } else {
      response = await fetch(PAGES_PROXY_URL, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }

      // 解析具体错误原因
      if (response.status === 401 || response.status === 403) {
        return { success: false, message: 'API Key 无效，请检查后重试' };
      }
      if (response.status === 404) {
        return { success: false, message: 'API 地址无效，请检查 Base URL' };
      }
      if (response.status === 400 && errorData.error?.includes?.('model')) {
        return { success: false, message: '模型名称无效，请检查后重试' };
      }

      const errorMsg = errorData.error || errorData.message || `检测失败 (${response.status})`;
      return { success: false, message: errorMsg };
    }

    const data = await response.json();
    // 检查是否有有效响应
    if (provider === 'anthropic') {
      if (!data.content && !data.choices) {
        return { success: false, message: 'API 响应格式异常' };
      }
    } else {
      if (!data.choices?.[0]?.message?.content && !data.choices?.[0]?.message?.reasoning_content) {
        return { success: false, message: 'API 响应格式异常' };
      }
    }

    return { success: true, message: '配置检测通过' };
  } catch (error) {
    console.error('[LLM Test] 检测失败:', error);
    if (error.message?.includes?.('fetch') || error.message?.includes?.('network')) {
      return { success: false, message: '网络连接失败，请检查网络或 Base URL' };
    }
    return { success: false, message: error.message || '配置检测失败' };
  }
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
      // 检测环境
      const isLocalDev = typeof window !== 'undefined' && (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
      );
      const tauriEnv = isTauriEnv();
      const { system, messages, maxTokens = 1000, webSearch = true, stream = (isLocalDev || tauriEnv) ? true : false, onStream } = params;

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
     * 统一使用代理避免 CORS 问题：本地走 vite 代理，生产走 Cloudflare Worker
     */
    async _callOpenAI({ system, messages, maxTokens, webSearch, stream, onStream }) {
      // 使用统一的本地开发环境检测（包含局域网 IP）
      const isLocalDev = isLocalDevEnv();
      const tauriEnv = isTauriEnv();

      // 本地开发获取明文 API Key，生产环境使用加密 key
      const apiKey = (isLocalDev || tauriEnv) ? await getDecryptedApiKey('openai') : null;

      let response;
      try {
        if (tauriEnv) {
          const directBody = {
            model: this.model,
            messages: system ? [{ role: "system", content: system }, ...messages] : messages,
            max_tokens: maxTokens,
            temperature: 0.7,
            stream,
          };
          response = await tauriDirectFetch('openai', this.baseUrl || LLM_PROVIDERS.openai.defaultBaseUrl, apiKey, directBody);
        } else {
          const url = PAGES_PROXY_URL;
          const headers = {
            'Content-Type': 'application/json',
          };
          const body = {
            provider: 'openai',
            model: this.model,
            messages: system ? [{ role: "system", content: system }, ...messages] : messages,
            max_tokens: maxTokens,
            temperature: 0.7,
            stream,
            ...(this.baseUrl && { baseUrl: this.baseUrl }),
            ...(isLocalDev && apiKey ? { apiKey } : { encryptedApiKey: this.encryptedApiKey }),
          };
          response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
          });
        }
      } catch (fetchError) {
        console.error('[LLM Client] Fetch error:', fetchError);
        throw new Error(`网络请求失败: ${fetchError.message}`);
      }



      if (!response.ok) {
        await handleAPIError(response);
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
      // 使用统一的本地开发环境检测（包含局域网 IP）
      const isLocalDev = isLocalDevEnv();
      const tauriEnv = isTauriEnv();

      // 本地开发获取明文 API Key，生产环境使用加密 key
      const apiKey = (isLocalDev || tauriEnv) ? await getDecryptedApiKey('aliyun') : null;

      let response;
      if (tauriEnv) {
        const directBody = {
          model: this.model,
          messages: system ? [{ role: "system", content: system }, ...messages] : messages,
          max_tokens: maxTokens,
          temperature: 0.7,
          enable_search: webSearch,
          stream,
        };
        response = await tauriDirectFetch('aliyun', this.baseUrl || LLM_PROVIDERS.aliyun.defaultBaseUrl, apiKey, directBody);
      } else {
        const url = PAGES_PROXY_URL;
        const headers = {
          'Content-Type': 'application/json',
        };
        const body = {
          provider: 'aliyun',
          model: this.model,
          messages: system ? [{ role: "system", content: system }, ...messages] : messages,
          max_tokens: maxTokens,
          temperature: 0.7,
          enable_search: webSearch,
          stream,
          ...(this.baseUrl && { baseUrl: this.baseUrl }),
          ...(isLocalDev && apiKey ? { apiKey } : { encryptedApiKey: this.encryptedApiKey }),
        };
        console.log('[Anthropic Debug] 开始发送请求...');
        response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        });
      }
      console.log('[Anthropic Debug] 响应状态:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Anthropic Debug] 错误响应:', errorText);
        await handleAPIError(response);
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
     * 统一使用代理避免 CORS 问题：本地走 vite 代理，生产走 Cloudflare Worker
     */
    async _callAnthropic({ system, messages, maxTokens, webSearch, stream, onStream }) {
      // 使用统一的本地开发环境检测（包含局域网 IP）
      const isLocalDev = isLocalDevEnv();
      const tauriEnv = isTauriEnv();

      // 本地开发获取明文 API Key，生产环境使用加密 key
      const apiKey = (isLocalDev || tauriEnv) ? await getDecryptedApiKey('anthropic') : null;

      let response;
      if (tauriEnv) {
        const directBody = {
          model: this.model,
          system,
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          max_tokens: maxTokens,
          stream,
        };
        response = await tauriDirectFetch('anthropic', this.baseUrl || LLM_PROVIDERS.anthropic.defaultBaseUrl, apiKey, directBody);
      } else {
        const url = PAGES_PROXY_URL;
        const headers = {
          'Content-Type': 'application/json',
        };
        const body = {
          provider: 'anthropic',
          model: this.model,
          system,
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          max_tokens: maxTokens,
          stream,
          ...(this.baseUrl && { baseUrl: this.baseUrl }),
          ...(isLocalDev && apiKey ? { apiKey } : { encryptedApiKey: this.encryptedApiKey }),
        };
        response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        });
      }

      if (!response.ok) {
        await handleAPIError(response);
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
                // OpenAI 格式: choices[0].delta.content
                const deltaContent = parsed.choices?.[0]?.delta?.content;
                // Anthropic 格式: delta.text 或 delta.type === 'text_delta'
                const anthropicDeltaText = parsed.delta?.text;
                
                const content = deltaContent || anthropicDeltaText;
                if (content) {
                  fullContent += content;
                  onStream(content, fullContent);
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

// extractJSON 函数已从 json-extractor.js 导入并重新导出
export { extractJSON } from "./json-extractor";

// 提示词已迁移至 src/prompts 模块，此处为向后兼容重新导出
export { SYSTEM_PROMPTS } from "../prompts";
