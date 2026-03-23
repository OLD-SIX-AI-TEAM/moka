import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Retro({ d, ed, drag }) {
  const retroBg = "#f5f0e8";
  
  return (
    <div style={{ background: retroBg, padding: "28px 24px", fontFamily: FONT_FAMILY, position: "relative" }}>
      {/* 胶片颗粒效果背景 */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
      
      {/* 复古边框 */}
      <div style={{ position: "relative", border: `3px double ${d.a}`, padding: "20px 18px", background: "#fffef8" }}>
        {/* 四角装饰 */}
        {["tl", "tr", "bl", "br"].map((p) => (
          <div
            key={p}
            style={{
              position: "absolute",
              width: 12,
              height: 12,
              border: `2px solid ${d.a}`,
              ...(p === "tl" ? { top: -3, left: -3, borderRight: "none", borderBottom: "none" } : 
                 p === "tr" ? { top: -3, right: -3, borderLeft: "none", borderBottom: "none" } : 
                 p === "bl" ? { bottom: -3, left: -3, borderRight: "none", borderTop: "none" } : 
                 { bottom: -3, right: -3, borderLeft: "none", borderTop: "none" }),
            }}
          />
        ))}

        {/* 报头 */}
        <div style={{ textAlign: "center", borderBottom: `2px solid ${d.a}`, paddingBottom: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: d.a, letterSpacing: "4px", marginBottom: 6 }}>EST. 2024 · {d.category}</div>
          <div style={{ fontSize: 32, marginBottom: 8 }}>{d.emoji}</div>
          <EditableText
            v={d.title}
            on={ed?.title}
            block
            style={{ fontSize: 20, fontWeight: 900, color: d.tc, lineHeight: 1.3, fontFamily: "Georgia, serif", letterSpacing: "1px" }}
          />
        </div>

        {/* 导语 */}
        {d.lead && (
          <div style={{ background: `${d.a}10`, padding: "10px 14px", marginBottom: 16, borderLeft: `4px solid ${d.a}` }}>
            <EditableText
              v={d.lead}
              on={ed?.lead}
              block
              style={{ fontSize: 13, color: d.bc, lineHeight: 1.75, fontStyle: "italic" }}
            />
          </div>
        )}

        {/* 内容 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {d.sections.map((s, i) => (
            <DragRow key={i} i={i} drag={drag} color={d.a}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ minWidth: 28, height: 28, border: `2px solid ${d.a}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: d.a, fontFamily: "Georgia, serif" }}>
                  {String.fromCharCode(65 + i)}
                </div>
                <div style={{ flex: 1 }}>
                  <EditableText v={s.heading} on={ed?.secH?.(i)} block style={{ fontSize: 13, fontWeight: 800, color: d.tc, marginBottom: 3, textDecoration: "underline", textDecorationColor: `${d.a}50` }} />
                  <EditableText v={s.text} on={ed?.secT?.(i)} block style={{ fontSize: 13, color: d.bc, lineHeight: 1.8 }} />
                </div>
              </div>
            </DragRow>
          ))}
        </div>

        {/* Tips */}
        {d.tip && (
          <div style={{ marginTop: 16, padding: "10px 12px", border: `1px dashed ${d.a}`, background: `${d.a}08` }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: d.a, fontFamily: "Georgia, serif" }}>★ TIP · </span>
            <EditableText v={d.tip} on={ed?.tip} style={{ fontSize: 12, color: d.bc }} />
          </div>
        )}

        {/* 标签 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${d.a}40` }}>
          {d.tags.map((t, i) => (
            <span key={i} style={{ padding: "4px 10px", border: `1px solid ${d.a}`, fontSize: 11, color: d.a, fontWeight: 600 }}>
              <EditableTag text={t} c={d.a} on={ed?.tag?.(i)} />
            </span>
          ))}
        </div>
      </div>

      {/* 底部日期戳 */}
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <div style={{ fontSize: 10, color: d.a, fontFamily: "Georgia, serif", letterSpacing: "2px" }}>
          {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')}
        </div>
      </div>
    </div>
  );
}
