import { useState, useCallback, useEffect } from 'react';
import { ReferenceImageUploader } from './ReferenceImageUploader';
import { Dots } from './common/Icons';
import './AIDesignGenerator.css';

// AI设计系统提示词 - 单页模式
const AI_DESIGN_SINGLE_PROMPT = `你是专业的小红书视觉设计师和排版专家。

你的任务是根据用户提供的文案内容，生成一个完整的单页视觉设计方案。

【输出要求】
1. 必须返回有效的JSON格式
2. 所有字符串值必须用双引号包裹
3. 属性之间必须有逗号分隔
4. 最后一个属性后面不能有逗号
5. 不要包含任何注释或markdown标记

【输出格式】
{
  "styleConfig": {
    "container": {
      "background": "背景样式（CSS渐变或颜色）",
      "padding": "28px",
      "borderRadius": "12px",
      "boxShadow": "阴影（可选）"
    },
    "header": {
      "emoji": "emoji图标",
      "category": "分类标签（最多6字）",
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
          "before": "装饰前缀（如emoji或符号）"
        },
        "text": {
          "fontSize": "14px",
          "color": "#555555",
          "lineHeight": "1.7"
        },
        "background": "区块背景色（可选）",
        "borderLeft": "左边框样式（可选）",
        "marginBottom": "16px"
      }
    ],
    "tip": {
      "background": "背景色",
      "color": "文字色",
      "fontSize": "13px",
      "padding": "12px 16px",
      "borderRadius": "8px"
    },
    "tags": {
      "background": "标签背景色",
      "color": "标签文字色",
      "fontSize": "12px",
      "padding": "6px 12px",
      "borderRadius": "16px",
      "margin": "6px"
    },
    "decorations": [
      {
        "type": "装饰类型（circle/line/dots/gradient/shape）",
        "position": "位置（top-left/top-right/bottom-left/bottom-right/top-center/bottom-center/center）",
        "style": {
          "width": "100px",
          "height": "100px",
          "background": "rgba(102, 126, 234, 0.1)"
        }
      }
    ]
  },
  "content": {
    "emoji": "emoji",
    "category": "分类",
    "title": "标题（最多36字）",
    "lead": "导语（最多50字）",
    "sections": [
      {"heading": "小标题1（最多16字）", "text": "正文内容1（最多140字）"},
      {"heading": "小标题2（最多16字）", "text": "正文内容2（最多140字）"},
      {"heading": "小标题3（最多16字）", "text": "正文内容3（最多140字）"}
    ],
    "tip": "小贴士（最多60字）",
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
- sections数组包含3-5个元素

【重要】只返回JSON，不要任何解释、注释或markdown标记。确保JSON格式完全正确。`;

