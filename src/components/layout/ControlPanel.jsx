/** @jsxImportSource react */
import { useState, useRef, useEffect } from "react";
import { ReferenceImageUploader } from "../ReferenceImageUploader";
import { Dots } from "../common/Icons";
import { useLanguage } from "../../hooks/useLanguage";

export function ControlPanel({
  mode,
  input,
  setInput,
  platform,
  setPlatform,
  splitStyle,
  setSplitStyle,
  tpl,
  setTpl,
  palId,
  setPalId,
  palette,
  loading,
  error,
  onGenerate,
  splitStyles,
  templates,
  palettes,
  aiReferenceImage,
  setAiReferenceImage,
  exporting,
  onExportSingle,
  onExportSlide,
  onExportAll,
  hasContent,
  hasSingleContent,
  hasSplitContent,
  slideIdx,
  h2cOk,
}) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("content");

  const tabs = [
    { id: "content", label: t('content'), icon: "✍️" },
    { id: "style", label: t('style'), icon: "🎨" },
    { id: "settings", label: t('settings'), icon: "⚙️" },
  ];

  return (
    <div className="control-panel">
      {/* 顶部导出区 */}
      <div className="control-header">
        <h2 className="panel-title">排版生成器</h2>
        <div className="export-actions">
          {mode === "single" && hasSingleContent && aiReferenceImage && (
            <>
              <button 
                className="export-btn outline"
                onClick={() => onExportSingle("hd")}
                disabled={exporting || !h2cOk}
              >
                {exporting ? <Dots /> : "高清"}
              </button>
              <button 
                className="export-btn primary"
                onClick={() => onExportSingle("ultra")}
                disabled={exporting || !h2cOk}
              >
                {exporting ? <Dots /> : "超清 4K"}
              </button>
            </>
          )}
          {mode === "split" && hasSplitContent && aiReferenceImage && (
            <>
              <button 
                className="export-btn outline"
                onClick={() => onExportSlide(slideIdx, "hd")}
                disabled={exporting || !h2cOk}
              >
                当前页
              </button>
              <button 
                className="export-btn primary"
                onClick={onExportAll}
                disabled={exporting || !h2cOk}
              >
                导出全部
              </button>
            </>
          )}
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="tab-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 标签页内容 */}
      <div className="tab-content">
        {activeTab === "content" && (
          <ContentTab
            mode={mode}
            input={input}
            setInput={setInput}
            platform={platform}
            setPlatform={setPlatform}
            palette={palette}
            loading={loading}
            error={error}
            onGenerate={onGenerate}
          />
        )}

        {activeTab === "style" && (
          <StyleTab
            mode={mode}
            splitStyle={splitStyle}
            setSplitStyle={setSplitStyle}
            tpl={tpl}
            setTpl={setTpl}
            splitStyles={splitStyles}
            templates={templates}
            palette={palette}
            aiReferenceImage={aiReferenceImage}
            setAiReferenceImage={setAiReferenceImage}
          />
        )}

        {activeTab === "settings" && (
          <SettingsTab
            palId={palId}
            setPalId={setPalId}
            palettes={palettes}
            palette={palette}
          />
        )}
      </div>
    </div>
  );
}

function ContentTab({
  mode,
  input,
  setInput,
  platform,
  setPlatform,
  palette,
  loading,
  error,
  onGenerate
}) {
  const { t } = useLanguage();
  const textareaRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = textareaRef.current.value.length;
        textareaRef.current.selectionEnd = textareaRef.current.value.length;
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="tab-panel">
      <section className="panel-section">
        <label className="section-label">{t('content')}</label>
        <textarea
          ref={textareaRef}
          className="content-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "single"
            ? t('contentPlaceholderSingle')
            : t('contentPlaceholderMulti')
          }
          rows={8}
          autoFocus
        />
      </section>

      {mode === "split" && (
        <section className="panel-section">
          <label className="section-label">{t('platform')}</label>
          <div className="platform-selector">
            <button
              className={`platform-option ${platform === "xhs" ? "active" : ""}`}
              onClick={() => setPlatform("xhs")}
            >
              <span className="platform-icon">📕</span>
              <span className="platform-name">{t('xiaohongshu')}</span>
              <span className="platform-tag">{t('xiaohongshuTag')}</span>
            </button>
            <button
              className={`platform-option ${platform === "wechat" ? "active" : ""}`}
              onClick={() => setPlatform("wechat")}
            >
              <span className="platform-icon">💬</span>
              <span className="platform-name">{t('wechat')}</span>
              <span className="platform-tag">{t('wechatTag')}</span>
            </button>
          </div>
        </section>
      )}

      <section className="panel-section">
        <button
          className={`generate-btn ${loading || !input.trim() ? "disabled" : ""}`}
          onClick={onGenerate}
          disabled={loading || !input.trim()}
          style={{ "--theme-color": palette.a }}
        >
          {loading ? (
            <>
              <Dots />
              <span>{t('generating')}</span>
            </>
          ) : (
            <>
              <span>✨</span>
              <span>{mode === "single" ? t('generateSingle') : t('generateSplit')}</span>
            </>
          )}
        </button>

        {error && <div className="error-alert">{error}</div>}
      </section>
    </div>
  );
}

