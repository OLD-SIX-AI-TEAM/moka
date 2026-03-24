import { EditableText, EditableTag } from "../../common/EditableText";
import { EditableEmoji } from "../../common/EditableEmoji";
import { FONT_FAMILY } from "../../../constants";

export function PureCover({ s, a, total, ed, emojiEditor }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* 纯净渐变背景 */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: `linear-gradient(180deg, ${a}08 0%, transparent 100%)` }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: `linear-gradient(0deg, ${a}06 0%, transparent 100%)` }} />
      
      {/* 顶部细线装饰 */}
      <div style={{ position: "absolute", top: 28, left: 40, right: 40, height: 1, background: `linear-gradient(90deg, transparent, ${a}30, transparent)` }} />
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "52px 44px 40px", position: "relative", zIndex: 1 }}>
        {/* 分类标签 - 极简风格 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, background: a, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 16px ${a}30` }}>
            <EditableEmoji
              emoji={s.emoji || "✨"}
              onEmojiChange={emojiEditor?.onEmojiChange}
              style={emojiEditor?.style || { fontSize: '22px' }}
              onStyleChange={emojiEditor?.onStyleChange}
            />
          </div>
          <div>
            <div style={{ fontSize: 10, color: a, letterSpacing: "3px", fontWeight: 600, marginBottom: 4 }}>{s.category?.toUpperCase?.() || "PURE"}</div>
            <div style={{ width: 24, height: 2, background: `${a}40`, borderRadius: 1 }} />
          </div>
        </div>
        
        {/* 标题区域 - 居中布局 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 36, fontWeight: 300, color: "#1a1a1a", lineHeight: 1.3, letterSpacing: "2px", marginBottom: 20, ...ed?.titleStyle }} draggable={!!ed?.updateTitleStyle} onStyleChange={ed?.updateTitleStyle} />
          {s.subtitle && (
            <>
              <div style={{ width: 40, height: 1, background: `${a}50`, margin: "0 auto 20px" }} />
              <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 14, color: "#777", lineHeight: 1.8, maxWidth: "80%", ...ed?.subtitleStyle }} draggable={!!ed?.updateSubtitleStyle} onStyleChange={ed?.updateSubtitleStyle} />
            </>
          )}
        </div>
        
        {/* 底部页码指示器 - 纯净风格 */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, alignItems: "center" }}>
          <div style={{ width: 30, height: 1, background: `${a}30` }} />
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ 
              width: i === 0 ? 8 : 4, 
              height: i === 0 ? 8 : 4, 
              borderRadius: "50%",
              background: i === 0 ? a : `${a}30`
            }} />
          ))}
          <div style={{ width: 30, height: 1, background: `${a}30` }} />
        </div>
        
        {/* 底部细线装饰 */}
        <div style={{ position: "absolute", bottom: 28, left: 40, right: 40, height: 1, background: `linear-gradient(90deg, transparent, ${a}30, transparent)` }} />
      </div>
    </div>
  );
}

