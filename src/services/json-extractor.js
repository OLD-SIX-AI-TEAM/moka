/**
 * JSON 提取器模块
 * 提供从 LLM 响应中提取和修复 JSON 的功能
 * 使用责任链模式处理修复策略
 */

/**
 * 输入验证模块
 */
class InputValidator {
  /**
   * 验证输入文本
   * @param {*} text - 输入文本
   * @throws {Error} 当输入无效时抛出错误
   */
  static validate(text) {
    if (!text || typeof text !== 'string') {
      console.error('[extractJSON] Invalid input:', text);
      throw new Error('Invalid input: text is required');
    }
  }
}

/**
 * Markdown 清理模块
 */
class MarkdownCleaner {
  /**
   * 移除 markdown 代码块标记
   * @param {string} text - 原始文本
   * @returns {string} 清理后的文本
   */
  static cleanCodeBlocks(text) {
    return text.replace(/```json\s*|```\s*/gi, "").trim();
  }
}

/**
 * JSON 边界查找模块
 */
class JSONBoundaryFinder {
  /**
   * 查找 JSON 起始位置
   * @param {string} text - 文本
   * @returns {number} JSON 起始索引
   * @throws {Error} 当找不到 JSON 起始位置时抛出错误
   */
  static findStart(text) {
    const firstBrace = text.indexOf('{');
    const firstBracket = text.indexOf('[');
    
    let jsonStartIdx = -1;
    if (firstBrace !== -1 && firstBracket !== -1) {
      jsonStartIdx = Math.min(firstBrace, firstBracket);
    } else if (firstBrace !== -1) {
      jsonStartIdx = firstBrace;
    } else if (firstBracket !== -1) {
      jsonStartIdx = firstBracket;
    }
    
    if (jsonStartIdx === -1) {
      console.error('[extractJSON] No JSON object found in:', text.substring(0, 500));
      throw new Error('No valid JSON object found in response');
    }
    
    return jsonStartIdx;
  }

  /**
   * 查找匹配的结束括号位置
   * @param {string} text - 文本
   * @param {number} startIdx - 起始位置
   * @param {string} startChar - 起始字符（'{' 或 '['）
   * @returns {number} 结束位置，如果找不到则返回 -1
   */
  static findMatchingEndBracket(text, startIdx, startChar) {
    const endChar = startChar === '{' ? '}' : ']';
    let count = 0;
    let inString = false;
    let escaped = false;
    
    for (let i = startIdx; i < text.length; i++) {
      const char = text[i];
      
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
        if (char === startChar) {
          count++;
        } else if (char === endChar) {
          count--;
          if (count === 0) {
            return i;
          }
        }
      }
    }
    
    return -1;
  }

  /**
   * 查找 JSON 结束位置
   * @param {string} text - 文本
   * @param {string} startChar - 起始字符
   * @returns {number} JSON 结束索引
   * @throws {Error} 当找不到 JSON 结束位置时抛出错误
   */
  static findEnd(text, startChar) {
    const endIdx = this.findMatchingEndBracket(text, 0, startChar);
    
    if (endIdx !== -1) {
      return endIdx;
    }
    
    // 激进恢复：尝试找到最长的平衡 JSON 结构
    console.warn('[extractJSON] No matching closing brace found, attempting aggressive recovery...');
    
    const maxValidEnd = this._findLongestBalancedEnd(text);
    
    if (maxValidEnd !== -1) {
      return maxValidEnd;
    }
    
    // 如果仍然找不到，返回文本末尾（让后续的修复策略处理）
    // 这样可以处理未闭合的字符串等情况
    return text.length - 1;
  }

  /**
   * 查找最长的平衡 JSON 结构结束位置
   * @param {string} text - 文本
   * @returns {number} 结束位置，如果找不到则返回 -1
   * @private
   */
  static _findLongestBalancedEnd(text) {
    let maxValidEnd = -1;
    let braceCount = 0;
    let bracketCount = 0;
    let inString = false;
    let escaped = false;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
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
        if (char === '{') braceCount++;
        else if (char === '}') {
          braceCount--;
          if (braceCount === 0 && bracketCount === 0) {
            maxValidEnd = i;
          }
        }
        else if (char === '[') bracketCount++;
        else if (char === ']') {
          bracketCount--;
          if (braceCount === 0 && bracketCount === 0) {
            maxValidEnd = i;
          }
        }
      }
    }
    
    return maxValidEnd;
  }
}

