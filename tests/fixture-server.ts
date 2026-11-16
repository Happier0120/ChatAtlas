import { createApp } from '../server/app.ts';
import type { ProviderAdapter } from '../server/provider.ts';

const provider: ProviderAdapter = {
  providerId: 'test-provider',
  modelId: 'scripted-v1',
  async generate(messages) {
    process.send?.({ type: 'model-request', providerId: this.providerId, modelId: this.modelId, messages });
    return '这是可控替身的确定性回复。';
  },
};

const app = await createApp({ databasePath: process.env.CHATATLAS_DB!, provider });
const url = await app.listen({ host: '127.0.0.1', port: 0 });
process.send?.({ type: 'ready', url });
process.on('message', async (message) => {
  if (message === 'stop') {
    await app.close();
    process.disconnect?.();
  }
});