// AI设计系统提示词 - 分页模式
const AI_DESIGN_SPLIT_PROMPT = `你是专业的小红书视觉设计师和排版专家。

你的任务是根据用户提供的文案内容，生成一个完整的分页卡片视觉设计方案。

【输出要求】
1. 必须返回有效的JSON格式
2. 所有字符串值必须用双引号包裹
3. 属性之间必须有逗号分隔
4. 最后一个属性后面不能有逗号
5. 不要包含任何注释或markdown标记

【输出格式】
{
  "styleConfig": {
    "cover": {
      "container": {
        "background": "背景样式（CSS渐变或颜色）",
        "padding": "32px",
        "borderRadius": "16px"
      },
      "emoji": {
        "fontSize": "48px",
        "marginBottom": "16px"
      },
      "title": {
        "fontSize": "28px",
        "fontWeight": "700",
        "color": "#ffffff",
        "marginBottom": "12px"
      },
      "subtitle": {
        "fontSize": "14px",
        "color": "rgba(255,255,255,0.9)"
      }
    },
    "content": {
      "container": {
        "background": "#ffffff",
        "padding": "28px",
        "borderRadius": "16px"
      },
      "heading": {
        "fontSize": "20px",
        "fontWeight": "600",
        "color": "#1a1a1a",
        "marginBottom": "12px"
      },
      "text": {
        "fontSize": "15px",
        "color": "#333333",
        "lineHeight": "1.8",
        "marginBottom": "16px"
      },
      "extra": {
        "fontSize": "13px",
        "color": "#666666",
        "fontStyle": "italic"
      }
    },
    "end": {
      "container": {
        "background": "背景样式",
        "padding": "32px",
        "borderRadius": "16px"
      },
      "cta": {
        "fontSize": "22px",
        "fontWeight": "700",
        "color": "#1a1a1a",
        "marginBottom": "8px"
      },
      "sub": {
        "fontSize": "14px",
        "color": "#666666",
        "marginBottom": "20px"
      },
      "tags": {
        "background": "标签背景色",
        "color": "标签文字色",
        "fontSize": "12px",
        "padding": "6px 12px",
        "borderRadius": "16px",
        "margin": "4px"
      }
    },
    "decorations": [
      {
        "type": "装饰类型",
        "slide": "应用于哪一页（cover/content/end/all）",
        "style": {
          "width": "80px",
          "height": "80px",
          "background": "rgba(255,255,255,0.2)"
        }
      }
    ]
  },
  "content": {
    "slides": [
      {
        "type": "cover",
        "emoji": "🎉",
        "title": "封面标题（最多30字）",
        "subtitle": "副标题（最多50字）"
      },
      {
        "type": "content",
        "heading": "✨小标题1（最多16字）",
        "text": "正文内容1（最多100字）",
        "extra": "金句或补充（最多40字）"
      },
      {
        "type": "content",
        "heading": "✨小标题2（最多16字）",
        "text": "正文内容2（最多100字）",
        "extra": "金句或补充（最多40字）"
      },
      {
        "type": "content",
        "heading": "✨小标题3（最多16字）",
        "text": "正文内容3（最多100字）",
        "extra": "金句或补充（最多40字）"
      },
      {
        "type": "end",
        "cta": "互动语（最多30字）",
        "sub": "结尾（最多40字）",
        "tags": ["标签1", "标签2", "标签3", "标签4", "标签5"]
      }
    ]
  }
}

【设计要求】
1. 整体风格要符合小红书平台调性：精致、美观、有设计感
2. 配色要和谐，封面、内容页、结尾页风格统一但有层次
3. 封面要吸引人，使用醒目的配色
4. 内容页要清晰易读
5. 结尾页要有互动感

【重要限制】
- 封面标题最多30字，副标题最多50字
- 内容页heading最多16字（可带emoji），text最多100字，extra最多40字
- 结尾页cta最多30字，sub最多40字
- 标签5个
- slides数组包含4-5个元素（1个cover + 2-3个content + 1个end）

【重要】只返回JSON，不要任何解释、注释或markdown标记。确保JSON格式完全正确。`;

// 带参考图的AI设计提示词
const AI_DESIGN_WITH_REFERENCE_PROMPT = (mode) => `你是专业的小红书视觉设计师和排版专家。

用户上传了一张参考图，请分析这张图片的视觉风格，并生成一个类似风格的${mode === 'single' ? '单页' : '分页卡片'}设计方案。

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

${mode === 'single' ? AI_DESIGN_SINGLE_PROMPT.replace(/【设计要求】.*$/, '').replace(/【重要限制】.*$/, '') : AI_DESIGN_SPLIT_PROMPT.replace(/【设计要求】.*$/, '').replace(/【重要限制】.*$/, '')}

【重要】只返回JSON，不要任何解释、注释或markdown标记。确保JSON格式完全正确。`;

export { AI_DESIGN_SINGLE_PROMPT, AI_DESIGN_SPLIT_PROMPT, AI_DESIGN_WITH_REFERENCE_PROMPT };

// 版本历史存储键
const VERSION_HISTORY_KEY = 'moka_ai_design_history';

export function AIDesignControls({ 
  mode, 
  input, 
  referenceImage, 
  onReferenceImageChange,
  onGenerate,
  loading,
  versions,
  currentVersionIndex,
  onVersionSwitch
}) {
  return (
    <div className="ai-design-controls">
      {/* 参考图上传 */}
      <div className="ai-design-section">
        <div className="ai-design-section-title">
          🎨 AI设计模式
        </div>
        <ReferenceImageUploader
          image={referenceImage}
          onChange={onReferenceImageChange}
          onClear={() => onReferenceImageChange(null)}
        />
        <div className="ai-design-hint">
          {referenceImage 
            ? 'AI将参考上传图片的风格生成设计' 
            : '不上传图片则AI自由发挥，每次生成都是惊喜'}
        </div>
      </div>

      {/* 生成按钮 */}
      <button
        onClick={onGenerate}
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
        <div className="version-history">
          <div className="version-history-title">
            🕐 历史版本（最近5条）
          </div>
          <div className="version-list">
            {versions.map((version, index) => {
              const formatTime = (timestamp) => {
                const date = new Date(timestamp);
                return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
              };
              
              return (
                <button
                  key={version.id || index}
                  className={`version-item ${index === currentVersionIndex ? 'active' : ''}`}
                  onClick={() => onVersionSwitch(index)}
                >
                  <span className="version-number">
                    {index === currentVersionIndex ? '●' : '○'}
                  </span>
                  <span className="version-time">
                    {formatTime(version.timestamp)}
                  </span>
                  <span className="version-label">
                    {index === versions.length - 1 ? '最新' : `版本 ${index + 1}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default AIDesignControls;