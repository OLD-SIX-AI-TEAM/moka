import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Business({ d, ed, drag }) {
  return (
    <div style={{ background: "#fff", padding: "32px 28px", fontFamily: FONT_FAMILY }}>
      {/* 专业头部 */}
      <div style={{ borderBottom: "2px solid #2c5aa0", paddingBottom: 16, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: "#666", letterSpacing: "1px" }}>专业资讯 · {d.category}</div>
          <div style={{ fontSize: 10, color: "#999" }}>{new Date().toLocaleDateString('zh-CN')}</div>
        </div>
        <EditableText
          v={d.title}
          on={ed?.title}
          block
          style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.35 }}
        />
      </div>

      {/* 导语 */}
      {d.lead && (
        <div style={{ background: "#f5f7fa", padding: "14px 18px", marginBottom: 18, borderLeft: "3px solid #2c5aa0" }}>
          <EditableText
            v={d.lead}
            on={ed?.lead}
            block
            style={{ fontSize: 13, color: "#444", lineHeight: 1.8 }}
          />
        </div>
      )}

      {/* 内容区域 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {d.sections.map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color="#2c5aa0">
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ minWidth: 26, height: 26, background: "#2c5aa0", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <EditableText v={s.heading} on={ed?.secH?.(i)} block style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }} />
                <EditableText v={s.text} on={ed?.secT?.(i)} block style={{ fontSize: 13, color: "#444", lineHeight: 1.85 }} />
              </div>
            </div>
          </DragRow>
        ))}
      </div>

      {/* Tips */}
      {d.tip && (
        <div style={{ marginTop: 18, padding: "12px 16px", background: "#e8f0fe", borderRadius: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#2c5aa0" }}>专业提示：</span>
          <EditableText v={d.tip} on={ed?.tip} style={{ fontSize: 12, color: "#444" }} />
        </div>
      )}

      {/* 标签 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18, paddingTop: 16, borderTop: "1px solid #eee" }}>
        {d.tags.map((t, i) => (
          <span key={i} style={{ padding: "4px 12px", background: "#f5f7fa", fontSize: 11, color: "#2c5aa0" }}>
            <EditableTag text={t} c="#2c5aa0" on={ed?.tag?.(i)} />
          </span>
        ))}
      </div>

      {/* 底部 */}
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#999" }}>— 转载请注明来源 —</div>
      </div>
    </div>
  );
}
