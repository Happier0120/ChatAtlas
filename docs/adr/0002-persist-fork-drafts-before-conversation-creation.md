---
status: accepted
date: 2026-11-13
---

# 独立保存分支草稿，首次提交时创建正式对话

为让用户在多个历史位置准备探索方向而不提前产生空白 Conversation，将分支草稿作为可独立保存和恢复的准备内容：点击 Fork 创建草稿，首次提交 Prompt 时才创建具有独立身份的 Forked Conversation 和首个新增 Turn，无需等待 AI 回复成功。相比点击 Fork 即创建正式 Conversation，这一选择使取消输入不会留下正式对话，代价是需要分别管理草稿和正式对话的生命周期，并提供草稿恢复入口。有效草稿保护其起点和必要的祖先历史，保留规则沿用 [ADR-0001](0001-share-turn-history-across-conversations.md)，不以保留来源 Conversation 身份为条件。

记录依据：本聊天 Fork V1 访谈中重新确认的 Q12，以及 Q14、Q16–Q19。Q30 确认候选共识，用户于 2026-11-13 在 Q34 中明确采纳本 ADR，状态更新为 accepted。批准范围为本记录中的领域决策，不扩展为对完整 Fork V1 规格、技术选型或实现方案的批准。
