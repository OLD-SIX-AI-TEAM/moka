import { useRef, useEffect, useState } from "react";

/**
 * 解码 HTML 实体
 * @param {string} text - 包含 HTML 实体的文本
 * @returns {string} 解码后的文本
 */
function decodeHtmlEntities(text) {
  if (!text || typeof text !== 'string') return text;
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

/**
 * 可编辑文本组件
 * @param {Object} props
 * @param {string} props.v - 值
 * @param {Function} props.on - 变更回调
 * @param {Object} props.style - 样式
 * @param {boolean} props.dk - 深色模式
 * @param {boolean} props.block - 块级显示
 * @param {boolean} props.draggable - 是否可拖拽移动位置
 * @param {Function} props.onStyleChange - 样式变更回调（用于拖拽位置）
 */
export function EditableText({ v, on, style, dk = false, block = false, draggable = false, onStyleChange }) {
  const ref = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const clickPositionRef = useRef(null);
  
  // 拖拽相关状态
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragStartMargin = useRef({ marginLeft: 0, marginTop: 0 });
  const dragStartTime = useRef(0);
  const hasDragged = useRef(false);
  const styleRef = useRef(style);
  
  // 更新 styleRef
  useEffect(() => {
    styleRef.current = style;
  }, [style]);
  
  // 拖拽阈值：超过这个距离或时间才认为是拖拽
  const DRAG_THRESHOLD = 3; // 像素
  const CLICK_TIME_THRESHOLD = 200; // 毫秒

  // 同步 DOM 当值外部变化时
  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current && !isEditing) {
      const decodedValue = decodeHtmlEntities(v) ?? "";
      // 只在内容真正变化时才更新，避免不必要的重渲染
      if (ref.current.innerText !== decodedValue) {
        ref.current.innerText = decodedValue;
      }
    }
  }, [v, isEditing]);

  const Tag = block ? "div" : "span";

  if (!on) {
    return <Tag style={{ ...style, whiteSpace: 'pre-wrap' }}>{decodeHtmlEntities(v)}</Tag>;
  }

  const handleBlur = (e) => {
    setIsEditing(false);
    // 使用 innerText 获取纯文本，自动处理 HTML 实体解码
    let text = e.currentTarget.innerText;
    
    // 规范化换行符：将多个连续换行符限制为最多2个
    text = text.replace(/\n{3,}/g, '\n\n');
    
    on(text.trim());
  };

  // 处理鼠标按下 - 记录起始状态
  const handleMouseDown = (e) => {
    // 保存点击位置，用于 focus 后设置光标
    clickPositionRef.current = {
      x: e.clientX,
      y: e.clientY
    };
    
    // 如果已经在编辑状态，直接设置光标位置到点击位置
    if (isEditing && ref.current) {
      try {
        const selection = window.getSelection();
        if (selection) {
          const range = document.caretRangeFromPoint?.(e.clientX, e.clientY) || 
                       document.caretPositionFromPoint?.(e.clientX, e.clientY);
          
          if (range) {
            selection.removeAllRanges();
            if (range.selectNode) {
              // caretRangeFromPoint 返回的是 Range
              selection.addRange(range);
            } else if (range.offsetNode) {
              // caretPositionFromPoint 返回的是 CaretPosition
              const newRange = document.createRange();
              newRange.setStart(range.offsetNode, range.offset);
              newRange.collapse(true);
              selection.addRange(newRange);
            }
          }
        }
      } catch (err) {
        console.warn('设置光标位置失败:', err);
      }
    }
    
    // 如果可拖拽且不在编辑状态，准备拖拽
    if (draggable && !isEditing && onStyleChange) {
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      dragStartMargin.current = {
        marginLeft: parseInt(style.marginLeft) || 0,
        marginTop: parseInt(style.marginTop) || 0,
      };
      dragStartTime.current = Date.now();
      hasDragged.current = false;
      
      // 添加全局鼠标移动和释放监听
      const handleGlobalMouseMove = (moveEvent) => {
        const deltaX = moveEvent.clientX - dragStartPos.current.x;
        const deltaY = moveEvent.clientY - dragStartPos.current.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // 如果移动距离超过阈值，开始拖拽
        if (distance > DRAG_THRESHOLD) {
          hasDragged.current = true;
          
          if (!isDragging) {
            setIsDragging(true);
            document.body.style.cursor = 'move';
            document.body.style.userSelect = 'none';
          }
          
          onStyleChange({
            ...styleRef.current,
            marginLeft: `${dragStartMargin.current.marginLeft + deltaX}px`,
            marginTop: `${dragStartMargin.current.marginTop + deltaY}px`,
          });
        }
      };

      const handleGlobalMouseUp = (upEvent) => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        
        const clickDuration = Date.now() - dragStartTime.current;
        
        // 如果没有拖拽且点击时间很短，认为是点击
        if (!hasDragged.current && clickDuration < CLICK_TIME_THRESHOLD) {
          // 这是一个点击，不需要处理，让 onFocus 触发
        } else if (isDragging) {
          // 拖拽结束，应用最终位置
          const deltaX = upEvent.clientX - dragStartPos.current.x;
          const deltaY = upEvent.clientY - dragStartPos.current.y;
          
          onStyleChange({
            ...styleRef.current,
            marginLeft: `${dragStartMargin.current.marginLeft + deltaX}px`,
            marginTop: `${dragStartMargin.current.marginTop + deltaY}px`,
          });
        }
        
        setIsDragging(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
      
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp, { once: true });
    }
  };

  // 在 focus 时设置光标位置
  const handleFocus = () => {
    setIsEditing(true);
    
    // 使用 setTimeout 确保 DOM 已更新
    setTimeout(() => {
      if (!ref.current) return;
      
      const selection = window.getSelection();
      if (!selection) return;
      
      // 如果有记录的点击位置，尝试设置光标到该位置
      if (clickPositionRef.current) {
        try {
          // 尝试使用 caretPositionFromPoint 或 caretRangeFromPoint
          const range = document.caretRangeFromPoint?.(
            clickPositionRef.current.x, 
            clickPositionRef.current.y
          ) || document.caretPositionFromPoint?.(
            clickPositionRef.current.x, 
            clickPositionRef.current.y
          );
          
          if (range) {
            selection.removeAllRanges();
            if (range.selectNode) {
              // caretRangeFromPoint 返回的是 Range
              selection.addRange(range);
            } else if (range.offsetNode) {
              // caretPositionFromPoint 返回的是 CaretPosition
              const newRange = document.createRange();
              newRange.setStart(range.offsetNode, range.offset);
              newRange.collapse(true);
              selection.addRange(newRange);
            }
            return;
          }
        } catch (e) {
          // 如果设置光标位置失败，回退到默认行为
          console.warn('设置光标位置失败:', e);
        }
      }
      
      // 回退：将光标设置到最后
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }, 0);
  };

  // 合并样式
  const mergedStyle = {
    ...style,
    outline: "none",
    cursor: isDragging ? 'move' : (draggable && !isEditing ? 'grab' : 'text'),
    whiteSpace: 'pre-wrap',
    userSelect: isDragging ? 'none' : 'text',
    transition: isDragging ? 'none' : 'all 0.2s',
  };

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseDown={handleMouseDown}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.metaKey) {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      style={mergedStyle}
      className={`ef${dk ? " efdk" : ""}`}
      title={draggable && !isEditing ? "点击编辑文字，拖拽移动位置" : ""}
    />
  );
}

/**
 * 可编辑标签组件
 * @param {Object} props
 * @param {string} props.text - 标签文本
 * @param {string} props.c - 颜色
 * @param {Function} props.on - 变更回调
 * @param {boolean} props.draggable - 是否可拖拽
 * @param {Function} props.onStyleChange - 样式变更回调
 */
export function EditableTag({ text, c, on, draggable = false, onStyleChange }) {
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
        #{decodeHtmlEntities(text)}
      </span>
    );
  }

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      <span style={{ fontSize: 11, color: c, fontWeight: 700 }}>#</span>
      <EditableText
        v={text}
        on={on}
        draggable={draggable}
        onStyleChange={onStyleChange}
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

export default EditableText;
