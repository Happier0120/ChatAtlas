# 14: 删除 Conversation 并保护共享历史和草稿

Status: ready-for-agent

**What to build:** 用户独立删除一个 Conversation 后，其他 Conversation 仍可读取和继续；依赖共享历史的有效草稿仍可从独立入口恢复并提交。

**Blocked by:** [05：提交草稿，完成最小完整 Fork](05-minimal-fork-submission.md)

## 背景与依据

先读 [项目 Agent 指令](../../../AGENTS.md)、[本地 Issue Tracker](../../../docs/agents/issue-tracker.md) 和 [领域文档入口](../../../docs/agents/domain.md)。领域依据为 [已批准 Fork V1 Spec](../spec.md)、[GLOSSARY](../../../GLOSSARY.md)、[ADR-0001：共享 Turn 历史与独立 Conversation 身份](../../../docs/adr/0001-share-turn-history-across-conversations.md)、[ADR-0002：独立保存分支草稿](../../../docs/adr/0002-persist-fork-drafts-before-conversation-creation.md)。

关联需求：13、23–25；ADR-0001 和 ADR-0002 的引用保护原则。

05 已建立共享 Turn 的正式分支，04 已提供独立草稿入口及持久化。一个分支和一个草稿即可验证本票，不等待 06 的多层 Fork；删除身份不代表拥有或删除其产生的历史。

本票采用用户正式批准的 14 票拆分与依赖；工程前提及 Provider 扩展边界来自发布时的补充批准，不修改 Spec、GLOSSARY 或 ADR。

## 技术约束

已批准工程前提：React + TypeScript + Vite / Node.js + Fastify，个人本机 Web 应用；SQLite + Drizzle，保留真实事务、唯一性约束与迁移。首次建立或新增依赖时核实稳定版本和 Windows 兼容性，不在本票预填未经验证的版本或实现文件路径。

V1 唯一要求真实接入的 Provider 是 DeepSeek，优先使用实施时官方支持的 deepseek-flash、非思考模式及 OpenAI 兼容 Chat Completions，API Key 仅在服务端。Provider Adapter 与领域历史解耦，Turn 明确记录实际 Provider/Model 身份。未来 OpenAI/GPT、xAI/Grok 及跨 Provider 继续/Fork 是扩展方向，不要求本票实现其 Adapter、兼容转换、模型网关或 Agent 编排。

- 保留其他 Conversation 或有效草稿引用的 Turn 及必要祖先，不依据 Turn 最初由哪个 Conversation 创建决定保留。
- 不为保护历史保留被删除 Conversation 的身份，也不引入 createdFromConversationId 或来源所有权。
- 草稿恢复必须通过独立入口完成，不能要求先打开已删除 Conversation。必要历史的可读取、可构建请求和可提交均属于保护行为。
- 删除草稿后不再被引用的历史可留待后续清理；本票不实现物理垃圾回收算法。
- 历史 Turn 的 Provider/Model 身份及原始语义随历史一起保留；草稿提交仍遵守已落地的模型/容量门禁，不把已删除 Conversation 当作模型来源。

## Acceptance criteria

- [ ] 从一条 Conversation Fork 出另一条后，独立删除原 Conversation，另一条仍可读取完整历史、正常继续；不发生级联删除。
- [ ] 删除树初始路径的 Conversation 身份，不会删除仍被引用的根 Turn 或必要祖先；界面不需要保留一个伪装成未删除的 Conversation。
- [ ] 创建有效草稿后删除其历史所在的 Conversation，即使不再有其他正式 Conversation 使用该历史，草稿及祖先仍受保护。
- [ ] 重启应用后，从独立草稿入口恢复上述草稿，读取正确起点、Prompt 和模型身份，并可在模型兼容且容量满足时成功提交。
- [ ] 草稿提交的模型请求包含完整历史，证明保护不仅是数据库记录残留或仅能显示卡片。
- [ ] 删除一个草稿不破坏其他草稿或 Conversation 的共享历史与恢复入口。
- [ ] 最后一个引用者消失时不要求立即物理删除历史；不将清理算法列为本票完成条件。
- [ ] 界面验收经过真实删除、重启、恢复和提交，不只验证引用数或数据库行存在。

## 验证与交付

以应用界面完整流程为主要验收边界，使用与真实 Provider 约定一致的可控模型替身及隔离的真实 SQLite 数据库。验证可观察行为、可恢复记录和实际模型请求，不依赖真实 API、供应商随机措辞、内部函数调用次数或特定表结构。涉及恢复时重启应用/重建会话验证，不能只查内存或数据库记录存在。

交付本票行为、对应自动化验收和必要的演示/运行说明；记录实际执行命令、结果及未完成验证。只运行与改动相关的必要检查，不把本票验收留到后续票。发现与 Spec/ADR 的实质冲突时先报告，不自行覆盖已批准决定。

## Out of scope

不实现无引用历史的物理清理、回收站/恢复已删除 Conversation、来源所有权、复杂删除管理平台或多层树的全面重构。
