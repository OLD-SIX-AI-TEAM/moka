import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Travel({ d, ed, drag }) {
  return (
    <div style={{ background: "#f0f9ff", padding: "32px 26px", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden" }}>
      {/* 旅行装饰 */}
      <div style={{ position: "absolute", top: 20, right: 20, fontSize: 48, opacity: 0.1 }}>✈️</div>
      <div style={{ position: "absolute", bottom: 30, left: 20, fontSize: 36, opacity: 0.1 }}>🗺️</div>

      {/* 头部 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 24 }}>🧭</span>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${d.a},transparent)` }} />
          <span style={{ fontSize: 10, color: d.a, fontWeight: 700, letterSpacing: "2px" }}>{d.category}</span>
        </div>
        <EditableText
          v={d.title}
          on={ed?.title}
          block
          style={{ fontSize: 23, fontWeight: 800, color: "#1e3a5f", lineHeight: 1.35 }}
        />
      </div>

      {/* 导语 */}
      {d.lead && (
        <div style={{ background: "#fff", padding: "14px 18px", marginBottom: 18, borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", borderLeft: `4px solid ${d.a}` }}>
          <span style={{ fontSize: 16, marginRight: 8 }}>🎒</span>
          <EditableText
            v={d.lead}
            on={ed?.lead}
            style={{ fontSize: 13, color: "#4a5568", lineHeight: 1.75 }}
          />
        </div>
      )}

      {/* 内容区域 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {d.sections.map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color={d.a}>
            <div style={{ background: "#fff", padding: "14px 16px", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ minWidth: 32, height: 32, borderRadius: "50%", background: d.a, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                  {["📍", "🏨", "🍽️", "📸", "🎫"][i % 5]}
                </div>
                <div style={{ flex: 1 }}>
                  <EditableText v={s.heading} on={ed?.secH?.(i)} block style={{ fontSize: 15, fontWeight: 800, color: "#1e3a5f", marginBottom: 4 }} />
                  <EditableText v={s.text} on={ed?.secT?.(i)} block style={{ fontSize: 13, color: "#4a5568", lineHeight: 1.8 }} />
                </div>
              </div>
            </div>
          </DragRow>
        ))}
      </div>

      {/* Tips */}
      {d.tip && (
        <div style={{ marginTop: 18, padding: "12px 16px", background: "#fef3c7", borderRadius: 10, display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ fontSize: 20 }}>💡</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#d97706", marginBottom: 4 }}>旅行小贴士</div>
            <EditableText v={d.tip} on={ed?.tip} block style={{ fontSize: 12, color: "#92400e", lineHeight: 1.7 }} />
          </div>
        </div>
      )}

      {/* 标签 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
        {d.tags.map((t, i) => (
          <span key={i} style={{ padding: "6px 14px", background: "#fff", borderRadius: 16, fontSize: 12, color: d.a, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <EditableTag text={`#${t}`} c={d.a} on={ed?.tag?.(i)} />
          </span>
        ))}
      </div>

      {/* 底部 */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 22 }}>
        <span style={{ fontSize: 20 }}>✈️</span>
        <span style={{ fontSize: 20 }}>🌍</span>
        <span style={{ fontSize: 20 }}>🧳</span>
      </div>
    </div>
  );
}
