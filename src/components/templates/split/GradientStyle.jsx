import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function GradientCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)" }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "40px 36px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 50, height: 50, background: "rgba(255,255,255,0.2)", borderRadius: "50%", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 24 }}>{s.emoji}</span>
          </div>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.9)", letterSpacing: "3px", fontWeight: 600 }}>{s.category?.toUpperCase?.() || ""}</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 34, fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 16, textShadow: "0 2px 10px rgba(0,0,0,0.3)" }} />
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", lineHeight: 1.7 }} />}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 28 : 6, height: 4, borderRadius: 2, background: i === 0 ? "#fff" : "rgba(255,255,255,0.4)" }} />)}
        </div>
      </div>
    </div>
  );
}

export function GradientContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.15)" }} />
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ width: "30%", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 56, fontWeight: 300, color: "#fff", opacity: 0.9 }}>{String.fromCharCode(8544 + idx - 1)}</div>
        </div>
        <div style={{ flex: 1, padding: "28px 24px", display: "flex", flexDirection: "column", boxSizing: "border-box", position: "relative", zIndex: 1 }}>
          <div style={{ height: 3, background: "rgba(255,255,255,0.5)", marginBottom: 20, borderRadius: 2 }} />
          <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 20, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 16 }} />
          <div style={{ flex: 1 }}>
            <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", lineHeight: 1.85 }} />
          </div>
          {s.extra && (
            <div style={{ marginTop: 16, padding: "14px 18px", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", borderRadius: 8, borderLeft: "4px solid rgba(255,255,255,0.5)" }}>
              <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 13, color: "#fff", lineHeight: 1.7 }} />
            </div>
          )}
          <div style={{ display: "flex", gap: 6, marginTop: 20, alignItems: "center" }}>
            {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 28 : 6, height: 4, borderRadius: 2, background: i === idx ? "#fff" : "rgba(255,255,255,0.4)" }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function GradientEnd({ s, a, ed }) {
  return (
    <div style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #667eea 100%)", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 36px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.15)" }} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ width: 80, height: 80, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <span style={{ fontSize: 40 }}>{s.emoji}</span>
        </div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 12, lineHeight: 1.3, textShadow: "0 2px 10px rgba(0,0,0,0.3)" }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "rgba(255,255,255,0.95)", marginBottom: 32, lineHeight: 1.6 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => <span key={i} style={{ padding: "8px 18px", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", borderRadius: 20, fontSize: 12, color: "#fff", fontWeight: 600 }}><EditableTag text={t} c="#fff" on={ed?.tag?.(i)} /></span>)}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          {[...Array(5)].map((_, i) => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.6)" }} />)}
        </div>
      </div>
    </div>
  );
}

// 别名导出以兼容现有代码
export { GradientCover as GrCover, GradientContent as GrContent, GradientEnd as GrEnd };