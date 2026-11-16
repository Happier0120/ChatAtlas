import { test, expect } from './app-fixture.ts';

// Catches missing submission, duplicated Turn cards, incorrect model input or identity.
test('New Chat completes one root Turn with a separate Independent Conversation identity', async ({ page, app }) => {
  await page.goto(app.url);
  await page.getByRole('button', { name: 'New Chat', exact: true }).click();
  await expect(page.getByRole('article', { name: 'Node Card' })).toHaveCount(0);
  await page.getByLabel('Prompt', { exact: true }).fill('   \n  ');
  await expect(page.getByRole('button', { name: '发送', exact: true })).toBeDisabled();
  await expect(page.getByRole('navigation', { name: '对话列表' }).getByRole('button')).toHaveCount(0);
  await page.getByLabel('Prompt', { exact: true }).fill('你好，ChatAtlas！\n请保留这一行。');
  await page.getByRole('button', { name: '发送', exact: true }).click();

  const card = page.getByRole('article', { name: 'Node Card' });
  await expect(card).toHaveCount(1);
  await expect(card.getByLabel('用户 Prompt')).toHaveText('你好，ChatAtlas！\n请保留这一行。');
  await expect(card.getByLabel('AI 回复')).toHaveText('这是可控替身的确定性回复。');
  await expect(card.getByLabel('结束状态')).toHaveText('正常完成');
  await page.getByText('对话记录信息', { exact: true }).click();
  await card.getByText('本轮记录信息', { exact: true }).click();
  await expect(card.getByLabel('Provider')).toHaveText('test-provider');
  await expect(card.getByLabel('Model')).toHaveText('scripted-v1');
  await expect(card.getByText('树根', { exact: true })).toBeVisible();
  const turnId = await card.getByLabel('Turn ID', { exact: true }).innerText();
  const conversationId = await page.getByLabel('Conversation ID', { exact: true }).innerText();
  await expect(page.getByText('Independent Conversation', { exact: true })).toBeVisible();
  expect(turnId).toMatch(/^[0-9a-f-]{36}$/);
  expect(conversationId).toMatch(/^[0-9a-f-]{36}$/);
  expect(conversationId).not.toBe(turnId);
  expect(app.requests).toEqual([{
    type: 'model-request', providerId: 'test-provider', modelId: 'scripted-v1',
    messages: [{ role: 'user', content: '你好，ChatAtlas！\n请保留这一行。' }],
  }]);

  await page.getByRole('button', { name: 'New Chat', exact: true }).click();
  await page.getByLabel('Prompt', { exact: true }).fill('另一个独立问题');
  await page.getByRole('button', { name: '发送', exact: true }).click();
  await expect(card.getByLabel('用户 Prompt')).toHaveText('另一个独立问题');
  await page.getByText('对话记录信息', { exact: true }).click();
  await card.getByText('本轮记录信息', { exact: true }).click();
  expect(await page.getByLabel('Conversation ID', { exact: true }).innerText()).not.toBe(conversationId);
  expect(await card.getByLabel('Turn ID', { exact: true }).innerText()).not.toBe(turnId);
  await expect(card).toHaveCount(1);
  await expect(card.getByText('树根', { exact: true })).toBeVisible();
  expect(app.requests[1]?.messages).toEqual([{ role: 'user', content: '另一个独立问题' }]);
  const history = page.getByRole('navigation', { name: '对话列表' });
  await expect(history.getByRole('button')).toHaveCount(2);
  await history.getByRole('button', { name: '你好，ChatAtlas！ 请保留这一行。', exact: true }).click();
  await expect(card.getByLabel('用户 Prompt')).toHaveText('你好，ChatAtlas！\n请保留这一行。');
  await expect(page.getByLabel('Conversation ID', { exact: true })).toHaveText(conversationId);
  await expect(card.getByLabel('Turn ID', { exact: true })).toHaveText(turnId);
});

// Catches browser-only storage, lost identity/metadata, and regeneration on reopen.
test('a completed Turn survives a server process restart and a fresh browser session', async ({ page, browser, app }, testInfo) => {
  await page.goto(app.url);
  await page.getByRole('button', { name: 'New Chat', exact: true }).click();
  await page.getByLabel('Prompt', { exact: true }).fill('  重启后仍然保留\n这条 Prompt。  ');
  await page.getByRole('button', { name: '发送', exact: true }).click();
  await expect(page.getByLabel('结束状态')).toHaveText('正常完成');
  await page.getByText('对话记录信息', { exact: true }).click();
  await page.getByText('本轮记录信息', { exact: true }).click();
  const conversationId = await page.getByLabel('Conversation ID', { exact: true }).innerText();
  const turnId = await page.getByLabel('Turn ID', { exact: true }).innerText();

  await page.context().close();
  await app.stop();
  await app.start();
  const context = await browser.newContext();
  const reopened = await context.newPage();
  try {
    await reopened.goto(app.url);
    await reopened.getByRole('navigation', { name: '对话列表' }).getByRole('button').click();
    await reopened.getByText('对话记录信息', { exact: true }).click();
    await reopened.getByText('本轮记录信息', { exact: true }).click();
    await expect(reopened.getByRole('article', { name: 'Node Card' })).toHaveCount(1);
    await expect(reopened.getByLabel('Conversation ID', { exact: true })).toHaveText(conversationId);
    await expect(reopened.getByLabel('Turn ID', { exact: true })).toHaveText(turnId);
    expect(await reopened.getByLabel('用户 Prompt').innerText()).toBe('  重启后仍然保留\n这条 Prompt。  ');
    await expect(reopened.getByLabel('AI 回复')).toHaveText('这是可控替身的确定性回复。');
    await expect(reopened.getByLabel('Provider')).toHaveText('test-provider');
    await expect(reopened.getByLabel('Model')).toHaveText('scripted-v1');
    await expect(reopened.getByLabel('结束状态')).toHaveText('正常完成');
    await expect(reopened.getByText('树根', { exact: true })).toBeVisible();
    expect(app.requests).toHaveLength(1);
    await testInfo.attach('recovered-conversation', {
      body: await reopened.screenshot({ fullPage: true }), contentType: 'image/png',
    });
  } finally {
    await context.close();
  }
});
