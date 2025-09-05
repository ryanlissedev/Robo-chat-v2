import { type CoreToolResult, tool } from 'ai';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';

export interface FileSearchResult {
  content: string;
  metadata?: Record<string, any>;
  score?: number;
  source?: {
    title?: string;
    url?: string;
    description?: string;
    quote?: string;
  };
}

export const fileSearch = tool({
  description: 'Search through the vectorstore for relevant information',
  parameters: z.object({
    query: z.string().describe('The search query to find relevant information'),
    maxResults: z.number().optional().default(5).describe('Maximum number of results to return'),
  }),
  execute: async ({ query, maxResults }): Promise<CoreToolResult<FileSearchResult[]>> => {
    try {
      const vectorStoreId = process.env.OPENAI_VECTORSTORE_ID || 'vs_6849955367a88191bf89d7660230325f';
      const apiKey = process.env.OPENAI_API_KEY;
      
      // Check if API key is available
      if (!apiKey) {
        console.warn('OPENAI_API_KEY not configured - file search disabled');
        return {
          success: false,
          result: [],
          error: 'File search is not configured. Please add OPENAI_API_KEY to enable this feature.',
        };
      }
      
      // Configure the file search tool
      const fileSearchTool = openai.tools.fileSearch({
        vectorStoreIds: [vectorStoreId],
        maxNumResults: maxResults,
        ranking: { ranker: 'auto' },
      });

      // Execute the search
      const searchResults = await fileSearchTool.execute({
        args: { query },
      });

      // Format results for inline citations
      const formattedResults: FileSearchResult[] = searchResults.results?.map((result: any) => ({
        content: result.content || '',
        metadata: result.metadata || {},
        score: result.score,
        source: {
          title: result.title || result.fileName || 'Document',
          url: result.url || result.fileId,
          description: result.description || result.snippet,
          quote: result.quote || result.content?.slice(0, 200),
        },
      })) || [];

      return {
        success: true,
        result: formattedResults,
      };
    } catch (error: any) {
      console.error('File search error:', error);
      return {
        success: false,
        result: [],
        error: `Search failed: ${error.message}`,
      };
    }
  },
});

export const performFileSearch = async (
  query: string,
  maxResults = 5
): Promise<FileSearchResult[]> => {
  const result = await fileSearch.execute({ query, maxResults });
  if ('error' in result) {
    console.error('File search error:', result.error);
    return [];
  }
  return result.result as FileSearchResult[];
};