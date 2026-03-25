/**
 * RSA 加密工具类
 * 从服务端获取公钥进行加密
 */

let cachedPublicKey = null;

/**
 * 从服务端获取公钥
 * @returns {Promise<string>} - PEM 格式的公钥
 */
async function getPublicKeyFromServer() {
  if (cachedPublicKey) {
    return cachedPublicKey;
  }

  try {
    const response = await fetch('/api/public-key');
    if (!response.ok) {
      throw new Error('获取公钥失败');
    }
    const data = await response.json();
    cachedPublicKey = data.publicKey;
    return cachedPublicKey;
  } catch (error) {
    console.error('获取公钥失败:', error);
    throw new Error('无法获取加密公钥');
  }
}

/**
 * 将字符串转换为 ArrayBuffer
 */
function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

/**
 * 将 ArrayBuffer 转换为 Base64 字符串
 */
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * 使用 RSA 公钥加密文本
 * @param {string} text - 要加密的文本
 * @returns {Promise<string>} - Base64 编码的加密结果
 */
export async function encryptWithPublicKey(text) {
  try {
    // 从服务端获取公钥
    const publicKeyPem = await getPublicKeyFromServer();

    // 清理公钥格式
    const publicKeyBase64 = publicKeyPem
      .replace(/-----BEGIN PUBLIC KEY-----/g, '')
      .replace(/-----END PUBLIC KEY-----/g, '')
      .replace(/\s/g, '');

    // 导入公钥
    const publicKey = await window.crypto.subtle.importKey(
      'spki',
      str2ab(atob(publicKeyBase64)),
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      false,
      ['encrypt']
    );

    // 加密数据
    const encoded = new TextEncoder().encode(text);
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      encoded
    );

    // 返回 Base64 编码的结果
    return arrayBufferToBase64(encrypted);
  } catch (error) {
    console.error('加密失败:', error);
    throw new Error('API Key 加密失败');
  }
}

/**
 * 加密 API Key 并存储到 localStorage
 * @param {string} apiKey - 原始 API Key
 * @param {string} provider - provider 类型
 */
export async function storeEncryptedApiKey(apiKey, provider) {
  if (!apiKey) return;

  try {
    const encrypted = await encryptWithPublicKey(apiKey);
    const storageKey = `llm_config_${provider}`;
    const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
    stored.encryptedApiKey = encrypted;
    stored.hasEncryptedKey = true;
    localStorage.setItem(storageKey, JSON.stringify(stored));
  } catch (error) {
    console.error('存储加密 API Key 失败:', error);
    throw error;
  }
}

/**
 * 获取存储的加密 API Key
 * @param {string} provider - provider 类型
 * @returns {string|null} - 加密的 API Key 或 null
 */
export function getEncryptedApiKey(provider) {
  try {
    const storageKey = `llm_config_${provider}`;
    const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return stored.encryptedApiKey || null;
  } catch (error) {
    console.error('获取加密 API Key 失败:', error);
    return null;
  }
}

/**
 * 检查是否已配置加密的 API Key
 * @param {string} provider - provider 类型
 * @returns {boolean}
 */
export function hasEncryptedApiKey(provider) {
  try {
    const storageKey = `llm_config_${provider}`;
    const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return stored.hasEncryptedKey || false;
  } catch (error) {
    return false;
  }
}
