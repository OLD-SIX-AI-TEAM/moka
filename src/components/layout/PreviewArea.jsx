/** @jsxImportSource react */
import { useState, useRef, useCallback, useEffect } from "react";
import { Dots } from "../common/Icons";
import { AIStyleRenderer } from "../AIStyleRenderer";

export function PreviewArea({
  mode,
  cardData,
  aiSingleDesign,
  slides,
  slideIdx,
  loading,
  cardRef,
  CardRenderer,
  singleEd,
  sectionDrag,
  aiSingleEd,
  aiSingleEmojiEditor,
  borderRadius,
  renderSlide,
  makeSlideEd,
  slideRefs,
  onSlideChange,
  exporting,
  expMsg,
  h2cOk,
  onExportSingle,
  onExportSlide,
  onExportAll,
}) {
  const hasContent = mode === "single"
    ? (cardData || aiSingleDesign)
    : slides;

  // 整页预览宽度拖拽
  const [cardWidth, setCardWidth] = useState(588);
  const isDraggingRef = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  // 计算并显示当前图片的横纵比（1:X 格式）
  const [aspectRatio, setAspectRatio] = useState(null);

  useEffect(() => {
    if (mode === "single" && hasContent && cardRef?.current) {
      const updateAspectRatio = () => {
        const el = cardRef.current;
        if (el) {
          const ratio = el.offsetHeight / el.offsetWidth;
          setAspectRatio(Math.round(ratio * 10) / 10);
        }
      };

      updateAspectRatio();

      // 使用 ResizeObserver 监听尺寸变化
      const resizeObserver = new ResizeObserver(() => {
        updateAspectRatio();
      });

      resizeObserver.observe(cardRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    } else {
      setAspectRatio(null);
    }
  }, [mode, hasContent, cardWidth, cardRef]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const delta = e.clientX - dragStartX.current;
      const newWidth = Math.max(320, Math.min(900, dragStartWidth.current + delta * 2));
      setCardWidth(newWidth);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleDragStart = useCallback((e) => {
    isDraggingRef.current = true;
    dragStartX.current = e.clientX;
    dragStartWidth.current = cardWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
    e.stopPropagation();
  }, [cardWidth]);

  return (
    <div className="preview-column">
      <div className="preview-header">
        <span className="preview-title">预览</span>
        
        {mode === "single" && aspectRatio !== null && (
          <span className="aspect-ratio-badge">
            1:{aspectRatio}
          </span>
        )}
        
        <div className="preview-actions">
          {expMsg && (
            <span style={{ 
              fontSize: '13px', 
              color: expMsg.startsWith("✓") ? '#4a7c59' : 'var(--text-muted)',
              fontWeight: 500
            }}>
              {expMsg}
            </span>
          )}
          
          {mode === "single" && hasContent && (
            <>
              <button
                className="export-btn outline"
                onClick={() => onExportSingle("hd")}
                disabled={exporting || !h2cOk}
              >
                高清
              </button>
              <button
                className="export-btn primary"
                onClick={() => onExportSingle("ultra")}
                disabled={exporting || !h2cOk}
              >
                超清 4K
              </button>
            </>
          )}
          
          {mode === "split" && hasContent && (
            <>
              <button
                className="export-btn outline"
                onClick={() => onExportSlide(slideIdx, "hd")}
                disabled={exporting || !h2cOk}
              >
                当前页
              </button>
              <button
                className="export-btn primary"
                onClick={onExportAll}
                disabled={exporting || !h2cOk}
              >
                导出全部
              </button>
            </>
          )}
        </div>
      </div>

      <div className="preview-area">
        {loading && (
          <div className="loading-content">
            <span className="loading-icon">✨</span>
            <span className="loading-text">AI 正在生成排版...</span>
          </div>
        )}
        
        {!loading && !hasContent && (
          <div className="empty-content">
            <span className="empty-icon">{mode === "single" ? "🖼️" : "📑"}</span>
            <p className="empty-title">
              {mode === "single" ? "整页排版预览" : "分页卡片预览"}
            </p>
            <p className="empty-desc">在右侧输入文案并点击生成</p>
          </div>
        )}
        
        {/* 整页版 */}
        {!loading && mode === "single" && hasContent && (
          <div className="single-view-container">
            <div className="template-hint">
              <span>左侧切换模板和配色 ←</span>
            </div>
            {cardData && (
              <div className="card-container" style={{ width: cardWidth }}>
                <div
                  ref={cardRef}
                  className="card-wrapper"
                  style={{ borderRadius }}
                >
                  <CardRenderer d={cardData} ed={singleEd} drag={sectionDrag} />
                </div>
                <div
                  className="resize-handle"
                  onMouseDown={handleDragStart}
                  title="拖拽调整宽度"
                />
                <div className="resize-hint">
                  <span>↔ 拖拽调整宽度</span>
                </div>
                <div className="edit-hint">
                  <span>← 点击文字可编辑</span>
                </div>
              </div>
            )}

            {aiSingleDesign && (
              <div className="card-container" style={{ width: cardWidth }}>
                <div
                  ref={cardRef}
                  className="card-wrapper ai"
                  style={{ borderRadius: 14 }}
                >
                  <AIStyleRenderer design={aiSingleDesign} editor={aiSingleEd} emojiEditor={aiSingleEmojiEditor} />
                </div>
                <div
                  className="resize-handle"
                  onMouseDown={handleDragStart}
                  title="拖拽调整宽度"
                />
                <div className="resize-hint">
                  <span>↔ 拖拽调整宽度</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* 分页版 */}
        {!loading && mode === "split" && slides && (
          <SplitView
            slides={slides}
            slideIdx={slideIdx}
            renderSlide={renderSlide}
            makeSlideEd={makeSlideEd}
            onSlideChange={onSlideChange}
            slideRefs={slideRefs}
          />
        )}
      </div>
    </div>
  );
}

function SplitView({
  slides,
  slideIdx,
  renderSlide,
  makeSlideEd,
  onSlideChange,
  slideRefs
}) {
  return (
    <div className="split-view">
      <div className="slide-container-wrapper">
        <div className="template-hint">
          <span>左侧切换模板和配色 ←</span>
        </div>
        <div className="edit-hint">
          <span>点击文字可编辑 ←</span>
        </div>
        <div className="slide-container">
          {renderSlide(slides[slideIdx], slideIdx, slides.length, makeSlideEd(slideIdx))}
        </div>
      </div>

      <div className="slide-sidebar">
        <button 
          className="nav-arrow nav-arrow-up"
          onClick={() => onSlideChange(Math.max(0, slideIdx - 1))}
          disabled={slideIdx === 0}
        >
          ‹
        </button>
        
        <div className="slide-indicator">
          <span className="current">{slideIdx + 1}</span>
          <span className="separator">/</span>
          <span className="total">{slides.length}</span>
        </div>
        
        <button 
          className="nav-arrow nav-arrow-down"
          onClick={() => onSlideChange(Math.min(slides.length - 1, slideIdx + 1))}
          disabled={slideIdx === slides.length - 1}
        >
          ›
        </button>

        <div className="slide-thumbs">
          {slides.map((s, i) => (
            <div
              key={i}
              className={`slide-thumb${i === slideIdx ? ' active' : ''}`}
              onClick={() => onSlideChange(i)}
            >
              <div className="slide-thumb-inner">
                <div
                  style={{
                    width: 420,
                    height: 560,
                    transform: 'scale(0.1524)',
                    transformOrigin: 'top left',
                  }}
                >
                  {renderSlide(s, i, slides.length, undefined)}
                </div>
              </div>
              <span className="slide-thumb-label">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 隐藏的导出容器 */}
      <div className="export-hidden" aria-hidden="true">
        {slides.map((s, i) => (
          <div key={i} ref={(el) => (slideRefs.current[i] = el)} style={{ width: '420px', height: '560px' }}>
            {renderSlide(s, i, slides.length, undefined)}
          </div>
        ))}
      </div>
    </div>
  );
}
