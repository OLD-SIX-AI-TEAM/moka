import { useState, useRef, useCallback, useEffect } from "react";
import { useHtml2Canvas, snapElement } from "./hooks/useHtml2Canvas";
import { snapElementToImage } from "./hooks/useHtmlToImage";
import { useDragReorder } from "./hooks/useDragReorder";
import { useTheme } from "./hooks/useTheme";
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
import { TopBar } from "./components/layout/TopBar";
import { ThemePanel } from "./components/layout/ThemePanel";
import { PreviewArea } from "./components/layout/PreviewArea";
import { ContentPanel } from "./components/layout/ContentPanel";
import { SPLIT_STYLES, TEMPLATES, PALETTES, MAX_TOKENS, AI_DESIGN_TEMPLATE, AI_DESIGN_SPLIT_STYLE } from "./constants";
import { AI_DESIGN_PROMPT_SINGLE, AI_DESIGN_PROMPT_SPLIT } from "./prompts/aiDesignPrompt";
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

  // LLM 配置
  const [showLLMConfig, setShowLLMConfig] = useState(false);
  const [llmConfig, setLlmConfig] = useState(getEnvLLMConfig());
  const envConfigValid = !!llmConfig.apiKey;

  // Refs
  const cardRef = useRef(null);
  const slideRefs = useRef([]);

  // Hooks
  const h2cOk = useHtml2Canvas();
  const palette = PALETTES.find((p) => p.id === palId) || PALETTES[0];
  const { theme, isLight, toggleTheme } = useTheme();

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

  const makeSlideEd = (idx) => ({
    title: (v) => updateSlide(idx, "title", v),
    subtitle: (v) => updateSlide(idx, "subtitle", v),
    heading: (v) => updateSlide(idx, "heading", v),
    text: (v) => updateSlide(idx, "text", v),
    extra: (v) => updateSlide(idx, "extra", v),
    cta: (v) => updateSlide(idx, "cta", v),
    sub: (v) => updateSlide(idx, "sub", v),
    tag: (tIdx) => (v) => updateSlideTag(idx, tIdx, v),
  });

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

  // 处理LLM配置保存
  const handleLLMConfigSave = useCallback((config) => {
    saveLLMConfig(config);
    setLlmConfig(config);
    setShowLLMConfig(false);
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

    try {
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

      const link = document.createElement("a");
      link.download = `${name}_${quality}.png`;
      link.href = dataUrl;
      link.click();
      setExpMsg("✓ 已保存");
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

      const link = document.createElement("a");
      link.download = `slide_${idx + 1}_${quality}.png`;
      link.href = dataUrl;
      link.click();
      setExpMsg("✓ 已保存");
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
    <div className="app">
      <TopBar mode={mode} setMode={setMode} theme={theme} toggleTheme={toggleTheme} isLight={isLight} />
      
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
        />
        
        {/* 第三列：平台、文案和生成 */}
        <ContentPanel
          mode={mode}
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
        />
      </div>

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
