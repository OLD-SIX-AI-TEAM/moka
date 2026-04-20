import { useState, useRef, useCallback, useEffect } from "react";

// 环境判断：本地开发使用流式，部署端使用非流式
const USE_STREAM_MODE = import.meta.env.DEV;
import { useHtml2Canvas, snapElement } from "./hooks/useHtml2Canvas";
import { snapElementToImage, saveImageInTauri, saveImagesBatchInTauri } from "./hooks/useHtmlToImage";
import { isTauriEnv } from "./utils/env.js";
import { useDragReorder } from "./hooks/useDragReorder";
import { useTheme } from "./hooks/useTheme";
import { useLanguage } from "./hooks/useLanguage";
import {
  Editorial, Notecard, Minimal, Stamp, BoldCard, Dark, Newspaper, Film, LabelCard,
  Creamy, Retro, Forest, Ins, Japanese, Korean, Pure, Pop, Artistic, Luxury,
  Business, Tech, Edu, Medical, Finance, Law, Food, Travel, Fashion, Mom
} from "./components/templates/single";
import {
  VividCover, VividContent, VividEnd, CleanCover, CleanContent, CleanEnd, DarkCover, DarkContent, DarkEnd,
  PaperCover, PaperContent, PaperEnd, EdCover, EdContent, EdEnd, GrCover, GrContent, GrEnd,
  CreamyCover, CreamyContent, CreamyEnd, RetroCover, RetroContent, RetroEnd,
  ForestCover, ForestContent, ForestEnd, InsCover, InsContent, InsEnd,
  JapaneseCover, JapaneseContent, JapaneseEnd, KoreanCover, KoreanContent, KoreanEnd,
  PureCover, PureContent, PureEnd, PopCover, PopContent, PopEnd,
  ArtisticCover, ArtisticContent, ArtisticEnd, LuxuryCover, LuxuryContent, LuxuryEnd,
  BusinessCover, BusinessContent, BusinessEnd, TechCover, TechContent, TechEnd,
  EduCover, EduContent, EduEnd, MedicalCover, MedicalContent, MedicalEnd,
  FinanceCover, FinanceContent, FinanceEnd, LawCover, LawContent, LawEnd,
  FoodCover, FoodContent, FoodEnd, TravelCover, TravelContent, TravelEnd,
  FashionCover, FashionContent, FashionEnd, MomCover, MomContent, MomEnd
} from "./components/templates/split";
import { createLLMClient, extractJSON, getEnvLLMConfig, isEnvConfigValid, saveLLMConfig, clearLLMConfig } from "./services/llm";
import { AIStyleRenderer } from "./components/AIStyleRenderer";
import { AISplitStyleRenderer } from "./components/AISplitStyleRenderer";
import { checkBannedWords, getBannedWordWarning } from "./utils/bannedWords";
import { LLMConfigModal } from "./components/common/LLMConfigModal";
import { TopBar } from "./components/layout/TopBar";
import { ThemePanel } from "./components/layout/ThemePanel";
import { PreviewArea } from "./components/layout/PreviewArea";
import { ContentPanel } from "./components/layout/ContentPanel";
import { SPLIT_STYLES, TEMPLATES, PALETTES, MAX_TOKENS, AI_DESIGN_TEMPLATE, AI_DESIGN_SPLIT_STYLE } from "./constants";
import { AI_DESIGN_PROMPT_SINGLE, AI_DESIGN_PROMPT_SPLIT } from "./prompts";
import { SYSTEM_PROMPTS } from "./prompts";
import "./App.css";

// 单页模板渲染器映射
const SINGLE_RENDERERS = {
  editorial: Editorial, notecard: Notecard, minimal: Minimal, stamp: Stamp,
  bold: BoldCard, dark: Dark, newspaper: Newspaper, film: Film, label: LabelCard,
  creamy: Creamy, retro: Retro, forest: Forest, ins: Ins,
  japanese: Japanese, korean: Korean, pure: Pure, pop: Pop,
  artistic: Artistic, luxury: Luxury, business: Business, tech: Tech,
  edu: Edu, medical: Medical, finance: Finance, law: Law,
  food: Food, travel: Travel, fashion: Fashion, mom: Mom,
};

