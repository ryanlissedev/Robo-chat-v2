import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '/',
}));

// Mock environment variables for tests
if (!process.env.NODE_ENV) {
  Object.defineProperty(process.env, 'NODE_ENV', { value: 'test', writable: true });
}
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'test-api-key';
process.env.XAI_API_KEY = process.env.XAI_API_KEY || 'test-xai-key';

// Set AUTH_SECRET fallback for tests
if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = 'test-secret-key-for-tests-12345678901234567890';
}

// Mark as test environment
process.env.PLAYWRIGHT = 'True';

// Mock database for unit/integration tests
vi.mock('@/lib/db/queries', () => ({
  getUser: vi.fn().mockResolvedValue([]),
  createGuestUser: vi.fn().mockResolvedValue([{ id: 'test-user-id', email: 'test@example.com' }]),
  saveChat: vi.fn().mockResolvedValue(undefined),
  deleteChatById: vi.fn().mockResolvedValue({ id: 'test-chat-id' }),
  getChatsByUserId: vi.fn().mockResolvedValue({ chats: [], hasMore: false }),
  getChatById: vi.fn().mockResolvedValue({ id: 'test-chat-id', title: 'Test Chat', userId: 'test-user-id' }),
  saveMessages: vi.fn().mockResolvedValue(undefined),
  getMessagesByChatId: vi.fn().mockResolvedValue([]),
  voteMessage: vi.fn().mockResolvedValue(undefined),
  getVotesByChatId: vi.fn().mockResolvedValue([]),
  saveDocument: vi.fn().mockResolvedValue([{ id: 'test-doc-id' }]),
  getDocumentsById: vi.fn().mockResolvedValue([]),
  getDocumentById: vi.fn().mockResolvedValue({ id: 'test-doc-id', title: 'Test Doc' }),
  deleteDocumentsByIdAfterTimestamp: vi.fn().mockResolvedValue([]),
  saveSuggestions: vi.fn().mockResolvedValue(undefined),
  getSuggestionsByDocumentId: vi.fn().mockResolvedValue([]),
  getMessageById: vi.fn().mockResolvedValue([]),
  deleteMessagesByChatIdAfterTimestamp: vi.fn().mockResolvedValue(undefined),
  updateChatVisibilityById: vi.fn().mockResolvedValue(undefined),
  getMessageCountByUserId: vi.fn().mockResolvedValue(0),
  createStreamId: vi.fn().mockResolvedValue(undefined),
  getStreamIdsByChatId: vi.fn().mockResolvedValue([]),
}));

// Set up global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});