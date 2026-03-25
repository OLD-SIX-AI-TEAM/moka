import { useState, useRef, useEffect, useCallback } from "react";

/**
 * 可编辑Emoji组件
 * @param {Object} props
 * @param {string} props.emoji - emoji字符
 * @param {Function} props.onEmojiChange - emoji变更回调
 * @param {Object} props.style - 样式配置 { fontSize, marginBottom, marginTop, marginLeft, marginRight, ... }
 * @param {Function} props.onStyleChange - 样式变更回调
 * @param {boolean} props.disabled - 是否禁用编辑
 * @param {string} props.align - 对齐方式 'left' | 'center' | 'right'
 */
export function EditableEmoji({
  emoji,
  onEmojiChange,
  style = {},
  onStyleChange,
  disabled = false,
  align = 'left'
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [localEmoji, setLocalEmoji] = useState(emoji || "✨");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const controlsRef = useRef(null);

  const hideControlsTimeoutRef = useRef(null);
  const isMouseOverControlsRef = useRef(false);

  // 同步外部emoji变化
  useEffect(() => {
    if (emoji !== undefined && emoji !== localEmoji) {
      setLocalEmoji(emoji);
    }
  }, [emoji]);

  // 点击外部关闭编辑
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isClickInEmoji = containerRef.current?.contains(e.target);
      const isClickInControls = controlsRef.current?.contains(e.target);

      if (!isClickInEmoji && !isClickInControls) {
        setIsEditing(false);
        setShowControls(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 清理延迟隐藏的timeout
  useEffect(() => {
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, []);

  // 聚焦输入框
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // 拖拽处理
  const handleDragStart = (e) => {
    if (isEditing || !onStyleChange) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startMarginLeft = parseInt(style.marginLeft) || 0;
    const startMarginTop = parseInt(style.marginTop) || 0;

    setIsDragging(true);
    document.body.style.cursor = 'move';
    document.body.style.userSelect = 'none';

    let rafId = null;
    let pendingDeltaX = 0;
    let pendingDeltaY = 0;

    const handleMouseMove = (moveEvent) => {
      pendingDeltaX = moveEvent.clientX - startX;
      pendingDeltaY = moveEvent.clientY - startY;

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          onStyleChange({
            ...style,
            marginLeft: `${startMarginLeft + pendingDeltaX}px`,
            marginTop: `${startMarginTop + pendingDeltaY}px`,
          });
        });
      }
    };

    const handleMouseUp = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      onStyleChange({
        ...style,
        marginLeft: `${startMarginLeft + pendingDeltaX}px`,
        marginTop: `${startMarginTop + pendingDeltaY}px`,
      });

      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp, { once: true });

    e.preventDefault();
    e.stopPropagation();
  };

  if (disabled || !onEmojiChange) {
    return (
      <span style={{
        fontSize: style.fontSize || '24px',
        display: 'inline-block',
        ...style
      }}>
        {localEmoji}
      </span>
    );
  }

  const handleEmojiChange = (e) => {
    const value = e.target.value;
    const newEmoji = value.slice(0, 2);
    setLocalEmoji(newEmoji);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (localEmoji !== emoji) {
      onEmojiChange(localEmoji);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  const adjustSize = (delta) => {
    const currentSize = parseInt(style.fontSize) || 24;
    const newSize = Math.max(12, Math.min(120, currentSize + delta));
    if (onStyleChange) {
      onStyleChange({ ...style, fontSize: `${newSize}px` });
    }
  };

  const adjustPosition = (direction, delta) => {
    if (!onStyleChange) return;

    const newStyle = { ...style };
    const prop = direction === 'vertical' ? 'marginTop' : 'marginLeft';
    const currentValue = parseInt(style[prop]) || 0;
    const newValue = currentValue + delta;
    newStyle[prop] = `${newValue}px`;
    onStyleChange(newStyle);
  };

  const containerStyle = {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
    position: 'relative',
    cursor: 'pointer',
  };

  const emojiStyle = {
    fontSize: style.fontSize || '24px',
    lineHeight: 1,
    display: 'inline-block',
    marginTop: style.marginTop || 0,
    marginBottom: style.marginBottom || 0,
    marginLeft: style.marginLeft || 0,
    marginRight: style.marginRight || 0,
    padding: isEditing || showControls ? '4px' : '0',
    borderRadius: '4px',
    border: isEditing || showControls ? '1px dashed #667eea' : '1px solid transparent',
    transition: isDragging ? 'none' : 'all 0.2s',
    minWidth: '20px',
    textAlign: 'center',
    cursor: isEditing ? 'text' : onStyleChange ? 'move' : 'default',
    userSelect: 'none',
    position: 'relative',
  };

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
  };

  const buttonStyle = {
    width: '24px',
    height: '24px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    background: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    transition: 'all 0.2s',
  };

  const labelStyle = {
    fontSize: '11px',
    color: '#666',
    minWidth: '40px',
  };

  return (
    <>
      <div
        ref={containerRef}
        style={containerStyle}
        onMouseEnter={() => {
          if (hideControlsTimeoutRef.current) {
            clearTimeout(hideControlsTimeoutRef.current);
            hideControlsTimeoutRef.current = null;
          }
          setShowControls(true);
        }}
        onMouseLeave={() => {
          if (!isEditing) {
            hideControlsTimeoutRef.current = setTimeout(() => {
              if (!isMouseOverControlsRef.current) {
                setShowControls(false);
              }
            }, 100);
          }
        }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={localEmoji}
            onChange={handleEmojiChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{
              ...emojiStyle,
              width: '60px',
              textAlign: 'center',
              border: '2px solid #667eea',
              outline: 'none',
              background: 'white',
            }}
          />
        ) : (
          <span
            style={emojiStyle}
            onClick={() => setIsEditing(true)}
            onMouseDown={handleDragStart}
            title={onStyleChange ? "点击编辑emoji，拖拽移动位置" : ""}
          >
            {localEmoji}
          </span>
        )}

        {showControls && !isEditing && (
          <div
            ref={controlsRef}
            style={{
              position: 'absolute',
              top: '100%',
              left: align === 'center' ? '50%' : align === 'right' ? 'auto' : 0,
              right: align === 'right' ? 0 : 'auto',
              transform: align === 'center' ? 'translateX(-50%)' : 'none',
              marginTop: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              padding: '8px',
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              zIndex: 99999,
              minWidth: '140px',
            }}
            onMouseEnter={() => {
              isMouseOverControlsRef.current = true;
              if (hideControlsTimeoutRef.current) {
                clearTimeout(hideControlsTimeoutRef.current);
                hideControlsTimeoutRef.current = null;
              }
              setShowControls(true);
            }}
            onMouseLeave={() => {
              isMouseOverControlsRef.current = false;
              hideControlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
              }, 100);
            }}
          >
            <div style={rowStyle}>
              <span style={labelStyle}>大小</span>
              <button
                style={buttonStyle}
                onClick={() => adjustSize(-4)}
                title="缩小"
              >
                -
              </button>
              <span style={{ minWidth: '40px', textAlign: 'center', fontSize: '11px' }}>
                {parseInt(style.fontSize) || 24}px
              </span>
              <button
                style={buttonStyle}
                onClick={() => adjustSize(4)}
                title="放大"
              >
                +
              </button>
            </div>

            <div style={rowStyle}>
              <span style={labelStyle}>左右</span>
              <button
                style={buttonStyle}
                onClick={() => adjustPosition('horizontal', -4)}
                title="左移"
              >
                &larr;
              </button>
              <span style={{ minWidth: '40px', textAlign: 'center', fontSize: '11px' }}>
                {parseInt(style.marginLeft) || 0}px
              </span>
              <button
                style={buttonStyle}
                onClick={() => adjustPosition('horizontal', 4)}
                title="右移"
              >
                &rarr;
              </button>
            </div>

            <div style={rowStyle}>
              <span style={labelStyle}>上下</span>
              <button
                style={buttonStyle}
                onClick={() => adjustPosition('vertical', -4)}
                title="上移"
              >
                &uarr;
              </button>
              <span style={{ minWidth: '40px', textAlign: 'center', fontSize: '11px' }}>
                {parseInt(style.marginTop) || 0}px
              </span>
              <button
                style={buttonStyle}
                onClick={() => adjustPosition('vertical', 4)}
                title="下移"
              >
                &darr;
              </button>
            </div>

            <div style={{ ...rowStyle, marginTop: '4px', paddingTop: '4px', borderTop: '1px solid #eee' }}>
              <span style={{ fontSize: '10px', color: '#999' }}>
                点击修改，拖拽移动
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default EditableEmoji;
