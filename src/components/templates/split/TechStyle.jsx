import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function TechCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#0a0a0f", width: "100%", aspectRatio: "3/4", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* 背景网格 */}
      <div style={{ position: "absolute", inset: 0, background: `
        linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)
      `, backgroundSize: "20px 20px" }} />
      
      {/* 扫描线效果 */}
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)", pointerEvents: "none" }} />
      
      {/* 终端窗口 */}
      <div style={{ position: "absolute", top: "8%", left: "5%", right: "5%", bottom: "8%", border: `1px solid ${a}40`, background: "rgba(10,10,15,0.8)", borderRadius: 8, overflow: "hidden" }}>
        {/* 窗口标题栏 */}
        <div style={{ height: 32, background: "#1a1a2e", borderBottom: `1px solid ${a}30`, display: "flex", alignItems: "center", padding: "0 12px", gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27ca40" }} />
          <div style={{ flex: 1, textAlign: "center", fontSize: 11, color: "#666" }}>root@system:~/{s.category}</div>
        </div>
        
        {/* 终端内容 */}
        <div style={{ padding: "24px", height: "calc(100% - 32px)", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 10, color: "#00ff88", marginBottom: 16 }}>
            <span style={{ color: "#666" }}>$</span> ./init_system.sh --category={s.category} --mode=production
          </div>
          
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 10, color: "#666", marginBottom: 12 }}>[SYSTEM] Initializing module...</div>
            <div style={{ fontSize: 10, color: a, marginBottom: 8 }}>{`> LOADING_TITLE_MODULE`}</div>
            
            <EditableText v={s.title} on={ed?.title} block dk style={{ fontSize: 32, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 20, textShadow: `0 0 20px ${a}50`, ...ed?.titleStyle }} draggable={!!ed?.updateTitleStyle} onStyleChange={ed?.updateTitleStyle} />
            
            {s.subtitle && (
              <>
                <div style={{ fontSize: 10, color: "#666", marginBottom: 8 }}>{`> LOADING_SUBTITLE_MODULE`}</div>
                <EditableText v={s.subtitle} on={ed?.subtitle} block dk style={{ fontSize: 14, color: "#00ff88", lineHeight: 1.6, borderLeft: `2px solid ${a}`, paddingLeft: 12, ...ed?.subtitleStyle }} draggable={!!ed?.updateSubtitleStyle} onStyleChange={ed?.updateSubtitleStyle} />
              </>
            )}
          </div>
          
          {/* 进度条 */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 10, color: "#666" }}>PROGRESS:</span>
              <div style={{ flex: 1, height: 4, background: "#1a1a2e", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: "100%", height: "100%", background: `linear-gradient(90deg, ${a}, #00ff88)`, animation: "pulse 2s infinite" }} />
              </div>
              <span style={{ fontSize: 10, color: a }}>100%</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {Array.from({ length: total }).map((_, i) => (
                <div key={i} style={{ 
                  width: i === 0 ? 32 : 8, 
                  height: 6, 
                  background: i === 0 ? a : "#333",
                  borderRadius: 1,
                  boxShadow: i === 0 ? `0 0 8px ${a}` : "none"
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 角落装饰 */}
      <div style={{ position: "absolute", top: 16, right: 16, fontSize: 10, color: "#333" }}>◈ SYS.001</div>
      <div style={{ position: "absolute", bottom: 16, left: 16, fontSize: 10, color: "#333" }}>v2.0.4</div>
    </div>
  );
}

export function TechContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#0d0d12", width: "100%", aspectRatio: "3/4", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* 背景代码雨效果 */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, fontSize: 10, color: "#00ff88", overflow: "hidden", whiteSpace: "pre", lineHeight: 1.2 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i}>{Array.from({ length: 30 }).map((_, j) => String.fromCharCode(0x30A0 + ((i * 30 + j) * 7) % 96)).join('')}</div>
        ))}
      </div>
      
      {/* 主内容区 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "28px 24px", position: "relative", zIndex: 1 }}>
        {/* 顶部状态栏 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, padding: "10px 14px", background: "rgba(26,26,46,0.8)", border: `1px solid ${a}30`, borderRadius: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 8px #00ff88", animation: "pulse 1.5s infinite" }} />
            <span style={{ fontSize: 10, color: "#666" }}>NODE_{String(idx).padStart(2, "0")}</span>
          </div>
          <div style={{ fontSize: 10, color: a }}>STATUS: ACTIVE</div>
          <div style={{ fontSize: 10, color: "#666" }}>MEM: {(idx * 7 % 30 + 40).toFixed(1)}%</div>
        </div>
        
        {/* 内容卡片 */}
        <div style={{ flex: 1, background: "rgba(26,26,46,0.6)", border: `1px solid ${a}25`, borderRadius: 8, padding: "20px", display: "flex", flexDirection: "column" }}>
          {/* 标题区 */}
          <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: `1px dashed ${a}30` }}>
            <div style={{ fontSize: 9, color: "#666", marginBottom: 8 }}>{`> cat section_${idx}.md`}</div>
            <EditableText v={s.heading} on={ed?.heading} block dk style={{ fontSize: 20, fontWeight: 600, color: "#fff", lineHeight: 1.3, ...ed?.headingStyle }} draggable={!!ed?.updateHeadingStyle} onStyleChange={ed?.updateHeadingStyle} />
          </div>
          
          {/* 内容区 */}
          <div style={{ flex: 1, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(180deg, ${a}, transparent)` }} />
            <div style={{ paddingLeft: 16 }}>
              <EditableText v={s.text} on={ed?.text} block dk style={{ fontSize: 13, color: "#e0e0e0", lineHeight: 1.9, ...ed?.textStyle }} draggable={!!ed?.updateTextStyle} onStyleChange={ed?.updateTextStyle} />
            </div>
          </div>
          
          {/* 额外信息 */}
          {s.extra && (
            <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(255,0,128,0.08)", border: "1px solid rgba(255,0,128,0.3)", borderRadius: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 12 }}>⚠️</span>
                <span style={{ fontSize: 9, color: "#ff0080", fontWeight: 600 }}>ALERT://DATA_INJECT</span>
              </div>
              <EditableText v={s.extra} on={ed?.extra} dk style={{ fontSize: 12, color: "#ff6699", lineHeight: 1.6, ...ed?.extraStyle }} draggable={!!ed?.updateExtraStyle} onStyleChange={ed?.updateExtraStyle} />
            </div>
          )}
        </div>
        
        {/* 底部导航 */}
        <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(26,26,46,0.8)", borderRadius: 6, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 10, color: "#666" }}>NAV:</span>
          <div style={{ flex: 1, display: "flex", gap: 6 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{ 
                flex: i === idx ? 2 : 1, 
                height: 6, 
                background: i === idx ? `linear-gradient(90deg, ${a}, #00ff88)` : "#333",
                borderRadius: 1,
                boxShadow: i === idx ? `0 0 10px ${a}` : "none"
              }} />
            ))}
          </div>
          <span style={{ fontSize: 10, color: a }}>{String(Math.round((idx / total) * 100)).padStart(3, "0")}%</span>
        </div>
      </div>
    </div>
  );
}

