import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function BusinessCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#1a237e", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", letterSpacing: "1px" }}>THE DAILY BRIEF</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 28px" }}>
        <div style={{ borderBottom: `3px solid ${a}`, paddingBottom: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 9, color: "#999", letterSpacing: "2px", marginBottom: 8 }}>{s.category.toUpperCase()}</div>
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 28, fontWeight: 800, color: "#111", lineHeight: 1.2 }} />
        </div>
        <div style={{ flex: 1 }}>
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 14, color: "#444", lineHeight: 1.7 }} />}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
          <div style={{ width: 40, height: 3, background: a }} />
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 24 : 6, height: 6, background: i === 0 ? a : "#ddd" }} />)}
        </div>
      </div>
    </div>
  );
}

export function BusinessContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 16, padding: "20px 24px", borderBottom: "1px solid #eee" }}>
        <div style={{ width: 50, height: 50, background: a, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 700 }}>{idx}</div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 9, color: "#999", letterSpacing: "1px" }}>SECTION {String(idx).padStart(2, "0")}</div>
          <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 18, fontWeight: 700, color: "#111", lineHeight: 1.3 }} />
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", gap: 16, padding: "20px 24px" }}>
        <div style={{ flex: 1 }}>
          <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 13, color: "#333", lineHeight: 1.8 }} />
        </div>
      </div>
      {s.extra && (
        <div style={{ margin: "0 24px 16px", padding: "12px 16px", background: "#f5f7ff", borderLeft: `3px solid ${a}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: a, marginBottom: 6, letterSpacing: "1px" }}>ANALYST NOTE</div>
          <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 12, color: "#444", lineHeight: 1.6 }} />
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 24px", borderTop: "1px solid #eee" }}>
        <div style={{ width: 40, height: 2, background: "#ddd" }} />
        {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 24 : 6, height: 6, background: i === idx ? a : "#ddd" }} />)}
      </div>
    </div>
  );
}

export function BusinessEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "32px 28px", boxSizing: "border-box" }}>
      <div style={{ background: "#1a237e", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>END OF REPORT</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>© THE DAILY BRIEF</div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "24px 0" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 60, height: 2, background: a }} />
          <div style={{ width: 8, height: 8, background: a }} />
          <div style={{ width: 60, height: 2, background: a }} />
        </div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 24, fontWeight: 800, color: "#111", textAlign: "center", marginBottom: 12, lineHeight: 1.3 }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "#666", textAlign: "center", marginBottom: 24, lineHeight: 1.6 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => <span key={i} style={{ padding: "4px 12px", background: "#f5f7ff", fontSize: 11, color: a, fontWeight: 600 }}><EditableTag text={t} c={a} on={ed?.tag?.(i)} /></span>)}
        </div>
        <div style={{ textAlign: "center", fontSize: 10, color: "#999", letterSpacing: "1px" }}>— FOR PROFESSIONAL USE ONLY —</div>
      </div>
    </div>
  );
}