export function PureContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* 背景装饰 - 柔和圆形 */}
      <div style={{ position: "absolute", top: "20%", right: -40, width: 120, height: 120, borderRadius: "50%", background: `${a}05` }} />
      <div style={{ position: "absolute", bottom: "30%", left: -30, width: 80, height: 80, borderRadius: "50%", background: `${a}04` }} />
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "36px 32px", position: "relative", zIndex: 1 }}>
        {/* 章节标题 - 纯净风格 */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
          <div style={{ 
            width: 56, 
            height: 56, 
            background: `linear-gradient(135deg, ${a}20, ${a}10)`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${a}20`
          }}>
            <div style={{ fontSize: 24, fontWeight: 300, color: a }}>{idx}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: a, letterSpacing: "3px", fontWeight: 600, marginBottom: 6 }}>CHAPTER {String(idx).padStart(2, "0")}</div>
            <div style={{ height: 1, background: `linear-gradient(90deg, ${a}30, transparent)` }} />
          </div>
        </div>
        
        {/* 标题 */}
        <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 24, fontWeight: 300, color: "#1a1a1a", lineHeight: 1.4, letterSpacing: "1px", marginBottom: 20, ...ed?.headingStyle }} draggable={!!ed?.updateHeadingStyle} onStyleChange={ed?.updateHeadingStyle} />
        
        {/* 正文区域 - 居中排版 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 15, color: "#555", lineHeight: 2, textAlign: "center", ...ed?.textStyle }} draggable={!!ed?.updateTextStyle} onStyleChange={ed?.updateTextStyle} />
        </div>
        
        {s.extra && (
          <div style={{ 
            marginTop: 24, 
            padding: "24px", 
            background: `${a}04`,
            borderRadius: 16,
            border: `1px solid ${a}10`,
            textAlign: "center"
          }}>
            <div style={{ width: 30, height: 1, background: `${a}30`, margin: "0 auto 16px" }} />
            <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 14, color: "#666", lineHeight: 1.8, fontStyle: "italic", ...ed?.extraStyle }} draggable={!!ed?.updateExtraStyle} onStyleChange={ed?.updateExtraStyle} />
          </div>
        )}
        
        {/* 底部页码 */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 28, alignItems: "center" }}>
          <div style={{ width: 30, height: 1, background: `${a}30` }} />
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ 
              width: i === idx ? 8 : 4, 
              height: i === idx ? 8 : 4, 
              borderRadius: "50%",
              background: i === idx ? a : `${a}25`
            }} />
          ))}
          <div style={{ width: 30, height: 1, background: `${a}30` }} />
        </div>
      </div>
    </div>
  );
}

export function PureEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 44px", boxSizing: "border-box" }}>
      {/* 背景渐变 */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 50%, ${a}08 0%, transparent 60%)` }} />
      
      {/* 顶部细线 */}
      <div style={{ position: "absolute", top: 28, left: 40, right: 40, height: 1, background: `linear-gradient(90deg, transparent, ${a}30, transparent)` }} />
      
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* 纯净装饰图标 */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 32 }}>
          <div style={{ width: 40, height: 1, background: `${a}40`, alignSelf: "center" }} />
          <div style={{ 
            width: 80, 
            height: 80, 
            background: `linear-gradient(135deg, ${a}15, ${a}08)`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${a}15`
          }}>
            <span style={{ fontSize: 36, color: a, opacity: 0.6 }}>✦</span>
          </div>
          <div style={{ width: 40, height: 1, background: `${a}40`, alignSelf: "center" }} />
        </div>
        
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 28, fontWeight: 300, color: "#1a1a1a", marginBottom: 16, lineHeight: 1.4, letterSpacing: "2px", ...ed?.ctaStyle }} draggable={!!ed?.updateCtaStyle} onStyleChange={ed?.updateCtaStyle} />
        
        <div style={{ width: 30, height: 1, background: `${a}40`, margin: "0 auto 20px" }} />
        
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "#777", marginBottom: 32, lineHeight: 1.8, ...ed?.subStyle }} draggable={!!ed?.updateSubStyle} onStyleChange={ed?.updateSubStyle} />
        
        {/* 标签 - 纯净风格 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 28 }}>
          {s.tags.map((t, i) => (
            <span key={i} style={{ 
              fontSize: 12, 
              color: a, 
              fontWeight: 400,
              letterSpacing: "2px"
            }}>
              <EditableTag text={t} c={a} on={ed?.tag?.(i)} />
            </span>
          ))}
        </div>
        
        {/* 结束装饰 */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, alignItems: "center" }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ 
              width: i === 2 ? 6 : 3, 
              height: i === 2 ? 6 : 3, 
              borderRadius: "50%", 
              background: i === 2 ? a : `${a}30`
            }} />
          ))}
        </div>
      </div>
      
      {/* 底部细线 */}
      <div style={{ position: "absolute", bottom: 28, left: 40, right: 40, height: 1, background: `linear-gradient(90deg, transparent, ${a}30, transparent)` }} />
    </div>
  );
}