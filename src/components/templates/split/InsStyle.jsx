import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function InsCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#fafafa", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 28px", position: "relative" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, background: `${a}20`, borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: 40, left: 20, width: 60, height: 60, background: `${a}15`, borderRadius: "50%" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, background: a, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <span style={{ fontSize: 22 }}>{s.emoji}</span>
          </div>
          <span style={{ fontSize: 10, color: a, letterSpacing: "2px", fontWeight: 700 }}>{s.category.toUpperCase()}</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 32, fontWeight: 800, color: "#1a1a1a", lineHeight: 1.2, marginBottom: 16 }} />
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }} />}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 24 : 6, height: 4, borderRadius: 2, background: i === 0 ? a : "#e0e0e0" }} />)}
        </div>
      </div>
    </div>
  );
}

export function InsContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#fafafa", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "28px 24px", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "30%", height: "40%", background: `${a}10`, borderRadius: "0 0 0 100%" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
            <div style={{ minWidth: 80, height: 80, background: "#fff", borderRadius: 12, border: `2px solid ${a}30`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <span style={{ fontSize: 28 }}>{["✨", "💫", "🌟", "⭐", "💥"][(idx - 1) % 5]}</span>
              <span style={{ fontSize: 8, color: "#999" }}>No.{idx}</span>
            </div>
            <div style={{ flex: 1, paddingTop: 8 }}>
              <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", lineHeight: 1.3, marginBottom: 8 }} />
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <div style={{ width: 30, height: 2, background: a }} />
                <span style={{ fontSize: 10, color: "#999" }}>Page {idx}</span>
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#555", lineHeight: 1.85 }} />
          </div>
          {s.extra && (
            <div style={{ marginTop: 16, padding: "14px 18px", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 13, color: "#666", lineHeight: 1.7 }} />
            </div>
          )}
          <div style={{ display: "flex", gap: 6, marginTop: 20, alignItems: "center" }}>
            {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 24 : 6, height: 4, borderRadius: 2, background: i === idx ? a : "#e0e0e0" }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function InsEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#fafafa", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 32px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", top: -40, left: -40, width: 140, height: 140, background: `${a}15`, borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: -30, right: -30, width: 100, height: 100, background: `${a}10`, borderRadius: "50%" }} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 28 }}>💖</span>
          <span style={{ fontSize: 36 }}>✨</span>
          <span style={{ fontSize: 28 }}>💖</span>
        </div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 12, lineHeight: 1.3 }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "#666", marginBottom: 28, lineHeight: 1.6 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => <span key={i} style={{ padding: "8px 16px", background: a, borderRadius: 20, fontSize: 12, color: "#fff", fontWeight: 600 }}><EditableTag text={`#${t}`} c="#fff" on={ed?.tag?.(i)} /></span>)}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
          {[...Array(4)].map((_, i) => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: `${a}40` }} />)}
        </div>
      </div>
    </div>
  );
}