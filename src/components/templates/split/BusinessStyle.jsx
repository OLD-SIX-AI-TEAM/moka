import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function BusinessCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: "'Georgia', 'Times New Roman', serif", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* 报纸风格头部 */}
      <div style={{ background: "#1a1a2e", padding: "16px 24px", borderBottom: `3px solid ${a}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: "4px" }}>THE DAILY BRIEF</div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>VOL. CXXIV NO. 42</div>
          </div>
        </div>
      </div>
      
      {/* 分类标签 */}
      <div style={{ padding: "12px 24px", borderBottom: "1px solid #eee", display: "flex", gap: 20 }}>
        <span style={{ fontSize: 10, color: "#999", letterSpacing: "2px" }}>MARKETS</span>
        <span style={{ fontSize: 10, color: a, fontWeight: 700, letterSpacing: "2px", borderBottom: `2px solid ${a}` }}>{s.category?.toUpperCase?.() || "BUSINESS"}</span>
        <span style={{ fontSize: 10, color: "#999", letterSpacing: "2px" }}>TECH</span>
        <span style={{ fontSize: 10, color: "#999", letterSpacing: "2px" }}>OPINION</span>
      </div>
      
      {/* 主内容 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 28px" }}>
        {/* 头条样式标题 */}
        <div style={{ borderBottom: `4px double ${a}`, paddingBottom: 20, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ padding: "4px 10px", background: a, color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: "1px" }}>BREAKING</div>
            <div style={{ fontSize: 10, color: "#999" }}>5 MIN READ</div>
          </div>
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 36, fontWeight: 800, color: "#111", lineHeight: 1.1, letterSpacing: "-0.5px", ...ed?.titleStyle }} draggable={!!ed?.updateTitleStyle} onStyleChange={ed?.updateTitleStyle} />
        </div>
        
        {/* 副标题 */}
        <div style={{ flex: 1 }}>
          {s.subtitle && (
            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ width: 1, background: "#ddd" }} />
              <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 16, color: "#444", lineHeight: 1.7, fontStyle: "italic", ...ed?.subtitleStyle }} draggable={!!ed?.updateSubtitleStyle} onStyleChange={ed?.updateSubtitleStyle} />
            </div>
          )}
        </div>
        
        {/* 底部信息 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 24, paddingTop: 16, borderTop: "1px solid #eee" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✍️</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#111" }}>Editorial Team</div>
              <div style={{ fontSize: 9, color: "#999" }}>Senior Correspondent</div>
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{ width: i === 0 ? 28 : 8, height: 8, background: i === 0 ? a : "#ddd" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BusinessContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#fafafa", width: "100%", aspectRatio: "3/4", fontFamily: "'Georgia', 'Times New Roman', serif", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* 页面头部 */}
      <div style={{ padding: "20px 24px", borderBottom: "2px solid #1a1a2e", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff" }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", letterSpacing: "2px" }}>THE DAILY BRIEF</div>
        <div style={{ fontSize: 10, color: "#999" }}>SECTION {String(idx).padStart(2, "0")}</div>
      </div>
      
      {/* 主内容 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "28px 24px" }}>
        {/* 章节标题卡片 */}
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderLeft: `4px solid ${a}`, padding: "20px", marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <div style={{ width: 48, height: 48, background: a, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20, fontWeight: 800 }}>{idx}</div>
            <div style={{ flex: 1, height: 1, background: "#eee" }} />
            <div style={{ fontSize: 10, color: "#999", letterSpacing: "1px" }}>{String(idx).padStart(2, "0")} / {String(total - 2).padStart(2, "0")}</div>
          </div>
          <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 22, fontWeight: 700, color: "#111", lineHeight: 1.3, ...ed?.headingStyle }} draggable={!!ed?.updateHeadingStyle} onStyleChange={ed?.updateHeadingStyle} />
        </div>
        
        {/* 正文内容 */}
        <div style={{ flex: 1, background: "#fff", border: "1px solid #e0e0e0", padding: "24px", display: "flex", flexDirection: "column" }}>
          <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#333", lineHeight: 1.9, ...ed?.textStyle }} draggable={!!ed?.updateTextStyle} onStyleChange={ed?.updateTextStyle} />
          
          {/* 引用块 */}
          {s.extra && (
            <div style={{ marginTop: 24, padding: "20px 24px", background: "#f8f9ff", borderLeft: `4px solid ${a}`, position: "relative" }}>
              <div style={{ position: "absolute", top: 8, left: 12, fontSize: 48, color: `${a}20`, fontFamily: "Georgia, serif", lineHeight: 1 }}>"</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: a, letterSpacing: "1px", marginBottom: 8 }}>ANALYST INSIGHT</div>
              <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 13, color: "#444", lineHeight: 1.7, fontStyle: "italic", ...ed?.extraStyle }} draggable={!!ed?.updateExtraStyle} onStyleChange={ed?.updateExtraStyle} />
            </div>
          )}
        </div>
        
        {/* 底部导航 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20, padding: "16px", background: "#fff", border: "1px solid #e0e0e0" }}>
          <div style={{ fontSize: 10, color: "#999", letterSpacing: "1px" }}>CONTINUED</div>
          <div style={{ flex: 1, height: 2, background: "#eee" }} />
          <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{ width: i === idx ? 28 : 8, height: 8, background: i === idx ? a : "#ddd" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BusinessEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#1a1a2e", width: "100%", aspectRatio: "3/4", fontFamily: "'Georgia', 'Times New Roman', serif", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 32px", boxSizing: "border-box" }}>
      {/* 装饰线 */}
      <div style={{ position: "absolute", top: 40, left: 32, right: 32, height: 1, background: "rgba(255,255,255,0.1)" }} />
      <div style={{ position: "absolute", bottom: 40, left: 32, right: 32, height: 1, background: "rgba(255,255,255,0.1)" }} />
      
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* 装饰图标 */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 32 }}>
          <div style={{ width: 60, height: 1, background: a }} />
          <div style={{ fontSize: 24, color: a }}>◆</div>
          <div style={{ width: 60, height: 1, background: a }} />
        </div>
        
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "4px", marginBottom: 24 }}>END OF REPORT</div>
        
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 16, lineHeight: 1.3, ...ed?.ctaStyle }} draggable={!!ed?.updateCtaStyle} onStyleChange={ed?.updateCtaStyle} />
        
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", marginBottom: 32, lineHeight: 1.6, ...ed?.subStyle }} draggable={!!ed?.updateSubStyle} onStyleChange={ed?.updateSubStyle} />
        
        {/* 标签 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 32 }}>
          {s.tags.map((t, i) => (
            <span key={i} style={{ padding: "6px 14px", border: `1px solid ${a}60`, fontSize: 11, color: "#fff", letterSpacing: "1px" }}>
              <EditableTag text={t} c="#fff" on={ed?.tag?.(i)} noBorder />
            </span>
          ))}
        </div>
        
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "2px" }}>© 2024 THE DAILY BRIEF. ALL RIGHTS RESERVED.</div>
      </div>
    </div>
  );
}
