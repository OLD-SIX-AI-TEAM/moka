import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Pure({ d, ed, drag }) {
  return (
    <div style={{ background: "#fff", padding: "48px 36px", fontFamily: FONT_FAMILY }}>
      {/* 极简标题 */}
      <div style={{ marginBottom: 40 }}>
        <EditableText
          v={d.title}
          on={ed?.title}
          block
          style={{ fontSize: 28, fontWeight: 700, color: "#111", lineHeight: 1.2, letterSpacing: "-0.5px" }}
        />
        <div style={{ width: 24, height: 2, background: d.a, marginTop: 16 }} />
      </div>

      {/* 导语 */}
      {d.lead && (
        <EditableText
          v={d.lead}
          on={ed?.lead}
          block
          style={{ fontSize: 15, color: "#666", lineHeight: 1.9, marginBottom: 40, fontWeight: 300 }}
        />
      )}

      {/* 内容 - 极简留白 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        {(d.sections || []).map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color={d.a}>
            <div>
              <EditableText v={s.heading} on={ed?.secH?.(i)} block style={{ fontSize: 15, fontWeight: 600, color: "#111", marginBottom: 10, letterSpacing: "-0.3px" }} />
              <EditableText v={s.text} on={ed?.secT?.(i)} block style={{ fontSize: 14, color: "#444", lineHeight: 1.9, fontWeight: 300 }} />
            </div>
          </DragRow>
        ))}
      </div>

      {/* Tips */}
      {d.tip && (
        <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid #eee" }}>
          <EditableText v={d.tip} on={ed?.tip} block style={{ fontSize: 13, color: "#888", lineHeight: 1.8, fontStyle: "italic" }} />
        </div>
      )}

      {/* 标签 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 40 }}>
        {d.tags.map((t, i) => (
          <span key={i} style={{ fontSize: 12, color: "#999" }}>
            <EditableTag text={t} c="#999" on={ed?.tag?.(i)} />
          </span>
        ))}
      </div>
    </div>
  );
}
