// 公共提示词片段 - 所有提示词共享的安全、格式、新闻等要求

export const SAFETY_REQUIREMENTS_ZH = `【重要】内容安全要求（必须严格遵守）：
- 绝对不能包含任何血腥、暴力、色情、低俗、淫秽内容
- 不能包含任何引流信息（如微信号、QQ号、二维码、联系方式等）
- 不能使用广告法违禁词（如"最"、"第一"、"唯一"、"100%"、"绝对"等极限词）
- 不能包含医疗健康类违禁词（如"治愈"、"根治"、"特效药"等）
- 不能包含金融投资类违禁词（如"稳赚"、"保本"、"零风险"等）
- 不能包含封建迷信内容（如"算命"、"风水"、"八字"等）
- 不能包含政治敏感内容
- 不能包含假货、盗版、外挂等违规内容
- 确保内容健康、积极、正能量，符合平台社区规范
- **绝对禁止使用以下词汇**："违禁词"、"评论区"、"违规"、"审核"、"敏感词"等平台相关术语`;

export const SAFETY_REQUIREMENTS_EN = `【Important】Content Safety Requirements (must strictly follow):
- Absolutely no violent, bloody, sexually explicit, vulgar, or obscene content
- No promotional or引流 information (such as WeChat IDs, QR codes, contact information, etc.)
- No prohibited advertising words (such as "best", "first", "only", "100%", "guaranteed", etc.)
- No medical/health prohibited claims (such as "cure", "heal", "miracle drug", etc.)
- No financial/investment prohibited claims (such as "guaranteed profit", "risk-free", "high return", etc.)
- No superstitious content (such as "fortune telling", "feng shui", "astrology", etc.)
- No politically sensitive content
- No counterfeit, pirated, or prohibited content
- Ensure content is healthy, positive, and符合 community guidelines
- **Absolutely forbidden words**: "prohibited words", "comment section", "violation", "review", "sensitive words" and other platform-related terms`;

export const NEWS_CONTENT_REQUIREMENTS_ZH = `【内容生成要求】
- 如果用户输入的是新闻主题，生成具体的新闻报道内容，包含：具体事件、时间、地点、关键人物、具体数据/细节
- 避免宏观分析（如"体现了...精神"、"反映了...趋势"、"展现了...风貌"）
- 聚焦具体事实和细节，用事实说话
- 使用具体的数字、时间、地点、人物名称`;

export const NEWS_CONTENT_REQUIREMENTS_EN = `【Content Generation Requirements】
- If the user inputs a news topic, generate specific news report content including: specific events, times, locations, key figures, specific data/details
- Avoid macro analysis (such as "reflects...trend", "demonstrates...spirit")
- Focus on specific facts and details, let facts speak for themselves
- Use specific numbers, times, locations, and names`;

export const JSON_FORMAT_REQUIREMENTS = `【输出要求】
1. 必须返回有效的JSON格式
2. 所有字符串值必须用双引号包裹
3. 属性之间必须有逗号分隔
4. 最后一个属性后面不能有逗号
5. 不要包含任何注释或markdown标记`;
