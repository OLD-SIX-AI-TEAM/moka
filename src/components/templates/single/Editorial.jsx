import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { Line2 } from "../../common/Icons";
import { FONT_FAMILY } from "../../../constants";

export function Editorial({ d, ed, drag }) {
  return (
    <div style={{ background: "#faf8f4", padding: "34px 28px", fontFamily: FONT_FAMILY }}>
      <div style={{ height: 4, background: `linear-gradient(90deg,${d.a} 55%,transparent)`, marginBottom: 24 }} />
      <div style={{ fontSize: 10, fontWeight: 800, color: d.a, letterSpacing: "3px", marginBottom: 7 }}>
        {d.category} · XIAOHONGSHU
      </div>
      <EditableText
        v={d.title}
        on={ed?.title}
        block
        style={{ fontSize: 25, fontWeight: 900, color: "#1a1510", lineHeight: 1.25, letterSpacing: "-0.5px", marginBottom: 13 }}
      />
      <Line2 c={d.a} />
      {d.lead && (
        <EditableText
          v={d.lead}
          on={ed?.lead}
          block
          style={{ fontSize: 13, color: "#555", lineHeight: 1.8, margin: "13px 0 17px", paddingLeft: 11, borderLeft: `3px solid ${d.a}`, fontStyle: "italic" }}
        />
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        {(d.sections || []).map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color={d.a} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ minWidth: 3, width: 3, borderRadius: 2, background: d.a, marginTop: 4, alignSelf: "stretch" }} />
            <div>
              {s.heading && (
                <EditableText
                  v={s.heading}
                  on={ed?.secH?.(i)}
                  block
                  style={{ fontSize: 13, fontWeight: 800, color: "#1a1510", marginBottom: 2 }}
                />
              )}
              <EditableText
                v={s.text}
                on={ed?.secT?.(i)}
                block
                style={{ fontSize: 13, color: "#444", lineHeight: 1.85 }}
              />
            </div>
          </DragRow>
        ))}
      </div>
      {d.tip && (
        <div style={{ margin: "17px 0 0", background: d.a + "15", padding: "10px 13px", borderRadius: 2 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: d.a }}>TIPS · </span>
          <EditableText v={d.tip} on={ed?.tip} style={{ fontSize: 12, color: "#444" }} />
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 15 }}>
        {d.tags.map((t, i) => (
          <EditableTag key={i} text={t} c={d.a} on={ed?.tag?.(i)} />
        ))}
      </div>
      <div style={{ height: 2, background: d.a, marginTop: 20, width: 36 }} />
    </div>
  );
}
