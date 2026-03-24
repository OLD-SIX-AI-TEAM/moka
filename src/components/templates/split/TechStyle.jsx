import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function TechCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#000", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 70% 30%, ${a}15 0%, transparent 50%), linear-gradient(180deg, #0a0a0a 0%, #000 100%)` }} />
      <div style={{ position: "absolute", right: 0, top: 0, width: "2px", height: "100%", background: `linear-gradient(180deg, transparent, ${a}, transparent)` }} />
      <div style={{ position: "absolute", right: 30, top: "15%", width: "1px", height: "40%", background: `${a}30` }} />
      <div style={{ position: "absolute", right: 60, top: "25%", width: "1px", height: "20%", background: `${a}20` }} />
      <div style={{ position: "absolute", right: 90, top: "35%", width: "1px", height: "10%", background: `${a}10` }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "40px 40px 40px 48px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{ width: 8, height: 8, background: "#00ff00", boxShadow: "0 0 8px #00ff00", animation: "pulse 1.5s infinite" }} />
          <div style={{ fontSize: 10, color: "#666", fontFamily: "monospace" }}>SYSTEM://{s.category?.toUpperCase?.() || ""}_INIT</div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 11, color: a, fontFamily: "monospace", marginBottom: 16, letterSpacing: "2px" }}>{`> LOADING_TITLE`}</div>
          <EditableText v={s.title} on={ed?.title} block dk style={{ fontSize: 38, fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 20, fontFamily: "monospace" }} />
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block dk style={{ fontSize: 14, color: "#00ff00", lineHeight: 1.6, fontFamily: "monospace" }} />}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ fontSize: 10, color: "#444", fontFamily: "monospace" }}>[</div>
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 24 : 6, height: 8, background: i === 0 ? a : "#222" }} />)}
          <div style={{ fontSize: 10, color: "#444", fontFamily: "monospace" }}>]</div>
        </div>
      </div>
    </div>
  );
}

export function TechContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#0a0a0a", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${a}08 0%, transparent 50%)` }} />
      <div style={{ display: "flex", flexDirection: "column", padding: "32px 28px", height: "100%", boxSizing: "border-box", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, padding: "12px 16px", border: `1px solid ${a}40`, background: `${a}08` }}>
          <div style={{ width: 10, height: 10, border: `1px solid ${a}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 4, height: 4, background: a }} />
          </div>
          <div style={{ flex: 1, height: 1, borderBottom: `1px dashed ${a}30` }} />
          <div style={{ fontSize: 10, color: a, fontFamily: "monospace" }}>{String(idx).padStart(3, "0")}</div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <EditableText v={s.heading} on={ed?.heading} block dk style={{ fontSize: 20, fontWeight: 600, color: "#fff", lineHeight: 1.3, marginBottom: 16, fontFamily: "monospace" }} />
          <div style={{ flex: 1, borderLeft: `2px solid ${a}40`, paddingLeft: 16 }}>
            <EditableText v={s.text} on={ed?.text} block dk style={{ fontSize: 13, color: "#ccc", lineHeight: 1.9, fontFamily: "monospace" }} />
          </div>
          {s.extra && (
            <div style={{ marginTop: 20, padding: "14px 16px", border: `1px solid #ff008030`, background: "#ff008008" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 6, height: 6, background: "#ff0080", boxShadow: "0 0 6px #ff0080" }} />
                <div style={{ fontSize: 10, color: "#ff0080", fontFamily: "monospace" }}>ALERT://DATA_INJECT</div>
              </div>
              <EditableText v={s.extra} on={ed?.extra} dk style={{ fontSize: 12, color: "#ff6699", fontFamily: "monospace" }} />
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 24, alignItems: "center" }}>
          <div style={{ fontSize: 10, color: "#333", fontFamily: "monospace" }}>PROG:</div>
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 24 : 6, height: 8, background: i === idx ? a : "#222" }} />)}
          <div style={{ fontSize: 10, color: "#333", fontFamily: "monospace" }}>{String(Math.round((idx / total) * 100)).padStart(3, "0")}%</div>
        </div>
      </div>
    </div>
  );
}

export function TechEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#000", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 32px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 50%, ${a}10 0%, transparent 60%)` }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "200px", height: "200px", border: `1px solid ${a}20`, borderRadius: "50%" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "280px", height: "280px", border: `1px solid ${a}10`, borderRadius: "50%" }} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "#00ff00", fontFamily: "monospace", marginBottom: 20 }}>{`> EXECUTE_TERMINATE_PROTOCOL`}</div>
        <div style={{ fontSize: 48, marginBottom: 20, filter: `drop-shadow(0 0 10px ${a})` }}>⬡</div>
        <EditableText v={s.cta} on={ed?.cta} block dk style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 12, fontFamily: "monospace" }} />
        <EditableText v={s.sub} on={ed?.sub} block dk style={{ fontSize: 13, color: "#00ff00", marginBottom: 28, fontFamily: "monospace" }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => <span key={i} style={{ padding: "6px 12px", border: `1px solid ${a}60`, fontSize: 11, color: a, fontFamily: "monospace" }}><EditableTag text={`#${t}`} c={a} on={ed?.tag?.(i)} /></span>)}
        </div>
        <div style={{ fontSize: 10, color: "#333", fontFamily: "monospace" }}>// SYSTEM_HALTED</div>
      </div>
    </div>
  );
}