// 分页模板渲染器映射
const SPLIT_RENDERERS = {
  vivid: { Cover: VividCover, Content: VividContent, End: VividEnd },
  clean: { Cover: CleanCover, Content: CleanContent, End: CleanEnd },
  dark: { Cover: DarkCover, Content: DarkContent, End: DarkEnd },
  paper: { Cover: PaperCover, Content: PaperContent, End: PaperEnd },
  editorial: { Cover: EdCover, Content: EdContent, End: EdEnd },
  gradient: { Cover: GrCover, Content: GrContent, End: GrEnd },
  creamy: { Cover: CreamyCover, Content: CreamyContent, End: CreamyEnd },
  retro: { Cover: RetroCover, Content: RetroContent, End: RetroEnd },
  forest: { Cover: ForestCover, Content: ForestContent, End: ForestEnd },
  ins: { Cover: InsCover, Content: InsContent, End: InsEnd },
  japanese: { Cover: JapaneseCover, Content: JapaneseContent, End: JapaneseEnd },
  korean: { Cover: KoreanCover, Content: KoreanContent, End: KoreanEnd },
  pure: { Cover: PureCover, Content: PureContent, End: PureEnd },
  pop: { Cover: PopCover, Content: PopContent, End: PopEnd },
  artistic: { Cover: ArtisticCover, Content: ArtisticContent, End: ArtisticEnd },
  luxury: { Cover: LuxuryCover, Content: LuxuryContent, End: LuxuryEnd },
  business: { Cover: BusinessCover, Content: BusinessContent, End: BusinessEnd },
  tech: { Cover: TechCover, Content: TechContent, End: TechEnd },
  edu: { Cover: EduCover, Content: EduContent, End: EduEnd },
  medical: { Cover: MedicalCover, Content: MedicalContent, End: MedicalEnd },
  finance: { Cover: FinanceCover, Content: FinanceContent, End: FinanceEnd },
  law: { Cover: LawCover, Content: LawContent, End: LawEnd },
  food: { Cover: FoodCover, Content: FoodContent, End: FoodEnd },
  travel: { Cover: TravelCover, Content: TravelContent, End: TravelEnd },
  fashion: { Cover: FashionCover, Content: FashionContent, End: FashionEnd },
  mom: { Cover: MomCover, Content: MomContent, End: MomEnd },
};

