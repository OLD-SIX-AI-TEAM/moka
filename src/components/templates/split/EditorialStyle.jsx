import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function EditorialCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#fafafa", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ background: a, padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 11, color: "#fff", fontWeight: 700, letterSpacing: "4px" }}>EDITORIAL</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>MAGAZINE</div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "40px 36px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 32 }}>
          <div style={{ width: 4, height: 60, background: a }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: "#999", letterSpacing: "3px", marginBottom: 12 }}>FEATURE STORY</div>
            <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 36, fontWeight: 800, color: "#111", lineHeight: 1.15, letterSpacing: "-0.5px" }} />
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 15, color: "#444", lineHeight: 1.7, maxWidth: "85%" }} />}
          <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
            {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 32 : 8, height: 3, background: i === 0 ? a : "#ddd" }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function EditorialContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 24, padding: "28px 24px 0" }}>
        <div style={{ fontSize: 64, fontWeight: 900, color: "#f0f0f0", lineHeight: 1, fontFamily: "Georgia, serif" }}>{String(idx).padStart(2, "0")}</div>
        <div style={{ flex: 1, paddingTop: 8 }}>
          <div style={{ fontSize: 9, color: "#999", letterSpacing: "2px", marginBottom: 8 }}>CONTINUED</div>
          <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 20, fontWeight: 700, color: "#111", lineHeight: 1.3 }} />
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 24px" }}>
        <div style={{ flex: 1, borderLeft: `2px solid ${a}30`, paddingLeft: 16 }}>
          <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#333", lineHeight: 1.9 }} />
        </div>
        {s.extra && (
          <div style={{ marginTop: 20, padding: "16px 20px", background: "#fafafa", borderLeft: `3px solid ${a}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: a, letterSpacing: "1px", marginBottom: 8 }}>EDITOR'S NOTE</div>
            <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }} />
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 20, alignItems: "center" }}>
          <div style={{ flex: 1, height: 1, background: "#eee" }} />
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 32 : 8, height: 3, background: i === idx ? a : "#ddd" }} />)}
        </div>
      </div>
    </div>
  );
}

export function EditorialEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#fafafa", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 32px", boxSizing: "border-box" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 80, height: 1, background: a }} />
          <div style={{ fontSize: 24, color: a }}>❧</div>
          <div style={{ width: 80, height: 1, background: a }} />
        </div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 28, fontWeight: 800, color: "#111", marginBottom: 12, lineHeight: 1.2 }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "#555", marginBottom: 32, lineHeight: 1.6 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => <span key={i} style={{ padding: "6px 16px", background: "#fff", border: `1px solid ${a}50`, fontSize: 12, color: "#555" }}><EditableTag text={t} c="#555" on={ed?.tag?.(i)} /></span>)}
        </div>
        <div style={{ fontSize: 10, color: "#999", letterSpacing: "3px" }}>— END OF FEATURE —</div>
      </div>
    </div>
  );
}

// 别名导出以兼容现有代码
export { EditorialCover as EdCover, EditorialContent as EdContent, EditorialEnd as EdEnd };