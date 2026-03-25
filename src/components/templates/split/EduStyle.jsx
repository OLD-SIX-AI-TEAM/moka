import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function EduCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#faf8f5", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* 教育风格背景 */}
      <div style={{ position: "absolute", top: 0, right: 0, width: "45%", height: "100%", background: `${a}08`, clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0 100%)" }} />
      
      {/* 装饰线条 - 书本样式 */}
      <svg style={{ position: "absolute", bottom: 0, right: 0, width: 200, height: 200, opacity: 0.06 }} viewBox="0 0 200 200">
        <path d="M100 200 L100 50 Q100 20 130 20 L200 20 L200 200" fill="none" stroke={a} strokeWidth="3" />
        <path d="M100 200 L100 50 Q100 20 70 20 L0 20 L0 200" fill="none" stroke={a} strokeWidth="3" />
        <line x1="30" y1="60" x2="70" y2="60" stroke={a} strokeWidth="1" />
        <line x1="30" y1="80" x2="70" y2="80" stroke={a} strokeWidth="1" />
        <line x1="30" y1="100" x2="60" y2="100" stroke={a} strokeWidth="1" />
        <line x1="130" y1="60" x2="170" y2="60" stroke={a} strokeWidth="1" />
        <line x1="130" y1="80" x2="170" y2="80" stroke={a} strokeWidth="1" />
        <line x1="130" y1="100" x2="160" y2="100" stroke={a} strokeWidth="1" />
      </svg>
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "36px 32px", position: "relative", zIndex: 1 }}>
        {/* 顶部教育标签 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div style={{ 
            width: 64, 
            height: 64, 
            background: `linear-gradient(135deg, ${a}, ${a}cc)`,
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 6px 16px ${a}30`
          }}>
            <span style={{ fontSize: 32 }}>📚</span>
          </div>
          <div>
            <div style={{ fontSize: 9, color: a, letterSpacing: "3px", fontWeight: 600, marginBottom: 4 }}>KNOWLEDGE HUB</div>
            <div style={{ fontSize: 10, color: "#888" }}>{s.category || "EDUCATION"}</div>
          </div>
        </div>
        
        {/* 标题区域 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 32, fontWeight: 800, color: "#2c3e50", lineHeight: 1.2, marginBottom: 20 }} draggable={!!ed?.updateTitleStyle} onStyleChange={ed?.updateTitleStyle} />
          <div style={{ width: 60, height: 3, background: a, marginBottom: 20 }} />
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 14, color: "#5a6a7a", lineHeight: 1.8 }} draggable={!!ed?.updateSubtitleStyle} onStyleChange={ed?.updateSubtitleStyle} />}
        </div>
        
        {/* 底部页码 - 学术风格 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: `1px solid ${a}20` }}>
          <span style={{ fontSize: 10, color: a, letterSpacing: "2px", fontWeight: 600 }}>COURSE</span>
          <div style={{ flex: 1, height: 1, background: `${a}15` }} />
          <div style={{ display: "flex", gap: 8 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{ 
                width: i === 0 ? 28 : 8, 
                height: 6, 
                borderRadius: 3, 
                background: i === 0 ? a : `${a}20`
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function EduContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#faf8f5", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* 背景装饰 */}
      <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: `${a}05`, borderRadius: "50%" }} />
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "28px 24px", position: "relative", zIndex: 1 }}>
        {/* 章节标题 - 学术卡片式 */}
        <div style={{ 
          display: "flex", 
          gap: 16, 
          marginBottom: 20, 
          padding: "20px", 
          background: "#fff", 
          borderRadius: 12,
          border: `1px solid ${a}15`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
        }}>
          <div style={{ 
            minWidth: 60, 
            height: 60, 
            background: a,
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>{idx}</div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 9, color: a, letterSpacing: "2px", fontWeight: 600, marginBottom: 4 }}>LESSON {String(idx).padStart(2, "0")}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 2, background: `${a}12`, borderRadius: 1 }} />
              <span style={{ fontSize: 10, color: "#aaa" }}>Page {idx}</span>
            </div>
          </div>
        </div>
        
        {/* 标题 */}
        <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 20, fontWeight: 700, color: "#2c3e50", lineHeight: 1.35, marginBottom: 16 }} draggable={!!ed?.updateHeadingStyle} onStyleChange={ed?.updateHeadingStyle} />
        
        {/* 正文区域 - 带书签装饰 */}
        <div style={{ flex: 1, position: "relative", paddingLeft: 16 }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(180deg, ${a}, ${a}30, transparent)`, borderRadius: 2 }} />
          <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#555", lineHeight: 1.9 }} draggable={!!ed?.updateTextStyle} onStyleChange={ed?.updateTextStyle} />
        </div>
        
        {s.extra && (
          <div style={{ 
            marginTop: 16, 
            padding: "18px 20px", 
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
            border: `1px solid ${a}15`
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 16 }}>💡</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: a, letterSpacing: "1px" }}>KEY POINT</span>
            </div>
            <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }} draggable={!!ed?.updateExtraStyle} onStyleChange={ed?.updateExtraStyle} />
          </div>
        )}
        
        {/* 底部导航 */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20, paddingTop: 12, borderTop: `1px solid ${a}15` }}>
          <span style={{ fontSize: 10, color: a, letterSpacing: "1px", fontWeight: 600 }}>PROGRESS</span>
          <div style={{ display: "flex", gap: 6, flex: 1, justifyContent: "flex-end" }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{ 
                width: i === idx ? 28 : 8, 
                height: 6, 
                borderRadius: 3, 
                background: i === idx ? a : `${a}20`
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function EduEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#faf8f5", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 32px", boxSizing: "border-box" }}>
      {/* 背景装饰 */}
      <svg style={{ position: "absolute", bottom: 0, left: 0, width: 150, height: 150, opacity: 0.05 }} viewBox="0 0 150 150">
        <path d="M75 150 L75 30 Q75 10 100 10 L150 10 L150 150" fill="none" stroke={a} strokeWidth="3" />
        <path d="M75 150 L75 30 Q75 10 50 10 L0 10 L0 150" fill="none" stroke={a} strokeWidth="3" />
      </svg>
      
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* 学位帽装饰 */}
        <div style={{ 
          width: 100, 
          height: 100, 
          background: `linear-gradient(135deg, ${a}, ${a}cc)`,
          borderRadius: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 28px",
          boxShadow: `0 8px 24px ${a}30`
        }}>
          <span style={{ fontSize: 48 }}>🎓</span>
        </div>
        
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 26, fontWeight: 800, color: "#2c3e50", marginBottom: 12, lineHeight: 1.3 }} draggable={!!ed?.updateCtaStyle} onStyleChange={ed?.updateCtaStyle} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "#5a6a7a", marginBottom: 28, lineHeight: 1.6 }} draggable={!!ed?.updateSubStyle} onStyleChange={ed?.updateSubStyle} />
        
        {/* 标签 - 学术风格 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 28 }}>
          {s.tags.map((t, i) => (
            <span key={i} style={{ 
              padding: "8px 16px", 
              background: "#fff",
              borderRadius: 8,
              fontSize: 12, 
              color: a, 
              fontWeight: 600,
              border: `1px solid ${a}25`,
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
            }}>
              <EditableTag text={t} c={a} on={ed?.tag?.(i)} />
            </span>
          ))}
        </div>
        
        {/* 结束装饰 - 学术风格 */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 1, background: `${a}30` }} />
          <span style={{ fontSize: 10, color: a, letterSpacing: "2px", fontWeight: 600 }}>LEARN • GROW • SUCCEED</span>
          <div style={{ width: 40, height: 1, background: `${a}30` }} />
        </div>
      </div>
    </div>
  );
}
