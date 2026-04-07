import { EditableText, EditableTag } from "../../common/EditableText";
import { EditableEmoji } from "../../common/EditableEmoji";
import { FONT_FAMILY } from "../../../constants";

export function DarkCover({ s, a, total, ed, emojiEditor }) {
  return (
    <div style={{ background: "#0a0a0a", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 30% 30%, ${a}20 0%, transparent 50%), radial-gradient(circle at 70% 70%, ${a}10 0%, transparent 40%)` }} />
      <div style={{ position: "absolute", top: 0, right: 0, width: 1, height: "100%", background: `linear-gradient(180deg, transparent, ${a}50, transparent)` }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "40px 36px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 40, height: 40, border: `1px solid ${a}60`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <EditableEmoji
              emoji={s.emoji || "✨"}
              onEmojiChange={emojiEditor?.onEmojiChange}
              style={emojiEditor?.style || { fontSize: '20px', filter: `drop-shadow(0 0 8px ${a})` }}
              onStyleChange={emojiEditor?.onStyleChange}
            />
          </div>
          <span style={{ fontSize: 10, color: a, letterSpacing: "4px", fontWeight: 600 }}>{s.category?.toUpperCase?.() || ""}</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <EditableText v={s.title} on={ed?.title} block dk style={{ fontSize: 34, fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 16, textShadow: `0 0 30px ${a}40`, ...ed?.titleStyle }} draggable={!!ed?.updateTitleStyle} onStyleChange={ed?.updateTitleStyle} />
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block dk style={{ fontSize: 14, color: "#888", lineHeight: 1.7, ...ed?.subtitleStyle }} draggable={!!ed?.updateSubtitleStyle} onStyleChange={ed?.updateSubtitleStyle} />}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 28 : 6, height: 2, background: i === 0 ? a : "#333" }} />)}
        </div>
      </div>
    </div>
  );
}

export function DarkContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#0a0a0a", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 80% 20%, ${a}15 0%, transparent 40%)` }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 28px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 52, height: 52, background: `linear-gradient(135deg, ${a}40, ${a}20)`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${a}30` }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: a }}>{String(idx).padStart(2, "0")}</div>
          </div>
          <div style={{ width: 3, height: 30, background: a }} />
        </div>
        <EditableText v={s.heading} on={ed?.heading} block dk style={{ fontSize: 20, fontWeight: 600, color: "#fff", lineHeight: 1.3, marginBottom: 16, ...ed?.headingStyle }} draggable={!!ed?.updateHeadingStyle} onStyleChange={ed?.updateHeadingStyle} />
        <div style={{ flex: 1 }}>
          <EditableText v={s.text} on={ed?.text} block dk style={{ fontSize: 14, color: "#888", lineHeight: 1.9, ...ed?.textStyle }} draggable={!!ed?.updateTextStyle} onStyleChange={ed?.updateTextStyle} />
        </div>
        {s.extra && (
          <div style={{ marginTop: 20, padding: "16px 20px", background: `${a}10`, border: `1px solid ${a}30`, borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: a, marginBottom: 8, letterSpacing: "1px" }}>◆ INSIGHT</div>
            <EditableText v={s.extra} on={ed?.extra} block dk style={{ fontSize: 13, color: "#aaa", lineHeight: 1.7, ...ed?.extraStyle }} draggable={!!ed?.updateExtraStyle} onStyleChange={ed?.updateExtraStyle} />
          </div>
        )}
        <div style={{ display: "flex", gap: 6, marginTop: 24, alignItems: "center" }}>
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 28 : 6, height: 2, background: i === idx ? a : "#333" }} />)}
        </div>
      </div>
    </div>
  );
}

export function DarkEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#0a0a0a", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 32px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 50%, ${a}15 0%, transparent 60%)` }} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 20, filter: `drop-shadow(0 0 20px ${a})` }}>◈</div>
        <EditableText v={s.cta} on={ed?.cta} block dk style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 12, lineHeight: 1.3, textShadow: `0 0 30px ${a}40`, ...ed?.ctaStyle }} draggable={!!ed?.updateCtaStyle} onStyleChange={ed?.updateCtaStyle} />
        <EditableText v={s.sub} on={ed?.sub} block dk style={{ fontSize: 13, color: "#666", marginBottom: 28, lineHeight: 1.6, ...ed?.subStyle }} draggable={!!ed?.updateSubStyle} onStyleChange={ed?.updateSubStyle} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => <span key={i} style={{ padding: "6px 14px", border: `1px solid ${a}50`, fontSize: 11, color: a }}><EditableTag text={t} c={a} on={ed?.tag?.(i)} noBorder /></span>)}
        </div>
        <div style={{ fontSize: 10, color: "#333", letterSpacing: "4px" }}>◇ ◇ ◇</div>
      </div>
    </div>
  );
}