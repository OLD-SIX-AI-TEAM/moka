import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function CleanCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "48px 40px", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "35%", height: "100%", background: `${a}08` }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{ width: 44, height: 44, background: a, borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 20, color: "#fff" }}>{s.emoji}</span>
          </div>
          <span style={{ fontSize: 10, color: a, letterSpacing: "3px", fontWeight: 600 }}>{s.category?.toUpperCase?.() || ""}</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 36, fontWeight: 800, color: "#1a1a1a", lineHeight: 1.2, marginBottom: 16, letterSpacing: "-0.5px" }} />
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 15, color: "#666", lineHeight: 1.7 }} />}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1, height: 1, background: `${a}20` }} />
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 28 : 6, height: 4, borderRadius: 2, background: i === 0 ? a : "#e5e5e5" }} />)}
        </div>
      </div>
    </div>
  );
}

export function CleanContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ width: "28%", background: a, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 48, fontWeight: 300, color: "rgba(255,255,255,0.9)" }}>{String.fromCharCode(8544 + idx - 1)}</div>
        </div>
        <div style={{ flex: 1, padding: "32px 28px", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${a}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: a }}>{idx}</div>
            <div style={{ flex: 1, height: 1, background: "#f0f0f0" }} />
          </div>
          <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3, marginBottom: 16 }} />
          <div style={{ flex: 1 }}>
            <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#555", lineHeight: 1.9 }} />
          </div>
          {s.extra && (
            <div style={{ marginTop: 20, padding: "16px 20px", background: `${a}08`, borderRadius: 8, borderLeft: `4px solid ${a}` }}>
              <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 13, color: "#444", lineHeight: 1.75 }} />
            </div>
          )}
          <div style={{ display: "flex", gap: 6, marginTop: 24, alignItems: "center" }}>
            {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 28 : 6, height: 4, borderRadius: 2, background: i === idx ? a : "#e5e5e5" }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CleanEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 40px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "40%", height: "100%", background: `${a}08` }} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ width: 80, height: 80, background: a, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
          <span style={{ fontSize: 36, color: "#fff" }}>{s.emoji}</span>
        </div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 28, fontWeight: 800, color: "#1a1a1a", marginBottom: 12, lineHeight: 1.3 }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "#666", marginBottom: 32, lineHeight: 1.6 }} />
        <div style={{ width: 50, height: 2, background: `${a}30`, margin: "0 auto 28px" }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => <span key={i} style={{ padding: "8px 18px", background: `${a}10`, borderRadius: 20, fontSize: 13, color: a, fontWeight: 600 }}><EditableTag text={t} c={a} on={ed?.tag?.(i)} /></span>)}
        </div>
        <div style={{ fontSize: 10, color: "#ccc", letterSpacing: "3px" }}>— END —</div>
      </div>
    </div>
  );
}