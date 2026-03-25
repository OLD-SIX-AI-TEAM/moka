/** @jsxImportSource react */
import { useState, useRef, useCallback, useEffect } from "react";
import { Dots } from "../common/Icons";
import { AIStyleRenderer } from "../AIStyleRenderer";
import { useLanguage } from "../../hooks/useLanguage";

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
  streamContent,
}) {
  const { t } = useLanguage();
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
        <span className="preview-title">{t('preview')}</span>
        
        {mode === "single" && aspectRatio !== null && (
          <span className="aspect-ratio-badge">
            1:{aspectRatio}
          </span>
        )}
        
        <div className="preview-actions">
          {expMsg && (
            <span style={{ 
              fontSize: '12px', 
              color: expMsg.startsWith("✓") ? 'var(--theme-primary)' : 'var(--text-muted)',
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
                {t('hd')}
              </button>
              <button
                className="export-btn primary"
                onClick={() => onExportSingle("ultra")}
                disabled={exporting || !h2cOk}
              >
                {t('ultra')}
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
                {t('current')}
              </button>
              <button
                className="export-btn primary"
                onClick={onExportAll}
                disabled={exporting || !h2cOk}
              >
                {t('exportAll')}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="preview-area">
        {loading && (
          <div className="loading-content">
            {streamContent && (
              <div className="stream-content-overlay">
                <pre>{streamContent}</pre>
              </div>
            )}
            <div className="loading-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--theme-primary)" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <span className="loading-text">{t('generating')}</span>
          </div>
        )}
        
        {!loading && !hasContent && (
          <div className="empty-content">
            <div className="empty-icon">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <p className="empty-title">
              {mode === "single" ? t('singlePagePreview') : t('multiPagePreview')}
            </p>
            <p className="empty-desc">{t('emptyDesc')}</p>
          </div>
        )}
        
        {/* 整页版 */}
        {!loading && mode === "single" && hasContent && (
          <div className="single-view-container">
            <div className="template-hint">
              <span>← {t('switchTemplate')}</span>
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
                  title={t('dragToResize')}
                />
                <div className="resize-hint">
                  <span>{t('dragToResize')} ↔</span>
                </div>
                <div className="edit-hint">
                  <span>← {t('clickToEdit')} </span>
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
                  title={t('dragToResize')}
                />
                <div className="resize-hint">
                  <span>{t('dragToResize')} ↔</span>
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
            t={t}
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
  slideRefs,
  t
}) {
  return (
    <div className="split-view">
      <div className="slide-container-wrapper">
        <div className="template-hint">
          <span>← {t('switchTemplate')}</span>
        </div>
        <div className="edit-hint">
          <span>{t('clickToEdit')} →</span>
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
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
