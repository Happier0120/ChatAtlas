# 04: 创建、保存和恢复多个分支草稿

Status: ready-for-agent

**What to build:** 用户从正常完成的历史 Turn 创建一个或多个分支草稿，编辑 Prompt、离开后恢复，或者取消草稿，而不提前创建正式 Conversation。

**Blocked by:** [03：继续当前 Conversation，并呈现独立历史路径](03-continue-conversation-map.md)

## 背景与依据

先读 [项目 Agent 指令](../../../AGENTS.md)、[本地 Issue Tracker](../../../docs/agents/issue-tracker.md) 和 [领域文档入口](../../../docs/agents/domain.md)。领域依据为 [已批准 Fork V1 Spec](../spec.md)、[GLOSSARY](../../../GLOSSARY.md)、[ADR-0001：共享 Turn 历史与独立 Conversation 身份](../../../docs/adr/0001-share-turn-history-across-conversations.md)、[ADR-0002：独立保存分支草稿](../../../docs/adr/0002-persist-fork-drafts-before-conversation-creation.md)。

关联需求：3、5、8–13、20、25 的草稿恢复基础。

03 已提供历史路径和地图。依据 ADR-0002，草稿不是 Conversation 或正式 Turn；依据 ADR-0001，有效草稿依赖起点及必要祖先历史。

本票采用用户正式批准的 14 票拆分与依赖；工程前提及 Provider 扩展边界来自发布时的补充批准，不修改 Spec、GLOSSARY 或 ADR。

## 技术约束

已批准工程前提：React + TypeScript + Vite / Node.js + Fastify，个人本机 Web 应用；SQLite + Drizzle，保留真实事务、唯一性约束与迁移。首次建立或新增依赖时核实稳定版本和 Windows 兼容性，不在本票预填未经验证的版本或实现文件路径。

V1 唯一要求真实接入的 Provider 是 DeepSeek，优先使用实施时官方支持的 deepseek-flash、非思考模式及 OpenAI 兼容 Chat Completions，API Key 仅在服务端。Provider Adapter 与领域历史解耦，Turn 明确记录实际 Provider/Model 身份。未来 OpenAI/GPT、xAI/Grok 及跨 Provider 继续/Fork 是扩展方向，不要求本票实现其 Adapter、兼容转换、模型网关或 Agent 编排。

- 草稿编辑卡区别于正式 Node Card；草稿持久化保存起点、准备内容及独立编辑状态，起点身份不依赖浏览入口。
- 提供独立的草稿恢复入口，不把恢复路径绑定为必须先打开来源 Conversation；删除后的完整验证由 14 交付。
- 准备内容中的默认 Provider/Model 身份沿用起点 Turn 的实际身份，不采用当前浏览路径末尾的模型，也不猜测 Provider；主动更换与可用性校验由 11 交付。
- 不合格起点的历史可用测试数据构造，不需要等待 07 的停止操作界面。

## Acceptance criteria

- [ ] 仅正常完成的 Turn 对应 AI 回复结束位置可创建草稿；生成中、停止、失败和输出截断的回复均不能直接作为起点。
- [ ] 没有合格 AI 回复时仍可使用 New Chat；不提供用户消息、消息内选中文本或首次提问前的 Fork。
- [ ] 点击 Fork 后出现草稿输入状态，不生成正式 Conversation 或正式 Turn，也不自动重新生成起点回复。
- [ ] 同一 Project 可保存多个独立草稿，同一起点也可创建多个；编辑其中一个不会覆盖另一个。
- [ ] 草稿自动保存；导航离开、刷新和重启后，可从独立草稿入口恢复正确起点、Prompt 和默认 Provider/Model 身份。
- [ ] 取消或删除未提交草稿不留下空白 Conversation，不修改原对话或其他草稿。
- [ ] 用界面、真实数据库和测试历史验证起点资格及恢复，不仅验证记录仍存在。

## 验证与交付

以应用界面完整流程为主要验收边界，使用与真实 Provider 约定一致的可控模型替身及隔离的真实 SQLite 数据库。验证可观察行为、可恢复记录和实际模型请求，不依赖真实 API、供应商随机措辞、内部函数调用次数或特定表结构。涉及恢复时重启应用/重建会话验证，不能只查内存或数据库记录存在。

交付本票行为、对应自动化验收和必要的演示/运行说明；记录实际执行命令、结果及未完成验证。只运行与改动相关的必要检查，不把本票验收留到后续票。发现与 Spec/ADR 的实质冲突时先报告，不自行覆盖已批准决定。

## Out of scope

不提交正式分支、不实现模型选择界面或删除 Conversation；这些由后续票交付。不要求固定保存频率、复杂草稿管理平台或物理清理历史。
