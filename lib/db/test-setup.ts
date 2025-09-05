import { config } from 'dotenv';

// Load test environment variables
config({
  path: '.env.test',
});

// Fallback test database URL if not set
if (!process.env.POSTGRES_URL) {
  process.env.POSTGRES_URL = 'postgresql://test:test@localhost:5432/test';
}

// Export test configuration
export const TEST_DATABASE_URL = process.env.POSTGRES_URL;
export const IS_TEST_ENV = process.env.NODE_ENV === 'test' || process.env.PLAYWRIGHT === 'True';

// Mock database functions for tests that don't need real DB
export const createMockDatabase = () => {
  const mockQueries = {
    getUser: async () => [],
    createGuestUser: async () => [{ id: 'test-user-id', email: 'test@example.com' }],
    saveChat: async () => undefined,
    deleteChatById: async () => ({ id: 'test-chat-id' }),
    getChatsByUserId: async () => ({ chats: [], hasMore: false }),
    getChatById: async () => ({ id: 'test-chat-id', title: 'Test Chat', userId: 'test-user-id' }),
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