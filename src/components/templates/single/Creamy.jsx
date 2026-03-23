import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Creamy({ d, ed, drag }) {
  return (
    <div style={{ background: d.bg, padding: "32px 26px", fontFamily: FONT_FAMILY, borderRadius: 20, position: "relative", overflow: "hidden" }}>
      {/* 柔和装饰圆 */}
      <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: `${d.a}12` }} />
      <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: `${d.a}08` }} />
      
      {/* 顶部装饰线 */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.a }} />
        <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg,${d.a}40,transparent)` }} />
        <div style={{ fontSize: 10, color: d.a, fontWeight: 700, letterSpacing: "2px" }}>{d.category}</div>
        <div style={{ flex: 1, height: 2, background: `linear-gradient(270deg,${d.a}40,transparent)` }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.a }} />
      </div>

      {/* 标题区域 */}
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>{d.emoji}</div>
        <EditableText
          v={d.title}
          on={ed?.title}
          block
          style={{ fontSize: 22, fontWeight: 800, color: d.tc, lineHeight: 1.35, letterSpacing: "-0.3px" }}
        />
      </div>

      {/* 导语 */}
      {d.lead && (
        <div style={{ background: "#fff", padding: "14px 18px", borderRadius: 16, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <EditableText
            v={d.lead}
            on={ed?.lead}
            block
            style={{ fontSize: 13, color: d.bc, lineHeight: 1.8, textAlign: "center" }}
          />
        </div>
      )}

      {/* 内容区域 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {d.sections.map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color={d.a}>
            <div style={{ background: "#fff", padding: "16px 18px", borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${d.a}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                  {i + 1}
                </div>
                <EditableText v={s.heading} on={ed?.secH?.(i)} style={{ fontSize: 14, fontWeight: 800, color: d.tc }} />
              </div>
              <EditableText v={s.text} on={ed?.secT?.(i)} block style={{ fontSize: 13, color: d.bc, lineHeight: 1.85, paddingLeft: 34 }} />
            </div>
          </DragRow>
        ))}
      </div>

      {/* Tips */}
      {d.tip && (
        <div style={{ marginTop: 18, padding: "12px 16px", background: `${d.a}10`, borderRadius: 12, borderLeft: `3px solid ${d.a}` }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: d.a }}>💡 小贴士 · </span>
          <EditableText v={d.tip} on={ed?.tip} style={{ fontSize: 12, color: d.bc }} />
        </div>
      )}

      {/* 标签 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18, justifyContent: "center" }}>
        {d.tags.map((t, i) => (
          <span key={i} style={{ padding: "6px 14px", background: "#fff", borderRadius: 20, fontSize: 12, color: d.a, fontWeight: 600, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <EditableTag text={t} c={d.a} on={ed?.tag?.(i)} />
          </span>
        ))}
      </div>

      {/* 底部装饰 */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: `${d.a}40` }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: `${d.a}60` }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: `${d.a}40` }} />
      </div>
    </div>
  );
}
