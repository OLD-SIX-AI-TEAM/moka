import { useRef, useEffect, useState } from "react";

/**
 * 可编辑文本组件
 * @param {Object} props
 * @param {string} props.v - 值
 * @param {Function} props.on - 变更回调
 * @param {Object} props.style - 样式
 * @param {boolean} props.dk - 深色模式
 * @param {boolean} props.block - 块级显示
 */
export function EditableText({ v, on, style, dk = false, block = false }) {
  const ref = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  // 同步 DOM 当值外部变化时
  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current && !isEditing) {
      ref.current.innerText = v ?? "";
    }
  }, [v, isEditing]);

  const Tag = block ? "div" : "span";

  if (!on) {
    return <Tag style={{ ...style, whiteSpace: 'pre-wrap' }}>{v}</Tag>;
  }

  const handleBlur = (e) => {
    setIsEditing(false);
    // 处理 contentEditable 的 HTML 结构
    // Chrome 中回车会产生 <div>text</div> 或 <div><br></div>
    let html = e.currentTarget.innerHTML;
    
    // 将 <br> 和 <div> 标签转换为换行符
    // 先处理 <br> 标签
    html = html.replace(/<br\s*\/?>/gi, '\n');
    
    // 处理 <div> 标签 - 每个 <div> 开始都代表一个新行
    // 但要避免在开头产生多余的换行
    html = html.replace(/<div[^>]*>/gi, '\n');
    html = html.replace(/<\/div>/gi, '');
    
    // 移除其他 HTML 标签
    html = html.replace(/<[^>]*>/g, '');
    
    // 规范化换行符：将多个连续换行符限制为最多2个
    html = html.replace(/\n{3,}/g, '\n\n');
    
    on(html.trim());
  };

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onFocus={() => setIsEditing(true)}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.metaKey) {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      style={{ ...style, outline: "none", cursor: "text", whiteSpace: 'pre-wrap' }}
      className={`ef${dk ? " efdk" : ""}`}
    />
  );
}

/**
 * 可编辑标签组件
 * @param {Object} props
 * @param {string} props.text - 标签文本
 * @param {string} props.c - 颜色
 * @param {Function} props.on - 变更回调
 */
export function EditableTag({ text, c, on }) {
  if (!on) {
    return (
      <span
        style={{
          fontSize: 11,
          color: c,
          border: `1px solid ${c}`,
          borderRadius: 3,
          padding: "2px 7px",
          fontWeight: 700,
        }}
      >
        #{text}
      </span>
    );
  }

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      <span style={{ fontSize: 11, color: c, fontWeight: 700 }}>#</span>
      <EditableText
        v={text}
        on={on}
        style={{
          fontSize: 11,
          color: c,
          border: `1px solid ${c}`,
          borderRadius: 3,
          padding: "2px 6px",
          fontWeight: 700,
          minWidth: 20,
        }}
      />
    </span>
  );
}
