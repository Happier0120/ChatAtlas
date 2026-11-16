import { useEffect, useState, type FormEvent } from 'react';
import type { Conversation } from '../shared/conversation.ts';

export function App() {
  const [editing, setEditing] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch('/api/conversations', { signal: controller.signal });
        if (!response.ok) throw new Error('无法读取已保存的对话，请检查服务后刷新页面。');
        setConversations(await response.json() as Conversation[]);
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : '无法读取对话。');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (pending || !prompt.trim()) return;
    setPending(true);
    setError('');
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) throw new Error('提交未完成，请检查服务后重新打开对话列表。');
      const saved = await response.json() as Conversation;
      setConversation(saved);
      setConversations((previous) => [saved, ...previous]);
      setEditing(false);
      setPrompt('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '无法连接本机服务。');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="app">
      <header>
        <div><p className="eyebrow">我的 Project</p><h1>ChatAtlas</h1></div>
        <button disabled={pending || loading} onClick={() => {
          setEditing(true); setConversation(null); setPrompt(''); setError('');
        }}>New Chat</button>
      </header>
      <main>
        {error && <p role="alert">{error}</p>}
        <nav aria-label="对话列表">
          <h2>已保存的对话</h2>
          {loading && <p role="status">读取中…</p>}
          {!loading && conversations.length === 0 && <p>尚无对话。</p>}
          {conversations.map((saved) => <button key={saved.id} disabled={pending}
            aria-pressed={conversation?.id === saved.id} onClick={() => {
              setConversation(saved); setEditing(false); setError('');
            }}>{saved.turns[0]?.prompt}</button>)}
        </nav>
        {!editing && !conversation && <p>用 New Chat 开始第一轮对话。</p>}
        {editing && <section aria-label="新对话">
          <h2>开始独立对话</h2>
          <p>在这里提出问题，建立一条新的历史路径。</p>
          <form onSubmit={submit}>
            <label htmlFor="prompt">Prompt</label>
            <textarea id="prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)}
              disabled={pending} autoFocus rows={5} required />
            <button type="submit" disabled={pending || !prompt.trim()}>{pending ? '生成中…' : '发送'}</button>
          </form>
        </section>}
        {conversation && <section aria-label="当前对话">
          <h2>Independent Conversation</h2>
          <details><summary>对话记录信息</summary>
            <p>Conversation ID <code aria-label="Conversation ID">{conversation.id}</code></p>
          </details>
          <div aria-label="Turn Tree" className="turn-tree">
            {conversation.turns.map((turn) => <article aria-label="Node Card" key={turn.id}>
              <div className="card-heading"><h3>Turn</h3>{turn.parentTurnId === null && <span>树根</span>}</div>
              <h4>你</h4><p className="message" aria-label="用户 Prompt">{turn.prompt}</p>
              <h4>AI</h4><p className="message" aria-label="AI 回复">{turn.response}</p>
              <p aria-label="结束状态">{turn.status === 'completed' ? '正常完成' : '生成未完成'}</p>
              <details><summary>本轮记录信息</summary>
                <dl>
                  <dt>Turn ID</dt><dd><code aria-label="Turn ID">{turn.id}</code></dd>
                  <dt>Provider</dt><dd aria-label="Provider">{turn.providerId}</dd>
                  <dt>Model</dt><dd aria-label="Model">{turn.modelId}</dd>
                </dl>
              </details>
            </article>)}
          </div>
        </section>}
      </main>
      <footer>本地测试模型 · 确定性回复 · 无需 API Key</footer>
    </div>
  );
}
