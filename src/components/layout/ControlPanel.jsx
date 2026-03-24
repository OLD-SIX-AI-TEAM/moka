/** @jsxImportSource react */
import { useState } from "react";
import { ReferenceImageUploader } from "../ReferenceImageUploader";
import { Dots } from "../common/Icons";

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
  const [activeTab, setActiveTab] = useState("content");

  const tabs = [
    { id: "content", label: "内容", icon: "✍️" },
    { id: "style", label: "风格", icon: "🎨" },
    { id: "settings", label: "设置", icon: "⚙️" },
  ];

  return (
    <div className="control-panel">
      {/* 顶部导出区 */}
      <div className="control-header">
        <h2 className="panel-title">排版生成器</h2>
        <div className="export-actions">
          {mode === "single" && hasSingleContent && (
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
          {mode === "split" && hasSplitContent && (
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
  return (
    <div className="tab-panel">
      <section className="panel-section">
        <label className="section-label">文案内容</label>
        <textarea
          className="content-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "single" 
            ? "输入文案内容，AI将为你生成精美的整页排版..."
            : "输入文案内容，AI将为你生成多张分页卡片..."
          }
          rows={8}
        />
      </section>

      {mode === "split" && (
        <section className="panel-section">
          <label className="section-label">发布平台</label>
          <div className="platform-selector">
            <button
              className={`platform-option ${platform === "xhs" ? "active" : ""}`}
              onClick={() => setPlatform("xhs")}
            >
              <span className="platform-icon">📕</span>
              <span className="platform-name">小红书</span>
              <span className="platform-tag">情绪化</span>
            </button>
            <button
              className={`platform-option ${platform === "wechat" ? "active" : ""}`}
              onClick={() => setPlatform("wechat")}
            >
              <span className="platform-icon">💬</span>
              <span className="platform-name">微信推文</span>
              <span className="platform-tag">专业</span>
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
              <span>生成中...</span>
            </>
          ) : (
            <>
              <span>✨</span>
              <span>{mode === "single" ? "生成整页排版" : "生成分页卡片"}</span>
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
  return (
    <div className="tab-panel">
      {mode === "single" ? (
        <>
          <section className="panel-section">
            <label className="section-label">选择模板</label>
            <div className="template-grid-compact">
              {templates.map((t) => (
                <button
                  key={t.id}
                  className={`template-card ${tpl === t.id ? "active" : ""}`}
                  onClick={() => setTpl(t.id)}
                >
                  <span className="template-emoji">{t.icon}</span>
                  <span className="template-title">{t.name}</span>
                  <span className="template-desc">{t.desc}</span>
                </button>
              ))}
            </div>
          </section>

          {tpl === "ai" && (
            <section className="panel-section">
              <label className="section-label">AI 参考图（可选）</label>
              <ReferenceImageUploader
                image={aiReferenceImage}
                onChange={setAiReferenceImage}
                onClear={() => setAiReferenceImage(null)}
              />
              <p className="help-text">
                {aiReferenceImage ? "AI将参考此图风格" : "不上传则AI自由发挥"}
              </p>
            </section>
          )}
        </>
      ) : (
        <>
          <section className="panel-section">
            <label className="section-label">卡片风格</label>
            <div className="template-grid-compact">
              {splitStyles.map((s) => (
                <button
                  key={s.id}
                  className={`template-card ${splitStyle === s.id ? "active" : ""}`}
                  onClick={() => setSplitStyle(s.id)}
                >
                  <span className="template-emoji">{s.icon}</span>
                  <span className="template-title">{s.name}</span>
                </button>
              ))}
            </div>
          </section>

          {splitStyle === "ai" && (
            <section className="panel-section">
              <label className="section-label">AI 参考图（可选）</label>
              <ReferenceImageUploader
                image={aiReferenceImage}
                onChange={setAiReferenceImage}
                onClear={() => setAiReferenceImage(null)}
              />
              <p className="help-text">
                {aiReferenceImage ? "AI将参考此图风格" : "不上传则AI自由发挥"}
              </p>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function SettingsTab({ palId, setPalId, palettes, palette }) {
  return (
    <div className="tab-panel">
      <section className="panel-section">
        <label className="section-label">配色方案</label>
        <div className="palette-list">
          {palettes.map((p) => (
            <button
              key={p.id}
              className={`palette-item ${palId === p.id ? "active" : ""}`}
              onClick={() => setPalId(p.id)}
            >
              <span className="palette-preview" style={{ background: p.a }}></span>
              <span className="palette-name">{p.label}</span>
              <span className="palette-check">✓</span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel-section">
        <div className="tips-box">
          <h4>💡 使用提示</h4>
          <ul>
            <li>点击左侧预览区的文字可直接编辑</li>
            <li>分页模式下可拖拽底部缩略图调整顺序</li>
            <li>导出高清图适合社交媒体发布</li>
            <li>导出超清 4K 图适合打印</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
