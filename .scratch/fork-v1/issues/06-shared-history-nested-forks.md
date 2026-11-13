# 06: 从共享历史入口及已有分支继续 Fork

Status: ready-for-agent

**What to build:** 用户从不同 Conversation 中的同一共享 Turn 创建分支，或从已有分支的后续合格 Turn 再次 Fork，并在地图中查看正确的历史路径。

**Blocked by:** [05：提交草稿，完成最小完整 Fork](05-minimal-fork-submission.md)

## 背景与依据

先读 [项目 Agent 指令](../../../AGENTS.md)、[本地 Issue Tracker](../../../docs/agents/issue-tracker.md) 和 [领域文档入口](../../../docs/agents/domain.md)。领域依据为 [已批准 Fork V1 Spec](../spec.md)、[GLOSSARY](../../../GLOSSARY.md)、[ADR-0001：共享 Turn 历史与独立 Conversation 身份](../../../docs/adr/0001-share-turn-history-across-conversations.md)、[ADR-0002：独立保存分支草稿](../../../docs/adr/0002-persist-fork-drafts-before-conversation-creation.md)。

关联需求：6、7、15–17、22、36。

05 已建立真实共享 Turn 和最小提交闭环。本票扩展可操作的路径入口、浏览和上下文继承组合，不重新定义数据所有权。

本票采用用户正式批准的 14 票拆分与依赖；工程前提及 Provider 扩展边界来自发布时的补充批准，不修改 Spec、GLOSSARY 或 ADR。

## 技术约束

已批准工程前提：React + TypeScript + Vite / Node.js + Fastify，个人本机 Web 应用；SQLite + Drizzle，保留真实事务、唯一性约束与迁移。首次建立或新增依赖时核实稳定版本和 Windows 兼容性，不在本票预填未经验证的版本或实现文件路径。

V1 唯一要求真实接入的 Provider 是 DeepSeek，优先使用实施时官方支持的 deepseek-flash、非思考模式及 OpenAI 兼容 Chat Completions，API Key 仅在服务端。Provider Adapter 与领域历史解耦，Turn 明确记录实际 Provider/Model 身份。未来 OpenAI/GPT、xAI/Grok 及跨 Provider 继续/Fork 是扩展方向，不要求本票实现其 Adapter、兼容转换、模型网关或 Agent 编排。

- 结构来源始终是选中的 Turn，不依赖用户当前浏览的 Conversation，也不引入来源 Conversation 字段。
- 保留每个历史 Turn 的实际 Provider/Model 身份；新草稿默认身份来自选中起点。本票不要求跨真实 Provider 的模型转换或第二家接入。
- 若前置实现已自然支持某些场景，保留实现并用端到端验收证明，不为了展示工作量重新实现共享历史。

## Acceptance criteria

- [ ] 从两个 Conversation 中显示的同一共享 Turn 分别 Fork，在相同新 Prompt 下向替身发送的历史前缀一致。
- [ ] 分别提交的不同草稿产生独立 Conversation；共享的是历史 Turn，不能自动复用已有分支身份。
- [ ] 从 Forked Conversation 的后续正常完成 Turn 再次 Fork，得到正确祖先历史和新的独立分支。
- [ ] 构造至少两层分支及兄弟路径，确认请求不混入兄弟分支或所选起点之后的内容。
- [ ] 地图中可浏览并选择上述历史入口；正常“+”继续仍只在当前 Conversation 末尾新增 Turn。
- [ ] 重启应用后共享身份、各路径及模型身份不变；原对话内容未被分支操作改写。
- [ ] 实现不设置人为分叉层数上限；测试使用有限多层数据即可，不要求无限规模压力测试。

## 验证与交付

以应用界面完整流程为主要验收边界，使用与真实 Provider 约定一致的可控模型替身及隔离的真实 SQLite 数据库。验证可观察行为、可恢复记录和实际模型请求，不依赖真实 API、供应商随机措辞、内部函数调用次数或特定表结构。涉及恢复时重启应用/重建会话验证，不能只查内存或数据库记录存在。

交付本票行为、对应自动化验收和必要的演示/运行说明；记录实际执行命令、结果及未完成验证。只运行与改动相关的必要检查，不把本票验收留到后续票。发现与 Spec/ADR 的实质冲突时先报告，不自行覆盖已批准决定。

## Out of scope

不做分支合并、历史编辑、复杂布局或跨 Provider 全兼容。含中断内容的历史组合由 09 验证。
