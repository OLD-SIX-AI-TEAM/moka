import { useState, useCallback, useEffect } from 'react';
import { createLLMClient, extractJSON, getEnvLLMConfig, isEnvConfigValid } from '../services/llm';

// 环境判断：本地开发使用流式，部署端使用非流式
const USE_STREAM_MODE = process.env.NODE_ENV === 'development';

import { ReferenceImageUploader } from './ReferenceImageUploader';
import { VersionHistory } from './VersionHistory';
import { Dots } from './common/Icons';
import { MAX_TOKENS } from '../constants';
import './AIDesignGenerator.css';

// 尝试从流式内容中解析部分JSON
function tryParsePartialJSON(text) {
  try {
    // 尝试找到JSON对象
    const startIdx = text.indexOf('{');
    
    if (startIdx === -1) return null;
    
    // 智能查找 JSON 结束位置：找到与起始 { 匹配的 }
    let braceCount = 0;
    let inString = false;
    let escaped = false;
    let endIdx = -1;
    
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
        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIdx = i;
            break;
          }
        }
      }
    }
    
    // 尝试解析完整的JSON
    let jsonText = text.substring(startIdx, endIdx !== -1 ? endIdx + 1 : undefined);
    
    // 如果JSON不完整，尝试补全
    if (endIdx === -1) {
      // 计算未闭合的括号
      let openBraces = 0;
      let openBrackets = 0;
      let inString = false;
      let escaped = false;
      
      for (let i = 0; i < jsonText.length; i++) {
        const char = jsonText[i];
        
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
          if (char === '{') openBraces++;
          else if (char === '}') openBraces--;
          else if (char === '[') openBrackets++;
          else if (char === ']') openBrackets--;
        }
      }
      
      // 补全未闭合的括号
      while (openBrackets > 0) {
        jsonText += ']';
        openBrackets--;
      }
      while (openBraces > 0) {
        jsonText += '}';
        openBraces--;
      }
    }
    
    // 清理尾部逗号
    jsonText = jsonText.replace(/,\s*([}\]])/g, '$1');
    
    return JSON.parse(jsonText);
  } catch (e) {
    return null;
  }
}

// AI设计系统提示词
const AI_DESIGN_PROMPT = `你是专业的小红书视觉设计师和排版专家。

你的任务是根据用户提供的文案内容，生成一个完整的视觉设计方案。

【输出要求】
1. 必须返回有效的JSON格式
2. 所有字符串值必须用双引号包裹
3. 属性之间必须有逗号分隔
4. 最后一个属性后面不能有逗号
5. 不要包含任何注释或markdown标记

【输出格式示例】
{
  "styleConfig": {
    "container": {
      "background": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "padding": "28px",
      "borderRadius": "12px"
    },
    "header": {
      "emoji": "✨",
      "category": "生活",
      "title": {
        "fontSize": "24px",
        "fontWeight": "700",
        "color": "#1a1a1a",
        "marginBottom": "12px"
      }
    },
    "lead": {
      "fontSize": "14px",
      "color": "#666666",
      "fontStyle": "normal",
      "marginBottom": "20px"
    },
    "sections": [
      {
        "heading": {
          "fontSize": "16px",
          "color": "#333333",
          "fontWeight": "600",
          "before": "🌟"
        },
        "text": {
          "fontSize": "14px",
          "color": "#555555",
          "lineHeight": "1.7"
        },
        "background": "#f8f9fa",
        "borderLeft": "4px solid #667eea",
        "marginBottom": "16px"
      }
    ],
    "tip": {
      "background": "#fff3cd",
      "color": "#856404",
      "fontSize": "13px",
      "padding": "12px 16px",
      "borderRadius": "8px"
    },
    "tags": {
      "background": "#e9ecef",
      "color": "#495057",
      "fontSize": "12px",
      "padding": "6px 12px",
      "borderRadius": "16px",
      "margin": "6px"
    },
    "decorations": [
      {
        "type": "circle",
        "position": "top-right",
        "style": {
          "width": "100px",
          "height": "100px",
          "background": "rgba(102, 126, 234, 0.1)"
        }
      }
    ]
  },
  "content": {
    "emoji": "✨",
    "category": "生活",
    "title": "标题内容",
    "lead": "导语内容",
    "sections": [
      {
        "heading": "小标题1",
        "text": "正文内容1"
      },
      {
        "heading": "小标题2",
        "text": "正文内容2"
      }
    ],
    "tip": "小贴士内容",
    "tags": ["标签1", "标签2", "标签3", "标签4", "标签5"]
  }
}

【设计要求】
1. 整体风格要符合小红书平台调性：精致、美观、有设计感
2. 配色要和谐，避免过于刺眼或沉闷的颜色
3. 排版要有层次感，标题、正文、标签区分明显
4. 可以添加适当的装饰元素（线条、形状、渐变等）
5. 字体大小要有层级关系

【重要限制】
- 标题最多36个字
- 导语最多50个字
- 小标题最多16个字
- 正文每段最多140个字
- 小贴士最多60个字
- 标签5个，每个最多10个字

【设计建议】
- 可以使用渐变色背景
- 可以添加几何图形装饰
- 配色建议：主色+辅助色+文字色的搭配
- 留白要充足，不要过于拥挤

【重要】只返回JSON，不要任何解释、注释或markdown标记。确保JSON格式完全正确。`;

