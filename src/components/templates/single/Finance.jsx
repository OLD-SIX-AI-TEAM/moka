import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Finance({ d, ed, drag }) {
  return (
    <div style={{ background: "#fff", padding: "32px 28px", fontFamily: FONT_FAMILY }}>
      {/* 财经风格头部 */}
      <div style={{ background: "#1a1a2e", margin: "-32px -28px 20px", padding: "20px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: "#ffd700", letterSpacing: "2px" }}>FINANCE · {d.category}</div>
          <div style={{ fontSize: 10, color: "#888" }}>{new Date().toLocaleDateString('zh-CN')}</div>
        </div>
        <EditableText
          v={d.title}
          on={ed?.title}
          block
          dk
          style={{ fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1.35 }}
        />
      </div>

      {/* 导语 */}
      {d.lead && (
        <div style={{ background: "#f8f9fa", padding: "14px 18px", marginBottom: 18, borderLeft: "3px solid #ffd700" }}>
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
          <DragRow key={i} i={i} drag={drag} color="#ffd700">
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ minWidth: 32, height: 32, background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#ffd700" }}>
                {String.fromCharCode(65 + i)}
              </div>
              <div style={{ flex: 1 }}>
                <EditableText v={s.heading} on={ed?.secH?.(i)} block style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }} />
                <EditableText v={s.text} on={ed?.secT?.(i)} block style={{ fontSize: 13, color: "#444", lineHeight: 1.8 }} />
              </div>
            </div>
          </DragRow>
        ))}
      </div>

      {/* Tips */}
      {d.tip && (
        <div style={{ marginTop: 18, padding: "12px 16px", background: "#fff8e1", borderRadius: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#f57c00" }}>📈 投资建议：</span>
          <EditableText v={d.tip} on={ed?.tip} style={{ fontSize: 12, color: "#666" }} />
        </div>
      )}

      {/* 标签 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18, paddingTop: 16, borderTop: "1px solid #eee" }}>
        {Array.isArray(d.tags) && d.tags.map((t, i) => (
          <span key={i} style={{ padding: "4px 12px", background: "#fff8e1", border: "1px solid #ffd700", borderRadius: 4, fontSize: 11, color: "#1a1a2e" }}>
            <EditableTag text={t} c="#1a1a2e" on={ed?.tag?.(i)} />
          </span>
        ))}
      </div>

      {/* 底部声明 */}
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <div style={{ fontSize: 9, color: "#999" }}>投资有风险，入市需谨慎 | 本文不构成投资建议</div>
      </div>
    </div>
  );
}