/**
 * 基础修复策略类
 */
class BaseFixStrategy {
  /**
   * 执行修复
   * @param {string} _jsonStr - JSON 字符串
   * @returns {string} 修复后的字符串
   */
  // eslint-disable-next-line no-unused-vars
  fix(_jsonStr) {
    throw new Error('Subclasses must implement fix() method');
  }
}

/**
 * 移除零宽字符和 BOM
 */
class RemoveZeroWidthCharsStrategy extends BaseFixStrategy {
  fix(jsonStr) {
    return jsonStr.replace(/[\u200B-\u200D\uFEFF]/g, '');
  }
}

/**
 * 转义字符串内的特殊字符
 */
class EscapeSpecialCharsStrategy extends BaseFixStrategy {
  fix(jsonStr) {
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
}

/**
 * 修复单引号
 */
class FixSingleQuotesStrategy extends BaseFixStrategy {
  fix(jsonStr) {
    return jsonStr
      .replace(/(['"])(\w+)\1\s*:/g, '"$2":')
      .replace(/:\s*'([^']*)'/g, ':"$1"');
  }
}

/**
 * 修复中文引号
 */
class FixChineseQuotesStrategy extends BaseFixStrategy {
  fix(jsonStr) {
    return jsonStr.replace(/[\u201C\u201D]/g, '"');
  }
}

/**
 * 修复字符串内部未转义的引号
 * 处理 LLM 返回的 JSON 中，字符串值包含未转义的引号的情况
 */
class FixUnescapedQuotesInStringsStrategy extends BaseFixStrategy {
  fix(jsonStr) {
    let result = '';
    let inString = false;
    let escaped = false;
    let stringStartChar = '';
    
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
        if (!inString) {
          // 字符串开始
          inString = true;
          stringStartChar = char;
          result += char;
        } else {
          // 检查下一个非空白字符来判断这是字符串结束还是内部引号
          let nextNonSpace = '';
          for (let j = i + 1; j < jsonStr.length; j++) {
            if (!/[\s\n\r]/.test(jsonStr[j])) {
              nextNonSpace = jsonStr[j];
              break;
            }
          }
          
          // 如果下一个非空白字符是 : , } ] 之一，说明这是字符串结束
          if (nextNonSpace === ':' || nextNonSpace === ',' || nextNonSpace === '}' || nextNonSpace === ']') {
            inString = false;
            result += char;
          } else {
            // 这是字符串内部的引号，需要转义
            result += '\\"';
          }
        }
        continue;
      }
      
      result += char;
    }
    
    return result;
  }
}

/**
 * 修复尾部逗号
 */
class FixTrailingCommasStrategy extends BaseFixStrategy {
  fix(jsonStr) {
    return jsonStr.replace(/,\s*([}\]])/g, '$1');
  }
}

/**
 * 修复缺少逗号
 */
class FixMissingCommasStrategy extends BaseFixStrategy {
  fix(jsonStr) {
    return jsonStr.replace(/("[^"]*")\s*(?=")/g, '$1,');
  }
}

/**
 * 修复未闭合的字符串
 */
class FixUnclosedStringsStrategy extends BaseFixStrategy {
  fix(jsonStr) {
    const quoteMatches = jsonStr.match(/"/g);
    if (quoteMatches && quoteMatches.length % 2 !== 0) {
      return jsonStr + '"';
    }
    return jsonStr;
  }
}

/**
 * 修复缺少值的属性
 */
class FixMissingValuesStrategy extends BaseFixStrategy {
  fix(jsonStr) {
    return jsonStr
      .replace(/"(\w+)":\s*,/g, '"$1": null,')
      .replace(/"(\w+)":\s*([}\]])/g, '"$1": null $2');
  }
}

