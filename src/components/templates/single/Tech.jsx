import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Tech({ d, ed, drag }) {
  return (
    <div style={{ background: "#0a0e17", padding: "32px 28px", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden" }}>
      {/* 科技网格背景 */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: `linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)`, backgroundSize: "20px 20px" }} />
      
      {/* 发光边框 */}
      <div style={{ position: "relative", border: "1px solid rgba(0,255,255,0.3)", padding: "24px 22px", boxShadow: "0 0 20px rgba(0,255,255,0.1)" }}>
        {/* 角落发光 */}
        <div style={{ position: "absolute", top: -1, left: -1, width: 20, height: 20, borderTop: "2px solid #00ffff", borderLeft: "2px solid #00ffff" }} />
        <div style={{ position: "absolute", top: -1, right: -1, width: 20, height: 20, borderTop: "2px solid #00ffff", borderRight: "2px solid #00ffff" }} />
        <div style={{ position: "absolute", bottom: -1, left: -1, width: 20, height: 20, borderBottom: "2px solid #00ffff", borderLeft: "2px solid #00ffff" }} />
        <div style={{ position: "absolute", bottom: -1, right: -1, width: 20, height: 20, borderBottom: "2px solid #00ffff", borderRight: "2px solid #00ffff" }} />

        {/* 头部 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, background: "#00ffff", boxShadow: "0 0 10px #00ffff" }} />
            <div style={{ fontSize: 10, color: "#00ffff", letterSpacing: "2px" }}>{d.category}</div>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #00ffff, transparent)" }} />
          </div>
          <EditableText
            v={d.title}
            on={ed?.title}
            block
            dk
            style={{ fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1.35 }}
          />
        </div>

        {/* 导语 */}
        {d.lead && (
          <div style={{ background: "rgba(0,255,255,0.1)", padding: "12px 16px", marginBottom: 16, borderLeft: "2px solid #00ffff" }}>
            <EditableText
              v={d.lead}
              on={ed?.lead}
              block
              dk
              style={{ fontSize: 13, color: "#a0a0a0", lineHeight: 1.8 }}
            />
          </div>
        )}

        {/* 内容 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {d.sections.map((s, i) => (
            <DragRow key={i} i={i} drag={drag} color="#00ffff">
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ minWidth: 28, height: 28, border: "1px solid rgba(0,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#00ffff", fontFamily: "monospace" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ flex: 1 }}>
                  <EditableText v={s.heading} on={ed?.secH?.(i)} block dk style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 4 }} />
                  <EditableText v={s.text} on={ed?.secT?.(i)} block dk style={{ fontSize: 13, color: "#a0a0a0", lineHeight: 1.8 }} />
                </div>
              </div>
            </DragRow>
          ))}
        </div>

        {/* Tips */}
        {d.tip && (
          <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(255,0,128,0.1)", border: "1px solid rgba(255,0,128,0.3)" }}>
            <span style={{ fontSize: 11, color: "#ff0080", fontFamily: "monospace" }}>[NOTE] </span>
            <EditableText v={d.tip} on={ed?.tip} dk style={{ fontSize: 12, color: "#c0c0c0" }} />
          </div>
        )}

        {/* 标签 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
          {d.tags.map((t, i) => (
            <span key={i} style={{ padding: "4px 10px", border: "1px solid rgba(0,255,255,0.4)", fontSize: 11, color: "#00ffff", fontFamily: "monospace" }}>
              <EditableTag text={`#${t}`} c="#00ffff" on={ed?.tag?.(i)} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
