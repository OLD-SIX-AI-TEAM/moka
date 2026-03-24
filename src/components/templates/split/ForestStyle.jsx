import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function ForestCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#f0f9f4", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* 自然纹理背景 */}
      <div style={{ position: "absolute", top: 0, right: 0, width: "55%", height: "100%", background: `linear-gradient(180deg, ${a}15 0%, ${a}08 50%, transparent 100%)`, clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)" }} />
      
      {/* SVG 植物装饰 */}
      <svg style={{ position: "absolute", top: 0, right: 0, width: 200, height: 300, opacity: 0.12 }} viewBox="0 0 200 300">
        <path d="M160 0 Q180 40 160 80 Q140 120 160 160 Q180 200 160 240 Q140 280 160 300" fill="none" stroke={a} strokeWidth="4" />
        <ellipse cx="150" cy="50" rx="25" ry="15" fill={a} transform="rotate(-20 150 50)" />
        <ellipse cx="170" cy="100" rx="20" ry="12" fill={a} transform="rotate(15 170 100)" />
        <ellipse cx="145" cy="150" rx="28" ry="14" fill={a} transform="rotate(-10 145 150)" />
        <ellipse cx="165" cy="210" rx="22" ry="13" fill={a} transform="rotate(20 165 210)" />
        <circle cx="180" cy="70" r="8" fill={a} />
        <circle cx="140" cy="180" r="6" fill={a} />
      </svg>
      
      {/* 左侧叶脉装饰 */}
      <svg style={{ position: "absolute", bottom: 0, left: 0, width: 120, height: 200, opacity: 0.08 }} viewBox="0 0 120 200">
        <path d="M0 200 Q30 150 20 100 Q10 50 40 0" fill="none" stroke={a} strokeWidth="3" />
        <path d="M20 180 Q40 160 30 140" fill="none" stroke={a} strokeWidth="2" />
        <path d="M15 130 Q35 110 25 90" fill="none" stroke={a} strokeWidth="2" />
        <path d="M25 80 Q45 60 35 40" fill="none" stroke={a} strokeWidth="2" />
      </svg>
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "36px 32px", position: "relative", zIndex: 1 }}>
        {/* 顶部标签 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ display: "flex", gap: -8 }}>
            <span style={{ fontSize: 28, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}>🌿</span>
            <span style={{ fontSize: 24, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))", marginLeft: -8 }}>🌱</span>
          </div>
          <div style={{ padding: "6px 16px", background: `${a}15`, borderRadius: 12 }}>
            <span style={{ fontSize: 9, color: a, letterSpacing: "3px", fontWeight: 600 }}>{s.category?.toUpperCase?.() || "FOREST"}</span>
          </div>
        </div>
        
        {/* 大号装饰 emoji */}
        <div style={{ fontSize: 72, marginBottom: 20, filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.1))" }}>{s.emoji}</div>
        
        {/* 标题 */}
        <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 32, fontWeight: 800, color: "#1a3d2e", lineHeight: 1.2, marginBottom: 16 }} />
        {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 14, color: "#4a6b5a", lineHeight: 1.7 }} />}
        
        {/* 底部装饰 - 树叶排列 */}
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 8, paddingTop: 20 }}>
          <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${a}40, ${a}10)` }} />
          <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{ 
                width: i === 0 ? 32 : 10, 
                height: 10, 
                borderRadius: i === 0 ? 5 : "50%",
                background: i === 0 ? a : `${a}30`
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ForestContent({ s, a, idx, total, ed }) {
  const leaves = ["🍃", "🌱", "🌿", "🍀", "🌾"];
  return (
    <div style={{ background: "#f0f9f4", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* 背景装饰 */}
      <svg style={{ position: "absolute", top: 0, right: 0, width: 100, height: 150, opacity: 0.06 }} viewBox="0 0 100 150">
        <path d="M80 0 Q100 30 80 60 Q60 90 80 120 Q100 150 80 150" fill="none" stroke={a} strokeWidth="3" />
        <ellipse cx="75" cy="30" rx="15" ry="10" fill={a} transform="rotate(-15 75 30)" />
        <ellipse cx="85" cy="80" rx="12" ry="8" fill={a} transform="rotate(10 85 80)" />
      </svg>
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "28px 24px", position: "relative", zIndex: 1 }}>
        {/* 章节标题 - 自然卡片式 */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          <div style={{ 
            width: 64, 
            height: 64, 
            background: `linear-gradient(135deg, ${a}, ${a}cc)`,
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 6px 16px ${a}30`
          }}>
            <span style={{ fontSize: 32, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}>{leaves[(idx - 1) % 5]}</span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 9, color: a, letterSpacing: "2px", fontWeight: 600, marginBottom: 4 }}>GROWTH</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10, color: "#888" }}>DAY {idx}</span>
              <div style={{ flex: 1, height: 2, background: `${a}15`, borderRadius: 1 }} />
            </div>
          </div>
        </div>
        
        <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 22, fontWeight: 800, color: "#1a3d2e", lineHeight: 1.3, marginBottom: 16 }} />
        
        {/* 正文区域 - 带自然边框 */}
        <div style={{ flex: 1, padding: "16px", background: "#fff", borderRadius: 16, border: `1px solid ${a}15` }}>
          <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#4a6b5a", lineHeight: 1.85 }} />
        </div>
        
        {s.extra && (
          <div style={{ 
            marginTop: 16, 
            padding: "16px 20px", 
            background: "#fff", 
            borderRadius: 16, 
            boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
            border: `1px solid ${a}10`
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 14 }}>🌸</span>
              <span style={{ fontSize: 10, color: a, fontWeight: 600, letterSpacing: "1px" }}>NATURE NOTE</span>
            </div>
            <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 13, color: "#5a7b6a", lineHeight: 1.7 }} />
          </div>
        )}
        
        {/* 底部导航 */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20 }}>
          <span style={{ fontSize: 14, color: a, opacity: 0.6 }}>🌿</span>
          <div style={{ display: "flex", gap: 6, flex: 1, justifyContent: "flex-end" }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{ 
                width: i === idx ? 28 : 8, 
                height: 6, 
                borderRadius: 3, 
                background: i === idx ? a : `${a}25`
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ForestEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#f0f9f4", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 32px", boxSizing: "border-box" }}>
      {/* 背景自然装饰 */}
      <svg style={{ position: "absolute", top: 0, left: 0, width: 150, height: 250, opacity: 0.08 }} viewBox="0 0 150 250">
        <path d="M0 250 Q40 200 30 150 Q20 100 50 50 Q80 0 60 0" fill="none" stroke={a} strokeWidth="4" />
        <ellipse cx="30" cy="60" rx="20" ry="12" fill={a} transform="rotate(-20 30 60)" />
        <ellipse cx="45" cy="120" rx="18" ry="10" fill={a} transform="rotate(15 45 120)" />
        <ellipse cx="25" cy="180" rx="22" ry="12" fill={a} transform="rotate(-10 25 180)" />
      </svg>
      
      <svg style={{ position: "absolute", bottom: 0, right: 0, width: 120, height: 200, opacity: 0.06 }} viewBox="0 0 120 200">
        <path d="M120 200 Q80 150 90 100 Q100 50 70 0" fill="none" stroke={a} strokeWidth="3" />
        <ellipse cx="95" cy="50" rx="15" ry="10" fill={a} transform="rotate(20 95 50)" />
        <ellipse cx="85" cy="110" rx="12" ry="8" fill={a} transform="rotate(-15 85 110)" />
      </svg>
      
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* 自然装饰组合 */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 24 }}>
          <span style={{ fontSize: 24, transform: "rotate(-15deg)" }}>🌸</span>
          <span style={{ fontSize: 20, transform: "rotate(5deg)" }}>🌼</span>
          <span style={{ fontSize: 48, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }}>🌿</span>
          <span style={{ fontSize: 20, transform: "rotate(-5deg)" }}>🌼</span>
          <span style={{ fontSize: 24, transform: "rotate(15deg)" }}>🌸</span>
        </div>
        
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 26, fontWeight: 800, color: "#1a3d2e", marginBottom: 12, lineHeight: 1.3 }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "#4a6b5a", marginBottom: 28, lineHeight: 1.6 }} />
        
        {/* 标签 - 自然风格 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => (
            <span key={i} style={{ 
              padding: "8px 18px", 
              background: `${a}12`,
              borderRadius: 16,
              fontSize: 12, 
              color: a, 
              fontWeight: 600,
              border: `1px solid ${a}20`
            }}>
              <EditableTag text={`#${t}`} c={a} on={ed?.tag?.(i)} />
            </span>
          ))}
        </div>
        
        {/* 结束装饰 - 自然排列 */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
          <div style={{ width: 30, height: 2, background: `${a}30`, borderRadius: 1 }} />
          <span style={{ fontSize: 12, color: a, opacity: 0.6 }}>🌱</span>
          <div style={{ width: 30, height: 2, background: `${a}30`, borderRadius: 1 }} />
        </div>
      </div>
    </div>
  );
}