/**
 * 修复数组结尾
 */
class FixArrayEndingsStrategy extends BaseFixStrategy {
  fix(jsonStr) {
    if (jsonStr.includes('"sections":') && 
        !jsonStr.includes('"sections": []') && 
        !jsonStr.includes('"sections":[')) {
      jsonStr = jsonStr.replace(/(,"tip":)/, ']$1');
      jsonStr = jsonStr.replace(/(,"tags":)/, ']$1');
    }
    return jsonStr;
  }
}

/**
 * 修复未闭合的对象和数组
 */
class FixUnclosedBracketsStrategy extends BaseFixStrategy {
  fix(jsonStr) {
    // 计算括号数量
    let braceCount = 0;
    let bracketCount = 0;
    let inString = false;
    let escaped = false;
    
    for (let i = 0; i < jsonStr.length; i++) {
      const char = jsonStr[i];
      
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
        if (char === '{') braceCount++;
        else if (char === '}') braceCount--;
        else if (char === '[') bracketCount++;
        else if (char === ']') bracketCount--;
      }
    }
    
    // 添加缺少的闭合括号
    let result = jsonStr;
    while (braceCount > 0) {
      result += '}';
      braceCount--;
    }
    while (bracketCount > 0) {
      result += ']';
      bracketCount--;
    }
    
    return result;
  }
}

/**
 * 业务特定修复：sections 数组
 */
class FixSectionsArrayStrategy extends BaseFixStrategy {
  fix(jsonStr) {
    if (!/"sections[^":]+",/.test(jsonStr)) {
      return jsonStr;
    }

    // 首先处理 "sections内容", 后面直接跟属性的情况
    let result = jsonStr.replace(/"sections([^",]+)",\s*/g, '"sections": [{"heading": "$1"}, ');
    
    // 尝试修复后续的内容
    const sectionsMatch = result.match(/"sections":\s*\[/);
    if (!sectionsMatch) {
      return result;
    }

    const sectionsStart = result.indexOf(sectionsMatch[0]) + sectionsMatch[0].length;
    let sectionsPart = result.substring(sectionsStart);
    
    // 查找 sections 数组应该结束的位置（在 "tip" 或 "tags" 或其他属性之前）
    const endMatch = sectionsPart.match(/,\s*"[^"]+":/);
    if (!endMatch) {
      return result;
    }

    const sectionsEnd = sectionsPart.indexOf(endMatch[0]);
    let sectionsContent = sectionsPart.substring(0, sectionsEnd);
    
    // 提取所有 heading 和 text
    const headingMatches = [...sectionsContent.matchAll(/"heading"\s*:\s*"([^"]+)"/g)];
    const textMatches = [...sectionsContent.matchAll(/"text"\s*:\s*"([^"]+)"/g)];
    
    // 匹配 heading 和 text
    const items = [];
    for (let i = 0; i < Math.max(headingMatches.length, textMatches.length); i++) {
      const item = {};
      if (headingMatches[i]) item.heading = headingMatches[i][1];
      if (textMatches[i]) item.text = textMatches[i][1];
      if (Object.keys(item).length > 0) {
        items.push(item);
      }
    }
    
    // 重建 sections 数组
    if (items.length > 0) {
      const newSections = JSON.stringify(items);
      result = result.substring(0, sectionsStart) + 
               newSections.substring(1, newSections.length - 1) + 
               ']' + 
               sectionsPart.substring(sectionsEnd);
    } else {
      // 如果没有提取到内容，确保 sections 数组正确闭合
      result = result.substring(0, sectionsStart) + ']' + sectionsPart;
    }
    
    return result;
  }
}

/**
 * 修复策略链
 */
class FixStrategyChain {
  constructor() {
    this.strategies = [];
  }

  /**
   * 添加修复策略
   * @param {BaseFixStrategy} strategy - 修复策略
   */
  addStrategy(strategy) {
    this.strategies.push(strategy);
  }

