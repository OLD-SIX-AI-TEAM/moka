import { useState, useRef, useCallback } from "react";
import { useHtml2Canvas, snapElement } from "./hooks/useHtml2Canvas";
import { snapElementToImage } from "./hooks/useHtmlToImage";
import { useDragReorder } from "./hooks/useDragReorder";
import { Dots } from "./components/common/Icons";
import { Editorial, Notecard, Minimal, Stamp, BoldCard, Dark, Newspaper, Film, LabelCard } from "./components/templates/single";
import { VividCover, VividContent, VividEnd, CleanCover, CleanContent, CleanEnd, DarkCover, DarkContent, DarkEnd, PaperCover, PaperContent, PaperEnd, EdCover, EdContent, EdEnd, GrCover, GrContent, GrEnd } from "./components/templates/split";
import { createLLMClient, SYSTEM_PROMPTS, extractJSON, getEnvLLMConfig, isEnvConfigValid } from "./services/llm";
import { SPLIT_STYLES, TEMPLATES, PALETTES, FONT_FAMILY, MAX_TOKENS } from "./constants";
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
};

// 分页模板渲染器映射
const SPLIT_RENDERERS = {
  vivid: { Cover: VividCover, Content: VividContent, End: VividEnd },
  clean: { Cover: CleanCover, Content: CleanContent, End: CleanEnd },
  dark: { Cover: DarkCover, Content: DarkContent, End: DarkEnd },
  paper: { Cover: PaperCover, Content: PaperContent, End: PaperEnd },
  editorial: { Cover: EdCover, Content: EdContent, End: EdEnd },
  gradient: { Cover: GrCover, Content: GrContent, End: GrEnd },
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

  // LLM 配置从环境变量获取
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

  // 生成内容
  const generate = useCallback(async () => {
    if (!input.trim()) return;
    if (!envConfigValid) {
      setError("请在 .env 文件中配置 VITE_LLM_API_KEY");
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
  }, [input, mode, platform, llmConfig, envConfigValid]);

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
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#1a1510", margin: "0 0 4px", letterSpacing: "-0.5px" }}>
            小红书排版生成器
          </h1>
          <p style={{ fontSize: 12, color: "#999", margin: 0 }}>
            9 种模板 · 8 套配色 · 分页拆分 · <span style={{ color: palette.a, fontWeight: 700 }}>点击文字可直接编辑</span>
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <div style={{ display: "flex", background: "#fff", borderRadius: 12, padding: 4, gap: 4, boxShadow: "0 2px 10px rgba(0,0,0,.07)" }}>
            {[
              { v: "single", label: "📄 完整版" },
              { v: "split", label: "📑 分页版" },
            ].map((m) => (
              <button
                key={m.v}
                onClick={() => {
                  setMode(m.v);
                  setSingleData(null);
                  setSlides(null);
                }}
                style={{
                  padding: "8px 22px",
                  borderRadius: 9,
                  border: "none",
                  background: mode === m.v ? palette.a : "transparent",
                  color: mode === m.v ? "#fff" : "#666",
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: "pointer",
                  transition: "all .2s",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 18, alignItems: "start" }}>
          {/* Left Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {/* Input */}
            <div style={{ background: "#fff", borderRadius: 13, padding: 17, boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#555", letterSpacing: "1px", marginBottom: 8 }}>
                ✍️ 文案 / 话题
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={"例如：推荐一款奶油肌底妆，\n遮瑕力强、持妆久、不闷痘…"}
                rows={4}
                style={{
                  width: "100%",
                  border: "1.5px solid #eee",
                  borderRadius: 8,
                  padding: "10px 11px",
                  fontSize: 13,
                  lineHeight: 1.7,
                  resize: "vertical",
                  color: "#333",
                  background: "#fafafa",
                  transition: "all .2s",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* 分页：平台 */}
            {mode === "split" && (
              <div style={{ background: "#fff", borderRadius: 13, padding: 17, boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#555", letterSpacing: "1px", marginBottom: 11 }}>
                  📱 发布平台
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { v: "xhs", icon: "📕", name: "小红书", desc: "情绪化 · 口语风" },
                    { v: "wechat", icon: "💬", name: "微信推文", desc: "专业 · 权威感" },
                  ].map((p) => (
                    <button
                      key={p.v}
                      onClick={() => setPlatform(p.v)}
                      style={{
                        padding: "11px 8px",
                        borderRadius: 10,
                        border: `1.5px solid ${platform === p.v ? palette.a : "#eee"}`,
                        background: platform === p.v ? palette.a + "10" : "#fafafa",
                        cursor: "pointer",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <span style={{ fontSize: 22 }}>{p.icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: platform === p.v ? palette.a : "#444" }}>{p.name}</span>
                      <span style={{ fontSize: 10, color: "#aaa" }}>{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 分页：卡片风格 */}
            {mode === "split" && (
              <div style={{ background: "#fff", borderRadius: 13, padding: 17, boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#555", letterSpacing: "1px", marginBottom: 11 }}>
                  🖼 卡片风格
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                  {SPLIT_STYLES.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setSplitStyle(st.id)}
                      style={{
                        padding: "8px 5px",
                        borderRadius: 8,
                        border: `1.5px solid ${splitStyle === st.id ? palette.a : "#eee"}`,
                        background: splitStyle === st.id ? palette.a + "10" : "#fafafa",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        cursor: "pointer",
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{st.icon}</span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: splitStyle === st.id ? 800 : 600,
                          color: splitStyle === st.id ? palette.a : "#555",
                          lineHeight: 1.2,
                        }}
                      >
                        {st.name}
                      </span>
                      <span style={{ fontSize: 9, color: "#bbb", lineHeight: 1.2 }}>{st.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 完整：模板 */}
            {mode === "single" && (
              <div style={{ background: "#fff", borderRadius: 13, padding: 17, boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#555", letterSpacing: "1px", marginBottom: 10 }}>
                  🗂 模板
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTpl(t.id)}
                      style={{
                        padding: "8px 5px",
                        borderRadius: 8,
                        border: `1.5px solid ${tpl === t.id ? palette.a : "#eee"}`,
                        background: tpl === t.id ? palette.a + "10" : "#fafafa",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        cursor: "pointer",
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{t.icon}</span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: tpl === t.id ? 800 : 600,
                          color: tpl === t.id ? palette.a : "#555",
                          lineHeight: 1.2,
                        }}
                      >
                        {t.name}
                      </span>
                      <span style={{ fontSize: 9, color: "#bbb", lineHeight: 1.2 }}>{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 配色 */}
            <div style={{ background: "#fff", borderRadius: 13, padding: 17, boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#555", letterSpacing: "1px", marginBottom: 10 }}>
                🎨 配色
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {PALETTES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPalId(p.id)}
                    title={p.label}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: p.a,
                      border: `3px solid ${palId === p.id ? p.a : "transparent"}`,
                      outline: palId === p.id ? `2px solid ${p.a}55` : "none",
                      outlineOffset: 2,
                      padding: 0,
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
              <div style={{ fontSize: 10, color: palette.a, fontWeight: 700, marginTop: 7 }}>{palette.label}</div>
            </div>

            {/* 生成 */}
            <button
              onClick={generate}
              disabled={loading || !input.trim()}
              style={{
                padding: "13px",
                borderRadius: 11,
                border: "none",
                background: loading || !input.trim() ? "#ccc" : palette.a,
                color: "#fff",
                fontSize: 14,
                fontWeight: 800,
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                letterSpacing: "0.5px",
              }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  AI 生成中 <Dots />
                </span>
              ) : mode === "single" ? (
                "✦ 生成排版图"
              ) : (
                "✦ 生成分页卡片"
              )}
            </button>
            {error && <p style={{ fontSize: 12, color: "#e05a4b", textAlign: "center", margin: 0 }}>{error}</p>}
          </div>

          {/* Right Panel - Preview */}
          <div>
            {/* 完整版 */}
            {mode === "single" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "1px" }}>预览</span>
                  {cardData && (
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {expMsg && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: expMsg.startsWith("✓") ? "#4a7c59" : "#aaa" }}>
                          {expMsg}
                        </span>
                      )}
                      <button
                        onClick={() => exportSingle("hd")}
                        disabled={exporting || !h2cOk}
                        style={{
                          padding: "5px 11px",
                          borderRadius: 6,
                          border: `1px solid ${palette.a}`,
                          background: "#fff",
                          color: palette.a,
                          fontSize: 11,
                          fontWeight: 800,
                          cursor: "pointer",
                          opacity: exporting ? 0.6 : 1,
                        }}
                      >
                        {exporting ? <Dots /> : "⬇ 高清"}
                      </button>
                      <button
                        onClick={() => exportSingle("ultra")}
                        disabled={exporting || !h2cOk}
                        style={{
                          padding: "5px 11px",
                          borderRadius: 6,
                          border: "none",
                          background: palette.a,
                          color: "#fff",
                          fontSize: 11,
                          fontWeight: 800,
                          cursor: "pointer",
                          opacity: exporting ? 0.6 : 1,
                        }}
                      >
                        {exporting ? <Dots /> : "⬇ 超清 4K"}
                      </button>
                    </div>
                  )}
                </div>

                {!cardData && !loading && (
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 13,
                      minHeight: 460,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed #ddd",
                      color: "#ccc",
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 38 }}>🖼️</span>
                    <span style={{ fontSize: 13 }}>排版预览将在这里显示</span>
                  </div>
                )}

                {loading && (
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 13,
                      minHeight: 460,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed #ddd",
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 30 }}>✦</span>
                    <span style={{ fontSize: 13, color: "#aaa" }}>正在生成</span>
                    <Dots />
                  </div>
                )}

                {cardData && !loading && CardRenderer && (
                  <div
                    ref={cardRef}
                    style={{
                      animation: "rise .35s ease",
                      overflow: "hidden",
                      boxShadow: "0 8px 36px rgba(0,0,0,.12)",
                      borderRadius,
                    }}
                  >
                    <CardRenderer d={cardData} ed={singleEd} drag={sectionDrag} />
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
                      borderRadius: 13,
                      minHeight: 460,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed #ddd",
                      color: "#ccc",
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 38 }}>📑</span>
                    <span style={{ fontSize: 13 }}>分页卡片将在这里显示</span>
                  </div>
                )}
                {loading && (
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 13,
                      minHeight: 460,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed #ddd",
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 30 }}>✦</span>
                    <span style={{ fontSize: 13, color: "#aaa" }}>正在生成分页卡片</span>
                    <Dots />
                  </div>
                )}
                {slides && !loading && (
                  <div style={{ animation: "rise .35s ease" }}>
                    {/* 工具栏 */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "1px" }}>
                        {slideIdx + 1} / {slides.length} 张
                      </span>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        {expMsg && (
                          <span style={{ fontSize: 11, fontWeight: 700, color: expMsg.startsWith("✓") ? "#4a7c59" : "#888" }}>
                            {expMsg}
                          </span>
                        )}
                        <button
                          onClick={() => exportSlide(slideIdx, "hd")}
                          disabled={exporting || !h2cOk}
                          style={{
                            padding: "5px 10px",
                            borderRadius: 6,
                            border: `1px solid ${palette.a}`,
                            background: "#fff",
                            color: palette.a,
                            fontSize: 11,
                            fontWeight: 800,
                            cursor: "pointer",
                            opacity: exporting ? 0.6 : 1,
                          }}
                        >
                          {exporting ? <Dots /> : "⬇ 当前页"}
                        </button>
                        <button
                          onClick={() => exportAll()}
                          disabled={exporting || !h2cOk}
                          style={{
                            padding: "5px 10px",
                            borderRadius: 6,
                            border: "none",
                            background: palette.a,
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: 800,
                            cursor: "pointer",
                            opacity: exporting ? 0.6 : 1,
                          }}
                        >
                          {exporting ? <Dots /> : "⬇ 导出全部"}
                        </button>
                      </div>
                    </div>

                    {/* 主预览 */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                      <button
                        onClick={() => setSlideIdx((i) => Math.max(0, i - 1))}
                        disabled={slideIdx === 0}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          border: `1.5px solid ${palette.a}`,
                          background: "#fff",
                          color: palette.a,
                          fontSize: 15,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          padding: 0,
                          cursor: slideIdx === 0 ? "not-allowed" : "pointer",
                          opacity: slideIdx === 0 ? 0.3 : 1,
                        }}
                      >
                        ‹
                      </button>
                      <div style={{ flex: 1, overflow: "hidden", boxShadow: "0 6px 28px rgba(0,0,0,.14)", borderRadius: 12 }}>
                        <div>
                          {renderSlide(slides[slideIdx], slideIdx, slides.length, makeSlideEd(slideIdx))}
                        </div>
                      </div>
                      <button
                        onClick={() => setSlideIdx((i) => Math.min(slides.length - 1, i + 1))}
                        disabled={slideIdx === slides.length - 1}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          border: `1.5px solid ${palette.a}`,
                          background: "#fff",
                          color: palette.a,
                          fontSize: 15,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          padding: 0,
                          cursor: slideIdx === slides.length - 1 ? "not-allowed" : "pointer",
                          opacity: slideIdx === slides.length - 1 ? 0.3 : 1,
                        }}
                      >
                        ›
                      </button>
                    </div>

                    {/* 缩略图 — 拖拽排序 */}
                    <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 4, alignItems: "flex-start" }}>
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
                            style={{
                              flexShrink: 0,
                              width: 60,
                              borderRadius: 6,
                              overflow: "hidden",
                              boxShadow:
                                slideIdx === i
                                  ? `0 0 0 2px ${palette.a}`
                                  : isSlideTarget
                                    ? `0 0 0 2px ${palette.a}88, -3px 0 0 ${palette.a}`
                                    : "0 1px 4px rgba(0,0,0,.12)",
                              opacity: slideDrag.active === i ? 0.3 : slideIdx === i ? 1 : 0.75,
                              transition: "all .15s",
                              background: "#fff",
                              cursor: "grab",
                            }}
                          >
                            <div style={{ width: 60, height: 80, overflow: "hidden", position: "relative", flexShrink: 0, borderRadius: "6px 6px 0 0" }}>
                              <div
                                style={{
                                  width: 300,
                                  height: 400,
                                  transformOrigin: "0 0",
                                  transform: "scale(0.2)",
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
                              style={{
                                textAlign: "center",
                                padding: "3px 0",
                                fontSize: 9,
                                fontWeight: 700,
                                color: slideIdx === i ? palette.a : "#aaa",
                                background: "#fff",
                              }}
                            >
                              {i === 0 ? "封" : i === slides.length - 1 ? "尾" : i}
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
    </div>
  );
}

export default App;
