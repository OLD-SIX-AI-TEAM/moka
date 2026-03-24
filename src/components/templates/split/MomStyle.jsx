import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function MomCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#fff5f7", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* 可爱装饰形状 */}
      <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, background: `${a}12`, borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: -30, left: -30, width: 120, height: 120, background: `${a}08`, borderRadius: "50%" }} />
      <div style={{ position: "absolute", top: "40%", right: -20, width: 80, height: 80, background: `${a}06`, borderRadius: "50%" }} />
      
      {/* 散落的星星装饰 */}
      <div style={{ position: "absolute", top: "15%", left: "10%", fontSize: 16, opacity: 0.3, transform: "rotate(-10deg)" }}>⭐</div>
      <div style={{ position: "absolute", top: "25%", right: "20%", fontSize: 12, opacity: 0.2, transform: "rotate(15deg)" }}>✨</div>
      <div style={{ position: "absolute", bottom: "30%", left: "15%", fontSize: 14, opacity: 0.25, transform: "rotate(5deg)" }}>💫</div>
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "36px 32px", position: "relative", zIndex: 1 }}>
        {/* 可爱标签区 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ 
            width: 56, 
            height: 56, 
            background: `linear-gradient(135deg, ${a}, ${a}cc)`,
            borderRadius: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 6px 20px ${a}40`
          }}>
            <span style={{ fontSize: 28 }}>🤱</span>
          </div>
          <div style={{ 
            padding: "8px 16px", 
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)"
          }}>
            <span style={{ fontSize: 11, color: a, fontWeight: 700, letterSpacing: "1px" }}>{s.category || "MOM"}</span>
          </div>
        </div>
        
        {/* 主要内容区 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 72, marginBottom: 20, filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.1))" }}>{s.emoji}</div>
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 32, fontWeight: 800, color: "#5d4e6d", lineHeight: 1.2, marginBottom: 16 }} />
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 14, color: "#7a6b8a", lineHeight: 1.8 }} />}
        </div>
        
        {/* 底部页码 - 心形装饰 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 16, color: a }}>💕</span>
          <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${a}30, ${a}10)` }} />
          <div style={{ display: "flex", gap: 8 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{ 
                width: i === 0 ? 28 : 8, 
                height: 8, 
                borderRadius: 4, 
                background: i === 0 ? a : `${a}25`
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MomContent({ s, a, idx, total, ed }) {
  const cuteEmojis = ["🧸", "🎀", "🌸", "⭐", "💖"];
  return (
    <div style={{ background: "#fff5f7", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* 背景装饰 */}
      <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: `${a}06`, borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: "40%", left: -30, width: 80, height: 80, background: `${a}04`, borderRadius: "50%" }} />
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "28px 24px", position: "relative", zIndex: 1 }}>
        {/* 章节标题 - 可爱卡片式 */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20, padding: "16px", background: "#fff", borderRadius: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}>
          <div style={{ 
            width: 64, 
            height: 64, 
            background: `linear-gradient(135deg, ${a}20, ${a}10)`,
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span style={{ fontSize: 32 }}>{cuteEmojis[(idx - 1) % 5]}</span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 9, color: a, letterSpacing: "2px", fontWeight: 600, marginBottom: 4 }}>CHAPTER {idx}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10, color: "#aaa" }}>Mom's Guide</span>
              <div style={{ flex: 1, height: 2, background: `${a}12`, borderRadius: 1 }} />
            </div>
          </div>
        </div>
        
        <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 22, fontWeight: 800, color: "#5d4e6d", lineHeight: 1.3, marginBottom: 16 }} />
        
        {/* 正文区域 */}
        <div style={{ flex: 1, padding: "16px", background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
          <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#6b5b7a", lineHeight: 1.85 }} />
        </div>
        
        {s.extra && (
          <div style={{ 
            marginTop: 16, 
            padding: "16px 20px", 
            background: "#e8f4f8", 
            borderRadius: 16,
            border: "1px solid #d0e8f0"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>💡</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#4a7c8a", letterSpacing: "1px" }}>MOM'S TIP</span>
            </div>
            <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 13, color: "#5a6c7a", lineHeight: 1.7 }} />
          </div>
        )}
        
        {/* 底部导航 */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20 }}>
          <span style={{ fontSize: 14, color: a, opacity: 0.6 }}>💕</span>
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

export function MomEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#fff5f7", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 32px", boxSizing: "border-box" }}>
      {/* 背景装饰 */}
      <div style={{ position: "absolute", top: -50, left: -50, width: 180, height: 180, background: `${a}10`, borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: -40, right: -40, width: 140, height: 140, background: `${a}08`, borderRadius: "50%" }} />
      
      {/* 散落的心形装饰 */}
      <div style={{ position: "absolute", top: "10%", left: "10%", fontSize: 20, opacity: 0.15, transform: "rotate(-15deg)" }}>💕</div>
      <div style={{ position: "absolute", top: "20%", right: "15%", fontSize: 16, opacity: 0.12, transform: "rotate(10deg)" }}>💖</div>
      <div style={{ position: "absolute", bottom: "15%", left: "20%", fontSize: 18, opacity: 0.1, transform: "rotate(5deg)" }}>💕</div>
      
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* 可爱图标组合 */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 24 }}>
          <span style={{ fontSize: 24, transform: "rotate(-10deg)" }}>🧸</span>
          <span style={{ fontSize: 48, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }}>💕</span>
          <span style={{ fontSize: 24, transform: "rotate(10deg)" }}>🎀</span>
        </div>
        
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 26, fontWeight: 800, color: "#5d4e6d", marginBottom: 12, lineHeight: 1.3 }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "#7a6b8a", marginBottom: 28, lineHeight: 1.6 }} />
        
        {/* 标签 - 可爱风格 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => (
            <span key={i} style={{ 
              padding: "8px 16px", 
              background: i % 2 === 0 ? "#fff" : `${a}10`,
              borderRadius: 20,
              fontSize: 12, 
              color: a, 
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
            }}>
              <EditableTag text={`#${t}`} c={a} on={ed?.tag?.(i)} />
            </span>
          ))}
        </div>
        
        {/* 底部心形排列 */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 16, opacity: 0.4 }}>💕</span>
          <span style={{ fontSize: 20, opacity: 0.6 }}>👶</span>
          <span style={{ fontSize: 16, opacity: 0.4 }}>💕</span>
        </div>
      </div>
    </div>
  );
}