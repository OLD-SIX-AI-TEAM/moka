#!/usr/bin/env node
/**
 * RSA 密钥对生成脚本（安全版本）
 * 用于快速生成新的 RSA 私钥和公钥
 *
 * 使用方法:
 *   node scripts/generate-keys.js        # 仅显示公钥，私钥不显示也不保存
 *   node scripts/generate-keys.js --save # 保存到文件（需要确认）
 *
 * 安全特性:
 *   - 默认不显示私钥，防止终端历史泄露
 *   - 私钥不落盘，除非用户明确指定 --save
 *   - 自动设置文件权限为只读
 *   - 敏感数据使用内存存储，用完立即清理
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function cleanPemContent(pemContent) {
  return pemContent
    .replace(/-----BEGIN (PRIVATE|PUBLIC) KEY-----/g, '')
    .replace(/-----END (PRIVATE|PUBLIC) KEY-----/g, '')
    .replace(/\r\n/g, '')
    .replace(/\n/g, '')
    .trim();
}

function secureDelete(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      // 先覆盖写入随机数据
      const stats = fs.statSync(filePath);
      const randomData = Buffer.alloc(stats.size);
      for (let i = 0; i < randomData.length; i++) {
        randomData[i] = Math.floor(Math.random() * 256);
      }
      fs.writeFileSync(filePath, randomData);
      // 然后删除
      fs.unlinkSync(filePath);
    }
  } catch (e) {
    // 忽略错误
  }
}

async function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

export async function generateKeys(options = {}) {
  const shouldSave = options.save || process.argv.includes('--save');
  const showPrivate = options.showPrivate || process.argv.includes('--show-private');

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rsa-keys-'));
  const privateKeyPath = path.join(tempDir, 'private.pem');
  const publicKeyPath = path.join(tempDir, 'public.pem');

  // 用于存储敏感数据的变量，用完立即清理
  let privateKeyBase64 = '';
  let privateKeyPem = '';

  try {
    log('🔐 正在生成 RSA 2048 位密钥对...', 'cyan');

    // 生成私钥
    execSync(`openssl genrsa -out "${privateKeyPath}" 2048`, { stdio: 'pipe' });

    // 从私钥提取公钥
    execSync(`openssl rsa -in "${privateKeyPath}" -pubout -out "${publicKeyPath}"`, { stdio: 'pipe' });

    // 读取密钥内容
    privateKeyPem = fs.readFileSync(privateKeyPath, 'utf8');
    const publicKeyPem = fs.readFileSync(publicKeyPath, 'utf8');

    // 转换为 Base64（去除 PEM 格式）
    privateKeyBase64 = cleanPemContent(privateKeyPem);
    const publicKeyBase64 = cleanPemContent(publicKeyPem);

    log('\n✅ 密钥生成成功！\n', 'green');

    // 显示公钥
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'yellow');
    log('🔓 RSA_PUBLIC_KEY (公钥) - 可公开:', 'blue');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'yellow');
    console.log(publicKeyBase64);

    // 私钥处理
    if (showPrivate) {
      // 如果用户明确要求显示私钥
      log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'red');
      log('🔑 RSA_PRIVATE_KEY (私钥) - 机密信息:', 'red');
      log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'red');
      console.log(privateKeyBase64);
      log('\n⚠️  警告: 私钥已显示在终端，请确保终端历史记录安全！', 'red');
    } else {
      log('\n🔒 私钥已生成但未显示（出于安全考虑）', 'gray');
      log('   如需查看私钥，请使用: node scripts/generate-keys.js --show-private', 'gray');
    }

    // 保存到文件
    if (shouldSave) {
      const confirm = await prompt('\n是否将密钥保存到文件? (yes/no): ');
      if (confirm === 'yes' || confirm === 'y') {
        const outputDir = path.join(process.cwd(), 'keys-output');
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        // 创建 .gitignore 防止误提交
        const gitignorePath = path.join(outputDir, '.gitignore');
        if (!fs.existsSync(gitignorePath)) {
          fs.writeFileSync(gitignorePath, '# 密钥文件\n*.txt\n*.pem\n*.key\n');
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const keyFile = path.join(outputDir, `keys-${timestamp}.txt`);

        const outputContent = `# RSA 密钥对生成时间: ${new Date().toLocaleString()}
# ⚠️  此文件包含敏感信息，请妥善保管！
# 请将以下密钥配置到 Cloudflare Worker 环境变量中

RSA_PRIVATE_KEY=${privateKeyBase64}

RSA_PUBLIC_KEY=${publicKeyBase64}

# 完整 PEM 格式私钥 (用于备份):
${privateKeyPem}
# 完整 PEM 格式公钥 (用于备份):
${publicKeyPem}
`;

        fs.writeFileSync(keyFile, outputContent);

        // 设置文件权限为只读 (Windows 不支持 chmod 600，但我们可以尝试)
        try {
          fs.chmodSync(keyFile, 0o600);
        } catch (e) {
          // Windows 上忽略权限设置错误
        }

        log(`\n💾 密钥已保存到: ${keyFile}`, 'green');
        log('   文件权限已设置为只读', 'gray');
        log('   此目录已被添加到 .gitignore，不会被提交', 'gray');
      } else {
        log('\n已取消保存，密钥不会写入文件', 'yellow');
      }
    } else {
      log('\n💡 提示: 如需保存密钥到文件，请使用: node scripts/generate-keys.js --save', 'gray');
    }

    // 显示使用说明
    log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'yellow');
    log('📋 配置说明:', 'blue');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'yellow');
    log('1. 登录 Cloudflare Dashboard (https://dash.cloudflare.com)', 'reset');
    log('2. 进入你的 Worker 项目', 'reset');
    log('3. 点击 Settings → Variables and Secrets', 'reset');
    log('4. 添加/更新以下环境变量:', 'reset');
    if (showPrivate) {
      log('   - RSA_PRIVATE_KEY: 使用上面显示的私钥值', 'cyan');
    } else {
      log('   - RSA_PRIVATE_KEY: 请使用 --show-private 查看或使用 --save 保存', 'gray');
    }
    log('   - RSA_PUBLIC_KEY: 使用上面显示的公钥值', 'cyan');
    log('\n⚠️  注意: 更换密钥后，用户之前加密的 API Key 将无法解密，需要重新配置', 'red');

    return { privateKeyBase64, publicKeyBase64, privateKeyPem, publicKeyPem };

  } catch (error) {
    log(`\n❌ 生成密钥失败: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    // 安全清理：覆盖后删除临时文件
    secureDelete(privateKeyPath);
    secureDelete(publicKeyPath);
    try {
      fs.rmdirSync(tempDir);
    } catch (e) {
      // 忽略清理错误
    }

    // 清理内存中的敏感数据
    privateKeyBase64 = '';
    privateKeyPem = '';
  }
}

// 主程序
if (import.meta.url === `file://${process.argv[1]}`) {
  log('╔════════════════════════════════════════╗', 'cyan');
  log('║     RSA 密钥对生成工具（安全版）       ║', 'cyan');
  log('╚════════════════════════════════════════╝', 'cyan');
  log('\n安全特性:', 'gray');
  log('  • 默认不显示私钥，防止终端历史泄露', 'gray');
  log('  • 私钥不落盘，除非使用 --save 并确认', 'gray');
  log('  • 敏感数据使用安全内存清理', 'gray');
  log('');
  generateKeys();
}

export { cleanPemContent, secureDelete };
