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
  { id: "coral", label: "珊瑚", a: "#e05a4b", bg: "#fff8f6", tc: "#2a1210", bc: "#4a3330" },
  { id: "sage", label: "抹茶", a: "#4a7c59", bg: "#f4faf6", tc: "#172312", bc: "#344d38" },
  { id: "ink", label: "水墨", a: "#2d3561", bg: "#f4f5fb", tc: "#0f1220", bc: "#333650" },
  { id: "amber", label: "琥珀", a: "#c47c2b", bg: "#fffbf4", tc: "#1f1508", bc: "#4a3010" },
  { id: "plum", label: "梅子", a: "#8b3a62", bg: "#fdf4f8", tc: "#2a1020", bc: "#4a2a38" },
  { id: "slate", label: "青石", a: "#4a7c8a", bg: "#f4fafb", tc: "#101e22", bc: "#2a3e44" },
  { id: "rust", label: "铁锈", a: "#a0522d", bg: "#fef8f4", tc: "#200e08", bc: "#4a2818" },
  { id: "pine", label: "松针", a: "#2d6a4f", bg: "#f0faf5", tc: "#0a1e14", bc: "#1e4432" },
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
