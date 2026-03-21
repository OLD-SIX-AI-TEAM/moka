/**
 * 装饰性 SVG 图标组件
 */

export function Line2({ c }) {
  return (
    <svg width="100%" height="9" viewBox="0 0 200 9" preserveAspectRatio="none">
      <line x1="0" y1="2.5" x2="200" y2="2.5" stroke={c} strokeWidth="2.5" />
      <line x1="0" y1="7" x2="200" y2="7" stroke={c} strokeWidth="1" strokeOpacity=".3" />
    </svg>
  );
}

export function Dash({ c }) {
  return (
    <svg width="100%" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
      <line x1="0" y1="3" x2="200" y2="3" stroke={c} strokeWidth="1.5" strokeDasharray="5 4" />
    </svg>
  );
}

export function Wave({ c, w = 180 }) {
  const path = Array.from({ length: Math.floor(w / 12) }, (_, i) =>
    `Q${i * 12 + 6} ${i % 2 ? 10 : 0} ${(i + 1) * 12} 5`
  ).join(" ");

  return (
    <svg width={w} height="10" viewBox={`0 0 ${w} 10`} fill="none">
      <path d={`M0 5 ${path}`} stroke={c} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Diamond({ c }) {
  return (
    <svg width="130" height="13" viewBox="0 0 130 13">
      <line x1="0" y1="6.5" x2="54" y2="6.5" stroke={c} strokeWidth="1" strokeOpacity=".4" />
      <rect x="57" y="2.5" width="8" height="8" transform="rotate(45 61 6.5)" fill={c} />
      <rect x="67" y="2.5" width="8" height="8" transform="rotate(45 71 6.5)" fill="none" stroke={c} strokeWidth="1.5" />
      <line x1="75" y1="6.5" x2="130" y2="6.5" stroke={c} strokeWidth="1" strokeOpacity=".4" />
    </svg>
  );
}

export function Star({ c }) {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" style={{ flexShrink: 0, marginTop: 3 }}>
      <polygon points="7,1 8.5,5.5 13,5.5 9.5,8.5 11,13 7,10 3,13 4.5,8.5 1,5.5 5.5,5.5" fill={c} />
    </svg>
  );
}

export function Bracket({ c, pos, sz = 18 }) {
  const paths = {
    tl: `M${sz} 2 L2 2 L2 ${sz}`,
    tr: `M0 2 L${sz - 2} 2 L${sz - 2} ${sz}`,
    bl: `M${sz} ${sz - 2} L2 ${sz - 2} L2 0`,
    br: `M0 ${sz - 2} L${sz - 2} ${sz - 2} L${sz - 2} 0`,
  };

  const positions = {
    tl: { top: 7, left: 7 },
    tr: { top: 7, right: 7 },
    bl: { bottom: 7, left: 7 },
    br: { bottom: 7, right: 7 },
  };

  return (
    <svg
      width={sz}
      height={sz}
      viewBox={`0 0 ${sz} ${sz}`}
      style={{ position: "absolute", ...positions[pos] }}
    >
      <path d={paths[pos]} stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="square" />
    </svg>
  );
}

export function Dots() {
  return (
    <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "currentColor",
            animation: "xdot 1s infinite",
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
    </span>
  );
}
