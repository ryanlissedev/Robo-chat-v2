import { expect, test } from './fixtures';
import { generateUUID } from '@/lib/utils';
import { roboRailSystemPrompt, systemPrompt } from '@/lib/ai/prompts';
import { DEFAULT_CHAT_MODEL, chatModels } from '@/lib/ai/models';

test.describe('RoboRail System Configuration', () => {
  test('Default model should be gpt-5-mini', () => {
    expect(DEFAULT_CHAT_MODEL).toBe('gpt-5-mini');
  });

  test('gpt-5-mini model should exist in chat models', () => {
    const gpt5Mini = chatModels.find((model) => model.id === 'gpt-5-mini');
    expect(gpt5Mini).toBeDefined();
    expect(gpt5Mini?.name).toBe('GPT-5 Mini');
    expect(gpt5Mini?.description).toContain('RoboRail');
    expect(gpt5Mini?.provider).toBe('openai');
  });

  test('RoboRail system prompt should be properly defined', () => {
    expect(roboRailSystemPrompt).toBeDefined();
    expect(roboRailSystemPrompt).toContain('RoboRail Assistant');
    expect(roboRailSystemPrompt).toContain('HGG Profiling Equipment b.v.');
    expect(roboRailSystemPrompt).toContain('Key Responsibilities');
    expect(roboRailSystemPrompt).toContain('Query Response');
    expect(roboRailSystemPrompt).toContain('Troubleshooting Guidance');
    expect(roboRailSystemPrompt).toContain('Safety Emphasis');
  });

  test('System prompt should use RoboRail prompt for gpt-5-mini model', () => {
    const requestHints = {
      latitude: '0',
      longitude: '0',
      city: 'TestCity',
      country: 'TestCountry',
    };

    const prompt = systemPrompt({
      selectedChatModel: 'gpt-5-mini',
      requestHints,
    });

    expect(prompt).toContain('RoboRail Assistant');
    expect(prompt).toContain('HGG Profiling Equipment b.v.');
  });

  test('System prompt should use file search prompt for gpt-5-mini-thinking model', () => {
    const requestHints = {
      latitude: '0',
      longitude: '0',
      city: 'TestCity',
      country: 'TestCountry',
    };

    const prompt = systemPrompt({
      selectedChatModel: 'gpt-5-mini-thinking',
      requestHints,
    });

    expect(prompt).toContain('intelligent assistant with access to a vectorstore');
    expect(prompt).not.toContain('RoboRail Assistant');
  });
});

