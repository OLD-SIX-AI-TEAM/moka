import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function TravelCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#f5f0e8", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", top: 20, right: 20, width: 100, height: 100, border: `2px dashed ${a}40`, borderRadius: "50%", transform: "rotate(15deg)" }} />
      <div style={{ position: "absolute", bottom: 40, left: 20, fontSize: 120, opacity: 0.05, transform: "rotate(-20deg)" }}>✈</div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "36px 32px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 24, height: 24, background: a, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12 }}>★</div>
          <span style={{ fontSize: 10, color: a, letterSpacing: "3px", fontWeight: 600 }}>{s.category?.toUpperCase?.() || ""}</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: -20, top: 0, bottom: 0, width: 3, background: a }} />
            <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 32, fontWeight: 800, color: "#1a365d", lineHeight: 1.2, paddingLeft: 16, marginBottom: 16, ...ed?.titleStyle }} draggable={!!ed?.updateTitleStyle} onStyleChange={ed?.updateTitleStyle} />
          </div>
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 15, color: "#4a5568", lineHeight: 1.7, paddingLeft: 16, ...ed?.subtitleStyle }} draggable={!!ed?.updateSubtitleStyle} onStyleChange={ed?.updateSubtitleStyle} />}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 28 : 8, height: 8, borderRadius: 4, background: i === 0 ? a : `${a}30` }} />)}
        </div>
      </div>
    </div>
  );
}

export function TravelContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#f5f0e8", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `repeating-linear-gradient(90deg, ${a}, ${a} 10px, transparent 10px, transparent 20px)` }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "28px 24px", position: "relative" }}>
        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          <div style={{ minWidth: 60, height: 60, background: "#fff", border: `2px solid ${a}30`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "2px 2px 0 rgba(0,0,0,0.1)", transform: "rotate(-2deg)" }}>
            <span style={{ fontSize: 24 }}>{["📍", "🏨", "🍽️", "📸", "🎫"][(idx - 1) % 5]}</span>
            <span style={{ fontSize: 8, color: "#888", marginTop: 2 }}>DAY {idx}</span>
          </div>
          <div style={{ flex: 1, paddingTop: 8 }}>
            <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 20, fontWeight: 800, color: "#1a365d", lineHeight: 1.3, marginBottom: 8, ...ed?.headingStyle }} draggable={!!ed?.updateHeadingStyle} onStyleChange={ed?.updateHeadingStyle} />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 30, height: 2, background: a }} />
              <span style={{ fontSize: 10, color: "#999" }}>Page {idx} of {total}</span>
            </div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#4a5568", lineHeight: 1.85, ...ed?.textStyle }} draggable={!!ed?.updateTextStyle} onStyleChange={ed?.updateTextStyle} />
        </div>
        {s.extra && (
          <div style={{ marginTop: 16, padding: "14px 18px", background: "#fff9e6", border: `1px dashed ${a}`, boxShadow: "2px 2px 0 rgba(0,0,0,0.05)", transform: "rotate(1deg)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 14 }}>💡</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: a, letterSpacing: "1px" }}>TRAVEL TIP</span>
            </div>
            <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 13, color: "#5a4a3a", lineHeight: 1.7, ...ed?.extraStyle }} draggable={!!ed?.updateExtraStyle} onStyleChange={ed?.updateExtraStyle} />
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 28 : 8, height: 8, borderRadius: 4, background: i === idx ? a : `${a}30` }} />)}
        </div>
      </div>
    </div>
  );
}

export function TravelEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#f5f0e8", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "36px 28px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `repeating-linear-gradient(90deg, ${a}, ${a} 10px, transparent 10px, transparent 20px)` }} />
      <div style={{ position: "absolute", bottom: 20, right: 20, width: 80, height: 80, border: `2px dashed ${a}30`, borderRadius: "50%", transform: "rotate(10deg)" }} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 20 }}>
          <span style={{ fontSize: 32, transform: "rotate(-15deg)" }}>🌍</span>
          <span style={{ fontSize: 32, transform: "rotate(15deg)" }}>✈</span>
          <span style={{ fontSize: 32, transform: "rotate(-10deg)" }}>🧳</span>
        </div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 24, fontWeight: 800, color: "#1a365d", marginBottom: 12, lineHeight: 1.3, ...ed?.ctaStyle }} draggable={!!ed?.updateCtaStyle} onStyleChange={ed?.updateCtaStyle} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "#4a5568", marginBottom: 24, lineHeight: 1.6, ...ed?.subStyle }} draggable={!!ed?.updateSubStyle} onStyleChange={ed?.updateSubStyle} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => <span key={i} style={{ padding: "6px 14px", background: "#fff", border: `1px solid ${a}40`, borderRadius: 4, fontSize: 12, color: a, boxShadow: "2px 2px 0 rgba(0,0,0,0.08)" }}><EditableTag text={`#${t}`} c={a} on={ed?.tag?.(i)} /></span>)}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <div style={{ width: 20, height: 1, background: `${a}40` }} />
          <span style={{ fontSize: 10, color: "#999", letterSpacing: "2px" }}>THE END</span>
          <div style={{ width: 20, height: 1, background: `${a}40` }} />
        </div>
      </div>
    </div>
  );
}
