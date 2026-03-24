import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function ArtisticCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#f7f5f2", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "48px 40px", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: `radial-gradient(circle at 80% 20%, ${a}12 0%, transparent 40%)` }} />
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div style={{ width: 60, height: 60, border: `2px solid ${a}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 28 }}>{s.emoji}</span>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 9, color: a, letterSpacing: "6px", marginBottom: 20, fontWeight: 600 }}>{s.category?.toUpperCase?.() || ""}</div>
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 32, fontWeight: 300, color: "#1a1a1a", lineHeight: 1.3, letterSpacing: "2px", marginBottom: 16 }} />
          <div style={{ width: 40, height: 2, background: a, marginBottom: 20 }} />
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 13, color: "#666", lineHeight: 1.8, maxWidth: "80%" }} />}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 24 : 6, height: 2, background: i === 0 ? a : "#ddd" }} />)}
        </div>
      </div>
    </div>
  );
}

export function ArtisticContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#f7f5f2", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "36px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, border: `2px solid ${a}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 300, color: a, fontFamily: "Georgia, serif" }}>{String.fromCharCode(8544 + idx - 1)}</div>
          </div>
          <div style={{ flex: 1, height: 1, background: `${a}30` }} />
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${a}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: a }}>{idx}</div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 22, fontWeight: 400, color: "#1a1a1a", lineHeight: 1.4, letterSpacing: "1px", marginBottom: 16, textAlign: "center" }} />
          <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 15, color: "#555", lineHeight: 2, textAlign: "center" }} />
        </div>
        {s.extra && (
          <div style={{ marginTop: 28, padding: "20px 24px", background: "#fff", textAlign: "center", borderRadius: 8 }}>
            <div style={{ width: 30, height: 1, background: `${a}40`, margin: "0 auto 12px" }} />
            <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 14, color: "#666", lineHeight: 1.8, fontStyle: "italic" }} />
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 28 }}>
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 24 : 6, height: 2, background: i === idx ? a : "#ddd" }} />)}
        </div>
      </div>
    </div>
  );
}

export function ArtisticEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#f7f5f2", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "48px 40px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 20% 80%, ${a}10 0%, transparent 40%)` }} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 60, height: 1, background: `${a}40` }} />
          <span style={{ fontSize: 32, color: a, opacity: 0.6 }}>✦</span>
          <div style={{ width: 60, height: 1, background: `${a}40` }} />
        </div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 24, fontWeight: 300, color: "#1a1a1a", marginBottom: 12, lineHeight: 1.4, letterSpacing: "2px" }} />
        <div style={{ width: 30, height: 2, background: a, margin: "16px auto 20px" }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 13, color: "#666", marginBottom: 28, lineHeight: 1.8 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => <span key={i} style={{ fontSize: 11, color: a, letterSpacing: "2px" }}><EditableTag text={t} c={a} on={ed?.tag?.(i)} /></span>)}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          {[...Array(3)].map((_, i) => <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: `${a}40` }} />)}
        </div>
      </div>
    </div>
  );
}