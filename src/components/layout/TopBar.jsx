/** @jsxImportSource react */
export function TopBar({ mode, setMode, theme, toggleTheme, isLight }) {
  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <div className="brand">
          <span className="brand-icon">✨</span>
          <h1 className="brand-text">排版生成器</h1>
        </div>
      </div>
      
      <div className="top-bar-center">
        <div className="mode-switcher">
          <button 
            className={`mode-pill ${mode === "single" ? "active" : ""}`}
            onClick={() => setMode("single")}
          >
            📄 整页版
          </button>
          <button 
            className={`mode-pill ${mode === "split" ? "active" : ""}`}
            onClick={() => setMode("split")}
          >
            📑 分页版
          </button>
        </div>
      </div>
      
      <div className="top-bar-right">
        <div className="theme-toggle-header">
          <button
            className={`theme-btn-header ${isLight ? "active" : ""}`}
            onClick={() => isLight || toggleTheme()}
            title="亮色主题"
          >
            ☀️
          </button>
          <button
            className={`theme-btn-header ${!isLight ? "active" : ""}`}
            onClick={() => !isLight || toggleTheme()}
            title="暗色主题"
          >
            🌙
          </button>
        </div>
      </div>
    </header>
  );
}
