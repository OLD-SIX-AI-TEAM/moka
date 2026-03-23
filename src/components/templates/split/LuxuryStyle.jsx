import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function LuxuryCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#faf9f8", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 48px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", top: 40, left: 40, right: 40, height: 1, background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)" }} />
      <div style={{ position: "absolute", bottom: 40, left: 40, right: 40, height: 1, background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)" }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 32 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#d4af37" }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: a }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#d4af37" }} />
        </div>
        <div style={{ fontSize: 9, color: "#999", letterSpacing: "6px", marginBottom: 24, fontWeight: 300 }}>{s.category.toUpperCase()}</div>
        <div style={{ fontSize: 48, marginBottom: 24, opacity: 0.15 }}>{s.emoji}</div>
        <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 32, fontWeight: 300, color: "#1a1a1a", lineHeight: 1.3, letterSpacing: "4px", marginBottom: 20 }} />
        <div style={{ width: 1, height: 40, background: "linear-gradient(180deg, #d4af37, transparent)", margin: "24px auto" }} />
        {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 13, color: "#888", lineHeight: 1.8, fontStyle: "italic", letterSpacing: "1px" }} />}
      </div>
      <div style={{ position: "absolute", bottom: 50, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8 }}>
        {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 24 : 6, height: 2, background: i === 0 ? "#d4af37" : "#e0e0e0" }} />)}
      </div>
    </div>
  );
}

export function LuxuryContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#faf9f8", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 40px", boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 40 }}>
        <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, #d4af37)" }} />
        <div style={{ margin: "0 20px", fontSize: 14, color: "#d4af37", fontFamily: "Georgia, serif" }}>{String.fromCharCode(8544 + idx - 1)}</div>
        <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, #d4af37, transparent)" }} />
      </div>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 20, fontWeight: 400, color: "#1a1a1a", lineHeight: 1.4, letterSpacing: "2px" }} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", paddingTop: 16 }}>
        <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#666", lineHeight: 2.2, textAlign: "center", maxWidth: "85%" }} />
      </div>
      {s.extra && (
        <div style={{ marginTop: 32, padding: "24px 32px", background: "#f5f4f2", textAlign: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: -1, left: "20%", right: "20%", height: 1, background: "linear-gradient(90deg, transparent, #d4af37, transparent)" }} />
          <div style={{ fontSize: 10, color: "#d4af37", letterSpacing: "3px", marginBottom: 12 }}>◆ A CURATED NOTE ◆</div>
          <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 13, color: "#555", lineHeight: 1.8, fontStyle: "italic" }} />
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
        {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 24 : 6, height: 2, background: i === idx ? "#d4af37" : "#e0e0e0" }} />)}
      </div>
    </div>
  );
}

export function LuxuryEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#faf9f8", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px 48px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", top: 40, left: 40, right: 40, height: 1, background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)" }} />
      <div style={{ position: "absolute", bottom: 40, left: 40, right: 40, height: 1, background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)" }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 28, opacity: 0.2 }}>◆</div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 24, fontWeight: 300, color: "#1a1a1a", marginBottom: 16, letterSpacing: "4px", lineHeight: 1.4 }} />
        <div style={{ width: 1, height: 30, background: "linear-gradient(180deg, #d4af37, transparent)", margin: "20px auto" }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 13, color: "#888", marginBottom: 32, fontStyle: "italic", letterSpacing: "1px" }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginBottom: 32 }}>
          {s.tags.map((t, i) => <span key={i} style={{ fontSize: 11, color: "#999", letterSpacing: "2px" }}><EditableTag text={t} c="#999" on={ed?.tag?.(i)} /></span>)}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#d4af37" }} />
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: a }} />
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#d4af37" }} />
        </div>
      </div>
    </div>
  );
}