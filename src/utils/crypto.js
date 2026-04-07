/**
 * 加密工具模块
 * 使用 RSA 加密存储 API Key
 */

// 缓存从服务器获取的公钥
let cachedServerPublicKey = null;

/**
 * 清除缓存的公钥
 * 用于密钥轮换后重新获取
 */
export function clearCachedPublicKey() {
  cachedServerPublicKey = null;

}

/**
 * 从服务器获取 RSA 公钥
 * @returns {Promise<string>} - Base64 编码的公钥
 */
export async function getServerPublicKey() {
  if (cachedServerPublicKey) {
    return cachedServerPublicKey;
  }

  // 本地开发时直接返回 null，使用明文存储（包括局域网 IP）
  if (isLocalDevEnv()) {
    console.log('[Crypto] 本地开发环境，跳过获取公钥');
    return null;
  }

  try {
    console.log('[Crypto] 从服务器获取公钥...');
    const response = await fetch('/api/public-key');
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `获取公钥失败: ${response.status}`);
    }
    const data = await response.json();
    if (!data.publicKey) {
      throw new Error('服务器未配置公钥');
    }
    cachedServerPublicKey = data.publicKey;
    console.log('[Crypto] 公钥获取成功');
    return cachedServerPublicKey;
  } catch (error) {
    console.error('[Crypto] 获取服务器公钥失败:', error);
    throw new Error('无法获取加密公钥: ' + error.message);
  }
}

/**
 * 使用公钥加密数据
 * @param {string} text - 要加密的文本
 * @param {string} publicKeyBase64 - Base64 编码的公钥
 * @returns {Promise<string>} - Base64 编码的加密数据
 */
export async function encryptWithPublicKey(text, publicKeyBase64) {
  try {
    const publicKeyBuffer = Uint8Array.from(atob(publicKeyBase64), c => c.charCodeAt(0));

    const publicKey = await crypto.subtle.importKey(
      'spki',
      publicKeyBuffer.buffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      false,
      ['encrypt']
    );

    const encoded = new TextEncoder().encode(text);
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      encoded
    );

    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  } catch (error) {
    console.error('加密失败:', error);
    throw new Error('API Key 加密失败');
  }
}

/**
 * 使用私钥解密数据
 * @param {string} encryptedBase64 - Base64 编码的加密数据
 * @param {string} privateKeyBase64 - Base64 编码的私钥
 * @returns {Promise<string>} - 解密后的文本
 */
export async function decryptWithPrivateKey(encryptedBase64, privateKeyBase64) {
  try {
    const privateKeyBuffer = Uint8Array.from(atob(privateKeyBase64), c => c.charCodeAt(0));

    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyBuffer.buffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      false,
      ['decrypt']
    );

    const encryptedBuffer = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP',
      },
      privateKey,
      encryptedBuffer.buffer
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('解密失败:', error);
    throw new Error('API Key 解密失败');
  }
}

/**
 * 检测是否是本地开发环境（包括局域网 IP）
 * @returns {boolean}
 */
function isLocalDevEnv() {
  const hostname = window.location.hostname;
  return hostname === 'localhost' ||
         hostname === '127.0.0.1' ||
         /^192\.168\.\d+\.\d+$/.test(hostname) ||
         /^10\.\d+\.\d+\.\d+$/.test(hostname) ||
         /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/.test(hostname);
}

/**
 * 存储加密的 API Key
 * 生产环境使用服务器公钥加密，本地开发使用明文存储
 * @param {string} apiKey - API Key
 * @param {string} provider - 提供商
 * @returns {Promise<void>}
 */
export async function storeEncryptedApiKey(apiKey, provider) {
  console.log('[Crypto] 存储 API Key，hostname:', window.location.hostname);

  // 本地开发时使用明文存储（包括局域网 IP）
  if (isLocalDevEnv()) {
    console.log('[Crypto] 本地开发环境，使用明文存储');
    localStorage.setItem(`llm_config_${provider}`, apiKey);
    return;
  }

  // 生产环境使用服务器公钥加密
  console.log('[Crypto] 生产环境，获取服务器公钥...');
  const serverPublicKey = await getServerPublicKey();
  if (!serverPublicKey) {
    throw new Error('无法获取加密公钥，请检查服务器配置');
  }

  console.log('[Crypto] 加密 API Key...');
  const encrypted = await encryptWithPublicKey(apiKey, serverPublicKey);
  localStorage.setItem(`llm_config_${provider}`, encrypted);
  console.log('[Crypto] API Key 加密存储成功');
}

/**
 * 获取加密的 API Key
 * @param {string} provider - 提供商
 * @returns {string|null} - 加密的 API Key
 */
export function getEncryptedApiKey(provider) {
  return localStorage.getItem(`llm_config_${provider}`);
}

/**
 * 检查是否有加密的 API Key
 * @param {string} provider - 提供商
 * @returns {boolean}
 */
export function hasEncryptedApiKey(provider) {
  return !!localStorage.getItem(`llm_config_${provider}`);
}

/**
 * 获取解密的 API Key（本地开发直接使用明文）
 * @param {string} provider - 提供商
 * @returns {Promise<string|null>} - API Key
 */
export async function getDecryptedApiKey(provider) {
  const encryptedKey = getEncryptedApiKey(provider);
  if (!encryptedKey) return null;

  // 本地开发模式：直接使用明文（包括局域网 IP）
  if (isLocalDevEnv()) {
    console.log('[Crypto] 本地开发环境，直接使用明文 API Key');
    return encryptedKey;
  }

  // 生产环境：检查是否是明文存储（兼容旧数据）
  // 如果长度小于 100，可能是明文存储的 key
  if (encryptedKey.length < 100) {
    console.log('[Crypto] 检测到明文存储的 API Key');
    return encryptedKey;
  }

  // 如果是加密的数据，尝试用旧的方式解密（兼容旧数据）
  // 注意：生产环境应该在服务器端解密，这里是为了兼容旧版本
  try {
    const RSA_KEY_PAIR_KEY = 'moka_rsa_keypair';
    const stored = localStorage.getItem(RSA_KEY_PAIR_KEY);
    if (stored) {
      const { privateKey } = JSON.parse(stored);
      return await decryptWithPrivateKey(encryptedKey, privateKey);
    }
  } catch (error) {
    console.warn('本地解密 API Key 失败（旧版本兼容）:', error);
  }

  // 生产环境下，返回加密的内容，让服务器去解密
  return encryptedKey;
}
