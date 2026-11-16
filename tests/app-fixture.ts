import { test as base, expect } from '@playwright/test';
import { fork, type ChildProcess } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

type ModelRequest = {
  type: 'model-request';
  providerId: string;
  modelId: string;
  messages: { role: string; content: string }[];
};

class TestApp {
  url = '';
  requests: ModelRequest[] = [];
  private child?: ChildProcess;

  constructor(private readonly databasePath: string) {}

  async start() {
    this.child = fork(new URL('./fixture-server.ts', import.meta.url), [], {
      execArgv: ['--import', 'tsx'],
      env: { ...process.env, CHATATLAS_DB: this.databasePath },
      stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
      windowsHide: true,
    });
    const child = this.child;
    let output = '';
    child.stdout?.on('data', (chunk) => { output += chunk; });
    child.stderr?.on('data', (chunk) => { output += chunk; });
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Server did not start: ${output}`)), 15_000);
      child.once('error', (error) => { clearTimeout(timer); reject(error); });
      child.once('exit', (code) => {
        clearTimeout(timer);
        reject(new Error(`Server exited (${code}): ${output}`));
      });
      child.on('message', (message: ModelRequest | { type: 'ready'; url: string }) => {
        if (message.type === 'model-request') this.requests.push(message);
        if (message.type === 'ready') {
          clearTimeout(timer);
          this.url = message.url;
          resolve();
        }
      });
    });
  }

  async stop() {
    const child = this.child;
    if (!child || child.exitCode !== null) return;
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => { child.kill(); reject(new Error('Server did not stop')); }, 5_000);
      child.once('exit', () => { clearTimeout(timer); resolve(); });
      child.send('stop');
    });
    this.child = undefined;
  }
}

export const test = base.extend<{ app: TestApp }>({
  app: async ({}, use, testInfo) => {
    const directory = testInfo.outputPath('app');
    await mkdir(directory, { recursive: true });
    const app = new TestApp(join(directory, 'chatatlas.sqlite'));
    try {
      await app.start();
      await use(app);
    } finally {
      await app.stop();
    }
  },
});
export { expect };
