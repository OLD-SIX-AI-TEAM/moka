/**
 * 环境检测工具模块
 */

/**
 * 检测是否是本地开发环境（包括局域网 IP）
 * @returns {boolean}
 */
export function isLocalDevEnv() {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return hostname === 'localhost' ||
         hostname === '127.0.0.1' ||
         /^192\.168\.\d+\.\d+$/.test(hostname) ||
         /^10\.\d+\.\d+\.\d+$/.test(hostname) ||
         /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/.test(hostname);
}

/**
 * 检测是否在 Tauri 桌面客户端环境中
 * @returns {boolean}
 */
export function isTauriEnv() {
  if (typeof window === 'undefined') return false;
  return !!(window.__TAURI__ || window.__TAURI_INTERNALS__);
}
