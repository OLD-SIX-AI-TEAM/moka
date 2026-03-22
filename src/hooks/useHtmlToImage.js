import { toPng, toJpeg } from "html-to-image";

/**
 * 使用 html-to-image 捕获元素为图片
 * @param {HTMLElement} el - 要捕获的元素
 * @param {number} scale - 缩放比例 (2=高清, 4=超清)
 * @param {string} format - 格式 'png' | 'jpeg'
 * @returns {Promise<string>} 图片的 data URL
 */
export async function snapElementToImage(el, scale = 2, format = "png") {
  if (!el) {
    throw new Error("Element is required");
  }

  // 获取元素实际尺寸
  const rect = el.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  // 计算像素比例
  const pixelRatio = scale;

  // 配置选项
  const options = {
    pixelRatio,
    quality: 1,
    backgroundColor: "#ffffff",
    width,
    height,
    style: {
      transform: "none",
      transformOrigin: "none",
    },
    // 过滤函数，排除不需要的元素
    filter: (node) => {
      // 排除拖拽时的占位元素
      if (node.classList && node.classList.contains("dragging")) {
        return false;
      }
      return true;
    },
    // 字体加载超时
    fontEmbedCSS: undefined,
    // 缓存 bust
    cacheBust: true,
    // 跳过自动调整
    skipAutoScale: false,
  };

  // 在导出前临时设置样式确保正确渲染
  const prevTransform = el.style.transform;
  const prevTransformOrigin = el.style.transformOrigin;
  const prevBackgroundColor = el.style.backgroundColor;

  // 确保背景色
  const computedStyle = window.getComputedStyle(el);
  if (!computedStyle.backgroundColor || computedStyle.backgroundColor === "rgba(0, 0, 0, 0)") {
    el.style.backgroundColor = "#ffffff";
  }

  el.style.transform = "none";
  el.style.transformOrigin = "none";

  try {
    // 强制重绘
    el.offsetHeight;

    // 等待字体加载完成
    if (document.fonts) {
      await document.fonts.ready;
    }

    // 导出图片
    const dataUrl = format === "jpeg" 
      ? await toJpeg(el, options)
      : await toPng(el, options);

    return dataUrl;
  } finally {
    // 恢复样式
    el.style.transform = prevTransform;
    el.style.transformOrigin = prevTransformOrigin;
    el.style.backgroundColor = prevBackgroundColor;
  }
}

/**
 * 导出元素为图片并下载
 * @param {HTMLElement} el - 要导出的元素
 * @param {string} filename - 文件名
 * @param {Object} options - 配置选项
 */
export async function exportElement(el, filename, options = {}) {
  const { quality = "hd", format = "png" } = options;
  const scale = quality === "ultra" ? 4 : 2;

  const dataUrl = await snapElementToImage(el, scale, format);

  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();

  return dataUrl;
}
