export type Turn = {
  id: string;
  parentTurnId: string | null;
  prompt: string;
  response: string | null;
  status: 'generating' | 'completed';
  providerId: string;
  modelId: string;
};

export type Conversation = {
  id: string;
  projectId: string;
  kind: 'independent';
  turns: Turn[];
};
