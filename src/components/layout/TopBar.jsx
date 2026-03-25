/** @jsxImportSource react */
export function TopBar({ mode, setMode, theme, toggleTheme, isLight }) {
  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <div className="brand">
          <span className="brand-icon">✨</span>
          <h1 className="brand-text">文字卡片生成器</h1>
        </div>
      </div>
      
      <div className="top-bar-center">
        <div className="mode-switcher">
          <button 
            className={`mode-pill ${mode === "single" ? "active" : ""}`}
            onClick={() => setMode("single")}
          >
            <span>📄</span>
            <span>整页版</span>
          </button>
          <button 
            className={`mode-pill ${mode === "split" ? "active" : ""}`}
            onClick={() => setMode("split")}
          >
            <span>📑</span>
            <span>分页版</span>
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
            <span>☀️</span>
          </button>
          <button
            className={`theme-btn-header ${!isLight ? "active" : ""}`}
            onClick={() => !isLight || toggleTheme()}
            title="暗色主题"
          >
            <span>🌙</span>
          </button>
        </div>
      </div>
    </header>
  );
}
