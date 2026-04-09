import { EditableText, EditableTag } from "../../common/EditableText";
import { EditableEmoji } from "../../common/EditableEmoji";
import { FONT_FAMILY } from "../../../constants";

export function JapaneseCover({ s, a, total, ed, emojiEditor }) {
  return (
    <div style={{ background: "#f8f5f0", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "40px 32px", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "40%", height: "100%", background: `${a}10` }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, transparent, #333, transparent)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 50, height: 50, border: "2px solid #333", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
            <EditableEmoji
              emoji={s.emoji || "✨"}
              onEmojiChange={emojiEditor?.onEmojiChange}
              style={emojiEditor?.style || { fontSize: '24px' }}
              onStyleChange={emojiEditor?.onStyleChange}
            />
          </div>
          <div style={{ fontSize: 9, color: "#333", letterSpacing: "4px" }}>{s.category?.toUpperCase?.() || ""}</div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <div style={{ position: "absolute", left: -20, top: 0, bottom: 0, width: 3, background: a }} />
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 32, fontWeight: 800, color: "#1a1a1a", lineHeight: 1.25, paddingLeft: 20, fontFamily: "'Noto Serif JP', serif", ...ed?.titleStyle }} draggable={!!ed?.updateTitleStyle} onStyleChange={ed?.updateTitleStyle} />
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 14, color: "#555", lineHeight: 1.8, paddingLeft: 20, fontFamily: "'Noto Serif JP', serif", ...ed?.subtitleStyle }} draggable={!!ed?.updateSubtitleStyle} onStyleChange={ed?.updateSubtitleStyle} />}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1, height: 1, background: "#ddd" }} />
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 28 : 6, height: 2, background: i === 0 ? "#333" : "#ddd" }} />)}
        </div>
      </div>
    </div>
  );
}

export function JapaneseContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#f8f5f0", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ width: "4px", background: a }} />
        <div style={{ flex: 1, padding: "28px 24px", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, border: "2px solid #333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#333" }}>{idx}</div>
            <div style={{ flex: 1, height: 1, background: "#ddd" }} />
          </div>
          <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4, marginBottom: 16, fontFamily: "'Noto Serif JP', serif", ...ed?.headingStyle }} draggable={!!ed?.updateHeadingStyle} onStyleChange={ed?.updateHeadingStyle} />
          <div style={{ flex: 1, borderLeft: "2px solid #eee", paddingLeft: 16 }}>
            <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#444", lineHeight: 2, ...ed?.textStyle }} draggable={!!ed?.updateTextStyle} onStyleChange={ed?.updateTextStyle} />
          </div>
          {s.extra && (
            <div style={{ marginTop: 16, padding: "14px 18px", background: "#fff", border: "1px solid #ddd", borderLeft: "3px solid #333" }}>
              <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 13, color: "#555", lineHeight: 1.8, ...ed?.extraStyle }} draggable={!!ed?.updateExtraStyle} onStyleChange={ed?.updateExtraStyle} />
            </div>
          )}
          <div style={{ display: "flex", gap: 6, marginTop: 20, alignItems: "center" }}>
            {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 28 : 6, height: 2, background: i === idx ? "#333" : "#ddd" }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function JapaneseEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#f8f5f0", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 32px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, transparent, #333, transparent)" }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 20, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}>🍃</div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 12, lineHeight: 1.4, fontFamily: "'Noto Serif JP', serif", ...ed?.ctaStyle }} draggable={!!ed?.updateCtaStyle} onStyleChange={ed?.updateCtaStyle} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 13, color: "#666", marginBottom: 28, lineHeight: 1.8, fontFamily: "'Noto Serif JP', serif", ...ed?.subStyle }} draggable={!!ed?.updateSubStyle} onStyleChange={ed?.updateSubStyle} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => <span key={i} style={{ padding: "6px 14px", background: "#fff", border: "1px solid #ddd", fontSize: 11, color: "#333" }}><EditableTag text={t} c="#333" on={ed?.tag?.(i)} noBorder /></span>)}
        </div>
        <div style={{ fontSize: 10, color: "#999", letterSpacing: "4px" }}>完</div>
      </div>
    </div>
  );
}