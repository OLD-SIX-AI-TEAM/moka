import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

export function FinanceCover({ s, a, total, ed }) {
  return (
    <div style={{ background: "#1a1a2e", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#ffd700", padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 11, color: "#1a1a2e", fontWeight: 700, letterSpacing: "2px" }}>WALL STREET DAILY</div>
        <div style={{ fontSize: 10, color: "#1a1a2e" }}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 28px", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "40%", height: "100%", background: "linear-gradient(180deg, #ffd70015 0%, transparent 100%)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 50, height: 3, background: "#ffd700" }} />
          <span style={{ fontSize: 9, color: "#ffd700", letterSpacing: "3px", fontWeight: 600 }}>{s.category?.toUpperCase?.() || ""}</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <EditableText v={s.title} on={ed?.title} block dk style={{ fontSize: 32, fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 16, ...ed?.titleStyle }} draggable={!!ed?.updateTitleStyle} onStyleChange={ed?.updateTitleStyle} />
          {s.subtitle && <EditableText v={s.subtitle} on={ed?.subtitle} block dk style={{ fontSize: 14, color: "#a0a0a0", lineHeight: 1.7, ...ed?.subtitleStyle }} draggable={!!ed?.updateSubtitleStyle} onStyleChange={ed?.updateSubtitleStyle} />}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 28 : 6, height: 4, background: i === 0 ? "#ffd700" : "#333" }} />)}
        </div>
      </div>
    </div>
  );
}

export function FinanceContent({ s, a, idx, total, ed }) {
  return (
    <div style={{ background: "#f8f9fa", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#ffd700" }}>{String.fromCharCode(65 + idx - 1)}</div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: "#1a1a2e", letterSpacing: "2px", fontWeight: 600 }}>MARKET INSIGHT</div>
            <div style={{ fontSize: 10, color: "#888" }}>Section {idx}</div>
          </div>
        </div>
        <EditableText v={s.heading} on={ed?.heading} block style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", lineHeight: 1.35, marginBottom: 16, ...ed?.headingStyle }} draggable={!!ed?.updateHeadingStyle} onStyleChange={ed?.updateHeadingStyle} />
        <div style={{ flex: 1 }}>
          <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#444", lineHeight: 1.85, ...ed?.textStyle }} draggable={!!ed?.updateTextStyle} onStyleChange={ed?.updateTextStyle} />
        </div>
        {s.extra && (
          <div style={{ marginTop: 20, padding: "16px 20px", background: "#fff", borderRadius: 8, borderLeft: "4px solid #ffd700", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>📈</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#ffd700", letterSpacing: "1px" }}>ANALYST VIEW</span>
            </div>
            <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 13, color: "#555", lineHeight: 1.7, ...ed?.extraStyle }} draggable={!!ed?.updateExtraStyle} onStyleChange={ed?.updateExtraStyle} />
          </div>
        )}
        <div style={{ display: "flex", gap: 6, marginTop: 24, alignItems: "center" }}>
          <div style={{ flex: 1, height: 1, background: "#ddd" }} />
          {Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? 24 : 6, height: 4, background: i === idx ? "#1a1a2e" : "#ccc" }} />)}
        </div>
      </div>
    </div>
  );
}

export function FinanceEnd({ s, a, ed }) {
  return (
    <div style={{ background: "#1a1a2e", width: "100%", aspectRatio: "3/4", fontFamily: FONT_FAMILY, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 32px", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "#ffd700" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "#ffd700" }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 60, height: 2, background: "#ffd700" }} />
          <span style={{ fontSize: 24 }}>📊</span>
          <div style={{ width: 60, height: 2, background: "#ffd700" }} />
        </div>
        <EditableText v={s.cta} on={ed?.cta} block style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 12, lineHeight: 1.3, ...ed?.ctaStyle }} draggable={!!ed?.updateCtaStyle} onStyleChange={ed?.updateCtaStyle} />
        <EditableText v={s.sub} on={ed?.sub} block style={{ fontSize: 13, color: "#888", marginBottom: 28, lineHeight: 1.6, ...ed?.subStyle }} draggable={!!ed?.updateSubStyle} onStyleChange={ed?.updateSubStyle} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {s.tags.map((t, i) => <span key={i} style={{ padding: "6px 14px", background: "#ffd70020", border: "1px solid #ffd70040", fontSize: 11, color: "#ffd700" }}><EditableTag text={t} c="#ffd700" on={ed?.tag?.(i)} noBorder /></span>)}
        </div>
        <div style={{ fontSize: 10, color: "#666", letterSpacing: "2px" }}>— WALL STREET DAILY —</div>
      </div>
    </div>
  );
}
