# File Search & OpenAI Vectorstore Integration

This document describes the file search functionality integrated into the chatbot using OpenAI's vectorstore capabilities.

## Features

### 1. **OpenAI Vectorstore Integration**
- Integrated file search using OpenAI's vectorstore API
- Default vectorstore ID: `vs_6849955367a88191bf89d7660230325f`
- Automatic query of vectorstore for every user message when using GPT-5 model

### 2. **GPT-5 Mini Thinking Model (September 2025)**
- Latest thinking model with configurable reasoning effort
- Low verbosity and medium reasoning effort by default
- Shows reasoning process transparently to users
- Automatic fallback to xAI models if OpenAI API key is not configured

### 3. **Inline Citation Component**
- Beautiful citation UI with hover interactions
- Carousel navigation for multiple sources
- Displays source titles, URLs, descriptions, and quotes
- Fully accessible with keyboard navigation

### 4. **Browser Echo Integration**
- Development logging tool for debugging
- Shows browser console logs in terminal during development
- Automatically configured for development environment only

## Configuration

### Environment Variables

Add the following to your `.env` file:

```env
# OpenAI API Key (required for file search and GPT-5 models)
OPENAI_API_KEY=your-api-key-here

# OpenAI Vectorstore ID (default vectorstore for file search)
OPENAI_VECTORSTORE_ID=vs_6849955367a88191bf89d7660230325f
```

## How It Works

### Query Flow

1. **User sends a message** → Selected model is checked
2. **If GPT-5 model is selected** → Vectorstore is queried first
3. **Search results are retrieved** → Citations are prepared
4. **Context is enhanced** → Search results are added to system prompt
5. **Response is generated** → Model uses context to provide accurate answers
6. **Citations are displayed** → Inline citations show sources

### File Search Tool

The file search tool (`lib/ai/tools/file-search.ts`) provides:
- Automatic vectorstore querying
- Result formatting for citations
- Error handling and fallback behavior
- Configurable result limits

### Models Available

1. **GPT-5 Mini (September 2025)** - Default model with file search
   - Provider: OpenAI
   - Features: File search, reasoning, low verbosity
   
2. **Grok Vision** - Multimodal model
   - Provider: xAI
   - Features: Vision and text capabilities
   
3. **Grok Reasoning** - Chain-of-thought reasoning
   - Provider: xAI
   - Features: Advanced reasoning for complex problems

## Usage

### Basic Usage

1. Select "GPT-5 Mini (September 2025)" from the model selector
2. Ask any question - the system will automatically search the vectorstore
3. View inline citations by hovering over citation numbers
4. See reasoning process in expandable sections

### API Integration

```typescript
import { performFileSearch } from '@/lib/ai/tools/file-search';

// Search the vectorstore
const results = await performFileSearch('your query here', 5);

// Results include content and source metadata
results.forEach(result => {
  console.log(result.source?.title);
  console.log(result.content);
});
```

### Citation Component Usage

```tsx
import { MessageCitations } from '@/components/inline-citation';

<MessageCitations
  sources={[
    {
      title: 'Document Title',
      url: 'https://example.com',
      description: 'Brief description',
      quote: 'Relevant quote from document'
    }
  ]}
  text="Your message text here"
/>
```

## Fallback Behavior

If OpenAI API key is not configured:
- GPT-5 model falls back to Grok Reasoning (xAI)
- File search is disabled with appropriate warnings
- System continues to function with reduced capabilities

## Development

### Browser Echo

Browser Echo is configured for development debugging:
- Logs appear in terminal during `pnpm dev`
- Client-side errors are captured
- Console logs are forwarded to server

### Testing

To test file search functionality:

1. Add your OpenAI API key to `.env`
2. Run the development server: `pnpm dev`
3. Select GPT-5 model in the chat interface
4. Ask questions that should trigger vectorstore search

## Architecture

```
User Message
    ↓
Chat Route (api/chat/route.ts)
    ↓
File Search Tool (if GPT-5 selected)
    ↓
OpenAI Vectorstore API
    ↓
Enhanced Context + Citations
    ↓
Model Generation (with reasoning)
    ↓
Response with Inline Citations
```

## Troubleshooting

### Common Issues

1. **"File search is not configured"**
   - Add `OPENAI_API_KEY` to your `.env` file
   
2. **No search results appearing**
   - Verify vectorstore ID is correct
   - Check OpenAI API key has proper permissions
   
3. **Citations not showing**
   - Ensure GPT-5 model is selected
   - Check browser console for errors

## Future Enhancements

- Support for multiple vectorstores
- Custom vectorstore creation and management
- File upload and indexing capabilities
- Advanced filtering and ranking options
- Real-time vectorstore updates