import { EditableText, EditableTag } from "../../common/EditableText";
import { FONT_FAMILY } from "../../../constants";

// Dark 风格 - 暗夜风
export function DarkCover({ s, a, total, ed }) {
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
        padding: "40px 30px",
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg,transparent,${a},transparent)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg,transparent,${a},transparent)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: `${a}15`,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            border: `2px solid ${a}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            margin: "0 auto 20px",
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
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === 0 ? 20 : 5,
                height: 3,
                borderRadius: 2,
                background: i === 0 ? a : `${a}40`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function DarkContent({ s, a, idx, total, ed }) {
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
        padding: "34px 28px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
        <div
          style={{
            width: 26,
            height: 26,
            border: `1.5px solid ${a}88`,
            borderRadius: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 900,
            color: a,
            flexShrink: 0,
          }}
        >
          {idx}
        </div>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${a}50,transparent)` }} />
        <span style={{ fontSize: 10, color: "#444", fontWeight: 600 }}>
          {idx}/{total - 2}
        </span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "20px 0" }}>
        <div>
          <EditableText
            v={s.heading}
            on={ed?.heading}
            block
            style={{ fontSize: 20, fontWeight: 900, color: "#111", lineHeight: 1.4, marginBottom: 16, display: "block" }}
          />
          <div style={{ height: 1, background: `linear-gradient(90deg,${a}cc,${a}22,transparent)`, marginBottom: 16 }} />
          <EditableText v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#444", lineHeight: 2, display: "block" }} />
        </div>
        {s.extra && (
          <div style={{ padding: "14px 16px", border: `1px solid ${a}33`, borderRadius: 7, background: `${a}0a`, marginTop: "auto" }}>
            <EditableText v={s.extra} on={ed?.extra} block style={{ fontSize: 12, color: "#555", lineHeight: 1.7, display: "block" }} />
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 5, marginTop: 20, justifyContent: "center" }}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === idx ? "18px" : "5px",
              height: 3,
              borderRadius: 2,
              background: i === idx ? a : `${a}30`,
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg,transparent,${a}44,transparent)`,
        }}
      />
    </div>
  );
}

export function DarkEnd({ s, a, ed }) {
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
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg,transparent,${a},transparent)`,
        }}
      />
      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: `2px solid ${a}`,
            margin: "0 auto 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          ✦
        </div>
        <EditableText
          v={s.cta}
          on={ed?.cta}
          block
          style={{ fontSize: 20, fontWeight: 900, color: "#111", marginBottom: 8, lineHeight: 1.3, display: "block" }}
        />
        <EditableText
          v={s.sub}
          on={ed?.sub}
          block
          style={{ fontSize: 13, color: "#666", marginBottom: 26, lineHeight: 1.6, display: "block" }}
        />
        <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${a}66,transparent)`, marginBottom: 20 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>
          {s.tags.map((t, i) => (
            <EditableTag key={i} text={t} c={`${a}cc`} on={ed?.tag?.(i)} />
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg,transparent,${a},transparent)`,
        }}
      />
    </div>
  );
}
