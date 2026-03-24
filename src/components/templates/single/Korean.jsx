import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Korean({ d, ed, drag }) {
  return (
    <div style={{ background: d.bg, padding: "28px 22px", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden" }}>
      {/* 韩系可爱装饰 */}
      <div style={{ position: "absolute", top: 15, right: 20, fontSize: 24, opacity: 0.3 }}>✨</div>
      <div style={{ position: "absolute", bottom: 20, left: 15, fontSize: 20, opacity: 0.3 }}>💕</div>
      
      {/* 顶部装饰带 */}
      <div style={{ display: "flex", gap: 4, marginBottom: 18, justifyContent: "center" }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: `${d.a}${40 + i * 15}`, transform: `scale(${1 - i * 0.1})` }} />
        ))}
      </div>

      {/* 标题区域 */}
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ display: "inline-block", padding: "8px 20px", background: `${d.a}15`, borderRadius: 20, marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: d.a, fontWeight: 700 }}>{d.category}</span>
        </div>
        <div style={{ fontSize: 38, marginBottom: 10 }}>{d.emoji}</div>
        <EditableText
          v={d.title}
          on={ed?.title}
          block
          style={{ fontSize: 21, fontWeight: 800, color: d.tc, lineHeight: 1.35 }}
        />
      </div>

      {/* 导语 */}
      {d.lead && (
        <div style={{ background: "#fff", padding: "14px 18px", borderRadius: 16, marginBottom: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.04)", textAlign: "center" }}>
          <span style={{ fontSize: 14, marginRight: 6 }}>🎀</span>
          <EditableText
            v={d.lead}
            on={ed?.lead}
            style={{ fontSize: 13, color: d.bc, lineHeight: 1.75 }}
          />
        </div>
      )}

      {/* 内容区域 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {(d.sections || []).map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color={d.a}>
            <div style={{ background: "#fff", padding: "14px 16px", borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.03)", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ minWidth: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${d.a},${d.a}60)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#fff", fontWeight: 800 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <EditableText v={s.heading} on={ed?.secH?.(i)} block style={{ fontSize: 14, fontWeight: 800, color: d.tc, marginBottom: 3 }} />
                <EditableText v={s.text} on={ed?.secT?.(i)} block style={{ fontSize: 13, color: d.bc, lineHeight: 1.8 }} />
              </div>
            </div>
          </DragRow>
        ))}
      </div>

      {/* Tips */}
      {d.tip && (
        <div style={{ marginTop: 16, padding: "12px 16px", background: `${d.a}10`, borderRadius: 12, display: "flex", alignItems: "flex-start", gap: 8 }}>
          <span style={{ fontSize: 16 }}>💝</span>
          <EditableText v={d.tip} on={ed?.tip} block style={{ fontSize: 12, color: d.bc, lineHeight: 1.7 }} />
        </div>
      )}

      {/* 标签 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16, justifyContent: "center" }}>
        {d.tags.map((t, i) => (
          <span key={i} style={{ padding: "6px 14px", background: `${d.a}12`, borderRadius: 16, fontSize: 12, color: d.a, fontWeight: 600 }}>
            <EditableTag text={`#${t}`} c={d.a} on={ed?.tag?.(i)} />
          </span>
        ))}
      </div>

      {/* 底部装饰 */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 18 }}>
        <span style={{ fontSize: 12 }}>♡</span>
        <span style={{ fontSize: 12 }}>♡</span>
        <span style={{ fontSize: 12 }}>♡</span>
      </div>
    </div>
  );
}
