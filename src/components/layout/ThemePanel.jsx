/** @jsxImportSource react */
export function ThemePanel({ 
  palId, 
  setPalId, 
  palettes, 
  palette,
  mode,
  splitStyle,
  setSplitStyle,
  tpl,
  setTpl,
  splitStyles,
  templates,
}) {
  return (
    <div className="theme-panel">
      <div className="panel-section style-section">
        <h3 className="section-title">{mode === "single" ? "🗂 模板" : "🖼 风格"}</h3>
        <div className="style-grid-small">
          {mode === "single" 
            ? templates.map((t) => (
                <button
                  key={t.id}
                  className={`style-card ${tpl === t.id ? "active" : ""}`}
                  onClick={() => setTpl(t.id)}
                >
                  <span className="style-icon">{t.icon}</span>
                  <span className="style-name">{t.name}</span>
                </button>
              ))
            : splitStyles.map((s) => (
                <button
                  key={s.id}
                  className={`style-card ${splitStyle === s.id ? "active" : ""}`}
                  onClick={() => setSplitStyle(s.id)}
                >
                  <span className="style-icon">{s.icon}</span>
                  <span className="style-name">{s.name}</span>
                </button>
              ))
          }
        </div>
      </div>

      <div className="panel-section palette-section">
        <h3 className="section-title">🎯 配色</h3>
        <div className="palette-grid-vertical">
          {palettes.map((p) => (
            <button
              key={p.id}
              className={`palette-card ${palId === p.id ? "active" : ""}`}
              onClick={() => setPalId(p.id)}
            >
              <div 
                className="palette-color-preview" 
                style={{ background: p.a }}
              ></div>
              <div className="palette-info">
                <span className="palette-name">{p.label}</span>
                <span className="palette-dot" style={{ background: p.a }}></span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
