import { useRef } from "react";

/**
 * 可拖拽行组件
 * @param {Object} props
 * @param {number} props.i - 索引
 * @param {Object} props.drag - 拖拽状态
 * @param {string} props.color - 主题色
 * @param {React.ReactNode} props.children - 子元素
 * @param {Object} props.style - 样式
 */
export function DragRow({ i, drag, color, children, style }) {
  const canDrag = useRef(false);

  if (!drag) {
    return <div style={style}>{children}</div>;
  }

  const isDragging = drag.active === i;
  const isTarget = drag.target === i && !isDragging;

  return (
    <div
      draggable
      onDragStart={(e) => {
        if (!canDrag.current) {
          e.preventDefault();
          return;
        }
        drag.start(i);
        e.dataTransfer.effectAllowed = "move";
      }}
      onDragOver={(e) => {
        e.preventDefault();
        drag.over(i);
      }}
      onDrop={(e) => {
        e.preventDefault();
        drag.drop();
      }}
      onDragEnd={() => {
        canDrag.current = false;
        drag.cancel();
      }}
      className="drag-row"
      style={{
        ...style,
        position: "relative",
        opacity: isDragging ? 0.28 : 1,
        transition: "opacity .15s",
        borderTop: isTarget ? `2px dashed ${color}88` : "2px solid transparent",
        borderRadius: 4,
      }}
    >
      {/* 拖拽手柄 */}
      <span
        className="dh"
        onMouseDown={(e) => {
          e.stopPropagation();
          canDrag.current = true;
        }}
        onMouseUp={() => {
          canDrag.current = false;
        }}
        title="拖拽排序"
        style={{
          position: "absolute",
          right: 2,
          top: "50%",
          transform: "translateY(-50%)",
          width: 18,
          height: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          color: "#bbb",
          cursor: "grab",
          borderRadius: 3,
          opacity: 0,
          transition: "opacity .15s, background .1s",
          userSelect: "none",
          zIndex: 10,
        }}
      >
        ≡
      </span>
      {children}
    </div>
  );
}
