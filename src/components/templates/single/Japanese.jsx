import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Japanese({ d, ed, drag }) {
  return (
    <div style={{ background: d.bg, padding: "28px 24px", fontFamily: FONT_FAMILY, position: "relative" }}>
      {/* 和风纸张纹理 */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.02, backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${d.a} 2px, ${d.a} 3px)` }} />
      
      {/* 顶部装饰 - 日式风格 */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        <div style={{ width: 60, height: 3, background: d.a }} />
        <div style={{ flex: 1, height: 1, background: `${d.a}30` }} />
      </div>

      {/* 标题区域 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: d.a, letterSpacing: "4px", marginBottom: 10, writingMode: "vertical-rl", position: "absolute", right: 20, top: 28 }}>
          {d.category}
        </div>
        <div style={{ fontSize: 36, marginBottom: 12 }}>{d.emoji}</div>
        <EditableText
          v={d.title}
          on={ed?.title}
          block
          style={{ fontSize: 22, fontWeight: 600, color: d.tc, lineHeight: 1.4, letterSpacing: "2px" }}
        />
        <div style={{ marginTop: 12, display: "flex", gap: 4 }}>
          <div style={{ width: 8, height: 8, background: d.a }} />
          <div style={{ width: 8, height: 8, background: `${d.a}60` }} />
          <div style={{ width: 8, height: 8, background: `${d.a}30` }} />
        </div>
      </div>

      {/* 导语 */}
      {d.lead && (
        <div style={{ background: "#fff", padding: "16px 20px", marginBottom: 18, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <EditableText
            v={d.lead}
            on={ed?.lead}
            block
            style={{ fontSize: 13, color: d.bc, lineHeight: 1.9 }}
          />
        </div>
      )}

      {/* 内容区域 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {Array.isArray(d.sections) && d.sections.map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color={d.a}>
            <div style={{ background: "#fff", padding: "14px 16px", borderRadius: 2, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ fontSize: 18, color: d.a, fontWeight: 300, minWidth: 24 }}>
                {["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"][i] || i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <EditableText v={s.heading} on={ed?.secH?.(i)} block style={{ fontSize: 14, fontWeight: 600, color: d.tc, marginBottom: 4 }} />
                <EditableText v={s.text} on={ed?.secT?.(i)} block style={{ fontSize: 13, color: d.bc, lineHeight: 1.85 }} />
              </div>
            </div>
          </DragRow>
        ))}
      </div>

      {/* Tips */}
      {d.tip && (
        <div style={{ marginTop: 18, padding: "14px 16px", background: `${d.a}08`, borderRadius: 2, display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ fontSize: 16 }}>✿</span>
          <EditableText v={d.tip} on={ed?.tip} block style={{ fontSize: 12, color: d.bc, lineHeight: 1.75 }} />
        </div>
      )}

      {/* 标签 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
        {Array.isArray(d.tags) && d.tags.map((t, i) => (
          <span key={i} style={{ padding: "5px 12px", background: "#fff", border: `1px solid ${d.a}40`, borderRadius: 2, fontSize: 11, color: d.a }}>
            <EditableTag text={t} c={d.a} on={ed?.tag?.(i)} noBorder />
          </span>
        ))}
      </div>

      {/* 底部装饰 */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: d.a }} />
          <div style={{ width: 40, height: 1, background: `${d.a}50` }} />
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: d.a }} />
        </div>
      </div>
    </div>
  );
}
