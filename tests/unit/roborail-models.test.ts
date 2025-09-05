import { test, expect } from '@playwright/test';
import { DEFAULT_CHAT_MODEL, chatModels, type ChatModel } from '@/lib/ai/models';

test.describe('RoboRail Model Configuration', () => {
  test('DEFAULT_CHAT_MODEL is set to gpt-5-mini', () => {
    expect(DEFAULT_CHAT_MODEL).toBe('gpt-5-mini');
  });

  test('chatModels contains gpt-5-mini as first model', () => {
    expect(chatModels.length).toBeGreaterThan(0);
    expect(chatModels[0].id).toBe('gpt-5-mini');
  });

  test('gpt-5-mini model has correct properties', () => {
    const gpt5Mini = chatModels.find((model: ChatModel) => model.id === 'gpt-5-mini');
    
    expect(gpt5Mini).toBeDefined();
    expect(gpt5Mini?.id).toBe('gpt-5-mini');
    expect(gpt5Mini?.name).toBe('GPT-5 Mini');
    expect(gpt5Mini?.description).toBe('Default model with RoboRail expertise');
    expect(gpt5Mini?.provider).toBe('openai');
  });

  test('gpt-5-mini-thinking model still exists', () => {
    const gpt5MiniThinking = chatModels.find((model: ChatModel) => model.id === 'gpt-5-mini-thinking');
    
    expect(gpt5MiniThinking).toBeDefined();
    expect(gpt5MiniThinking?.id).toBe('gpt-5-mini-thinking');
    expect(gpt5MiniThinking?.name).toBe('GPT-5 Mini (September 2025)');
    expect(gpt5MiniThinking?.provider).toBe('openai');
  });

  test('all required models are present', () => {
    const modelIds = chatModels.map((model: ChatModel) => model.id);
    
    expect(modelIds).toContain('gpt-5-mini');
    expect(modelIds).toContain('gpt-5-mini-thinking');
    expect(modelIds).toContain('chat-model');
    expect(modelIds).toContain('chat-model-reasoning');
  });

  test('all models have required properties', () => {
    chatModels.forEach((model: ChatModel) => {
      expect(model).toHaveProperty('id');
      expect(model).toHaveProperty('name');
      expect(model).toHaveProperty('description');
      expect(typeof model.id).toBe('string');
      expect(typeof model.name).toBe('string');
      expect(typeof model.description).toBe('string');
      expect(model.id.length).toBeGreaterThan(0);
      expect(model.name.length).toBeGreaterThan(0);
      expect(model.description.length).toBeGreaterThan(0);
    });
  });

  test('OpenAI models have correct provider', () => {
    const openaiModels = chatModels.filter((model: ChatModel) => 
      model.id.startsWith('gpt-')
    );
    
    openaiModels.forEach((model: ChatModel) => {
      expect(model.provider).toBe('openai');
    });
  });

  test('XAI models have correct provider', () => {
    const xaiModels = chatModels.filter((model: ChatModel) => 
      model.id.startsWith('chat-model')
    );
    
    xaiModels.forEach((model: ChatModel) => {
      expect(model.provider).toBe('xai');
    });
  });

  test('model order is correct', () => {
    expect(chatModels[0].id).toBe('gpt-5-mini');
    expect(chatModels[1].id).toBe('gpt-5-mini-thinking');
    expect(chatModels[2].id).toBe('chat-model');
    expect(chatModels[3].id).toBe('chat-model-reasoning');
  });

  test('no duplicate model IDs exist', () => {
    const modelIds = chatModels.map((model: ChatModel) => model.id);
    const uniqueIds = new Set(modelIds);
    
    expect(modelIds.length).toBe(uniqueIds.size);
  });

  test('RoboRail reference only in gpt-5-mini model', () => {
    chatModels.forEach((model: ChatModel) => {
      if (model.id === 'gpt-5-mini') {
        expect(model.description.toLowerCase()).toContain('roborail');
      } else {
        expect(model.description.toLowerCase()).not.toContain('roborail');
      }
    });
  });
});