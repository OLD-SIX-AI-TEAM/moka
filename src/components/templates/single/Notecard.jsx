import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { Diamond, Dash, Star, Bracket } from "../../common/Icons";
import { FONT_FAMILY } from "../../../constants";

export function Notecard({ d, ed, drag }) {
  return (
    <div style={{ background: d.bg, padding: "26px 22px", fontFamily: FONT_FAMILY, border: `2px dashed ${d.a}88`, borderRadius: 18, position: "relative" }}>
      {["tl", "tr", "bl", "br"].map((p) => (
        <Bracket key={p} c={d.a} pos={p} />
      ))}
      <div style={{ fontSize: 36, textAlign: "center", marginBottom: 10 }}>{d.emoji}</div>
      <EditableText
        v={d.title}
        on={ed?.title}
        block
        style={{ fontSize: 21, fontWeight: 900, color: d.tc, textAlign: "center", lineHeight: 1.3, marginBottom: 5 }}
      />
      {d.lead && (
        <EditableText
          v={d.lead}
          on={ed?.lead}
          block
          style={{ fontSize: 12, color: d.a, textAlign: "center", marginBottom: 13, fontWeight: 600 }}
        />
      )}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
        <Diamond c={d.a} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {d.sections.map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color={d.a} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <Star c={d.a} />
            <div>
              <EditableText v={s.heading} on={ed?.secH?.(i)} style={{ fontSize: 13, fontWeight: 800, color: d.tc, marginRight: 5 }} />
              <EditableText v={s.text} on={ed?.secT?.(i)} style={{ fontSize: 13, color: d.bc, lineHeight: 1.75 }} />
            </div>
          </DragRow>
        ))}
      </div>
      {d.tip && (
        <div style={{ margin: "14px 0 0", textAlign: "center" }}>
          <Dash c={d.a} />
          <div style={{ fontSize: 12, color: d.bc, marginTop: 8, lineHeight: 1.7 }}>
            <b style={{ color: d.a }}>贴士 </b>
            <EditableText v={d.tip} on={ed?.tip} style={{ fontSize: 12, color: d.bc }} />
          </div>
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 13, justifyContent: "center" }}>
        {d.tags.map((t, i) => (
          <EditableTag key={i} text={t} c={d.a} on={ed?.tag?.(i)} />
        ))}
      </div>
    </div>
  );
}
