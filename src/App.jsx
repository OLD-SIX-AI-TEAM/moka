import { useState, useRef, useCallback } from "react";
import { useHtml2Canvas, snapElement } from "./hooks/useHtml2Canvas";
import { snapElementToImage } from "./hooks/useHtmlToImage";
import { useDragReorder } from "./hooks/useDragReorder";
import { Dots } from "./components/common/Icons";
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
import { createLLMClient, SYSTEM_PROMPTS, extractJSON, getEnvLLMConfig, isEnvConfigValid, saveLLMConfig } from "./services/llm";
import { LLMConfigModal } from "./components/common/LLMConfigModal";
import { ReferenceImageUploader } from "./components/ReferenceImageUploader";
import { AIStyleRenderer } from "./components/AIStyleRenderer";
import { AISplitStyleRenderer } from "./components/AISplitStyleRenderer";
import { SPLIT_STYLES, TEMPLATES, PALETTES, FONT_FAMILY, MAX_TOKENS, AI_DESIGN_TEMPLATE, AI_DESIGN_SPLIT_STYLE } from "./constants";
import { AI_DESIGN_PROMPT_SINGLE, AI_DESIGN_PROMPT_SPLIT } from "./prompts/aiDesignPrompt";
import "./App.css";

// 单页模板渲染器映射
const SINGLE_RENDERERS = {
  editorial: Editorial,
  notecard: Notecard,
  minimal: Minimal,
  stamp: Stamp,
  bold: BoldCard,
  dark: Dark,
  newspaper: Newspaper,
  film: Film,
  label: LabelCard,
  // 新增小红书热门风格
  creamy: Creamy,
  retro: Retro,
  forest: Forest,
  ins: Ins,
  japanese: Japanese,
  korean: Korean,
  pure: Pure,
  pop: Pop,
  artistic: Artistic,
  luxury: Luxury,
  // 新增微信公众号风格
  business: Business,
  tech: Tech,
  edu: Edu,
  medical: Medical,
  finance: Finance,
  law: Law,
  food: Food,
  travel: Travel,
  fashion: Fashion,
  mom: Mom,
};

