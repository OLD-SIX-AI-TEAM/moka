import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function KoreanCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: "50%", height: "100%", background: `linear-gradient(135deg, ${a}15 0%, transparent 60%)` }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 28px", position: "relative" }}>
        <div style={{ position: "absolute", top: 20, right: 20, width: 80, height: 80, background: `${a}10`, borderRadius: "50%" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, background: a, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <span style={{ fontSize: 24 }}>{s.emoji}</span>
          </div>
          <span style={{ fontSize: 11, color: a, letterSpacing: "2px", fontWeight: 700 }}>{s.category.toUpperCase()}</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 34, fontWeight: 800, color: "#1a1a1a", lineHeight: 1.2, marginBottom: 16 }} />
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 15, color: "#555", lineHeight: 1.7 }} />}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1, height: 2, background: `${a}30` }} />
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 28 : 6, height: 4, borderRadius: 2, background: i === 0 ? a : "#e5e5e5" }} />)}
        </div>
      </div>
    </div>
  );
}

export function KoreanContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ width: "25%", background: a, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: "rgba(255,255,255,0.3)" }} />
          <span style={{ fontSize: 40, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}>{["💜", "💗", "💙", "💚", "🧡"][(idx - 1) % 5]}</span>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.8)", letterSpacing: "1px", marginTop: 8 }}>CHAPTER</div>
        </div>
        <div style={{ flex: 1, padding: "28px 24px", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${a}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: a }}>{idx}</div>
            <EditableText v={s.heading} on={ed?.heading} block style={{ flex: 1, fontSize: 18, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3 }} />
          </div>
          <div style={{ flex: 1 }}>
            <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#555", lineHeight: 1.85 }} />
          </div>
          {s.extra && (
            <div style={{ marginTop: 16, padding: "14px 18px", background: `${a}08`, borderRadius: 12 }}>
              <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 13, color: "#666", lineHeight: 1.7 }} />
            </div>
          )}
          <div style={{ display: "flex", gap: 6, marginTop: 20, alignItems: "center" }}>
            {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 28 : 6, height: 4, borderRadius: 2, background: i === idx ? a : "#e5e5e5" }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function KoreanEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 32px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "50%", height: "100%", background: `linear-gradient(135deg, ${a}10 0%, transparent 60%)` }} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ width: 80, height: 80, background: a, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
          <span style={{ fontSize: 40 }}>✨</span>
        </div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 26, fontWeight: 800, color: "#1a1a1a", marginBottom: 12, lineHeight: 1.3 }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "#666", marginBottom: 28, lineHeight: 1.6 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => <span key={i} style={{ padding: "8px 16px", background: `${a}10`, borderRadius: 20, fontSize: 12, color: a, fontWeight: 600 }}><EditableTag text={`#${t}`} c={a} on={ed?.tag?.(i)} /></span>)}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
          {[...Array(6)].map((_, i) => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: `${a}40` }} />)}
        </div>
      </div>
    </div>
  );
}