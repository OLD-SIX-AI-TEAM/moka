import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { FONT_FAMILY } from "../../../constants";

export function Film({ d, ed, drag }) {
  const holes = Array.from({ length: 6 });
  const icons = ["◈", "◉", "◎", "●"];

  return (
    <div style={{ background: "#1c1c1e", fontFamily: FONT_FAMILY, overflow: "hidden" }}>
      <div style={{ background: "#111", padding: "7px 13px", display: "flex", gap: 7 }}>
        {holes.map((_, i) => (
          <div key={i} style={{ width: 15, height: 11, borderRadius: 2, background: "#1c1c1e", border: "1px solid #333" }} />
        ))}
      </div>
      <div style={{ padding: "22px 20px", background: "#faf6ee", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: d.a }} />
        <div style={{ paddingLeft: 13 }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: d.a, letterSpacing: "3px", marginBottom: 5 }}>
            {d.category} · FRAME 01
          </div>
          <EditableText
            v={d.title}
            on={ed?.title}
            block
            style={{ fontSize: 21, fontWeight: 900, color: "#1a1510", lineHeight: 1.25, marginBottom: 4 }}
          />
          {d.lead && (
            <EditableText
              v={d.lead}
              on={ed?.lead}
              block
              style={{ fontSize: 12, color: "#777", lineHeight: 1.7, marginBottom: 14, fontStyle: "italic" }}
            />
          )}
          <div style={{ height: 1, background: `linear-gradient(90deg,${d.a},transparent)`, marginBottom: 14 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {d.sections.map((s, i) => (
              <DragRow key={i} i={i} drag={drag} color={d.a} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                <span style={{ fontSize: 15, flexShrink: 0, lineHeight: 1 }}>{icons[i % 4]}</span>
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
            <div style={{ margin: "14px 0 0", padding: "9px 11px", background: d.a + "15", borderRadius: 3 }}>
              <span style={{ fontSize: 12, color: d.a, fontWeight: 700 }}>▸ </span>
              <EditableText v={d.tip} on={ed?.tip} style={{ fontSize: 12, color: "#555" }} />
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 13 }}>
            {d.tags.map((t, i) => (
              <EditableTag key={i} text={t} c={d.a} on={ed?.tag?.(i)} />
            ))}
          </div>
        </div>
      </div>
      <div style={{ background: "#111", padding: "7px 13px", display: "flex", gap: 7 }}>
        {holes.map((_, i) => (
          <div key={i} style={{ width: 15, height: 11, borderRadius: 2, background: "#1c1c1e", border: "1px solid #333" }} />
        ))}
      </div>
    </div>
  );
}
