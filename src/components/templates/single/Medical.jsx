import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Medical({ d, ed, drag }) {
  return (
    <div style={{ background: "#fff", padding: "32px 28px", fontFamily: FONT_FAMILY }}>
      {/* 医疗风格头部 */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, paddingBottom: 16, borderBottom: "2px solid #e74c3c" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#e74c3c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
          ⚕️
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: "#e74c3c", letterSpacing: "1px", marginBottom: 4 }}>健康科普 · {d.category}</div>
          <EditableText
            v={d.title}
            on={ed?.title}
            block
            style={{ fontSize: 20, fontWeight: 700, color: "#2c3e50", lineHeight: 1.35 }}
          />
        </div>
      </div>

      {/* 导语 */}
      {d.lead && (
        <div style={{ background: "#fdf2f2", padding: "14px 18px", marginBottom: 18, borderRadius: 8, borderLeft: "4px solid #e74c3c" }}>
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
        {d.sections.map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color="#e74c3c">
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", background: "#fafafa", borderRadius: 8 }}>
              <div style={{ minWidth: 28, height: 28, borderRadius: "50%", background: "#e74c3c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 700 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <EditableText v={s.heading} on={ed?.secH?.(i)} block style={{ fontSize: 14, fontWeight: 700, color: "#2c3e50", marginBottom: 4 }} />
                <EditableText v={s.text} on={ed?.secT?.(i)} block style={{ fontSize: 13, color: "#555", lineHeight: 1.8 }} />
              </div>
            </div>
          </DragRow>
        ))}
      </div>

      {/* Tips */}
      {d.tip && (
        <div style={{ marginTop: 18, padding: "14px 16px", background: "#fffbeb", borderRadius: 8, border: "1px solid #f59e0b" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#d97706", marginBottom: 4 }}>健康提醒</div>
              <EditableText v={d.tip} on={ed?.tip} block style={{ fontSize: 12, color: "#92400e", lineHeight: 1.7 }} />
            </div>
          </div>
        </div>
      )}

      {/* 标签 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
        {d.tags.map((t, i) => (
          <span key={i} style={{ padding: "5px 12px", background: "#fdf2f2", borderRadius: 12, fontSize: 11, color: "#e74c3c" }}>
            <EditableTag text={t} c="#e74c3c" on={ed?.tag?.(i)} />
          </span>
        ))}
      </div>

      {/* 底部声明 */}
      <div style={{ marginTop: 20, padding: "10px", background: "#f3f4f6", borderRadius: 6, textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#6b7280" }}>本文仅供参考，如有不适请及时就医</div>
      </div>
    </div>
  );
}
