import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function LuxuryCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#faf9f7", width: "100%", aspectRatio: "3/4", fontFamily: "'Playfair Display', 'Georgia', serif", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* 金色边框装饰 */}
      <div style={{ position: "absolute", top: 20, left: 20, right: 20, bottom: 20, border: "1px solid rgba(212,175,55,0.3)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 24, left: 24, right: 24, bottom: 24, border: "1px solid rgba(212,175,55,0.15)", pointerEvents: "none" }} />
      
      {/* 角落装饰 */}
      <div style={{ position: "absolute", top: 16, left: 16, width: 30, height: 30, borderTop: "2px solid #d4af37", borderLeft: "2px solid #d4af37" }} />
      <div style={{ position: "absolute", top: 16, right: 16, width: 30, height: 30, borderTop: "2px solid #d4af37", borderRight: "2px solid #d4af37" }} />
      <div style={{ position: "absolute", bottom: 16, left: 16, width: 30, height: 30, borderBottom: "2px solid #d4af37", borderLeft: "2px solid #d4af37" }} />
      <div style={{ position: "absolute", bottom: 16, right: 16, width: 30, height: 30, borderBottom: "2px solid #d4af37", borderRight: "2px solid #d4af37" }} />
      
      {/* 主内容 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px 48px", textAlign: "center" }}>
        {/* 顶部装饰 */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
          <div style={{ width: 80, height: 1, background: "linear-gradient(90deg, transparent, #d4af37)" }} />
          <div style={{ fontSize: 14, color: "#d4af37" }}>✦</div>
          <div style={{ width: 80, height: 1, background: "linear-gradient(90deg, #d4af37, transparent)" }} />
        </div>
        
        {/* 分类 */}
        <div style={{ fontSize: 10, color: "#999", letterSpacing: "6px", marginBottom: 32, fontWeight: 300, textTransform: "uppercase" }}>
          {s.category?.toUpperCase?.() || "LUXURY"}
        </div>
        
        {/* 装饰线 */}
        <div style={{ width: 1, height: 60, background: "linear-gradient(180deg, transparent, #d4af37, transparent)", marginBottom: 32 }} />
        
        {/* 标题 */}
        <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 42, fontWeight: 400, color: "#1a1a1a", lineHeight: 1.2, letterSpacing: "2px", marginBottom: 24, ...ed?.titleStyle }} draggable={!!ed?.updateTitleStyle} onStyleChange={ed?.updateTitleStyle} />
        
        {/* 副标题 */}
        {s.subtitle && (
          <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 14, color: "#666", lineHeight: 1.8, fontStyle: "italic", letterSpacing: "1px", maxWidth: "80%", ...ed?.subtitleStyle }} draggable={!!ed?.updateSubtitleStyle} onStyleChange={ed?.updateSubtitleStyle} />
        )}
        
        {/* 底部装饰 */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 48 }}>
          <div style={{ width: 80, height: 1, background: "linear-gradient(90deg, transparent, #d4af37)" }} />
          <div style={{ fontSize: 14, color: "#d4af37" }}>✦</div>
          <div style={{ width: 80, height: 1, background: "linear-gradient(90deg, #d4af37, transparent)" }} />
        </div>
      </div>
      
      {/* 页码 */}
      <div style={{ position: "absolute", bottom: 32, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ width: i === 0 ? 24 : 6, height: 2, background: i === 0 ? "#d4af37" : "#e0e0e0" }} />
        ))}
      </div>
    </div>
  );
}

