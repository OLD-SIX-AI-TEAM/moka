/**
 * 通用 LLM 服务模块
 * 支持 OpenAI 和 Anthropic 两种 API 格式
 */

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
严格只返回 JSON，不要任何 markdown：
{
  "emoji": "1个emoji",
  "category": "分类4字内",
  "title": "爆款标题18字内",
  "lead": "一句话导语25字内",
  "sections": [
    {"heading": "8字内", "text": "40-70字"},
    {"heading": "...", "text": "..."},
    {"heading": "...", "text": "..."}
  ],
  "tip": "小贴士20-30字",
  "tags": ["标签1", "标签2", "标签3", "标签4", "标签5"]
}`,

  // 分页模式 - 小红书风格
  splitXHS: `你是小红书爆款内容策划专家。请用小红书的风格将用户文案拆分为多张图文卡片。
【小红书风格】封面标题必须有强烈情绪冲击，用感叹号/疑问句/数字/反差吸引眼球。语气亲切口语化，像朋友分享。内容卡heading带emoji。结尾引导点赞收藏评论。
严格只返回JSON：
{
  "slides": [
    {"type": "cover", "emoji": "emoji", "title": "有冲击力封面标题15字内", "subtitle": "钩子副标题25字内"},
    {"type": "content", "heading": "emoji+标题8字内", "text": "口语化正文50字内", "extra": "划重点金句20字内"},
    {"type": "content", "heading": "...", "text": "..."},
    {"type": "end", "cta": "互动结尾语15字内", "sub": "轻松活泼副文案20字内", "tags": ["热门话题1", "话题2", "话题3", "话题4", "话题5"]}
  ]
}`,

  // 分页模式 - 微信风格
  splitWechat: `你是微信公众号专业内容编辑。请用微信图文风格将用户文案拆分为多张分页卡片。
【微信风格】封面标题专业清晰权威，传递核心价值，避免浮夸。语气专业理性，结构清晰。heading简洁准确不用emoji。extra为延伸思考或数据支撑。结尾引导收藏转发。
严格只返回JSON：
{
  "slides": [
    {"type": "cover", "emoji": "emoji", "title": "专业清晰标题15字内", "subtitle": "明确指出受益人群和核心价值25字内"},
    {"type": "content", "heading": "简洁小标题无emoji8字内", "text": "专业正文50字内", "extra": "延伸思考或数据支撑20字内"},
    {"type": "content", "heading": "...", "text": "..."},
    {"type": "end", "cta": "引导收藏转发15字内", "sub": "专业结语20字内", "tags": ["专业关键词1", "词2", "词3", "词4", "词5"]}
  ]
}`,
};

/**
 * 从 LLM 响应中提取 JSON
 * @param {string} text - LLM 响应文本
 * @returns {Object} 解析后的 JSON
 */
export function extractJSON(text) {
  // 移除 markdown 代码块标记
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}
