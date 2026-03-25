import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';

const CONFIG_DIR = path.join(os.homedir(), '.moka');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

const DEFAULT_CONFIG = {
  ANTHROPIC_API_KEY: '',
  OPENAI_API_KEY: '',
  DASHSCOPE_API_KEY: '',
  DEFAULT_PROVIDER: 'anthropic',
  DEFAULT_MODEL: '',
};

class ConfigManager {
  constructor() {
    this.config = this.load();
  }

  load() {
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        return { ...DEFAULT_CONFIG, ...fs.readJsonSync(CONFIG_FILE) };
      }
    } catch (error) {
      console.warn(chalk.yellow('警告: 配置文件读取失败，使用默认配置'));
    }
    return { ...DEFAULT_CONFIG };
  }

  save() {
    fs.ensureDirSync(CONFIG_DIR);
    fs.writeJsonSync(CONFIG_FILE, this.config, { spaces: 2 });
  }

  get(key) {
    // 优先从环境变量读取
    const envValue = process.env[key];
    if (envValue) return envValue;
    // 其次从配置文件读取
    return this.config[key];
  }

  set(updates) {
    this.config = { ...this.config, ...updates };
    this.save();
  }

  show() {
    console.log(chalk.cyan('当前配置:'));
    console.log(chalk.gray('配置文件路径:'), CONFIG_FILE);
    console.log('');
    
    const keys = [
      'ANTHROPIC_API_KEY',
      'OPENAI_API_KEY', 
      'DASHSCOPE_API_KEY',
      'DEFAULT_PROVIDER',
      'DEFAULT_MODEL'
    ];
    
    for (const key of keys) {
      const value = this.get(key);
      const displayValue = key.includes('KEY') && value 
        ? value.slice(0, 8) + '****' + value.slice(-4)
        : value || chalk.gray('(未设置)');
      console.log(`  ${key}: ${displayValue}`);
    }
    
    console.log('');
    console.log(chalk.gray('提示: 可以通过环境变量或 moka config --<provider>-key <key> 设置API密钥'));
  }

  validateProvider(provider) {
    const keyMap = {
      anthropic: 'ANTHROPIC_API_KEY',
      openai: 'OPENAI_API_KEY',
      aliyun: 'DASHSCOPE_API_KEY',
    };

    const keyName = keyMap[provider];
    if (!keyName) {
      throw new Error(`不支持的提供商: ${provider}`);
    }

    const apiKey = this.get(keyName);
    if (!apiKey) {
      throw new Error(
        `未找到 ${provider} 的API密钥。请通过以下方式设置:\n` +
        `  1. 环境变量: export ${keyName}=your_key\n` +
        `  2. CLI配置: moka config --${provider}-key your_key`
      );
    }

    return apiKey;
  }
}

export const configManager = new ConfigManager();
