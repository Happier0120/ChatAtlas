# 05: 提交草稿，完成最小完整 Fork

Status: ready-for-agent

**What to build:** 用户从普通历史路径中间的合格 Turn 准备草稿并提交新 Prompt，进入独立的 Forked Conversation，得到基于完整继承历史的回复。

**Blocked by:** [04：创建、保存和恢复多个分支草稿](04-fork-draft-lifecycle.md)

## 背景与依据

先读 [项目 Agent 指令](../../../AGENTS.md)、[本地 Issue Tracker](../../../docs/agents/issue-tracker.md) 和 [领域文档入口](../../../docs/agents/domain.md)。领域依据为 [已批准 Fork V1 Spec](../spec.md)、[GLOSSARY](../../../GLOSSARY.md)、[ADR-0001：共享 Turn 历史与独立 Conversation 身份](../../../docs/adr/0001-share-turn-history-across-conversations.md)、[ADR-0002：独立保存分支草稿](../../../docs/adr/0002-persist-fork-drafts-before-conversation-creation.md)。

关联需求：1、2、6–9、14、15、22、31、32、36、38 的正常提交基础。

04 提供合格草稿与恢复，03 提供继续对话。此票从第一版就遵守 ADR-0001 的共享 Turn 身份和 ADR-0002 的提交时创建规则；不得先复制历史再留给 06 重构。

本票采用用户正式批准的 14 票拆分与依赖；工程前提及 Provider 扩展边界来自发布时的补充批准，不修改 Spec、GLOSSARY 或 ADR。

## 技术约束

已批准工程前提：React + TypeScript + Vite / Node.js + Fastify，个人本机 Web 应用；SQLite + Drizzle，保留真实事务、唯一性约束与迁移。首次建立或新增依赖时核实稳定版本和 Windows 兼容性，不在本票预填未经验证的版本或实现文件路径。

V1 唯一要求真实接入的 Provider 是 DeepSeek，优先使用实施时官方支持的 deepseek-flash、非思考模式及 OpenAI 兼容 Chat Completions，API Key 仅在服务端。Provider Adapter 与领域历史解耦，Turn 明确记录实际 Provider/Model 身份。未来 OpenAI/GPT、xAI/Grok 及跨 Provider 继续/Fork 是扩展方向，不要求本票实现其 Adapter、兼容转换、模型网关或 Agent 编排。

- 以 forkFromTurnId 记录结构起点，不建立 createdFromConversationId 或 Turn 创建者所有权。Conversation 表示完整有序历史路径。
- 使用真实事务保存正式 Conversation、首个新增 Turn 以及草稿提交关联；同一草稿的唯一性基础建立于此，重复请求与响应丢失的完整行为由 08 专项交付。
- 默认调用身份继承起点实际 Provider/Model；新 Turn 记录实际调用身份，历史 Turn 保留原身份及内容。应用语义经 Provider Adapter 转换，不存成厂商专有统一历史。
- 创建正式对话发生在有效提交后、模型生成成功前。包含替身立即报错的最小失败处理，足以让 08 独立验证提交幂等性。
- 11、12 将补齐模型及容量门禁；已有的提交前业务校验必须先通过才能创建正式 Conversation，不能先建空白对话再检查。

## Acceptance criteria

- [ ] 从普通路径的中间合格 Turn 创建草稿并提交后，出现独立 Conversation 和首个新增 Turn，用户进入该分支查看回复。
- [ ] 模型请求按顺序包含树根至起点的完整历史、选中的 AI 回复和新 Prompt，不包含原路径起点后的内容。
- [ ] 继承历史引用原 Turn 身份；从应用可读取的历史身份及内容确认共享语义，原 Conversation 的路径和内容不变。
- [ ] 成功提交后草稿退出可提交状态，并关联所创建的 Conversation；同一起点的不同草稿分别提交后产生不同 Conversation 身份。
- [ ] 未经手动更换时，请求使用起点 Turn 的 Provider/Model；新 Turn 保存本次实际调用身份。
- [ ] 使用可控模型替身暂缓回复时，已能观察到正式 Conversation 和新增 Turn，而非等待 AI 成功才创建。
- [ ] 替身在正式创建后立即失败且无输出时，保留 Conversation、原 Prompt 和失败结果，不虚构回复；用户可以沿该对话继续下一轮。
- [ ] 重新打开应用后可读取分支路径及草稿提交关联；全部自动化验收无需真实模型服务。

## 验证与交付

以应用界面完整流程为主要验收边界，使用与真实 Provider 约定一致的可控模型替身及隔离的真实 SQLite 数据库。验证可观察行为、可恢复记录和实际模型请求，不依赖真实 API、供应商随机措辞、内部函数调用次数或特定表结构。涉及恢复时重启应用/重建会话验证，不能只查内存或数据库记录存在。

交付本票行为、对应自动化验收和必要的演示/运行说明；记录实际执行命令、结果及未完成验证。只运行与改动相关的必要检查，不把本票验收留到后续票。发现与 Spec/ADR 的实质冲突时先报告，不自行覆盖已批准决定。

## Out of scope

只交付普通路径上的最小 Fork 闭环。不在此票展开共享入口与多层路径矩阵、部分流式失败、网络重试专项或其他真实 Provider 接入。
