import { useState, useCallback, useEffect } from 'react';
import { createLLMClient, extractJSON, getEnvLLMConfig, isEnvConfigValid } from '../services/llm';

// 环境判断：本地开发使用流式，部署端使用非流式
const USE_STREAM_MODE = import.meta.env.DEV;

import { ReferenceImageUploader } from './ReferenceImageUploader';
import { VersionHistory } from './VersionHistory';
import { Dots } from './common/Icons';
import { MAX_TOKENS } from '../constants';
import { AI_DESIGN_PROMPT, AI_DESIGN_WITH_REFERENCE_PROMPT } from '../prompts';
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
>>>>>>> 2f4011828c1d2929d89c5f846a804e5431dbab79
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