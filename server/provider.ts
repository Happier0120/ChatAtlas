export type ModelMessage = { role: 'user' | 'assistant'; content: string };

// Application messages, not a vendor's wire protocol.
export interface ProviderAdapter {
  readonly providerId: string;
  readonly modelId: string;
  generate(messages: ModelMessage[]): Promise<string>;
}
