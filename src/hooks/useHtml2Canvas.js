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

  const prevBoxShadow = el.style.boxShadow;
  el.style.boxShadow = "none";

  try {
    const canvas = await window.html2canvas(el, {
      scale,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });
    return canvas;
  } finally {
    el.style.boxShadow = prevBoxShadow;
  }
}
