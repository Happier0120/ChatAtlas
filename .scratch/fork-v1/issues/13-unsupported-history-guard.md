# 13: 在创建草稿前阻止不支持的历史内容

Status: ready-for-agent

**What to build:** 用户尝试从包含当前无法正确继承的图片、文件或工具调用历史的位置 Fork 时，立即看到限制说明，避免误认为已经继承完整背景。

**Blocked by:** [04：创建、保存和恢复多个分支草稿](04-fork-draft-lifecycle.md)

## 背景与依据

先读 [项目 Agent 指令](../../../AGENTS.md)、[本地 Issue Tracker](../../../docs/agents/issue-tracker.md) 和 [领域文档入口](../../../docs/agents/domain.md)。领域依据为 [已批准 Fork V1 Spec](../spec.md)、[GLOSSARY](../../../GLOSSARY.md)、[ADR-0001：共享 Turn 历史与独立 Conversation 身份](../../../docs/adr/0001-share-turn-history-across-conversations.md)、[ADR-0002：独立保存分支草稿](../../../docs/adr/0002-persist-fork-drafts-before-conversation-creation.md)。

关联需求：36、37；分阶段多模态支持边界。

04 已提供草稿入口和保存。本票校验完整继承前缀的内容支持能力，发生在创建草稿之前，不需要等待正式提交或真实模型服务。

本票采用用户正式批准的 14 票拆分与依赖；工程前提及 Provider 扩展边界来自发布时的补充批准，不修改 Spec、GLOSSARY 或 ADR。

## 技术约束

已批准工程前提：React + TypeScript + Vite / Node.js + Fastify，个人本机 Web 应用；SQLite + Drizzle，保留真实事务、唯一性约束与迁移。首次建立或新增依赖时核实稳定版本和 Windows 兼容性，不在本票预填未经验证的版本或实现文件路径。

V1 唯一要求真实接入的 Provider 是 DeepSeek，优先使用实施时官方支持的 deepseek-flash、非思考模式及 OpenAI 兼容 Chat Completions，API Key 仅在服务端。Provider Adapter 与领域历史解耦，Turn 明确记录实际 Provider/Model 身份。未来 OpenAI/GPT、xAI/Grok 及跨 Provider 继续/Fork 是扩展方向，不要求本票实现其 Adapter、兼容转换、模型网关或 Agent 编排。

- 检查树根至起点的完整历史，而非仅选中 AI 回复；领域历史保留语义与内容类别，不永久限定为纯文本。
- 不支持内容通过测试历史构造；不能为了获得测试数据增加上传、导入、工具执行或真实多模态接入功能。
- 这里负责 V1 草稿创建前的历史支持门禁；11 负责所选目标模型的可用性/兼容性，12 负责提交前容量门禁，不能互相替代。
- 未来跨 Provider 的正确上下文转换只保留扩展边界，本票不实现转换器或第二家 Adapter。

## Acceptance criteria

- [ ] 对继承路径中包含不支持图片、文件或工具调用内容的历史执行 Fork，界面说明不能正确继承的原因。
- [ ] 上述限制发生在创建草稿之前；重新打开后也不存在新草稿或正式 Conversation。
- [ ] 不静默删除、忽略或转换不支持内容后继续宣称完整继承；原始历史保持不变。
- [ ] 同样的操作在受支持纯文本路径上仍能创建和恢复草稿。
- [ ] 包含已保存中断文本的历史不因中断状态本身被当作不支持内容；直接起点仍须正常完成，可用测试历史验证。
- [ ] 通过界面、真实持久化和预置历史证明上述行为，不要求业务实现上传、导入或工具调用。

## 验证与交付

以应用界面完整流程为主要验收边界，使用与真实 Provider 约定一致的可控模型替身及隔离的真实 SQLite 数据库。验证可观察行为、可恢复记录和实际模型请求，不依赖真实 API、供应商随机措辞、内部函数调用次数或特定表结构。涉及恢复时重启应用/重建会话验证，不能只查内存或数据库记录存在。

交付本票行为、对应自动化验收和必要的演示/运行说明；记录实际执行命令、结果及未完成验证。只运行与改动相关的必要检查，不把本票验收留到后续票。发现与 Spec/ADR 的实质冲突时先报告，不自行覆盖已批准决定。

## Out of scope

不交付图片/附件/工具结果完整继承，不新增多模态、历史导入或跨 Provider 语义转换能力。