// 带参考图的AI设计提示词
const AI_DESIGN_WITH_REFERENCE_PROMPT = `你是专业的小红书视觉设计师和排版专家。

用户上传了一张参考图，请分析这张图片的视觉风格，并生成一个类似风格的设计方案。

【输出要求】
1. 必须返回有效的JSON格式
2. 所有字符串值必须用双引号包裹
3. 属性之间必须有逗号分隔
4. 最后一个属性后面不能有逗号
5. 不要包含任何注释或markdown标记

【输出格式示例】
{
  "styleConfig": {
    "container": {
      "background": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "padding": "28px",
      "borderRadius": "12px"
    },
    "header": {
      "emoji": "✨",
      "category": "生活",
      "title": {
        "fontSize": "24px",
        "fontWeight": "700",
        "color": "#1a1a1a",
        "marginBottom": "12px"
      }
    },
    "lead": {
      "fontSize": "14px",
      "color": "#666666",
      "fontStyle": "normal",
      "marginBottom": "20px"
    },
    "sections": [
      {
        "heading": {
          "fontSize": "16px",
          "color": "#333333",
          "fontWeight": "600",
          "before": "🌟"
        },
        "text": {
          "fontSize": "14px",
          "color": "#555555",
          "lineHeight": "1.7"
        },
        "background": "#f8f9fa",
        "borderLeft": "4px solid #667eea",
        "marginBottom": "16px"
      }
    ],
    "tip": {
      "background": "#fff3cd",
      "color": "#856404",
      "fontSize": "13px",
      "padding": "12px 16px",
      "borderRadius": "8px"
    },
    "tags": {
      "background": "#e9ecef",
      "color": "#495057",
      "fontSize": "12px",
      "padding": "6px 12px",
      "borderRadius": "16px",
      "margin": "6px"
    },
    "decorations": [
      {
        "type": "circle",
        "position": "top-right",
        "style": {
          "width": "100px",
          "height": "100px",
          "background": "rgba(102, 126, 234, 0.1)"
        }
      }
    ]
  },
  "content": {
    "emoji": "✨",
    "category": "生活",
    "title": "标题内容",
    "lead": "导语内容",
    "sections": [
      {
        "heading": "小标题1",
        "text": "正文内容1"
      },
      {
        "heading": "小标题2",
        "text": "正文内容2"
      }
    ],
    "tip": "小贴士内容",
    "tags": ["标签1", "标签2", "标签3", "标签4", "标签5"]
  }
}

【风格分析要点】
1. 配色方案：提取主色调、辅助色、背景色
2. 排版风格：布局方式、对齐方式、留白处理
3. 字体风格：字号层级、字重、字体样式
4. 装饰元素：线条、形状、图案、纹理等
5. 整体氛围：简约/复古/现代/可爱/高级等

【设计要求】
1. 参考图片的风格特征，但不要完全复制
2. 根据文案内容调整设计细节
3. 保持小红书平台的精致感

【重要限制】
- 标题最多36个字
- 导语最多50个字
- 小标题最多16个字
- 正文每段最多140个字
- 小贴士最多60个字
- 标签5个，每个最多10个字

【重要】只返回JSON，不要任何解释、注释或markdown标记。确保JSON格式完全正确。`;

// 版本历史存储键
const VERSION_HISTORY_KEY = 'moka_ai_design_history';

