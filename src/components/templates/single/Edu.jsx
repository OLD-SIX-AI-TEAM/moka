import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Edu({ d, ed, drag }) {
  return (
    <div style={{ background: "#faf8f5", padding: "32px 28px", fontFamily: FONT_FAMILY }}>
      {/* 教育风格头部 */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ display: "inline-block", padding: "6px 16px", background: d.a, color: "#fff", fontSize: 10, letterSpacing: "2px", marginBottom: 12 }}>
          {d.category}
        </div>
        <EditableText
          v={d.title}
          on={ed?.title}
          block
          style={{ fontSize: 24, fontWeight: 700, color: "#2c3e50", lineHeight: 1.35 }}
        />
        <div style={{ width: 60, height: 2, background: d.a, margin: "12px auto 0" }} />
      </div>

      {/* 导语 */}
      {d.lead && (
        <div style={{ background: "#fff", padding: "16px 20px", marginBottom: 20, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", borderTop: `3px solid ${d.a}` }}>
          <div style={{ fontSize: 12, color: d.a, fontWeight: 700, marginBottom: 6 }}>📚 课程导读</div>
          <EditableText
            v={d.lead}
            on={ed?.lead}
            block
            style={{ fontSize: 13, color: "#555", lineHeight: 1.8 }}
          />
        </div>
      )}

      {/* 内容区域 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {Array.isArray(d.sections) && d.sections.map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color={d.a}>
            <div style={{ background: "#fff", padding: "16px 18px", borderRadius: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ minWidth: 32, height: 32, borderRadius: "50%", background: `${d.a}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: d.a }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <EditableText v={s.heading} on={ed?.secH?.(i)} block style={{ fontSize: 15, fontWeight: 700, color: "#2c3e50", marginBottom: 6 }} />
                  <EditableText v={s.text} on={ed?.secT?.(i)} block style={{ fontSize: 13, color: "#555", lineHeight: 1.85 }} />
                </div>
              </div>
            </div>
          </DragRow>
        ))}
      </div>

      {/* Tips */}
      {d.tip && (
        <div style={{ marginTop: 20, padding: "14px 18px", background: "#fff3cd", borderRadius: 8, borderLeft: `4px solid ${d.a}` }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 18 }}>💡</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#856404", marginBottom: 4 }}>学习提示</div>
              <EditableText v={d.tip} on={ed?.tip} block style={{ fontSize: 12, color: "#856404", lineHeight: 1.7 }} />
            </div>
          </div>
        </div>
      )}

      {/* 标签 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20, justifyContent: "center" }}>
        {Array.isArray(d.tags) && d.tags.map((t, i) => (
          <span key={i} style={{ padding: "6px 14px", background: "#fff", borderRadius: 16, fontSize: 12, color: d.a, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <EditableTag text={t} c={d.a} on={ed?.tag?.(i)} />
          </span>
        ))}
      </div>

      {/* 底部 */}
      <div style={{ marginTop: 24, textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "#999" }}>— 持续学习，终身成长 —</div>
      </div>
    </div>
  );
}
