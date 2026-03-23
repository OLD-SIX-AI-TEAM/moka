import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Fashion({ d, ed, drag }) {
  return (
    <div style={{ background: "#fff", padding: "0", fontFamily: FONT_FAMILY }}>
      {/* 时尚大图头部 */}
      <div style={{ background: d.a, padding: "32px 28px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, border: "2px solid rgba(255,255,255,0.2)", borderRadius: "50%" }} />
        
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", letterSpacing: "3px", marginBottom: 12 }}>FASHION · {d.category}</div>
          <EditableText
            v={d.title}
            on={ed?.title}
            block
            dk
            style={{ fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1.25, letterSpacing: "-0.5px" }}
          />
        </div>
      </div>

      {/* 内容区域 */}
      <div style={{ padding: "24px 28px" }}>
        {/* 导语 */}
        {d.lead && (
          <div style={{ padding: "14px 0", marginBottom: 18, borderBottom: "1px solid #eee" }}>
            <EditableText
              v={d.lead}
              on={ed?.lead}
              block
              style={{ fontSize: 14, color: "#666", lineHeight: 1.8, fontStyle: "italic" }}
            />
          </div>
        )}

        {/* 内容 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {d.sections.map((s, i) => (
            <DragRow key={i} i={i} drag={drag} color={d.a}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ fontSize: 24, color: d.a, fontWeight: 300, fontFamily: "Georgia, serif" }}>
                  {String.fromCharCode(8544 + i)}
                </div>
                <div style={{ flex: 1 }}>
                  <EditableText v={s.heading} on={ed?.secH?.(i)} block style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 6, textTransform: "uppercase", letterSpacing: "1px" }} />
                  <EditableText v={s.text} on={ed?.secT?.(i)} block style={{ fontSize: 13, color: "#444", lineHeight: 1.85 }} />
                </div>
              </div>
            </DragRow>
          ))}
        </div>

        {/* Tips */}
        {d.tip && (
          <div style={{ marginTop: 20, padding: "14px 18px", background: "#f8f8f8", borderLeft: `3px solid ${d.a}` }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: d.a }}>✦ STYLE TIP</span>
            <EditableText v={d.tip} on={ed?.tip} block style={{ fontSize: 13, color: "#555", lineHeight: 1.75, marginTop: 6 }} />
          </div>
        )}

        {/* 标签 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
          {d.tags.map((t, i) => (
            <span key={i} style={{ padding: "6px 16px", border: `1px solid ${d.a}`, fontSize: 11, color: d.a, letterSpacing: "1px" }}>
              <EditableTag text={t} c={d.a} on={ed?.tag?.(i)} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
