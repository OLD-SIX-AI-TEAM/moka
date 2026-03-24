import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Minimal({ d, ed, drag }) {
  return (
    <div style={{ background: "#fff", padding: "36px 28px", fontFamily: FONT_FAMILY }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
        <div style={{ width: 3, height: 28, background: d.a }} />
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${d.a}50,transparent)` }} />
        <div style={{ width: 7, height: 7, borderRadius: "50%", border: `2px solid ${d.a}` }} />
      </div>
      <div style={{ position: "relative", paddingBottom: 6, marginBottom: 17 }}>
        <EditableText
          v={d.title}
          on={ed?.title}
          block
          style={{ fontSize: 23, fontWeight: 900, color: "#111", lineHeight: 1.3, letterSpacing: "-0.3px" }}
        />
        <div style={{ position: "absolute", bottom: 0, left: 0, width: 50, height: 3, background: d.a }} />
      </div>
      {d.lead && (
        <EditableText
          v={d.lead}
          on={ed?.lead}
          block
          style={{ fontSize: 13, color: "#666", lineHeight: 1.8, marginBottom: 18, paddingBottom: 13, borderBottom: "1px solid #eee" }}
        />
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {(d.sections || []).map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color={d.a} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: d.a, color: "#fff", fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
              {i + 1}
            </div>
            <div>
              <EditableText v={s.heading} on={ed?.secH?.(i)} block style={{ fontSize: 13, fontWeight: 800, color: "#111", marginBottom: 2 }} />
              <EditableText v={s.text} on={ed?.secT?.(i)} block style={{ fontSize: 13, color: "#555", lineHeight: 1.85 }} />
            </div>
          </DragRow>
        ))}
      </div>
      {d.tip && (
        <div style={{ display: "flex", gap: 8, margin: "18px 0 0", padding: "10px 12px", background: "#f6f6f6" }}>
          <span style={{ fontSize: 15, flexShrink: 0 }}>💡</span>
          <EditableText v={d.tip} on={ed?.tip} style={{ fontSize: 12, color: "#555", lineHeight: 1.75 }} />
        </div>
      )}
      <div style={{ marginTop: 16, paddingTop: 11, borderTop: "1px solid #f0f0f0", display: "flex", flexWrap: "wrap", gap: 6 }}>
        {d.tags.map((t, i) => (
          <EditableTag key={i} text={t} c="#888" on={ed?.tag?.(i)} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 4, marginTop: 13 }}>
        <div style={{ flex: 3, height: 1, background: d.a }} />
        <div style={{ flex: 1, height: 1, background: "#ddd" }} />
      </div>
    </div>
  );
}
