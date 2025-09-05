import { describe, it, expect } from 'vitest';
import { roboRailSystemPrompt, systemPrompt, artifactsPrompt, fileSearchPrompt } from '@/lib/ai/prompts';
import type { RequestHints } from '@/lib/ai/prompts';

describe('RoboRail System Prompts', () => {
  const mockRequestHints: RequestHints = {
    latitude: '52.3676',
    longitude: '4.9041',
    city: 'Amsterdam',
    country: 'Netherlands',
  };

  it('roboRailSystemPrompt contains all required sections', () => {
    expect(roboRailSystemPrompt).toContain('RoboRail Assistant');
    expect(roboRailSystemPrompt).toContain('HGG Profiling Equipment b.v.');
    expect(roboRailSystemPrompt).toContain('## Key Responsibilities');
    expect(roboRailSystemPrompt).toContain('Query Response');
    expect(roboRailSystemPrompt).toContain('Troubleshooting Guidance');
    expect(roboRailSystemPrompt).toContain('Instructional Support');
    expect(roboRailSystemPrompt).toContain('Safety Emphasis');
    expect(roboRailSystemPrompt).toContain('AI Capabilities');
    expect(roboRailSystemPrompt).toContain('Code and Command Formatting');
    expect(roboRailSystemPrompt).toContain('Clarification and Follow-ups');
    expect(roboRailSystemPrompt).toContain('Complex Issue Handling');
    expect(roboRailSystemPrompt).toContain('Initial Response Strategy');
    expect(roboRailSystemPrompt).toContain('## Output Format');
    expect(roboRailSystemPrompt).toContain('## Notes');
  });

  it('systemPrompt returns correct prompt for gpt-5-mini model', () => {
    const result = systemPrompt({
      selectedChatModel: 'gpt-5-mini',
      requestHints: mockRequestHints,
    });

    expect(result).toContain('RoboRail Assistant');
    expect(result).toContain('Amsterdam');
    expect(result).toContain('Netherlands');
    expect(result).toContain(artifactsPrompt);
    expect(result).not.toContain(fileSearchPrompt);
  });

  it('systemPrompt returns correct prompt for gpt-5-mini-thinking model', () => {
    const result = systemPrompt({
      selectedChatModel: 'gpt-5-mini-thinking',
      requestHints: mockRequestHints,
    });

    expect(result).toContain(fileSearchPrompt);
    expect(result).toContain(artifactsPrompt);
    expect(result).not.toContain('RoboRail Assistant');
  });

  it('systemPrompt returns correct prompt for chat-model-reasoning', () => {
    const result = systemPrompt({
      selectedChatModel: 'chat-model-reasoning',
      requestHints: mockRequestHints,
    });

    expect(result).toContain('friendly assistant');
    expect(result).not.toContain('RoboRail Assistant');
    expect(result).not.toContain(artifactsPrompt);
  });

  it('systemPrompt returns correct prompt for other models', () => {
    const result = systemPrompt({
      selectedChatModel: 'chat-model',
      requestHints: mockRequestHints,
    });

    expect(result).toContain('friendly assistant');
    expect(result).toContain(artifactsPrompt);
    expect(result).not.toContain('RoboRail Assistant');
  });

  it('RoboRail prompt formatting is correct', () => {
    expect(roboRailSystemPrompt).toMatch(/```language-name/);
    expect(roboRailSystemPrompt).toMatch(/code here/);
    expect(roboRailSystemPrompt).toMatch(/```/);
  });

  it('RoboRail prompt safety emphasis', () => {
    expect(roboRailSystemPrompt.toLowerCase()).toContain('safety');
    expect(roboRailSystemPrompt.toLowerCase()).toContain('hazard');
    expect(roboRailSystemPrompt).toContain('user safety');
    expect(roboRailSystemPrompt).toContain('proper machine operation');
  });

  it('RoboRail prompt conciseness requirements', () => {
    expect(roboRailSystemPrompt).toContain('concise');
    expect(roboRailSystemPrompt).toContain('brief');
    expect(roboRailSystemPrompt).toContain('brevity');
  });

  it('RoboRail prompt support escalation', () => {
    expect(roboRailSystemPrompt).toContain('HGG customer support');
    expect(roboRailSystemPrompt).toContain('contact information');
    expect(roboRailSystemPrompt).toContain('issues beyond your scope');
  });
});