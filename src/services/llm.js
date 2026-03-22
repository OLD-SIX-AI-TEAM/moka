/**
 * 通用 LLM 服务模块
 * 支持 OpenAI 和 Anthropic 两种 API 格式
 */

// 从环境变量读取配置
const ENV_CONFIG = {
  provider: import.meta.env.VITE_LLM_PROVIDER || "anthropic",
  baseUrl: import.meta.env.VITE_LLM_BASE_URL || "",
  apiKey: import.meta.env.VITE_LLM_API_KEY || "",
  model: import.meta.env.VITE_LLM_MODEL || "",
};

// 调试日志：输出当前配置
console.log("[LLM Config] Provider:", ENV_CONFIG.provider);
console.log("[LLM Config] Base URL:", ENV_CONFIG.baseUrl || "(使用默认值)");
console.log("[LLM Config] Model:", ENV_CONFIG.model || "(使用默认值)");

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
};

/**
 * 获取环境变量中的 LLM 配置
 * @returns {Object} 配置对象
 */
export function getEnvLLMConfig() {
  return {
    provider: ENV_CONFIG.provider,
    baseUrl: ENV_CONFIG.baseUrl || undefined,
    apiKey: ENV_CONFIG.apiKey,
    model: ENV_CONFIG.model || undefined,
  };
}

/**
 * 检查环境变量配置是否有效
 * @returns {boolean}
 */
export function isEnvConfigValid() {
  return !!ENV_CONFIG.apiKey;
}

/**
 * 创建 LLM 客户端
 * @param {Object} config - 配置对象
 * @param {string} config.provider - 提供商: 'openai' | 'anthropic'
 * @param {string} config.baseUrl - API 基础 URL
 * @param {string} config.apiKey - API 密钥
 * @param {string} config.model - 模型 ID
 * @returns {Object} LLM 客户端实例
 */
export function createLLMClient(config) {
  const { provider = "anthropic", baseUrl, apiKey, model } = config;

  const providerConfig = LLM_PROVIDERS[provider];
  if (!providerConfig) {
    throw new Error(`不支持的 LLM 提供商: ${provider}`);
  }

  const finalBaseUrl = baseUrl || providerConfig.defaultBaseUrl;
  const finalModel = model || providerConfig.defaultModel;

  return {
    provider,
    baseUrl: finalBaseUrl,
    apiKey,
    model: finalModel,

    /**
     * 发送聊天请求
     * @param {Object} params - 请求参数
     * @param {string} params.system - 系统提示词
     * @param {Array} params.messages - 消息列表
     * @param {number} params.maxTokens - 最大 token 数
     * @returns {Promise<Object>} 响应结果
     */
    async chat(params) {
      const { system, messages, maxTokens = 1000 } = params;

      if (this.provider === "openai") {
        return this._callOpenAI({ system, messages, maxTokens });
      } else if (this.provider === "anthropic") {
        return this._callAnthropic({ system, messages, maxTokens });
      }

      throw new Error(`未实现的提供商: ${this.provider}`);
    },

    /**
     * 调用 OpenAI API
     */
    async _callOpenAI({ system, messages, maxTokens }) {
      const url = `${this.baseUrl}/chat/completions`;

      const body = {
        model: this.model,
        messages: system ? [{ role: "system", content: system }, ...messages] : messages,
        max_tokens: maxTokens,
        temperature: 0.7,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API 错误: ${error}`);
      }

      const data = await response.json();

      // 统一响应格式
      return {
        content: data.choices[0]?.message?.content || "",
        usage: data.usage,
        model: data.model,
      };
    },

    /**
     * 调用 Anthropic API
     */
    async _callAnthropic({ system, messages, maxTokens }) {
      const url = `${this.baseUrl}/messages`;

      const body = {
        model: this.model,
        max_tokens: maxTokens,
        system,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Anthropic API 错误: ${error}`);
      }

      const data = await response.json();

      // 统一响应格式
      return {
        content: data.content?.map((c) => c.text || "").join("") || "",
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
    throw new Error('Invalid input: text is required');
  }

  // 移除 markdown 代码块标记
  let cleaned = text.replace(/```json\s*|```\s*/gi, "").trim();

  // 尝试找到 JSON 对象的开始和结束位置
  const startIdx = cleaned.indexOf('{');
  const endIdx = cleaned.lastIndexOf('}');

  if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) {
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

  // 第三步：修复尾部逗号
  cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');

  // 尝试解析
  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    // 第四步：修复字符串中的特殊字符
    try {
      cleaned = escapeSpecialCharsInJSON(cleaned);
      return JSON.parse(cleaned);
    } catch {
      // 第五步：激进清理 - 移除所有控制字符
      try {
        cleaned = cleaned.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
        return JSON.parse(cleaned);
      } catch {
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
