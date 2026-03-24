import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Ins({ d, ed, drag }) {
  return (
    <div style={{ background: "#fff", padding: "40px 32px", fontFamily: FONT_FAMILY }}>
      {/* 极简顶部 */}
      <div style={{ marginBottom: 30 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#999", letterSpacing: "3px", textTransform: "uppercase", marginBottom: 16 }}>
          {d.category}
        </div>
        <EditableText
          v={d.title}
          on={ed?.title}
          block
          style={{ fontSize: 26, fontWeight: 300, color: "#111", lineHeight: 1.25, letterSpacing: "-0.5px" }}
        />
        <div style={{ width: 40, height: 2, background: d.a, marginTop: 20 }} />
      </div>

      {/* 导语 */}
      {d.lead && (
        <EditableText
          v={d.lead}
          on={ed?.lead}
          block
          style={{ fontSize: 15, color: "#666", lineHeight: 1.9, marginBottom: 30, fontWeight: 300 }}
        />
      )}

      {/* 内容 - 大量留白 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {Array.isArray(d.sections) && d.sections.map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color={d.a}>
            <div style={{ paddingBottom: 28, borderBottom: i < d.sections.length - 1 ? "1px solid #f0f0f0" : "none" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: d.a, letterSpacing: "1px" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <EditableText v={s.heading} on={ed?.secH?.(i)} block style={{ fontSize: 16, fontWeight: 600, color: "#111", letterSpacing: "-0.3px" }} />
              </div>
              <EditableText v={s.text} on={ed?.secT?.(i)} block style={{ fontSize: 14, color: "#555", lineHeight: 2, paddingLeft: 28, fontWeight: 300 }} />
            </div>
          </DragRow>
        ))}
      </div>

      {/* Tips - 极简风格 */}
      {d.tip && (
        <div style={{ marginTop: 32, padding: "20px 0", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
          <EditableText v={d.tip} on={ed?.tip} block style={{ fontSize: 14, color: "#888", lineHeight: 1.8, fontStyle: "italic", fontWeight: 300 }} />
        </div>
      )}

      {/* 标签 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 32 }}>
        {Array.isArray(d.tags) && d.tags.map((t, i) => (
          <span key={i} style={{ fontSize: 12, color: "#999", fontWeight: 400 }}>
            <EditableTag text={`#${t}`} c="#999" on={ed?.tag?.(i)} />
          </span>
        ))}
      </div>

      {/* 底部品牌 */}
      <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: d.a, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
          {d.emoji}
        </div>
        <div style={{ fontSize: 10, color: "#bbb", letterSpacing: "2px" }}>XIAOHONGSHU</div>
      </div>
    </div>
  );
}
