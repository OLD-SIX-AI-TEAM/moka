import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function EduCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#faf8f5", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 28px", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "40%", height: "100%", background: `${a}10`, clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 60, height: 60, background: a, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <span style={{ fontSize: 28 }}>📚</span>
          </div>
          <div>
            <div style={{ fontSize: 9, color: a, letterSpacing: "3px", fontWeight: 600, marginBottom: 4 }}>KNOWLEDGE HUB</div>
            <div style={{ fontSize: 10, color: "#888" }}>{s.category}</div>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 32, fontWeight: 800, color: "#2c3e50", lineHeight: 1.2, marginBottom: 16 }} />
          <div style={{ width: 60, height: 3, background: a, marginBottom: 20 }} />
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 14, color: "#5a6a7a", lineHeight: 1.7 }} />}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1, height: 1, background: `${a}30` }} />
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 24 : 6, height: 4, background: i === 0 ? a : "#ddd" }} />)}
        </div>
      </div>
    </div>
  );
}

export function EduContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#faf8f5", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ width: "25%", background: a, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 56, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>{idx}</div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.6)", letterSpacing: "2px", marginTop: 8 }}>LESSON</div>
        </div>
        <div style={{ flex: 1, padding: "28px 24px", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #eee" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${a}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: a }}>{idx}</div>
            <EditableText v={s.heading} on={ed?.heading} block style={{ flex: 1, fontSize: 18, fontWeight: 700, color: "#2c3e50", lineHeight: 1.3 }} />
          </div>
          <div style={{ flex: 1 }}>
            <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 13, color: "#555", lineHeight: 1.9 }} />
          </div>
          {s.extra && (
            <div style={{ marginTop: 16, padding: "14px 18px", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", borderLeft: `4px solid ${a}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 14 }}>💡</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: a, letterSpacing: "1px" }}>KEY POINT</span>
              </div>
              <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }} />
            </div>
          )}
          <div style={{ display: "flex", gap: 6, marginTop: 20, alignItems: "center" }}>
            {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 24 : 6, height: 4, background: i === idx ? a : "#ccc" }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function EduEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#faf8f5", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 32px", boxSizing: "border-box" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 80, height: 80, background: a, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
          <span style={{ fontSize: 40 }}>🎓</span>
        </div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 26, fontWeight: 800, color: "#2c3e50", marginBottom: 12, lineHeight: 1.3 }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "#5a6a7a", marginBottom: 28, lineHeight: 1.6 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => <span key={i} style={{ padding: "6px 16px", background: "#fff", borderRadius: 20, fontSize: 12, color: a, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}><EditableTag text={`#${t}`} c={a} on={ed?.tag?.(i)} /></span>)}
        </div>
        <div style={{ fontSize: 11, color: "#888", letterSpacing: "2px" }}>— 持续学习，终身成长 —</div>
      </div>
    </div>
  );
}