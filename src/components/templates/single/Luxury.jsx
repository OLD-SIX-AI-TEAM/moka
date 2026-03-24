import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Luxury({ d, ed, drag }) {
  return (
    <div style={{ background: d.bg, padding: "32px 28px", fontFamily: FONT_FAMILY, position: "relative" }}>
      {/* 金色装饰线 */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${d.a},#d4af37,${d.a})` }} />
      
      {/* 顶部装饰 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, marginTop: 8 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#d4af37" }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: d.a }} />
        </div>
        <div style={{ fontSize: 9, color: d.a, letterSpacing: "4px", fontWeight: 600 }}>{d.category}</div>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: d.a }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#d4af37" }} />
        </div>
      </div>

      {/* 标题区域 */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>{d.emoji}</div>
        <EditableText
          v={d.title}
          on={ed?.title}
          block
          style={{ fontSize: 22, fontWeight: 400, color: d.tc, lineHeight: 1.35, letterSpacing: "2px" }}
        />
        <div style={{ width: 60, height: 1, background: `linear-gradient(90deg,transparent,#d4af37,transparent)`, margin: "16px auto 0" }} />
      </div>

      {/* 导语 */}
      {d.lead && (
        <div style={{ padding: "16px 20px", marginBottom: 18, border: `1px solid ${d.a}30`, textAlign: "center" }}>
          <EditableText
            v={d.lead}
            on={ed?.lead}
            block
            style={{ fontSize: 13, color: d.bc, lineHeight: 1.8, fontStyle: "italic" }}
          />
        </div>
      )}

      {/* 内容区域 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {Array.isArray(d.sections) && d.sections.map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color={d.a}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 0", borderBottom: `1px solid ${d.a}15` }}>
              <div style={{ minWidth: 32, height: 32, border: `1px solid #d4af37`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#d4af37", fontFamily: "Georgia, serif" }}>
                {String.fromCharCode(8544 + i)}
              </div>
              <div style={{ flex: 1 }}>
                <EditableText v={s.heading} on={ed?.secH?.(i)} block style={{ fontSize: 14, fontWeight: 600, color: d.tc, marginBottom: 4, letterSpacing: "0.5px" }} />
                <EditableText v={s.text} on={ed?.secT?.(i)} block style={{ fontSize: 13, color: d.bc, lineHeight: 1.8 }} />
              </div>
            </div>
          </DragRow>
        ))}
      </div>

      {/* Tips */}
      {d.tip && (
        <div style={{ marginTop: 18, padding: "14px 18px", background: `${d.a}08`, borderLeft: `2px solid #d4af37` }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#d4af37" }}>✦ </span>
          <EditableText v={d.tip} on={ed?.tip} style={{ fontSize: 12, color: d.bc }} />
        </div>
      )}

      {/* 标签 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18, justifyContent: "center" }}>
        {Array.isArray(d.tags) && d.tags.map((t, i) => (
          <span key={i} style={{ padding: "6px 16px", border: `1px solid ${d.a}40`, fontSize: 11, color: d.a, letterSpacing: "1px" }}>
            <EditableTag text={t} c={d.a} on={ed?.tag?.(i)} />
          </span>
        ))}
      </div>

      {/* 底部金色装饰 */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${d.a},#d4af37,${d.a})` }} />
    </div>
  );
}
