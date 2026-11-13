# 10: 不同 Conversation 独立并行生成

Status: ready-for-agent

**What to build:** 用户在不同 Conversation 中同时生成回复，切换浏览、单独停止或遇到失败时，其他对话仍能独立完成和保存结果。

**Blocked by:** [07：停止、失败或截断后保留真实内容并继续交流](07-generation-terminal-states.md)

## 背景与依据

先读 [项目 Agent 指令](../../../AGENTS.md)、[本地 Issue Tracker](../../../docs/agents/issue-tracker.md) 和 [领域文档入口](../../../docs/agents/domain.md)。领域依据为 [已批准 Fork V1 Spec](../spec.md)、[GLOSSARY](../../../GLOSSARY.md)、[ADR-0001：共享 Turn 历史与独立 Conversation 身份](../../../docs/adr/0001-share-turn-history-across-conversations.md)、[ADR-0002：独立保存分支草稿](../../../docs/adr/0002-persist-fork-drafts-before-conversation-creation.md)。

关联需求：26–29；Conversation 独立任务与状态原则。

07 已完成单个 Conversation 的生成生命周期。以两条 Independent Conversation 即可验证任务隔离，故不强制等待 Fork、复杂路径或提交重试票；Forked Conversation 使用相同生成语义。

本票采用用户正式批准的 14 票拆分与依赖；工程前提及 Provider 扩展边界来自发布时的补充批准，不修改 Spec、GLOSSARY 或 ADR。

## 技术约束

已批准工程前提：React + TypeScript + Vite / Node.js + Fastify，个人本机 Web 应用；SQLite + Drizzle，保留真实事务、唯一性约束与迁移。首次建立或新增依赖时核实稳定版本和 Windows 兼容性，不在本票预填未经验证的版本或实现文件路径。

V1 唯一要求真实接入的 Provider 是 DeepSeek，优先使用实施时官方支持的 deepseek-flash、非思考模式及 OpenAI 兼容 Chat Completions，API Key 仅在服务端。Provider Adapter 与领域历史解耦，Turn 明确记录实际 Provider/Model 身份。未来 OpenAI/GPT、xAI/Grok 及跨 Provider 继续/Fork 是扩展方向，不要求本票实现其 Adapter、兼容转换、模型网关或 Agent 编排。

- 任务与输出关联实际 Conversation/Turn，不能用当前浏览选择或全局单一生成状态决定归属。
- 复用应用侧 Provider Adapter 和可控替身，使用可调度的片段与终止事件验证并发，不依赖供应商实际限流情况。
- SQLite 写事务保持短小，不在等待模型网络回复期间持有写事务；数据库写入调度不改变不同 Conversation 可并行生成的领域语义。
- 实际 Provider 的并发限制、排队或错误不能造成内容串写或停止另一 Conversation；不建设通用调度平台。

## Acceptance criteria

- [ ] 在两个 Conversation 启动生成，替身能保持两项任务同时进行，界面分别显示对应结果和状态。
- [ ] 停止其中一项时，另一项继续接收内容并正常结束；每条记录只包含自己的 Prompt 和输出。
- [ ] 让其中一项部分输出后失败，另一项仍能完成；失败记录保留实际内容和状态。
- [ ] 切换浏览的 Conversation 不改变生成结果的存储归属，也不把停止动作施加到未选择的任务。
- [ ] 同一个 Conversation 在回复未结束前仍不能提交下一轮，其他 Conversation 可正常提交。
- [ ] 结束后重启应用，各 Conversation 的身份、历史和实际结束结果保持独立。
- [ ] 自动化验收通过可控模型替身和真实数据库完成，避免依靠时间碰巧重叠的脆弱断言。

## 验证与交付

以应用界面完整流程为主要验收边界，使用与真实 Provider 约定一致的可控模型替身及隔离的真实 SQLite 数据库。验证可观察行为、可恢复记录和实际模型请求，不依赖真实 API、供应商随机措辞、内部函数调用次数或特定表结构。涉及恢复时重启应用/重建会话验证，不能只查内存或数据库记录存在。

交付本票行为、对应自动化验收和必要的演示/运行说明；记录实际执行命令、结果及未完成验证。只运行与改动相关的必要检查，不把本票验收留到后续票。发现与 Spec/ADR 的实质冲突时先报告，不自行覆盖已批准决定。

## Out of scope

不实现复杂任务队列、配额平台、分布式调度、后台崩溃自动续传或同一 Conversation 的多轮并发提交。