function StyleTab({
  mode,
  splitStyle,
  setSplitStyle,
  tpl,
  setTpl,
  splitStyles,
  templates,
  palette,
  aiReferenceImage,
  setAiReferenceImage
}) {
  const { t } = useLanguage();

  const getTemplateName = (item) => {
    const key = 'template' + item.id.charAt(0).toUpperCase() + item.id.slice(1);
    return t(key);
  };

  return (
    <div className="tab-panel">
      {mode === "single" ? (
        <>
          <section className="panel-section">
            <label className="section-label">{t('selectTemplate')}</label>
            <div className="template-grid-compact">
              {templates.map((t) => (
                <button
                  key={t.id}
                  className={`template-card ${tpl === t.id ? "active" : ""}`}
                  onClick={() => setTpl(t.id)}
                >
                  <span className="template-emoji">{t.icon}</span>
                  <span className="template-title">{getTemplateName(t)}</span>
                  <span className="template-desc">{t.desc}</span>
                </button>
              ))}
            </div>
          </section>

          {tpl === "ai" && (
            <section className="panel-section">
              <label className="section-label">{t('aiReferenceImage')}</label>
              <ReferenceImageUploader
                image={aiReferenceImage}
                onChange={setAiReferenceImage}
                onClear={() => setAiReferenceImage(null)}
              />
              <p className="help-text">
                {aiReferenceImage ? t('aiReferenceImageWith') : t('aiReferenceImageWithout')}
              </p>
            </section>
          )}
        </>
      ) : (
        <>
          <section className="panel-section">
            <label className="section-label">{t('cardStyle')}</label>
            <div className="template-grid-compact">
              {splitStyles.map((s) => (
                <button
                  key={s.id}
                  className={`template-card ${splitStyle === s.id ? "active" : ""}`}
                  onClick={() => setSplitStyle(s.id)}
                >
                  <span className="template-emoji">{s.icon}</span>
                  <span className="template-title">{getTemplateName(s)}</span>
                </button>
              ))}
            </div>
          </section>

          {splitStyle === "ai" && (
            <section className="panel-section">
              <label className="section-label">{t('aiReferenceImage')}</label>
              <ReferenceImageUploader
                image={aiReferenceImage}
                onChange={setAiReferenceImage}
                onClear={() => setAiReferenceImage(null)}
              />
              <p className="help-text">
                {aiReferenceImage ? t('aiReferenceImageWith') : t('aiReferenceImageWithout')}
              </p>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function SettingsTab({ palId, setPalId, palettes, palette }) {
  const { t } = useLanguage();

  const getPaletteLabel = (item) => {
    const key = 'palette' + item.id.charAt(0).toUpperCase() + item.id.slice(1);
    return t(key);
  };

  return (
    <div className="tab-panel">
      <section className="panel-section">
        <label className="section-label">{t('palette')}</label>
        <div className="palette-list">
          {palettes.map((p) => (
            <button
              key={p.id}
              className={`palette-item ${palId === p.id ? "active" : ""}`}
              onClick={() => setPalId(p.id)}
            >
              <span className="palette-preview" style={{ background: p.a }}></span>
              <span className="palette-name">{getPaletteLabel(p)}</span>
              <span className="palette-check">✓</span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel-section">
        <div className="tips-box">
          <h4>💡 {t('tipsTitle')}</h4>
          <ul>
            <li>{t('tipEdit')}</li>
            <li>{t('tipReorder')}</li>
            <li>{t('tipHdExport')}</li>
            <li>{t('tipUltraExport')}</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
