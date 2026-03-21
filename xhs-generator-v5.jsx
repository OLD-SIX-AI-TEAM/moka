import { useState, useRef, useCallback, useEffect } from "react";

/* ══════════════════ html2canvas ══════════════════ */
function useH2C() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (window.html2canvas) { setOk(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    s.onload = () => setOk(true);
    document.head.appendChild(s);
  }, []);
  return ok;
}

/* ══════════════════ EDITABLE TEXT ══════════════════
   E({ v, on, style, dk, block })
   - on=undefined  → static span (thumbnails / export)
   - on=fn         → contentEditable span with hover highlight
   - dk=true       → dark-card highlight variant
   - block=true    → display:block
*/
function E({ v, on, style, dk = false, block = false }) {
  const r = useRef(null);
  // sync DOM when value changes externally (slide switch etc.)
  useEffect(() => {
    if (r.current && document.activeElement !== r.current)
      r.current.innerText = v ?? "";
  }, [v]);

  const Tag = block ? "div" : "span";
  if (!on) return <Tag style={style}>{v}</Tag>;
  return (
    <Tag
      ref={r}
      contentEditable
      suppressContentEditableWarning
      onBlur={e => on(e.currentTarget.innerText.trim())}
      onKeyDown={e => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur(); }
      }}
      style={{ ...style, outline: "none", cursor: "text" }}
      className={`ef${dk ? " efdk" : ""}`}
    />
  );
}

/* Editable tag chip */
function ETag({ text, c, on }) {
  if (!on) return <span style={{ fontSize: 11, color: c, border: `1px solid ${c}`, borderRadius: 3, padding: "2px 7px", fontWeight: 700 }}>#{text}</span>;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      <span style={{ fontSize: 11, color: c, fontWeight: 700 }}>#</span>
      <E v={text} on={on} style={{ fontSize: 11, color: c, border: `1px solid ${c}`, borderRadius: 3, padding: "2px 6px", fontWeight: 700, minWidth: 20 }}/>
    </span>
  );
}

/* ══════════════════ DRAG REORDER ══════════════════
   useDragReorder(items, setItems) → { active, target, start, over, drop, cancel }
   DragRow({ i, drag, color, children, style }) → draggable section wrapper
══════════════════ */
function useDragReorder(items, setItems) {
  const [active, setActive] = useState(null);
  const [target, setTarget] = useState(null);
  const start  = i => setActive(i);
  const over   = i => { if (i !== active) setTarget(i); };
  const drop   = () => {
    if (active !== null && target !== null && active !== target) {
      setItems(prev => {
        const arr = [...prev];
        const [item] = arr.splice(active, 1);
        arr.splice(target > active ? target - 1 : target, 0, item);
        return arr;
      });
    }
    setActive(null); setTarget(null);
  };
  const cancel = () => { setActive(null); setTarget(null); };
  return { active, target, start, over, drop, cancel };
}

function DragRow({ i, drag, color, children, style }) {
  const canDrag = useRef(false);
  if (!drag) return <div style={style}>{children}</div>;
  const isDragging = drag.active === i;
  const isTarget   = drag.target === i && !isDragging;
  return (
    <div
      draggable
      onDragStart={e => {
        if (!canDrag.current) { e.preventDefault(); return; }
        drag.start(i); e.dataTransfer.effectAllowed = "move";
      }}
      onDragOver={e => { e.preventDefault(); drag.over(i); }}
      onDrop={e => { e.preventDefault(); drag.drop(); }}
      onDragEnd={() => { canDrag.current = false; drag.cancel(); }}
      className="drag-row"
      style={{
        ...style, position: "relative",
        opacity: isDragging ? 0.28 : 1, transition: "opacity .15s",
        borderTop: isTarget ? `2px dashed ${color}88` : "2px solid transparent",
        borderRadius: 4,
      }}
    >
      {/* ≡ handle – visible on row hover, drag starts from here */}
      <span
        className="dh"
        onMouseDown={e => { e.stopPropagation(); canDrag.current = true; }}
        onMouseUp={() => { canDrag.current = false; }}
        title="拖拽排序"
        style={{
          position: "absolute", right: 2, top: "50%", transform: "translateY(-50%)",
          width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, color: "#bbb", cursor: "grab", borderRadius: 3,
          opacity: 0, transition: "opacity .15s, background .1s",
          userSelect: "none", zIndex: 10,
        }}
      >≡</span>
      {children}
    </div>
  );
}


