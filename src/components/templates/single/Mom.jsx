import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Mom({ d, ed, drag }) {
  return (
    <div style={{ background: "#fff5f7", padding: "32px 26px", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden" }}>
      {/* 温馨装饰 */}
      <div style={{ position: "absolute", top: 15, right: 20, fontSize: 40, opacity: 0.15 }}>🍼</div>
      <div style={{ position: "absolute", bottom: 20, left: 15, fontSize: 32, opacity: 0.15 }}>👶</div>

      {/* 头部 */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px", background: "#fff", borderRadius: 20, marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <span style={{ fontSize: 16 }}>🤱</span>
          <span style={{ fontSize: 11, color: d.a, fontWeight: 700 }}>{d.category}</span>
        </div>
        <EditableText
          v={d.title}
          on={ed?.title}
          block
          style={{ fontSize: 22, fontWeight: 800, color: "#5d4e6d", lineHeight: 1.35 }}
        />
      </div>

      {/* 导语 */}
      {d.lead && (
        <div style={{ background: "#fff", padding: "14px 18px", marginBottom: 18, borderRadius: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.04)", textAlign: "center" }}>
          <span style={{ fontSize: 18, marginRight: 6 }}>💝</span>
          <EditableText
            v={d.lead}
            on={ed?.lead}
            style={{ fontSize: 13, color: "#6b5b7a", lineHeight: 1.75 }}
          />
        </div>
      )}

      {/* 内容区域 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {Array.isArray(d.sections) && d.sections.map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color={d.a}>
            <div style={{ background: "#fff", padding: "14px 16px", borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ fontSize: 20 }}>{["🧸", "🎀", "🌸", "⭐", "💖"][i % 5]}</div>
                <div style={{ flex: 1 }}>
                  <EditableText v={s.heading} on={ed?.secH?.(i)} block style={{ fontSize: 14, fontWeight: 800, color: "#5d4e6d", marginBottom: 4 }} />
                  <EditableText v={s.text} on={ed?.secT?.(i)} block style={{ fontSize: 13, color: "#6b5b7a", lineHeight: 1.8 }} />
                </div>
              </div>
            </div>
          </DragRow>
        ))}
      </div>

      {/* Tips */}
      {d.tip && (
        <div style={{ marginTop: 18, padding: "12px 16px", background: "#e8f4f8", borderRadius: 12, display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ fontSize: 20 }}>💡</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#4a7c8a", marginBottom: 4 }}>宝妈小贴士</div>
            <EditableText v={d.tip} on={ed?.tip} block style={{ fontSize: 12, color: "#5a6c7a", lineHeight: 1.7 }} />
          </div>
        </div>
      )}

      {/* 标签 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18, justifyContent: "center" }}>
        {Array.isArray(d.tags) && d.tags.map((t, i) => (
          <span key={i} style={{ padding: "6px 14px", background: "#fff", borderRadius: 16, fontSize: 12, color: d.a, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <EditableTag text={t} c={d.a} on={ed?.tag?.(i)} />
          </span>
        ))}
      </div>

      {/* 底部 */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }}>
        <span style={{ fontSize: 14 }}>💕</span>
        <span style={{ fontSize: 14 }}>👶</span>
        <span style={{ fontSize: 14 }}>💕</span>
      </div>
    </div>
  );
}
