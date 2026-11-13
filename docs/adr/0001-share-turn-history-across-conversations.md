---
status: accepted
date: 2026-11-13
---

# 共享 Turn 历史与独立 Conversation 身份

为使分支共享同一段过去，并使删除任一 Conversation 不破坏其他对话或草稿所需的历史，采用共享 Turn 组成的历史结构，Conversation 则具有独立身份并表示使用这些 Turn 的一条完整有序路径。Fork 的结构来源仅为选中的 Turn，不建立来源 Conversation 关系，也不以最初产生 Turn 的 Conversation 决定其归属。相较于为分支复制历史或按来源 Conversation 管理历史所有权，这一选择保留了共同历史的身份一致性，代价是历史保留与后续清理必须同时考虑所有 Conversation 和有效草稿的引用，包括必要的祖先历史。

## Consequences

- Turn Node 与 Turn 是同一领域对象；Node Card 是其界面呈现，不引入另一套历史节点身份。
- Turn Tree 的根是首个 Turn Node。Independent Conversation 开启初始路径，但不是结构根；删除它的身份不等于删除仍被引用的树根或历史。
- 所有已结束 Turn 的历史内容只读，包括正常完成、主动停止、生成失败和因输出上限截断所留下的实际内容。这样不同 Conversation 和草稿使用的是一致的过去；后续改变历史表达需要另行明确机制，不能直接覆盖既有内容。
- 向模型提供的结束状态说明属于上下文构建信息，不修改原始历史内容。

记录依据：本聊天 Fork V1 访谈的 Q8、Q9、Q13、Q15、Q19、Q23，以及领域建模澄清 Q31–Q33。Q30 确认候选共识，用户于 2026-11-13 在 Q34 中明确采纳本 ADR，状态更新为 accepted。批准范围为本记录中的领域决策，不扩展为对完整 Fork V1 规格、技术选型或实现方案的批准。
