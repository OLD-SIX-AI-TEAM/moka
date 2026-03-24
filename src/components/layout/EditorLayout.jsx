/** @jsxImportSource react */
export function EditorLayout({ 
  leftPanel, 
  rightPanel,
  className = ""
}) {
  return (
    <div className={`editor-layout ${className}`}>
      <div className="editor-left">
        {leftPanel}
      </div>
      <div className="editor-right">
        {rightPanel}
      </div>
    </div>
  );
}
