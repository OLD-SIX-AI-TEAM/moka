import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function LawCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#f8f6f3", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ width: "4px", background: "linear-gradient(180deg, #8b4513, #d4a574)" }} />
        <div style={{ flex: 1, padding: "32px 28px", display: "flex", flexDirection: "column", position: "relative" }}>
          <div style={{ position: "absolute", top: 20, right: 20, fontSize: 60, opacity: 0.06, fontFamily: "Georgia, serif" }}>§</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <span style={{ fontSize: 28 }}>⚖️</span>
            <div style={{ fontSize: 9, color: "#8b4513", letterSpacing: "3px", fontWeight: 600 }}>LEGAL PRECEDENT</div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ borderLeft: "3px solid #8b4513", paddingLeft: 16, marginBottom: 20 }}>
              <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 28, fontWeight: 700, color: "#1a1510", lineHeight: 1.3 }} />
            </div>
            {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 14, color: "#5a4a3a", lineHeight: 1.7, fontStyle: "italic", paddingLeft: 16 }} />}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ flex: 1, height: 1, background: "#d4a57450" }} />
            <div style={{ fontSize: 9, color: "#8b4513", letterSpacing: "2px" }}>{s.category.toUpperCase()}</div>
            <div style={{ flex: 1, height: 1, background: "#d4a57450" }} />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, padding: "0 28px 24px", marginLeft: 4 }}>
        {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 24 : 6, height: 4, background: i === 0 ? "#8b4513" : "#ddd" }} />)}
      </div>
    </div>
  );
}

export function LawContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#f8f6f3", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ width: "25%", background: "#8b4513", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 12px" }}>
          <div style={{ fontSize: 48, fontWeight: 300, color: "rgba(255,255,255,0.9)", fontFamily: "Georgia, serif" }}>{String.fromCharCode(8544 + idx - 1)}</div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.6)", letterSpacing: "1px", marginTop: 12, textAlign: "center" }}>ARTICLE</div>
        </div>
        <div style={{ flex: 1, padding: "28px 24px", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #e0d8d0" }}>
            <div style={{ width: 32, height: 32, border: "2px solid #8b4513", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#8b4513" }}>{idx}</div>
            <div style={{ flex: 1, height: 1, background: "#d4a57430" }} />
            <div style={{ fontSize: 9, color: "#8b4513", letterSpacing: "1px" }}>SEC. {idx}</div>
          </div>
          <div style={{ flex: 1 }}>
            <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 18, fontWeight: 700, color: "#1a1510", lineHeight: 1.4, marginBottom: 16, textDecoration: "underline", textDecorationColor: "#d4a57450" }} />
            <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 13, color: "#4a3a2a", lineHeight: 1.9 }} />
          </div>
          {s.extra && (
            <div style={{ marginTop: 16, padding: "14px 16px", background: "#fff8e8", border: "1px solid #d4a574" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 12 }}>📋</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#8b4513", letterSpacing: "1px" }}>LEGAL NOTE</span>
              </div>
              <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 12, color: "#5a4a3a", lineHeight: 1.7 }} />
            </div>
          )}
          <div style={{ display: "flex", gap: 6, marginTop: 20, alignItems: "center" }}>
            {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 24 : 6, height: 4, background: i === idx ? "#8b4513" : "#ccc" }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LawEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#f8f6f3", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 32px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 4, background: "linear-gradient(180deg, #8b4513, #d4a574)" }} />
      <div style={{ textAlign: "center", paddingLeft: 20 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 24 }}>
          <span style={{ fontSize: 32 }}>⚖️</span>
        </div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 24, fontWeight: 700, color: "#1a1510", marginBottom: 12, lineHeight: 1.3 }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 13, color: "#5a4a3a", marginBottom: 28, lineHeight: 1.6, fontStyle: "italic" }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => <span key={i} style={{ padding: "6px 14px", background: "#fff", border: "1px solid #8b4513", fontSize: 11, color: "#8b4513" }}><EditableTag text={t} c="#8b4513" on={ed?.tag?.(i)} /></span>)}
        </div>
        <div style={{ fontSize: 10, color: "#8b4513", letterSpacing: "2px" }}>— 本案仅供法律参考 —</div>
      </div>
    </div>
  );
}