export function AIDesignGenerator({ input, onDesignChange, onError, onLoadingChange, onStreamContent }) {
  const [referenceImage, setReferenceImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [versions, setVersions] = useState([]);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(-1);
  const [streamContent, setStreamContent] = useState('');

  // 加载历史版本
  useEffect(() => {
    try {
      const stored = localStorage.getItem(VERSION_HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setVersions(parsed);
        if (parsed.length > 0) {
          setCurrentVersionIndex(parsed.length - 1);
          onDesignChange?.(parsed[parsed.length - 1]);
        }
      }
    } catch (e) {
      console.warn('加载历史版本失败:', e);
    }
  }, [onDesignChange]);

  // 保存到历史版本（最多5条）
  const saveToHistory = useCallback((design) => {
    try {
      const newVersion = {
        ...design,
        timestamp: Date.now(),
        id: `v_${Date.now()}`
      };
      
      setVersions(prev => {
        const newVersions = [...prev, newVersion].slice(-5);
        localStorage.setItem(VERSION_HISTORY_KEY, JSON.stringify(newVersions));
        return newVersions;
      });
      
      setCurrentVersionIndex(prev => {
        const newIndex = prev + 1;
        return newIndex >= 5 ? 4 : newIndex;
      });
    } catch (e) {
      console.warn('保存历史版本失败:', e);
    }
  }, []);

  // 生成设计
  const generateDesign = useCallback(async () => {
    if (!input.trim()) return;
    
    const envConfigValid = isEnvConfigValid();
    if (!envConfigValid) {
      onError?.('请先配置LLM API');
      return;
    }

    setLoading(true);
    onLoadingChange?.(true);
    setStreamContent('');
    
    try {
      const llmConfig = getEnvLLMConfig();
      const client = createLLMClient({
        provider: llmConfig.provider,
        baseUrl: llmConfig.baseUrl || undefined,
        apiKey: llmConfig.apiKey,
        model: llmConfig.model || undefined,
      });

      let messages;
      
      if (referenceImage) {
        // 使用支持视觉的模型
        messages = [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: `请根据以下文案内容生成设计方案：\n\n${input}`
            },
            {
              type: 'image_url',
              image_url: {
                url: referenceImage
              }
            }
          ]
        }];
      } else {
        messages = [{
          role: 'user',
          content: `请根据以下文案内容生成设计方案：\n\n${input}`
        }];
      }

      let accumulatedContent = '';
      let response;
      let data;
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          if (USE_STREAM_MODE) {
            // 本地开发使用流式模式
            response = await client.chat({
              system: referenceImage ? AI_DESIGN_WITH_REFERENCE_PROMPT : AI_DESIGN_PROMPT,
              messages,
              maxTokens: MAX_TOKENS.aiDesign,
              stream: true,
              onStream: (delta, full) => {
                accumulatedContent = full;
                setStreamContent(full);
                onStreamContent?.(full);
                
                // 尝试解析部分JSON并实时更新预览
                const partialData = tryParsePartialJSON(full);
                if (partialData && partialData.styleConfig && partialData.content) {
                  onDesignChange?.(partialData);
                }
              },
            });
            data = extractJSON(response.content);
          } else {
            // 部署端使用非流式模式
            response = await client.chat({
              system: referenceImage ? AI_DESIGN_WITH_REFERENCE_PROMPT : AI_DESIGN_PROMPT,
              messages,
              maxTokens: MAX_TOKENS.aiDesign,
              stream: false,
            });
            data = extractJSON(response.content);
          }
          break;
        } catch (parseError) {
          if (retryCount < maxRetries) {
            console.warn(`[extractJSON] Parse failed, retrying (${retryCount + 1}/${maxRetries})...`);
            retryCount++;
          } else {
            throw parseError;
          }
        }
      }
      
      if (!data.styleConfig || !data.content) {
        throw new Error('AI返回的数据格式不正确');
      }

      onDesignChange?.(data);
      saveToHistory(data);
    } catch (err) {
      console.error('生成设计失败:', err);
      // 检查是否是密钥轮换错误
      if (err.code === 'KEY_ROTATION' || err.shouldReconfigure) {
        onError?.('API Key 已失效，请重新配置');
      } else {
        onError?.(`生成失败: ${err.message}`);
      }
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
      setStreamContent('');
    }
  }, [input, referenceImage, onError, onDesignChange, saveToHistory, onStreamContent]);

  // 切换到指定版本
  const switchVersion = useCallback((index) => {
    if (index >= 0 && index < versions.length) {
      setCurrentVersionIndex(index);
      onDesignChange?.(versions[index]);
    }
  }, [versions, onDesignChange]);

  return (
    <div className="ai-design-generator">
      {/* 参考图上传 */}
      <div className="ai-design-section">
        <div className="ai-design-section-title">
          🎨 AI设计模式
        </div>
        <ReferenceImageUploader
          image={referenceImage}
          onChange={setReferenceImage}
          onClear={() => setReferenceImage(null)}
        />
        <div className="ai-design-hint">
          {referenceImage 
            ? 'AI将参考上传图片的风格生成设计' 
            : '不上传图片则AI自由发挥，每次生成都是惊喜'}
        </div>
      </div>

      {/* 生成按钮 */}
      <button
        onClick={generateDesign}
        disabled={loading || !input.trim()}
        className="ai-design-generate-btn"
      >
        {loading ? (
          <span className="ai-design-loading">
            AI设计中 <Dots />
          </span>
        ) : (
          <>
            <span>✨</span>
            <span>{referenceImage ? '参考风格生成' : '自由发挥生成'}</span>
          </>
        )}
      </button>

      {/* 版本历史 */}
      {versions.length > 0 && (
        <VersionHistory
          versions={versions}
          currentIndex={currentVersionIndex}
          onSwitch={switchVersion}
        />
      )}
    </div>
  );
}

export default AIDesignGenerator;