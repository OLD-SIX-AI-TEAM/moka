import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Dark({ d, ed, drag }) {
  return (
    <div style={{ background: "#111318", padding: "32px 26px", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${d.a},transparent)` }} />
      <div style={{ fontSize: 10, fontWeight: 800, color: d.a, letterSpacing: "3px", marginBottom: 7 }}>
        {d.category} · XIAOHONGSHU
      </div>
      <EditableText
        v={d.title}
        on={ed?.title}
        block
        dk
        style={{ fontSize: 23, fontWeight: 900, color: "#f0eee8", lineHeight: 1.25, marginBottom: 6, letterSpacing: "-0.3px" }}
      />
      {d.lead && (
        <EditableText
          v={d.lead}
          on={ed?.lead}
          block
          dk
          style={{ fontSize: 13, color: "#888", lineHeight: 1.75, marginBottom: 16 }}
        />
      )}
      <div style={{ height: 1, background: `linear-gradient(90deg,${d.a}cc,${d.a}22,transparent)`, marginBottom: 16 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        {d.sections.map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color={d.a} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
            <div style={{ width: 19, height: 19, border: `1.5px solid ${d.a}88`, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: d.a, flexShrink: 0, marginTop: 2 }}>
              {i + 1}
            </div>
            <div>
              {s.heading && (
                <EditableText v={s.heading} on={ed?.secH?.(i)} block dk style={{ fontSize: 13, fontWeight: 800, color: "#e8e4dc", marginBottom: 2 }} />
              )}
              <EditableText v={s.text} on={ed?.secT?.(i)} block dk style={{ fontSize: 13, color: "#7a7878", lineHeight: 1.85 }} />
            </div>
          </DragRow>
        ))}
      </div>
      {d.tip && (
        <div style={{ margin: "16px 0 0", padding: "10px 13px", border: `1px solid ${d.a}44`, borderRadius: 5, background: `${d.a}0e` }}>
          <span style={{ fontSize: 12, color: d.a, fontWeight: 700 }}>✦ </span>
          <EditableText v={d.tip} on={ed?.tip} dk style={{ fontSize: 12, color: "#7a7878" }} />
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
        {d.tags.map((t, i) => (
          <EditableTag key={i} text={t} c={`${d.a}cc`} on={ed?.tag?.(i)} />
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${d.a}55,transparent)` }} />
    </div>
  );
}