  /**
   * 执行所有修复策略
   * @param {string} jsonStr - JSON 字符串
   * @returns {string} 修复后的字符串
   */
  execute(jsonStr) {
    return this.strategies.reduce((result, strategy) => {
      return strategy.fix(result);
    }, jsonStr);
  }
}

/**
 * 基础解析策略类
 */
class BaseParseStrategy {
  /**
   * 尝试解析 JSON
   * @param {string} _jsonStr - JSON 字符串
   * @returns {Object|null} 解析结果，失败返回 null
   */
  // eslint-disable-next-line no-unused-vars
  parse(_jsonStr) {
    throw new Error('Subclasses must implement parse() method');
  }
}

/**
 * 标准 JSON 解析
 */
class StandardJSONParseStrategy extends BaseParseStrategy {
  parse(jsonStr) {
    return JSON.parse(jsonStr);
  }
}

/**
 * 激进清理后解析
 */
class AggressiveCleanupParseStrategy extends BaseParseStrategy {
  parse(jsonStr) {
    // eslint-disable-next-line no-control-regex
    const cleaned = jsonStr.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    return JSON.parse(cleaned);
  }
}

/**
 * 正则提取后解析
 */
class RegexExtractionParseStrategy extends BaseParseStrategy {
  parse(jsonStr) {
    const objectMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (!objectMatch) {
      throw new Error('No JSON object found');
    }

    const extracted = objectMatch[0];
    const balancedJSON = this._balanceBrackets(extracted);
    const fixedJSON = this._fixCommonIssues(balancedJSON);
    return JSON.parse(fixedJSON);
  }

  _balanceBrackets(text) {
    let braceCount = 0;
    let inString = false;
    let escaped = false;
    let lastValidEnd = -1;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
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
      return text.substring(0, lastValidEnd + 1);
    }
    
    throw new Error('Cannot balance brackets');
  }

  _fixCommonIssues(jsonStr) {
    let fixed = jsonStr;
    
    // 修复不完整的对象
    fixed = fixed.replace(/\{\s*"heading"\s*:\s*"([^"]*)"\s*\}/g, '{"heading":"$1","text":""}');
    fixed = fixed.replace(/\}\s*,\s*\{/g, '},{');
    
    // 修复数组结尾
    if (fixed.includes('"sections":[') && !fixed.includes('"tip":')) {
      fixed = fixed.replace(/(\])\s*$/, '$1,"tip":"","tags":[]');
    }
    
    return fixed;
  }
}

/**
 * Function 构造器解析
 */
class FunctionConstructorParseStrategy extends BaseParseStrategy {
  parse(jsonStr) {
    const result = new Function('return ' + jsonStr)();
    if (result && typeof result === 'object') {
      return result;
    }
    throw new Error('Function constructor returned invalid result');
  }
}

/**
 * 解析策略链
 */
class ParseStrategyChain {
  constructor() {
    this.strategies = [];
  }

  /**
   * 添加解析策略
   * @param {BaseParseStrategy} strategy - 解析策略
   */
  addStrategy(strategy) {
    this.strategies.push(strategy);
  }

  /**
   * 尝试使用所有解析策略解析 JSON
   * @param {string} jsonStr - JSON 字符串
   * @param {string} originalText - 原始文本（用于错误日志）
   * @returns {Object} 解析结果
   * @throws {Error} 当所有策略都失败时抛出错误
   */
  execute(jsonStr, originalText) {
    for (const strategy of this.strategies) {
      try {
        return strategy.parse(jsonStr);
      } catch {
        // 继续尝试下一个策略
        continue;
      }
    }

    console.error("[JSON Parse Error] Raw text:", originalText);
    console.error("[JSON Parse Error] Cleaned text:", jsonStr);
    throw new Error('Failed to parse JSON after all attempts');
  }
}

/**
 * JSON 提取器主类
 */
export class JSONExtractor {
  constructor(options = {}) {
    this.options = {
      includeBusinessFixes: true,
      ...options
    };
    
    this.fixChain = this._createFixChain();
    this.parseChain = this._createParseChain();
  }

