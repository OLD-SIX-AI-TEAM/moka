/**
 * 常量配置
 */

// 分页风格配置
export const SPLIT_STYLES = [
  { id: "vivid", name: "撞色块", icon: "🎨", desc: "满版色 + 白内容" },
  { id: "clean", name: "极简线", icon: "✦", desc: "白底 + 色块序号" },
  { id: "dark", name: "暗夜风", icon: "🌙", desc: "深色 + 发光线" },
  { id: "paper", name: "手账风", icon: "📮", desc: "格纹底 + 邮票框" },
  { id: "editorial", name: "杂志风", icon: "📰", desc: "分色块 + 双线" },
  { id: "gradient", name: "渐变风", icon: "🌅", desc: "渐变封面 + 白内容" },
  // 小红书热门风格
  { id: "creamy", name: "奶油风", icon: "🧁", desc: "柔和奶油色调" },
  { id: "retro", name: "复古风", icon: "📻", desc: "怀旧复古质感" },
  { id: "forest", name: "森系风", icon: "🌲", desc: "自然清新绿意" },
  { id: "ins", name: "INS风", icon: "📷", desc: "简约高级质感" },
  { id: "japanese", name: "日系风", icon: "🎌", desc: "日式清新简约" },
  { id: "korean", name: "韩系风", icon: "💄", desc: "韩式温柔甜美" },
  { id: "pure", name: "纯欲风", icon: "🤍", desc: "清纯诱惑结合" },
  { id: "pop", name: "波普风", icon: "🎨", desc: "色彩鲜艳跳跃" },
  { id: "artistic", name: "文艺风", icon: "🎭", desc: "艺术气息浓厚" },
  { id: "luxury", name: "轻奢风", icon: "💎", desc: "精致高级感" },
  // 微信公众号风格
  { id: "business", name: "商务风", icon: "💼", desc: "专业商务风格" },
  { id: "tech", name: "科技风", icon: "🔬", desc: "现代科技质感" },
  { id: "edu", name: "教育风", icon: "📚", desc: "知识学术风格" },
  { id: "medical", name: "医疗风", icon: "⚕️", desc: "健康医疗专业" },
  { id: "finance", name: "财经风", icon: "📈", desc: "金融理财专业" },
  { id: "law", name: "法律风", icon: "⚖️", desc: "法律专业严谨" },
  { id: "food", name: "美食风", icon: "🍜", desc: "诱人美食风格" },
  { id: "travel", name: "旅行风", icon: "✈️", desc: "旅行探索风格" },
  { id: "fashion", name: "时尚风", icon: "👗", desc: "潮流时尚前沿" },
  { id: "mom", name: "母婴风", icon: "👶", desc: "温馨母婴主题" },
];

// 单页模板配置
export const TEMPLATES = [
  { id: "editorial", name: "杂志风", icon: "📰", desc: "左色条 + 双线" },
  { id: "notecard", name: "便签风", icon: "🗒", desc: "虚线边框 + 星点" },
  { id: "minimal", name: "极简线", icon: "✦", desc: "圆点编号 + 下划" },
  { id: "stamp", name: "手账风", icon: "📮", desc: "格纹底 + 邮票框" },
  { id: "bold", name: "撞色块", icon: "🎨", desc: "色块标题 + 白底" },
  { id: "dark", name: "暗夜风", icon: "🌙", desc: "深色底 + 发光线" },
  { id: "newspaper", name: "报纸风", icon: "📜", desc: "双线报头 + 序号" },
  { id: "film", name: "胶片风", icon: "🎞", desc: "胶片孔 + 色条" },
  { id: "label", name: "标签风", icon: "🏷", desc: "价签形 + 打孔" },
  // 小红书热门风格
  { id: "creamy", name: "奶油风", icon: "🧁", desc: "柔和奶油色调" },
  { id: "retro", name: "复古风", icon: "📻", desc: "怀旧复古质感" },
  { id: "forest", name: "森系风", icon: "🌲", desc: "自然清新绿意" },
  { id: "ins", name: "INS风", icon: "📷", desc: "简约高级质感" },
  { id: "japanese", name: "日系风", icon: "🎌", desc: "日式清新简约" },
  { id: "korean", name: "韩系风", icon: "💄", desc: "韩式温柔甜美" },
  { id: "pure", name: "纯欲风", icon: "🤍", desc: "清纯诱惑结合" },
  { id: "pop", name: "波普风", icon: "🎨", desc: "色彩鲜艳跳跃" },
  { id: "artistic", name: "文艺风", icon: "🎭", desc: "艺术气息浓厚" },
  { id: "luxury", name: "轻奢风", icon: "💎", desc: "精致高级感" },
  // 微信公众号风格
  { id: "business", name: "商务风", icon: "💼", desc: "专业商务风格" },
  { id: "tech", name: "科技风", icon: "🔬", desc: "现代科技质感" },
  { id: "edu", name: "教育风", icon: "📚", desc: "知识学术风格" },
  { id: "medical", name: "医疗风", icon: "⚕️", desc: "健康医疗专业" },
  { id: "finance", name: "财经风", icon: "📈", desc: "金融理财专业" },
  { id: "law", name: "法律风", icon: "⚖️", desc: "法律专业严谨" },
  { id: "food", name: "美食风", icon: "🍜", desc: "诱人美食风格" },
  { id: "travel", name: "旅行风", icon: "✈️", desc: "旅行探索风格" },
  { id: "fashion", name: "时尚风", icon: "👗", desc: "潮流时尚前沿" },
  { id: "mom", name: "母婴风", icon: "👶", desc: "温馨母婴主题" },
];

