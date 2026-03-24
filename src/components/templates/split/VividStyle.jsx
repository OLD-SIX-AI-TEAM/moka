import { EditableText, EditableTag } from "../../common/EditableText";
import { EditableEmoji } from "../../common/EditableEmoji";
import { FONT_FAMILY } from "../../../constants";

export function VividCover({ s, a, total, ed, emojiEditor }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 8, background: a }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "36px 32px" }}>
        <div style={{ position: "absolute", top: 24, right: 24, width: 80, height: 80, background: `${a}15`, borderRadius: "50%" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 50, height: 50, background: a, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <EditableEmoji
              emoji={s.emoji || "✨"}
              onEmojiChange={emojiEditor?.onEmojiChange}
              style={emojiEditor?.style || { fontSize: '24px', color: '#fff' }}
              onStyleChange={emojiEditor?.onStyleChange}
              align="center"
            />
          </div>
          <span style={{ fontSize: 11, color: a, letterSpacing: "3px", fontWeight: 700 }}>{s.category?.toUpperCase?.() || ""}</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 36, fontWeight: 900, color: "#000", lineHeight: 1.1, marginBottom: 16, letterSpacing: "-1px", ...ed?.titleStyle }} draggable={!!ed?.updateTitleStyle} onStyleChange={ed?.updateTitleStyle} />
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 15, color: "#333", lineHeight: 1.6, ...ed?.subtitleStyle }} draggable={!!ed?.updateSubtitleStyle} onStyleChange={ed?.updateSubtitleStyle} />}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1, height: 3, background: `${a}30` }} />
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 28 : 8, height: 8, background: i === 0 ? a : "#000", transform: "rotate(-1deg)" }} />)}
        </div>
      </div>
    </div>
  );
}

export function VividContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, background: a, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 24, color: "#fff", fontWeight: 900 }}>{String(idx).padStart(2, "0")}</div>
          </div>
          <div style={{ flex: 1, height: 3, background: "#000" }} />
          <div style={{ width: 12, height: 12, background: idx % 2 === 0 ? a : "#000", transform: "rotate(45deg)" }} />
        </div>
        <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 24, fontWeight: 900, color: "#000", lineHeight: 1.2, marginBottom: 16, textTransform: "uppercase", ...ed?.headingStyle }} draggable={!!ed?.updateHeadingStyle} onStyleChange={ed?.updateHeadingStyle} />
        <div style={{ flex: 1 }}>
          <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 15, color: "#222", lineHeight: 1.8, ...ed?.textStyle }} draggable={!!ed?.updateTextStyle} onStyleChange={ed?.updateTextStyle} />
        </div>
        {s.extra && (
          <div style={{ marginTop: 20, padding: "16px 20px", background: `${a}10`, borderLeft: `4px solid ${a}` }}>
            <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 14, color: "#333", lineHeight: 1.7, ...ed?.extraStyle }} draggable={!!ed?.updateExtraStyle} onStyleChange={ed?.updateExtraStyle} />
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 24, alignItems: "center" }}>
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 28 : 8, height: 8, background: i === idx ? a : "#000", transform: "rotate(-1deg)" }} />)}
        </div>
      </div>
    </div>
  );
}

export function VividEnd({ s, a, ed, emojiEditor }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 32px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 8, background: a }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 8, background: "#000" }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 80, height: 80, background: a, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <EditableEmoji
            emoji={s.emoji || "✨"}
            onEmojiChange={emojiEditor?.onEmojiChange}
            style={emojiEditor?.style || { fontSize: '40px', color: '#fff' }}
            onStyleChange={emojiEditor?.onStyleChange}
            align="center"
          />
        </div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 28, fontWeight: 900, color: "#000", marginBottom: 12, lineHeight: 1.2, textTransform: "uppercase", ...ed?.ctaStyle }} draggable={!!ed?.updateCtaStyle} onStyleChange={ed?.updateCtaStyle} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "#333", marginBottom: 28, lineHeight: 1.6, ...ed?.subStyle }} draggable={!!ed?.updateSubStyle} onStyleChange={ed?.updateSubStyle} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => <span key={i} style={{ padding: "8px 16px", background: i % 2 === 0 ? a : "#000", color: "#fff", fontSize: 12, fontWeight: 700 }}><EditableTag text={t} c="#fff" on={ed?.tag?.(i)} /></span>)}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          {[...Array(5)].map((_, i) => <div key={i} style={{ width: 8, height: 8, background: i % 2 === 0 ? a : "#000", transform: "rotate(45deg)" }} />)}
        </div>
      </div>
    </div>
  );
}