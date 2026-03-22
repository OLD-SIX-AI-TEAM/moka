import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

// 渐变风 - 封面
export function GrCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 30px", boxSizing: "border-box", textAlign: "center" }}>
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 250, height: 250, borderRadius: "50%", background: `${a}15` }} />
      <div style={{ position: "absolute", inset: 16, border: `1px solid ${a}30`, borderRadius: 8, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 56, marginBottom: 18 }}>{s.emoji}</div>
        <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 26, fontWeight: 900, color: "#111", lineHeight: 1.4, marginBottom: 12, letterSpacing: "-0.5px", whiteSpace: "normal", wordBreak: "break-word", display: "block" }} />
        {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 13, color: "#666", lineHeight: 1.65, marginBottom: 20, whiteSpace: "normal", wordBreak: "break-word", display: "block" }} />}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ width: i === 0 ? 18 : 5, height: 3, borderRadius: 2, background: i === 0 ? a : `${a}50` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// 渐变风 - 内容
export function GrContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ height: 5, background: `linear-gradient(90deg,${a},${a}55,transparent)` }} />
      <div style={{ flex: 1, padding: "26px 28px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${a},${a}99)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 900 }}>{idx}</div>
          <div style={{ width: 1, height: 20, background: "#eee" }} />
          <span style={{ fontSize: 10, color: "#aaa", fontWeight: 600, letterSpacing: "1px" }}>0{idx} / 0{total - 2}</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "20px 0" }}>
          <div>
            <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 21, fontWeight: 900, color: "#111", lineHeight: 1.4, marginBottom: 14, display: "block" }} />
            <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
              <div style={{ width: 24, height: 3, borderRadius: 2, background: a }} />
              <div style={{ width: 8, height: 3, borderRadius: 2, background: `${a}55` }} />
              <div style={{ width: 4, height: 3, borderRadius: 2, background: `${a}25` }} />
            </div>
            <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#555", lineHeight: 2, display: "block" }} />
          </div>
          {s.extra && (
            <div style={{ padding: "14px 16px", background: `linear-gradient(135deg,${a}10,${a}04)`, borderRadius: 10, border: `1px solid ${a}22`, marginTop: "auto" }}>
              <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 12, color: "#666", lineHeight: 1.7, display: "block" }} />
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 5, marginTop: 18, justifyContent: "center" }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ width: i === idx ? "18px" : "5px", height: 3, borderRadius: 2, background: i === idx ? a : `${a}25` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// 渐变风 - 结尾
export function GrEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "36px 28px", boxSizing: "border-box", textAlign: "center" }}>
      <div style={{ position: "absolute", inset: 16, border: `1px solid ${a}30`, borderRadius: 8, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${a}20`, border: `1px solid ${a}40`, margin: "0 auto 18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🌟</div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 21, fontWeight: 900, color: "#111", marginBottom: 8, lineHeight: 1.3, display: "block" }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 13, color: "#666", marginBottom: 26, lineHeight: 1.6, display: "block" }} />
        <div style={{ height: 1, background: `${a}30`, marginBottom: 20 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>
          {s.tags.map((t, i) => (
            <EditableTag key={i} text={t} c={a} on={ed?.tag?.(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}
