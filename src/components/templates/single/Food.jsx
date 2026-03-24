import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Food({ d, ed, drag }) {
  return (
    <div style={{ background: "#fff9f0", padding: "32px 26px", fontFamily: FONT_FAMILY }}>
      {/* 美食风格头部 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 20 }}>🍽️</span>
          <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg,${d.a},transparent)` }} />
          <span style={{ fontSize: 10, color: d.a, fontWeight: 700, letterSpacing: "2px" }}>{d.category}</span>
          <div style={{ flex: 1, height: 2, background: `linear-gradient(270deg,${d.a},transparent)` }} />
          <span style={{ fontSize: 20 }}>🍽️</span>
        </div>
        <EditableText
          v={d.title}
          on={ed?.title}
          block
          style={{ fontSize: 24, fontWeight: 800, color: "#3d2914", lineHeight: 1.3, textAlign: "center" }}
        />
      </div>

      {/* 导语 */}
      {d.lead && (
        <div style={{ background: "#fff", padding: "14px 18px", marginBottom: 18, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "center" }}>
          <span style={{ fontSize: 18, marginRight: 8 }}>😋</span>
          <EditableText
            v={d.lead}
            on={ed?.lead}
            style={{ fontSize: 13, color: "#5a4a3a", lineHeight: 1.75 }}
          />
        </div>
      )}

      {/* 内容区域 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {(d.sections || []).map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color={d.a}>
            <div style={{ background: "#fff", padding: "14px 16px", borderRadius: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ fontSize: 22 }}>{["🥘", "🍜", "🥗", "🍰", "🍹"][i % 5]}</div>
                <div style={{ flex: 1 }}>
                  <EditableText v={s.heading} on={ed?.secH?.(i)} block style={{ fontSize: 15, fontWeight: 800, color: "#3d2914", marginBottom: 4 }} />
                  <EditableText v={s.text} on={ed?.secT?.(i)} block style={{ fontSize: 13, color: "#5a4a3a", lineHeight: 1.8 }} />
                </div>
              </div>
            </div>
          </DragRow>
        ))}
      </div>

      {/* Tips */}
      {d.tip && (
        <div style={{ marginTop: 18, padding: "12px 16px", background: "#fff3e0", borderRadius: 10, display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ fontSize: 20 }}>👨‍🍳</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: d.a, marginBottom: 4 }}>大厨秘诀</div>
            <EditableText v={d.tip} on={ed?.tip} block style={{ fontSize: 12, color: "#5a4a3a", lineHeight: 1.7 }} />
          </div>
        </div>
      )}

      {/* 标签 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18, justifyContent: "center" }}>
        {d.tags.map((t, i) => (
          <span key={i} style={{ padding: "6px 14px", background: d.a, borderRadius: 16, fontSize: 12, color: "#fff", fontWeight: 600 }}>
            <EditableTag text={t} c="#fff" on={ed?.tag?.(i)} />
          </span>
        ))}
      </div>

      {/* 底部 */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
        <span style={{ fontSize: 16 }}>🌟</span>
        <span style={{ fontSize: 16 }}>🌟</span>
        <span style={{ fontSize: 16 }}>🌟</span>
      </div>
    </div>
  );
}
