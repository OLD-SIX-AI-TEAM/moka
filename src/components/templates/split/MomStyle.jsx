import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function MomCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#fff5f7", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: "50%", height: "50%", background: `${a}15`, borderRadius: "0 0 0 100%" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "40%", height: "40%", background: `${a}10`, borderRadius: "0 100% 0 0" }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 28px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "#fff", borderRadius: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 18 }}>🤱</span>
            <span style={{ fontSize: 11, color: a, fontWeight: 700 }}>{s.category}</span>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}>{s.emoji}</div>
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 30, fontWeight: 800, color: "#5d4e6d", lineHeight: 1.25, marginBottom: 16 }} />
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 14, color: "#6b5b7a", lineHeight: 1.7 }} />}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 28 : 6, height: 4, borderRadius: 2, background: i === 0 ? a : "#ddd" }} />)}
        </div>
      </div>
    </div>
  );
}

export function MomContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#fff5f7", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ width: "30%", background: a, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.2) 50%)" }} />
          <span style={{ fontSize: 40, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}>{["🧸", "🎀", "🌸", "⭐", "💖"][(idx - 1) % 5]}</span>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.8)", letterSpacing: "2px", marginTop: 8 }}>CHAPTER {idx}</div>
        </div>
        <div style={{ flex: 1, padding: "28px 24px", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
          <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 20, fontWeight: 800, color: "#5d4e6d", lineHeight: 1.35, marginBottom: 16 }} />
          <div style={{ flex: 1 }}>
            <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 13, color: "#6b5b7a", lineHeight: 1.85 }} />
          </div>
          {s.extra && (
            <div style={{ marginTop: 16, padding: "14px 18px", background: "#e8f4f8", borderRadius: 12, borderLeft: "4px solid #4a7c8a" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 14 }}>💡</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#4a7c8a", letterSpacing: "1px" }}>MOM'S TIP</span>
              </div>
              <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 12, color: "#5a6c7a", lineHeight: 1.7 }} />
            </div>
          )}
          <div style={{ display: "flex", gap: 6, marginTop: 20, alignItems: "center" }}>
            {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 24 : 6, height: 4, borderRadius: 2, background: i === idx ? a : "#ccc" }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MomEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#fff5f7", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 32px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: "50%", height: "50%", background: `${a}15`, borderRadius: "0 0 0 100%" }} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ width: 80, height: 80, background: a, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
          <span style={{ fontSize: 40 }}>💕</span>
        </div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 24, fontWeight: 800, color: "#5d4e6d", marginBottom: 12, lineHeight: 1.3 }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 13, color: "#6b5b7a", marginBottom: 28, lineHeight: 1.6 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => <span key={i} style={{ padding: "6px 14px", background: "#fff", borderRadius: 16, fontSize: 12, color: a, boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}><EditableTag text={`#${t}`} c={a} on={ed?.tag?.(i)} /></span>)}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>💕</span>
          <span style={{ fontSize: 20 }}>👶</span>
          <span style={{ fontSize: 20 }}>💕</span>
        </div>
      </div>
    </div>
  );
}