export function TechEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#0a0a0f", width: "100%", aspectRatio: "3/4", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 32px", boxSizing: "border-box" }}>
      {/* 背景光环 */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 300, height: 300, border: `1px solid ${a}20`, borderRadius: "50%" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, height: 400, border: `1px solid ${a}10`, borderRadius: "50%" }} />
      
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        {/* 成功图标 */}
        <div style={{ fontSize: 64, marginBottom: 24, filter: `drop-shadow(0 0 30px ${a})` }}>⬡</div>
        
        <div style={{ fontSize: 10, color: "#00ff88", marginBottom: 16, letterSpacing: 2 }}>{`> EXECUTE_COMPLETE`}</div>
        
        <EditableText v={s.cta} on={ed?.cta} block dk style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 16, textShadow: `0 0 20px ${a}50`, ...ed?.ctaStyle }} draggable={!!ed?.updateCtaStyle} onStyleChange={ed?.updateCtaStyle} />
        
        <EditableText v={s.sub} on={ed?.sub} block dk style={{ fontSize: 14, color: "#888", marginBottom: 32, ...ed?.subStyle }} draggable={!!ed?.updateSubStyle} onStyleChange={ed?.updateSubStyle} />
        
        {/* 标签 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 32 }}>
          {s.tags.map((t, i) => (
            <span key={i} style={{ 
              padding: "6px 14px", 
              border: `1px solid ${a}50`, 
              background: "rgba(10,10,15,0.8)",
              fontSize: 11, 
              color: a,
              borderRadius: 4,
              fontFamily: "monospace"
            }}>
              <EditableTag text={`#${t}`} c={a} on={ed?.tag?.(i)} />
            </span>
          ))}
        </div>
        
        <div style={{ fontSize: 10, color: "#333" }}>// SYSTEM_SHUTDOWN_COMPLETE</div>
      </div>
    </div>
  );
}
