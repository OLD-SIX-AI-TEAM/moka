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
  const [controlPosition, setControlPosition] = useState({ top: 0, left: 0 });
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const emojiRef = useRef(null);
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
      // 检查点击的是否在emoji容器或控制面板内
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

  // 计算控制面板位置
  const calculateControlPosition = useCallback(() => {
    if (!emojiRef.current) return;
    
    const emojiRect = emojiRef.current.getBoundingClientRect();
    const controlsWidth = 140;
    const controlsHeight = 120;
    const margin = 8;
    
    // 计算首选位置（在emoji下方）
    let top = emojiRect.bottom + margin;
    let left = emojiRect.left;
    
    // 根据对齐方式调整水平位置
    if (align === 'center') {
      left = emojiRect.left + emojiRect.width / 2 - controlsWidth / 2;
    } else if (align === 'right') {
      left = emojiRect.right - controlsWidth;
    }
    
    // 确保不超出视口边界
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // 如果下方空间不够，显示在上方
    if (top + controlsHeight > viewportHeight - margin) {
      top = emojiRect.top - controlsHeight - margin;
    }
    
    // 水平边界检查
    if (left < margin) {
      left = margin;
    } else if (left + controlsWidth > viewportWidth - margin) {
      left = viewportWidth - controlsWidth - margin;
    }
    
    setControlPosition({ top, left });
  }, [align]);

  // 当显示控制面板时计算位置
  useEffect(() => {
    if (showControls && !isEditing) {
      calculateControlPosition();
    }
  }, [showControls, isEditing, calculateControlPosition]);

  // 监听窗口变化和滚动，更新位置
  useEffect(() => {
    if (!showControls || isEditing) return;
    
    const handleUpdate = () => {
      calculateControlPosition();
    };
    
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);
    
    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
    };
  }, [showControls, isEditing, calculateControlPosition]);

  // 拖拽处理 - 使用闭包避免依赖问题
  const handleDragStart = (e) => {
    if (isEditing || !onStyleChange) return;
    
    // 记录起始位置
    const startX = e.clientX;
    const startY = e.clientY;
    const startMarginLeft = parseInt(style.marginLeft) || 0;
    const startMarginTop = parseInt(style.marginTop) || 0;
    
    setIsDragging(true);
    document.body.style.cursor = 'move';
    document.body.style.userSelect = 'none';
    
    // 使用 requestAnimationFrame 优化性能
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
      // 取消未执行的动画帧
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      
      // 应用最终位置
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
    // 只取第一个字符作为emoji
    const newEmoji = value.slice(0, 2); // emoji可能是多字节，取前2个字符
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

  // 调整大小
  const adjustSize = (delta) => {
    const currentSize = parseInt(style.fontSize) || 24;
    const newSize = Math.max(12, Math.min(120, currentSize + delta));
    if (onStyleChange) {
      onStyleChange({ ...style, fontSize: `${newSize}px` });
    }
  };

  // 调整位置
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
            // 延迟隐藏，给鼠标移到控制面板的时间
            hideControlsTimeoutRef.current = setTimeout(() => {
              // 如果鼠标不在控制面板上，才隐藏
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
            ref={emojiRef}
            style={emojiStyle}
            onClick={() => setIsEditing(true)}
            onMouseDown={handleDragStart}
            title={onStyleChange ? "点击编辑emoji，拖拽移动位置" : ""}
          >
            {localEmoji}
          </span>
        )}
      </div>

      {/* 控制面板 - 使用fixed定位，渲染在顶层 */}
      {showControls && !isEditing && (
        <div 
          ref={controlsRef}
          style={{
            position: 'fixed',
            top: controlPosition.top,
            left: controlPosition.left,
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
          {/* 大小控制 */}
          <div style={rowStyle}>
            <span style={labelStyle}>大小</span>
            <button 
              style={buttonStyle}
              onClick={() => adjustSize(-4)}
              title="缩小"
            >
              −
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

          {/* 水平位置 */}
          <div style={rowStyle}>
            <span style={labelStyle}>左右</span>
            <button 
              style={buttonStyle}
              onClick={() => adjustPosition('horizontal', -4)}
              title="左移"
            >
              ←
            </button>
            <span style={{ minWidth: '40px', textAlign: 'center', fontSize: '11px' }}>
              {parseInt(style.marginLeft) || 0}px
            </span>
            <button 
              style={buttonStyle}
              onClick={() => adjustPosition('horizontal', 4)}
              title="右移"
            >
              →
            </button>
          </div>

          {/* 垂直位置 */}
          <div style={rowStyle}>
            <span style={labelStyle}>上下</span>
            <button 
              style={buttonStyle}
              onClick={() => adjustPosition('vertical', -4)}
              title="上移"
            >
              ↑
            </button>
            <span style={{ minWidth: '40px', textAlign: 'center', fontSize: '11px' }}>
              {parseInt(style.marginTop) || 0}px
            </span>
            <button 
              style={buttonStyle}
              onClick={() => adjustPosition('vertical', 4)}
              title="下移"
            >
              ↓
            </button>
          </div>

          {/* 编辑提示 */}
          <div style={{ ...rowStyle, marginTop: '4px', paddingTop: '4px', borderTop: '1px solid #eee' }}>
            <span style={{ fontSize: '10px', color: '#999' }}>
              点击修改，拖拽移动
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default EditableEmoji;
