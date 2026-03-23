import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Artistic({ d, ed, drag }) {
  return (
    <div style={{ background: d.bg, padding: "32px 26px", fontFamily: FONT_FAMILY, position: "relative" }}>
      {/* 诗意装饰元素 */}
      <div style={{ position: "absolute", top: 20, right: 26, fontSize: 40, opacity: 0.08, fontFamily: "Georgia, serif" }}>"</div>
      <div style={{ position: "absolute", bottom: 30, left: 26, fontSize: 40, opacity: 0.08, fontFamily: "Georgia, serif", transform: "rotate(180deg)" }}>"</div>

      {/* 顶部装饰线 */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 30, height: 1, background: d.a }} />
        <div style={{ fontSize: 10, color: d.a, letterSpacing: "3px" }}>{d.category}</div>
        <div style={{ flex: 1, height: 1, background: `${d.a}30` }} />
      </div>

      {/* 标题区域 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.8 }}>{d.emoji}</div>
        <EditableText
          v={d.title}
          on={ed?.title}
          block
          style={{ fontSize: 24, fontWeight: 600, color: d.tc, lineHeight: 1.4, fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "1px" }}
        />
      </div>

      {/* 导语 - 诗意引用 */}
      {d.lead && (
        <div style={{ padding: "16px 20px", marginBottom: 20, borderLeft: `2px solid ${d.a}`, background: `${d.a}06` }}>
          <EditableText
            v={d.lead}
            on={ed?.lead}
            block
            style={{ fontSize: 14, color: d.bc, lineHeight: 1.9, fontStyle: "italic" }}
          />
        </div>
      )}

      {/* 内容区域 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {d.sections.map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color={d.a}>
            <div style={{ padding: "16px 0", borderBottom: i < d.sections.length - 1 ? `1px solid ${d.a}20` : "none" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: d.a, fontFamily: "Georgia, serif" }}>{String.fromCharCode(97 + i)}.</span>
                <EditableText v={s.heading} on={ed?.secH?.(i)} block style={{ fontSize: 15, fontWeight: 600, color: d.tc, fontFamily: "Georgia, serif" }} />
              </div>
              <EditableText v={s.text} on={ed?.secT?.(i)} block style={{ fontSize: 13, color: d.bc, lineHeight: 1.9, paddingLeft: 20 }} />
            </div>
          </DragRow>
        ))}
      </div>

      {/* Tips */}
      {d.tip && (
        <div style={{ marginTop: 20, padding: "14px 18px", background: "#fff", borderRadius: 4, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 11, color: d.a, marginBottom: 6, letterSpacing: "2px" }}>— NOTE —</div>
          <EditableText v={d.tip} on={ed?.tip} block style={{ fontSize: 13, color: d.bc, lineHeight: 1.75 }} />
        </div>
      )}

      {/* 标签 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
        {d.tags.map((t, i) => (
          <span key={i} style={{ fontSize: 12, color: d.a, fontStyle: "italic" }}>
            <EditableTag text={`# ${t}`} c={d.a} on={ed?.tag?.(i)} />
          </span>
        ))}
      </div>

      {/* 底部签名 */}
      <div style={{ marginTop: 28, textAlign: "right" }}>
        <div style={{ fontSize: 11, color: `${d.a}80`, fontFamily: "Georgia, serif", fontStyle: "italic" }}>
          — {d.category} —
        </div>
      </div>
    </div>
  );
}
