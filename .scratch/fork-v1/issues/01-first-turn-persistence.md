# 01: 在最小 Web 界面完成并恢复第一轮对话

Status: ready-for-agent

**What to build:** 用户在本机最小 Web 界面通过 New Chat 提交第一条 Prompt，由可控模型替身完成回复，并在重新打开应用后读取同一轮对话。

**Blocked by:** None (can start immediately)

## 背景与依据

先读 [项目 Agent 指令](../../../AGENTS.md)、[本地 Issue Tracker](../../../docs/agents/issue-tracker.md) 和 [领域文档入口](../../../docs/agents/domain.md)。领域依据为 [已批准 Fork V1 Spec](../spec.md)、[GLOSSARY](../../../GLOSSARY.md)、[ADR-0001：共享 Turn 历史与独立 Conversation 身份](../../../docs/adr/0001-share-turn-history-across-conversations.md)、[ADR-0002：独立保存分支草稿](../../../docs/adr/0002-persist-fork-drafts-before-conversation-creation.md)。

关联需求：4、19、21；Testing Decisions 的真实持久化与界面验收边界。

发布时仓库只有配置、领域文档和 Spec，没有应用、数据库或测试框架。本票随这一条用户路径建立必要的运行、迁移和测试能力；不拆出横向基础设施任务。Turn Node 与 Turn 同一身份，Node Card 是呈现；Conversation 与 Turn 具有不同身份。

本票采用用户正式批准的 14 票拆分与依赖；工程前提及 Provider 扩展边界来自发布时的补充批准，不修改 Spec、GLOSSARY 或 ADR。

## 技术约束

已批准工程前提：React + TypeScript + Vite / Node.js + Fastify，个人本机 Web 应用；SQLite + Drizzle，保留真实事务、唯一性约束与迁移。首次建立或新增依赖时核实稳定版本和 Windows 兼容性，不在本票预填未经验证的版本或实现文件路径。

V1 唯一要求真实接入的 Provider 是 DeepSeek，优先使用实施时官方支持的 deepseek-flash、非思考模式及 OpenAI 兼容 Chat Completions，API Key 仅在服务端。Provider Adapter 与领域历史解耦，Turn 明确记录实际 Provider/Model 身份。未来 OpenAI/GPT、xAI/Grok 及跨 Provider 继续/Fork 是扩展方向，不要求本票实现其 Adapter、兼容转换、模型网关或 Agent 编排。

- 使用 React + TypeScript + Vite、Node.js + Fastify，面向个人本机 Web 使用；只提供承载本轮所需的最小 Project 容器。
- 使用 SQLite + Drizzle 的实际数据库与迁移；实施前核对各依赖稳定版本、Node.js 要求、SQLite 驱动及 Windows 安装/运行兼容性，记录来源、选定版本和验证结果，不直接采用未经核验的预发布版本。
- 模型替身放在服务端简洁的 Provider Adapter 边界，使用应用侧消息语义。仅建立本轮调用所需的最小约定，后续沿此边界扩展，不创建统一模型网关。
- Turn 明确保存本轮实际使用的 Provider 标识和 Model 标识；替身使用明确的测试身份，不通过模型名称猜测 Provider，不把测试服务冒充 DeepSeek。
- 仅建必要的界面验收与测试数据库隔离；本票不要求流式显示或完整错误恢复。

## Acceptance criteria

- [ ] 从干净环境按说明可在 Windows 启动应用，并通过迁移创建真实 SQLite 数据库；记录实际运行与兼容性核验结果。
- [ ] 在最小界面提交一个 Prompt，能看到替身的确定性回复及对应 Node Card。
- [ ] 一轮交流只对应一个 Turn；Independent Conversation 有独立身份，首个 Turn 是其历史树结构根。
- [ ] Prompt、回复、Turn/Conversation 身份以及实际 Provider/Model 标识均持久化；关闭并重启应用后可读取相同数据和身份。
- [ ] 数据库操作具有真实事务能力；应用可从迁移创建测试数据库，不以内存对象或浏览器假数据代替持久化。
- [ ] 自动化验收通过界面、真实应用与隔离数据库完成，不配置真实 API Key也可运行。
- [ ] 提供必要的启动、迁移、测试和复现步骤；不要求人工修改数据库才能演示首轮路径。

## 验证与交付

以应用界面完整流程为主要验收边界，使用与真实 Provider 约定一致的可控模型替身及隔离的真实 SQLite 数据库。验证可观察行为、可恢复记录和实际模型请求，不依赖真实 API、供应商随机措辞、内部函数调用次数或特定表结构。涉及恢复时重启应用/重建会话验证，不能只查内存或数据库记录存在。

交付本票行为、对应自动化验收和必要的演示/运行说明；记录实际执行命令、结果及未完成验证。只运行与改动相关的必要检查，不把本票验收留到后续票。发现与 Spec/ADR 的实质冲突时先报告，不自行覆盖已批准决定。

## Out of scope

仅第一轮正常对话与必要基础。不实现复杂地图、Fork、真实 Provider、账户、公开多人部署、完整 Project 管理或其他基础平台功能。
