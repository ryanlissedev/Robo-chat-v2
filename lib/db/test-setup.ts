import { config } from 'dotenv';

// Load test environment variables
config({
  path: '.env.test',
});

// Fallback test database URL if not set - only set if we're in a real test environment with database
if (!process.env.POSTGRES_URL && !process.env.CI && !process.env.PLAYWRIGHT) {
  process.env.POSTGRES_URL = 'postgresql://test:test@localhost:5432/test';
}

// In CI/CD environments, we prefer not to set a fallback URL to force mock usage
if (process.env.CI && !process.env.POSTGRES_URL) {
  console.log('CI environment detected without POSTGRES_URL - tests will use mock database');
}

// Export test configuration
export const TEST_DATABASE_URL = process.env.POSTGRES_URL;
export const IS_TEST_ENV = process.env.NODE_ENV === 'test' || process.env.PLAYWRIGHT === 'True';

// Mock database functions for tests that don't need real DB
export const createMockDatabase = () => {
  const mockQueries = {
    getUser: async (email: string) => {
      // Return guest users for guest emails, empty array for others
      if (email.startsWith('guest-')) {
        return [{ id: 'test-guest-id', email, password: null }];
      }
      return [];
    },
    createUser: async (email: string, password: string) => {
      return [{ id: 'test-user-id', email, password }];
    },
    createGuestUser: async () => {
      const email = `guest-${Date.now()}`;
      return [{ id: 'test-guest-user-id', email }];
    },
    saveChat: async () => undefined,
    deleteChatById: async () => ({ id: 'test-chat-id' }),
    getChatsByUserId: async () => ({ chats: [], hasMore: false }),
    getChatById: async ({ id }: { id: string }) => ({ 
      id, 
      title: 'Test Chat', 
      userId: 'test-user-id',
      visibility: 'private' as const,
      createdAt: new Date()
    }),
    saveMessages: async () => undefined,
    getMessagesByChatId: async () => [],
    voteMessage: async () => undefined,
    getVotesByChatId: async () => [],
    saveDocument: async () => [{ id: 'test-doc-id' }],
    getDocumentsById: async () => [],
    getDocumentById: async () => ({ id: 'test-doc-id', title: 'Test Doc' }),
    deleteDocumentsByIdAfterTimestamp: async () => [],
    saveSuggestions: async () => undefined,
    getSuggestionsByDocumentId: async () => [],
    getMessageById: async () => [],
    deleteMessagesByChatIdAfterTimestamp: async () => undefined,
    updateChatVisibilityById: async () => undefined,
    getMessageCountByUserId: async () => 0,
    createStreamId: async () => undefined,
    getStreamIdsByChatId: async () => [],
  };

  return mockQueries;
};