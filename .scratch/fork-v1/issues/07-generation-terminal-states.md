# 07: 停止、失败或截断后保留真实内容并继续交流

Status: ready-for-agent

**What to build:** 用户查看生成中的内容并主动停止；遇到网络或生成失败、输出上限截断后仍能读取实际内容，并在同一 Conversation 继续下一轮。

**Blocked by:** [03：继续当前 Conversation，并呈现独立历史路径](03-continue-conversation-map.md)

## 背景与依据

先读 [项目 Agent 指令](../../../AGENTS.md)、[本地 Issue Tracker](../../../docs/agents/issue-tracker.md) 和 [领域文档入口](../../../docs/agents/domain.md)。领域依据为 [已批准 Fork V1 Spec](../spec.md)、[GLOSSARY](../../../GLOSSARY.md)、[ADR-0001：共享 Turn 历史与独立 Conversation 身份](../../../docs/adr/0001-share-turn-history-across-conversations.md)、[ADR-0002：独立保存分支草稿](../../../docs/adr/0002-persist-fork-drafts-before-conversation-creation.md)。

关联需求：5、28–31、36；ADR-0001 的已结束历史只读。

03 已提供多轮路径。本票完成单个 Conversation 的生成生命周期，使用模型替身即可独立验收，不等待真实服务或正式 Fork 票。

本票采用用户正式批准的 14 票拆分与依赖；工程前提及 Provider 扩展边界来自发布时的补充批准，不修改 Spec、GLOSSARY 或 ADR。

## 技术约束

已批准工程前提：React + TypeScript + Vite / Node.js + Fastify，个人本机 Web 应用；SQLite + Drizzle，保留真实事务、唯一性约束与迁移。首次建立或新增依赖时核实稳定版本和 Windows 兼容性，不在本票预填未经验证的版本或实现文件路径。

V1 唯一要求真实接入的 Provider 是 DeepSeek，优先使用实施时官方支持的 deepseek-flash、非思考模式及 OpenAI 兼容 Chat Completions，API Key 仅在服务端。Provider Adapter 与领域历史解耦，Turn 明确记录实际 Provider/Model 身份。未来 OpenAI/GPT、xAI/Grok 及跨 Provider 继续/Fork 是扩展方向，不要求本票实现其 Adapter、兼容转换、模型网关或 Agent 编排。

- 沿应用侧 Provider Adapter 约定处理增量内容与结束状态；厂商 finish reason 的解释位于适配边界，不渗入 Turn/Conversation 结构。
- 正常完成、用户主动停止、模型调用网络异常、生成失败和输出上限截断不能混淆。异常断流不能当作正常完成，客户端提交响应丢失的幂等性属于 08。
- 按实际保存的 Prompt/回复构建下一轮语义上下文；结束状态说明单独加入上下文构建信息，不修改原始 AI 文本。
- 完整状态处理应与已存在的实际 Provider 适配器兼容；若 02 尚未落地，以相同应用侧约定与可控替身验收，不增加隐藏阻塞关系。

## Acceptance criteria

- [ ] 用户可观察逐步输出并主动停止；停止后保留原 Prompt 及实际已保存的部分回复。
- [ ] 替身可确定性触发正常完成、部分输出后失败、网络异常、输出上限截断及零输出失败，界面和持久化状态与实际情况一致。
- [ ] AI 没有产生内容时不虚构回复；所有已结束 Turn 的原始历史内容只读。
- [ ] 当前回复尚未结束时，不能在同一 Conversation 提交下一轮；结束后可继续。
- [ ] 下一轮请求包含真实历史文本，并明确非正常结束状态；状态说明不写回原始消息。
- [ ] 用于 Fork 资格判断的状态区分正常完成与仅内容固定，不能把停止/失败/截断当作合格起点。
- [ ] 应用重启后已结束轮次的实际内容和状态可读取；自动化验收无需真实 API。

## 验证与交付

以应用界面完整流程为主要验收边界，使用与真实 Provider 约定一致的可控模型替身及隔离的真实 SQLite 数据库。验证可观察行为、可恢复记录和实际模型请求，不依赖真实 API、供应商随机措辞、内部函数调用次数或特定表结构。涉及恢复时重启应用/重建会话验证，不能只查内存或数据库记录存在。

交付本票行为、对应自动化验收和必要的演示/运行说明；记录实际执行命令、结果及未完成验证。只运行与改动相关的必要检查，不把本票验收留到后续票。发现与 Spec/ADR 的实质冲突时先报告，不自行覆盖已批准决定。

## Out of scope

不实现 AI 重新生成、跨 Conversation 并发协调、进程崩溃后自动续传或复杂任务调度。并行生成由 10 交付。
