# 02: 通过 DeepSeek 完成真实文本对话

Status: ready-for-agent

**What to build:** 用户在已有界面提交 Prompt，后端通过 DeepSeek 官方 API 获得真实文本回复并保存；相同应用行为可以在自动化环境中改用可控模型替身。

**Blocked by:** [01：在最小 Web 界面完成并恢复第一轮对话](01-first-turn-persistence.md)

## 背景与依据

先读 [项目 Agent 指令](../../../AGENTS.md)、[本地 Issue Tracker](../../../docs/agents/issue-tracker.md) 和 [领域文档入口](../../../docs/agents/domain.md)。领域依据为 [已批准 Fork V1 Spec](../spec.md)、[GLOSSARY](../../../GLOSSARY.md)、[ADR-0001：共享 Turn 历史与独立 Conversation 身份](../../../docs/adr/0001-share-turn-history-across-conversations.md)、[ADR-0002：独立保存分支草稿](../../../docs/adr/0002-persist-fork-drafts-before-conversation-creation.md)。

关联需求：14、19、32 的模型记录基础；Implementation Decisions 的生成与上下文；用户已批准的 DeepSeek 工程前提和多模型扩展边界。

01 已建立最小页面、持久化、替身和模型调用边界。本票只接入第一个真实 Provider DeepSeek；未来 OpenAI/GPT、xAI/Grok 的接入属于方向，不是本票交付。

本票采用用户正式批准的 14 票拆分与依赖；工程前提及 Provider 扩展边界来自发布时的补充批准，不修改 Spec、GLOSSARY 或 ADR。

## 技术约束

已批准工程前提：React + TypeScript + Vite / Node.js + Fastify，个人本机 Web 应用；SQLite + Drizzle，保留真实事务、唯一性约束与迁移。首次建立或新增依赖时核实稳定版本和 Windows 兼容性，不在本票预填未经验证的版本或实现文件路径。

V1 唯一要求真实接入的 Provider 是 DeepSeek，优先使用实施时官方支持的 deepseek-flash、非思考模式及 OpenAI 兼容 Chat Completions，API Key 仅在服务端。Provider Adapter 与领域历史解耦，Turn 明确记录实际 Provider/Model 身份。未来 OpenAI/GPT、xAI/Grok 及跨 Provider 继续/Fork 是扩展方向，不要求本票实现其 Adapter、兼容转换、模型网关或 Agent 编排。

- 实施时查阅 DeepSeek 官方调用、模型能力和模式控制文档；优先使用官方仍支持的 deepseek-flash，以 OpenAI 兼容 Chat Completions API 明确采用非思考模式，不能假设供应商默认模式。
- API Key 仅服务端配置和使用，不发送到浏览器、不进入前端构建产物或版本库。SDK/驱动版本需核实稳定性与 Windows 兼容性。
- 真实 Provider 与模型替身遵循同一应用侧调用约定；Provider Adapter 隔离请求编码、流式响应及结束原因等厂商协议。Turn、Conversation、Fork 使用应用语义，不将 DeepSeek 专有消息对象当作统一领域历史。
- Turn 记录实际调用的 Provider 标识和 Model 标识。模型可用性、上下文限制与能力信息按该身份关联，保留核实来源，不从名称猜测 Provider 或容量。
- 提供正常输出、完成/失败和流式协议的适配基础；用户停止与完整部分输出生命周期由 07 交付。连接关闭不自动代表正常完成。
- 官方资料入口：[DeepSeek API](https://api-docs.deepseek.com/)、[模式控制](https://api-docs.deepseek.com/guides/thinking_mode/)。实施时重新核对，不把发布 Tickets 时看到的信息视为永久不变。

## Acceptance criteria

- [ ] 配置有效服务端凭据后，从界面完成一轮真实 DeepSeek 文本调用，显示并保存回复；提供独立的真实调用验证步骤。
- [ ] 按当时官方文档验证模型标识、非思考模式参数与调用协议，记录上下文限制、结束原因和后续容量校验所需能力的来源。
- [ ] 界面读取的 Turn 保留明确的实际 Provider/Model 身份，重新打开后不丢失。
- [ ] 前端请求、响应及构建产物不包含 API Key；模型请求由后端发出。
- [ ] 适配器保留消息顺序、角色和实际内容；外部结束原因或错误被转换为应用可辨别的结果，不把异常结束伪装为完整回答。
- [ ] 同一界面流程可切换为可控模型替身运行自动化验收，无真实凭据或网络也可通过日常测试。
- [ ] 通过适配器测试验证请求编码及成功、流式片段、结束和错误响应处理；真实调用验证与自动化测试分开记录，未实际执行真实调用时如实注明。

## 验证与交付

以应用界面完整流程为主要验收边界，使用与真实 Provider 约定一致的可控模型替身及隔离的真实 SQLite 数据库。验证可观察行为、可恢复记录和实际模型请求，不依赖真实 API、供应商随机措辞、内部函数调用次数或特定表结构。涉及恢复时重启应用/重建会话验证，不能只查内存或数据库记录存在。

交付本票行为、对应自动化验收和必要的演示/运行说明；记录实际执行命令、结果及未完成验证。只运行与改动相关的必要检查，不把本票验收留到后续票。发现与 Spec/ADR 的实质冲突时先报告，不自行覆盖已批准决定。

## Out of scope

不实现第二个真实 Provider、不接入 OpenAI 或 xAI、不建设模型管理平台或 Agent 编排。不在本票实现草稿模型选择、容量门禁或完整停止交互。
