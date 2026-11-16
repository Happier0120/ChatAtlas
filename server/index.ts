import { createApp } from './app.ts';
import { defaultDatabasePath } from './database.ts';
import { stubProvider } from './stub-provider.ts';

const app = await createApp({
  databasePath: process.env.CHATATLAS_DB ?? defaultDatabasePath,
  provider: stubProvider,
});

try {
  const address = await app.listen({ host: '127.0.0.1', port: Number(process.env.PORT ?? 3000) });
  console.log(`ChatAtlas: ${address} (test-provider / deterministic-echo-v1)`);
} catch (error) {
  await app.close();
  throw error;
}

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, async () => { await app.close(); });
}
