/** @jsxImportSource react */
export function ThemeToggle({ theme, onToggle, isLight }) {
  return (
    <div className="theme-toggle">
      <button
        className={`theme-btn ${isLight ? "active" : ""}`}
        onClick={() => isLight || onToggle()}
        title="亮色主题"
      >
        ☀️
      </button>
      <button
        className={`theme-btn ${!isLight ? "active" : ""}`}
        onClick={() => !isLight || onToggle()}
        title="暗色主题"
      >
        🌙
      </button>
    </div>
  );
}