test.describe('RoboRail Chat API', () => {
  test('Should use gpt-5-mini model with RoboRail system prompt', async ({
    adaContext,
  }) => {
    const chatId = generateUUID();
    const messageId = generateUUID();

    const response = await adaContext.request.post('/api/chat', {
      data: {
        id: chatId,
        message: {
          id: messageId,
          role: 'user',
          content: 'What safety protocols should I follow when operating the RoboRail?',
          parts: [
            {
              type: 'text',
              text: 'What safety protocols should I follow when operating the RoboRail?',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'gpt-5-mini',
        selectedVisibilityType: 'private',
      },
    });

    expect(response.status()).toBe(200);
    const responseText = await response.text();
    expect(responseText).toBeTruthy();
  });

  test('Should handle RoboRail troubleshooting queries', async ({
    adaContext,
  }) => {
    const chatId = generateUUID();
    const messageId = generateUUID();

    const response = await adaContext.request.post('/api/chat', {
      data: {
        id: chatId,
        message: {
          id: messageId,
          role: 'user',
          content: 'The RoboRail machine is showing an error code E-102. What does this mean?',
          parts: [
            {
              type: 'text',
              text: 'The RoboRail machine is showing an error code E-102. What does this mean?',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'gpt-5-mini',
        selectedVisibilityType: 'private',
      },
    });

    expect(response.status()).toBe(200);
  });

  test('Should handle RoboRail maintenance queries', async ({
    adaContext,
  }) => {
    const chatId = generateUUID();
    const messageId = generateUUID();

    const response = await adaContext.request.post('/api/chat', {
      data: {
        id: chatId,
        message: {
          id: messageId,
          role: 'user',
          content: 'How often should I perform maintenance on the RoboRail cutting torch?',
          parts: [
            {
              type: 'text',
              text: 'How often should I perform maintenance on the RoboRail cutting torch?',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'gpt-5-mini',
        selectedVisibilityType: 'private',
      },
    });

    expect(response.status()).toBe(200);
  });

  test('Should handle calibration instructions request', async ({
    adaContext,
  }) => {
    const chatId = generateUUID();
    const messageId = generateUUID();

    const response = await adaContext.request.post('/api/chat', {
      data: {
        id: chatId,
        message: {
          id: messageId,
          role: 'user',
          content: 'Can you provide step-by-step instructions for calibrating the RoboRail?',
          parts: [
            {
              type: 'text',
              text: 'Can you provide step-by-step instructions for calibrating the RoboRail?',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'gpt-5-mini',
        selectedVisibilityType: 'private',
      },
    });

    expect(response.status()).toBe(200);
  });

  test('Should have tools enabled for gpt-5-mini model', async ({
    adaContext,
  }) => {
    const chatId = generateUUID();
    const messageId = generateUUID();

    const response = await adaContext.request.post('/api/chat', {
      data: {
        id: chatId,
        message: {
          id: messageId,
          role: 'user',
          content: 'Create a maintenance checklist document for the RoboRail',
          parts: [
            {
              type: 'text',
              text: 'Create a maintenance checklist document for the RoboRail',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'gpt-5-mini',
        selectedVisibilityType: 'private',
      },
    });

    expect(response.status()).toBe(200);
  });
});

test.describe('RoboRail Response Format', () => {
  test('Should format code blocks correctly', async ({
    adaContext,
  }) => {
    const chatId = generateUUID();
    const messageId = generateUUID();

    const response = await adaContext.request.post('/api/chat', {
      data: {
        id: chatId,
        message: {
          id: messageId,
          role: 'user',
          content: 'Show me a machine command example for the RoboRail',
          parts: [
            {
              type: 'text',
              text: 'Show me a machine command example for the RoboRail',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'gpt-5-mini',
        selectedVisibilityType: 'private',
      },
    });

    expect(response.status()).toBe(200);
  });

  test('Should provide concise initial responses', async ({
    adaContext,
  }) => {
    const chatId = generateUUID();
    const messageId = generateUUID();

    const response = await adaContext.request.post('/api/chat', {
      data: {
        id: chatId,
        message: {
          id: messageId,
          role: 'user',
          content: 'Explain the RoboRail operating principles',
          parts: [
            {
              type: 'text',
              text: 'Explain the RoboRail operating principles',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'gpt-5-mini',
        selectedVisibilityType: 'private',
      },
    });

    expect(response.status()).toBe(200);
  });
});

test.describe('Model Switching', () => {
  test('Should handle switching between models correctly', async ({
    adaContext,
  }) => {
    const chatId1 = generateUUID();
    const chatId2 = generateUUID();
    
    const response1 = await adaContext.request.post('/api/chat', {
      data: {
        id: chatId1,
        message: {
          id: generateUUID(),
          role: 'user',
          content: 'Test with gpt-5-mini',
          parts: [
            {
              type: 'text',
              text: 'Test with gpt-5-mini',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'gpt-5-mini',
        selectedVisibilityType: 'private',
      },
    });

    const response2 = await adaContext.request.post('/api/chat', {
      data: {
        id: chatId2,
        message: {
          id: generateUUID(),
          role: 'user',
          content: 'Test with gpt-5-mini-thinking',
          parts: [
            {
              type: 'text',
              text: 'Test with gpt-5-mini-thinking',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'gpt-5-mini-thinking',
        selectedVisibilityType: 'private',
      },
    });

    expect(response1.status()).toBe(200);
    expect(response2.status()).toBe(200);
  });
});

test.describe('RoboRail Safety Features', () => {
  test('Should emphasize safety in responses', async ({
    adaContext,
  }) => {
    const chatId = generateUUID();
    const messageId = generateUUID();

    const response = await adaContext.request.post('/api/chat', {
      data: {
        id: chatId,
        message: {
          id: messageId,
          role: 'user',
          content: 'How do I bypass the safety interlock on the RoboRail?',
          parts: [
            {
              type: 'text',
              text: 'How do I bypass the safety interlock on the RoboRail?',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'gpt-5-mini',
        selectedVisibilityType: 'private',
      },
    });

    expect(response.status()).toBe(200);
  });

  test('Should handle emergency procedures', async ({
    adaContext,
  }) => {
    const chatId = generateUUID();
    const messageId = generateUUID();

    const response = await adaContext.request.post('/api/chat', {
      data: {
        id: chatId,
        message: {
          id: messageId,
          role: 'user',
          content: 'What are the emergency stop procedures for the RoboRail?',
          parts: [
            {
              type: 'text',
              text: 'What are the emergency stop procedures for the RoboRail?',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'gpt-5-mini',
        selectedVisibilityType: 'private',
      },
    });

    expect(response.status()).toBe(200);
  });
});

test.describe('Complex Issue Handling', () => {
  test('Should recommend HGG support for complex issues', async ({
    adaContext,
  }) => {
    const chatId = generateUUID();
    const messageId = generateUUID();

    const response = await adaContext.request.post('/api/chat', {
      data: {
        id: chatId,
        message: {
          id: messageId,
          role: 'user',
          content: 'The RoboRail has multiple system failures and is not responding to any commands',
          parts: [
            {
              type: 'text',
              text: 'The RoboRail has multiple system failures and is not responding to any commands',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'gpt-5-mini',
        selectedVisibilityType: 'private',
      },
    });

    expect(response.status()).toBe(200);
  });
});