export function LuxuryContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#faf9f7", width: "100%", aspectRatio: "3/4", fontFamily: "'Playfair Display', 'Georgia', serif", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* 侧边装饰线 */}
      <div style={{ position: "absolute", left: 32, top: 80, bottom: 80, width: 1, background: "linear-gradient(180deg, transparent, #d4af37, transparent)" }} />
      
      {/* 主内容 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "48px 48px 48px 64px" }}>
        {/* 章节标识 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <div style={{ fontSize: 48, fontWeight: 300, color: "#d4af37", fontFamily: "Georgia, serif" }}>
            {String.fromCharCode(8544 + idx - 1)}
          </div>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #d4af37, transparent)" }} />
          <div style={{ fontSize: 10, color: "#999", letterSpacing: "2px" }}>CHAPTER {String(idx).padStart(2, "0")}</div>
        </div>
        
        {/* 标题 */}
        <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 28, fontWeight: 400, color: "#1a1a1a", lineHeight: 1.3, letterSpacing: "1px", marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid rgba(212,175,55,0.3)", ...ed?.headingStyle }} draggable={!!ed?.updateHeadingStyle} onStyleChange={ed?.updateHeadingStyle} />
        
        {/* 内容 */}
        <div style={{ flex: 1 }}>
          <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 15, color: "#444", lineHeight: 2, textAlign: "justify", ...ed?.textStyle }} draggable={!!ed?.updateTextStyle} onStyleChange={ed?.updateTextStyle} />
        </div>
        
        {/* 引用块 */}
        {s.extra && (
          <div style={{ marginTop: 32, padding: "28px 32px", background: "#f5f4f2", borderLeft: "3px solid #d4af37", position: "relative" }}>
            <div style={{ position: "absolute", top: -12, left: 24, background: "#faf9f7", padding: "0 16px", fontSize: 10, color: "#d4af37", letterSpacing: "3px" }}>✦ NOTE ✦</div>
            <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 14, color: "#555", lineHeight: 1.8, fontStyle: "italic", ...ed?.extraStyle }} draggable={!!ed?.updateExtraStyle} onStyleChange={ed?.updateExtraStyle} />
          </div>
        )}
        
        {/* 底部导航 */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ width: i === idx ? 24 : 6, height: 2, background: i === idx ? "#d4af37" : "#e0e0e0" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function LuxuryEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#1a1a1a", width: "100%", aspectRatio: "3/4", fontFamily: "'Playfair Display', 'Georgia', serif", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px 48px", boxSizing: "border-box" }}>
      {/* 金色边框 */}
      <div style={{ position: "absolute", top: 24, left: 24, right: 24, bottom: 24, border: "1px solid rgba(212,175,55,0.3)" }} />
      <div style={{ position: "absolute", top: 28, left: 28, right: 28, bottom: 28, border: "1px solid rgba(212,175,55,0.15)" }} />
      
      {/* 角落装饰 */}
      <div style={{ position: "absolute", top: 20, left: 20, width: 30, height: 30, borderTop: "2px solid #d4af37", borderLeft: "2px solid #d4af37" }} />
      <div style={{ position: "absolute", top: 20, right: 20, width: 30, height: 30, borderTop: "2px solid #d4af37", borderRight: "2px solid #d4af37" }} />
      <div style={{ position: "absolute", bottom: 20, left: 20, width: 30, height: 30, borderBottom: "2px solid #d4af37", borderLeft: "2px solid #d4af37" }} />
      <div style={{ position: "absolute", bottom: 20, right: 20, width: 30, height: 30, borderBottom: "2px solid #d4af37", borderRight: "2px solid #d4af37" }} />
      
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* 装饰 */}
        <div style={{ fontSize: 48, color: "#d4af37", marginBottom: 32, opacity: 0.8 }}>◆</div>
        
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "4px", marginBottom: 24 }}>THE FINALE</div>
        
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 32, fontWeight: 400, color: "#fff", marginBottom: 20, letterSpacing: "2px", lineHeight: 1.3, ...ed?.ctaStyle }} draggable={!!ed?.updateCtaStyle} onStyleChange={ed?.updateCtaStyle} />
        
        <div style={{ width: 60, height: 1, background: "#d4af37", margin: "24px auto" }} />
        
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 32, fontStyle: "italic", letterSpacing: "1px", ...ed?.subStyle }} draggable={!!ed?.updateSubStyle} onStyleChange={ed?.updateSubStyle} />
        
        {/* 标签 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginBottom: 32 }}>
          {s.tags.map((t, i) => (
            <span key={i} style={{ fontSize: 11, color: "#d4af37", letterSpacing: "2px" }}>
              <EditableTag text={t} c="#d4af37" on={ed?.tag?.(i)} />
            </span>
          ))}
        </div>
        
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "3px" }}>— EXQUISITE CURATION —</div>
      </div>
    </div>
  );
}
