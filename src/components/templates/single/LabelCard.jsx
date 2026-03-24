import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { Diamond } from "../../common/Icons";
import { FONT_FAMILY } from "../../../constants";

export function LabelCard({ d, ed, drag }) {
  return (
    <div style={{ background: "#fff", fontFamily: FONT_FAMILY, position: "relative" }}>
      <div style={{ background: d.a, padding: "18px 22px 26px", clipPath: "polygon(0 0,100% 0,100% 80%,50% 100%,0 80%)", marginBottom: -8, position: "relative" }}>
        <div style={{ width: 19, height: 19, borderRadius: "50%", background: "rgba(255,255,255,0.3)", margin: "0 auto 9px", border: "2px solid rgba(255,255,255,0.5)" }} />
        <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.7)", letterSpacing: "3px", textAlign: "center", marginBottom: 5 }}>
          {d.category} · {d.emoji}
        </div>
        <EditableText
          v={d.title}
          on={ed?.title}
          block
          dk
          style={{ fontSize: 20, fontWeight: 900, color: "#fff", textAlign: "center", lineHeight: 1.25 }}
        />
      </div>
      <div style={{ padding: "14px 22px 22px", marginTop: 8 }}>
        {d.lead && (
          <EditableText
            v={d.lead}
            on={ed?.lead}
            block
            style={{ fontSize: 13, color: "#666", textAlign: "center", fontStyle: "italic", marginBottom: 14, lineHeight: 1.7 }}
          />
        )}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
          <Diamond c={d.a} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {(d.sections || []).map((s, i) => (
            <DragRow key={i} i={i} drag={drag} color={d.a} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: d.a, marginTop: 7, flexShrink: 0 }} />
              <div>
                {s.heading && (
                  <EditableText v={s.heading} on={ed?.secH?.(i)} block style={{ fontSize: 13, fontWeight: 800, color: "#1a1510", marginBottom: 2 }} />
                )}
                <EditableText v={s.text} on={ed?.secT?.(i)} block style={{ fontSize: 13, color: "#555", lineHeight: 1.85 }} />
              </div>
            </DragRow>
          ))}
        </div>
        {d.tip && (
          <div style={{ margin: "14px 0 0", padding: "9px 13px", border: `1.5px dashed ${d.a}66`, borderRadius: 7 }}>
            <span style={{ fontSize: 12, color: d.a, fontWeight: 700 }}>✦ </span>
            <EditableText v={d.tip} on={ed?.tip} style={{ fontSize: 12, color: "#555" }} />
          </div>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14, justifyContent: "center" }}>
          {d.tags.map((t, i) => (
            <EditableTag key={i} text={t} c={d.a} on={ed?.tag?.(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}
