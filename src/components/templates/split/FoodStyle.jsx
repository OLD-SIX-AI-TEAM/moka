import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function FoodCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#fef9f3", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: `repeating-linear-gradient(90deg, ${a}, ${a} 20px, transparent 20px, transparent 40px)` }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "40px 36px", position: "relative" }}>
        <div style={{ position: "absolute", top: 24, right: 24, fontSize: 80, opacity: 0.06, fontFamily: "Georgia, serif" }}>❝</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 40, height: 2, background: a }} />
              <span style={{ fontSize: 9, color: a, letterSpacing: "3px", fontWeight: 600 }}>CUISINE</span>
            </div>
            <div style={{ fontSize: 10, color: "#999", letterSpacing: "1px" }}>{s.category}</div>
          </div>
          <div style={{ fontSize: 32 }}>🍴</div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 36, fontWeight: 800, color: "#2d1f14", lineHeight: 1.1, marginBottom: 20 }} />
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 15, color: "#6b5344", lineHeight: 1.7, fontStyle: "italic" }} />}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${a}40, transparent)` }} />
          <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 20 : 6, height: 6, borderRadius: 3, background: i === 0 ? a : `${a}30` }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FoodContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#fef9f3", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 60, height: 60, background: a, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: 32, filter: "brightness(0) invert(1)" }}>{["🥘", "🍜", "🥗", "🍰", "🍹"][(idx - 1) % 5]}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: a, letterSpacing: "2px", fontWeight: 700 }}>STEP {idx}</div>
            <div style={{ fontSize: 10, color: "#888" }}>Recipe Guide</div>
          </div>
        </div>
        <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 24, fontWeight: 800, color: "#2d1f14", lineHeight: 1.25, marginBottom: 16 }} />
        <div style={{ flex: 1 }}>
          <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 15, color: "#5a4535", lineHeight: 1.85 }} />
        </div>
        {s.extra && (
          <div style={{ marginTop: 20, padding: "18px 22px", background: "#fff", borderRadius: 8, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", position: "relative" }}>
            <div style={{ position: "absolute", top: -1, left: 20, right: 20, height: 3, background: a, borderRadius: "0 0 4px 4px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>👨‍🍳</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: a, letterSpacing: "1px" }}>CHEF'S TIP</span>
            </div>
            <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 14, color: "#5a4535", lineHeight: 1.7 }} />
          </div>
        )}
        <div style={{ display: "flex", gap: 6, marginTop: 24, alignItems: "center" }}>
          <div style={{ flex: 1, height: 1, background: `${a}20` }} />
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 20 : 6, height: 6, borderRadius: 3, background: i === idx ? a : `${a}25` }} />)}
        </div>
      </div>
    </div>
  );
}

export function FoodEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#fef9f3", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 40px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: `repeating-linear-gradient(90deg, ${a}, ${a} 20px, transparent 20px, transparent 40px)` }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 8, background: `repeating-linear-gradient(90deg, ${a}, ${a} 20px, transparent 20px, transparent 40px)` }} />
      <div style={{ position: "absolute", top: 50, right: 30, fontSize: 100, opacity: 0.04 }}>完</div>
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
          <span style={{ fontSize: 28 }}>🌟</span>
          <span style={{ fontSize: 36 }}>🍽️</span>
          <span style={{ fontSize: 28 }}>🌟</span>
        </div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 26, fontWeight: 800, color: "#2d1f14", marginBottom: 12, lineHeight: 1.3 }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "#6b5344", marginBottom: 28, lineHeight: 1.6 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => <span key={i} style={{ padding: "8px 18px", background: a, borderRadius: 20, fontSize: 12, color: "#fff", fontWeight: 600 }}><EditableTag text={t} c="#fff" on={ed?.tag?.(i)} /></span>)}
        </div>
        <div style={{ fontSize: 11, color: "#aaa", letterSpacing: "2px" }}>BON APPÉTIT</div>
      </div>
    </div>
  );
}