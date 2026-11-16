// Isolated, read-only static server for the throwaway UX prototype.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const port = Number(process.env.PROTOTYPE_PORT || 4178);
const page = new URL('./index.html', import.meta.url);
const server = createServer(async (req, res) => {
  if (req.url?.split('?')[0] !== '/' && req.url?.split('?')[0] !== '/index.html') {
    res.writeHead(404); res.end('Not found'); return;
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(await readFile(page));
});
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`端口 ${port} 已被占用。如果已启动原型，请直接打开 http://127.0.0.1:${port}`);
    console.error('如需另开服务，可在 PowerShell 中设置 $env:PROTOTYPE_PORT = \'4179\' 后重试。不同端口的浏览器本地状态不共用。');
  } else {
    console.error(`原型服务启动失败：${error.message}`);
  }
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => console.log(`ChatAtlas UX PROTOTYPE: http://127.0.0.1:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => server.close());
