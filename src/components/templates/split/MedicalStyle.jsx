import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function MedicalCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#f0f4f8", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "linear-gradient(90deg, #e74c3c, #c0392b)" }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "40px 32px 32px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#e74c3c", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(231,76,60,0.3)" }}>
            <span style={{ fontSize: 28 }}>⚕️</span>
          </div>
          <div>
            <div style={{ fontSize: 9, color: "#e74c3c", letterSpacing: "2px", fontWeight: 600, marginBottom: 4 }}>HEALTH GUIDE</div>
            <div style={{ fontSize: 10, color: "#888" }}>{s.category}</div>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ position: "relative", padding: "24px 0 24px 24px", borderLeft: "4px solid #e74c3c", background: "#fff", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 28, fontWeight: 700, color: "#2c3e50", lineHeight: 1.25 }} />
          </div>
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 14, color: "#5a6a7a", lineHeight: 1.7 }} />}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 28 : 6, height: 4, borderRadius: 2, background: i === 0 ? "#e74c3c" : "#ddd" }} />)}
        </div>
      </div>
    </div>
  );
}

export function MedicalContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#f0f4f8", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, background: "#e74c3c", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(231,76,60,0.3)" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>{idx}</div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: "#e74c3c", letterSpacing: "2px", fontWeight: 600 }}>CHAPTER</div>
            <div style={{ fontSize: 10, color: "#888" }}>STEP {idx}</div>
          </div>
        </div>
        <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 20, fontWeight: 700, color: "#2c3e50", lineHeight: 1.35, marginBottom: 16 }} />
        <div style={{ flex: 1 }}>
          <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#4a5568", lineHeight: 1.85 }} />
        </div>
        {s.extra && (
          <div style={{ marginTop: 20, padding: "16px 20px", background: "#fff", borderRadius: 8, borderLeft: "4px solid #e74c3c", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>💊</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#e74c3c", letterSpacing: "1px" }}>MEDICAL NOTE</span>
            </div>
            <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }} />
          </div>
        )}
        <div style={{ display: "flex", gap: 6, marginTop: 24, alignItems: "center" }}>
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 24 : 6, height: 4, borderRadius: 2, background: i === idx ? "#e74c3c" : "#ccc" }} />)}
        </div>
      </div>
    </div>
  );
}

export function MedicalEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#f0f4f8", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 32px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "linear-gradient(90deg, #e74c3c, #c0392b)" }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#e74c3c", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 4px 16px rgba(231,76,60,0.3)" }}>
          <span style={{ fontSize: 32 }}>❤️</span>
        </div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 24, fontWeight: 700, color: "#2c3e50", marginBottom: 12, lineHeight: 1.3 }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 13, color: "#5a6a7a", marginBottom: 28, lineHeight: 1.6 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => <span key={i} style={{ padding: "6px 14px", background: "#fff", borderRadius: 16, fontSize: 11, color: "#e74c3c", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}><EditableTag text={t} c="#e74c3c" on={ed?.tag?.(i)} /></span>)}
        </div>
        <div style={{ fontSize: 10, color: "#888", letterSpacing: "1px" }}>— 如有不适请及时就医 —</div>
      </div>
    </div>
  );
}