import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

// Clean/WeChat 风格 - 极简线
export function CleanCover({ s, a, total, ed }) {
  return (
    <div
      style={{
        background: "#fff",
        width: "100%",
        aspectRatio: "3/4",
        fontFamily: FONT_FAMILY,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 32px",
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          padding: "0 28px",
        }}
      >
        <div style={{ height: 3, background: a }} />
        <div style={{ height: 1, background: `${a}66` }} />
        <div style={{ height: 1, background: `${a}33` }} />
      </div>
      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: a,
            margin: "0 auto 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
          }}
        >
          {s.emoji}
        </div>
        <EditableText
          v={s.title}
          on={ed?.title}
          block
          style={{
            fontSize: 26,
            fontWeight: 900,
            color: "#111",
            lineHeight: 1.4,
            marginBottom: 12,
            letterSpacing: "-0.5px",
            whiteSpace: "normal",
            wordBreak: "break-word",
            display: "block",
          }}
        />
        {s.subtitle && (
          <EditableText
            v={s.subtitle}
            on={ed?.subtitle}
            block
            style={{ fontSize: 13, color: "#666", lineHeight: 1.65, marginBottom: 20, whiteSpace: "normal", wordBreak: "break-word", display: "block" }}
          />
        )}
        <div style={{ width: 30, height: 3, background: a, margin: "10px auto 16px" }} />
        <div style={{ fontSize: 11, fontWeight: 700, color: a, letterSpacing: "2px" }}>微信推文</div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 18,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          padding: "0 28px",
        }}
      >
        <div style={{ height: 1, background: `${a}33` }} />
        <div style={{ height: 1, background: `${a}66` }} />
        <div style={{ height: 3, background: a }} />
      </div>
    </div>
  );
}

export function CleanContent({ s, a, idx, total, ed }) {
  return (
    <div
      style={{
        background: "#fff",
        width: "100%",
        aspectRatio: "3/4",
        fontFamily: FONT_FAMILY,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        padding: "36px 30px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <div
          style={{
            width: 36,
            height: 36,
            background: a,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 16,
            fontWeight: 900,
            flexShrink: 0,
          }}
        >
          {idx}
        </div>
        <div style={{ flex: 1, height: 1, background: "#e0e0e0" }} />
        <div style={{ fontSize: 11, color: "#bbb", fontWeight: 600 }}>
          {idx}/{total - 2}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "24px 0" }}>
        <div>
          <EditableText
            v={s.heading}
            on={ed?.heading}
            block
            style={{ fontSize: 20, fontWeight: 900, color: "#111", lineHeight: 1.4, marginBottom: 16, display: "block" }}
          />
          <div style={{ width: 28, height: 2, background: a, marginBottom: 20, borderRadius: 1 }} />
          <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#444", lineHeight: 2, display: "block" }} />
        </div>
        {s.extra && (
          <div
            style={{
              marginTop: "auto",
              padding: "14px 16px",
              background: "#fff",
              borderRadius: 8,
              border: "1px solid #e8e8e8",
              borderLeft: `3px solid ${a}`,
            }}
          >
            <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 12, color: "#555", lineHeight: 1.7, display: "block" }} />
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 24 }}>
        <div style={{ flex: 1, height: 1, background: "#e8e8e8" }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: a }} />
        <div style={{ flex: 1, height: 1, background: "#e8e8e8" }} />
      </div>
    </div>
  );
}

export function CleanEnd({ s, a, ed }) {
  return (
    <div
      style={{
        background: "#fff",
        width: "100%",
        aspectRatio: "3/4",
        fontFamily: FONT_FAMILY,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "36px 28px",
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      <div style={{ width: 40, height: 3, background: a, margin: "0 auto 28px", borderRadius: 2 }} />
      <EditableText
        v={s.cta}
        on={ed?.cta}
        block
        style={{ fontSize: 20, fontWeight: 900, color: "#111", marginBottom: 8, lineHeight: 1.35, display: "block" }}
      />
      <EditableText
        v={s.sub}
        on={ed?.sub}
        block
        style={{ fontSize: 13, color: "#888", marginBottom: 28, lineHeight: 1.6, display: "block" }}
      />
      <div style={{ width: "100%", height: 1, background: "#eee", marginBottom: 20 }} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>
        {s.tags.map((t, i) => (
          <EditableTag key={i} text={t} c={a} on={ed?.tag?.(i)} />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 18,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          padding: "0 28px",
        }}
      >
        <div style={{ height: 1, background: "#eee" }} />
        <div style={{ height: 2, background: a }} />
      </div>
    </div>
  );
}
