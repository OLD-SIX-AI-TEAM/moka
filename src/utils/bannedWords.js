// 小红书和微信公众号平台违禁词列表
// 包含血腥暴力、色情、引流、广告法违禁词等

export const BANNED_WORDS = {
  // 血腥暴力类
  violence: [
    '杀', '死', '血腥', '暴力', '砍', '刺', '枪', '炸弹', '爆炸', '恐怖',
    '恐怖分子', '恐怖组织', '极端', '极端主义', '袭击', '暗杀', '谋杀',
    '自杀', '自残', '虐待', '家暴', '殴打', '打架', '斗殴', '械斗',
    '战争', '军事', '军队', '武器', '弹药', '核武器', '生化武器',
    '毒品', '吸毒', '贩毒', '制毒', '赌博', '赌场', '色情', '卖淫',
    '嫖娼', '强奸', '性侵', '猥亵', '绑架', '勒索', '敲诈', '抢劫',
    '盗窃', '诈骗', '传销', '非法集资', '洗钱', '黑社会', '黑帮',
  ],

  // 色情低俗类
 色情: [
    '色情', '黄色', '淫秽', '裸体', '裸照', '性交', '做爱', '约炮',
    '一夜情', '援交', '包养', '小三', '出轨', '劈腿', '婚外情',
    '情色', '成人', 'AV', 'av', 'A片', 'a片', '毛片', '黄片',
    '裸聊', '裸贷', '性服务', '性交易', '性工作者', '小姐', '鸡',
    '鸭', '同志', '基友', '蕾丝', '百合', '耽美', 'BL', 'GL',
    '车震', '野战', '群P', '3P', 'SM', 'sm', '情趣用品', '成人用品',
  ],

  // 引流类
 引流: [
    '加微信', '加我微信', '微信:', '微信：', 'wx:', 'wx：', 'WX:',
    'WX：', 'VX:', 'VX：', 'vx:', 'vx：', '加QQ', 'QQ:', 'QQ：',
    '私信', '私聊', '滴滴', 'dd', 'DD', '戳我', '找我', '联系我',
    '扫码', '二维码', '链接', '点击', '下载', 'APP', 'app', 'App',
    '公众号', '关注公众号', '抖音号', '快手号', '微博号', '小红书号',
    '主页', '个人主页', '主页链接', '置顶', '评论区', '评论里',
    '私', 'si', 'SI', 'si聊', '私密', '私信我', '滴滴我',
  ],

  // 广告法违禁词（极限词）
 极限词: [
    '最', '最佳', '最好', '最大', '最小', '最高', '最低', '最强',
    '最弱', '最快', '最慢', '最新', '最旧', '最便宜', '最贵',
    '第一', '唯一', '首个', '首选', '独家', '独创', '独有',
    '全球', '全国', '全网', '全城', '全市', '100%', '百分百',
    '绝对', '一定', '肯定', '保证', '保障', '包退', '包换',
    '永久', '永远', '万能', '全能', '顶级', '极致', '极品',
    '绝版', '空前', '绝后', '史无前例', '前所未有', '无与伦比',
    '独一无二', '举世无双', '天下第一', '世界第一', '行业第一',
    '销量第一', '质量第一', '服务第一', '技术第一', '品牌第一',
  ],

  // 医疗健康类违禁词
  medical: [
    '治愈', '根治', '药到病除', '包治百病', '祖传秘方', '偏方',
    '神药', '特效药', '抗癌', '防癌', '治癌', '杀死癌细胞',
    '降血压', '降血糖', '降血脂', '减肥药', '瘦身', '燃脂',
    '丰胸', '隆胸', '整容', '整形', '微整', '医美', '美容针',
    '玻尿酸', '肉毒素', '美白针', '水光针', '热玛吉', '超声刀',
  ],

  // 金融投资类违禁词
  financial: [
    '稳赚', '保本', '零风险', '无风险', '高回报', '高收益',
    '投资理财', '股票推荐', '内幕消息', '庄家', '操盘', '坐庄',
    '涨停', '跌停', '牛股', '黑马', '妖股', '庄股', '黑嘴',
    '荐股', '带票', '喊单', '跟单', '做空', '做多', '杠杆',
    '期货', '外汇', '虚拟货币', '比特币', '以太坊', '炒币',
    'ICO', 'ico', '挖矿', '矿机', '钱包', '交易所', '币圈',
  ],

  // 封建迷信类
 迷信: [
    '算命', '看相', '风水', '八字', '星座', '塔罗', '占卜',
    '算卦', '看风水', '阳宅', '阴宅', '坟地', '墓地', '鬼',
    '魂', '灵魂', '前世', '今生', '来世', '转世', '轮回',
    '报应', '因果', '业障', '功德', '福报', '诅咒', '巫术',
    '法术', '神通', '开光', '加持', '灌顶', '辟邪', '驱鬼',
  ],

  // 政治敏感类
  political: [
    '政府', '官员', '领导', '官员', '腐败', '贪污', '受贿',
    '行贿', '权钱交易', '官商勾结', '黑恶势力', '保护伞',
    '上访', '信访', '维稳', '群体事件', '抗议', '示威',
    '游行', '罢工', '罢课', '罢市', '静坐', '绝食', '自焚',
  ],

  // 其他违规内容
  other: [
    '假货', '仿品', '高仿', 'A货', '山寨', '盗版', '破解',
    '外挂', '作弊', '刷单', '刷信誉', '刷好评', '删差评',
    '水军', '五毛', '网军', '喷子', '键盘侠', '杠精',
    '键盘侠', '杠精', '喷子', '水军', '五毛', '网军',
    '举报', '投诉', '曝光', '人肉', '网暴', '网络暴力',
  ],

  // 英文色情低俗类
  englishSexual: [
    'porn', 'xxx', 'sex', 'nude', 'naked', 'erotic', 'nsfw',
    'hentai', 'bdsm', 'fetish', 'orgasm', 'masturbate', 'dildo',
    'vibrator', 'webcam', 'camgirl', 'onlyfans', 'fancentro',
    'fansly', 'manyvids', 'chaturbate', 'livejasmin',
  ],

  // 英文引流类
  englishTraffic: [
    'whatsapp', 'telegram', 'snapchat', 'kik', 'discord',
    'dm me', 'pm me', 'hit me up', 'hmu', 'link in bio',
    'check my profile', 'subscribe', 'join my', 'follow me on',
    'add me', 'message me', 'text me', 'contact me',
  ],

  // 英文广告法极限词
  englishExtreme: [
    'best', 'the best', '#1', 'number one', 'number 1',
    'guaranteed', '100% guarantee', 'risk-free', 'no risk',
    'unlimited', 'unbeatable', 'unmatched', 'unparalleled',
    'supreme', 'ultimate', 'premium', 'exclusive', 'only',
    'first ever', 'never before', 'world first', 'world-class',
  ],

  // 英文暴力类
  englishViolence: [
    'kill', 'murder', 'assassinate', 'bomb', 'explosion',
    'terrorist', 'terrorism', 'extremist', 'extremism',
    'shoot', 'gun', 'weapon', 'drug', 'cocaine', 'heroin',
    'meth', 'marijuana', 'cannabis',
  ],
};

