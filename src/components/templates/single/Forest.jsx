import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Forest({ d, ed, drag }) {
  return (
    <div style={{ background: d.bg, padding: "30px 24px", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden" }}>
      {/* 植物装饰SVG */}
      <svg style={{ position: "absolute", top: 0, right: 0, width: 150, height: 150, opacity: 0.1 }} viewBox="0 0 100 100">
        <path d="M80 20 Q90 40 80 60 Q70 80 80 100" fill="none" stroke={d.a} strokeWidth="2" />
        <circle cx="75" cy="30" r="5" fill={d.a} />
        <circle cx="85" cy="50" r="4" fill={d.a} />
        <circle cx="78" cy="75" r="6" fill={d.a} />
      </svg>
      <svg style={{ position: "absolute", bottom: 0, left: 0, width: 120, height: 120, opacity: 0.08 }} viewBox="0 0 100 100">
        <path d="M20 80 Q10 60 20 40 Q30 20 20 0" fill="none" stroke={d.a} strokeWidth="2" />
        <circle cx="25" cy="70" r="4" fill={d.a} />
        <circle cx="15" cy="50" r="5" fill={d.a} />
      </svg>

      {/* 顶部藤蔓装饰 */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
        <span style={{ fontSize: 16 }}>🌿</span>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${d.a},transparent)` }} />
        <span style={{ fontSize: 10, color: d.a, fontWeight: 700, letterSpacing: "2px" }}>{d.category}</span>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(270deg,${d.a},transparent)` }} />
        <span style={{ fontSize: 16 }}>🌿</span>
      </div>

      {/* 标题卡片 */}
      <div style={{ background: "#fff", padding: "22px 20px", borderRadius: "20px 20px 20px 4px", marginBottom: 18, boxShadow: "0 4px 16px rgba(0,0,0,0.06)", position: "relative" }}>
        <div style={{ position: "absolute", top: -8, left: 20, width: 16, height: 16, background: d.a, borderRadius: "50%" }} />
        <div style={{ fontSize: 36, marginBottom: 8, textAlign: "center" }}>{d.emoji}</div>
        <EditableText
          v={d.title}
          on={ed?.title}
          block
          style={{ fontSize: 21, fontWeight: 800, color: d.tc, lineHeight: 1.35, textAlign: "center" }}
        />
      </div>

      {/* 导语 */}
      {d.lead && (
        <div style={{ background: `${d.a}10`, padding: "14px 18px", borderRadius: "4px 18px 18px 18px", marginBottom: 18, borderLeft: `3px solid ${d.a}` }}>
          <EditableText
            v={d.lead}
            on={ed?.lead}
            block
            style={{ fontSize: 13, color: d.bc, lineHeight: 1.8 }}
          />
        </div>
      )}

      {/* 内容区域 - 叶子卡片 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {(d.sections || []).map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color={d.a}>
            <div style={{ background: "#fff", padding: "16px 18px", borderRadius: i % 2 === 0 ? "18px 4px 18px 18px" : "4px 18px 18px 18px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ fontSize: 20, flexShrink: 0 }}>{["🍃", "🌱", "🌿", "🍀", "🌾"][i % 5]}</div>
                <div style={{ flex: 1 }}>
                  <EditableText v={s.heading} on={ed?.secH?.(i)} block style={{ fontSize: 14, fontWeight: 800, color: d.tc, marginBottom: 4 }} />
                  <EditableText v={s.text} on={ed?.secT?.(i)} block style={{ fontSize: 13, color: d.bc, lineHeight: 1.85 }} />
                </div>
              </div>
            </div>
          </DragRow>
        ))}
      </div>

      {/* Tips */}
      {d.tip && (
        <div style={{ marginTop: 18, padding: "12px 16px", background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ fontSize: 18 }}>💚</span>
          <EditableText v={d.tip} on={ed?.tip} block style={{ fontSize: 12, color: d.bc, lineHeight: 1.75 }} />
        </div>
      )}

      {/* 标签 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18, justifyContent: "center" }}>
        {d.tags.map((t, i) => (
          <span key={i} style={{ padding: "6px 14px", background: `${d.a}12`, borderRadius: 16, fontSize: 12, color: d.a, fontWeight: 600 }}>
            <EditableTag text={t} c={d.a} on={ed?.tag?.(i)} />
          </span>
        ))}
      </div>

      {/* 底部装饰 */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20, gap: 4 }}>
        <span style={{ fontSize: 14, opacity: 0.6 }}>🌸</span>
        <span style={{ fontSize: 14, opacity: 0.8 }}>🌼</span>
        <span style={{ fontSize: 14, opacity: 0.6 }}>🌸</span>
      </div>
    </div>
  );
}
