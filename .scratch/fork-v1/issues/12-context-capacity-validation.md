# 12: 上下文超限时阻止提交并保留草稿

Status: ready-for-agent

**What to build:** 用户提交无法由目标模型容纳完整上下文的新 Prompt 时，得到明确原因，草稿保留；调整后可以再次提交，不产生空白正式对话。

**Blocked by:** [02：通过 DeepSeek 完成真实文本对话](02-deepseek-provider.md)；[05：提交草稿，完成最小完整 Fork](05-minimal-fork-submission.md)

## 背景与依据

先读 [项目 Agent 指令](../../../AGENTS.md)、[本地 Issue Tracker](../../../docs/agents/issue-tracker.md) 和 [领域文档入口](../../../docs/agents/domain.md)。领域依据为 [已批准 Fork V1 Spec](../spec.md)、[GLOSSARY](../../../GLOSSARY.md)、[ADR-0001：共享 Turn 历史与独立 Conversation 身份](../../../docs/adr/0001-share-turn-history-across-conversations.md)、[ADR-0002：独立保存分支草稿](../../../docs/adr/0002-persist-fork-drafts-before-conversation-creation.md)。

关联需求：34、35；完整上下文继承及用户补充的目标 Provider/Model 容量门禁。

02 提供真实 DeepSeek 模型能力依据，05 提供提交闭环。本票可通过缩短 Prompt 独立验收，不以 11 的模型选择界面为前置；两者完成后验证换模型组合。

本票采用用户正式批准的 14 票拆分与依赖；工程前提及 Provider 扩展边界来自发布时的补充批准，不修改 Spec、GLOSSARY 或 ADR。

## 技术约束

已批准工程前提：React + TypeScript + Vite / Node.js + Fastify，个人本机 Web 应用；SQLite + Drizzle，保留真实事务、唯一性约束与迁移。首次建立或新增依赖时核实稳定版本和 Windows 兼容性，不在本票预填未经验证的版本或实现文件路径。

V1 唯一要求真实接入的 Provider 是 DeepSeek，优先使用实施时官方支持的 deepseek-flash、非思考模式及 OpenAI 兼容 Chat Completions，API Key 仅在服务端。Provider Adapter 与领域历史解耦，Turn 明确记录实际 Provider/Model 身份。未来 OpenAI/GPT、xAI/Grok 及跨 Provider 继续/Fork 是扩展方向，不要求本票实现其 Adapter、兼容转换、模型网关或 Agent 编排。

- 上下文容量、输入 Token 计数和输出预算都以目标 Provider/Model 的真实规则为依据，实施时核实官方模型资料和匹配的计数方法，保存依据。
- 优先使用经验证、与目标模型匹配的 Token 计数方法；明确误差范围或已知局限及安全余量依据。不把字符数、通用近似值或不匹配的 tokenizer 伪装为精确 Token 数。
- 计数覆盖实际发送的完整历史、当前 Prompt、结束状态说明和其他实际上下文信息，并按供应商规则处理消息编码开销与输出预算；不硬编码未经验证的容量公式。
- 在正式创建 Conversation 之前由服务端执行校验。容量不足时保留草稿，不能先创建再删除对话，也不能静默裁剪、摘要或丢弃内容。
- 能力和计数选择通过简洁的 Provider/Model 边界隔离，当前只要求 V1 实际接入模型及可控测试能力。不提前实现其他厂商计数器。
- 若无法建立可信的模型能力或计数依据，应明确报告实施阻碍，不用未经验证的假设宣称容量校验已完成。

## Acceptance criteria

- [ ] 记录目标模型容量、计数方式和输出预算的官方或可验证依据；准确区分精确计数与估算，并说明安全余量及其理由。
- [ ] 在测试中固定目标能力，验证允许提交与超限拒绝的边界；检查对象是实际请求上下文而非仅新 Prompt。
- [ ] 历史文本、当前 Prompt 或附加结束状态说明使请求超限时，均在正式创建 Conversation 前被拒绝，界面显示原因。
- [ ] 拒绝后没有新增正式 Conversation，没有使用裁剪或摘要历史的模型请求；草稿完整保留并可在应用重启后恢复。
- [ ] 缩短新 Prompt 后可正常提交，模型收到完整继承历史；允许侧的请求确实符合所采用的预算规则。
- [ ] 可控测试配置改变目标 Provider/Model 能力时，校验使用目标规则而不是起点模型规则；此验收无需 11 的切换界面。
- [ ] 与 11 同时可用时，通过界面换用可容纳上下文的已配置兼容模型可完成提交，不改变原历史。
- [ ] 全部边界自动化测试使用可控计数/能力输入和真实提交路径，不依赖真实 API 返回超限错误才能判定。

## 验证与交付

以应用界面完整流程为主要验收边界，使用与真实 Provider 约定一致的可控模型替身及隔离的真实 SQLite 数据库。验证可观察行为、可恢复记录和实际模型请求，不依赖真实 API、供应商随机措辞、内部函数调用次数或特定表结构。涉及恢复时重启应用/重建会话验证，不能只查内存或数据库记录存在。

交付本票行为、对应自动化验收和必要的演示/运行说明；记录实际执行命令、结果及未完成验证。只运行与改动相关的必要检查，不把本票验收留到后续票。发现与 Spec/ADR 的实质冲突时先报告，不自行覆盖已批准决定。

## Out of scope

不实现自动摘要、历史裁剪、静默丢弃、第二个真实 Provider 或通用模型容量服务。不得将超限拒绝改为创建后生成失败来绕过门禁。
