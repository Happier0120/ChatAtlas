import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'node:url';
import type { ProviderAdapter } from './provider.ts';
import { randomUUID } from 'node:crypto';
import { and, desc, eq } from 'drizzle-orm';
import { openDatabase } from './database.ts';
import { conversations, turns } from './schema.ts';
import type { Conversation, Turn } from '../shared/conversation.ts';

export async function createApp(options: {
  databasePath: string;
  provider: ProviderAdapter;
}) {
  const app = Fastify();
  const database = openDatabase(options.databasePath);
  const { db } = database;
  app.addHook('onClose', async () => { database.close(); });

  app.get('/api/conversations', async (): Promise<Conversation[]> => {
    // Ticket 01 only creates one-Turn paths. Shared history traversal belongs
    // to the later continue/Fork tickets, not this first-Turn read path.
    const records = db.select({ conversation: conversations, turn: turns })
      .from(conversations).innerJoin(turns, eq(conversations.tipTurnId, turns.id))
      .where(eq(conversations.projectId, 'local'))
      .orderBy(desc(conversations.createdAt), desc(conversations.id)).all();
    return records.map(({ conversation, turn }) => ({
      id: conversation.id, projectId: conversation.projectId,
      kind: 'independent', turns: [turn],
    }));
  });

  app.post<{ Body: { prompt: string } }>('/api/conversations', {
    schema: {
      body: {
        type: 'object', required: ['prompt'], additionalProperties: false,
        properties: { prompt: { type: 'string', pattern: '\\S' } },
      },
    },
  }, async (request, reply): Promise<Conversation> => {
    const { provider } = options;
    const turn: Turn = {
      id: randomUUID(), parentTurnId: null, prompt: request.body.prompt,
      response: null, status: 'generating',
      providerId: provider.providerId, modelId: provider.modelId,
    };
    const conversationId = randomUUID();

    // Admit and save the Prompt atomically, before asking the Provider.
    db.transaction((tx) => {
      tx.insert(turns).values({ ...turn, projectId: 'local' }).run();
      tx.insert(conversations).values({
        id: conversationId, projectId: 'local', tipTurnId: turn.id,
        createdAt: new Date().toISOString(),
      }).run();
    });

    const response = await provider.generate([{ role: 'user', content: turn.prompt }]);
    db.update(turns).set({ response, status: 'completed' })
      .where(and(eq(turns.id, turn.id), eq(turns.status, 'generating'))).run();
    reply.code(201);
    return {
      id: conversationId, projectId: 'local', kind: 'independent',
      turns: [{ ...turn, response, status: 'completed' }],
    };
  });

  await app.register(fastifyStatic, {
    root: fileURLToPath(new URL('../dist/', import.meta.url)),
  });
  return app;
}
