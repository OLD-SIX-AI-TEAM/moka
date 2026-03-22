import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

// Vivid/XHS 风格 - 撞色块
export function VividCover({ s, a, total, ed }) {
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
          top: -60,
          right: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: `${a}15`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: -40,
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: `${a}10`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 32,
          right: 32,
          height: 1,
          background: `${a}40`,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>{s.emoji}</div>
        <EditableText
          v={s.title}
          on={ed?.title}
          block
          style={{
            fontSize: 28,
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
            style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 20, whiteSpace: "normal", wordBreak: "break-word", display: "block" }}
          />
        )}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === 0 ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: i === 0 ? "#fff" : `${a}50`,
              }}
            />
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 32,
          right: 32,
          height: 1,
          background: `${a}40`,
        }}
      />
    </div>
  );
}

export function VividContent({ s, a, idx, total, ed }) {
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
        padding: "32px 28px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ height: 4, background: `linear-gradient(90deg,${a},${a}88)`, marginBottom: 22, borderRadius: 2 }} />
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: a,
          letterSpacing: "2px",
          marginBottom: 18,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span>
          {String(idx).padStart(2, "0")} / {String(total - 2).padStart(2, "0")}
        </span>
        <div style={{ flex: 1, height: 1, background: `${a}30` }} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "20px 0" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: `${a}18`,
              lineHeight: 1,
              flexShrink: 0,
              marginTop: -6,
              userSelect: "none",
            }}
          >
            {idx}
          </div>
          <div style={{ flex: 1 }}>
            <EditableText
              v={s.heading}
              on={ed?.heading}
              block
              style={{ fontSize: 18, fontWeight: 900, color: "#111", lineHeight: 1.4, marginBottom: 16, display: "block" }}
            />
            <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#555", lineHeight: 1.9, display: "block" }} />
          </div>
        </div>
        {s.extra && (
          <div style={{ padding: "14px 16px", background: `${a}0d`, borderRadius: 10, borderLeft: `3px solid ${a}`, marginTop: "auto" }}>
            <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 12, color: "#555", lineHeight: 1.7, display: "block" }} />
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 5, marginTop: 20, justifyContent: "center" }}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === idx ? "20px" : "6px",
              height: 4,
              borderRadius: 2,
              background: i === idx ? a : `${a}35`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function VividEnd({ s, a, ed }) {
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
        padding: "36px 28px",
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -40,
          left: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: `${a}15`,
        }}
      />
      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <div style={{ fontSize: 44, marginBottom: 14 }}>🌟</div>
        <EditableText
          v={s.cta}
          on={ed?.cta}
          block
          style={{ fontSize: 22, fontWeight: 900, color: "#111", marginBottom: 8, lineHeight: 1.3, display: "block" }}
        />
        <EditableText
          v={s.sub}
          on={ed?.sub}
          block
          style={{ fontSize: 13, color: "#666", marginBottom: 24, lineHeight: 1.6, display: "block" }}
        />
        <div style={{ width: 40, height: 2, background: `${a}50`, margin: "0 auto 20px" }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>
          {s.tags.map((t, i) => (
            <EditableTag key={i} text={t} c={a} on={ed?.tag?.(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}
