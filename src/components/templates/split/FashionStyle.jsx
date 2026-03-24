import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function FashionCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#0d0d0d", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "48px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <div style={{ width: 60, height: 60, background: a, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.9)", letterSpacing: "2px", fontWeight: 600 }}>{s.category?.toUpperCase?.() || ""}</div>
          </div>
          <div style={{ width: 2, height: 60, background: "rgba(255,255,255,0.4)" }} />
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "3px" }}>FASHION</div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 42, fontWeight: 900, color: "#fff", lineHeight: 1.05, letterSpacing: "-1px", marginBottom: 24 }} />
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, fontStyle: "italic", maxWidth: "85%" }} />}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 32 : 8, height: 3, background: i === 0 ? a : "rgba(255,255,255,0.2)" }} />)}
        </div>
      </div>
    </div>
  );
}

export function FashionContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "36px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, background: a, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 300, color: "rgba(255,255,255,0.95)", fontFamily: "Georgia, serif" }}>{String.fromCharCode(8544 + idx - 1)}</div>
          </div>
          <div style={{ flex: 1, height: 1, background: "#f0f0f0" }} />
        </div>
        <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 24, fontWeight: 800, color: "#111", lineHeight: 1.2, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 16 }} />
        <div style={{ flex: 1 }}>
          <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 15, color: "#444", lineHeight: 1.9 }} />
          {s.extra && (
            <div style={{ marginTop: 24, padding: "20px 24px", background: "#f8f8f8", position: "relative", borderRadius: 8 }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: a, borderRadius: "4px 0 0 4px" }} />
              <div style={{ fontSize: 10, fontWeight: 700, color: a, letterSpacing: "2px", marginBottom: 8 }}>STYLE NOTE</div>
              <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 14, color: "#555", lineHeight: 1.75 }} />
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 28, alignItems: "center" }}>
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 32 : 8, height: 3, background: i === idx ? a : "#e0e0e0" }} />)}
        </div>
      </div>
    </div>
  );
}

export function FashionEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#0d0d0d", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "48px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: "40%", height: "40%", background: a, opacity: 0.15, clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "30%", height: "30%", background: a, opacity: 0.1, clipPath: "polygon(0 100%, 100% 100%, 0 0)" }} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "85%" }}>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24 }}>
          <div style={{ width: 40, height: 1, background: a }} />
          <div style={{ width: 8, height: 8, background: a, transform: "rotate(45deg)" }} />
          <div style={{ width: 40, height: 1, background: a }} />
        </div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 12, lineHeight: 1.2, textTransform: "uppercase", letterSpacing: "1px" }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 32, lineHeight: 1.6 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          {s.tags.map((t, i) => <span key={i} style={{ padding: "8px 20px", border: `1px solid ${a}`, fontSize: 11, color: a, letterSpacing: "2px", textTransform: "uppercase" }}><EditableTag text={t} c={a} on={ed?.tag?.(i)} /></span>)}
        </div>
      </div>
    </div>
  );
}