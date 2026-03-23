import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function PaperCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#fefcf8", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 28px", position: "relative" }}>
        <div style={{ position: "absolute", top: 16, right: 16, width: 60, height: 60, border: `2px dashed ${a}50`, transform: "rotate(10deg)" }} />
        <div style={{ position: "absolute", bottom: 40, left: 16, width: 40, height: 40, borderRadius: "50%", background: `${a}20`, transform: "rotate(-5deg)" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 36, height: 36, background: a, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, boxShadow: "2px 2px 0 rgba(0,0,0,0.1)" }}>📝</div>
          <span style={{ fontSize: 10, color: a, letterSpacing: "2px", fontWeight: 600 }}>MY JOURNAL</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 30, fontWeight: 800, color: "#3d3d3d", lineHeight: 1.25, marginBottom: 16, transform: "rotate(-0.5deg)" }} />
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 14, color: "#666", lineHeight: 1.7, transform: "rotate(-0.5deg)" }} />}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 24 : 6, height: 6, borderRadius: 3, background: i === 0 ? a : "#ddd" }} />)}
        </div>
      </div>
    </div>
  );
}

export function PaperContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#fefcf8", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "28px 24px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        <div style={{ position: "absolute", top: 20, right: 20, width: 50, height: 50, border: `2px dashed ${a}40`, transform: "rotate(5deg)" }} />
        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
            <div style={{ minWidth: 70, height: 70, background: "#fff", border: `2px solid ${a}50`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "3px 3px 0 rgba(0,0,0,0.08)", transform: "rotate(-2deg)" }}>
              <span style={{ fontSize: 28 }}>{["🌸", "☀️", "💫", "🌙", "✨"][(idx - 1) % 5]}</span>
              <span style={{ fontSize: 8, color: "#999" }}>Day {idx}</span>
            </div>
            <div style={{ flex: 1, paddingTop: 8 }}>
              <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 20, fontWeight: 800, color: "#3d3d3d", lineHeight: 1.3, marginBottom: 8 }} />
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <div style={{ width: 20, height: 2, background: a }} />
                <span style={{ fontSize: 10, color: "#999" }}>Page {idx}</span>
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#555", lineHeight: 1.9 }} />
          </div>
          {s.extra && (
            <div style={{ marginTop: 16, padding: "14px 18px", background: "#fff", border: `1px dashed ${a}60`, boxShadow: "2px 2px 0 rgba(0,0,0,0.05)", transform: "rotate(0.5deg)" }}>
              <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 13, color: "#666", lineHeight: 1.7 }} />
            </div>
          )}
          <div style={{ display: "flex", gap: 6, marginTop: 20, alignItems: "center" }}>
            {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 24 : 6, height: 6, borderRadius: 3, background: i === idx ? a : "#ccc" }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PaperEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#fefcf8", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "36px 28px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 32, transform: "rotate(-10deg)" }}>✨</span>
          <span style={{ fontSize: 32, transform: "rotate(5deg)" }}>💖</span>
          <span style={{ fontSize: 32, transform: "rotate(-5deg)" }}>✨</span>
        </div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 24, fontWeight: 800, color: "#3d3d3d", marginBottom: 12, lineHeight: 1.3 }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "#666", marginBottom: 28, lineHeight: 1.6 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => <span key={i} style={{ padding: "6px 14px", background: "#fff", border: `1px solid ${a}50`, borderRadius: 4, fontSize: 12, color: a, boxShadow: "2px 2px 0 rgba(0,0,0,0.06)", transform: `rotate(${(i - 1) * 2}deg)` }}><EditableTag text={`#${t}`} c={a} on={ed?.tag?.(i)} /></span>)}
        </div>
        <div style={{ fontSize: 10, color: "#999", letterSpacing: "2px" }}>— 记录美好生活 —</div>
      </div>
    </div>
  );
}