function App() {
  // 基础状态
  const [mode, setMode] = useState("split");
  const [platform, setPlatform] = useState("xhs");
  const [splitStyle, setSplitStyle] = useState("vivid");
  const [input, setInput] = useState("");
  const [tpl, setTpl] = useState("editorial");
  const [palId, setPalId] = useState("coral");
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState(null);
  const [slides, setSlides] = useState(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [expMsg, setExpMsg] = useState("");
  const [streamContent, setStreamContent] = useState("");

  // 移动端面板切换状态
  const [mobilePanel, setMobilePanel] = useState("content"); // 'style', 'preview', 'content'

  // AI设计状态
  const [aiReferenceImage, setAiReferenceImage] = useState(null);
  const [aiSingleDesign, setAiSingleDesign] = useState(null);
  const [aiSplitDesign, setAiSplitDesign] = useState(null);

  // LLM 配置
  const [showLLMConfig, setShowLLMConfig] = useState(false);
  const [llmConfig, setLlmConfig] = useState(getEnvLLMConfig());
  const envConfigValid = !!llmConfig.apiKey;

  // Refs
  const cardRef = useRef(null);
  const slideRefs = useRef([]);
  const contentPanelRef = useRef(null);

  // Hooks
  const h2cOk = useHtml2Canvas();
  const palette = PALETTES.find((p) => p.id === palId) || PALETTES[0];
  const { theme, isLight, toggleTheme } = useTheme();
  const { language, t } = useLanguage();

  // 移动端切换辅助函数
  const switchToMobilePreview = useCallback(() => {
    if (window.innerWidth <= 768) {
      setMobilePanel('preview');
    }
  }, []);

  // 当配色方案变化时，更新CSS变量使UI跟随变化
  useEffect(() => {
    const root = document.documentElement;
    const hex = palette.a;
    // 将hex转换为rgb
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    root.style.setProperty("--theme-primary", hex);
    root.style.setProperty("--theme-primary-light", `rgba(${r}, ${g}, ${b}, 0.1)`);
    root.style.setProperty("--theme-primary-hover", `rgba(${r}, ${g}, ${b}, 0.05)`);
  }, [palette]);

  // 更新函数
  const updateSingle = useCallback((field, val) => {
    setSingleData((prev) => ({ ...prev, [field]: val }));
  }, []);

  const updateSingleSecH = useCallback((i, val) => {
    setSingleData((prev) => ({
      ...prev,
      sections: prev.sections.map((s, j) => (j === i ? { ...s, heading: val } : s)),
    }));
  }, []);

  const updateSingleSecT = useCallback((i, val) => {
    setSingleData((prev) => ({
      ...prev,
      sections: prev.sections.map((s, j) => (j === i ? { ...s, text: val } : s)),
    }));
  }, []);

  const updateSingleTag = useCallback((i, val) => {
    setSingleData((prev) => {
      const t = [...prev.tags];
      t[i] = val;
      return { ...prev, tags: t };
    });
  }, []);

  const updateSlide = useCallback((idx, field, val) => {
    setSlides((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s)));
  }, []);

  const updateSlideTag = useCallback((sIdx, tIdx, val) => {
    setSlides((prev) =>
      prev.map((s, i) => {
        if (i !== sIdx) return s;
        const t = [...(s.tags || [])];
        t[tIdx] = val;
        return { ...s, tags: t };
      })
    );
  }, []);

  // 拖拽排序
  const sectionDrag = useDragReorder(
    singleData?.sections || [],
    (sections) => setSingleData((prev) => (prev ? { ...prev, sections } : prev))
  );

  const slideDrag = useDragReorder(slides || [], setSlides);

  // 编辑器对象
  const singleEd = singleData
    ? {
        title: (v) => updateSingle("title", v),
        lead: (v) => updateSingle("lead", v),
        tip: (v) => updateSingle("tip", v),
        secH: (i) => (v) => updateSingleSecH(i, v),
        secT: (i) => (v) => updateSingleSecT(i, v),
        tag: (i) => (v) => updateSingleTag(i, v),
      }
    : null;

  // 更新文字样式
  const updateSlideStyle = useCallback((idx, field, styleField, val) => {
    setSlides((prev) =>
      prev.map((s, i) => {
        if (i !== idx) return s;
        const styleKey = `${field}Style`;
        return {
          ...s,
          [styleKey]: {
            ...(s[styleKey] || {}),
            [styleField]: val,
          },
        };
      })
    );
  }, []);

  const makeSlideEd = (idx) => {
    const baseEditors = {
      title: (v) => updateSlide(idx, "title", v),
      subtitle: (v) => updateSlide(idx, "subtitle", v),
      heading: (v) => updateSlide(idx, "heading", v),
      text: (v) => updateSlide(idx, "text", v),
      extra: (v) => updateSlide(idx, "extra", v),
      cta: (v) => updateSlide(idx, "cta", v),
      sub: (v) => updateSlide(idx, "sub", v),
      tag: (tIdx) => (v) => updateSlideTag(idx, tIdx, v),
    };

    // 添加样式编辑器
    const fields = ['title', 'subtitle', 'heading', 'text', 'extra', 'cta', 'sub'];
    fields.forEach(field => {
      baseEditors[`${field}Style`] = slides[idx]?.[`${field}Style`] || {};
      baseEditors[`update${field.charAt(0).toUpperCase() + field.slice(1)}Style`] = (style) => {
        setSlides((prev) =>
          prev.map((s, i) => {
            if (i !== idx) return s;
            return { ...s, [`${field}Style`]: style };
          })
        );
      };
    });

    return baseEditors;
  };

  // AI设计编辑器函数
  const updateAiSingleContent = useCallback((field, val) => {
    setAiSingleDesign((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        content: { ...prev.content, [field]: val },
      };
    });
  }, []);

  const updateAiSingleSection = useCallback((index, field, val) => {
    setAiSingleDesign((prev) => {
      if (!prev) return prev;
      const newSections = [...prev.content.sections];
      newSections[index] = { ...newSections[index], [field]: val };
      return {
        ...prev,
        content: { ...prev.content, sections: newSections },
      };
    });
  }, []);

  const updateAiSingleTag = useCallback((index, val) => {
    setAiSingleDesign((prev) => {
      if (!prev) return prev;
      const newTags = [...prev.content.tags];
      newTags[index] = val;
      return {
        ...prev,
        content: { ...prev.content, tags: newTags },
      };
    });
  }, []);

  // AI单页样式更新函数
  const updateAiSingleStyle = useCallback((field, style) => {
    setAiSingleDesign((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: { ...(prev[field] || {}), ...style },
      };
    });
  }, []);

  const updateAiSingleSectionStyle = useCallback((index, field, style) => {
    setAiSingleDesign((prev) => {
      if (!prev) return prev;
      const newSections = [...(prev.content.sections || [])];
      if (!newSections[index]) return prev;
      newSections[index] = {
        ...newSections[index],
        [field]: { ...(newSections[index][field] || {}), ...style },
      };
      return {
        ...prev,
        content: { ...prev.content, sections: newSections },
      };
    });
  }, []);

  const updateAiSingleTagStyle = useCallback((index, style) => {
    setAiSingleDesign((prev) => {
      if (!prev) return prev;
      const newTags = [...(prev.content.tags || [])];
      if (newTags[index]) {
        newTags[index] = { ...(newTags[index] || {}), ...style };
      }
      return {
        ...prev,
        content: { ...prev.content, tags: newTags },
      };
    });
  }, []);

  const aiSingleEd = aiSingleDesign
    ? {
        title: (v) => updateAiSingleContent("title", v),
        lead: (v) => updateAiSingleContent("lead", v),
        tip: (v) => updateAiSingleContent("tip", v),
        secH: (i) => (v) => updateAiSingleSection(i, "heading", v),
        secT: (i) => (v) => updateAiSingleSection(i, "text", v),
        tag: (i) => (v) => updateAiSingleTag(i, v),
        updateTitleStyle: (style) => updateAiSingleStyle("titleStyle", style),
        updateLeadStyle: (style) => updateAiSingleStyle("leadStyle", style),
        updateTipStyle: (style) => updateAiSingleStyle("tipStyle", style),
        updateSecHStyle: (i) => (style) => updateAiSingleSectionStyle(i, "headingStyle", style),
        updateSecTStyle: (i) => (style) => updateAiSingleSectionStyle(i, "textStyle", style),
        updateTagStyle: (i) => (style) => updateAiSingleTagStyle(i, style),
      }
    : null;

  // AI单页版emoji编辑器
  const aiSingleEmojiEditor = aiSingleDesign
    ? {
        onEmojiChange: (val) => updateAiSingleContent("emoji", val),
        style: aiSingleDesign.content?.emojiStyle || { fontSize: '24px' },
        onStyleChange: (style) => {
          setAiSingleDesign((prev) => ({
            ...prev,
            content: { ...prev.content, emojiStyle: style },
          }));
        },
      }
    : null;

  // AI分页版设计更新函数
  const updateAiSplitSlide = useCallback((idx, field, val) => {
    if (!aiSplitDesign) return;
    setAiSplitDesign((prev) => ({
      ...prev,
      slides: prev.slides.map((s, i) => (i === idx ? { ...s, [field]: val } : s)),
    }));
    setSlides((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s)));
  }, [aiSplitDesign]);

  const updateAiSplitSlideTag = useCallback((sIdx, tIdx, val) => {
    if (!aiSplitDesign) return;
    setAiSplitDesign((prev) => ({
      ...prev,
      slides: prev.slides.map((s, i) => {
        if (i !== sIdx) return s;
        const tags = [...(s.tags || [])];
        tags[tIdx] = val;
        return { ...s, tags };
      }),
    }));
    setSlides((prev) =>
      prev.map((s, i) => {
        if (i !== sIdx) return s;
        const tags = [...(s.tags || [])];
        tags[tIdx] = val;
        return { ...s, tags };
      })
    );
  }, [aiSplitDesign]);

  const makeAiSplitSlideEd = (idx) => ({
    title: (v) => updateAiSplitSlide(idx, "title", v),
    subtitle: (v) => updateAiSplitSlide(idx, "subtitle", v),
    heading: (v) => updateAiSplitSlide(idx, "heading", v),
    text: (v) => updateAiSplitSlide(idx, "text", v),
    extra: (v) => updateAiSplitSlide(idx, "extra", v),
    cta: (v) => updateAiSplitSlide(idx, "cta", v),
    sub: (v) => updateAiSplitSlide(idx, "sub", v),
    tag: (tIdx) => (v) => updateAiSplitSlideTag(idx, tIdx, v),
  });

  // AI分页版emoji编辑器（只在封面页显示）
  const makeAiSplitEmojiEditor = (idx) => {
    if (!aiSplitDesign || !slides[idx]) return null;
    const slide = slides[idx];
    if (slide.type !== 'cover') return null;
    
    return {
      onEmojiChange: (val) => updateAiSplitSlide(idx, "emoji", val),
      style: slide.emojiStyle || { 
        fontSize: aiSplitDesign.styleConfig?.cover?.emoji?.fontSize || '48px',
        marginBottom: aiSplitDesign.styleConfig?.cover?.emoji?.marginBottom || '16px'
      },
      onStyleChange: (style) => {
        setAiSplitDesign((prev) => ({
          ...prev,
          slides: prev.slides.map((s, i) => 
            i === idx ? { ...s, emojiStyle: style } : s
          ),
        }));
        setSlides((prev) =>
          prev.map((s, i) => (i === idx ? { ...s, emojiStyle: style } : s))
        );
      },
    };
  };

  // 分页版emoji编辑器（非AI设计模式，只在封面页显示）
  const makeSplitEmojiEditor = (idx) => {
    if (!slides || !slides[idx]) return null;
    const slide = slides[idx];
    if (slide.type !== 'cover') return null;
    
    return {
      onEmojiChange: (val) => updateSlide(idx, "emoji", val),
      style: slide.emojiStyle || { fontSize: '24px' },
      onStyleChange: (style) => updateSlide(idx, "emojiStyle", style),
    };
  };

  // 处理LLM配置保存
  const handleLLMConfigSave = useCallback(async (config) => {
    try {
      console.log('[App] 开始保存 LLM 配置...');
      await saveLLMConfig(config);
      console.log('[App] LLM 配置保存成功');
      // 重新获取配置（包含加密状态）
      const updatedConfig = getEnvLLMConfig();
      setLlmConfig(updatedConfig);
      setShowLLMConfig(false);
    } catch (error) {
      console.error('[App] 保存 LLM 配置失败:', error);
      // 重新抛出错误让弹窗组件显示错误信息
      throw error;
    }
  }, []);

  // 处理LLM配置删除
  const handleLLMConfigDelete = useCallback(async () => {
    clearLLMConfig();
    // 重新获取配置（将使用环境变量配置）
    const updatedConfig = getEnvLLMConfig();
    setLlmConfig(updatedConfig);
  }, []);

  // 尝试从流式内容中解析部分JSON
  const tryParsePartialJSON = useCallback((text) => {
    try {
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
      
      let jsonText = text.substring(startIdx, endIdx !== -1 ? endIdx + 1 : undefined);
      
      // 如果JSON不完整，尝试补全
      if (endIdx === -1) {
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
        
        while (openBrackets > 0) {
          jsonText += ']';
          openBrackets--;
        }
        while (openBraces > 0) {
          jsonText += '}';
          openBraces--;
        }
      }
      
      jsonText = jsonText.replace(/,\s*([}\]])/g, '$1');
      
      return JSON.parse(jsonText);
    } catch (e) {
      return null;
    }
  }, []);

  // AI设计生成
  const generateAIDesign = useCallback(async (isSplitMode = false) => {
    if (!input.trim()) return;

    setLoading(true);
    setError("");
    setStreamContent("");
    switchToMobilePreview();

    try {
      const client = createLLMClient({
        provider: llmConfig.provider,
        baseUrl: llmConfig.baseUrl || undefined,
        encryptedApiKey: llmConfig.encryptedApiKey,
        model: llmConfig.model || undefined,
      });

      let messages;
      if (aiReferenceImage) {
        messages = [{
          role: 'user',
          content: [
            { type: 'text', text: `请根据以下文案内容生成设计方案：\n\n${input}` },
            { type: 'image_url', image_url: { url: aiReferenceImage } }
          ]
        }];
      } else {
        messages = [{ role: 'user', content: `请根据以下文案内容生成设计方案：\n\n${input}` }];
      }

      let response;
      let data;
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          if (USE_STREAM_MODE) {
            // 本地开发使用流式模式
            response = await client.chat({
              system: isSplitMode ? AI_DESIGN_PROMPT_SPLIT : AI_DESIGN_PROMPT_SINGLE,
              messages,
              maxTokens: MAX_TOKENS.single * 2,
              stream: true,
              onStream: (delta, full) => {
                setStreamContent(full);
                // 尝试解析部分JSON并实时更新预览
                const partialData = tryParsePartialJSON(full);
                if (partialData) {
                  if (isSplitMode) {
                    if (partialData.slides && partialData.styleConfig) {
                      setAiSplitDesign(partialData);
                      setSlides(partialData.slides);
                    }
                  } else {
                    if (partialData.styleConfig && partialData.content) {
                      setAiSingleDesign(partialData);
                    }
                  }
                }
              },
            });
            data = extractJSON(response.content);
          } else {
            // 部署端使用非流式模式
            response = await client.chat({
              system: isSplitMode ? AI_DESIGN_PROMPT_SPLIT : AI_DESIGN_PROMPT_SINGLE,
              messages,
              maxTokens: MAX_TOKENS.single * 2,
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

      // 违禁词检查
      const textToCheck = JSON.stringify(data);
      const bannedCheck = checkBannedWords(textToCheck);
      if (bannedCheck.hasBanned) {
        const warning = getBannedWordWarning(bannedCheck.found, language);
        setError(warning);
        setLoading(false);
        return;
      }

      if (isSplitMode) {
        if (!data.slides || !data.styleConfig) throw new Error('AI返回的数据格式不正确');
        if (data.slides.length === 0) throw new Error('AI生成的幻灯片为空');
        const contentSlides = data.slides.filter((s) => s.type === 'content');
        if (contentSlides.length === 0) throw new Error('AI生成的内容为空');
        setAiSplitDesign(data);
        setSlides(data.slides);
        slideRefs.current = new Array(data.slides.length).fill(null);
      } else {
        if (!data.styleConfig || !data.content) throw new Error('AI返回的数据格式不正确');
        if (!data.content.sections || data.content.sections.length === 0) throw new Error('AI生成的内容为空');
        setAiSingleDesign(data);
      }

      // 刷新使用次数
      contentPanelRef.current?.refreshUsage();
    } catch (err) {
      setError(`AI设计生成失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [input, aiReferenceImage, llmConfig, envConfigValid, tryParsePartialJSON, switchToMobilePreview]);

  // 生成内容
  const generate = useCallback(async () => {
    if (!input.trim()) return;

    // AI设计模式
    if (mode === 'single' && tpl === 'ai') {
      await generateAIDesign(false);
      return;
    }

    if (mode === 'split' && splitStyle === 'ai') {
      await generateAIDesign(true);
      return;
    }

    setLoading(true);
    setError("");
    setSingleData(null);
    setSlides(null);
    setSlideIdx(0);
    setStreamContent("");
    switchToMobilePreview();

    try {
      const client = createLLMClient({
        provider: llmConfig.provider,
        baseUrl: llmConfig.baseUrl || undefined,
        encryptedApiKey: llmConfig.encryptedApiKey,
        model: llmConfig.model || undefined,
      });

      // 根据语言选择prompt
      const isEnglish = language === 'en';

      if (mode === "single") {
        let response;
        let data;
        let retryCount = 0;
        const maxRetries = 2;
        const systemPrompt = isEnglish ? SYSTEM_PROMPTS.singleXHS_EN : SYSTEM_PROMPTS.singleXHS;
        
        while (retryCount <= maxRetries) {
          try {
            if (USE_STREAM_MODE) {
              // 本地开发使用流式模式
              response = await client.chat({
                system: systemPrompt,
                messages: [{ role: "user", content: input }],
                maxTokens: MAX_TOKENS.single,
                stream: true,
                onStream: (delta, full) => {
                  setStreamContent(full);
                  // 尝试解析部分JSON并实时更新预览
                  const partialData = tryParsePartialJSON(full);
                  if (partialData) {
                    setSingleData(partialData);
                  }
                },
              });
              data = extractJSON(response.content);
            } else {
              // 部署端使用非流式模式
              response = await client.chat({
                system: systemPrompt,
                messages: [{ role: "user", content: input }],
                maxTokens: MAX_TOKENS.single,
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
        
        // 违禁词检查
        const textToCheck = JSON.stringify(data);
        const bannedCheck = checkBannedWords(textToCheck);
        if (bannedCheck.hasBanned) {
          const warning = getBannedWordWarning(bannedCheck.found, language);
          setError(warning);
          setLoading(false);
          return;
        }
        
        setSingleData(data);
      } else {
        let systemPrompt;
        if (platform === "xhs") {
          systemPrompt = isEnglish ? SYSTEM_PROMPTS.splitXHS_EN : SYSTEM_PROMPTS.splitXHS;
        } else {
          systemPrompt = isEnglish ? SYSTEM_PROMPTS.splitWechat_EN : SYSTEM_PROMPTS.splitWechat;
        }
        let response;
        let data;
        let retryCount = 0;
        const maxRetries = 2;
        
        while (retryCount <= maxRetries) {
          try {
            if (USE_STREAM_MODE) {
              // 本地开发使用流式模式
              response = await client.chat({
                system: systemPrompt,
                messages: [{ role: "user", content: input }],
                maxTokens: MAX_TOKENS.split,
                stream: true,
                onStream: (delta, full) => {
                  setStreamContent(full);
                  // 尝试解析部分JSON并实时更新预览
                  const partialData = tryParsePartialJSON(full);
                  if (partialData && partialData.slides) {
                    setSlides(partialData.slides);
                    if (slideRefs.current.length !== partialData.slides.length) {
                      slideRefs.current = new Array(partialData.slides.length).fill(null);
                    }
                  }
                },
              });
              data = extractJSON(response.content);
            } else {
              // 部署端使用非流式模式
              response = await client.chat({
                system: systemPrompt,
                messages: [{ role: "user", content: input }],
                maxTokens: MAX_TOKENS.split,
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
        
        if (!data.slides) {
          throw new Error('AI返回的数据格式不正确，缺少 slides 字段');
        }
        
        // 违禁词检查
        const textToCheck = JSON.stringify(data);
        const bannedCheck = checkBannedWords(textToCheck);
        if (bannedCheck.hasBanned) {
          const warning = getBannedWordWarning(bannedCheck.found, language);
          setError(warning);
          setLoading(false);
          return;
        }
        
        setSlides(data.slides);
        slideRefs.current = new Array(data.slides.length).fill(null);
      }

      // 刷新使用次数
      contentPanelRef.current?.refreshUsage();
    } catch (err) {
      setError(`生成失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [input, mode, platform, tpl, splitStyle, llmConfig, envConfigValid, generateAIDesign, tryParsePartialJSON, language, switchToMobilePreview]);

  // 导出功能
  const exportSingle = useCallback(async (quality = "hd") => {
    if (!cardRef.current) return;

    setExporting(true);
    setExpMsg("渲染中…");

    try {
      const scale = quality === "ultra" ? 4 : 2;
      const name = (singleData?.title || "排版").replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "");

      let dataUrl;
      try {
        dataUrl = await snapElementToImage(cardRef.current, scale, "png");
      } catch (imgErr) {
        if (!window.html2canvas) throw new Error("html2canvas not loaded");
        const canvas = await snapElement(cardRef.current, scale);
        dataUrl = canvas.toDataURL("image/png", 1);
      }

      if (isTauriEnv()) {
        const savedPath = await saveImageInTauri(dataUrl, `${name}_${quality}.png`);
        if (savedPath) {
          setExpMsg("✓ 已保存");
        } else {
          setExpMsg("已取消");
        }
      } else {
        const link = document.createElement("a");
        link.download = `${name}_${quality}.png`;
        link.href = dataUrl;
        link.click();
        setExpMsg("✓ 已保存");
      }
      setTimeout(() => setExpMsg(""), 2000);
    } catch (err) {
      setExpMsg("导出失败");
      setTimeout(() => setExpMsg(""), 2000);
    } finally {
      setExporting(false);
    }
  }, [singleData]);

  const exportSlide = useCallback(async (idx, quality = "hd") => {
    const el = slideRefs.current[idx];
    if (!el) return;

    setExporting(true);
    setExpMsg("渲染中…");

    try {
      const scale = quality === "ultra" ? 4 : 2;
      let dataUrl;
      try {
        dataUrl = await snapElementToImage(el, scale, "png");
      } catch (imgErr) {
        if (!window.html2canvas) throw new Error("html2canvas not loaded");
        const canvas = await snapElement(el, scale);
        dataUrl = canvas.toDataURL("image/png", 1);
      }

      if (isTauriEnv()) {
        const savedPath = await saveImageInTauri(dataUrl, `slide_${idx + 1}_${quality}.png`);
        if (savedPath) {
          setExpMsg("✓ 已保存");
        } else {
          setExpMsg("已取消");
        }
      } else {
        const link = document.createElement("a");
        link.download = `slide_${idx + 1}_${quality}.png`;
        link.href = dataUrl;
        link.click();
        setExpMsg("✓ 已保存");
      }
      setTimeout(() => setExpMsg(""), 1500);
    } catch (err) {
      setExpMsg("导出失败");
      setTimeout(() => setExpMsg(""), 2000);
    } finally {
      setExporting(false);
    }
  }, []);

  const exportAll = useCallback(async () => {
    if (!slides) return;

    setExporting(true);
    const scale = 4;

    // Tauri 批量导出：并行渲染所有页面，再一次性保存
    if (isTauriEnv()) {
      setExpMsg(`渲染 ${slides.length} 张…`);

      const renderTasks = slides.map((_, i) => {
        const el = slideRefs.current[i];
        if (!el) return Promise.resolve(null);
        return snapElementToImage(el, scale, "png")
          .then(dataUrl => ({ dataUrl, filename: `slide_${i + 1}_ultra.png` }))
          .catch(err => {
            console.error(`第 ${i + 1} 页渲染失败:`, err);
            return null;
          });
      });

      const results = await Promise.all(renderTasks);
      const images = results.filter(Boolean);

      if (images.length > 0) {
        setExpMsg("选择保存位置…");
        try {
          const savedDir = await saveImagesBatchInTauri(images);
          if (savedDir) {
            setExpMsg(`✓ 已保存 ${images.length} 张`);
          } else {
            setExpMsg("已取消");
          }
        } catch (err) {
          console.error('批量保存失败:', err);
          setExpMsg("保存失败");
        }
      } else {
        setExpMsg("没有可导出的内容");
      }
      setTimeout(() => setExpMsg(""), 2500);
      setExporting(false);
      return;
    }

    // 浏览器环境：逐张下载
    for (let i = 0; i < slides.length; i++) {
      setExpMsg(`导出 ${i + 1}/${slides.length}…`);
      const el = slideRefs.current[i];
      if (!el) continue;
      try {
        let dataUrl;
        try {
          dataUrl = await snapElementToImage(el, scale, "png");
        } catch (imgErr) {
          if (!window.html2canvas) continue;
          const canvas = await snapElement(el, scale);
          dataUrl = canvas.toDataURL("image/png", 1);
        }

        const link = document.createElement("a");
        link.download = `slide_${i + 1}_ultra.png`;
        link.href = dataUrl;
        link.click();
        await new Promise((r) => setTimeout(r, 800));
      } catch (err) {
        console.error(`第 ${i + 1} 页导出失败:`, err);
      }
    }
    setExpMsg("✓ 全部完成");
    setTimeout(() => setExpMsg(""), 2500);
    setExporting(false);
  }, [slides]);

  // 渲染分页幻灯片
  const renderSlide = (s, i, total, ed) => {
    const a = palette.a;
    
    // AI设计模式
    if (splitStyle === 'ai' && aiSplitDesign) {
      return (
        <AISplitStyleRenderer
          key={i}
          slides={slides}
          styleConfig={aiSplitDesign.styleConfig}
          editors={slides.map((_, idx) => makeAiSplitSlideEd(idx))}
          slideIdx={i}
          emojiEditor={makeAiSplitEmojiEditor(i)}
        />
      );
    }
    
    const renderers = SPLIT_RENDERERS[splitStyle];
    if (!renderers) return null;

    const { Cover, Content, End } = renderers;
    const emojiEditor = makeSplitEmojiEditor(i);
    const props = { s, a, total, idx: i, ed };

    if (!s) return null;
    if (s.type === "cover") return <Cover {...props} emojiEditor={emojiEditor} key={i} />;
    if (s.type === "content") return <Content {...props} key={i} />;
    return <End {...props} emojiEditor={emojiEditor} key={i} />;
  };

  // 渲染
  const CardRenderer = SINGLE_RENDERERS[tpl];
  const cardData = singleData ? { ...singleData, ...palette } : null;
  const borderRadius = { notecard: 18, bold: 14, label: 12, film: 0, newspaper: 0 }[tpl] ?? 4;

  return (
    <div className="app">
      <TopBar mode={mode} setMode={setMode} theme={theme} toggleTheme={toggleTheme} isLight={isLight} loading={loading} exporting={exporting} t={t} />
      
      {/* 移动端标签栏 */}
      <div className="mobile-tabs">
        <button
          className={`mobile-tab ${mobilePanel === 'style' ? 'active' : ''}`}
          onClick={() => setMobilePanel('style')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
          </svg>
          {t('styleTab')}
        </button>
        <button
          className={`mobile-tab ${mobilePanel === 'preview' ? 'active' : ''}`}
          onClick={() => setMobilePanel('preview')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M3 9h18"/>
          </svg>
          {t('previewTab')}
        </button>
        <button
          className={`mobile-tab ${mobilePanel === 'content' ? 'active' : ''}`}
          onClick={() => setMobilePanel('content')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          {t('contentTab')}
        </button>
      </div>

      <div className="three-column-layout">
        {/* 第一列：风格和配色 */}
        <ThemePanel
          palId={palId}
          setPalId={setPalId}
          palettes={PALETTES}
          palette={palette}
          mode={mode}
          splitStyle={splitStyle}
          setSplitStyle={setSplitStyle}
          tpl={tpl}
          setTpl={setTpl}
          splitStyles={[...SPLIT_STYLES, AI_DESIGN_SPLIT_STYLE]}
          templates={[...TEMPLATES, AI_DESIGN_TEMPLATE]}
          mobileActive={mobilePanel === 'style'}
        />
        
        {/* 第二列：预览区域 */}
        <PreviewArea
          mode={mode}
          cardData={cardData}
          aiSingleDesign={aiSingleDesign}
          slides={slides}
          slideIdx={slideIdx}
          loading={loading}
          cardRef={cardRef}
          CardRenderer={CardRenderer}
          singleEd={singleEd}
          sectionDrag={sectionDrag}
          aiSingleEd={aiSingleEd}
          aiSingleEmojiEditor={aiSingleEmojiEditor}
          borderRadius={borderRadius}
          renderSlide={renderSlide}
          makeSlideEd={makeSlideEd}
          slideRefs={slideRefs}
          onSlideChange={setSlideIdx}
          exporting={exporting}
          expMsg={expMsg}
          h2cOk={h2cOk}
          onExportSingle={exportSingle}
          onExportSlide={exportSlide}
          onExportAll={exportAll}
          streamContent={streamContent}
          aiReferenceImage={aiReferenceImage}
          mobileActive={mobilePanel === 'preview'}
        />
        
        {/* 第三列：平台、文案和生成 */}
        <ContentPanel
          ref={contentPanelRef}
          mode={mode}
          setMode={setMode}
          platform={platform}
          setPlatform={setPlatform}
          input={input}
          setInput={setInput}
          loading={loading}
          error={error}
          onGenerate={generate}
          palette={palette}
          llmConfig={llmConfig}
          onOpenLLMConfig={() => setShowLLMConfig(true)}
          mobileActive={mobilePanel === 'content'}
        />
      </div>

      <LLMConfigModal
        isOpen={showLLMConfig}
        onClose={() => setShowLLMConfig(false)}
        onSave={handleLLMConfigSave}
        onDelete={handleLLMConfigDelete}
        initialConfig={llmConfig}
        hasConfig={llmConfig?.hasEncryptedKey}
      />
    </div>
  );
}

export default App;
