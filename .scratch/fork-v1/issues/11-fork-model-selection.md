# 11: 继承起点模型，并在提交前明确更换

Status: ready-for-agent

**What to build:** 用户在 Fork 草稿中查看继承的默认 Provider/Model，主动选择可用模型；目标未配置、不可用或能力不兼容时得到提示，保留草稿而不产生正式对话。

**Blocked by:** [02：通过 DeepSeek 完成真实文本对话](02-deepseek-provider.md)；[05：提交草稿，完成最小完整 Fork](05-minimal-fork-submission.md)

## 背景与依据

先读 [项目 Agent 指令](../../../AGENTS.md)、[本地 Issue Tracker](../../../docs/agents/issue-tracker.md) 和 [领域文档入口](../../../docs/agents/domain.md)。领域依据为 [已批准 Fork V1 Spec](../spec.md)、[GLOSSARY](../../../GLOSSARY.md)、[ADR-0001：共享 Turn 历史与独立 Conversation 身份](../../../docs/adr/0001-share-turn-history-across-conversations.md)、[ADR-0002：独立保存分支草稿](../../../docs/adr/0002-persist-fork-drafts-before-conversation-creation.md)。

关联需求：32、33；提交前校验和用户补充的 Provider/Model 模型选择原则。

02 已提供真实 DeepSeek Adapter 及模型能力依据，05 已提供正式 Fork 提交流程。本票将选择和模型可调用性门禁接入该流程。

本票采用用户正式批准的 14 票拆分与依赖；工程前提及 Provider 扩展边界来自发布时的补充批准，不修改 Spec、GLOSSARY 或 ADR。

## 技术约束

已批准工程前提：React + TypeScript + Vite / Node.js + Fastify，个人本机 Web 应用；SQLite + Drizzle，保留真实事务、唯一性约束与迁移。首次建立或新增依赖时核实稳定版本和 Windows 兼容性，不在本票预填未经验证的版本或实现文件路径。

V1 唯一要求真实接入的 Provider 是 DeepSeek，优先使用实施时官方支持的 deepseek-flash、非思考模式及 OpenAI 兼容 Chat Completions，API Key 仅在服务端。Provider Adapter 与领域历史解耦，Turn 明确记录实际 Provider/Model 身份。未来 OpenAI/GPT、xAI/Grok 及跨 Provider 继续/Fork 是扩展方向，不要求本票实现其 Adapter、兼容转换、模型网关或 Agent 编排。

- 默认 Provider 标识与 Model 标识整体继承起点 Turn 的实际身份，不从模型名称推断 Provider，也不继承当前浏览 Conversation 末尾的身份。
- 真实可调用选项只来自已配置、经验证的 DeepSeek 模型。未来 OpenAI/GPT、xAI/Grok 不得在正式界面中被展示为已可调用。
- 可配置的测试 Provider/Model 仅用于测试环境的选择、能力和不可用场景，遵循与真实 Adapter 相同的应用侧约定；不要求接入第二个真实服务。
- 服务端必须在正式创建 Conversation 之前检查目标配置、可用性和对完整历史的能力兼容性，不能只禁用前端按钮或先创建空白对话再报错。
- 按目标 Provider/Model 适配应用历史语义；不能静默遗漏或错误转换不兼容内容。具体上下文容量门禁由 12 交付，两者可独立开发。
- Provider 选择边界保持简洁，不扩展为供应商管理、凭据管理界面或继续对话时跨 Provider 切换的新功能。

## Acceptance criteria

- [ ] 起点 Turn 与当前浏览路径末尾使用不同模型身份时，草稿显示的默认 Provider/Model 与起点一致。
- [ ] 使用测试配置构造不同 Provider 具有相同 Model 名称的情形，选择与实际请求仍能按 Provider/Model 组合正确区分，不靠名称猜测。
- [ ] 用户明确更换后，请求路由到选定 Adapter/Model，新 Turn 保存实际身份，历史 Turn 的身份和内容不被改写。
- [ ] 默认或手动选择的模型未配置、不可用或能力不兼容时，显示明确原因，不自动更换目标，不发送错误转换的历史请求。
- [ ] 上述拒绝必须发生在创建正式 Conversation 之前；通过真实提交路径验证没有新增 Conversation，草稿仍可编辑并在重启后恢复。
- [ ] 修正选择为已配置且兼容的模型后可提交成功，草稿关联新对话，实际请求使用该目标。
- [ ] 正式界面不会将未接入的 OpenAI 或 Grok 标为可调用；多选项自动化验收仅靠测试配置即可完成。
- [ ] 模型不可用及不兼容门禁、默认继承和主动切换均有界面验收，不要求第二个真实 Provider。

## 验证与交付

以应用界面完整流程为主要验收边界，使用与真实 Provider 约定一致的可控模型替身及隔离的真实 SQLite 数据库。验证可观察行为、可恢复记录和实际模型请求，不依赖真实 API、供应商随机措辞、内部函数调用次数或特定表结构。涉及恢复时重启应用/重建会话验证，不能只查内存或数据库记录存在。

交付本票行为、对应自动化验收和必要的演示/运行说明；记录实际执行命令、结果及未完成验证。只运行与改动相关的必要检查，不把本票验收留到后续票。发现与 Spec/ADR 的实质冲突时先报告，不自行覆盖已批准决定。

## Out of scope

不实现 OpenAI/xAI Adapter、跨 Provider 全兼容、多模态转换、复杂模型平台或未批准的继续对话模型选择功能。
