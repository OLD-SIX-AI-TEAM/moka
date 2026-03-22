import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function BoldCard({ d, ed, drag }) {
  return (
    <div style={{ fontFamily: FONT_FAMILY, overflow: "hidden" }}>
      <div style={{ background: d.a, padding: "28px 24px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -40, top: -40, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.6)", letterSpacing: "3px", marginBottom: 8 }}>
          {d.category?.toUpperCase()} · XIAOHONGSHU
        </div>
        <EditableText
          v={d.title}
          on={ed?.title}
          block
          dk
          style={{ fontSize: 23, fontWeight: 900, color: "#fff", lineHeight: 1.25, marginBottom: d.lead ? 0 : 0 }}
        />
        {d.lead && (
          <EditableText
            v={d.lead}
            on={ed?.lead}
            block
            dk
            style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 9, lineHeight: 1.7 }}
          />
        )}
        <div style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", fontSize: 46, opacity: 0.2, userSelect: "none" }}>
          {d.emoji}
        </div>
      </div>
      <div style={{ background: "#fff", padding: "20px 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {d.sections.map((s, i) => (
            <DragRow key={i} i={i} drag={drag} color={d.a} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ minWidth: 23, height: 23, borderRadius: 5, background: d.a + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: d.a, flexShrink: 0 }}>
                {i + 1}
              </div>
              <div>
                <EditableText v={s.heading} on={ed?.secH?.(i)} block style={{ fontSize: 13, fontWeight: 800, color: "#111", marginBottom: 2 }} />
                <EditableText v={s.text} on={ed?.secT?.(i)} block style={{ fontSize: 13, color: "#555", lineHeight: 1.85 }} />
              </div>
            </DragRow>
          ))}
        </div>
        {d.tip && (
          <div style={{ display: "flex", gap: 7, margin: "16px 0 0", padding: "10px", background: `${d.a}12`, borderRadius: 8 }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>✦</span>
            <EditableText v={d.tip} on={ed?.tip} style={{ fontSize: 12, color: "#444", lineHeight: 1.75 }} />
          </div>
        )}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #f0f0f0", display: "flex", flexWrap: "wrap", gap: 6 }}>
          {d.tags.map((t, i) => (
            <EditableTag key={i} text={t} c={d.a} on={ed?.tag?.(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}
