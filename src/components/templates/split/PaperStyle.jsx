import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

// 手账风 - 封面
export function PaperCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 30px", boxSizing: "border-box", textAlign: "center" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: a }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 6, background: a }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>{s.emoji}</div>
        <div style={{ border: `2px solid ${a}`, padding: "18px 24px", position: "relative", display: "inline-block", minWidth: 200 }}>
          {["tl", "tr", "bl", "br"].map((p) => (
            <div
              key={p}
              style={{
                position: "absolute",
                width: 8,
                height: 8,
                background: a,
                ...(p === "tl" ? { top: -4, left: -4 } : p === "tr" ? { top: -4, right: -4 } : p === "bl" ? { bottom: -4, left: -4 } : { bottom: -4, right: -4 }),
              }}
            />
          ))}
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 22, fontWeight: 900, color: "#1a1510", lineHeight: 1.4, marginBottom: 10, whiteSpace: "normal", wordBreak: "break-word", display: "block" }} />
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 12, color: "#666", lineHeight: 1.6, marginBottom: 6, whiteSpace: "normal", wordBreak: "break-word", display: "block" }} />}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ width: i === 0 ? 18 : 5, height: 4, borderRadius: 2, background: i === 0 ? a : `${a}40` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// 手账风 - 内容
export function PaperContent({ s, a, idx, total, ed }) {
  const icons = ["📌", "✏️", "📎", "🗝️"];

  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", padding: "32px 28px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: a, zIndex: 1 }} />
      <div style={{ paddingLeft: 16, position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: a, letterSpacing: "2px" }}>No.{idx}</span>
          <div style={{ flex: 1, height: 1, background: `${a}40` }} />
          <span style={{ fontSize: 10, color: "#aaa" }}>{idx}/{total - 2}</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "16px 0" }}>
          <div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1 }}>{icons[(idx - 1) % 4]}</span>
              <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 19, fontWeight: 900, color: "#1a1510", lineHeight: 1.4, display: "block" }} />
            </div>
            <svg width="100%" height="8" viewBox="0 0 200 8" preserveAspectRatio="none">
              <path
                d={`M0 4 ${Array.from({ length: 16 }, (_, i) => `Q${i * 13 + 6} ${i % 2 ? 8 : 0} ${(i + 1) * 13} 4`).join(" ")}`}
                stroke={a}
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#444", lineHeight: 2, marginTop: 12, display: "block" }} />
          </div>
          {s.extra && (
            <div style={{ padding: "12px 14px", background: `${a}14`, borderRadius: 6, marginTop: "auto" }}>
              <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 12, color: "#555", lineHeight: 1.7, display: "block" }} />
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 5, marginTop: 18 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ width: i === idx ? "18px" : "5px", height: 4, borderRadius: 2, background: i === idx ? a : `${a}30` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// 手账风 - 结尾
export function PaperEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "36px 28px", boxSizing: "border-box", textAlign: "center" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: a }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 5, background: a }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <div style={{ fontSize: 40, marginBottom: 14 }}>🌿</div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 20, fontWeight: 900, color: "#1a1510", marginBottom: 6, lineHeight: 1.3, display: "block" }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 13, color: "#666", marginBottom: 22, lineHeight: 1.6, display: "block" }} />
        <svg width="160" height="8" viewBox="0 0 160 8" style={{ display: "block", margin: "0 auto 18px" }}>
          <path d="M0 4 Q20 0 40 4 Q60 8 80 4 Q100 0 120 4 Q140 8 160 4" stroke={a} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>
          {s.tags.map((t, i) => (
            <EditableTag key={i} text={t} c={a} on={ed?.tag?.(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}
