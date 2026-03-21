import { useState, useRef } from "react";

/**
 * 拖拽排序 hook
 * @param {Array} items - 项目列表
 * @param {Function} setItems - 更新项目列表的函数
 * @returns {Object} 拖拽状态和控制函数
 */
export function useDragReorder(items, setItems) {
  const [active, setActive] = useState(null);
  const [target, setTarget] = useState(null);
  const canDrag = useRef(false);

  const start = (index) => setActive(index);

  const over = (index) => {
    if (index !== active) {
      setTarget(index);
    }
  };

  const drop = () => {
    if (active !== null && target !== null && active !== target) {
      setItems((prev) => {
        const arr = [...prev];
        const [item] = arr.splice(active, 1);
        arr.splice(target > active ? target - 1 : target, 0, item);
        return arr;
      });
    }
    setActive(null);
    setTarget(null);
  };

  const cancel = () => {
    setActive(null);
    setTarget(null);
  };

  const enableDrag = () => {
    canDrag.current = true;
  };

  const disableDrag = () => {
    canDrag.current = false;
  };

  return {
    active,
    target,
    canDrag: canDrag.current,
    enableDrag,
    disableDrag,
    start,
    over,
    drop,
    cancel,
  };
}
