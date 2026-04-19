#!/usr/bin/env node
import { spawn } from 'child_process';
import process from 'process';

const isLinux = process.platform === 'linux';

const env = {
  ...process.env,
};

if (isLinux) {
  env.GDK_BACKEND = 'x11';
  env.WEBKIT_DISABLE_COMPOSITING_MODE = '1';
}

const child = spawn('tauri', ['dev'], {
  env,
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
