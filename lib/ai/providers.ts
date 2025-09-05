import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { gateway } from '@ai-sdk/gateway';
import { openai } from '@ai-sdk/openai';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { isTestEnvironment } from '../constants';

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
        'gpt-5-mini-thinking': reasoningModel,
        'file-search-model': chatModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': gateway.languageModel('xai/grok-2-vision-1212'),
        'chat-model-reasoning': wrapLanguageModel({
          model: gateway.languageModel('xai/grok-3-mini-beta'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': gateway.languageModel('xai/grok-2-1212'),
        'artifact-model': gateway.languageModel('xai/grok-2-1212'),
        'gpt-5-mini-thinking': process.env.OPENAI_API_KEY 
          ? wrapLanguageModel({
              model: openai('gpt-5-mini-2025-09-01', {
                reasoningEffort: 'medium',
                structuredOutputs: true,
              }),
              middleware: extractReasoningMiddleware({ tagName: 'thinking' }),
            })
          : wrapLanguageModel({
              model: gateway.languageModel('xai/grok-3-mini-beta'),
              middleware: extractReasoningMiddleware({ tagName: 'thinking' }),
            }),
        'file-search-model': process.env.OPENAI_API_KEY
          ? openai('gpt-5-mini-2025-09-01', {
              reasoningEffort: 'low',
            })
          : gateway.languageModel('xai/grok-2-1212'),
      },
    });
