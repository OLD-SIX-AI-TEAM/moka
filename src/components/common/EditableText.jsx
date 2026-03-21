import { useRef, useEffect } from "react";

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

  // 同步 DOM 当值外部变化时
  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      ref.current.innerText = v ?? "";
    }
  }, [v]);

  const Tag = block ? "div" : "span";

  if (!on) {
    return <Tag style={style}>{v}</Tag>;
  }

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => on(e.currentTarget.innerText.trim())}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      style={{ ...style, outline: "none", cursor: "text" }}
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
