/** @jsxImportSource react */
import { useLanguage } from '../../hooks/useLanguage';

export function ThemePanel({ 
  palId, 
  setPalId, 
  palettes, 
  mode,
  splitStyle,
  setSplitStyle,
  tpl,
  setTpl,
  splitStyles,
  templates,
}) {
  const { t } = useLanguage();

  const getTemplateName = (item) => {
    const key = 'template' + item.id.charAt(0).toUpperCase() + item.id.slice(1);
    return t(key);
  };

  const getPaletteLabel = (item) => {
    const key = 'palette' + item.id.charAt(0).toUpperCase() + item.id.slice(1);
    return t(key);
  };

  return (
    <div className="theme-panel">
      <div className="panel-section style-section">
        <h3 className="section-title">{mode === "single" ? t('template') : t('style')}</h3>
        <div className="style-grid-small">
          {mode === "single" 
            ? templates.map((tplItem) => (
                <button
                  key={tplItem.id}
                  className={`style-card ${tpl === tplItem.id ? "active" : ""}`}
                  onClick={() => setTpl(tplItem.id)}
                >
                  <span className="style-icon">{tplItem.icon}</span>
                  <span className="style-name">{getTemplateName(tplItem)}</span>
                </button>
              ))
            : splitStyles.map((s) => (
                <button
                  key={s.id}
                  className={`style-card ${splitStyle === s.id ? "active" : ""}`}
                  onClick={() => setSplitStyle(s.id)}
                >
                  <span className="style-icon">{s.icon}</span>
                  <span className="style-name">{getTemplateName(s)}</span>
                </button>
              ))
          }
        </div>
      </div>

      <div className="panel-section palette-section">
        <h3 className="section-title">{t('palette')}</h3>
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
                <span className="palette-name">{getPaletteLabel(p)}</span>
                <span className="palette-dot" style={{ background: p.a }}></span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
