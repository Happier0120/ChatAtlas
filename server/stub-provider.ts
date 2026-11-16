import type { ProviderAdapter } from './provider.ts';

export const stubProvider: ProviderAdapter = {
  providerId: 'test-provider',
  modelId: 'deterministic-echo-v1',
  async generate(messages) {
    return `测试回复：${messages.at(-1)?.content ?? ''}`;
  },
};
