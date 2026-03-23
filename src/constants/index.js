/**
 * 小红书排版生成器 - 常量配置
 */

// AI设计选项
export const AI_DESIGN_OPTION = { id: "ai", name: "AI设计", icon: "✨", desc: "智能生成独特风格" };

// 分页风格配置
export const SPLIT_STYLES = [
  { id: "vivid", name: "撞色块", icon: "🎨", desc: "满版色 + 白内容" },
  { id: "clean", name: "极简线", icon: "✦", desc: "白底 + 色块序号" },
  { id: "dark", name: "暗夜风", icon: "🌙", desc: "深色 + 发光线" },
  { id: "paper", name: "手账风", icon: "📮", desc: "格纹底 + 邮票框" },
  { id: "editorial", name: "杂志风", icon: "📰", desc: "分色块 + 双线" },
  { id: "gradient", name: "渐变风", icon: "🌅", desc: "渐变封面 + 白内容" },
  // 新增分页风格 - 小红书热门风格
  { id: "creamy", name: "奶油风", icon: "🧁", desc: "柔和圆润 + 温暖治愈" },
  { id: "retro", name: "复古风", icon: "📻", desc: "怀旧色调 + 胶片质感" },
  { id: "forest", name: "森系风", icon: "🌲", desc: "自然清新 + 植物元素" },
  { id: "ins", name: "ins风", icon: "📷", desc: "简约高级 + 留白美学" },
  { id: "japanese", name: "日系风", icon: "🎌", desc: "清新淡雅 + 手绘感" },
  { id: "korean", name: "韩系风", icon: "💕", desc: "甜美可爱 + 柔和配色" },
  { id: "pure", name: "极简风", icon: "◻️", desc: "纯粹简洁 + 大量留白" },
  { id: "pop", name: "波普风", icon: "🎯", desc: "大胆撞色 + 几何图形" },
  { id: "artistic", name: "文艺风", icon: "📖", desc: "诗意文字 + 手写字体" },
  { id: "luxury", name: "轻奢风", icon: "💎", desc: "金色点缀 + 优雅线条" },
  // 新增分页风格 - 微信公众号风格
  { id: "business", name: "商务风", icon: "💼", desc: "专业严谨 + 蓝色调" },
  { id: "tech", name: "科技风", icon: "💻", desc: "未来感 + 赛博朋克" },
  { id: "edu", name: "教育风", icon: "📚", desc: "知识感 + 书本元素" },
  { id: "medical", name: "医疗风", icon: "⚕️", desc: "健康感 + 红十字" },
  { id: "finance", name: "财经风", icon: "📈", desc: "数据感 + 金色元素" },
  { id: "law", name: "法律风", icon: "⚖️", desc: "庄重感 + 天平元素" },
  { id: "food", name: "美食风", icon: "🍜", desc: "食欲感 + 餐具元素" },
  { id: "travel", name: "旅游风", icon: "✈️", desc: "探索感 + 地图元素" },
  { id: "fashion", name: "时尚风", icon: "👗", desc: "潮流感 + 几何分割" },
  { id: "mom", name: "母婴风", icon: "🍼", desc: "温馨感 + 柔和曲线" },
];

// AI设计选项
export const AI_DESIGN_TEMPLATE = { id: "ai", name: "AI设计", icon: "✨", desc: "智能生成独特风格" };

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
  // 新增小红书热门风格
  { id: "creamy", name: "奶油风", icon: "🧁", desc: "柔和圆润 + 温暖治愈" },
  { id: "retro", name: "复古风", icon: "📻", desc: "怀旧色调 + 胶片质感" },
  { id: "forest", name: "森系风", icon: "🌲", desc: "自然清新 + 植物元素" },
  { id: "ins", name: "ins风", icon: "📷", desc: "简约高级 + 留白美学" },
  { id: "japanese", name: "日系风", icon: "🎌", desc: "清新淡雅 + 手绘感" },
  { id: "korean", name: "韩系风", icon: "💕", desc: "甜美可爱 + 柔和配色" },
  { id: "pure", name: "极简风", icon: "◻️", desc: "纯粹简洁 + 大量留白" },
  { id: "pop", name: "波普风", icon: "🎯", desc: "大胆撞色 + 几何图形" },
  { id: "artistic", name: "文艺风", icon: "📖", desc: "诗意文字 + 手写字体" },
  { id: "luxury", name: "轻奢风", icon: "💎", desc: "金色点缀 + 优雅线条" },
  // 新增微信公众号风格
  { id: "business", name: "商务风", icon: "💼", desc: "专业严谨 + 蓝色调" },
  { id: "tech", name: "科技风", icon: "💻", desc: "未来感 + 赛博朋克" },
  { id: "edu", name: "教育风", icon: "📚", desc: "知识感 + 书本元素" },
  { id: "medical", name: "医疗风", icon: "⚕️", desc: "健康感 + 红十字" },
  { id: "finance", name: "财经风", icon: "📈", desc: "数据感 + 金色元素" },
  { id: "law", name: "法律风", icon: "⚖️", desc: "庄重感 + 天平元素" },
  { id: "food", name: "美食风", icon: "🍜", desc: "食欲感 + 餐具元素" },
  { id: "travel", name: "旅游风", icon: "✈️", desc: "探索感 + 地图元素" },
  { id: "fashion", name: "时尚风", icon: "👗", desc: "潮流感 + 几何分割" },
  { id: "mom", name: "母婴风", icon: "🍼", desc: "温馨感 + 柔和曲线" },
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

// 字体配置
export const FONT_FAMILY = "'PingFang SC','Hiragino Sans GB',sans-serif";

// 最大 Token 配置
export const MAX_TOKENS = {
  single: 1000,
  split: 1200,
  aiDesign: 2000,
};

// AI设计模式配置
export const AI_DESIGN_CONFIG = {
  maxHistoryVersions: 5,
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxImageSize: 5 * 1024 * 1024, // 5MB
};
