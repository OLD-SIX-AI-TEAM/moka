import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function InsCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#fafafa", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* 背景渐变装饰 */}
      <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, background: `linear-gradient(135deg, ${a}20, ${a}08)`, borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: -30, left: -30, width: 120, height: 120, background: `linear-gradient(135deg, ${a}15, ${a}05)`, borderRadius: "50%" }} />
      
      {/* Instagram 风格网格线 */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.03 }}>
        <div style={{ position: "absolute", top: "33%", left: 0, right: 0, height: 1, background: "#000" }} />
        <div style={{ position: "absolute", top: "66%", left: 0, right: 0, height: 1, background: "#000" }} />
        <div style={{ position: "absolute", left: "33%", top: 0, bottom: 0, width: 1, background: "#000" }} />
        <div style={{ position: "absolute", left: "66%", top: 0, bottom: 0, width: 1, background: "#000" }} />
      </div>
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "36px 32px", position: "relative", zIndex: 1 }}>
        {/* 顶部 Instagram 风格头像区 */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <div style={{ 
            width: 52, 
            height: 52, 
            background: `linear-gradient(135deg, ${a}, ${a}cc)`,
            borderRadius: 26,
            padding: 3
          }}>
            <div style={{ 
              width: "100%", 
              height: "100%", 
              background: "#fafafa",
              borderRadius: 23,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <span style={{ fontSize: 24 }}>{s.emoji}</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>{s.category || "INS"}</div>
            <div style={{ fontSize: 10, color: "#999" }}>Stories • {new Date().toLocaleDateString()}</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
            {[...Array(3)].map((_, i) => <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "#ccc" }} />)}
          </div>
        </div>
        
        {/* 标题区域 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 32, fontWeight: 800, color: "#1a1a1a", lineHeight: 1.2, marginBottom: 16 }} />
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }} />}
        </div>
        
        {/* 底部互动区 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 16, borderTop: "1px solid #eee" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 18 }}>❤️</span>
            <span style={{ fontSize: 12, color: "#999" }}>{Math.floor(Math.random() * 9000 + 1000)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 18 }}>💬</span>
            <span style={{ fontSize: 12, color: "#999" }}>{Math.floor(Math.random() * 500 + 100)}</span>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <span style={{ fontSize: 18 }}>🔖</span>
          </div>
        </div>
        
        {/* 页码指示器 */}
        <div style={{ display: "flex", gap: 6, marginTop: 16, justifyContent: "center" }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ 
              width: i === 0 ? 24 : 6, 
              height: 4, 
              borderRadius: 2, 
              background: i === 0 ? a : "#e0e0e0"
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function InsContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#fafafa", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* 背景网格装饰 */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.02 }}>
        <div style={{ position: "absolute", top: "25%", left: 0, right: 0, height: 1, background: "#000" }} />
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "#000" }} />
        <div style={{ position: "absolute", top: "75%", left: 0, right: 0, height: 1, background: "#000" }} />
        <div style={{ position: "absolute", left: "25%", top: 0, bottom: 0, width: 1, background: "#000" }} />
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "#000" }} />
        <div style={{ position: "absolute", left: "75%", top: 0, bottom: 0, width: 1, background: "#000" }} />
      </div>
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "28px 24px", position: "relative", zIndex: 1 }}>
        {/* 顶部状态栏 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, padding: "10px 14px", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: a, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 14, color: "#fff" }}>{idx}</span>
            </div>
            <span style={{ fontSize: 10, color: "#999", fontWeight: 600 }}>SLIDE {idx}</span>
          </div>
          <div style={{ fontSize: 10, color: a, fontWeight: 600 }}>{String(idx).padStart(2, "0")} / {String(total - 2).padStart(2, "0")}</div>
        </div>
        
        {/* 内容卡片 */}
        <div style={{ flex: 1, background: "#fff", borderRadius: 16, padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
            <div style={{ 
              minWidth: 72, 
              height: 72, 
              background: `linear-gradient(135deg, ${a}15, ${a}08)`,
              borderRadius: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <span style={{ fontSize: 28 }}>{["✨", "💫", "🌟", "⭐", "💥"][(idx - 1) % 5]}</span>
              <span style={{ fontSize: 8, color: "#999", marginTop: 2 }}>No.{idx}</span>
            </div>
            <div style={{ flex: 1, paddingTop: 4 }}>
              <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1a", lineHeight: 1.3, marginBottom: 8 }} />
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <div style={{ width: 24, height: 2, background: a, borderRadius: 1 }} />
                <span style={{ fontSize: 10, color: "#aaa" }}>Page {idx}</span>
              </div>
            </div>
          </div>
          
          <div style={{ flex: 1 }}>
            <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#555", lineHeight: 1.85 }} />
          </div>
          
          {s.extra && (
            <div style={{ 
              marginTop: 16, 
              padding: "14px 18px", 
              background: `${a}06`,
              borderRadius: 12,
              border: `1px solid ${a}15`
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 12 }}>💡</span>
                <span style={{ fontSize: 9, color: a, fontWeight: 600, letterSpacing: "1px" }}>PRO TIP</span>
              </div>
              <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }} />
            </div>
          )}
        </div>
        
        {/* 底部导航 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
          <div style={{ display: "flex", gap: 4, flex: 1, justifyContent: "center" }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{ 
                width: i === idx ? 24 : 6, 
                height: 4, 
                borderRadius: 2, 
                background: i === idx ? a : "#e0e0e0"
              }} />
            ))}
          </div>
          <span style={{ fontSize: 10, color: "#999" }}>📸</span>
        </div>
      </div>
    </div>
  );
}

export function InsEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#fafafa", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 32px", boxSizing: "border-box" }}>
      {/* 背景装饰 */}
      <div style={{ position: "absolute", top: -50, left: -50, width: 180, height: 180, background: `linear-gradient(135deg, ${a}12, ${a}05)`, borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: -40, right: -40, width: 140, height: 140, background: `linear-gradient(135deg, ${a}08, ${a}03)`, borderRadius: "50%" }} />
      
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* Instagram 风格图标组合 */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24 }}>
          <span style={{ fontSize: 24, opacity: 0.7 }}>❤️</span>
          <span style={{ fontSize: 40, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}>✨</span>
          <span style={{ fontSize: 24, opacity: 0.7 }}>💬</span>
        </div>
        
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 12, lineHeight: 1.3 }} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "#666", marginBottom: 28, lineHeight: 1.6 }} />
        
        {/* 标签 - Instagram 风格 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => (
            <span key={i} style={{ 
              padding: "6px 14px", 
              background: a,
              borderRadius: 16,
              fontSize: 11, 
              color: "#fff", 
              fontWeight: 600
            }}>
              <EditableTag text={`#${t}`} c="#fff" on={ed?.tag?.(i)} />
            </span>
          ))}
        </div>
        
        {/* 底部互动提示 */}
        <div style={{ display: "flex", justifyContent: "center", gap: 20, paddingTop: 16, borderTop: "1px solid #eee" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>❤️</div>
            <div style={{ fontSize: 9, color: "#999" }}>Like</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>💬</div>
            <div style={{ fontSize: 9, color: "#999" }}>Comment</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>📤</div>
            <div style={{ fontSize: 9, color: "#999" }}>Share</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>🔖</div>
            <div style={{ fontSize: 9, color: "#999" }}>Save</div>
          </div>
        </div>
      </div>
    </div>
  );
}