// 配色方案
export const PALETTES = [
  // 暖色系
  { id: "coral", label: "珊瑚", a: "#e05a4b", bg: "#fff8f6", tc: "#2a1210", bc: "#4a3330" },
  { id: "amber", label: "琥珀", a: "#c47c2b", bg: "#fffbf4", tc: "#1f1508", bc: "#4a3010" },
  { id: "rust", label: "铁锈", a: "#a0522d", bg: "#fef8f4", tc: "#200e08", bc: "#4a2818" },
  { id: "rose", label: "玫瑰", a: "#d44d6e", bg: "#fdf4f6", tc: "#2a1018", bc: "#5a2a38" },
  { id: "sunset", label: "晚霞", a: "#e85d4e", bg: "#fff5f4", tc: "#2a1210", bc: "#5a3028" },
  { id: "peach", label: "蜜桃", a: "#f4a261", bg: "#fff8f4", tc: "#2a1a10", bc: "#5a4028" },
  // 冷色系
  { id: "sage", label: "抹茶", a: "#4a7c59", bg: "#f4faf6", tc: "#172312", bc: "#344d38" },
  { id: "slate", label: "青石", a: "#4a7c8a", bg: "#f4fafb", tc: "#101e22", bc: "#2a3e44" },
  { id: "pine", label: "松针", a: "#2d6a4f", bg: "#f0faf5", tc: "#0a1e14", bc: "#1e4432" },
  { id: "ocean", label: "海洋", a: "#2e86ab", bg: "#f4f9fb", tc: "#0f1e26", bc: "#2a4a5a" },
  { id: "lavender", label: "薰衣草", a: "#7b68ee", bg: "#f7f5fd", tc: "#1a1030", bc: "#4a3a7a" },
  { id: "mint", label: "薄荷", a: "#3eb489", bg: "#f4fbf8", tc: "#0f2218", bc: "#2a5a48" },
  // 深色系
  { id: "ink", label: "水墨", a: "#2d3561", bg: "#f4f5fb", tc: "#0f1220", bc: "#333650" },
  { id: "plum", label: "梅子", a: "#8b3a62", bg: "#fdf4f8", tc: "#2a1020", bc: "#4a2a38" },
  { id: "midnight", label: "午夜", a: "#1a1a2e", bg: "#f4f4f6", tc: "#0a0a14", bc: "#2a2a3e" },
  { id: "wine", label: "红酒", a: "#722f37", bg: "#fdf4f5", tc: "#1f0a0c", bc: "#4a2028" },
  { id: "forest", label: "森林", a: "#1b4332", bg: "#f0f5f2", tc: "#0a1a14", bc: "#2a4a3a" },
  // 中性色
  { id: "coffee", label: "咖啡", a: "#6f4e37", bg: "#faf6f4", tc: "#1a1410", bc: "#4a3a2a" },
  { id: "charcoal", label: "炭灰", a: "#4a4a4a", bg: "#f5f5f5", tc: "#1a1a1a", bc: "#3a3a3a" },
  { id: "terracotta", label: "陶土", a: "#c65d3b", bg: "#fdf6f4", tc: "#2a1814", bc: "#5a3a2a" },
  { id: "gold", label: "金色", a: "#d4a574", bg: "#fdf9f4", tc: "#2a2018", bc: "#5a4a3a" },
];

// 字体
export const FONT_FAMILY = "'PingFang SC','Hiragino Sans GB',sans-serif";

// 默认 LLM 配置
export const DEFAULT_LLM_CONFIG = {
  provider: "anthropic",
  baseUrl: "",
  apiKey: "",
  model: "",
};

// 最大 Token 数 (Kimi K2.5 最大支持 65536 tokens，这里设置输出限制)
export const MAX_TOKENS = {
  single: 4000,
  split: 4000,
};

// AI设计模板选项
export const AI_DESIGN_TEMPLATE = { id: "ai", name: "AI设计", icon: "✨", desc: "智能生成独特风格" };
// AI设计分页风格选项
export const AI_DESIGN_SPLIT_STYLE = { id: "ai", name: "AI设计", icon: "✨", desc: "智能生成独特风格" };
