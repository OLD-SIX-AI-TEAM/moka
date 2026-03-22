import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Newspaper({ d, ed, drag }) {
  return (
    <div style={{ background: "#fdfbf4", padding: "28px 24px", fontFamily: FONT_FAMILY, border: "1px solid #d4c9a8" }}>
      <div style={{ textAlign: "center", borderBottom: `3px double ${d.a}`, paddingBottom: 9, marginBottom: 13 }}>
        <div style={{ fontSize: 9, letterSpacing: "4px", color: "#888", fontWeight: 700, marginBottom: 3 }}>— XIAOHONGSHU POST —</div>
        <EditableText
          v={d.title}
          on={ed?.title}
          block
          style={{ fontSize: 21, fontWeight: 900, color: "#1a1510", lineHeight: 1.2, letterSpacing: "-0.3px" }}
        />
        <div style={{ fontSize: 11, color: d.a, fontWeight: 700, marginTop: 4, letterSpacing: "1px" }}>
          {d.category} · {d.emoji}
        </div>
      </div>
      {d.lead && (
        <EditableText
          v={d.lead}
          on={ed?.lead}
          block
          style={{ fontSize: 13, color: "#555", lineHeight: 1.8, marginBottom: 13, textAlign: "center", fontStyle: "italic", borderBottom: "1px solid #e0d8c0", paddingBottom: 13 }}
        />
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {d.sections.map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color={d.a}>
            {s.heading && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                <div style={{ width: 17, height: 17, background: d.a, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, color: "#fff", flexShrink: 0 }}>
                  {String.fromCharCode(9312 + i)}
                </div>
                <EditableText
                  v={s.heading}
                  on={ed?.secH?.(i)}
                  style={{ fontSize: 13, fontWeight: 900, color: "#1a1510", borderBottom: `1px solid ${d.a}60`, paddingBottom: 1 }}
                />
              </div>
            )}
            <EditableText
              v={s.text}
              on={ed?.secT?.(i)}
              block
              style={{ fontSize: 13, color: "#444", lineHeight: 1.85, paddingLeft: s.heading ? 22 : 0 }}
            />
          </DragRow>
        ))}
      </div>
      {d.tip && (
        <div style={{ margin: "14px 0 0", padding: "9px 11px", borderLeft: `3px solid ${d.a}`, background: "#f5f0e0" }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: d.a }}>编辑注 · </span>
          <EditableText v={d.tip} on={ed?.tip} style={{ fontSize: 12, color: "#555" }} />
        </div>
      )}
      <div style={{ marginTop: 13, paddingTop: 11, borderTop: `2px double ${d.a}44`, display: "flex", flexWrap: "wrap", gap: 6 }}>
        {d.tags.map((t, i) => (
          <EditableTag key={i} text={t} c={d.a} on={ed?.tag?.(i)} />
        ))}
      </div>
    </div>
  );
}
