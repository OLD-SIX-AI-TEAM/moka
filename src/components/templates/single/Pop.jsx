import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Pop({ d, ed, drag }) {
  const shapes = ["■", "●", "▲", "◆", "★"];
  
  return (
    <div style={{ background: "#fff", padding: "28px 24px", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden" }}>
      {/* 波普几何装饰 */}
      <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: d.a, opacity: 0.1, transform: "rotate(45deg)" }} />
      <div style={{ position: "absolute", bottom: 30, left: -30, width: 60, height: 60, borderRadius: "50%", background: `${d.a}20` }} />
      
      {/* 顶部色块 */}
      <div style={{ background: d.a, padding: "20px 20px 16px", margin: "-28px -24px 20px", position: "relative" }}>
        <div style={{ position: "absolute", top: 10, right: 20, display: "flex", gap: 8 }}>
          <div style={{ width: 12, height: 12, background: "#fff", borderRadius: "50%" }} />
          <div style={{ width: 12, height: 12, background: "#fff", transform: "rotate(45deg)" }} />
        </div>
        <div style={{ fontSize: 32, marginBottom: 8 }}>{d.emoji}</div>
        <EditableText
          v={d.title}
          on={ed?.title}
          block
          dk
          style={{ fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1.25 }}
        />
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginTop: 6, letterSpacing: "2px" }}>{d.category}</div>
      </div>

      {/* 导语 */}
      {d.lead && (
        <div style={{ background: "#000", color: "#fff", padding: "12px 16px", marginBottom: 16, transform: "rotate(-1deg)" }}>
          <EditableText
            v={d.lead}
            on={ed?.lead}
            block
            dk
            style={{ fontSize: 13, lineHeight: 1.7 }}
          />
        </div>
      )}

      {/* 内容区域 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {d.sections.map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color={d.a}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px", background: i % 2 === 0 ? `${d.a}10` : "#f8f8f8" }}>
              <div style={{ fontSize: 20, color: d.a, fontWeight: 900, lineHeight: 1 }}>{shapes[i % 5]}</div>
              <div style={{ flex: 1 }}>
                <EditableText v={s.heading} on={ed?.secH?.(i)} block style={{ fontSize: 14, fontWeight: 800, color: "#000", marginBottom: 4, textTransform: "uppercase" }} />
                <EditableText v={s.text} on={ed?.secT?.(i)} block style={{ fontSize: 13, color: "#333", lineHeight: 1.75 }} />
              </div>
            </div>
          </DragRow>
        ))}
      </div>

      {/* Tips */}
      {d.tip && (
        <div style={{ marginTop: 16, padding: "12px 16px", border: `3px solid ${d.a}`, position: "relative" }}>
          <div style={{ position: "absolute", top: -8, left: 16, background: "#fff", padding: "0 8px", fontSize: 12, fontWeight: 800, color: d.a }}>TIP!</div>
          <EditableText v={d.tip} on={ed?.tip} block style={{ fontSize: 12, color: "#333", lineHeight: 1.7 }} />
        </div>
      )}

      {/* 标签 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
        {d.tags.map((t, i) => (
          <span key={i} style={{ padding: "6px 14px", background: i % 2 === 0 ? d.a : "#000", color: "#fff", fontSize: 12, fontWeight: 700, transform: i % 2 === 0 ? "rotate(-1deg)" : "rotate(1deg)" }}>
            <EditableTag text={t} c="#fff" on={ed?.tag?.(i)} />
          </span>
        ))}
      </div>

      {/* 底部装饰 */}
      <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 20 }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ width: 8, height: 8, background: i % 2 === 0 ? d.a : "#000", transform: i % 2 === 0 ? "rotate(45deg)" : "none" }} />
        ))}
      </div>
    </div>
  );
}
