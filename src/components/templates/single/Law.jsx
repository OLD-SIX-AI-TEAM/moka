import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Law({ d, ed, drag }) {
  return (
    <div style={{ background: "#fafafa", padding: "32px 28px", fontFamily: FONT_FAMILY }}>
      {/* 法律风格头部 */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚖️</div>
        <EditableText
          v={d.title}
          on={ed?.title}
          block
          style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.35 }}
        />
        <div style={{ width: 80, height: 2, background: "#8b4513", margin: "12px auto 0" }} />
        <div style={{ fontSize: 10, color: "#666", letterSpacing: "2px", marginTop: 8 }}>LEGAL · {d.category}</div>
      </div>

      {/* 导语 */}
      {d.lead && (
        <div style={{ background: "#fff", padding: "16px 20px", marginBottom: 18, border: "1px solid #e0e0e0", borderLeft: "4px solid #8b4513" }}>
          <EditableText
            v={d.lead}
            on={ed?.lead}
            block
            style={{ fontSize: 13, color: "#444", lineHeight: 1.8 }}
          />
        </div>
      )}

      {/* 内容区域 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {Array.isArray(d.sections) && d.sections.map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color="#8b4513">
            <div style={{ background: "#fff", padding: "14px 16px", border: "1px solid #e8e8e8" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ minWidth: 28, height: 28, border: "2px solid #8b4513", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#8b4513" }}>
                  {String.fromCharCode(8544 + i)}
                </div>
                <div style={{ flex: 1 }}>
                  <EditableText v={s.heading} on={ed?.secH?.(i)} block style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }} />
                  <EditableText v={s.text} on={ed?.secT?.(i)} block style={{ fontSize: 13, color: "#444", lineHeight: 1.8 }} />
                </div>
              </div>
            </div>
          </DragRow>
        ))}
      </div>

      {/* Tips */}
      {d.tip && (
        <div style={{ marginTop: 18, padding: "14px 16px", background: "#fff8dc", border: "1px solid #daa520" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#8b4513" }}>📋 法律提示：</span>
          <EditableText v={d.tip} on={ed?.tip} style={{ fontSize: 12, color: "#5a4a3a" }} />
        </div>
      )}

      {/* 标签 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18, justifyContent: "center" }}>
        {Array.isArray(d.tags) && d.tags.map((t, i) => (
          <span key={i} style={{ padding: "5px 12px", background: "#fff", border: "1px solid #8b4513", fontSize: 11, color: "#8b4513" }}>
            <EditableTag text={t} c="#8b4513" on={ed?.tag?.(i)} noBorder />
          </span>
        ))}
      </div>

      {/* 底部声明 */}
      <div style={{ marginTop: 20, padding: "12px", background: "#f0f0f0", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#666" }}>本文仅供参考，具体法律问题请咨询专业律师</div>
      </div>
    </div>
  );
}