  /**
   * 创建修复策略链
   * @returns {FixStrategyChain} 修复策略链
   * @private
   */
  _createFixChain() {
    const chain = new FixStrategyChain();
    
    // 通用修复策略
    chain.addStrategy(new RemoveZeroWidthCharsStrategy());
    chain.addStrategy(new EscapeSpecialCharsStrategy());
    chain.addStrategy(new FixSingleQuotesStrategy());
    chain.addStrategy(new FixChineseQuotesStrategy());
    chain.addStrategy(new FixUnescapedQuotesInStringsStrategy());
    chain.addStrategy(new FixTrailingCommasStrategy());
    chain.addStrategy(new FixMissingCommasStrategy());
    chain.addStrategy(new FixUnclosedStringsStrategy());
    chain.addStrategy(new FixMissingValuesStrategy());
    chain.addStrategy(new FixArrayEndingsStrategy());
    chain.addStrategy(new FixUnclosedBracketsStrategy());
    
    // 业务特定修复策略
    if (this.options.includeBusinessFixes) {
      chain.addStrategy(new FixSectionsArrayStrategy());
    }
    
    return chain;
  }

  /**
   * 创建解析策略链
   * @returns {ParseStrategyChain} 解析策略链
   * @private
   */
  _createParseChain() {
    const chain = new ParseStrategyChain();
    
    chain.addStrategy(new StandardJSONParseStrategy());
    chain.addStrategy(new AggressiveCleanupParseStrategy());
    chain.addStrategy(new RegexExtractionParseStrategy());
    chain.addStrategy(new FunctionConstructorParseStrategy());
    
    return chain;
  }

  /**
   * 从文本中提取 JSON
   * @param {string} text - 原始文本
   * @returns {Object} 解析后的 JSON 对象
   */
  extract(text) {
    // 保存原始文本用于错误日志
    const originalText = text;
    
    // 1. 验证输入
    InputValidator.validate(text);
    
    // 2. 清理 Markdown
    let cleaned = MarkdownCleaner.cleanCodeBlocks(text);
    
    // 3. 查找 JSON 起始位置
    const jsonStartIdx = JSONBoundaryFinder.findStart(cleaned);
    cleaned = cleaned.substring(jsonStartIdx).trim();
    
    // 4. 查找 JSON 结束位置
    const startChar = cleaned[0];
    const jsonEndIdx = JSONBoundaryFinder.findEnd(cleaned, startChar);
    cleaned = cleaned.substring(0, jsonEndIdx + 1);
    
    // 5. 应用修复策略
    cleaned = this.fixChain.execute(cleaned);
    
    // 6. 尝试解析
    return this.parseChain.execute(cleaned, originalText);
  }
}

/**
 * 从 LLM 响应中提取 JSON（兼容原有接口）
 * @param {string} text - LLM 响应文本
 * @returns {Object} 解析后的 JSON
 */
export function extractJSON(text) {
  const extractor = new JSONExtractor();
  return extractor.extract(text);
}

// 导出所有类和函数以便测试
export {
  InputValidator,
  MarkdownCleaner,
  JSONBoundaryFinder,
  BaseFixStrategy,
  RemoveZeroWidthCharsStrategy,
  EscapeSpecialCharsStrategy,
  FixSingleQuotesStrategy,
  FixChineseQuotesStrategy,
  FixUnescapedQuotesInStringsStrategy,
  FixTrailingCommasStrategy,
  FixMissingCommasStrategy,
  FixUnclosedStringsStrategy,
  FixMissingValuesStrategy,
  FixArrayEndingsStrategy,
  FixUnclosedBracketsStrategy,
  FixSectionsArrayStrategy,
  FixStrategyChain,
  BaseParseStrategy,
  StandardJSONParseStrategy,
  AggressiveCleanupParseStrategy,
  RegexExtractionParseStrategy,
  FunctionConstructorParseStrategy,
  ParseStrategyChain
};
