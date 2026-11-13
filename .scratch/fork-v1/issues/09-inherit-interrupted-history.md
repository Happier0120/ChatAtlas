# 09: Fork 完整继承包含中断 Turn 的历史

Status: ready-for-agent

**What to build:** 用户在停止、失败或截断的轮次之后继续交流，从后续正常完成的 Turn 创建 Fork，新分支仍准确继承实际发生过的历史。

**Blocked by:** [05：提交草稿，完成最小完整 Fork](05-minimal-fork-submission.md)；[07：停止、失败或截断后保留真实内容并继续交流](07-generation-terminal-states.md)

## 背景与依据

先读 [项目 Agent 指令](../../../AGENTS.md)、[本地 Issue Tracker](../../../docs/agents/issue-tracker.md) 和 [领域文档入口](../../../docs/agents/domain.md)。领域依据为 [已批准 Fork V1 Spec](../spec.md)、[GLOSSARY](../../../GLOSSARY.md)、[ADR-0001：共享 Turn 历史与独立 Conversation 身份](../../../docs/adr/0001-share-turn-history-across-conversations.md)、[ADR-0002：独立保存分支草稿](../../../docs/adr/0002-persist-fork-drafts-before-conversation-creation.md)。

关联需求：5、6、14、29–31、36。

05 提供普通 Fork 闭环，07 提供真实的结束状态及中断历史。单层分支足以验证本票，不需要等待 06 的复杂共享入口或多层路径。

本票采用用户正式批准的 14 票拆分与依赖；工程前提及 Provider 扩展边界来自发布时的补充批准，不修改 Spec、GLOSSARY 或 ADR。

## 技术约束

已批准工程前提：React + TypeScript + Vite / Node.js + Fastify，个人本机 Web 应用；SQLite + Drizzle，保留真实事务、唯一性约束与迁移。首次建立或新增依赖时核实稳定版本和 Windows 兼容性，不在本票预填未经验证的版本或实现文件路径。

V1 唯一要求真实接入的 Provider 是 DeepSeek，优先使用实施时官方支持的 deepseek-flash、非思考模式及 OpenAI 兼容 Chat Completions，API Key 仅在服务端。Provider Adapter 与领域历史解耦，Turn 明确记录实际 Provider/Model 身份。未来 OpenAI/GPT、xAI/Grok 及跨 Provider 继续/Fork 是扩展方向，不要求本票实现其 Adapter、兼容转换、模型网关或 Agent 编排。

- 依据 ADR-0001，结束状态说明是应用的上下文构建信息，不得修改原始消息或共享 Turn 身份。
- 保留历史每轮原 Prompt、实际回复和实际 Provider/Model 身份；根据目标 Provider/Model 构建受支持的请求表达，不能把原厂商协议原样视作统一领域历史。
- 本票用现有 V1 接入及可控替身验证文本语义，不实现 GPT/Grok 历史导入或跨 Provider 全兼容转换。

## Acceptance criteria

- [ ] 用界面产生中断轮次，再完成后续一轮正常回复；中断 Turn 不能直接作为 Fork 起点，后续正常完成 Turn 可以。
- [ ] 新分支请求按祖先顺序包含中断 Turn 的原 Prompt 及实际保存的 AI 文本，没有补写缺失回答。
- [ ] 请求明确表达该轮停止、失败或截断状态，并与原始 AI 内容区分；原历史文本保持不变。
- [ ] AI 零输出的历史仍保留原 Prompt 和实际结束状态，不虚构 AI 回复。
- [ ] 继承范围截止选中 Turn，包含起点回复；原 Conversation 后续内容不会混入。
- [ ] 在应用重新打开后重复 Fork，仍能构建相同历史语义，说明结束状态和实际内容已持久化。
- [ ] 在主要界面测试边界捕获替身收到的请求验证上述行为，不依赖真实模型是否在自然语言中提及中断。

## 验证与交付

以应用界面完整流程为主要验收边界，使用与真实 Provider 约定一致的可控模型替身及隔离的真实 SQLite 数据库。验证可观察行为、可恢复记录和实际模型请求，不依赖真实 API、供应商随机措辞、内部函数调用次数或特定表结构。涉及恢复时重启应用/重建会话验证，不能只查内存或数据库记录存在。

交付本票行为、对应自动化验收和必要的演示/运行说明；记录实际执行命令、结果及未完成验证。只运行与改动相关的必要检查，不把本票验收留到后续票。发现与 Spec/ADR 的实质冲突时先报告，不自行覆盖已批准决定。

## Out of scope

不新增中断 Turn 直接 Fork、重新生成、历史补全/改写、多模态继承或第二个真实 Provider。
