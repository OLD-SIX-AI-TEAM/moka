import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function CreamyCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#fffbf5", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* 柔和的圆形装饰 - 奶油质感 */}
      <div style={{ position: "absolute", top: -80, right: -80, width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle, ${a}18, ${a}08)` }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${a}12, ${a}05)` }} />
      <div style={{ position: "absolute", top: "40%", left: -30, width: 100, height: 100, borderRadius: "50%", background: `${a}08` }} />
      
      {/* 顶部装饰线 - 波浪形 */}
      <div style={{ position: "absolute", top: 28, left: 32, right: 32, height: 20, overflow: "hidden" }}>
        <svg width="100%" height="20" viewBox="0 0 400 20" preserveAspectRatio="none">
          <path d="M0,10 Q50,0 100,10 T200,10 T300,10 T400,10" fill="none" stroke={a} strokeWidth="2" opacity="0.4" />
        </svg>
      </div>
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "56px 40px 40px", position: "relative", zIndex: 1 }}>
        {/* 分类标签 - 圆角胶囊形 */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, padding: "8px 20px", background: `${a}12`, borderRadius: 20, alignSelf: "flex-start" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: a }} />
          <span style={{ fontSize: 10, color: a, letterSpacing: "2px", fontWeight: 600 }}>{s.category?.toUpperCase?.() || "CREAMY"}</span>
        </div>
        
        {/* 大号装饰 emoji */}
        <div style={{ fontSize: 72, marginBottom: 24, filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.08))", transform: "rotate(-5deg)" }}>{s.emoji}</div>
        
        {/* 标题 */}
        <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 36, fontWeight: 800, color: "#2d2520", lineHeight: 1.2, marginBottom: 16, letterSpacing: "-0.5px" }} />
        {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 15, color: "#6b5b4f", lineHeight: 1.8 }} />}
        
        {/* 底部装饰 - 奶油滴落效果 */}
        <div style={{ marginTop: "auto", display: "flex", alignItems: "flex-end", gap: 16 }}>
          {[40, 60, 30, 50, 35].map((h, i) => (
            <div key={i} style={{ flex: 1, height: h, background: `linear-gradient(180deg, ${a}${i === 1 ? '30' : '15'}, ${a}08)`, borderRadius: "0 0 20px 20px" }} />
          ))}
        </div>
        
        {/* 页码指示器 - 圆点式 */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 20 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ 
              width: i === 0 ? 28 : 8, 
              height: 8, 
              borderRadius: 4, 
              background: i === 0 ? a : `${a}30`,
              transition: "all 0.3s"
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CreamyContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#fffbf5", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* 背景装饰圆形 */}
      <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: `${a}08` }} />
      <div style={{ position: "absolute", bottom: "30%", left: -20, width: 80, height: 80, borderRadius: "50%", background: `${a}06` }} />
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 28px", position: "relative", zIndex: 1 }}>
        {/* 章节标题区域 - 卡片式布局 */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24, padding: "16px 20px", background: "#fff", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
          <div style={{ width: 60, height: 60, background: `linear-gradient(135deg, ${a}, ${a}cc)`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 12px ${a}40` }}>
            <div style={{ fontSize: 24, fontWeight: 300, color: "#fff" }}>{String.fromCharCode(8544 + idx - 1)}</div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 9, color: a, letterSpacing: "2px", fontWeight: 600, marginBottom: 4 }}>CHAPTER</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10, color: "#999" }}>{String(idx).padStart(2, "0")} / {String(total - 2).padStart(2, "0")}</span>
              <div style={{ flex: 1, height: 2, background: `${a}20`, borderRadius: 1 }} />
            </div>
          </div>
        </div>
        
        <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 24, fontWeight: 800, color: "#2d2520", lineHeight: 1.3, marginBottom: 16 }} />
        
        {/* 正文区域 - 带左侧装饰 */}
        <div style={{ flex: 1, position: "relative", paddingLeft: 16 }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(180deg, ${a}, ${a}30, transparent)`, borderRadius: 2 }} />
          <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 15, color: "#5a4f45", lineHeight: 1.9 }} />
        </div>
        
        {s.extra && (
          <div style={{ marginTop: 20, padding: "20px 24px", background: "#fff", borderRadius: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.04)", border: `1px solid ${a}15` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 16 }}>💭</span>
              <span style={{ fontSize: 10, color: a, letterSpacing: "1px", fontWeight: 600 }}>TIPS</span>
            </div>
            <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 14, color: "#6b5b4f", lineHeight: 1.7 }} />
          </div>
        )}
        
        {/* 底部页码指示器 */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 24 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ 
              width: i === idx ? 28 : 8, 
              height: 8, 
              borderRadius: 4, 
              background: i === idx ? a : `${a}30`
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CreamyEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#fffbf5", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 40px", boxSizing: "border-box" }}>
      {/* 背景装饰 */}
      <div style={{ position: "absolute", top: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${a}15, ${a}05)` }} />
      <div style={{ position: "absolute", bottom: -40, right: -40, width: 160, height: "50%", borderRadius: "50%", background: `${a}08` }} />
      
      {/* 波浪装饰线 */}
      <div style={{ position: "absolute", bottom: 32, left: 32, right: 32, height: 20, overflow: "hidden" }}>
        <svg width="100%" height="20" viewBox="0 0 400 20" preserveAspectRatio="none">
          <path d="M0,10 Q50,0 100,10 T200,10 T300,10 T400,10" fill="none" stroke={a} strokeWidth="2" opacity="0.3" />
        </svg>
      </div>
      
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* 装饰图标组合 */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 28 }}>
          <span style={{ fontSize: 28, opacity: 0.5, transform: "rotate(-15deg)" }}>✧</span>
          <span style={{ fontSize: 48, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }}>💫</span>
          <span style={{ fontSize: 28, opacity: 0.5, transform: "rotate(15deg)" }}>✧</span>
        </div>
        
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 28, fontWeight: 800, color: "#2d2520", marginBottom: 12, lineHeight: 1.3 }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "#6b5b4f", marginBottom: 32, lineHeight: 1.6 }} />
        
        {/* 标签 - 奶油色胶囊形 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 28 }}>
          {s.tags.map((t, i) => (
            <span key={i} style={{ 
              padding: "10px 20px", 
              background: `linear-gradient(135deg, ${a}15, ${a}08)`, 
              borderRadius: 24, 
              fontSize: 13, 
              color: a, 
              fontWeight: 600,
              border: `1px solid ${a}20`
            }}>
              <EditableTag text={t} c={a} on={ed?.tag?.(i)} />
            </span>
          ))}
        </div>
        
        {/* 结束装饰 */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 2, background: `${a}30`, borderRadius: 1 }} />
          <span style={{ fontSize: 10, color: `${a}80`, letterSpacing: "3px" }}>FIN</span>
          <div style={{ width: 40, height: 2, background: `${a}30`, borderRadius: 1 }} />
        </div>
      </div>
    </div>
  );
}