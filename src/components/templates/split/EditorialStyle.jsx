import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

// 杂志风 - 封面
export function EdCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ background: a, flex: "0 0 55%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "28px 28px 22px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -50, top: -50, width: 180, height: 180, borderRadius: "50%", background: `${a}20` }} />
        <div style={{ fontSize: 10, fontWeight: 800, color: `rgba(255,255,255,0.8)`, letterSpacing: "3px", marginBottom: 8 }}>ISSUE · {s.emoji}</div>
        <EditableText v={s.title} on={ed?.title} block dk style={{ fontSize: 26, fontWeight: 900, color: "#fff", lineHeight: 1.4, letterSpacing: "-0.5px", whiteSpace: "normal", wordBreak: "break-word", display: "block" }} />
      </div>
      <div style={{ flex: 1, padding: "20px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 13, color: "#555", lineHeight: 1.65, marginBottom: 10, whiteSpace: "normal", wordBreak: "break-word", display: "block" }} />}
        <div style={{ marginTop: 8 }}>
          <div style={{ height: 2, background: a, width: 36, marginBottom: 14 }} />
          <div style={{ display: "flex", gap: 5 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{ width: i === 0 ? 18 : 5, height: 3, borderRadius: 2, background: i === 0 ? a : `${a}40` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 杂志风 - 内容
export function EdContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", display: "flex", flexDirection: "column", padding: "32px 28px", boxSizing: "border-box" }}>
      <div style={{ height: 3, background: `linear-gradient(90deg,${a} 50%,transparent)`, marginBottom: 22 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: a, letterSpacing: "2px" }}>P.{String(idx).padStart(2, "0")}</span>
        <div style={{ flex: 1, height: 1, background: "#ddd" }} />
        <span style={{ fontSize: 10, color: "#bbb" }}>{idx}/{total - 2}</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "20px 0" }}>
        <div>
          <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 20, fontWeight: 900, color: "#111", lineHeight: 1.4, marginBottom: 12, display: "block" }} />
          <div style={{ height: 2, background: a, width: 30, marginBottom: 16 }} />
          <svg width="100%" height="8" viewBox="0 0 200 8" preserveAspectRatio="none">
            <line x1="0" y1="3" x2="200" y2="3" stroke={a} strokeWidth="2" />
            <line x1="0" y1="7" x2="200" y2="7" stroke={a} strokeWidth="0.8" strokeOpacity="0.35" />
          </svg>
          <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#444", lineHeight: 2, marginTop: 12, display: "block" }} />
        </div>
        {s.extra && (
          <div style={{ padding: "12px 16px", background: a + "12", borderLeft: `3px solid ${a}`, borderRadius: "0 6px 6px 0", marginTop: "auto" }}>
            <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 12, color: "#555", lineHeight: 1.7, fontStyle: "italic", display: "block" }} />
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 5, marginTop: 18 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ width: i === idx ? "18px" : "5px", height: 3, borderRadius: 2, background: i === idx ? a : `${a}30` }} />
        ))}
      </div>
    </div>
  );
}

// 杂志风 - 结尾
export function EdEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "36px 28px", boxSizing: "border-box", textAlign: "center" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: a }} />
      <div style={{ position: "absolute", top: 7, left: 0, right: 0, height: 1, background: `${a}55` }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: a, letterSpacing: "4px", marginBottom: 22 }}>— THE END —</div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 22, fontWeight: 900, color: "#111", marginBottom: 8, lineHeight: 1.3, display: "block" }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 13, color: "#777", marginBottom: 24, lineHeight: 1.6, fontStyle: "italic", display: "block" }} />
        <div style={{ height: 1, background: "#ddd", marginBottom: 18 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>
          {s.tags.map((t, i) => (
            <EditableTag key={i} text={t} c={a} on={ed?.tag?.(i)} />
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: a }} />
    </div>
  );
}
