// 提示词模块统一入口
// 所有提示词集中管理，通过此文件统一导出

// 公共片段（可按需引用）
export {
  SAFETY_REQUIREMENTS_ZH,
  SAFETY_REQUIREMENTS_EN,
  NEWS_CONTENT_REQUIREMENTS_ZH,
  NEWS_CONTENT_REQUIREMENTS_EN,
  JSON_FORMAT_REQUIREMENTS,
} from './common.js';

// 内容生成提示词（单页/分页，小红书/微信，中文/英文）
export { CONTENT_PROMPTS } from './content.js';

// 向后兼容：将 CONTENT_PROMPTS 同时导出为 SYSTEM_PROMPTS
export { CONTENT_PROMPTS as SYSTEM_PROMPTS } from './content.js';

// AI设计提示词
export {
  AI_DESIGN_PROMPT,
  AI_DESIGN_WITH_REFERENCE_PROMPT,
  AI_DESIGN_PROMPT_SINGLE,
  AI_DESIGN_PROMPT_SPLIT,
} from './aiDesign.js';
