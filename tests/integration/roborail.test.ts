import { describe, it, expect, } from 'vitest';
import { systemPrompt } from '@/lib/ai/prompts';
import { DEFAULT_CHAT_MODEL, chatModels } from '@/lib/ai/models';
import type { RequestHints } from '@/lib/ai/prompts';

describe('RoboRail Integration Tests', () => {
  const mockRequestHints: RequestHints = {
    latitude: '52.3676',
    longitude: '4.9041',
    city: 'Amsterdam',
    country: 'Netherlands',
  };

  describe('Model and Prompt Integration', () => {
    it('should use RoboRail system prompt with default model', () => {
      const prompt = systemPrompt({
        selectedChatModel: DEFAULT_CHAT_MODEL,
        requestHints: mockRequestHints,
      });

      expect(DEFAULT_CHAT_MODEL).toBe('gpt-5-mini');
      expect(prompt).toContain('RoboRail Assistant');
      expect(prompt).toContain('HGG Profiling Equipment b.v.');
    });

    it('should apply correct system prompt for each model', () => {
      const models = ['gpt-5-mini', 'gpt-5-mini-thinking', 'chat-model', 'chat-model-reasoning'];
      
      models.forEach(modelId => {
        const prompt = systemPrompt({
          selectedChatModel: modelId,
          requestHints: mockRequestHints,
        });

        if (modelId === 'gpt-5-mini') {
          expect(prompt).toContain('RoboRail Assistant');
        } else if (modelId === 'gpt-5-mini-thinking') {
          expect(prompt).toContain('intelligent assistant with access to a vectorstore');
        } else if (modelId === 'chat-model-reasoning') {
          expect(prompt).toContain('friendly assistant');
          expect(prompt).not.toContain('artifacts');
        } else {
          expect(prompt).toContain('friendly assistant');
          expect(prompt).toContain('artifacts');
        }
      });
    });

    it('should include location hints in all prompts', () => {
      chatModels.forEach(model => {
        const prompt = systemPrompt({
          selectedChatModel: model.id,
          requestHints: mockRequestHints,
        });

        expect(prompt).toContain('Amsterdam');
        expect(prompt).toContain('Netherlands');
        expect(prompt).toContain('52.3676');
        expect(prompt).toContain('4.9041');
      });
    });
  });

  describe('RoboRail Specific Features', () => {
    it('should handle safety-related queries', () => {
      const safetyPrompt = systemPrompt({
        selectedChatModel: 'gpt-5-mini',
        requestHints: mockRequestHints,
      });

      expect(safetyPrompt).toContain('Safety Emphasis');
      expect(safetyPrompt).toContain('potential hazards');
      expect(safetyPrompt).toContain('safety protocols');
    });

    it('should support troubleshooting guidance', () => {
      const troubleshootingPrompt = systemPrompt({
        selectedChatModel: 'gpt-5-mini',
        requestHints: mockRequestHints,
      });

      expect(troubleshootingPrompt).toContain('Troubleshooting Guidance');
      expect(troubleshootingPrompt).toContain('diagnose issues');
      expect(troubleshootingPrompt).toContain('symptoms');
    });

    it('should provide instructional support', () => {
      const instructionalPrompt = systemPrompt({
        selectedChatModel: 'gpt-5-mini',
        requestHints: mockRequestHints,
      });

      expect(instructionalPrompt).toContain('Instructional Support');
      expect(instructionalPrompt).toContain('step-by-step instructions');
      expect(instructionalPrompt).toContain('calibrations');
    });

    it('should handle complex issues with support escalation', () => {
      const complexPrompt = systemPrompt({
        selectedChatModel: 'gpt-5-mini',
        requestHints: mockRequestHints,
      });

      expect(complexPrompt).toContain('Complex Issue Handling');
      expect(complexPrompt).toContain('HGG customer support');
      expect(complexPrompt).toContain('contact information');
    });
  });

  describe('Code Formatting Features', () => {
    it('should include proper code formatting instructions', () => {
      const codePrompt = systemPrompt({
        selectedChatModel: 'gpt-5-mini',
        requestHints: mockRequestHints,
      });

      expect(codePrompt).toContain('Code and Command Formatting');
      expect(codePrompt).toContain('```language-name');
      expect(codePrompt).toContain('code here');
    });
  });

  describe('Response Strategy', () => {
    it('should emphasize conciseness', () => {
      const responsePrompt = systemPrompt({
        selectedChatModel: 'gpt-5-mini',
        requestHints: mockRequestHints,
      });

      expect(responsePrompt).toContain('concise');
      expect(responsePrompt).toContain('brief');
      expect(responsePrompt).toContain('Initial Response Strategy');
    });
  });

  describe('Model Configuration Integrity', () => {
    it('should maintain consistent model configuration', () => {
      const gpt5Mini = chatModels.find(m => m.id === 'gpt-5-mini');
      
      expect(gpt5Mini).toBeDefined();
      expect(gpt5Mini?.provider).toBe('openai');
      expect(gpt5Mini?.description).toContain('RoboRail');
      
      const defaultPrompt = systemPrompt({
        selectedChatModel: gpt5Mini?.id ?? 'gpt-5-mini',
        requestHints: mockRequestHints,
      });
      
      expect(defaultPrompt).toContain('RoboRail Assistant');
    });

    it('should not affect other models', () => {
      const otherModels = chatModels.filter(m => m.id !== 'gpt-5-mini');
      
      otherModels.forEach(model => {
        expect(model.description).not.toContain('RoboRail');
        
        const prompt = systemPrompt({
          selectedChatModel: model.id,
          requestHints: mockRequestHints,
        });
        
        if (model.id !== 'gpt-5-mini-thinking') {
          expect(prompt).not.toContain('RoboRail Assistant');
        }
      });
    });
  });
});