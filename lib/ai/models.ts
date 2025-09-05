export const DEFAULT_CHAT_MODEL: string = 'gpt-5-mini-thinking';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
  provider?: 'xai' | 'openai';
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'gpt-5-mini-thinking',
    name: 'GPT-5 Mini (September 2025)',
    description: 'Latest thinking model with file search, low verbosity, medium reasoning',
    provider: 'openai',
  },
  {
    id: 'chat-model',
    name: 'Grok Vision',
    description: 'Advanced multimodal model with vision and text capabilities',
    provider: 'xai',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Grok Reasoning',
    description: 'Uses advanced chain-of-thought reasoning for complex problems',
    provider: 'xai',
  },
];
