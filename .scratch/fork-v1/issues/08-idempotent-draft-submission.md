# 08: 同一草稿重复提交与重试保持唯一 Conversation

Status: ready-for-agent

**What to build:** 用户快速重复提交草稿，或因网络异常、创建失败及模型立即失败而重试同一次提交，都能得到正确结果，不产生重复的正式 Conversation。

**Blocked by:** [05：提交草稿，完成最小完整 Fork](05-minimal-fork-submission.md)

## 背景与依据

先读 [项目 Agent 指令](../../../AGENTS.md)、[本地 Issue Tracker](../../../docs/agents/issue-tracker.md) 和 [领域文档入口](../../../docs/agents/domain.md)。领域依据为 [已批准 Fork V1 Spec](../spec.md)、[GLOSSARY](../../../GLOSSARY.md)、[ADR-0001：共享 Turn 历史与独立 Conversation 身份](../../../docs/adr/0001-share-turn-history-across-conversations.md)、[ADR-0002：独立保存分支草稿](../../../docs/adr/0002-persist-fork-drafts-before-conversation-creation.md)。

关联需求：14、15、38；Implementation Decisions 的同一草稿提交语义。

05 已提供真实事务下的正式创建、草稿关联和创建后模型立即失败处理。幂等性所需故障可以在此基础上注入，因此本票只依赖 05，不依赖 07 的流式停止、部分输出及截断处理。

本票采用用户正式批准的 14 票拆分与依赖；工程前提及 Provider 扩展边界来自发布时的补充批准，不修改 Spec、GLOSSARY 或 ADR。

## 技术约束

已批准工程前提：React + TypeScript + Vite / Node.js + Fastify，个人本机 Web 应用；SQLite + Drizzle，保留真实事务、唯一性约束与迁移。首次建立或新增依赖时核实稳定版本和 Windows 兼容性，不在本票预填未经验证的版本或实现文件路径。

V1 唯一要求真实接入的 Provider 是 DeepSeek，优先使用实施时官方支持的 deepseek-flash、非思考模式及 OpenAI 兼容 Chat Completions，API Key 仅在服务端。Provider Adapter 与领域历史解耦，Turn 明确记录实际 Provider/Model 身份。未来 OpenAI/GPT、xAI/Grok 及跨 Provider 继续/Fork 是扩展方向，不要求本票实现其 Adapter、兼容转换、模型网关或 Agent 编排。

- 同一草稿首次成功提交后只能对应一个正式 Conversation，退出可提交状态并关联原对话；不同草稿即使同一起点也具有不同提交身份。
- 以真实 SQLite 事务和唯一性约束保证创建语义，不仅通过按钮禁用或进程内标记防重复；不规定唯一键的具体字段名或存储表结构。
- 创建成功的判断以实际持久化结果为准，不能以客户端是否收到成功响应或 AI 是否生成成功判断。
- 响应丢失故障需让应用实际完成创建后再丢弃/阻断响应；模型替身只替换外部生成，不模拟应用自己的提交成功。
- 已有 Conversation 的提交重试不得退回新建流程；已落地的 11、12 提交前门禁仍适用于尚未成功创建的首次提交，不通过本票绕开业务限制。

## Acceptance criteria

- [ ] 快速重复点击或发出重叠的同一草稿提交请求后，通过应用读取只存在一个新 Conversation，草稿关联同一身份。
- [ ] 在正式创建成功后丢失响应，再重试同一次提交，读取或恢复结果仍指向原 Conversation，不生成重复对话。
- [ ] 首次提交明确失败且未创建 Conversation 时，草稿可保留并重试；重试成功后仍只对应一个正式 Conversation。
- [ ] 正式 Conversation 创建后让模型替身立即失败，重试同一次草稿提交不创建新对话，不恢复草稿的新建资格。
- [ ] 成功提交后的关联经应用重启仍可恢复；不能依赖丢失后即失效的内存防重标记。
- [ ] 两个不同草稿即使来自同一 Turn、使用相同 Prompt，也能分别创建独立 Conversation，不把它们误合并。
- [ ] 界面与请求故障验收经过真实业务操作和数据库，通过可读取的正式身份及草稿状态验证，而非只观察按钮。
- [ ] 测试无需真实 DeepSeek API、完整流式停止界面或 07 的实现。

## 验证与交付

以应用界面完整流程为主要验收边界，使用与真实 Provider 约定一致的可控模型替身及隔离的真实 SQLite 数据库。验证可观察行为、可恢复记录和实际模型请求，不依赖真实 API、供应商随机措辞、内部函数调用次数或特定表结构。涉及恢复时重启应用/重建会话验证，不能只查内存或数据库记录存在。

交付本票行为、对应自动化验收和必要的演示/运行说明；记录实际执行命令、结果及未完成验证。只运行与改动相关的必要检查，不把本票验收留到后续票。发现与 Spec/ADR 的实质冲突时先报告，不自行覆盖已批准决定。

## Out of scope

不新增 AI 回复重新生成、后台自动重试次数/调度、跨设备同步或分布式任务基础设施。不改变已批准阻塞关系。
