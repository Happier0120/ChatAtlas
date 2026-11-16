import { sql } from 'drizzle-orm';
import { sqliteTable, text, check, type AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

export const turns = sqliteTable('turns', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id),
  parentTurnId: text('parent_turn_id').references((): AnySQLiteColumn => turns.id),
  prompt: text('prompt').notNull(),
  response: text('response'),
  status: text('status', { enum: ['generating', 'completed'] }).notNull(),
  providerId: text('provider_id').notNull(),
  modelId: text('model_id').notNull(),
}, (table) => [
  check('turn_status', sql`${table.status} in ('generating', 'completed')`),
  check('completed_response', sql`${table.status} != 'completed' or ${table.response} is not null`),
]);

// The Conversation references a history path; it does not own the Turn.
export const conversations = sqliteTable('conversations', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id),
  tipTurnId: text('tip_turn_id').notNull().references(() => turns.id),
  createdAt: text('created_at').notNull(),
});
