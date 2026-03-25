/** @jsxImportSource react */
import { Dots } from "../common/Icons";
import { AIStyleRenderer } from "../AIStyleRenderer";
import "./PreviewPanel.css";

export function PreviewPanel({
  mode,
  singleData,
  slides,
  slideIdx,
  onSlideIdxChange,
  cardData,
  aiSingleDesign,
  aiSplitDesign,
  tpl,
  splitStyle,
  loading,
  exporting,
  expMsg,
  h2cOk,
  onExportSingle,
  onExportSlide,
  onExportAll,
  cardRef,
  slideRefs,
  CardRenderer,
  singleEd,
  makeSlideEd,
  sectionDrag,
  slideDrag,
  renderSlide,
  aiSingleEd,
  makeAiSplitSlideEd,
  borderRadius,
  palette,
}) {
  const isEmpty = mode === "single" 
    ? (!cardData && !aiSingleDesign && !loading)
    : (!slides && !loading);

  return (
    <main className="preview-panel">
      {/* 预览头部 */}
      <header className="preview-header">
        <span className="preview-title">预览</span>
        
        <div className="preview-actions">
          {expMsg && (
            <span className={`exp-msg ${expMsg.startsWith("✓") ? "success" : ""}`}>
              {expMsg}
            </span>
          )}
          
          {mode === "single" && (cardData || aiSingleDesign) && (
            <>
              <button
                className="export-btn secondary"
                onClick={() => onExportSingle("hd")}
                disabled={exporting || !h2cOk}
              >
                {exporting ? <Dots /> : "⬇ 高清"}
              </button>
              <button
                className="export-btn primary"
                onClick={() => onExportSingle("ultra")}
                disabled={exporting || !h2cOk}
              >
                {exporting ? <Dots /> : "⬇ 超清 4K"}
              </button>
            </>
          )}
          
          {mode === "split" && slides && (
            <>
              <button
                className="export-btn secondary"
                onClick={() => onExportSlide(slideIdx, "hd")}
                disabled={exporting || !h2cOk}
              >
                {exporting ? <Dots /> : "⬇ 当前页"}
              </button>
              <button
                className="export-btn primary"
                onClick={onExportAll}
                disabled={exporting || !h2cOk}
              >
                {exporting ? <Dots /> : "⬇ 导出全部"}
              </button>
            </>
          )}
        </div>
      </header>

      {/* 预览内容区域 */}
      <div className="preview-content">
        {isEmpty && <EmptyState mode={mode} />}
        {loading && <LoadingState mode={mode} />}
        
        {/* 整页版预览 */}
        {mode === "single" && !loading && cardData && (
          <div
            ref={cardRef}
            className="card-preview"
            style={{ borderRadius }}
          >
            <CardRenderer d={cardData} ed={singleEd} drag={sectionDrag} />
          </div>
        )}
        
        {mode === "single" && !loading && aiSingleDesign && (
          <div
            ref={cardRef}
            className="card-preview ai"
            style={{ borderRadius: 14 }}
          >
            <AIStyleRenderer design={aiSingleDesign} editor={aiSingleEd} />
          </div>
        )}
        
        {/* 分页版预览 */}
        {mode === "split" && !loading && slides && (
          <SplitPreview
            slides={slides}
            slideIdx={slideIdx}
            palette={palette}
            slideRefs={slideRefs}
            renderSlide={renderSlide}
            makeSlideEd={makeSlideEd}
            slideDrag={slideDrag}
            onSlideIdxChange={onSlideIdxChange}
            aiSplitDesign={aiSplitDesign}
            splitStyle={splitStyle}
            makeAiSplitSlideEd={makeAiSplitSlideEd}
          />
        )}
      </div>
    </main>
  );
}

function EmptyState({ mode }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">{mode === "single" ? "🖼️" : "📑"}</span>
      <span className="empty-text">
        {mode === "single" ? "输入文案，生成排版图" : "输入文案，生成分页卡片"}
      </span>
    </div>
  );
}

function LoadingState({ mode }) {
  return (
    <div className="loading-state">
      <span className="loading-icon">{mode === "single" ? "✦" : "✨"}</span>
      <span className="loading-text">{mode === "single" ? "正在生成..." : "AI正在设计..."}</span>
      <Dots />
    </div>
  );
}

function SplitPreview({
  slides,
  slideIdx,
  palette,
  slideRefs,
  renderSlide,
  makeSlideEd,
  slideDrag,
  onSlideIdxChange,
  aiSplitDesign,
  splitStyle,
  makeAiSplitSlideEd,
}) {
  return (
    <div className="split-preview">
      <div className="slide-nav">
        <button
          className="nav-btn prev"
          onClick={() => onSlideIdxChange(Math.max(0, slideIdx - 1))}
          disabled={slideIdx === 0}
        >
          ‹
        </button>
        
        <div className="slide-viewer">
          <div className="slide-counter">
            {slideIdx + 1} / {slides.length}
          </div>
          <div className="slide-content">
            {renderSlide(slides[slideIdx], slideIdx, slides.length, makeSlideEd(slideIdx))}
          </div>
        </div>
        
        <button
          className="nav-btn next"
          onClick={() => onSlideIdxChange(Math.min(slides.length - 1, slideIdx + 1))}
          disabled={slideIdx === slides.length - 1}
        >
          ›
        </button>
      </div>
      
      <div className="slide-thumbnails">
        {slides.map((s, i) => {
          const isSlideTarget = slideDrag.target === i && slideDrag.active !== i;
          return (
            <div
              key={i}
              draggable
              className={`thumb-item ${slideIdx === i ? "active" : ""} ${isSlideTarget ? "target" : ""}`}
              onClick={() => onSlideIdxChange(i)}
              onDragStart={(e) => {
                slideDrag.start(i);
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(e) => {
                e.preventDefault();
                slideDrag.over(i);
              }}
              onDrop={(e) => {
                e.preventDefault();
                slideDrag.drop();
                if (slideDrag.target !== null) {
                  onSlideIdxChange(
                    slideDrag.target > slideDrag.active
                      ? slideDrag.target - 1
                      : slideDrag.target
                  );
                }
              }}
              onDragEnd={slideDrag.cancel}
            >
              <div className="thumb-preview">
                <div className="thumb-content"
                  style={{
                    width: 375,
                    height: 500,
                    transform: "scale(0.16)",
                  }}
                >
                  {renderSlide(s, i, slides.length, undefined)}
                </div>
              </div>
              <div className="thumb-label">
                {i === 0 ? "封面" : i === slides.length - 1 ? "结尾" : `第${i}页`}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* 隐藏的导出容器 */}
      <div
        className="export-container"
        aria-hidden="true"
        style={{ position: "absolute", left: -9999, top: 0 }}
      >
        {slides.map((s, i) => (
          <div key={i} ref={(el) => (slideRefs.current[i] = el)}>
            {renderSlide(s, i, slides.length, undefined)}
          </div>
        ))}
      </div>
    </div>
  );
}
