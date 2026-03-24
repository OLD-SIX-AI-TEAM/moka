/** @jsxImportSource react */
export function ModeToggle({ mode, palette, onModeChange }) {
  const modes = [
    { id: "single", label: "📄 整页版", desc: "A4纸比例排版" },
    { id: "split", label: "📑 分页版", desc: "小红书多图卡片" },
  ];

  return (
    <div className="mode-toggle">
      {modes.map((m) => (
        <button
          key={m.id}
          className={`mode-btn ${mode === m.id ? "active" : ""}`}
          onClick={() => onModeChange(m.id)}
          style={{ "--theme-color": palette.a }}
        >
          <span className="mode-icon">{m.label.split(" ")[0]}</span>
          <span className="mode-text">{m.label.split(" ")[1]}</span>
          <span className="mode-desc">{m.desc}</span>
        </button>
      ))}
    </div>
  );
}
