import { toPng, toJpeg } from "html-to-image";
import { isTauriEnv } from "../utils/env.js";

/**
 * 等待所有图片加载完成
 * @param {HTMLElement} el
 * @returns {Promise<void>}
 */
async function waitForImages(el) {
  const images = el.querySelectorAll('img');
  const promises = Array.from(images).map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
      // 超时处理
      setTimeout(resolve, 1000);
    });
  });
  await Promise.all(promises);
}

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

  // 保存原始样式
  const prevStyles = {
    transform: el.style.transform,
    transformOrigin: el.style.transformOrigin,
    backgroundColor: el.style.backgroundColor,
    height: el.style.height,
    maxHeight: el.style.maxHeight,
    overflow: el.style.overflow,
    width: el.style.width,
    aspectRatio: el.style.aspectRatio,
    borderRadius: el.style.borderRadius,
  };

  // 临时移除高度限制，让内容完全展开
  el.style.height = "auto";
  el.style.maxHeight = "none";
  el.style.overflow = "visible";
  el.style.transform = "none";
  el.style.transformOrigin = "none";

  // 获取计算样式
  const computedStyle = window.getComputedStyle(el);

  // 确保背景色
  if (!computedStyle.backgroundColor || computedStyle.backgroundColor === "rgba(0, 0, 0, 0)") {
    el.style.backgroundColor = "#ffffff";
  }

  // 获取计算后的圆角样式
  const borderRadius = computedStyle.borderRadius || prevStyles.borderRadius || "0px";

  try {
    // 等待图片加载
    await waitForImages(el);

    // 强制重绘
    el.offsetHeight;

    // 等待字体加载完成（Tauri WebView 中可能卡住，加超时或跳过）
    if (document.fonts && !isTauriEnv()) {
      await Promise.race([
        document.fonts.ready,
        new Promise(r => setTimeout(r, 300)),
      ]);
    }

    // 获取展开后的实际尺寸
    const width = el.offsetWidth;
    const height = el.scrollHeight;

    // 配置选项
    const options = {
      pixelRatio: scale,
      quality: 1,
      backgroundColor: "#ffffff",
      width,
      height,
      style: {
        transform: "none",
        transformOrigin: "none",
        borderRadius: borderRadius,
        overflow: "hidden",
      },
      filter: (node) => {
        // 排除拖拽时的占位元素
        if (node.classList && node.classList.contains("dragging")) {
          return false;
        }
        return true;
      },
      fontEmbedCSS: undefined,
      cacheBust: true,
      skipAutoScale: false,
    };

    // 导出图片
    const dataUrl = format === "jpeg"
      ? await toJpeg(el, options)
      : await toPng(el, options);

    return dataUrl;
  } finally {
    // 恢复原始样式
    el.style.transform = prevStyles.transform;
    el.style.transformOrigin = prevStyles.transformOrigin;
    el.style.backgroundColor = prevStyles.backgroundColor;
    el.style.height = prevStyles.height;
    el.style.maxHeight = prevStyles.maxHeight;
    el.style.overflow = prevStyles.overflow;
    el.style.width = prevStyles.width;
    el.style.aspectRatio = prevStyles.aspectRatio;
    el.style.borderRadius = prevStyles.borderRadius;
  }
}

/**
 * 将 Data URL 转为 Uint8Array
 * @param {string} dataUrl
 * @returns {Uint8Array}
 */
function dataUrlToUint8Array(dataUrl) {
  const base64 = dataUrl.split(',')[1];
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Tauri 环境下保存图片到本地
 * @param {string} dataUrl
 * @param {string} filename
 * @param {string|null} defaultPath - 可选的默认保存路径（目录+文件名）
 */
export async function saveImageInTauri(dataUrl, filename, defaultPath = null) {
  const { save } = await import('@tauri-apps/plugin-dialog');
  const { writeFile } = await import('@tauri-apps/plugin-fs');

  const ext = filename.endsWith('.jpeg') || filename.endsWith('.jpg') ? 'jpg' : 'png';

  const filePath = await save({
    defaultPath: defaultPath || filename,
    filters: [
      { name: 'Images', extensions: [ext] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (!filePath) {
    // 用户取消了保存
    return null;
  }

  const bytes = dataUrlToUint8Array(dataUrl);
  await writeFile(filePath, bytes);

  return filePath;
}

/**
 * Tauri 环境下批量保存图片（只弹一次对话框）
 * @param {Array<{dataUrl: string, filename: string}>} images
 * @returns {Promise<string|null>} 保存的目录路径，取消返回 null
 */
export async function saveImagesBatchInTauri(images) {
  if (!images || images.length === 0) return null;

  const { save } = await import('@tauri-apps/plugin-dialog');
  const { writeFile } = await import('@tauri-apps/plugin-fs');

  // 弹第一次对话框让用户选择保存位置和确认第一张文件名
  const firstPath = await save({
    defaultPath: images[0].filename,
    filters: [
      { name: 'Images', extensions: ['png'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (!firstPath) {
    return null;
  }

  // 提取目录路径（兼容 Windows \ 和 Unix /）
  const sep = firstPath.includes('/') ? '/' : '\\';
  const lastSepIndex = firstPath.lastIndexOf(sep);
  const dir = lastSepIndex >= 0 ? firstPath.substring(0, lastSepIndex) : '';

  // 保存第一张
  await writeFile(firstPath, dataUrlToUint8Array(images[0].dataUrl));

  // 保存剩余文件到同一目录
  for (let i = 1; i < images.length; i++) {
    const path = dir ? `${dir}${sep}${images[i].filename}` : images[i].filename;
    await writeFile(path, dataUrlToUint8Array(images[i].dataUrl));
  }

  return dir;
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

  if (isTauriEnv()) {
    const savedPath = await saveImageInTauri(dataUrl, filename);
    return { dataUrl, savedPath };
  }

  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();

  return { dataUrl };
}