// 所有违禁词的扁平化列表
export const ALL_BANNED_WORDS = Object.values(BANNED_WORDS).flat();

// 违禁词类别说明
export const BANNED_CATEGORIES = {
  violence: '血腥暴力',
  色情: '色情低俗',
  引流: '引流推广',
  极限词: '广告法违禁词（极限词）',
  medical: '医疗健康',
  financial: '金融投资',
  迷信: '封建迷信',
  political: '政治敏感',
  other: '其他违规内容',
  englishSexual: '色情低俗（英文）',
  englishTraffic: '引流推广（英文）',
  englishExtreme: '广告法极限词（英文）',
  englishViolence: '暴力违规（英文）',
};

// 转义正则表达式特殊字符
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 检查文本是否包含违禁词
export function checkBannedWords(text) {
  if (!text || typeof text !== 'string') {
    return { hasBanned: false, found: [] };
  }

  const found = [];
  const lowerText = text.toLowerCase();

  for (const [category, words] of Object.entries(BANNED_WORDS)) {
    for (const word of words) {
      const lowerWord = word.toLowerCase();
      
      // 短词（<=2个字符）需要更严格的匹配
      if (lowerWord.length <= 2) {
        // 使用正则表达式匹配，要求前后是单词边界或分隔符
        const regex = new RegExp(`(^|[\\s,，。、；;：:！!？?""''（）()\\[\\]【】])${escapeRegex(lowerWord)}($|[\\s,，。、；;：:！!？?""''（）()\\[\\]【】])`, 'i');
        if (regex.test(lowerText)) {
          found.push({
            word,
            category,
            categoryName: BANNED_CATEGORIES[category] || category,
          });
        }
      } else {
        // 长词直接包含匹配
        if (lowerText.includes(lowerWord)) {
          found.push({
            word,
            category,
            categoryName: BANNED_CATEGORIES[category] || category,
          });
        }
      }
    }
  }

  return {
    hasBanned: found.length > 0,
    found,
  };
}

// 替换文本中的违禁词
export function replaceBannedWords(text, replacement = '*') {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let result = text;

  for (const words of Object.values(BANNED_WORDS)) {
    for (const word of words) {
      let regex;
      if (word.length <= 2) {
        // 短词使用更严格的匹配
        regex = new RegExp(`(^|[\\s,，。、；;：:！!？?""''（）()\\[\\]【】])${escapeRegex(word)}($|[\\s,，。、；;：:！!？?""''（）()\\[\\]【】])`, 'gi');
      } else {
        regex = new RegExp(word, 'gi');
      }
      result = result.replace(regex, (match) => {
        return replacement.repeat(match.length);
      });
    }
  }

  return result;
}

// 英文违禁词类别说明
export const BANNED_CATEGORIES_EN = {
  violence: 'Violence',
  色情: 'Sexual Content',
  引流: 'Traffic Promotion',
  极限词: 'Advertising Ban Words',
  medical: 'Medical Claims',
  financial: 'Financial Claims',
  迷信: 'Superstition',
  political: 'Political Sensitivity',
  other: 'Other Violations',
  englishSexual: 'Sexual Content (EN)',
  englishTraffic: 'Traffic Promotion (EN)',
  englishExtreme: 'Advertising Ban Words (EN)',
  englishViolence: 'Violence (EN)',
};

// 获取违禁词提示信息
export function getBannedWordWarning(found, language = 'zh') {
  if (!found || found.length === 0) {
    return '';
  }

  const categoryMap = language === 'en' ? BANNED_CATEGORIES_EN : BANNED_CATEGORIES;
  const categories = [...new Set(found.map(f => categoryMap[f.category] || f.categoryName))];
  const words = [...new Set(found.map(f => f.word))];

  if (language === 'en') {
    return `Banned words detected: ${words.join(', ')}. Categories: ${categories.join(', ')}. Please edit or regenerate.`;
  }

  return `检测到以下违禁词：${words.join('、')}，涉及类别：${categories.join('、')}。请手动微调修改内容或者重新生成。`;
}
