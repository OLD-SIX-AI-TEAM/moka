import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function ForestCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#f0f9f4", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 28px", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "45%", height: "100%", background: `${a}12`, clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0 100%)" }} />
        <svg style={{ position: "absolute", top: 0, right: 0, width: 150, height: 150, opacity: 0.15 }} viewBox="0 0 100 100">
          <path d="M80 20 Q90 40 80 60 Q70 80 80 100" fill="none" stroke={a} strokeWidth="3" />
          <circle cx="75" cy="30" r="8" fill={a} />
          <path d="M60 40 Q70 55 60 70 Q50 85 60 100" fill="none" stroke={a} strokeWidth="2" opacity="0.6" />
        </svg>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <span style={{ fontSize: 32, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}>🌿</span>
          <div>
            <div style={{ fontSize: 9, color: a, letterSpacing: "3px", fontWeight: 600 }}>{s.category?.toUpperCase?.() || ""}</div>
          </div>
          <span style={{ fontSize: 32, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}>🌱</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}>{s.emoji}</div>
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 32, fontWeight: 800, color: "#1a3d2e", lineHeight: 1.2, marginBottom: 16 }} />
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 14, color: "#4a6b5a", lineHeight: 1.7 }} />}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 28 : 6, height: 6, borderRadius: 3, background: i === 0 ? a : `${a}50` }} />)}
        </div>
      </div>
    </div>
  );
}

export function ForestContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#f0f9f4", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ width: "30%", background: a, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "rgba(255,255,255,0.3)" }} />
          <span style={{ fontSize: 48, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}>{["🍃", "🌱", "🌿", "🍀", "🌾"][(idx - 1) % 5]}</span>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.8)", letterSpacing: "2px", marginTop: 8 }}>CHAPTER</div>
        </div>
        <div style={{ flex: 1, padding: "28px 24px", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${a}, transparent)` }} />
            <div style={{ fontSize: 10, color: a, letterSpacing: "1px" }}>DAY {idx}</div>
          </div>
          <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 20, fontWeight: 800, color: "#1a3d2e", lineHeight: 1.3, marginBottom: 16 }} />
          <div style={{ flex: 1 }}>
            <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 13, color: "#4a6b5a", lineHeight: 1.85 }} />
          </div>
          {s.extra && (
            <div style={{ marginTop: 16, padding: "14px 18px", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 12, color: "#5a7b6a", lineHeight: 1.7 }} />
            </div>
          )}
          <div style={{ display: "flex", gap: 6, marginTop: 20, alignItems: "center" }}>
            {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 24 : 6, height: 4, borderRadius: 2, background: i === idx ? a : "#ccc" }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ForestEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#f0f9f4", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 32px", boxSizing: "border-box" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 100, height: 100, background: `${a}20`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <span style={{ fontSize: 48, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}>🌸</span>
        </div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 26, fontWeight: 800, color: "#1a3d2e", marginBottom: 12, lineHeight: 1.3 }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "#4a6b5a", marginBottom: 28, lineHeight: 1.6 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => <span key={i} style={{ padding: "8px 16px", background: `${a}15`, borderRadius: 16, fontSize: 12, color: a, fontWeight: 600 }}><EditableTag text={`#${t}`} c={a} on={ed?.tag?.(i)} /></span>)}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 20, opacity: 0.6 }}>🌸</span>
          <span style={{ fontSize: 24, opacity: 0.8 }}>🌼</span>
          <span style={{ fontSize: 20, opacity: 0.6 }}>🌸</span>
        </div>
      </div>
    </div>
  );
}