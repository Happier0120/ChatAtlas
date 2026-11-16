# 03: 继续当前 Conversation，并呈现独立历史路径

Status: ready-for-agent

**What to build:** 用户通过“+”沿当前 Conversation 继续，通过 New Chat 开启另一条独立历史路径，并在基本对话地图中查看和重新打开各轮内容。

**Blocked by:** [01：在最小 Web 界面完成并恢复第一轮对话](01-first-turn-persistence.md)

## 背景与依据

先读 [项目 Agent 指令](../../../AGENTS.md)、[本地 Issue Tracker](../../../docs/agents/issue-tracker.md) 和 [领域文档入口](../../../docs/agents/domain.md)。领域依据为 [已批准 Fork V1 Spec](../spec.md)、[GLOSSARY](../../../GLOSSARY.md)、[ADR-0001：共享 Turn 历史与独立 Conversation 身份](../../../docs/adr/0001-share-turn-history-across-conversations.md)、[ADR-0002：独立保存分支草稿](../../../docs/adr/0002-persist-fork-drafts-before-conversation-creation.md)。

关联需求：4、18、19、21、22。

01 提供首轮、真实数据库和替身。本票把单轮扩展为完整有序路径及同一 Project 的多棵树；无需等待 02 的真实服务。

本票采用用户正式批准的 14 票拆分与依赖；工程前提及 Provider 扩展边界来自发布时的补充批准，不修改 Spec、GLOSSARY 或 ADR。

## 技术约束

已批准工程前提：React + TypeScript + Vite / Node.js + Fastify，个人本机 Web 应用；SQLite + Drizzle，保留真实事务、唯一性约束与迁移。首次建立或新增依赖时核实稳定版本和 Windows 兼容性，不在本票预填未经验证的版本或实现文件路径。

V1 唯一要求真实接入的 Provider 是 DeepSeek，优先使用实施时官方支持的 deepseek-flash、非思考模式及 OpenAI 兼容 Chat Completions，API Key 仅在服务端。Provider Adapter 与领域历史解耦，Turn 明确记录实际 Provider/Model 身份。未来 OpenAI/GPT、xAI/Grok 及跨 Provider 继续/Fork 是扩展方向，不要求本票实现其 Adapter、兼容转换、模型网关或 Agent 编排。

- 使用现有本机 Web 技术栈和持久化，复用 Provider Adapter；应用自行选择历史路径，不把历史管理交给供应商会话对象。
- “+”仅在当前 Conversation 的末尾继续；每轮提交增加 Turn，模型请求使用该路径已有历史。New Chat 与继续操作保持不同语义。
- Turn Node 与 Turn 同一身份，树根是首个 Turn，不以 Conversation 身份作为树根；新增 Turn 记录实际 Provider/Model 标识。
- 地图仅实现路径、基本节点、连接及浏览；以可控模型替身完成请求历史验证。

## Acceptance criteria

- [ ] 在一条已有 Conversation 末尾提交下一轮，新增一个 Turn 而不新增 Conversation。
- [ ] 替身收到按顺序组织的该 Conversation 历史与新 Prompt，不混入另一条独立对话的内容。
- [ ] 同一 Project 中通过 New Chat 建立另一条独立历史路径，首个 Turn 为新树根。
- [ ] 每张正式 Node Card 对应一个 Turn，用户可查看各轮 Prompt 和实际回复，明确当前浏览的路径。
- [ ] 正常完成的既有历史内容在继续交流后保持不变；各轮实际 Provider/Model 身份保留。
- [ ] 重启应用后可重新打开多条路径，Conversation 身份、Turn 身份、顺序和内容与保存时一致。
- [ ] 界面验收使用真实数据库与模型替身，不依赖真实 DeepSeek 接入。

## 验证与交付

以应用界面完整流程为主要验收边界，使用与真实 Provider 约定一致的可控模型替身及隔离的真实 SQLite 数据库。验证可观察行为、可恢复记录和实际模型请求，不依赖真实 API、供应商随机措辞、内部函数调用次数或特定表结构。涉及恢复时重启应用/重建会话验证，不能只查内存或数据库记录存在。

交付本票行为、对应自动化验收和必要的演示/运行说明；记录实际执行命令、结果及未完成验证。只运行与改动相关的必要检查，不把本票验收留到后续票。发现与 Spec/ADR 的实质冲突时先报告，不自行覆盖已批准决定。

## Out of scope

不做复杂地图布局、拖拽编排、美化、Fork、分支合并或继续对话时跨 Provider 选择的新功能。

## Comments

2026-11-16，用户在 Ticket 01 完成后的讨论中明确确认：后续产品需要类似
Figma 的无边画布效果，可平移、缩放，在画布中展开对话 Node Card 和分支。
这是已确认的后续产品方向，需在实施地图相关工作前补充交互需求、验收条件
及 Ticket 安排；尚未决定全部纳入本票，亦未据此扩大本票现有验收范围。

待澄清项包括自动布局与手动拖拽的关系、节点及分支展开方式、视口与节点位置
的恢复规则。若将拖拽编排纳入交付，须显式修订上方 Out of scope。沿用已批准
的 Turn / Conversation / Fork 领域语义；本次方向确认不要求重新讨论这些规则，
也不授权开始画布实现。