const FF = "'PingFang SC','Hiragino Sans GB',sans-serif";
const Line2 = ({ c }) => (<svg width="100%" height="9" viewBox="0 0 200 9" preserveAspectRatio="none"><line x1="0" y1="2.5" x2="200" y2="2.5" stroke={c} strokeWidth="2.5"/><line x1="0" y1="7" x2="200" y2="7" stroke={c} strokeWidth="1" strokeOpacity=".3"/></svg>);
const Dash  = ({ c }) => (<svg width="100%" height="6" viewBox="0 0 200 6" preserveAspectRatio="none"><line x1="0" y1="3" x2="200" y2="3" stroke={c} strokeWidth="1.5" strokeDasharray="5 4"/></svg>);
const Wave  = ({ c, w = 180 }) => (<svg width={w} height="10" viewBox={`0 0 ${w} 10`} fill="none"><path d={`M0 5 ${Array.from({ length: Math.floor(w / 12) }, (_, i) => `Q${i * 12 + 6} ${i % 2 ? 10 : 0} ${(i + 1) * 12} 5`).join(" ")}`} stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>);
const Diamond = ({ c }) => (<svg width="130" height="13" viewBox="0 0 130 13"><line x1="0" y1="6.5" x2="54" y2="6.5" stroke={c} strokeWidth="1" strokeOpacity=".4"/><rect x="57" y="2.5" width="8" height="8" transform="rotate(45 61 6.5)" fill={c}/><rect x="67" y="2.5" width="8" height="8" transform="rotate(45 71 6.5)" fill="none" stroke={c} strokeWidth="1.5"/><line x1="75" y1="6.5" x2="130" y2="6.5" stroke={c} strokeWidth="1" strokeOpacity=".4"/></svg>);
const Star  = ({ c }) => (<svg width="12" height="12" viewBox="0 0 14 14" style={{ flexShrink: 0, marginTop: 3 }}><polygon points="7,1 8.5,5.5 13,5.5 9.5,8.5 11,13 7,10 3,13 4.5,8.5 1,5.5 5.5,5.5" fill={c}/></svg>);
const Brk   = ({ c, pos, sz = 18 }) => { const P = { tl: `M${sz} 2 L2 2 L2 ${sz}`, tr: `M0 2 L${sz - 2} 2 L${sz - 2} ${sz}`, bl: `M${sz} ${sz - 2} L2 ${sz - 2} L2 0`, br: `M0 ${sz - 2} L${sz - 2} ${sz - 2} L${sz - 2} 0` }; const S = { tl: { top: 7, left: 7 }, tr: { top: 7, right: 7 }, bl: { bottom: 7, left: 7 }, br: { bottom: 7, right: 7 } }; return <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} style={{ position: "absolute", ...S[pos] }}><path d={P[pos]} stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="square"/></svg>; };
const Dots  = () => (<span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>{[0, 1, 2].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", animation: "xdot 1s infinite", animationDelay: `${i * .18}s` }}/>)}</span>);

/* ══════════════════ SINGLE-PAGE CARDS (9)
   Each accepts `ed` prop:
   ed = { title, lead, tip, secH(i), secT(i), tag(i) }  — or undefined for read-only
══════════════════ */
const Editorial = ({ d, ed, drag }) => (
  <div style={{ background: "#faf8f4", padding: "34px 28px", fontFamily: FF }}>
    <div style={{ height: 4, background: `linear-gradient(90deg,${d.a} 55%,transparent)`, marginBottom: 24 }}/>
    <div style={{ fontSize: 10, fontWeight: 800, color: d.a, letterSpacing: "3px", marginBottom: 7 }}>{d.category} · XIAOHONGSHU</div>
    <E v={d.title} on={ed?.title} block style={{ fontSize: 25, fontWeight: 900, color: "#1a1510", lineHeight: 1.25, letterSpacing: "-0.5px", marginBottom: 13 }}/>
    <Line2 c={d.a}/>
    {d.lead && <E v={d.lead} on={ed?.lead} block style={{ fontSize: 13, color: "#555", lineHeight: 1.8, margin: "13px 0 17px", paddingLeft: 11, borderLeft: `3px solid ${d.a}`, fontStyle: "italic" }}/>}
    <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
      {d.sections.map((s, i) => (
        <DragRow key={i} i={i} drag={drag} color={d.a} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <div style={{ minWidth: 3, width: 3, borderRadius: 2, background: d.a, marginTop: 4, alignSelf: "stretch" }}/>
          <div>
            {s.heading && <E v={s.heading} on={ed?.secH(i)} block style={{ fontSize: 13, fontWeight: 800, color: "#1a1510", marginBottom: 2 }}/>}
            <E v={s.text} on={ed?.secT(i)} block style={{ fontSize: 13, color: "#444", lineHeight: 1.85 }}/>
          </div>
        </DragRow>
      ))}
    </div>
    {d.tip && <div style={{ margin: "17px 0 0", background: d.a + "15", padding: "10px 13px", borderRadius: 2 }}><span style={{ fontSize: 11, fontWeight: 800, color: d.a }}>TIPS · </span><E v={d.tip} on={ed?.tip} style={{ fontSize: 12, color: "#444" }}/></div>}
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 15 }}>{d.tags.map((t, i) => <ETag key={i} text={t} c={d.a} on={ed?.tag(i)}/>)}</div>
    <div style={{ height: 2, background: d.a, marginTop: 20, width: 36 }}/>
  </div>
);
const Notecard = ({ d, ed, drag }) => (
  <div style={{ background: d.bg, padding: "26px 22px", fontFamily: FF, border: `2px dashed ${d.a}88`, borderRadius: 18, position: "relative" }}>
    {["tl", "tr", "bl", "br"].map(p => <Brk key={p} c={d.a} pos={p}/>)}
    <div style={{ fontSize: 36, textAlign: "center", marginBottom: 10 }}>{d.emoji}</div>
    <E v={d.title} on={ed?.title} block style={{ fontSize: 21, fontWeight: 900, color: d.tc, textAlign: "center", lineHeight: 1.3, marginBottom: 5 }}/>
    {d.lead && <E v={d.lead} on={ed?.lead} block style={{ fontSize: 12, color: d.a, textAlign: "center", marginBottom: 13, fontWeight: 600 }}/>}
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}><Diamond c={d.a}/></div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {d.sections.map((s, i) => (
        <DragRow key={i} i={i} drag={drag} color={d.a} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Star c={d.a}/>
          <div><E v={s.heading} on={ed?.secH(i)} style={{ fontSize: 13, fontWeight: 800, color: d.tc, marginRight: 5 }}/><E v={s.text} on={ed?.secT(i)} style={{ fontSize: 13, color: d.bc, lineHeight: 1.75 }}/></div>
        </DragRow>
      ))}
    </div>
    {d.tip && <div style={{ margin: "14px 0 0", textAlign: "center" }}><Dash c={d.a}/><div style={{ fontSize: 12, color: d.bc, marginTop: 8, lineHeight: 1.7 }}><b style={{ color: d.a }}>贴士 </b><E v={d.tip} on={ed?.tip} style={{ fontSize: 12, color: d.bc }}/></div></div>}
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 13, justifyContent: "center" }}>{d.tags.map((t, i) => <ETag key={i} text={t} c={d.a} on={ed?.tag(i)}/>)}</div>
  </div>
);
const Minimal = ({ d, ed, drag }) => (
  <div style={{ background: "#fff", padding: "36px 28px", fontFamily: FF }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}><div style={{ width: 3, height: 28, background: d.a }}/><div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${d.a}50,transparent)` }}/><div style={{ width: 7, height: 7, borderRadius: "50%", border: `2px solid ${d.a}` }}/></div>
    <div style={{ position: "relative", paddingBottom: 6, marginBottom: 17 }}>
      <E v={d.title} on={ed?.title} block style={{ fontSize: 23, fontWeight: 900, color: "#111", lineHeight: 1.3, letterSpacing: "-0.3px" }}/>
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 50, height: 3, background: d.a }}/>
    </div>
    {d.lead && <E v={d.lead} on={ed?.lead} block style={{ fontSize: 13, color: "#666", lineHeight: 1.8, marginBottom: 18, paddingBottom: 13, borderBottom: "1px solid #eee" }}/>}
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {d.sections.map((s, i) => (
        <DragRow key={i} i={i} drag={drag} color={d.a} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: d.a, color: "#fff", fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
          <div><E v={s.heading} on={ed?.secH(i)} block style={{ fontSize: 13, fontWeight: 800, color: "#111", marginBottom: 2 }}/><E v={s.text} on={ed?.secT(i)} block style={{ fontSize: 13, color: "#555", lineHeight: 1.85 }}/></div>
        </DragRow>
      ))}
    </div>
    {d.tip && <div style={{ display: "flex", gap: 8, margin: "18px 0 0", padding: "10px 12px", background: "#f6f6f6" }}><span style={{ fontSize: 15, flexShrink: 0 }}>💡</span><E v={d.tip} on={ed?.tip} style={{ fontSize: 12, color: "#555", lineHeight: 1.75 }}/></div>}
    <div style={{ marginTop: 16, paddingTop: 11, borderTop: "1px solid #f0f0f0", display: "flex", flexWrap: "wrap", gap: 6 }}>{d.tags.map((t, i) => <ETag key={i} text={t} c="#888" on={ed?.tag(i)}/>)}</div>
    <div style={{ display: "flex", gap: 4, marginTop: 13 }}><div style={{ flex: 3, height: 1, background: d.a }}/><div style={{ flex: 1, height: 1, background: "#ddd" }}/></div>
  </div>
);
const Stamp = ({ d, ed, drag }) => (
  <div style={{ background: d.bg, padding: "26px 22px", fontFamily: FF, position: "relative", overflow: "hidden" }}>
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .05 }}><defs><pattern id="gp" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0L0 0 0 20" fill="none" stroke={d.a} strokeWidth=".5"/></pattern></defs><rect width="100%" height="100%" fill="url(#gp)"/></svg>
    <div style={{ position: "relative", border: `2px solid ${d.a}`, padding: "13px 15px", marginBottom: 16, zIndex: 1 }}>
      {["tl", "tr", "bl", "br"].map(p => <div key={p} style={{ position: "absolute", width: 8, height: 8, background: d.a, ...({ tl: { top: -4, left: -4 }, tr: { top: -4, right: -4 }, bl: { bottom: -4, left: -4 }, br: { bottom: -4, right: -4 } }[p]) }}/>)}
      <div style={{ fontSize: 10, fontWeight: 700, color: d.a, letterSpacing: "2px", marginBottom: 4 }}>{d.emoji} · {d.category}</div>
      <E v={d.title} on={ed?.title} block style={{ fontSize: 20, fontWeight: 900, color: d.tc, lineHeight: 1.3 }}/>
    </div>
    {d.lead && <E v={d.lead} on={ed?.lead} block style={{ fontSize: 13, color: d.bc, lineHeight: 1.8, marginBottom: 12, zIndex: 1, position: "relative", fontStyle: "italic" }}/>}
    <div style={{ zIndex: 1, position: "relative", marginBottom: 12 }}><Wave c={d.a}/></div>
    <div style={{ display: "flex", flexDirection: "column", gap: 12, zIndex: 1, position: "relative" }}>
      {d.sections.map((s, i) => (
        <DragRow key={i} i={i} drag={drag} color={d.a}>
          {s.heading && <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}><span style={{ fontSize: 13 }}>{"📌✏️📎🗝️🖇️".split("").filter((_, j) => j % 2 === 0)[i % 5]}</span><E v={s.heading} on={ed?.secH(i)} style={{ fontSize: 13, fontWeight: 800, color: d.tc }}/></div>}
          <E v={s.text} on={ed?.secT(i)} block style={{ fontSize: 13, color: d.bc, lineHeight: 1.85, paddingLeft: s.heading ? 22 : 0 }}/>
        </DragRow>
      ))}
    </div>
    {d.tip && <div style={{ margin: "14px 0 0", padding: "9px 11px", background: `${d.a}18`, borderRadius: 6, zIndex: 1, position: "relative" }}><b style={{ color: d.a, fontSize: 12 }}>📌 记得 · </b><E v={d.tip} on={ed?.tip} style={{ fontSize: 12, color: d.bc }}/></div>}
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14, zIndex: 1, position: "relative" }}>{d.tags.map((t, i) => <ETag key={i} text={t} c={d.a} on={ed?.tag(i)}/>)}</div>
  </div>
);
const BoldCard = ({ d, ed, drag }) => (
  <div style={{ fontFamily: FF, overflow: "hidden" }}>
    <div style={{ background: d.a, padding: "28px 24px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: -40, top: -40, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,.1)" }}/>
      <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,.6)", letterSpacing: "3px", marginBottom: 8 }}>{d.category?.toUpperCase()} · XIAOHONGSHU</div>
      <E v={d.title} on={ed?.title} block dk style={{ fontSize: 23, fontWeight: 900, color: "#fff", lineHeight: 1.25, marginBottom: d.lead ? 0 : 0 }}/>
      {d.lead && <E v={d.lead} on={ed?.lead} block dk style={{ fontSize: 13, color: "rgba(255,255,255,.85)", marginTop: 9, lineHeight: 1.7 }}/>}
      <div style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", fontSize: 46, opacity: .2, userSelect: "none" }}>{d.emoji}</div>
    </div>
    <div style={{ background: "#fff", padding: "20px 24px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        {d.sections.map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color={d.a} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ minWidth: 23, height: 23, borderRadius: 5, background: d.a + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: d.a, flexShrink: 0 }}>{i + 1}</div>
            <div><E v={s.heading} on={ed?.secH(i)} block style={{ fontSize: 13, fontWeight: 800, color: "#111", marginBottom: 2 }}/><E v={s.text} on={ed?.secT(i)} block style={{ fontSize: 13, color: "#555", lineHeight: 1.85 }}/></div>
          </DragRow>
        ))}
      </div>
      {d.tip && <div style={{ display: "flex", gap: 7, margin: "16px 0 0", padding: "10px", background: `${d.a}12`, borderRadius: 8 }}><span style={{ fontSize: 14, flexShrink: 0 }}>✦</span><E v={d.tip} on={ed?.tip} style={{ fontSize: 12, color: "#444", lineHeight: 1.75 }}/></div>}
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #f0f0f0", display: "flex", flexWrap: "wrap", gap: 6 }}>{d.tags.map((t, i) => <ETag key={i} text={t} c={d.a} on={ed?.tag(i)}/>)}</div>
    </div>
  </div>
);
const Dark = ({ d, ed, drag }) => (
  <div style={{ background: "#111318", padding: "32px 26px", fontFamily: FF, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${d.a},transparent)` }}/>
    <div style={{ fontSize: 10, fontWeight: 800, color: d.a, letterSpacing: "3px", marginBottom: 7 }}>{d.category} · XIAOHONGSHU</div>
    <E v={d.title} on={ed?.title} block dk style={{ fontSize: 23, fontWeight: 900, color: "#f0eee8", lineHeight: 1.25, marginBottom: 6, letterSpacing: "-0.3px" }}/>
    {d.lead && <E v={d.lead} on={ed?.lead} block dk style={{ fontSize: 13, color: "#888", lineHeight: 1.75, marginBottom: 16 }}/>}
    <div style={{ height: 1, background: `linear-gradient(90deg,${d.a}cc,${d.a}22,transparent)`, marginBottom: 16 }}/>
    <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
      {d.sections.map((s, i) => (
        <DragRow key={i} i={i} drag={drag} color={d.a} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
          <div style={{ width: 19, height: 19, border: `1.5px solid ${d.a}88`, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: d.a, flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
          <div>{s.heading && <E v={s.heading} on={ed?.secH(i)} block dk style={{ fontSize: 13, fontWeight: 800, color: "#e8e4dc", marginBottom: 2 }}/>}<E v={s.text} on={ed?.secT(i)} block dk style={{ fontSize: 13, color: "#7a7878", lineHeight: 1.85 }}/></div>
        </DragRow>
      ))}
    </div>
    {d.tip && <div style={{ margin: "16px 0 0", padding: "10px 13px", border: `1px solid ${d.a}44`, borderRadius: 5, background: `${d.a}0e` }}><span style={{ fontSize: 12, color: d.a, fontWeight: 700 }}>✦ </span><E v={d.tip} on={ed?.tip} dk style={{ fontSize: 12, color: "#7a7878" }}/></div>}
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>{d.tags.map((t, i) => <ETag key={i} text={t} c={`${d.a}cc`} on={ed?.tag(i)}/>)}</div>
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${d.a}55,transparent)` }}/>
  </div>
);
const Newspaper = ({ d, ed, drag }) => (
  <div style={{ background: "#fdfbf4", padding: "28px 24px", fontFamily: FF, border: "1px solid #d4c9a8" }}>
    <div style={{ textAlign: "center", borderBottom: `3px double ${d.a}`, paddingBottom: 9, marginBottom: 13 }}>
      <div style={{ fontSize: 9, letterSpacing: "4px", color: "#888", fontWeight: 700, marginBottom: 3 }}>— XIAOHONGSHU POST —</div>
      <E v={d.title} on={ed?.title} block style={{ fontSize: 21, fontWeight: 900, color: "#1a1510", lineHeight: 1.2, letterSpacing: "-0.3px" }}/>
      <div style={{ fontSize: 11, color: d.a, fontWeight: 700, marginTop: 4, letterSpacing: "1px" }}>{d.category} · {d.emoji}</div>
    </div>
    {d.lead && <E v={d.lead} on={ed?.lead} block style={{ fontSize: 13, color: "#555", lineHeight: 1.8, marginBottom: 13, textAlign: "center", fontStyle: "italic", borderBottom: "1px solid #e0d8c0", paddingBottom: 13 }}/>}
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {d.sections.map((s, i) => (
        <DragRow key={i} i={i} drag={drag} color={d.a}>
          {s.heading && <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}><div style={{ width: 17, height: 17, background: d.a, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, color: "#fff", flexShrink: 0 }}>{String.fromCharCode(9312 + i)}</div><E v={s.heading} on={ed?.secH(i)} style={{ fontSize: 13, fontWeight: 900, color: "#1a1510", borderBottom: `1px solid ${d.a}60`, paddingBottom: 1 }}/></div>}
          <E v={s.text} on={ed?.secT(i)} block style={{ fontSize: 13, color: "#444", lineHeight: 1.85, paddingLeft: s.heading ? 22 : 0 }}/>
        </DragRow>
      ))}
    </div>
    {d.tip && <div style={{ margin: "14px 0 0", padding: "9px 11px", borderLeft: `3px solid ${d.a}`, background: "#f5f0e0" }}><span style={{ fontSize: 11, fontWeight: 800, color: d.a }}>编辑注 · </span><E v={d.tip} on={ed?.tip} style={{ fontSize: 12, color: "#555" }}/></div>}
    <div style={{ marginTop: 13, paddingTop: 11, borderTop: `2px double ${d.a}44`, display: "flex", flexWrap: "wrap", gap: 6 }}>{d.tags.map((t, i) => <ETag key={i} text={t} c={d.a} on={ed?.tag(i)}/>)}</div>
  </div>
);
const Film = ({ d, ed, drag }) => {
  const H = Array.from({ length: 6 });
  return (
    <div style={{ background: "#1c1c1e", fontFamily: FF, overflow: "hidden" }}>
      <div style={{ background: "#111", padding: "7px 13px", display: "flex", gap: 7 }}>{H.map((_, i) => <div key={i} style={{ width: 15, height: 11, borderRadius: 2, background: "#1c1c1e", border: "1px solid #333" }}/>)}</div>
      <div style={{ padding: "22px 20px", background: "#faf6ee", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: d.a }}/>
        <div style={{ paddingLeft: 13 }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: d.a, letterSpacing: "3px", marginBottom: 5 }}>{d.category} · FRAME 01</div>
          <E v={d.title} on={ed?.title} block style={{ fontSize: 21, fontWeight: 900, color: "#1a1510", lineHeight: 1.25, marginBottom: 4 }}/>
          {d.lead && <E v={d.lead} on={ed?.lead} block style={{ fontSize: 12, color: "#777", lineHeight: 1.7, marginBottom: 14, fontStyle: "italic" }}/>}
          <div style={{ height: 1, background: `linear-gradient(90deg,${d.a},transparent)`, marginBottom: 14 }}/>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {d.sections.map((s, i) => (
              <DragRow key={i} i={i} drag={drag} color={d.a} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                <span style={{ fontSize: 15, flexShrink: 0, lineHeight: 1 }}>{"◈◉◎●".split("")[i % 4]}</span>
                <div>{s.heading && <E v={s.heading} on={ed?.secH(i)} block style={{ fontSize: 13, fontWeight: 800, color: "#1a1510", marginBottom: 2 }}/>}<E v={s.text} on={ed?.secT(i)} block style={{ fontSize: 13, color: "#555", lineHeight: 1.85 }}/></div>
              </DragRow>
            ))}
          </div>
          {d.tip && <div style={{ margin: "14px 0 0", padding: "9px 11px", background: d.a + "15", borderRadius: 3 }}><span style={{ fontSize: 12, color: d.a, fontWeight: 700 }}>▸ </span><E v={d.tip} on={ed?.tip} style={{ fontSize: 12, color: "#555" }}/></div>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 13 }}>{d.tags.map((t, i) => <ETag key={i} text={t} c={d.a} on={ed?.tag(i)}/>)}</div>
        </div>
      </div>
      <div style={{ background: "#111", padding: "7px 13px", display: "flex", gap: 7 }}>{H.map((_, i) => <div key={i} style={{ width: 15, height: 11, borderRadius: 2, background: "#1c1c1e", border: "1px solid #333" }}/>)}</div>
    </div>
  );
};
const LabelCard = ({ d, ed, drag }) => (
  <div style={{ background: "#fff", fontFamily: FF, position: "relative" }}>
    <div style={{ background: d.a, padding: "18px 22px 26px", clipPath: "polygon(0 0,100% 0,100% 80%,50% 100%,0 80%)", marginBottom: -8, position: "relative" }}>
      <div style={{ width: 19, height: 19, borderRadius: "50%", background: "rgba(255,255,255,.3)", margin: "0 auto 9px", border: "2px solid rgba(255,255,255,.5)" }}/>
      <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,.7)", letterSpacing: "3px", textAlign: "center", marginBottom: 5 }}>{d.category} · {d.emoji}</div>
      <E v={d.title} on={ed?.title} block dk style={{ fontSize: 20, fontWeight: 900, color: "#fff", textAlign: "center", lineHeight: 1.25 }}/>
    </div>
    <div style={{ padding: "14px 22px 22px", marginTop: 8 }}>
      {d.lead && <E v={d.lead} on={ed?.lead} block style={{ fontSize: 13, color: "#666", textAlign: "center", fontStyle: "italic", marginBottom: 14, lineHeight: 1.7 }}/>}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}><Diamond c={d.a}/></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {d.sections.map((s, i) => (
          <DragRow key={i} i={i} drag={drag} color={d.a} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: d.a, marginTop: 7, flexShrink: 0 }}/>
            <div>{s.heading && <E v={s.heading} on={ed?.secH(i)} block style={{ fontSize: 13, fontWeight: 800, color: "#1a1510", marginBottom: 2 }}/>}<E v={s.text} on={ed?.secT(i)} block style={{ fontSize: 13, color: "#555", lineHeight: 1.85 }}/></div>
          </DragRow>
        ))}
      </div>
      {d.tip && <div style={{ margin: "14px 0 0", padding: "9px 13px", border: `1.5px dashed ${d.a}66`, borderRadius: 7 }}><span style={{ fontSize: 12, color: d.a, fontWeight: 700 }}>✦ </span><E v={d.tip} on={ed?.tip} style={{ fontSize: 12, color: "#555" }}/></div>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14, justifyContent: "center" }}>{d.tags.map((t, i) => <ETag key={i} text={t} c={d.a} on={ed?.tag(i)}/>)}</div>
    </div>
  </div>
);
const SINGLE_RENDERERS = { editorial: Editorial, notecard: Notecard, minimal: Minimal, stamp: Stamp, bold: BoldCard, dark: Dark, newspaper: Newspaper, film: Film, label: LabelCard };

/* ══════════════════ SPLIT SLIDES ══════════════════
   Each component accepts `ed` = { title/subtitle/heading/text/extra/cta/sub/tag(i) }
   When ed=undefined → read-only (thumbnails)
══════════════════ */

/* vivid / xhs */
const XhsCover = ({ s, a, total, ed }) => (
  <div style={{ background: a, width: "100%", aspectRatio: "3/4", fontFamily: FF, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 32px", boxSizing: "border-box", textAlign: "center" }}>
    <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,.12)" }}/>
    <div style={{ position: "absolute", bottom: -80, left: -40, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,.07)" }}/>
    <div style={{ position: "absolute", top: 24, left: 32, right: 32, height: 1, background: "rgba(255,255,255,.3)" }}/>
    <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{ fontSize: 60, marginBottom: 16 }}>{s.emoji}</div>
      <E v={s.title} on={ed?.title} block dk style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: 14, letterSpacing: "-0.5px", textShadow: "0 2px 8px rgba(0,0,0,.15)" }}/>
      {s.subtitle && <E v={s.subtitle} on={ed?.subtitle} block dk style={{ fontSize: 14, color: "rgba(255,255,255,.88)", lineHeight: 1.6, marginBottom: 24, maxWidth: 220 }}/>}
      <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>{Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 20 : 6, height: 6, borderRadius: 3, background: i === 0 ? "#fff" : "rgba(255,255,255,.4)" }}/>)}</div>
    </div>
    <div style={{ position: "absolute", bottom: 24, left: 32, right: 32, height: 1, background: "rgba(255,255,255,.3)" }}/>
  </div>
);
const XhsContent = ({ s, a, idx, total, ed }) => (
  <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FF, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", padding: "32px 28px", boxSizing: "border-box" }}>
    <div style={{ height: 4, background: `linear-gradient(90deg,${a},${a}88)`, marginBottom: 22, borderRadius: 2 }}/>
    <div style={{ fontSize: 10, fontWeight: 700, color: a, letterSpacing: "2px", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}><span>{String(idx).padStart(2, "0")} / {String(total - 2).padStart(2, "0")}</span><div style={{ flex: 1, height: 1, background: `${a}30` }}/></div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ fontSize: 52, fontWeight: 900, color: `${a}18`, lineHeight: 1, flexShrink: 0, marginTop: -6, userSelect: "none" }}>{idx}</div>
        <div style={{ flex: 1 }}>
          <E v={s.heading} on={ed?.heading} block style={{ fontSize: 18, fontWeight: 900, color: "#111", lineHeight: 1.3, marginBottom: 10 }}/>
          <E v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#555", lineHeight: 1.85 }}/>
        </div>
      </div>
      {s.extra && <div style={{ padding: "12px 15px", background: `${a}0d`, borderRadius: 10, borderLeft: `3px solid ${a}` }}><E v={s.extra} on={ed?.extra} block style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}/></div>}
    </div>
    <div style={{ display: "flex", gap: 5, marginTop: 20, justifyContent: "center" }}>{Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? "20px" : "6px", height: 4, borderRadius: 2, background: i === idx ? a : `${a}35` }}/>)}</div>
  </div>
);
const XhsEnd = ({ s, a, ed }) => (
  <div style={{ background: a, width: "100%", aspectRatio: "3/4", fontFamily: FF, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "36px 28px", boxSizing: "border-box", textAlign: "center" }}>
    <div style={{ position: "absolute", top: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,.1)" }}/>
    <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
      <div style={{ fontSize: 44, marginBottom: 14 }}>🌟</div>
      <E v={s.cta} on={ed?.cta} block dk style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 8, lineHeight: 1.3 }}/>
      <E v={s.sub} on={ed?.sub} block dk style={{ fontSize: 13, color: "rgba(255,255,255,.8)", marginBottom: 24, lineHeight: 1.6 }}/>
      <div style={{ width: 40, height: 2, background: "rgba(255,255,255,.5)", margin: "0 auto 20px" }}/>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>{s.tags.map((t, i) => <ETag key={i} text={t} c="rgba(255,255,255,.9)" on={ed?.tag(i)}/>)}</div>
    </div>
  </div>
);

/* clean / wechat */
const WxCover = ({ s, a, total, ed }) => (
  <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FF, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 32px", boxSizing: "border-box", textAlign: "center" }}>
    <div style={{ position: "absolute", top: 18, left: 0, right: 0, display: "flex", flexDirection: "column", gap: 3, padding: "0 28px" }}><div style={{ height: 3, background: a }}/><div style={{ height: 1, background: `${a}66` }}/><div style={{ height: 1, background: `${a}33` }}/></div>
    <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: a, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{s.emoji}</div>
      <E v={s.title} on={ed?.title} block style={{ fontSize: 26, fontWeight: 900, color: "#111", lineHeight: 1.25, marginBottom: 12, letterSpacing: "-0.5px" }}/>
      {s.subtitle && <E v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 13, color: "#666", lineHeight: 1.65, marginBottom: 28, maxWidth: 200 }}/>}
      <div style={{ width: 30, height: 3, background: a, margin: "0 auto 16px" }}/>
      <div style={{ fontSize: 11, fontWeight: 700, color: a, letterSpacing: "2px" }}>微信推文</div>
    </div>
    <div style={{ position: "absolute", bottom: 18, left: 0, right: 0, display: "flex", flexDirection: "column", gap: 3, padding: "0 28px" }}><div style={{ height: 1, background: `${a}33` }}/><div style={{ height: 1, background: `${a}66` }}/><div style={{ height: 3, background: a }}/></div>
  </div>
);
const WxContent = ({ s, a, idx, total, ed }) => (
  <div style={{ background: "#fafafa", width: "100%", aspectRatio: "3/4", fontFamily: FF, position: "relative", display: "flex", flexDirection: "column", padding: "36px 30px", boxSizing: "border-box" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
      <div style={{ width: 36, height: 36, background: a, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, fontWeight: 900, flexShrink: 0 }}>{idx}</div>
      <div style={{ flex: 1, height: 1, background: "#e0e0e0" }}/><div style={{ fontSize: 11, color: "#bbb", fontWeight: 600 }}>{idx}/{total - 2}</div>
    </div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <E v={s.heading} on={ed?.heading} block style={{ fontSize: 20, fontWeight: 900, color: "#111", lineHeight: 1.3, marginBottom: 16 }}/>
      <div style={{ width: 28, height: 2, background: a, marginBottom: 18, borderRadius: 1 }}/>
      <E v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#444", lineHeight: 1.9 }}/>
      {s.extra && <div style={{ marginTop: 20, padding: "12px 14px", background: "#fff", borderRadius: 8, border: "1px solid #e8e8e8", borderLeft: `3px solid ${a}` }}><E v={s.extra} on={ed?.extra} block style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}/></div>}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 24 }}><div style={{ flex: 1, height: 1, background: "#e8e8e8" }}/><div style={{ width: 6, height: 6, borderRadius: "50%", background: a }}/><div style={{ flex: 1, height: 1, background: "#e8e8e8" }}/></div>
  </div>
);
const WxEnd = ({ s, a, ed }) => (
  <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FF, position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "36px 28px", boxSizing: "border-box", textAlign: "center" }}>
    <div style={{ width: 40, height: 3, background: a, margin: "0 auto 28px", borderRadius: 2 }}/>
    <E v={s.cta} on={ed?.cta} block style={{ fontSize: 20, fontWeight: 900, color: "#111", marginBottom: 8, lineHeight: 1.35 }}/>
    <E v={s.sub} on={ed?.sub} block style={{ fontSize: 13, color: "#888", marginBottom: 28, lineHeight: 1.6 }}/>
    <div style={{ width: "100%", height: 1, background: "#eee", marginBottom: 20 }}/>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>{s.tags.map((t, i) => <ETag key={i} text={t} c={a} on={ed?.tag(i)}/>)}</div>
    <div style={{ position: "absolute", bottom: 18, left: 0, right: 0, display: "flex", flexDirection: "column", gap: 3, padding: "0 28px" }}><div style={{ height: 1, background: "#eee" }}/><div style={{ height: 2, background: a }}/></div>
  </div>
);

/* dark */
const DkCover = ({ s, a, total, ed }) => (
  <div style={{ background: "#0e0f14", width: "100%", aspectRatio: "3/4", fontFamily: FF, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 30px", boxSizing: "border-box", textAlign: "center" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${a},transparent)` }}/>
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${a},transparent)` }}/>
    <div style={{ position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)", width: 200, height: 200, borderRadius: "50%", background: `${a}12`, filter: "blur(40px)" }}/>
    <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{ width: 64, height: 64, borderRadius: 16, border: `2px solid ${a}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 20px" }}>{s.emoji}</div>
      <E v={s.title} on={ed?.title} block dk style={{ fontSize: 26, fontWeight: 900, color: "#f0eee8", lineHeight: 1.2, marginBottom: 12, letterSpacing: "-0.5px" }}/>
      {s.subtitle && <E v={s.subtitle} on={ed?.subtitle} block dk style={{ fontSize: 13, color: "#666", lineHeight: 1.65, marginBottom: 28 }}/>}
      <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>{Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 20 : 5, height: 3, borderRadius: 2, background: i === 0 ? a : `${a}40` }}/>)}</div>
    </div>
  </div>
);
const DkContent = ({ s, a, idx, total, ed }) => (
  <div style={{ background: "#111318", width: "100%", aspectRatio: "3/4", fontFamily: FF, position: "relative", display: "flex", flexDirection: "column", padding: "34px 28px", boxSizing: "border-box" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
      <div style={{ width: 26, height: 26, border: `1.5px solid ${a}88`, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: a, flexShrink: 0 }}>{idx}</div>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${a}50,transparent)` }}/><span style={{ fontSize: 10, color: "#444", fontWeight: 600 }}>{idx}/{total - 2}</span>
    </div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
      <E v={s.heading} on={ed?.heading} block dk style={{ fontSize: 20, fontWeight: 900, color: "#f0eee8", lineHeight: 1.3 }}/>
      <div style={{ height: 1, background: `linear-gradient(90deg,${a}cc,${a}22,transparent)` }}/>
      <E v={s.text} on={ed?.text} block dk style={{ fontSize: 14, color: "#7a7878", lineHeight: 1.9 }}/>
      {s.extra && <div style={{ padding: "11px 14px", border: `1px solid ${a}33`, borderRadius: 7, background: `${a}0a` }}><E v={s.extra} on={ed?.extra} block dk style={{ fontSize: 12, color: "#666", lineHeight: 1.7 }}/></div>}
    </div>
    <div style={{ display: "flex", gap: 5, marginTop: 20, justifyContent: "center" }}>{Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? "18px" : "5px", height: 3, borderRadius: 2, background: i === idx ? a : `${a}30` }}/>)}</div>
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${a}44,transparent)` }}/>
  </div>
);
const DkEnd = ({ s, a, ed }) => (
  <div style={{ background: "#0e0f14", width: "100%", aspectRatio: "3/4", fontFamily: FF, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "36px 28px", boxSizing: "border-box", textAlign: "center" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${a},transparent)` }}/>
    <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", border: `2px solid ${a}`, margin: "0 auto 18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✦</div>
      <E v={s.cta} on={ed?.cta} block dk style={{ fontSize: 20, fontWeight: 900, color: "#f0eee8", marginBottom: 8, lineHeight: 1.3 }}/>
      <E v={s.sub} on={ed?.sub} block dk style={{ fontSize: 13, color: "#555", marginBottom: 26, lineHeight: 1.6 }}/>
      <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${a}66,transparent)`, marginBottom: 20 }}/>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>{s.tags.map((t, i) => <ETag key={i} text={t} c={`${a}cc`} on={ed?.tag(i)}/>)}</div>
    </div>
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${a},transparent)` }}/>
  </div>
);

/* paper */
const PpCover = ({ s, a, total, ed }) => (
  <div style={{ background: "#faf6ee", width: "100%", aspectRatio: "3/4", fontFamily: FF, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 30px", boxSizing: "border-box", textAlign: "center" }}>
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .06 }}><defs><pattern id="pp" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0L0 0 0 20" fill="none" stroke={a} strokeWidth=".5"/></pattern></defs><rect width="100%" height="100%" fill="url(#pp)"/></svg>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: a }}/><div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 6, background: a }}/>
    <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>{s.emoji}</div>
      <div style={{ border: `2px solid ${a}`, padding: "18px 24px", position: "relative", display: "inline-block", minWidth: 200 }}>
        {["tl", "tr", "bl", "br"].map(p => <div key={p} style={{ position: "absolute", width: 8, height: 8, background: a, ...({ tl: { top: -4, left: -4 }, tr: { top: -4, right: -4 }, bl: { bottom: -4, left: -4 }, br: { bottom: -4, right: -4 } }[p]) }}/>)}
        <E v={s.title} on={ed?.title} block style={{ fontSize: 22, fontWeight: 900, color: "#1a1510", lineHeight: 1.2, marginBottom: 6 }}/>
        {s.subtitle && <E v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}/>}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }}>{Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 18 : 5, height: 4, borderRadius: 2, background: i === 0 ? a : `${a}40` }}/>)}</div>
    </div>
  </div>
);
const PpContent = ({ s, a, idx, total, ed }) => (
  <div style={{ background: "#faf6ee", width: "100%", aspectRatio: "3/4", fontFamily: FF, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", padding: "32px 28px", boxSizing: "border-box" }}>
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .05 }}><defs><pattern id="pp2" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0L0 0 0 20" fill="none" stroke={a} strokeWidth=".5"/></pattern></defs><rect width="100%" height="100%" fill="url(#pp2)"/></svg>
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: a, zIndex: 1 }}/>
    <div style={{ paddingLeft: 16, position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}><span style={{ fontSize: 10, fontWeight: 700, color: a, letterSpacing: "2px" }}>No.{idx}</span><div style={{ flex: 1, height: 1, background: `${a}40` }}/><span style={{ fontSize: 10, color: "#aaa" }}>{idx}/{total - 2}</span></div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}><span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1 }}>{"📌✏️📎🗝️".split("").filter((_, j) => j % 2 === 0)[(idx - 1) % 4]}</span><E v={s.heading} on={ed?.heading} block style={{ fontSize: 19, fontWeight: 900, color: "#1a1510", lineHeight: 1.3 }}/></div>
        <svg width="100%" height="8" viewBox="0 0 200 8" preserveAspectRatio="none"><path d={`M0 4 ${Array.from({ length: 16 }, (_, i) => `Q${i * 13 + 6} ${i % 2 ? 8 : 0} ${(i + 1) * 13} 4`).join(" ")}`} stroke={a} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
        <E v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#444", lineHeight: 1.9 }}/>
        {s.extra && <div style={{ padding: "10px 12px", background: `${a}14`, borderRadius: 6 }}><E v={s.extra} on={ed?.extra} block style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}/></div>}
      </div>
      <div style={{ display: "flex", gap: 5, marginTop: 18 }}>{Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? "18px" : "5px", height: 4, borderRadius: 2, background: i === idx ? a : `${a}30` }}/>)}</div>
    </div>
  </div>
);
const PpEnd = ({ s, a, ed }) => (
  <div style={{ background: "#faf6ee", width: "100%", aspectRatio: "3/4", fontFamily: FF, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "36px 28px", boxSizing: "border-box", textAlign: "center" }}>
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .05 }}><defs><pattern id="pp3" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0L0 0 0 20" fill="none" stroke={a} strokeWidth=".5"/></pattern></defs><rect width="100%" height="100%" fill="url(#pp3)"/></svg>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: a }}/><div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 5, background: a }}/>
    <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
      <div style={{ fontSize: 40, marginBottom: 14 }}>🌿</div>
      <E v={s.cta} on={ed?.cta} block style={{ fontSize: 20, fontWeight: 900, color: "#1a1510", marginBottom: 6, lineHeight: 1.3 }}/>
      <E v={s.sub} on={ed?.sub} block style={{ fontSize: 13, color: "#666", marginBottom: 22, lineHeight: 1.6 }}/>
      <svg width="160" height="8" viewBox="0 0 160 8" style={{ display: "block", margin: "0 auto 18px" }}><path d="M0 4 Q20 0 40 4 Q60 8 80 4 Q100 0 120 4 Q140 8 160 4" stroke={a} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>{s.tags.map((t, i) => <ETag key={i} text={t} c={a} on={ed?.tag(i)}/>)}</div>
    </div>
  </div>
);

/* editorial */
const EdCover = ({ s, a, total, ed }) => (
  <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FF, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
    <div style={{ background: a, flex: "0 0 55%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "28px 28px 22px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: -50, top: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,.1)" }}/>
      <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,.6)", letterSpacing: "3px", marginBottom: 8 }}>ISSUE · {s.emoji}</div>
      <E v={s.title} on={ed?.title} block dk style={{ fontSize: 26, fontWeight: 900, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.5px" }}/>
    </div>
    <div style={{ flex: 1, padding: "20px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      {s.subtitle && <E v={s.subtitle} on={ed?.subtitle} block style={{ fontSize: 13, color: "#555", lineHeight: 1.65 }}/>}
      <div><div style={{ height: 2, background: a, width: 36, marginBottom: 14 }}/><div style={{ display: "flex", gap: 5 }}>{Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 18 : 5, height: 3, borderRadius: 2, background: i === 0 ? a : `${a}40` }}/>)}</div></div>
    </div>
  </div>
);
const EdContent = ({ s, a, idx, total, ed }) => (
  <div style={{ background: "#faf8f4", width: "100%", aspectRatio: "3/4", fontFamily: FF, position: "relative", display: "flex", flexDirection: "column", padding: "32px 28px", boxSizing: "border-box" }}>
    <div style={{ height: 3, background: `linear-gradient(90deg,${a} 50%,transparent)`, marginBottom: 22 }}/>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}><span style={{ fontSize: 10, fontWeight: 800, color: a, letterSpacing: "2px" }}>P.{String(idx).padStart(2, "0")}</span><div style={{ flex: 1, height: 1, background: "#ddd" }}/><span style={{ fontSize: 10, color: "#bbb" }}>{idx}/{total - 2}</span></div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
      <div><E v={s.heading} on={ed?.heading} block style={{ fontSize: 20, fontWeight: 900, color: "#111", lineHeight: 1.3, marginBottom: 8 }}/><div style={{ height: 2, background: a, width: 30, marginBottom: 14 }}/></div>
      <svg width="100%" height="8" viewBox="0 0 200 8" preserveAspectRatio="none"><line x1="0" y1="3" x2="200" y2="3" stroke={a} strokeWidth="2"/><line x1="0" y1="7" x2="200" y2="7" stroke={a} strokeWidth="0.8" strokeOpacity=".35"/></svg>
      <E v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#444", lineHeight: 1.9 }}/>
      {s.extra && <div style={{ padding: "10px 14px", background: a + "12", borderLeft: `3px solid ${a}`, borderRadius: "0 6px 6px 0" }}><E v={s.extra} on={ed?.extra} block style={{ fontSize: 12, color: "#555", lineHeight: 1.7, fontStyle: "italic" }}/></div>}
    </div>
    <div style={{ display: "flex", gap: 5, marginTop: 18 }}>{Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? "18px" : "5px", height: 3, borderRadius: 2, background: i === idx ? a : `${a}30` }}/>)}</div>
  </div>
);
const EdEnd = ({ s, a, ed }) => (
  <div style={{ background: "#faf8f4", width: "100%", aspectRatio: "3/4", fontFamily: FF, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "36px 28px", boxSizing: "border-box", textAlign: "center" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: a }}/><div style={{ position: "absolute", top: 7, left: 0, right: 0, height: 1, background: `${a}55` }}/>
    <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: a, letterSpacing: "4px", marginBottom: 22 }}>— THE END —</div>
      <E v={s.cta} on={ed?.cta} block style={{ fontSize: 22, fontWeight: 900, color: "#111", marginBottom: 8, lineHeight: 1.3 }}/>
      <E v={s.sub} on={ed?.sub} block style={{ fontSize: 13, color: "#777", marginBottom: 24, lineHeight: 1.6, fontStyle: "italic" }}/>
      <div style={{ height: 1, background: "#ddd", marginBottom: 18 }}/>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>{s.tags.map((t, i) => <ETag key={i} text={t} c={a} on={ed?.tag(i)}/>)}</div>
    </div>
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: a }}/>
  </div>
);

/* gradient */
const GrCover = ({ s, a, total, ed }) => (
  <div style={{ background: `linear-gradient(145deg,${a} 0%,${a}bb 60%,#111 100%)`, width: "100%", aspectRatio: "3/4", fontFamily: FF, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 30px", boxSizing: "border-box", textAlign: "center" }}>
    <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 250, height: 250, borderRadius: "50%", background: "rgba(255,255,255,.08)", filter: "blur(30px)" }}/>
    <div style={{ position: "absolute", inset: 16, border: "1px solid rgba(255,255,255,.15)", borderRadius: 8, pointerEvents: "none" }}/>
    <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{ fontSize: 56, marginBottom: 18 }}>{s.emoji}</div>
      <E v={s.title} on={ed?.title} block dk style={{ fontSize: 26, fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: 12, letterSpacing: "-0.5px" }}/>
      {s.subtitle && <E v={s.subtitle} on={ed?.subtitle} block dk style={{ fontSize: 13, color: "rgba(255,255,255,.75)", lineHeight: 1.65, marginBottom: 26 }}/>}
      <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>{Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === 0 ? 18 : 5, height: 3, borderRadius: 2, background: i === 0 ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.3)" }}/>)}</div>
    </div>
  </div>
);
const GrContent = ({ s, a, idx, total, ed }) => (
  <div style={{ background: "#fff", width: "100%", aspectRatio: "3/4", fontFamily: FF, position: "relative", display: "flex", flexDirection: "column", overflow: "hidden" }}>
    <div style={{ height: 5, background: `linear-gradient(90deg,${a},${a}55,transparent)` }}/>
    <div style={{ flex: 1, padding: "26px 28px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${a},${a}99)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 900 }}>{idx}</div>
        <div style={{ width: 1, height: 20, background: "#eee" }}/><span style={{ fontSize: 10, color: "#aaa", fontWeight: 600, letterSpacing: "1px" }}>0{idx} / 0{total - 2}</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
        <E v={s.heading} on={ed?.heading} block style={{ fontSize: 21, fontWeight: 900, color: "#111", lineHeight: 1.3 }}/>
        <div style={{ display: "flex", gap: 3 }}><div style={{ width: 24, height: 3, borderRadius: 2, background: a }}/><div style={{ width: 8, height: 3, borderRadius: 2, background: `${a}55` }}/><div style={{ width: 4, height: 3, borderRadius: 2, background: `${a}25` }}/></div>
        <E v={s.text} on={ed?.text} block style={{ fontSize: 14, color: "#555", lineHeight: 1.9 }}/>
        {s.extra && <div style={{ padding: "11px 14px", background: `linear-gradient(135deg,${a}10,${a}04)`, borderRadius: 10, border: `1px solid ${a}22` }}><E v={s.extra} on={ed?.extra} block style={{ fontSize: 12, color: "#666", lineHeight: 1.7 }}/></div>}
      </div>
      <div style={{ display: "flex", gap: 5, marginTop: 18, justifyContent: "center" }}>{Array.from({ length: total }).map((_, i) => <div key={i} style={{ width: i === idx ? "18px" : "5px", height: 3, borderRadius: 2, background: i === idx ? a : `${a}25` }}/>)}</div>
    </div>
  </div>
);
const GrEnd = ({ s, a, ed }) => (
  <div style={{ background: `linear-gradient(145deg,#111 0%,${a}99 100%)`, width: "100%", aspectRatio: "3/4", fontFamily: FF, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "36px 28px", boxSizing: "border-box", textAlign: "center" }}>
    <div style={{ position: "absolute", inset: 16, border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, pointerEvents: "none" }}/>
    <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", margin: "0 auto 18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🌟</div>
      <E v={s.cta} on={ed?.cta} block dk style={{ fontSize: 21, fontWeight: 900, color: "#fff", marginBottom: 8, lineHeight: 1.3 }}/>
      <E v={s.sub} on={ed?.sub} block dk style={{ fontSize: 13, color: "rgba(255,255,255,.65)", marginBottom: 26, lineHeight: 1.6 }}/>
      <div style={{ height: 1, background: "rgba(255,255,255,.15)", marginBottom: 20 }}/>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>{s.tags.map((t, i) => <ETag key={i} text={t} c="rgba(255,255,255,.8)" on={ed?.tag(i)}/>)}</div>
    </div>
  </div>
);

/* ══════════════════ CONFIG ══════════════════ */
const SPLIT_STYLES = [
  { id: "vivid",     name: "撞色块", icon: "🎨", desc: "满版色 + 白内容" },
  { id: "clean",     name: "极简线", icon: "✦",  desc: "白底 + 色块序号" },
  { id: "dark",      name: "暗夜风", icon: "🌙", desc: "深色 + 发光线" },
  { id: "paper",     name: "手账风", icon: "📮", desc: "格纹底 + 邮票框" },
  { id: "editorial", name: "杂志风", icon: "📰", desc: "分色块 + 双线" },
  { id: "gradient",  name: "渐变风", icon: "🌅", desc: "渐变封面 + 白内容" },
];
const TEMPLATES = [
  { id: "editorial", name: "杂志风", icon: "📰", desc: "左色条 + 双线" },
  { id: "notecard",  name: "便签风", icon: "🗒",  desc: "虚线边框 + 星点" },
  { id: "minimal",   name: "极简线", icon: "✦",  desc: "圆点编号 + 下划" },
  { id: "stamp",     name: "手账风", icon: "📮", desc: "格纹底 + 邮票框" },
  { id: "bold",      name: "撞色块", icon: "🎨", desc: "色块标题 + 白底" },
  { id: "dark",      name: "暗夜风", icon: "🌙", desc: "深色底 + 发光线" },
  { id: "newspaper", name: "报纸风", icon: "📜", desc: "双线报头 + 序号" },
  { id: "film",      name: "胶片风", icon: "🎞", desc: "胶片孔 + 色条" },
  { id: "label",     name: "标签风", icon: "🏷", desc: "价签形 + 打孔" },
];
const PALETTES = [
  { id: "coral", label: "珊瑚", a: "#e05a4b", bg: "#fff8f6", tc: "#2a1210", bc: "#4a3330" },
  { id: "sage",  label: "抹茶", a: "#4a7c59", bg: "#f4faf6", tc: "#172312", bc: "#344d38" },
  { id: "ink",   label: "水墨", a: "#2d3561", bg: "#f4f5fb", tc: "#0f1220", bc: "#333650" },
  { id: "amber", label: "琥珀", a: "#c47c2b", bg: "#fffbf4", tc: "#1f1508", bc: "#4a3010" },
  { id: "plum",  label: "梅子", a: "#8b3a62", bg: "#fdf4f8", tc: "#2a1020", bc: "#4a2a38" },
  { id: "slate", label: "青石", a: "#4a7c8a", bg: "#f4fafb", tc: "#101e22", bc: "#2a3e44" },
  { id: "rust",  label: "铁锈", a: "#a0522d", bg: "#fef8f4", tc: "#200e08", bc: "#4a2818" },
  { id: "pine",  label: "松针", a: "#2d6a4f", bg: "#f0faf5", tc: "#0a1e14", bc: "#1e4432" },
];

/* ══════════════════ APP ══════════════════ */
export default function App() {
  const [mode,        setMode]        = useState("single");
  const [platform,    setPlatform]    = useState("xhs");
  const [splitStyle,  setSplitStyle]  = useState("vivid");
  const [input,       setInput]       = useState("");
  const [tpl,         setTpl]         = useState("editorial");
  const [palId,       setPalId]       = useState("coral");
  const [loading,     setLoading]     = useState(false);
  const [singleData,  setSingleData]  = useState(null);
  const [slides,      setSlides]      = useState(null);
  const [slideIdx,    setSlideIdx]    = useState(0);
  const [error,       setError]       = useState("");
  const [exporting,   setExporting]   = useState(false);
  const [expMsg,      setExpMsg]      = useState("");
  const cardRef   = useRef(null);
  const slideRefs = useRef([]);
  const h2cOk     = useH2C();
  const P = PALETTES.find(p => p.id === palId) || PALETTES[0];

  /* ── State updaters ── */
  const updateSingle       = useCallback((field, val)           => setSingleData(prev => ({ ...prev, [field]: val })), []);
  const updateSingleSecH   = useCallback((i, val)               => setSingleData(prev => ({ ...prev, sections: prev.sections.map((s, j) => j === i ? { ...s, heading: val } : s) })), []);
  const updateSingleSecT   = useCallback((i, val)               => setSingleData(prev => ({ ...prev, sections: prev.sections.map((s, j) => j === i ? { ...s, text: val } : s) })), []);
  const updateSingleTag    = useCallback((i, val)               => setSingleData(prev => { const t = [...prev.tags]; t[i] = val; return { ...prev, tags: t }; }), []);
  const updateSlide        = useCallback((idx, field, val)      => setSlides(prev => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s)), []);
  const updateSlideTag     = useCallback((sIdx, tIdx, val)      => setSlides(prev => prev.map((s, i) => { if (i !== sIdx) return s; const t = [...(s.tags || [])]; t[tIdx] = val; return { ...s, tags: t }; })), []);

  /* ── Drag reorder ── */
  const sectionDrag = useDragReorder(
    singleData?.sections || [],
    sections => setSingleData(prev => prev ? { ...prev, sections } : prev)
  );
  const slideDrag = useDragReorder(
    slides || [],
    setSlides
  );

  /* ── Build editor objects ── */
  const singleEd = singleData ? {
    title: v => updateSingle("title", v),
    lead:  v => updateSingle("lead", v),
    tip:   v => updateSingle("tip", v),
    secH:  i => v => updateSingleSecH(i, v),
    secT:  i => v => updateSingleSecT(i, v),
    tag:   i => v => updateSingleTag(i, v),
  } : null;

  const makeSlideEd = idx => ({
    title:    v => updateSlide(idx, "title", v),
    subtitle: v => updateSlide(idx, "subtitle", v),
    heading:  v => updateSlide(idx, "heading", v),
    text:     v => updateSlide(idx, "text", v),
    extra:    v => updateSlide(idx, "extra", v),
    cta:      v => updateSlide(idx, "cta", v),
    sub:      v => updateSlide(idx, "sub", v),
    tag:      ti => v => updateSlideTag(idx, ti, v),
  });

  /* ── Generate ── */
  const generate = useCallback(async () => {
    if (!input.trim()) return;
    setLoading(true); setError("");
    setSingleData(null); setSlides(null); setSlideIdx(0);

    if (mode === "single") {
      const sys = `你是小红书爆款文案排版专家。将用户的文案转化为结构化排版内容。严格只返回 JSON，不要任何 markdown：{"emoji":"1个emoji","category":"分类4字内","title":"爆款标题18字内","lead":"一句话导语25字内","sections":[{"heading":"8字内","text":"40-70字"},{"heading":"...","text":"..."},{"heading":"...","text":"..."}],"tip":"小贴士20-30字","tags":["标签1","标签2","标签3","标签4","标签5"]}`;
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: sys, messages: [{ role: "user", content: input }] }) });
        const json = await res.json();
        const txt = json.content?.map(c => c.text || "").join("").replace(/```json|```/g, "").trim();
        setSingleData(JSON.parse(txt));
      } catch { setError("生成失败，请重试"); }
      finally { setLoading(false); }
    } else {
      const sys = platform === "xhs"
        ? `你是小红书爆款内容策划专家。请用小红书的风格将用户文案拆分为多张图文卡片。
【小红书风格】封面标题必须有强烈情绪冲击，用感叹号/疑问句/数字/反差吸引眼球。语气亲切口语化，像朋友分享。内容卡heading带emoji。结尾引导点赞收藏评论。
严格只返回JSON：{"slides":[{"type":"cover","emoji":"emoji","title":"有冲击力封面标题15字内","subtitle":"钩子副标题25字内"},{"type":"content","heading":"emoji+标题8字内","text":"口语化正文50字内","extra":"划重点金句20字内"},{"type":"content","heading":"...","text":"..."},{"type":"end","cta":"互动结尾语15字内","sub":"轻松活泼副文案20字内","tags":["热门话题1","话题2","话题3","话题4","话题5"]}]}`
        : `你是微信公众号专业内容编辑。请用微信图文风格将用户文案拆分为多张分页卡片。
【微信风格】封面标题专业清晰权威，传递核心价值，避免浮夸。语气专业理性，结构清晰。heading简洁准确不用emoji。extra为延伸思考或数据支撑。结尾引导收藏转发。
严格只返回JSON：{"slides":[{"type":"cover","emoji":"emoji","title":"专业清晰标题15字内","subtitle":"明确指出受益人群和核心价值25字内"},{"type":"content","heading":"简洁小标题无emoji8字内","text":"专业正文50字内","extra":"延伸思考或数据支撑20字内"},{"type":"content","heading":"...","text":"..."},{"type":"end","cta":"引导收藏转发15字内","sub":"专业结语20字内","tags":["专业关键词1","词2","词3","词4","词5"]}]}`;
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1200, system: sys, messages: [{ role: "user", content: input }] }) });
        const json = await res.json();
        const txt = json.content?.map(c => c.text || "").join("").replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(txt);
        setSlides(parsed.slides);
        slideRefs.current = new Array(parsed.slides.length).fill(null);
      } catch { setError("生成失败，请重试"); }
      finally { setLoading(false); }
    }
  }, [input, mode, platform]);

  /* ── Export helpers ── */
  const snap = async (el, scale) => {
    const ps = el.style.boxShadow; el.style.boxShadow = "none";
    const c = await window.html2canvas(el, { scale, useCORS: true, backgroundColor: null, logging: false });
    el.style.boxShadow = ps; return c;
  };
  const exportSingle = useCallback(async (scale = 2) => {
    if (!cardRef.current || !window.html2canvas) return;
    setExporting(true); setExpMsg("渲染中…");
    try {
      const c = await snap(cardRef.current, scale);
      const name = (singleData?.title || "排版").replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "");
      const a = document.createElement("a"); a.download = `${name}_${scale}x.png`; a.href = c.toDataURL("image/png", 1); a.click();
      setExpMsg("✓ 已保存"); setTimeout(() => setExpMsg(""), 2000);
    } catch { setExpMsg("导出失败"); setTimeout(() => setExpMsg(""), 2000); }
    finally { setExporting(false); }
  }, [singleData]);

  const exportSlide = useCallback(async (idx, scale = 2) => {
    const el = slideRefs.current[idx]; if (!el || !window.html2canvas) return;
    setExporting(true); setExpMsg("渲染中…");
    try {
      const c = await snap(el, scale);
      const a = document.createElement("a"); a.download = `slide_${idx + 1}_${scale}x.png`; a.href = c.toDataURL("image/png", 1); a.click();
      setExpMsg("✓ 已保存"); setTimeout(() => setExpMsg(""), 1500);
    } catch { setExpMsg("导出失败"); setTimeout(() => setExpMsg(""), 2000); }
    finally { setExporting(false); }
  }, []);

  const exportAll = useCallback(async (scale = 2) => {
    if (!slides || !window.html2canvas) return;
    setExporting(true);
    for (let i = 0; i < slides.length; i++) {
      setExpMsg(`导出 ${i + 1}/${slides.length}…`);
      const el = slideRefs.current[i]; if (!el) continue;
      try { const c = await snap(el, scale); const a = document.createElement("a"); a.download = `slide_${i + 1}.png`; a.href = c.toDataURL("image/png", 1); a.click(); await new Promise(r => setTimeout(r, 400)); } catch {}
    }
    setExpMsg("✓ 全部完成"); setTimeout(() => setExpMsg(""), 2500); setExporting(false);
  }, [slides]);

  /* ── Render split slide ── */
  const renderSlide = (s, i, total, ed) => {
    const a = P.a, bg = P.bg, sty = splitStyle;
    const p = { s, a, bg, total, idx: i, ed };
    if (sty === "vivid")     { if (s.type === "cover") return <XhsCover   {...p} key={i}/>; if (s.type === "content") return <XhsContent {...p} key={i}/>; return <XhsEnd     {...p} key={i}/>; }
    if (sty === "clean")     { if (s.type === "cover") return <WxCover    {...p} key={i}/>; if (s.type === "content") return <WxContent  {...p} key={i}/>; return <WxEnd      {...p} key={i}/>; }
    if (sty === "dark")      { if (s.type === "cover") return <DkCover    {...p} key={i}/>; if (s.type === "content") return <DkContent  {...p} key={i}/>; return <DkEnd      {...p} key={i}/>; }
    if (sty === "paper")     { if (s.type === "cover") return <PpCover    {...p} key={i}/>; if (s.type === "content") return <PpContent  {...p} key={i}/>; return <PpEnd      {...p} key={i}/>; }
    if (sty === "editorial") { if (s.type === "cover") return <EdCover    {...p} key={i}/>; if (s.type === "content") return <EdContent  {...p} key={i}/>; return <EdEnd      {...p} key={i}/>; }
    if (sty === "gradient")  { if (s.type === "cover") return <GrCover    {...p} key={i}/>; if (s.type === "content") return <GrContent  {...p} key={i}/>; return <GrEnd      {...p} key={i}/>; }
    return null;
  };

  const CardRenderer = SINGLE_RENDERERS[tpl];
  const cd = singleData ? { ...singleData, a: P.a, bg: P.bg, tc: P.tc, bc: P.bc } : null;
  const br = { notecard: 18, bold: 14, label: 12, film: 0, newspaper: 0 }[tpl] ?? 4;

  return (
    <>
      <style>{`
        *{box-sizing:border-box}
        @keyframes xdot{0%,80%,100%{transform:scale(0);opacity:.3}40%{transform:scale(1);opacity:1}}
        @keyframes rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .ef{border-radius:3px;transition:background .15s;cursor:text;outline:none!important;display:inline}
        .ef:hover{background:rgba(0,0,0,.05)}
        .ef:focus{background:rgba(0,0,0,.08);box-shadow:0 0 0 1.5px rgba(0,0,0,.12)}
        .efdk:hover{background:rgba(255,255,255,.09)}
        .efdk:focus{background:rgba(255,255,255,.14);box-shadow:0 0 0 1.5px rgba(255,255,255,.2)}
        .genbtn{transition:transform .2s,box-shadow .2s}
        .genbtn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 26px ${P.a}55}
        .genbtn:active:not(:disabled){transform:translateY(0)}
        .tbtn,.ssbtn{transition:all .15s;cursor:pointer}
        .tbtn:hover{background:#f4f4f4!important}
        .pdot{transition:transform .15s;cursor:pointer}
        .pdot:hover{transform:scale(1.15)}
        .sldthumb{transition:all .15s;cursor:pointer}
        .sldthumb:hover{transform:scale(1.04)}
        textarea:focus{outline:none;border-color:${P.a}!important;box-shadow:0 0 0 3px ${P.a}22}
        .navbtn{transition:all .15s;cursor:pointer}
        .navbtn:hover:not(:disabled){background:${P.a}!important;color:#fff!important}
        .navbtn:disabled{opacity:.3;cursor:not-allowed}
        .drag-row{position:relative}
        .drag-row:hover>.dh{opacity:1!important}
        .drag-row:hover>.dh:hover{background:rgba(0,0,0,.07);color:#888}
        .drag-row{cursor:default}
      `}</style>

      <div style={{ minHeight: "100vh", background: "#edeae6", padding: "28px 16px", fontFamily: FF }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: "#1a1510", margin: "0 0 4px", letterSpacing: "-0.5px" }}>小红书排版生成器</h1>
            <p style={{ fontSize: 12, color: "#999", margin: 0 }}>9 种模板 · 8 套配色 · 分页拆分 · <span style={{ color: P.a, fontWeight: 700 }}>点击文字可直接编辑</span></p>
          </div>

          {/* Mode toggle */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
            <div style={{ display: "flex", background: "#fff", borderRadius: 12, padding: 4, gap: 4, boxShadow: "0 2px 10px rgba(0,0,0,.07)" }}>
              {[{ v: "single", label: "📄 完整版" }, { v: "split", label: "📑 分页版" }].map(m => (
                <button key={m.v} onClick={() => { setMode(m.v); setSingleData(null); setSlides(null); }}
                  style={{ padding: "8px 22px", borderRadius: 9, border: "none", background: mode === m.v ? P.a : "transparent", color: mode === m.v ? "#fff" : "#666", fontSize: 13, fontWeight: 800, cursor: "pointer", transition: "all .2s" }}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 18, alignItems: "start" }}>

            {/* ═══ LEFT ═══ */}
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {/* 输入 */}
              <div style={{ background: "#fff", borderRadius: 13, padding: 17, boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#555", letterSpacing: "1px", marginBottom: 8 }}>✍️ 文案 / 话题</div>
                <textarea value={input} onChange={e => setInput(e.target.value)}
                  placeholder={"例如：推荐一款奶油肌底妆，\n遮瑕力强、持妆久、不闷痘…"}
                  rows={4} style={{ width: "100%", border: "1.5px solid #eee", borderRadius: 8, padding: "10px 11px", fontSize: 13, lineHeight: 1.7, resize: "vertical", color: "#333", background: "#fafafa", transition: "all .2s", fontFamily: "inherit" }}/>
              </div>

              {/* 分页：平台 */}
              {mode === "split" && (
                <div style={{ background: "#fff", borderRadius: 13, padding: 17, boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#555", letterSpacing: "1px", marginBottom: 11 }}>📱 发布平台</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[{ v: "xhs", icon: "📕", name: "小红书", desc: "情绪化 · 口语风" }, { v: "wechat", icon: "💬", name: "微信推文", desc: "专业 · 权威感" }].map(p => (
                      <button key={p.v} onClick={() => setPlatform(p.v)} className="ssbtn"
                        style={{ padding: "11px 8px", borderRadius: 10, border: `1.5px solid ${platform === p.v ? P.a : "#eee"}`, background: platform === p.v ? P.a + "10" : "#fafafa", cursor: "pointer", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                        <span style={{ fontSize: 22 }}>{p.icon}</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: platform === p.v ? P.a : "#444" }}>{p.name}</span>
                        <span style={{ fontSize: 10, color: "#aaa" }}>{p.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 分页：卡片风格 */}
              {mode === "split" && (
                <div style={{ background: "#fff", borderRadius: 13, padding: 17, boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#555", letterSpacing: "1px", marginBottom: 11 }}>🖼 卡片风格</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                    {SPLIT_STYLES.map(st => (
                      <button key={st.id} className="tbtn" onClick={() => setSplitStyle(st.id)}
                        style={{ padding: "8px 5px", borderRadius: 8, border: `1.5px solid ${splitStyle === st.id ? P.a : "#eee"}`, background: splitStyle === st.id ? P.a + "10" : "#fafafa", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <span style={{ fontSize: 18 }}>{st.icon}</span>
                        <span style={{ fontSize: 10, fontWeight: splitStyle === st.id ? 800 : 600, color: splitStyle === st.id ? P.a : "#555", lineHeight: 1.2 }}>{st.name}</span>
                        <span style={{ fontSize: 9, color: "#bbb", lineHeight: 1.2 }}>{st.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 完整：模板 */}
              {mode === "single" && (
                <div style={{ background: "#fff", borderRadius: 13, padding: 17, boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#555", letterSpacing: "1px", marginBottom: 10 }}>🗂 模板</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                    {TEMPLATES.map(t => (
                      <button key={t.id} className="tbtn" onClick={() => setTpl(t.id)}
                        style={{ padding: "8px 5px", borderRadius: 8, border: `1.5px solid ${tpl === t.id ? P.a : "#eee"}`, background: tpl === t.id ? P.a + "10" : "#fafafa", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <span style={{ fontSize: 18 }}>{t.icon}</span>
                        <span style={{ fontSize: 10, fontWeight: tpl === t.id ? 800 : 600, color: tpl === t.id ? P.a : "#555", lineHeight: 1.2 }}>{t.name}</span>
                        <span style={{ fontSize: 9, color: "#bbb", lineHeight: 1.2 }}>{t.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 配色 */}
              <div style={{ background: "#fff", borderRadius: 13, padding: 17, boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#555", letterSpacing: "1px", marginBottom: 10 }}>🎨 配色</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {PALETTES.map(p => <button key={p.id} className="pdot" onClick={() => setPalId(p.id)} title={p.label} style={{ width: 30, height: 30, borderRadius: "50%", background: p.a, border: `3px solid ${palId === p.id ? p.a : "transparent"}`, outline: palId === p.id ? `2px solid ${p.a}55` : "none", outlineOffset: 2, padding: 0, cursor: "pointer" }}/>)}
                </div>
                <div style={{ fontSize: 10, color: P.a, fontWeight: 700, marginTop: 7 }}>{P.label}</div>
              </div>

              {/* 生成 */}
              <button className="genbtn" onClick={generate} disabled={loading || !input.trim()}
                style={{ padding: "13px", borderRadius: 11, border: "none", background: loading || !input.trim() ? "#ccc" : P.a, color: "#fff", fontSize: 14, fontWeight: 800, cursor: loading || !input.trim() ? "not-allowed" : "pointer", letterSpacing: "0.5px" }}>
                {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>AI 生成中 <Dots/></span> : mode === "single" ? "✦ 生成排版图" : "✦ 生成分页卡片"}
              </button>
              {error && <p style={{ fontSize: 12, color: "#e05a4b", textAlign: "center", margin: 0 }}>{error}</p>}
            </div>

            {/* ═══ RIGHT ═══ */}
            <div>

              {/* ── 完整版 ── */}
              {mode === "single" && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "1px" }}>预览</span>
                    {cd && (
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        {expMsg && <span style={{ fontSize: 11, fontWeight: 700, color: expMsg.startsWith("✓") ? "#4a7c59" : "#aaa" }}>{expMsg}</span>}
                        <button onClick={() => exportSingle(2)} disabled={exporting || !h2cOk} style={{ padding: "5px 11px", borderRadius: 6, border: `1px solid ${P.a}`, background: "#fff", color: P.a, fontSize: 11, fontWeight: 800, cursor: "pointer", opacity: exporting ? .6 : 1 }}>{exporting ? <Dots/> : "⬇ 2x"}</button>
                        <button onClick={() => exportSingle(3)} disabled={exporting || !h2cOk} style={{ padding: "5px 11px", borderRadius: 6, border: "none", background: P.a, color: "#fff", fontSize: 11, fontWeight: 800, cursor: "pointer", opacity: exporting ? .6 : 1 }}>{exporting ? <Dots/> : "⬇ 高清 3x"}</button>
                      </div>
                    )}
                  </div>
                  {!cd && !loading && <div style={{ background: "#fff", borderRadius: 13, minHeight: 460, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dashed #ddd", color: "#ccc", gap: 8 }}><span style={{ fontSize: 38 }}>🖼️</span><span style={{ fontSize: 13 }}>排版预览将在这里显示</span></div>}
                  {loading && <div style={{ background: "#fff", borderRadius: 13, minHeight: 460, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dashed #ddd", gap: 10 }}><span style={{ fontSize: 30 }}>✦</span><span style={{ fontSize: 13, color: "#aaa" }}>正在生成</span><Dots/></div>}
                  {cd && !loading && (
                    <div ref={cardRef} style={{ animation: "rise .35s ease", overflow: "hidden", boxShadow: "0 8px 36px rgba(0,0,0,.12)", borderRadius: br }}>
                      <CardRenderer d={cd} ed={singleEd} drag={singleData ? sectionDrag : undefined}/>
                    </div>
                  )}
                </>
              )}

              {/* ── 分页版 ── */}
              {mode === "split" && (
                <>
                  {!slides && !loading && <div style={{ background: "#fff", borderRadius: 13, minHeight: 460, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dashed #ddd", color: "#ccc", gap: 8 }}><span style={{ fontSize: 38 }}>📑</span><span style={{ fontSize: 13 }}>分页卡片将在这里显示</span></div>}
                  {loading && <div style={{ background: "#fff", borderRadius: 13, minHeight: 460, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dashed #ddd", gap: 10 }}><span style={{ fontSize: 30 }}>✦</span><span style={{ fontSize: 13, color: "#aaa" }}>正在生成分页卡片</span><Dots/></div>}
                  {slides && !loading && (
                    <div style={{ animation: "rise .35s ease" }}>
                      {/* 工具栏 */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "1px" }}>{slideIdx + 1} / {slides.length} 张</span>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          {expMsg && <span style={{ fontSize: 11, fontWeight: 700, color: expMsg.startsWith("✓") ? "#4a7c59" : "#888" }}>{expMsg}</span>}
                          <button onClick={() => exportSlide(slideIdx, 2)} disabled={exporting || !h2cOk} style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${P.a}`, background: "#fff", color: P.a, fontSize: 11, fontWeight: 800, cursor: "pointer", opacity: exporting ? .6 : 1 }}>{exporting ? <Dots/> : "⬇ 当前页"}</button>
                          <button onClick={() => exportAll(2)} disabled={exporting || !h2cOk} style={{ padding: "5px 10px", borderRadius: 6, border: "none", background: P.a, color: "#fff", fontSize: 11, fontWeight: 800, cursor: "pointer", opacity: exporting ? .6 : 1 }}>{exporting ? <Dots/> : "⬇ 导出全部"}</button>
                        </div>
                      </div>

                      {/* 主预览 */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                        <button className="navbtn" onClick={() => setSlideIdx(i => Math.max(0, i - 1))} disabled={slideIdx === 0}
                          style={{ width: 32, height: 32, borderRadius: "50%", border: `1.5px solid ${P.a}`, background: "#fff", color: P.a, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: 0 }}>‹</button>
                        <div style={{ flex: 1, overflow: "hidden", boxShadow: "0 6px 28px rgba(0,0,0,.14)", borderRadius: 12 }}>
                          <div ref={el => slideRefs.current[slideIdx] = el}>
                            {renderSlide(slides[slideIdx], slideIdx, slides.length, makeSlideEd(slideIdx))}
                          </div>
                        </div>
                        <button className="navbtn" onClick={() => setSlideIdx(i => Math.min(slides.length - 1, i + 1))} disabled={slideIdx === slides.length - 1}
                          style={{ width: 32, height: 32, borderRadius: "50%", border: `1.5px solid ${P.a}`, background: "#fff", color: P.a, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: 0 }}>›</button>
                      </div>

                      {/* 缩略图 — 拖拽排序 */}
                      <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 4, alignItems: "flex-start" }}>
                        {slides.map((s, i) => {
                          const isSlideTarget = slideDrag.target === i && slideDrag.active !== i;
                          return (
                            <div
                              key={i}
                              className="sldthumb"
                              draggable
                              onClick={() => setSlideIdx(i)}
                              onDragStart={e => { slideDrag.start(i); e.dataTransfer.effectAllowed = "move"; }}
                              onDragOver={e => { e.preventDefault(); slideDrag.over(i); }}
                              onDrop={e => { e.preventDefault(); slideDrag.drop(); if (slideDrag.target !== null) setSlideIdx(slideDrag.target > slideDrag.active ? slideDrag.target - 1 : slideDrag.target); }}
                              onDragEnd={slideDrag.cancel}
                              style={{
                                flexShrink: 0, width: 60, borderRadius: 6, overflow: "hidden",
                                boxShadow: slideIdx === i ? `0 0 0 2px ${P.a}` : isSlideTarget ? `0 0 0 2px ${P.a}88, -3px 0 0 ${P.a}` : "0 1px 4px rgba(0,0,0,.12)",
                                opacity: slideDrag.active === i ? 0.3 : slideIdx === i ? 1 : .75,
                                transition: "all .15s", background: "#fff", cursor: "grab",
                              }}
                            >
                              <div style={{ width: 60, height: 80, overflow: "hidden", position: "relative", flexShrink: 0 }}>
                                <div
                                  ref={el => { if (i !== slideIdx) slideRefs.current[i] = el; }}
                                  style={{ width: 300, transformOrigin: "top left", transform: "scale(0.2)", pointerEvents: "none", position: "absolute", top: 0, left: 0 }}
                                >
                                  {renderSlide(s, i, slides.length, undefined)}
                                </div>
                              </div>
                              <div style={{ textAlign: "center", padding: "3px 0", fontSize: 9, fontWeight: 700, color: slideIdx === i ? P.a : "#aaa", background: "#fff" }}>
                                {i === 0 ? "封" : (i === slides.length - 1 ? "尾" : i)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
