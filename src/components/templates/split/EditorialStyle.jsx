import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function EditorialCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: "'Helvetica Neue', Arial, sans-serif", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* 杂志风格顶部 */}
      <div style={{ background: "#000", padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "8px" }}>VOGUE</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "2px" }}>{new Date().getFullYear()}</div>
      </div>
      
      {/* 分类导航 */}
      <div style={{ padding: "12px 28px", borderBottom: "1px solid #eee", display: "flex", gap: 24, overflow: "hidden" }}>
        {["FASHION", "BEAUTY", "CULTURE", "LIVING", "RUNWAY"].map((item, i) => (
          <span key={i} style={{ fontSize: 10, color: i === 2 ? a : "#999", letterSpacing: "2px", fontWeight: i === 2 ? 700 : 400 }}>{item}</span>
        ))}
      </div>
      
      {/* 主内容 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "36px 28px" }}>
        {/* 大标题样式 */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, color: a, letterSpacing: "3px", marginBottom: 12, fontWeight: 700 }}>FEATURE STORY</div>
          <EditableText v={s.title} on={ed?.title} block style={{ fontSize: 44, fontWeight: 800, color: "#000", lineHeight: 1, letterSpacing: "-1px", textTransform: "uppercase" }} />
        </div>
        
        {/* 副标题区域 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          {s.subtitle && (
            <div style={{ borderLeft: `4px solid ${a}`, paddingLeft: 20, marginBottom: 24 }}>
              <EditableText v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 16, color: "#333", lineHeight: 1.6 }} />
            </div>
          )}
          
          {/* 作者信息 */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 20, borderTop: "1px solid #eee" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f0f0f0" }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#000" }}>By Editorial Team</div>
              <div style={{ fontSize: 10, color: "#999" }}>Fashion Editor</div>
            </div>
          </div>
        </div>
        
        {/* 页码 */}
        <div style={{ display: "flex", gap: 6, marginTop: 20 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ width: i === 0 ? 32 : 8, height: 3, background: i === 0 ? "#000" : "#ddd" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function EditorialContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: "'Helvetica Neue', Arial, sans-serif", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* 页面头部 */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #000", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: "#000", letterSpacing: "4px" }}>VOGUE</div>
        <div style={{ fontSize: 10, color: "#999" }}>PAGE {String(idx).padStart(2, "0")}</div>
      </div>
      
      {/* 主内容 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "28px 24px" }}>
        {/* 大号章节数字 */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 72, fontWeight: 900, color: "#f0f0f0", lineHeight: 0.8, fontFamily: "Georgia, serif" }}>{String(idx).padStart(2, "0")}</div>
          <div style={{ flex: 1, paddingTop: 8 }}>
            <div style={{ fontSize: 10, color: a, letterSpacing: "2px", marginBottom: 8, fontWeight: 700 }}>CONTINUED</div>
            <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 24, fontWeight: 800, color: "#000", lineHeight: 1.2, textTransform: "uppercase" }} />
          </div>
        </div>
        
        {/* 正文内容 */}
        <div style={{ flex: 1, columns: "2", columnGap: 24, columnRule: "1px solid #eee" }}>
          <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 13, color: "#333", lineHeight: 1.9 }} />
        </div>
        
        {/* 引用块 */}
        {s.extra && (
          <div style={{ marginTop: 24, padding: "20px 24px", background: "#fafafa", borderTop: `3px solid ${a}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: a, letterSpacing: "2px", marginBottom: 8 }}>EDITOR'S NOTE</div>
            <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 13, color: "#555", lineHeight: 1.7, fontStyle: "italic" }} />
          </div>
        )}
        
        {/* 底部导航 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20, paddingTop: 16, borderTop: "1px solid #eee" }}>
          <div style={{ fontSize: 10, color: "#999", letterSpacing: "2px" }}>NEXT</div>
          <div style={{ flex: 1, height: 2, background: "#eee" }} />
          <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{ width: i === idx ? 32 : 8, height: 3, background: i === idx ? "#000" : "#ddd" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function EditorialEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#000", width: "100%", aspectRatio: "3/4", fontFamily: "'Helvetica Neue', Arial, sans-serif", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 32px", boxSizing: "border-box" }}>
      <div style={{ textAlign: "center" }}>
        {/* 品牌标识 */}
        <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: "12px", marginBottom: 40 }}>VOGUE</div>
        
        {/* 装饰线 */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 32 }}>
          <div style={{ width: 60, height: 1, background: "#fff" }} />
          <div style={{ fontSize: 20, color: "#fff" }}>✦</div>
          <div style={{ width: 60, height: 1, background: "#fff" }} />
        </div>
        
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 16, lineHeight: 1.2, textTransform: "uppercase" }} />
        
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 32, lineHeight: 1.6 }} />
        
        {/* 标签 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 32 }}>
          {s.tags.map((t, i) => (
            <span key={i} style={{ padding: "8px 16px", border: "1px solid rgba(255,255,255,0.3)", fontSize: 11, color: "#fff", letterSpacing: "2px" }}>
              <EditableTag text={t} c="#fff" on={ed?.tag?.(i)} />
            </span>
          ))}
        </div>
        
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "4px" }}>— THE END —</div>
      </div>
    </div>
  );
}

// 别名导出以兼容现有代码
export { EditorialCover as EdCover, EditorialContent as EdContent, EditorialEnd as EdEnd };
