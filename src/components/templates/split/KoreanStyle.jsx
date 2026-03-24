import { EditableText, EditableTag } from "../../common/EditableText";
import { EditableEmoji } from "../../common/EditableEmoji";
import { FONT_FAMILY } from "../../../constants";

export function KoreanCover({ s, a, total, ed, emojiEditor }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* 柔和渐变背景 */}
      <div style={{ position: "absolute", top: 0, right: 0, width: "60%", height: "100%", background: `linear-gradient(180deg, ${a}12 0%, ${a}05 50%, transparent 100%)` }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "40%", height: "60%", background: `linear-gradient(0deg, ${a}08 0%, transparent 100%)` }} />
      
      {/* 装饰性圆形 */}
      <div style={{ position: "absolute", top: 20, right: 20, width: 100, height: 100, borderRadius: "50%", background: `${a}10`, border: `2px solid ${a}15` }} />
      <div style={{ position: "absolute", top: 60, right: 60, width: 40, height: 40, borderRadius: "50%", background: `${a}15` }} />
      <div style={{ position: "absolute", bottom: 80, left: 16, width: 60, height: 60, borderRadius: "50%", background: `${a}08` }} />
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "36px 32px", position: "relative", zIndex: 1 }}>
        {/* 顶部可爱标签 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ 
            width: 56, 
            height: 56, 
            background: `linear-gradient(135deg, ${a}, ${a}dd)`, 
            borderRadius: 28, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            boxShadow: `0 6px 20px ${a}40`
          }}>
            <EditableEmoji
              emoji={s.emoji || "✨"}
              onEmojiChange={emojiEditor?.onEmojiChange}
              style={emojiEditor?.style || { fontSize: '28px' }}
              onStyleChange={emojiEditor?.onStyleChange}
            />
          </div>
          <div>
            <div style={{ fontSize: 10, color: a, letterSpacing: "2px", fontWeight: 700, marginBottom: 2 }}>{s.category?.toUpperCase?.() || ""}</div>
            <div style={{ display: "flex", gap: 4 }}>
              {[...Array(3)].map((_, i) => <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: `${a}40` }} />)}
            </div>
          </div>
        </div>
        
        {/* 标题区域 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 34, fontWeight: 800, color: "#1a1a1a", lineHeight: 1.2, marginBottom: 16, ...ed?.titleStyle }} draggable={!!ed?.updateTitleStyle} onStyleChange={ed?.updateTitleStyle} />
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 15, color: "#777", lineHeight: 1.7, ...ed?.subtitleStyle }} draggable={!!ed?.updateSubtitleStyle} onStyleChange={ed?.updateSubtitleStyle} />}
        </div>
        
        {/* 底部页码 - 心形装饰 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 16, color: a }}>♡</span>
          <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${a}40, ${a}10)` }} />
          <div style={{ display: "flex", gap: 8 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{ 
                width: i === 0 ? 28 : 8, 
                height: 4, 
                borderRadius: 2, 
                background: i === 0 ? a : `${a}30`
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function KoreanContent({ s, a, idx, total, ed }) {
  const hearts = ["💜", "💗", "💙", "💚", "🧡"];
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* 背景装饰 */}
      <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: `${a}06` }} />
      <div style={{ position: "absolute", bottom: "40%", left: -30, width: 80, height: 80, borderRadius: "50%", background: `${a}05` }} />
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "28px 24px", position: "relative", zIndex: 1 }}>
        {/* 章节标题 - 可爱卡片式 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ 
            width: 64, 
            height: 64, 
            background: "#fff",
            borderRadius: 20, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            boxShadow: `0 4px 16px ${a}20`,
            border: `2px solid ${a}20`
          }}>
            <span style={{ fontSize: 32, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}>{hearts[(idx - 1) % 5]}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: a, letterSpacing: "2px", fontWeight: 600, marginBottom: 4 }}>CHAPTER {idx}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 2, background: `${a}15`, borderRadius: 1 }} />
              <span style={{ fontSize: 10, color: "#aaa" }}>Page {idx}</span>
            </div>
          </div>
        </div>
        
        <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3, marginBottom: 16, ...ed?.headingStyle }} draggable={!!ed?.updateHeadingStyle} onStyleChange={ed?.updateHeadingStyle} />
        
        {/* 正文区域 */}
        <div style={{ flex: 1 }}>
          <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#555", lineHeight: 1.85, ...ed?.textStyle }} draggable={!!ed?.updateTextStyle} onStyleChange={ed?.updateTextStyle} />
        </div>
        
        {s.extra && (
          <div style={{ 
            marginTop: 16, 
            padding: "18px 20px", 
            background: `${a}06`, 
            borderRadius: 16,
            border: `1px dashed ${a}30`
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 14 }}>💝</span>
              <span style={{ fontSize: 10, color: a, fontWeight: 600, letterSpacing: "1px" }}>SPECIAL NOTE</span>
            </div>
            <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 13, color: "#666", lineHeight: 1.7, ...ed?.extraStyle }} draggable={!!ed?.updateExtraStyle} onStyleChange={ed?.updateExtraStyle} />
          </div>
        )}
        
        {/* 底部导航 */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20 }}>
          <span style={{ fontSize: 12, color: a }}>♡</span>
          <div style={{ display: "flex", gap: 8, flex: 1, justifyContent: "flex-end" }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{ 
                width: i === idx ? 28 : 8, 
                height: 4, 
                borderRadius: 2, 
                background: i === idx ? a : `${a}25`
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function KoreanEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 32px", boxSizing: "border-box" }}>
      {/* 背景装饰 */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "50%", height: "100%", background: `linear-gradient(135deg, ${a}08 0%, transparent 60%)` }} />
      <div style={{ position: "absolute", bottom: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: `${a}06` }} />
      
      {/* 心形装饰散落 */}
      <div style={{ position: "absolute", top: "15%", left: "10%", fontSize: 20, opacity: 0.2, transform: "rotate(-15deg)" }}>♡</div>
      <div style={{ position: "absolute", top: "25%", right: "15%", fontSize: 16, opacity: 0.15, transform: "rotate(10deg)" }}>♡</div>
      <div style={{ position: "absolute", bottom: "20%", left: "20%", fontSize: 24, opacity: 0.1, transform: "rotate(5deg)" }}>♡</div>
      
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        {/* 可爱图标组合 */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 24 }}>
          <span style={{ fontSize: 28, transform: "rotate(-10deg)" }}>💖</span>
          <span style={{ fontSize: 40, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}>✨</span>
          <span style={{ fontSize: 28, transform: "rotate(10deg)" }}>💖</span>
        </div>
        
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 26, fontWeight: 800, color: "#1a1a1a", marginBottom: 12, lineHeight: 1.3, ...ed?.ctaStyle }} draggable={!!ed?.updateCtaStyle} onStyleChange={ed?.updateCtaStyle} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "#777", marginBottom: 28, lineHeight: 1.6, ...ed?.subStyle }} draggable={!!ed?.updateSubStyle} onStyleChange={ed?.updateSubStyle} />
        
        {/* 标签 - 可爱样式 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => (
            <span key={i} style={{ 
              padding: "8px 16px", 
              background: i % 2 === 0 ? `${a}12` : "#fff",
              border: `1px solid ${a}25`,
              borderRadius: 20, 
              fontSize: 12, 
              color: a, 
              fontWeight: 600
            }}>
              <EditableTag text={`#${t}`} c={a} on={ed?.tag?.(i)} />
            </span>
          ))}
        </div>
        
        {/* 底部装饰 - 圆点阵 */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          {[...Array(7)].map((_, i) => (
            <div key={i} style={{ 
              width: 6, 
              height: 6, 
              borderRadius: "50%", 
              background: i === 3 ? a : `${a}30`
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}