import { EditableText, EditableTag } from "../../common/EditableText";
import { EditableEmoji } from "../../common/EditableEmoji";
import { FONT_FAMILY } from "../../../constants";

export function RetroCover({ s, a, total, ed, emojiEditor }) {
  return (
    <div style={{ background: "#f5f0e8", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 28px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
        <div style={{ position: "relative", border: `3px double ${a}`, padding: "32px 24px", background: "#fffef8", flex: 1, display: "flex", flexDirection: "column" }}>
          {["tl", "tr", "bl", "br"].map((p) => (
            <div key={p} style={{ position: "absolute", width: 14, height: 14, border: `3px solid ${a}`, ...(p === "tl" ? { top: -4, left: -4, borderRight: "none", borderBottom: "none" } : p === "tr" ? { top: -4, right: -4, borderLeft: "none", borderBottom: "none" } : p === "bl" ? { bottom: -4, left: -4, borderRight: "none", borderTop: "none" } : { bottom: -4, right: -4, borderLeft: "none", borderTop: "none" }) }} />
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 9, color: a, letterSpacing: "4px", fontFamily: "Georgia, serif" }}>EST. 2024</span>
            <div style={{ flex: 1, height: 1, background: `${a}40` }} />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ marginBottom: 16 }}>
            <EditableEmoji
              emoji={s.emoji || "✨"}
              onEmojiChange={emojiEditor?.onEmojiChange}
              style={emojiEditor?.style || { fontSize: '56px' }}
              onStyleChange={emojiEditor?.onStyleChange}
            />
          </div>
            <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 28, fontWeight: 900, color: "#1a1510", lineHeight: 1.25, fontFamily: "Georgia, serif", marginBottom: 16, ...ed?.titleStyle }} draggable={!!ed?.updateTitleStyle} onStyleChange={ed?.updateTitleStyle} />
            {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 14, color: "#666", lineHeight: 1.7, fontStyle: "italic", ...ed?.subtitleStyle }} draggable={!!ed?.updateSubtitleStyle} onStyleChange={ed?.updateSubtitleStyle} />}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: 10, height: 10, border: `2px solid ${a}`, background: i === 0 ? a : "transparent" }} />)}
          </div>
        </div>
        <div style={{ fontSize: 9, color: a, marginTop: 16, fontFamily: "Georgia, serif", letterSpacing: "2px", textAlign: "center" }}>{new Date().toLocaleDateString('zh-CN').replace(/\//g, '.')}</div>
      </div>
    </div>
  );
}

export function RetroContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#f5f0e8", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "28px 24px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
        <div style={{ position: "relative", border: `2px solid ${a}`, padding: "24px 20px", background: "#fffef8", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${a}40` }}>
            <div style={{ minWidth: 36, height: 36, border: `2px solid ${a}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: a, fontFamily: "Georgia, serif" }}>{String.fromCharCode(65 + idx - 1)}</div>
            <div style={{ fontSize: 9, color: a, letterSpacing: "2px" }}>PAGE {String(idx).padStart(2, "0")}</div>
            <div style={{ flex: 1, height: 1, background: `${a}40` }} />
          </div>
          <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 20, fontWeight: 800, color: "#1a1510", lineHeight: 1.3, marginBottom: 14, textDecoration: "underline", textDecorationColor: `${a}50`, fontFamily: "Georgia, serif", ...ed?.headingStyle }} draggable={!!ed?.updateHeadingStyle} onStyleChange={ed?.updateHeadingStyle} />
          <div style={{ flex: 1 }}>
            <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#444", lineHeight: 1.9, ...ed?.textStyle }} draggable={!!ed?.updateTextStyle} onStyleChange={ed?.updateTextStyle} />
          </div>
          {s.extra && (
            <div style={{ marginTop: 16, padding: "12px 14px", border: `1px dashed ${a}`, background: `${a}08` }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: a, fontFamily: "Georgia, serif" }}>★ </span><EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 12, color: "#555", lineHeight: 1.7, ...ed?.extraStyle }} draggable={!!ed?.updateExtraStyle} onStyleChange={ed?.updateExtraStyle} />
            </div>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center" }}>
            {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: 10, height: 10, border: `2px solid ${a}`, background: i === idx ? a : "transparent" }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RetroEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#f5f0e8", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "32px 28px", boxSizing: "border-box" }}>
      <div style={{ position: "relative", border: `3px double ${a}`, padding: "32px 24px", background: "#fffef8" }}>
        {["tl", "tr", "bl", "br"].map((p) => (
          <div key={p} style={{ position: "absolute", width: 14, height: 14, border: `3px solid ${a}`, ...(p === "tl" ? { top: -4, left: -4, borderRight: "none", borderBottom: "none" } : p === "tr" ? { top: -4, right: -4, borderLeft: "none", borderBottom: "none" } : p === "bl" ? { bottom: -4, left: -4, borderRight: "none", borderTop: "none" } : { bottom: -4, right: -4, borderLeft: "none", borderTop: "none" }) }} />
        ))}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌟</div>
          <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 22, fontWeight: 900, color: "#1a1510", marginBottom: 8, fontFamily: "Georgia, serif", lineHeight: 1.3, ...ed?.ctaStyle }} draggable={!!ed?.updateCtaStyle} onStyleChange={ed?.updateCtaStyle} />
          <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 13, color: "#666", marginBottom: 20, fontStyle: "italic", ...ed?.subStyle }} draggable={!!ed?.updateSubStyle} onStyleChange={ed?.updateSubStyle} />
          <div style={{ width: 60, height: 2, background: a, margin: "0 auto 16px" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 16 }}>
            {s.tags.map((t, i) => <span key={i} style={{ padding: "4px 12px", border: `1px solid ${a}`, fontSize: 11, color: a, fontWeight: 600 }}><EditableTag text={t} c={a} on={ed?.tag?.(i)} /></span>)}
          </div>
          <div style={{ fontSize: 10, color: a, fontFamily: "Georgia, serif", letterSpacing: "2px" }}>THE END</div>
        </div>
      </div>
    </div>
  );
}