import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function PopCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: `repeating-linear-gradient(90deg, ${a}, ${a} 20px, #000 20px, #000 40px)` }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 8, background: `repeating-linear-gradient(90deg, #000, #000 20px, ${a} 20px, ${a} 40px)` }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "40px 32px", position: "relative" }}>
        <div style={{ position: "absolute", top: 30, right: 30, width: 80, height: 80, background: `${a}20`, transform: "rotate(15deg)" }} />
        <div style={{ position: "absolute", bottom: 50, left: 20, width: 60, height: 60, borderRadius: "50%", background: "#000", opacity: 0.1 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 60, marginBottom: 16, filter: "drop-shadow(4px 4px 0 rgba(0,0,0,0.1))" }}>{s.emoji}</div>
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 36, fontWeight: 900, color: "#000", lineHeight: 1.1, marginBottom: 16, letterSpacing: "-1px", textTransform: "uppercase" }} />
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 15, color: "#333", lineHeight: 1.6, maxWidth: "80%" }} />}
        </div>
        <div style={{ marginTop: "auto", display: "flex", gap: 8 }}>
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 28 : 8, height: 8, background: i === 0 ? a : "#000", transform: "rotate(-1deg)" }} />)}
        </div>
      </div>
    </div>
  );
}

export function PopContent({ s, a, idx, total, ed }) {
  const shapes = ["■", "●", "▲", "◆", "★"];
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 24, color: a, transform: "rotate(-5deg)", filter: `drop-shadow(2px 2px 0 ${a})` }}>{shapes[(idx - 1) % 5]}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#000", letterSpacing: "2px", fontWeight: 700 }}>SECTION</div>
            <div style={{ width: 40, height: 3, background: idx % 2 === 0 ? a : "#000", marginTop: 8 }} />
          </div>
          <div style={{ width: 3, height: 3, background: "#000", transform: "rotate(45deg)" }} />
        </div>
        <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 22, fontWeight: 900, color: "#000", lineHeight: 1.2, marginBottom: 16, textTransform: "uppercase" }} />
        <div style={{ flex: 1 }}>
          <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 15, color: "#333", lineHeight: 1.8 }} />
        </div>
        {s.extra && (
          <div style={{ marginTop: 20, padding: "16px 20px", border: `3px solid ${a}`, position: "relative", transform: "rotate(0.5deg)" }}>
            <div style={{ position: "absolute", top: -10, left: 12, background: "#fff", padding: "0 8px", fontSize: 11, fontWeight: 900, color: a }}>HOT TIP!</div>
            <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 13, color: "#333", lineHeight: 1.7 }} />
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 24, alignItems: "center" }}>
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 28 : 8, height: 8, background: i === idx ? a : "#000", transform: "rotate(-1deg)" }} />)}
        </div>
      </div>
    </div>
  );
}

export function PopEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 32px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: `repeating-linear-gradient(90deg, ${a}, ${a} 20px, #000 20px, #000 40px)` }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 8, background: `repeating-linear-gradient(90deg, #000, #000 20px, ${a} 20px, ${a} 40px)` }} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 56, marginBottom: 20, filter: "drop-shadow(4px 4px 0 rgba(0,0,0,0.1))" }}>🎯</div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 28, fontWeight: 900, color: "#000", marginBottom: 12, lineHeight: 1.2, textTransform: "uppercase" }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "#333", marginBottom: 28, lineHeight: 1.6 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => <span key={i} style={{ padding: "8px 16px", background: i % 2 === 0 ? a : "#000", color: "#fff", fontSize: 12, fontWeight: 800, transform: i % 2 === 0 ? "rotate(-2deg)" : "rotate(2deg)" }}><EditableTag text={t} c="#fff" on={ed?.tag?.(i)} /></span>)}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
          {[...Array(8)].map((_, i) => <div key={i} style={{ width: 10, height: 10, background: i % 2 === 0 ? a : "#000", transform: "rotate(45deg)" }} />)}
        </div>
      </div>
    </div>
  );
}