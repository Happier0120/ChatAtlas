# ChatAtlas

ChatAtlas 用对话地图组织 AI 交流、历史路径及分支探索。本词汇表记录 Fork V1 访谈中已明确的术语含义；相关架构决策及其采纳状态以相应 ADR 为准。

## Language

**Project（项目）**：
组织相关 Conversation、分支草稿及其对话地图的工作范围。
_Avoid_：Conversation（用一条对话代指整个项目）

**Turn（对话轮次）**：
一条已提交的用户 Prompt 及与之对应的 AI 回复记录组成的交流轮次；回复可能尚未产生、仅有部分内容，或已正常完成。Turn Node 是同一个 Turn 在历史树中的称呼，不是另一个独立对象。
_Avoid_：Conversation、一问一答（若暗示必须已有完整回答）

**Turn Tree（对话树）**：
由历史继承和分叉关系连接 Turn Node 的树形结构，根为首个 Turn Node。Independent Conversation 开启它的初始对话路径，但 Conversation 本身不是树中的结构节点。
_Avoid_：单条 Conversation、以 Conversation 身份充当结构根

**Node Card（节点卡片）**：
对话地图中用于呈现一个 Turn 的卡片。
_Avoid_：Conversation、分支草稿卡（用它们代指正式 Turn 的卡片）

**Conversation（对话）**：
具有独立身份、表示一条完整有序历史路径的对话；不同 Conversation 可以在自己的路径中使用相同的历史 Turn。
_Avoid_：Turn、Node Card、整棵对话树

**Independent Conversation（独立对话）**：
通过 New Chat 发起、而非通过 Fork 从已有 Turn 分出的 Conversation。
_Avoid_：根 Turn、来源 Conversation

**Forked Conversation（分支对话）**：
从既有 Turn 的历史位置分出的独立 Conversation，在对应分支草稿首次提交 Prompt 时成立。
_Avoid_：分支草稿

**分支草稿**：
尚未提交首个 Prompt、以某个既有 Turn 为探索起点的准备内容，可保存并恢复。它具有独立的编辑状态，但尚不是 Conversation 或正式 Turn。
_Avoid_：空白 Conversation、Turn Node

**Fork（分叉）**：
以既有 Turn 对应的 AI 回复结束位置为起点，沿继承的历史准备并创建另一条 Conversation 的过程。
_Avoid_：继续当前对话、重新生成原回复

**已结束的 Turn**：
本轮 AI 生成已经终止的 Turn，包括正常完成、主动停止、生成失败以及因输出上限截断的情况。
_Avoid_：正常完成的 Turn（用它泛指所有结束情况）

**正常完成的 Turn**：
AI 回复正常生成结束，未因主动停止、生成失败或输出上限而中断的 Turn。
_Avoid_：内容已固定、已结束的 Turn（用它们替代正常完成的判断）
