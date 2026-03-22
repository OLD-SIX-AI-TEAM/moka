import { useState, useEffect } from "react";

/**
 * 加载 html2canvas 库
 * @returns {boolean} 是否加载完成
 */
export function useHtml2Canvas() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (window.html2canvas) {
      setOk(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    script.onload = () => setOk(true);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return ok;
}

/**
 * 捕获元素为 canvas
 * @param {HTMLElement} el - 要捕获的元素
 * @param {number} scale - 缩放比例
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function snapElement(el, scale = 2) {
  if (!window.html2canvas) {
    throw new Error("html2canvas not loaded");
  }

  // 获取元素当前实际尺寸
  const rect = el.getBoundingClientRect();
  const actualWidth = rect.width;
  const actualHeight = rect.height;

  // 保存原始样式
  const prevBoxShadow = el.style.boxShadow;
  const prevWidth = el.style.width;
  const prevHeight = el.style.height;
  const prevMinWidth = el.style.minWidth;
  const prevMinHeight = el.style.minHeight;
  const prevMaxWidth = el.style.maxWidth;
  const prevMaxHeight = el.style.maxHeight;
  const prevBackgroundColor = el.style.backgroundColor;
  const prevBackground = el.style.background;

  // 获取计算后的背景色
  const computedStyle = window.getComputedStyle(el);
  const computedBg = computedStyle.backgroundColor;
  const hasExplicitBg = computedBg && computedBg !== "rgba(0, 0, 0, 0)" && computedBg !== "transparent";

  // 设置固定尺寸以确保导出与预览一致
  el.style.boxShadow = "none";
  el.style.width = `${actualWidth}px`;
  el.style.height = `${actualHeight}px`;
  el.style.minWidth = `${actualWidth}px`;
  el.style.minHeight = `${actualHeight}px`;
  el.style.maxWidth = `${actualWidth}px`;
  el.style.maxHeight = `${actualHeight}px`;

  // 如果没有显式背景色，设置默认白色
  if (!hasExplicitBg) {
    el.style.backgroundColor = "#ffffff";
  }

  try {
    // 强制重绘
    el.offsetHeight;

    const canvas = await window.html2canvas(el, {
      scale,
      useCORS: true,
      backgroundColor: hasExplicitBg ? null : "#ffffff",
      logging: false,
      allowTaint: true,
      foreignObjectRendering: false,
      imageTimeout: 15000,
      width: actualWidth,
      height: actualHeight,
      onclone: (clonedDoc, clonedEl) => {
        // 在克隆的元素上确保背景色正确
        const clonedStyle = window.getComputedStyle(el);
        const bg = clonedStyle.backgroundColor;
        if (!bg || bg === "rgba(0, 0, 0, 0)" || bg === "transparent") {
          clonedEl.style.backgroundColor = "#ffffff";
        }
        // 确保所有子元素也正确渲染
        const allElements = clonedEl.querySelectorAll("*");
        allElements.forEach((child) => {
          const childStyle = window.getComputedStyle(child);
          // 如果元素有背景图或渐变，确保它们被保留
          if (childStyle.background && childStyle.background.includes("gradient")) {
            child.style.background = childStyle.background;
          }
        });
      },
    });
    return canvas;
  } finally {
    // 恢复原始样式
    el.style.boxShadow = prevBoxShadow;
    el.style.width = prevWidth;
    el.style.height = prevHeight;
    el.style.minWidth = prevMinWidth;
    el.style.minHeight = prevMinHeight;
    el.style.maxWidth = prevMaxWidth;
    el.style.maxHeight = prevMaxHeight;
    el.style.backgroundColor = prevBackgroundColor;
    el.style.background = prevBackground;
  }
}
