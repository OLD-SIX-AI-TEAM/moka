import { EditableText, EditableTag } from "../../common/EditableText";
import { DragRow } from "../../common/DragRow";
import { Wave } from "../../common/Icons";
import { FONT_FAMILY } from "../../../constants";

export function Stamp({ d, ed, drag }) {
  const icons = ["📌", "✏️", "📎", "🗝️", "🖇️"];

  return (
    <div style={{ background: d.bg, padding: "26px 22px", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden" }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05 }}>
        <defs>
          <pattern id="gp" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0L0 0 0 20" fill="none" stroke={d.a} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gp)" />
      </svg>
      <div style={{ position: "relative", border: `2px solid ${d.a}`, padding: "13px 15px", marginBottom: 16, zIndex: 1 }}>
        {["tl", "tr", "bl", "br"].map((p) => (
          <div
            key={p}
            style={{
              position: "absolute",
              width: 8,
              height: 8,
              background: d.a,
              ...(p === "tl" ? { top: -4, left: -4 } : p === "tr" ? { top: -4, right: -4 } : p === "bl" ? { bottom: -4, left: -4 } : { bottom: -4, right: -4 }),
            }}
          />
        ))}
        <div style={{ fontSize: 10, fontWeight: 700, color: d.a, letterSpacing: "2px", marginBottom: 4 }}>
          {d.emoji} · {d.category}
        </div>
        <EditableText
          v={d.title}
          on={ed?.title}
          block
          style={{ fontSize: 20, fontWeight: 900, color: d.tc, lineHeight: 1.3 }}
        />
      </div>
      {d.lead && (
        <EditableText
          v={d.lead}
          on={ed?.lead}
          block
          style={{ fontSize: 13, color: d.bc, lineHeight: 1.8, marginBottom: 12, zIndex: 1, position: "relative", fontStyle: "italic" }}
        />
      )}
      <div style={{ zIndex: 1, position: "relative", marginBottom: 12 }}>
        <Wave c={d.a} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, zIndex: 1, position: "relative" }}>
        {Array.isArray(d.sections) && d.sections.map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color={d.a}>
            {s.heading && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 13 }}>{icons[i % 5]}</span>
                <EditableText v={s.heading} on={ed?.secH?.(i)} style={{ fontSize: 13, fontWeight: 800, color: d.tc }} />
              </div>
            )}
            <EditableText
              v={s.text}
              on={ed?.secT?.(i)}
              block
              style={{ fontSize: 13, color: d.bc, lineHeight: 1.85, paddingLeft: s.heading ? 22 : 0 }}
            />
          </DragRow>
        ))}
      </div>
      {d.tip && (
        <div style={{ margin: "14px 0 0", padding: "9px 11px", background: `${d.a}18`, borderRadius: 6, zIndex: 1, position: "relative" }}>
          <b style={{ color: d.a, fontSize: 12 }}>📌 记得 · </b>
          <EditableText v={d.tip} on={ed?.tip} style={{ fontSize: 12, color: d.bc }} />
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14, zIndex: 1, position: "relative" }}>
        {Array.isArray(d.tags) && d.tags.map((t, i) => (
          <EditableTag key={i} text={t} c={d.a} on={ed?.tag?.(i)} />
        ))}
      </div>
    </div>
  );
}
