import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function CreamyCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#fffbf5", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "40px 36px", position: "relative" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 180, height: 180, borderRadius: "50%", background: `${a}12` }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 140, height: 140, borderRadius: "50%", background: `${a}08` }} />
        <div style={{ position: "absolute", top: 24, left: 24, right: 24, height: 2, background: `linear-gradient(90deg,${a}40,transparent,${a}40)` }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 2, background: a }} />
            <span style={{ fontSize: 9, color: a, letterSpacing: "3px", fontWeight: 600 }}>DELICATE</span>
          </div>
          <div style={{ fontSize: 64, marginBottom: 20, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.08))" }}>{s.emoji}</div>
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 34, fontWeight: 800, color: "#2d2520", lineHeight: 1.2, marginBottom: 16, letterSpacing: "-0.5px" }} />
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 15, color: "#6b5b4f", lineHeight: 1.7 }} />}
        </div>
        <div style={{ position: "absolute", bottom: 24, left: 24, right: 24, height: 2, background: `linear-gradient(90deg,${a}40,transparent,${a}40)` }} />
        <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8 }}>
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 24 : 6, height: 4, borderRadius: 2, background: i === 0 ? a : `${a}40` }} />)}
        </div>
      </div>
    </div>
  );
}

export function CreamyContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#fffbf5", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ width: "28%", background: a, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "rgba(255,255,255,0.3)" }} />
          <div style={{ fontSize: 56, fontWeight: 300, color: "rgba(255,255,255,0.9)" }}>{String.fromCharCode(8544 + idx - 1)}</div>
        </div>
        <div style={{ flex: 1, padding: "28px 24px", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
          <div style={{ height: 3, background: `linear-gradient(90deg,${a},${a}88)`, marginBottom: 20, borderRadius: 2 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${a}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: a }}>{idx}</div>
            <div style={{ flex: 1, height: 1, background: `${a}30` }} />
            <div style={{ fontSize: 10, color: a, letterSpacing: "1px" }}>{String(idx).padStart(2, "0")} / {String(total - 2).padStart(2, "0")}</div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 22, fontWeight: 800, color: "#2d2520", lineHeight: 1.3, marginBottom: 16 }} />
            <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#5a4f45", lineHeight: 1.9 }} />
          </div>
          {s.extra && (
            <div style={{ marginTop: 20, padding: "16px 20px", background: `${a}10`, borderRadius: 12, borderLeft: `4px solid ${a}` }}>
              <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 13, color: "#6b5b4f", lineHeight: 1.7 }} />
            </div>
          )}
          <div style={{ display: "flex", gap: 6, marginTop: 20, alignItems: "center" }}>
            <div style={{ flex: 1, height: 1, background: `${a}20` }} />
            {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 24 : 6, height: 4, borderRadius: 2, background: i === idx ? a : `${a}30` }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CreamyEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#fffbf5", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 40px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", top: -40, left: -40, width: 140, height: 140, borderRadius: "50%", background: `${a}12` }} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 24 }}>
          <span style={{ fontSize: 32, opacity: 0.6 }}>✦</span>
          <span style={{ fontSize: 40 }}>💫</span>
          <span style={{ fontSize: 32, opacity: 0.6 }}>✦</span>
        </div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 28, fontWeight: 800, color: "#2d2520", marginBottom: 12, lineHeight: 1.3 }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "#6b5b4f", marginBottom: 32, lineHeight: 1.6 }} />
        <div style={{ width: 50, height: 2, background: `${a}50`, margin: "0 auto 28px" }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => <span key={i} style={{ padding: "8px 18px", background: `${a}10`, borderRadius: 20, fontSize: 13, color: a, fontWeight: 600 }}><EditableTag text={t} c={a} on={ed?.tag?.(i)} /></span>)}
        </div>
        <div style={{ fontSize: 10, color: `${a}80`, letterSpacing: "3px" }}>— FIN —</div>
      </div>
    </div>
  );
}