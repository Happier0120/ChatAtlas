# ChatAtlas

Ticket 01：在本机 Web 界面用 New Chat 完成首轮对话，保存并在重启后恢复。
当前使用明确标识的测试 Provider，不连接 DeepSeek 或其他真实模型，不需要 API Key。

## Windows 启动

从项目根目录在 PowerShell 运行（Node.js 26.7.x、npm 11）：

```powershell
npm ci
npm run db:migrate
npm run build
npm start
```

打开 <http://127.0.0.1:3000>，点击 **New Chat**，输入 Prompt 并发送。
确定性替身会返回 `测试回复：` 加上原 Prompt。Node Card 表示一个 Turn；
展开记录信息可查看 Turn/Conversation 身份及实际 Provider/Model。
用 Ctrl+C 关闭服务，再运行 `npm start`，从对话列表打开原记录。

默认数据库是项目目录下的 `data/chatatlas.sqlite`，首次启动也会自动执行
已提交的迁移。不要删除这个文件及活动数据库的 WAL/SHM 文件来“刷新”应用。
启动前可设置独立数据库与端口：

```powershell
$env:CHATATLAS_DB = 'D:/chatatlas-data/demo.sqlite'
$env:PORT = '3100'
npm start
```

开发模式使用两个 PowerShell 窗口：`npm run dev:server`（API 3000）和
`npm run dev`（Vite 5173）；Vite 将 `/api` 代理到本机 API。
常规演示使用上面的 build/start，前后端由同一服务提供。

## 验证

```powershell
npx playwright install chromium
npm run typecheck
npm test
# 已构建后仅运行一个文件/场景
npm run test:e2e -- tests/first-turn.spec.ts
npx playwright show-report
```

若已安装 Google Chrome，也可在当前 PowerShell 设置
`$env:PLAYWRIGHT_CHANNEL = 'chrome'` 后运行测试；默认使用 Playwright 下载的
Chromium。恢复默认用 `Remove-Item Env:PLAYWRIGHT_CHANNEL`。

测试使用真实 Chromium、Fastify 与每个测试单独的 SQLite 文件（位于忽略的
`test-results/`），不读取默认个人数据库。替身位于服务端 Provider Adapter
边界，测试记录应用实际发出的消息并控制回复；没有浏览器 API 假数据。
恢复场景会退出服务进程、关闭浏览器上下文，然后重启服务并从界面读回数据。

修改数据库 schema 后运行 `npm run db:generate`，提交 `drizzle/` 下的 SQL 和
metadata，再运行 `npm run db:migrate`。常规启动无需生成新迁移。

## 依赖与兼容性核验

2026-11-16 通过 npm registry 的 `npm view <package> version engines --json`
核验稳定版本，再以精确版本和 `package-lock.json` 固定安装。

| 依赖 | 选定版本 | 核验依据 |
| --- | --- | --- |
| React / React DOM | 19.3.1 | npm latest，非预发布 |
| TypeScript | 7.0.2 | npm latest，Node >=16.20 |
| Vite / plugin-react | 8.3.8 / 6.3.0 | Node ^20.19 或 >=22.12 |
| Fastify / static | 5.12.8 / 10.1.11 | Fastify 5；静态插件与服务实测 |
| Drizzle ORM / Kit | 0.45.4 / 0.31.11 | 稳定版；未采用文档中推荐的 v1 RC |
| better-sqlite3 | 13.2.0 | Node >=22；本机原生驱动安装与迁移实测 |
| Playwright Test | 1.65.1 | Node >=20；Windows 浏览器实测 |
| tsx | 4.23.15 | Node >=18 |

官方来源：[Vite Node 要求](https://vite.dev/guide/)、
[Fastify v5 Node 要求](https://fastify.dev/docs/v5.6.x/Guides/Migration-Guide-V5/)、
[Drizzle SQLite 驱动](https://orm.drizzle.team/docs/get-started-sqlite)、
[Drizzle 迁移](https://orm.drizzle.team/docs/migrations)、
[事务](https://orm.drizzle.team/docs/transactions)、
[better-sqlite3 安装](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/troubleshooting.md)、
[Playwright 系统要求](https://playwright.dev/docs/intro#system-requirements)。
具体发布元数据可复核 <https://registry.npmjs.org/> 对应包版本。

本次主机：Windows 10 x64 build 19045、Node 26.7.0、npm 11.19.0。
Playwright 当前官方支持 Windows 11+，所以本机通过也仅代表 Windows 10
上的实际运行结果，不扩大官方支持承诺；推荐在 Windows 11+ 复现。
better-sqlite3 13.2.0 自带 Windows 预编译文件并声明 `gypfile: false`。
实测 npm 11.19.0 的 `npm ci` 仍会尝试自动 node-gyp 编译；项目的
`allowScripts` 对此包设为 `false`，保留预编译驱动，避免额外要求 Windows SDK。
这也是这里要求 npm 11.19+ 的原因，不是关闭应用脚本或替换实际数据库。
依据：[驱动发布包](https://github.com/WiseLibs/better-sqlite3/blob/v13.2.0/package.json)、
[npm allowScripts](https://docs.npmjs.com/cli/v11/commands/npm-install-scripts/)。

执行结果、Red/Green 证据与审查记录见
[Ticket 01 implementation record](.scratch/fork-v1/ticket-01-implementation.md)。

本票不包含继续下一轮、复杂地图、Fork、分支草稿、流式显示、停止/重试、
真实 Provider、账户或多人部署。后续需求以仓库 Spec 和各 Ticket 为准。
