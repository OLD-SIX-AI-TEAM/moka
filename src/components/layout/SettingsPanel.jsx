/** @jsxImportSource react */
import { ReferenceImageUploader } from "../ReferenceImageUploader";
import { Dots } from "../common/Icons";

export function SettingsPanel({
  // 基础状态
  mode,
  input,
  onInputChange,
  platform,
  onPlatformChange,
  splitStyle,
  onSplitStyleChange,
  tpl,
  onTplChange,
  palId,
  onPalIdChange,
  palette,
  palettes,
  splitStyles,
  templates,
  loading,
  error,
  onGenerate,
  // AI设计状态
  aiReferenceImage,
  onAiReferenceImageChange,
}) {
  return (
    <aside className="settings-panel">
      {/* 文案输入 */}
      <section className="settings-section">
        <h3 className="section-title">✍️ 文案内容</h3>
        <textarea
          className="content-input"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="输入你的文案内容，AI会帮你智能排版..."
          rows={6}
        />
      </section>

      {/* 分页版设置 */}
      {mode === "split" && (
        <>
          <section className="settings-section">
            <h3 className="section-title">📱 发布平台</h3>
            <div className="platform-options">
              {[
                { id: "xhs", icon: "📕", name: "小红书", desc: "情绪化 · 口语风" },
                { id: "wechat", icon: "💬", name: "微信推文", desc: "专业 · 权威感" },
              ].map((p) => (
                <button
                  key={p.id}
                  className={`platform-btn ${platform === p.id ? "active" : ""}`}
                  onClick={() => onPlatformChange(p.id)}
                >
                  <span className="platform-icon">{p.icon}</span>
                  <div className="platform-info">
                    <span className="platform-name">{p.name}</span>
                    <span className="platform-desc">{p.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="settings-section">
            <h3 className="section-title">🖼 卡片风格</h3>
            <div className="style-grid">
              {splitStyles.map((st) => (
                <button
                  key={st.id}
                  className={`style-btn ${splitStyle === st.id ? "active" : ""}`}
                  onClick={() => onSplitStyleChange(st.id)}
                >
                  <span className="style-icon">{st.icon}</span>
                  <span className="style-name">{st.name}</span>
                </button>
              ))}
            </div>
          </section>

          {splitStyle === "ai" && (
            <section className="settings-section">
              <h3 className="section-title">🎨 AI参考图</h3>
              <ReferenceImageUploader
                image={aiReferenceImage}
                onChange={onAiReferenceImageChange}
                onClear={() => onAiReferenceImageChange(null)}
              />
              <p className="help-text">
                {aiReferenceImage ? "AI将参考此图风格生成设计" : "不上传则AI自由发挥"}
              </p>
            </section>
          )}
        </>
      )}

      {/* 整页版设置 */}
      {mode === "single" && (
        <>
          <section className="settings-section">
            <h3 className="section-title">🗂 排版模板</h3>
            <div className="template-grid">
              {templates.map((t) => (
                <button
                  key={t.id}
                  className={`template-btn ${tpl === t.id ? "active" : ""}`}
                  onClick={() => onTplChange(t.id)}
                >
                  <span className="template-icon">{t.icon}</span>
                  <span className="template-name">{t.name}</span>
                </button>
              ))}
            </div>
          </section>

          {tpl === "ai" && (
            <section className="settings-section">
              <h3 className="section-title">🎨 AI参考图</h3>
              <ReferenceImageUploader
                image={aiReferenceImage}
                onChange={onAiReferenceImageChange}
                onClear={() => onAiReferenceImageChange(null)}
              />
              <p className="help-text">
                {aiReferenceImage ? "AI将参考此图风格生成设计" : "不上传则AI自由发挥"}
              </p>
            </section>
          )}
        </>
      )}

      {/* 配色选择 */}
      <section className="settings-section">
        <h3 className="section-title">🎨 配色方案</h3>
        <div className="palette-grid">
          {palettes.map((p) => (
            <button
              key={p.id}
              className={`palette-btn ${palId === p.id ? "active" : ""}`}
              onClick={() => onPalIdChange(p.id)}
              title={p.label}
            >
              <span
                className="palette-color"
                style={{ background: p.a }}
              />
            </button>
          ))}
        </div>
        <p className="palette-label">{palette.label}</p>
      </section>

      {/* 生成按钮 */}
      <section className="settings-section">
        <button
          className={`generate-btn ${loading || !input.trim() ? "disabled" : ""}`}
          onClick={onGenerate}
          disabled={loading || !input.trim()}
          style={{ "--theme-color": palette.a }}
        >
          {loading ? (
            <>
              <span>AI生成中</span>
              <Dots />
            </>
          ) : mode === "single" ? (
            "✨ 生成排版图"
          ) : (
            "✨ 生成分页卡片"
          )}
        </button>
        
        {error && (
          <div className="error-message">{error}</div>
        )}
      </section>
    </aside>
  );
}