// 分页模板渲染器映射
const SPLIT_RENDERERS = {
  vivid: { Cover: VividCover, Content: VividContent, End: VividEnd },
  clean: { Cover: CleanCover, Content: CleanContent, End: CleanEnd },
  dark: { Cover: DarkCover, Content: DarkContent, End: DarkEnd },
  paper: { Cover: PaperCover, Content: PaperContent, End: PaperEnd },
  editorial: { Cover: EdCover, Content: EdContent, End: EdEnd },
  gradient: { Cover: GrCover, Content: GrContent, End: GrEnd },
  // 新增分页风格 - 小红书热门风格
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
  // 新增分页风格 - 微信公众号风格
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
  const [mode, setMode] = useState("single");
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

  // AI设计状态
  const [aiReferenceImage, setAiReferenceImage] = useState(null);
  const [aiSingleDesign, setAiSingleDesign] = useState(null);
  const [aiSplitDesign, setAiSplitDesign] = useState(null);
  const [aiVersions, setAiVersions] = useState([]);
  const [aiCurrentVersionIndex, setAiCurrentVersionIndex] = useState(-1);

  // LLM 配置弹窗状态
  const [showLLMConfig, setShowLLMConfig] = useState(false);

  // LLM 配置从环境变量/localStorage获取
  const llmConfig = getEnvLLMConfig();
  const envConfigValid = isEnvConfigValid();

  // Refs
  const cardRef = useRef(null);
  const slideRefs = useRef([]);

  // Hooks
  const h2cOk = useHtml2Canvas();
  const palette = PALETTES.find((p) => p.id === palId) || PALETTES[0];

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

  const makeSlideEd = (idx) => ({
    title: (v) => updateSlide(idx, "title", v),
    subtitle: (v) => updateSlide(idx, "subtitle", v),
    heading: (v) => updateSlide(idx, "heading", v),
    text: (v) => updateSlide(idx, "text", v),
    extra: (v) => updateSlide(idx, "extra", v),
    cta: (v) => updateSlide(idx, "cta", v),
    sub: (v) => updateSlide(idx, "sub", v),
    tag: (ti) => (v) => updateSlideTag(idx, ti, v),
  });

  // AI设计编辑器函数
  const updateAiSingleContent = useCallback((field, val) => {
    setAiSingleDesign((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        content: {
          ...prev.content,
          [field]: val,
        },
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
        content: {
          ...prev.content,
          sections: newSections,
        },
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
        content: {
          ...prev.content,
          tags: newTags,
        },
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
      }
    : null;

  // AI分页版设计更新函数
  const updateAiSplitSlide = useCallback((idx, field, val) => {
    if (!aiSplitDesign) return;
    setAiSplitDesign(prev => ({
      ...prev,
      slides: prev.slides.map((s, i) => (i === idx ? { ...s, [field]: val } : s)),
    }));
    setSlides(prev => prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s)));
  }, [aiSplitDesign]);

  const updateAiSplitSlideTag = useCallback((sIdx, tIdx, val) => {
    if (!aiSplitDesign) return;
    setAiSplitDesign(prev => ({
      ...prev,
      slides: prev.slides.map((s, i) => {
        if (i !== sIdx) return s;
        const tags = [...(s.tags || [])];
        tags[tIdx] = val;
        return { ...s, tags };
      }),
    }));
    setSlides(prev => prev.map((s, i) => {
      if (i !== sIdx) return s;
      const tags = [...(s.tags || [])];
      tags[tIdx] = val;
      return { ...s, tags };
    }));
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

  // 处理LLM配置保存
  const handleLLMConfigSave = useCallback((config) => {
    saveLLMConfig(config);
    // 强制刷新页面以应用新配置
    window.location.reload();
  }, []);

  // AI设计生成
  const generateAIDesign = useCallback(async (isSplitMode = false) => {
    if (!input.trim()) return;
    if (!envConfigValid) {
      setShowLLMConfig(true);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const client = createLLMClient({
        provider: llmConfig.provider,
        baseUrl: llmConfig.baseUrl || undefined,
        apiKey: llmConfig.apiKey,
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

      const response = await client.chat({
        system: isSplitMode ? AI_DESIGN_PROMPT_SPLIT : AI_DESIGN_PROMPT_SINGLE,
        messages,
        maxTokens: MAX_TOKENS.single * 2,
      });

      const data = extractJSON(response.content);
      
      if (isSplitMode) {
        if (!data.slides || !data.styleConfig) {
          throw new Error('AI返回的数据格式不正确');
        }
        // 验证 slides 不为空且包含内容页
        if (data.slides.length === 0) {
          throw new Error('AI生成的幻灯片为空，请重试');
        }
        // 验证 content 类型的 slide 有实际内容
        const contentSlides = data.slides.filter(s => s.type === 'content');
        if (contentSlides.length === 0) {
          throw new Error('AI生成的内容为空，请重试');
        }
        // 验证每个 content slide 都有 heading 和 text
        const validContentSlides = contentSlides.filter(s => s.heading && s.text);
        if (validContentSlides.length === 0) {
          throw new Error('AI生成的内容格式不正确，请重试');
        }
        setAiSplitDesign(data);
        setSlides(data.slides);
        slideRefs.current = new Array(data.slides.length).fill(null);
      } else {
        if (!data.styleConfig || !data.content) {
          throw new Error('AI返回的数据格式不正确');
        }
        // 验证 sections 不为空
        if (!data.content.sections || data.content.sections.length === 0) {
          throw new Error('AI生成的内容为空，请重试');
        }
        // 验证每个 section 都有 heading 和 text
        const validSections = data.content.sections.filter(s => s.heading && s.text);
        if (validSections.length === 0) {
          throw new Error('AI生成的内容格式不正确，请重试');
        }
        setAiSingleDesign(data);
      }
      
      // 保存到版本历史
      const newVersion = { ...data, timestamp: Date.now(), id: `v_${Date.now()}`, isSplitMode };
      setAiVersions(prev => [...prev, newVersion].slice(-5));
      setAiCurrentVersionIndex(prev => Math.min(prev + 1, 4));
    } catch (err) {
      setError(`AI设计生成失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [input, aiReferenceImage, llmConfig, envConfigValid]);

  // 生成内容
  const generate = useCallback(async () => {
    if (!input.trim()) return;
    if (!envConfigValid) {
      setShowLLMConfig(true);
      return;
    }

    // 如果是AI设计模式（整页版）
    if (mode === 'single' && tpl === 'ai') {
      await generateAIDesign(false);
      return;
    }

    // 如果是AI设计模式（分页版）
    if (mode === 'split' && splitStyle === 'ai') {
      await generateAIDesign(true);
      return;
    }

    setLoading(true);
    setError("");
    setSingleData(null);
    setSlides(null);
    setSlideIdx(0);

    try {
      // 创建 LLM 客户端
      const client = createLLMClient({
        provider: llmConfig.provider,
        baseUrl: llmConfig.baseUrl || undefined,
        apiKey: llmConfig.apiKey,
        model: llmConfig.model || undefined,
      });

      if (mode === "single") {
        const response = await client.chat({
          system: SYSTEM_PROMPTS.singleXHS,
          messages: [{ role: "user", content: input }],
          maxTokens: MAX_TOKENS.single,
        });

        console.log("[LLM Response]", response);
        const data = extractJSON(response.content);
        setSingleData(data);
      } else {
        const systemPrompt = platform === "xhs" ? SYSTEM_PROMPTS.splitXHS : SYSTEM_PROMPTS.splitWechat;

        const response = await client.chat({
          system: systemPrompt,
          messages: [{ role: "user", content: input }],
          maxTokens: MAX_TOKENS.split,
        });

        const data = extractJSON(response.content);
        setSlides(data.slides);
        slideRefs.current = new Array(data.slides.length).fill(null);
      }
    } catch (err) {
      setError(`生成失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [input, mode, platform, tpl, splitStyle, llmConfig, envConfigValid, generateAIDesign]);

  // 导出功能 - 优先使用 html-to-image，失败时回退到 html2canvas
  const exportSingle = useCallback(
    async (quality = "hd") => {
      if (!cardRef.current) return;

      setExporting(true);
      setExpMsg("渲染中…");

      try {
        // 超清：4x 缩放，高清：2x 缩放
        const scale = quality === "ultra" ? 4 : 2;
        const name = (singleData?.title || "排版").replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "");

        let dataUrl;
        try {
          // 优先使用 html-to-image，渲染效果更好
          dataUrl = await snapElementToImage(cardRef.current, scale, "png");
        } catch (imgErr) {
          console.log("html-to-image 失败，回退到 html2canvas:", imgErr);
          // 回退到 html2canvas
          if (!window.html2canvas) throw new Error("html2canvas not loaded");
          const canvas = await snapElement(cardRef.current, scale);
          dataUrl = canvas.toDataURL("image/png", 1);
        }

        const link = document.createElement("a");
        link.download = `${name}_${quality}.png`;
        link.href = dataUrl;
        link.click();
        setExpMsg("✓ 已保存");
        setTimeout(() => setExpMsg(""), 2000);
      } catch (err) {
        console.error("导出失败:", err);
        setExpMsg("导出失败");
        setTimeout(() => setExpMsg(""), 2000);
      } finally {
        setExporting(false);
      }
    },
    [singleData]
  );

  const exportSlide = useCallback(
    async (idx, quality = "hd") => {
      const el = slideRefs.current[idx];
      if (!el) return;

      setExporting(true);
      setExpMsg("渲染中…");

      try {
        // 超清：4x 缩放，高清：2x 缩放
        const scale = quality === "ultra" ? 4 : 2;

        let dataUrl;
        try {
          // 优先使用 html-to-image
          dataUrl = await snapElementToImage(el, scale, "png");
        } catch (imgErr) {
          console.log("html-to-image 失败，回退到 html2canvas:", imgErr);
          if (!window.html2canvas) throw new Error("html2canvas not loaded");
          const canvas = await snapElement(el, scale);
          dataUrl = canvas.toDataURL("image/png", 1);
        }

        const link = document.createElement("a");
        link.download = `slide_${idx + 1}_${quality}.png`;
        link.href = dataUrl;
        link.click();
        setExpMsg("✓ 已保存");
        setTimeout(() => setExpMsg(""), 1500);
      } catch (err) {
        console.error("导出失败:", err);
        setExpMsg("导出失败");
        setTimeout(() => setExpMsg(""), 2000);
      } finally {
        setExporting(false);
      }
    },
    []
  );

  const exportAll = useCallback(
    async () => {
      if (!slides) return;

      setExporting(true);
      // 导出全部默认使用超清 4x 缩放
      const scale = 4;
      for (let i = 0; i < slides.length; i++) {
        setExpMsg(`导出 ${i + 1}/${slides.length}…`);
        const el = slideRefs.current[i];
        if (!el) {
          console.warn(`第 ${i + 1} 页元素未找到，跳过`);
          continue;
        }
        try {
          let dataUrl;
          try {
            // 优先使用 html-to-image
            dataUrl = await snapElementToImage(el, scale, "png");
          } catch (imgErr) {
            console.log(`第 ${i + 1} 页 html-to-image 失败，回退到 html2canvas:`, imgErr);
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
    },
    [slides]
  );

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
        />
      );
    }
    
    const renderers = SPLIT_RENDERERS[splitStyle];

    if (!renderers) return null;

    const { Cover, Content, End } = renderers;
    const props = { s, a, total, idx: i, ed };

    if (s.type === "cover") return <Cover {...props} key={i} />;
    if (s.type === "content") return <Content {...props} key={i} />;
    return <End {...props} key={i} />;
  };

  // 渲染
  const CardRenderer = SINGLE_RENDERERS[tpl];
  const cardData = singleData ? { ...singleData, ...palette } : null;
  const borderRadius = { notecard: 18, bold: 14, label: 12, film: 0, newspaper: 0 }[tpl] ?? 4;

  return (
    <div className="app" style={{ minHeight: "100vh", background: "#edeae6", padding: "28px 16px", fontFamily: FONT_FAMILY }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a1510", margin: "0 0 6px", letterSpacing: "-0.5px" }}>
            小红书排版生成器
          </h1>
          <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
            智能排版 · 一键生成 · <span style={{ color: palette.a, fontWeight: 600 }}>点击文字可直接编辑</span>
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", background: "#fff", borderRadius: 12, padding: 5, gap: 5, boxShadow: "0 2px 12px rgba(0,0,0,.08)" }}>
            {[
              { v: "single", label: "📄 整页版" },
              { v: "split", label: "📑 分页版" },
            ].map((m) => (
              <button
                key={m.v}
                onClick={() => {
                  setMode(m.v);
                  setSingleData(null);
                  setSlides(null);
                  setAiSingleDesign(null);
                  setAiSplitDesign(null);
                }}
                style={{
                  padding: "10px 28px",
                  borderRadius: 10,
                  border: "none",
                  background: mode === m.v ? palette.a : "transparent",
                  color: mode === m.v ? "#fff" : "#666",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all .2s ease",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 28, alignItems: "start" }}>
          {/* Left Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Input */}
            <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <span>✍️</span><span>文案 / 话题</span>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={"例如：推荐一款奶油肌底妆，\n遮瑕力强、持妆久、不闷痘…"}
                rows={5}
                style={{
                  width: "100%",
                  border: "1.5px solid #e8e8e8",
                  borderRadius: 10,
                  padding: "12px 14px",
                  fontSize: 14,
                  lineHeight: 1.7,
                  resize: "vertical",
                  color: "#333",
                  background: "#fafafa",
                  transition: "border-color .2s ease",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* 分页：平台 */}
            {mode === "split" && (
              <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <span>📱</span><span>发布平台</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { v: "xhs", icon: "📕", name: "小红书", desc: "情绪化 · 口语风" },
                    { v: "wechat", icon: "💬", name: "微信推文", desc: "专业 · 权威感" },
                  ].map((p) => (
                    <button
                      key={p.v}
                      onClick={() => setPlatform(p.v)}
                      style={{
                        padding: "14px 10px",
                        borderRadius: 12,
                        border: `2px solid ${platform === p.v ? palette.a : "#f0f0f0"}`,
                        background: platform === p.v ? palette.a + "08" : "#fafafa",
                        cursor: "pointer",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                        transition: "all .2s ease",
                      }}
                    >
                      <span style={{ fontSize: 24 }}>{p.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: platform === p.v ? palette.a : "#333" }}>{p.name}</span>
                      <span style={{ fontSize: 10, color: "#999" }}>{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 分页：卡片风格 */}
            {mode === "split" && (
              <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <span>🖼</span><span>卡片风格</span>
                </div>
                <div style={{ maxHeight: 220, overflowY: "auto", paddingRight: 4 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                    {[...SPLIT_STYLES, AI_DESIGN_SPLIT_STYLE].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => {
                          setSplitStyle(st.id);
                          if (st.id === 'ai') {
                            setAiSplitDesign(null);
                          }
                        }}
                        style={{
                          padding: "10px 6px",
                          borderRadius: 10,
                          border: `2px solid ${splitStyle === st.id ? palette.a : "#f0f0f0"}`,
                          background: splitStyle === st.id ? palette.a + "08" : "#fafafa",
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 3,
                          cursor: "pointer",
                          transition: "all .2s ease",
                        }}
                      >
                        <span style={{ fontSize: 20 }}>{st.icon}</span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: splitStyle === st.id ? 700 : 600,
                            color: splitStyle === st.id ? palette.a : "#444",
                            lineHeight: 1.3,
                          }}
                        >
                          {st.name}
                        </span>
                        <span style={{ fontSize: 10, color: "#aaa", lineHeight: 1.2 }}>{st.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* AI设计：参考图上传（分页版） */}
            {mode === "split" && splitStyle === "ai" && (
              <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <span>🎨</span><span>AI设计</span>
                </div>
                <ReferenceImageUploader
                  image={aiReferenceImage}
                  onChange={setAiReferenceImage}
                  onClear={() => setAiReferenceImage(null)}
                />
                <div style={{ fontSize: 12, color: "#777", marginTop: 12, textAlign: "center" }}>
                  {aiReferenceImage ? 'AI将参考图片风格生成设计' : '不上传则AI自由发挥'}
                </div>
              </div>
            )}

            {/* 整页版：模板 */}
            {mode === "single" && (
              <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <span>🗂</span><span>模板</span>
                </div>
                <div style={{ maxHeight: 220, overflowY: "auto", paddingRight: 4 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                    {[...TEMPLATES, AI_DESIGN_TEMPLATE].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTpl(t.id);
                        if (t.id === 'ai') {
                          setAiSingleDesign(null);
                        }
                      }}
                      style={{
                        padding: "10px 6px",
                        borderRadius: 10,
                        border: `2px solid ${tpl === t.id ? palette.a : "#f0f0f0"}`,
                        background: tpl === t.id ? palette.a + "08" : "#fafafa",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 3,
                        cursor: "pointer",
                        transition: "all .2s ease",
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{t.icon}</span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: tpl === t.id ? 700 : 600,
                          color: tpl === t.id ? palette.a : "#444",
                          lineHeight: 1.3,
                        }}
                      >
                        {t.name}
                      </span>
                      <span style={{ fontSize: 10, color: "#aaa", lineHeight: 1.2 }}>{t.desc}</span>
                    </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* AI设计：参考图上传（整页版） */}
            {mode === "single" && tpl === "ai" && (
              <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <span>🎨</span><span>AI设计</span>
                </div>
                <ReferenceImageUploader
                  image={aiReferenceImage}
                  onChange={setAiReferenceImage}
                  onClear={() => setAiReferenceImage(null)}
                />
                <div style={{ fontSize: 12, color: "#777", marginTop: 12, textAlign: "center" }}>
                  {aiReferenceImage ? 'AI将参考图片风格生成设计' : '不上传则AI自由发挥'}
                </div>
              </div>
            )}

            {/* 配色 */}
            <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                <span>🎨</span><span>配色</span>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {PALETTES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPalId(p.id)}
                    title={p.label}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: p.a,
                      border: `3px solid ${palId === p.id ? p.a : "#fff"}`,
                      outline: palId === p.id ? `3px solid ${p.a}44` : `2px solid #e0e0e0`,
                      outlineOffset: palId === p.id ? 2 : 0,
                      padding: 0,
                      cursor: "pointer",
                      transition: "all .2s ease",
                      boxShadow: palId === p.id ? `0 2px 8px ${p.a}40` : "0 1px 3px rgba(0,0,0,.1)",
                    }}
                  />
                ))}
              </div>
              <div style={{ fontSize: 12, color: palette.a, fontWeight: 600, marginTop: 10 }}>{palette.label}</div>
            </div>

            {/* 生成 */}
            <button
              onClick={generate}
              disabled={loading || !input.trim()}
              style={{
                padding: "16px",
                borderRadius: 12,
                border: "none",
                background: loading || !input.trim() ? "#ccc" : palette.a,
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                boxShadow: loading || !input.trim() ? "none" : `0 4px 12px ${palette.a}40`,
                transition: "all .2s ease",
              }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  AI 生成中 <Dots />
                </span>
              ) : mode === "single" ? (
                "✨ 生成排版图"
              ) : (
                "✨ 生成分页卡片"
              )}
            </button>
            {error && <p style={{ fontSize: 13, color: "#e05a4b", textAlign: "center", margin: "-8px 0 0", padding: "10px", background: "#fef2f2", borderRadius: 8, fontWeight: 500 }}>{error}</p>}
          </div>

          {/* Right Panel - Preview */}
          <div style={{ position: "sticky", top: 24 }}>

            {/* 整页版 */}
            {mode === "single" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#666" }}>预览</span>
                  {(cardData || aiSingleDesign) && (
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {expMsg && (
                        <span style={{ fontSize: 12, fontWeight: 600, color: expMsg.startsWith("✓") ? "#4a7c59" : "#999" }}>
                          {expMsg}
                        </span>
                      )}
                      <button
                        onClick={() => exportSingle("hd")}
                        disabled={exporting || !h2cOk}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 8,
                          border: `1.5px solid ${palette.a}`,
                          background: "#fff",
                          color: palette.a,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          opacity: exporting ? 0.6 : 1,
                          transition: "all .2s ease",
                        }}
                      >
                        {exporting ? <Dots /> : "⬇ 高清"}
                      </button>
                      <button
                        onClick={() => exportSingle("ultra")}
                        disabled={exporting || !h2cOk}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 8,
                          border: "none",
                          background: palette.a,
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          opacity: exporting ? 0.6 : 1,
                          boxShadow: `0 2px 8px ${palette.a}40`,
                          transition: "all .2s ease",
                        }}
                      >
                        {exporting ? <Dots /> : "⬇ 超清 4K"}
                      </button>
                    </div>
                  )}
                </div>

                {!cardData && !aiSingleDesign && !loading && (
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      minHeight: 480,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed #e0e0e0",
                      color: "#bbb",
                      gap: 12,
                    }}
                  >
                    <span style={{ fontSize: 44 }}>{tpl === 'ai' ? '✨' : '🖼️'}</span>
                    <span style={{ fontSize: 14 }}>{tpl === 'ai' ? '点击生成开始AI设计' : '排版预览将在这里显示'}</span>
                  </div>
                )}

                {loading && (
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      minHeight: 480,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed #e0e0e0",
                      gap: 12,
                    }}
                  >
                    <span style={{ fontSize: 36 }}>{tpl === 'ai' ? '✨' : '✦'}</span>
                    <span style={{ fontSize: 14, color: "#999" }}>{tpl === 'ai' ? 'AI正在设计...' : '正在生成'}</span>
                    <Dots />
                  </div>
                )}

                {/* 普通模板渲染 */}
                {cardData && !loading && tpl !== 'ai' && CardRenderer && (
                  <div
                    ref={cardRef}
                    style={{
                      animation: "rise .4s ease",
                      overflow: "hidden",
                      boxShadow: "0 12px 40px rgba(0,0,0,.12)",
                      borderRadius,
                    }}
                  >
                    <CardRenderer d={cardData} ed={singleEd} drag={sectionDrag} />
                  </div>
                )}

                {/* AI设计渲染 */}
                {aiSingleDesign && !loading && tpl === 'ai' && (
                  <div
                    ref={cardRef}
                    style={{
                      animation: "rise .4s ease",
                      overflow: "hidden",
                      boxShadow: "0 12px 40px rgba(0,0,0,.12)",
                      borderRadius: 14,
                    }}
                  >
                    <AIStyleRenderer design={aiSingleDesign} editor={aiSingleEd} />
                  </div>
                )}
              </>
            )}

            {/* 分页版 */}
            {mode === "split" && (
              <>
                {!slides && !loading && (
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      minHeight: 480,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed #e0e0e0",
                      color: "#bbb",
                      gap: 12,
                    }}
                  >
                    <span style={{ fontSize: 44 }}>{splitStyle === 'ai' ? '✨' : '📑'}</span>
                    <span style={{ fontSize: 14 }}>{splitStyle === 'ai' ? '点击生成开始AI设计' : '分页卡片将在这里显示'}</span>
                  </div>
                )}
                {loading && (
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      minHeight: 480,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed #e0e0e0",
                      gap: 12,
                    }}
                  >
                    <span style={{ fontSize: 36 }}>{splitStyle === 'ai' ? '✨' : '✦'}</span>
                    <span style={{ fontSize: 14, color: "#999" }}>{splitStyle === 'ai' ? 'AI正在设计...' : '正在生成分页卡片'}</span>
                    <Dots />
                  </div>
                )}
                {slides && !loading && (
                  <div style={{ animation: "rise .4s ease" }}>
                    {/* 工具栏 */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#666" }}>
                        {slideIdx + 1} / {slides.length} 张
                      </span>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        {expMsg && (
                          <span style={{ fontSize: 12, fontWeight: 600, color: expMsg.startsWith("✓") ? "#4a7c59" : "#999" }}>
                            {expMsg}
                          </span>
                        )}
                        <button
                          onClick={() => exportSlide(slideIdx, "hd")}
                          disabled={exporting || !h2cOk}
                          style={{
                            padding: "6px 14px",
                            borderRadius: 8,
                            border: `1.5px solid ${palette.a}`,
                            background: "#fff",
                            color: palette.a,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            opacity: exporting ? 0.6 : 1,
                            transition: "all .2s ease",
                          }}
                        >
                          {exporting ? <Dots /> : "⬇ 当前页"}
                        </button>
                        <button
                          onClick={() => exportAll()}
                          disabled={exporting || !h2cOk}
                          style={{
                            padding: "6px 14px",
                            borderRadius: 8,
                            border: "none",
                            background: palette.a,
                            color: "#fff",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            opacity: exporting ? 0.6 : 1,
                            boxShadow: `0 2px 8px ${palette.a}40`,
                            transition: "all .2s ease",
                          }}
                        >
                          {exporting ? <Dots /> : "⬇ 导出全部"}
                        </button>
                      </div>
                    </div>

                    {/* 主预览 */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <button
                        className="slide-nav-btn"
                        onClick={() => setSlideIdx((i) => Math.max(0, i - 1))}
                        disabled={slideIdx === 0}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          border: `2px solid ${palette.a}`,
                          background: "#fff",
                          color: palette.a,
                          fontSize: 18,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          padding: 0,
                          cursor: slideIdx === 0 ? "not-allowed" : "pointer",
                          opacity: slideIdx === 0 ? 0.4 : 1,
                          transition: "all .2s ease",
                          boxShadow: slideIdx === 0 ? "none" : "0 2px 8px rgba(0,0,0,.1)",
                        }}
                      >
                        ‹
                      </button>
                      <div className="slide-preview" style={{ width: 375, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,.12)", borderRadius: 14, margin: "0 auto" }}>
                        <div>
                          {renderSlide(slides[slideIdx], slideIdx, slides.length, makeSlideEd(slideIdx))}
                        </div>
                      </div>
                      <button
                        className="slide-nav-btn"
                        onClick={() => setSlideIdx((i) => Math.min(slides.length - 1, i + 1))}
                        disabled={slideIdx === slides.length - 1}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          border: `2px solid ${palette.a}`,
                          background: "#fff",
                          color: palette.a,
                          fontSize: 18,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          padding: 0,
                          cursor: slideIdx === slides.length - 1 ? "not-allowed" : "pointer",
                          opacity: slideIdx === slides.length - 1 ? 0.4 : 1,
                          transition: "all .2s ease",
                          boxShadow: slideIdx === slides.length - 1 ? "none" : "0 2px 8px rgba(0,0,0,.1)",
                        }}
                      >
                        ›
                      </button>
                    </div>

                    {/* 缩略图 — 拖拽排序 */}
                    <div className="slide-thumbnails" style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6, alignItems: "flex-start" }}>
                      {slides.map((s, i) => {
                        const isSlideTarget = slideDrag.target === i && slideDrag.active !== i;
                        return (
                          <div
                            key={i}
                            draggable
                            onClick={() => setSlideIdx(i)}
                            onDragStart={(e) => {
                              slideDrag.start(i);
                              e.dataTransfer.effectAllowed = "move";
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              slideDrag.over(i);
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              slideDrag.drop();
                              if (slideDrag.target !== null)
                                setSlideIdx(slideDrag.target > slideDrag.active ? slideDrag.target - 1 : slideDrag.target);
                            }}
                            onDragEnd={slideDrag.cancel}
                            className="slide-thumb-item"
                            style={{
                              flexShrink: 0,
                              width: 64,
                              borderRadius: 8,
                              overflow: "hidden",
                              boxShadow:
                                slideIdx === i
                                  ? `0 0 0 2px ${palette.a}`
                                  : isSlideTarget
                                    ? `0 0 0 2px ${palette.a}88`
                                    : "0 1px 3px rgba(0,0,0,.1)",
                              opacity: slideDrag.active === i ? 0.4 : slideIdx === i ? 1 : 0.8,
                              transition: "all .2s ease",
                              background: "#fff",
                              cursor: "grab",
                            }}
                          >
                            <div className="slide-thumb-img" style={{ width: 64, height: 85, overflow: "hidden", position: "relative", flexShrink: 0, borderRadius: "8px 8px 0 0" }}>
                              <div
                                style={{
                                  width: 375,
                                  height: 500,
                                  transformOrigin: "0 0",
                                  transform: "scale(0.16)",
                                  pointerEvents: "none",
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                }}
                              >
                                {renderSlide(s, i, slides.length, undefined)}
                              </div>
                            </div>
                            <div
                              className="slide-thumb-label"
                              style={{
                                textAlign: "center",
                                padding: "4px 0",
                                fontSize: 10,
                                fontWeight: 600,
                                color: slideIdx === i ? palette.a : "#888",
                                background: "#fff",
                              }}
                            >
                              {i === 0 ? "封面" : i === slides.length - 1 ? "结尾" : `第${i}页`}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* 隐藏的导出容器 - 包含所有 slides 的完整尺寸版本 */}
                    <div 
                      aria-hidden="true" 
                      style={{ 
                        position: "absolute", 
                        left: -9999, 
                        top: 0,
                        width: 375,
                      }}
                    >
                      {slides.map((s, i) => (
                        <div key={i} ref={(el) => (slideRefs.current[i] = el)}>
                          {renderSlide(s, i, slides.length, undefined)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* LLM配置弹窗 */}
      <LLMConfigModal
        isOpen={showLLMConfig}
        onClose={() => setShowLLMConfig(false)}
        onSave={handleLLMConfigSave}
        initialConfig={llmConfig}
      />
    </div>
  );
}

export default App;
