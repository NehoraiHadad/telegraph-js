# telegraph-api-client

[![npm version](https://img.shields.io/npm/v/telegraph-api-client.svg)](https://www.npmjs.com/package/telegraph-api-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A complete TypeScript client for the [Telegraph API](https://telegra.ph/api) with full type safety and zero runtime dependencies.

## Features

- **Full TypeScript Support** - Comprehensive type definitions for all API methods
- **Zero Dependencies** - Uses native `fetch` API (Node.js 18+)
- **Flexible Content Format** - Supports HTML strings, Markdown, and Node arrays
- **ESM & CommonJS** - Works with both module systems
- **Simple API** - Clean, promise-based interface
- **Complete Coverage** - All 9 Telegraph API methods implemented

## Installation

```bash
npm install telegraph-api-client
```

## Requirements

- Node.js >= 18.0.0 (for native fetch support)

## Quick Start

```typescript
import { Telegraph } from 'telegraph-api-client';

const telegraph = new Telegraph();

// Create an account
const account = await telegraph.createAccount({
  shortName: 'MyBot',
  authorName: 'Bot Author'
});

// Create a page
const page = await telegraph.createPage({
  accessToken: account.access_token!,
  title: 'Hello World',
  content: '<p>This is my first Telegraph page!</p>'
});

console.log(`Page created: ${page.url}`);
```

## API Documentation

### Creating an Account

```typescript
const account = await telegraph.createAccount({
  shortName: 'Sandbox',           // Required: 1-32 characters
  authorName: 'Anonymous',         // Optional: 0-128 characters
  authorUrl: 'https://example.com' // Optional: 0-512 characters
});

console.log(account.access_token); // Save this for future requests
```

### Editing Account Info

```typescript
const updatedAccount = await telegraph.editAccountInfo({
  accessToken: 'your-access-token',
  shortName: 'New Name',
  authorName: 'New Author',
  authorUrl: 'https://newurl.com'
});
```

### Getting Account Info

```typescript
const account = await telegraph.getAccountInfo({
  accessToken: 'your-access-token',
  fields: ['short_name', 'page_count', 'author_name']
});

console.log(`Total pages: ${account.page_count}`);
```

### Revoking Access Token

```typescript
const account = await telegraph.revokeAccessToken({
  accessToken: 'your-old-token'
});

console.log(`New token: ${account.access_token}`);
console.log(`Auth URL: ${account.auth_url}`);
```

### Creating a Page

You can create pages using HTML strings, Markdown, or Node arrays:

**Using HTML:**

```typescript
const page = await telegraph.createPage({
  accessToken: 'your-access-token',
  title: 'My Page',
  content: '<p>Hello <b>world</b>!</p>',
  authorName: 'John Doe',
  authorUrl: 'https://example.com',
  returnContent: true
});
```

**Using Node Array:**

```typescript
const page = await telegraph.createPage({
  accessToken: 'your-access-token',
  title: 'My Page',
  content: [
    { tag: 'p', children: ['Hello ', { tag: 'b', children: ['world'] }, '!'] }
  ]
});
```

**Using Markdown (with helper):**

```typescript
import { Telegraph, markdownToHtml } from 'telegraph-api-client';

const markdown = `
# My Title

This is **bold** and this is *italic*.

- List item 1
- List item 2
`;

const page = await telegraph.createPage({
  accessToken: 'your-access-token',
  title: 'My Page',
  content: markdownToHtml(markdown)
});
```

### Editing a Page

```typescript
const page = await telegraph.editPage({
  accessToken: 'your-access-token',
  path: 'Sample-Page-12-15',
  title: 'Updated Title',
  content: '<p>Updated content</p>',
  returnContent: true
});
```

### Getting a Page

```typescript
const page = await telegraph.getPage({
  path: 'Sample-Page-12-15',
  returnContent: true
});

console.log(page.title);
console.log(page.views);
console.log(page.content);
```

### Getting Page List

```typescript
const pageList = await telegraph.getPageList({
  accessToken: 'your-access-token',
  offset: 0,   // Default: 0
  limit: 50    // Default: 50, max: 200
});

console.log(`Total pages: ${pageList.total_count}`);
pageList.pages.forEach(page => {
  console.log(`- ${page.title}: ${page.url}`);
});
```

### Getting Page Views

```typescript
// Get total views
const views = await telegraph.getViews({
  path: 'Sample-Page-12-15'
});
console.log(`Total views: ${views.views}`);

// Get views for a specific date
const dailyViews = await telegraph.getViews({
  path: 'Sample-Page-12-15',
  year: 2023,
  month: 12,
  day: 15
});
console.log(`Views on Dec 15, 2023: ${dailyViews.views}`);

// Get views for a specific hour
const hourlyViews = await telegraph.getViews({
  path: 'Sample-Page-12-15',
  year: 2023,
  month: 12,
  day: 15,
  hour: 14
});
console.log(`Views at 2 PM: ${hourlyViews.views}`);
```

## Content Formats

Telegraph supports three content formats:

### 1. HTML String

The simplest format - just pass an HTML string:

```typescript
const content = '<p>Hello <b>world</b>!</p>';
```

Supported tags: `a`, `aside`, `b`, `blockquote`, `br`, `code`, `em`, `figcaption`, `figure`, `h3`, `h4`, `hr`, `i`, `iframe`, `img`, `li`, `ol`, `p`, `pre`, `s`, `strong`, `u`, `ul`, `video`

### 2. Node Array

For programmatic content creation:

```typescript
const content = [
  { tag: 'p', children: ['Hello ', { tag: 'b', children: ['world'] }, '!'] },
  { tag: 'h3', children: ['Heading'] },
  { tag: 'img', attrs: { src: 'https://example.com/image.jpg' } }
];
```

### 3. Markdown (with helper)

Use the `markdownToHtml` utility:

```typescript
import { markdownToHtml } from 'telegraph-api-client';

const markdown = `
# Heading
**Bold** and *italic* text
- List item
[Link](https://example.com)
`;

const html = markdownToHtml(markdown);
```

## Utility Functions

### htmlToNodes(html: string): Node[]

Converts an HTML string to Telegraph Node array:

```typescript
import { htmlToNodes } from 'telegraph-api-client';

const nodes = htmlToNodes('<p>Hello <b>world</b>!</p>');
// Returns: [{ tag: 'p', children: ['Hello ', { tag: 'b', children: ['world'] }, '!'] }]
```

### markdownToHtml(markdown: string): string

Converts Markdown to Telegraph-compatible HTML:

```typescript
import { markdownToHtml } from 'telegraph-api-client';

const html = markdownToHtml('# Title\n\nThis is **bold**');
// Returns: '<h3>Title</h3>\n<p>This is <b>bold</b></p>'
```

### parseContent(content: string | Node[], format?: 'html' | 'markdown'): Node[]

Automatically parses content in any format to Node array:

```typescript
import { parseContent } from 'telegraph-api-client';

const nodes1 = parseContent('<p>HTML</p>');
const nodes2 = parseContent('# Markdown', 'markdown');
const nodes3 = parseContent([{ tag: 'p', children: ['Array'] }]);
```

## Error Handling

All API methods throw `TelegraphError` on failure:

```typescript
import { Telegraph, TelegraphError } from 'telegraph-api-client';

const telegraph = new Telegraph();

try {
  const page = await telegraph.createPage({
    accessToken: 'invalid-token',
    title: 'Test',
    content: '<p>Test</p>'
  });
} catch (error) {
  if (error instanceof TelegraphError) {
    console.error('Telegraph API error:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## TypeScript Support

The library is written in TypeScript and provides comprehensive type definitions:

```typescript
import type {
  Account,
  Page,
  PageList,
  PageViews,
  Node,
  NodeElement,
  CreatePageParams,
  AccountField
} from 'telegraph-api-client';

// All methods are fully typed
const account: Account = await telegraph.createAccount({
  shortName: 'Test'
});

// TypeScript will catch errors at compile time
const page: Page = await telegraph.createPage({
  accessToken: account.access_token!,
  title: 'Test',
  content: '<p>Test</p>',
  // TypeScript error: Property 'invalidField' does not exist
  // invalidField: 'value'
});
```

## Complete Example

Here's a complete example showing account creation, page creation, and page management:

```typescript
import { Telegraph } from 'telegraph-api-client';

async function main() {
  const telegraph = new Telegraph();

  // Create account
  const account = await telegraph.createAccount({
    shortName: 'MyBlog',
    authorName: 'John Doe',
    authorUrl: 'https://johndoe.com'
  });

  console.log(`Account created! Token: ${account.access_token}`);

  // Create first page
  const page1 = await telegraph.createPage({
    accessToken: account.access_token!,
    title: 'Hello World',
    content: `
      <h3>Welcome to my blog!</h3>
      <p>This is my first post on Telegraph.</p>
      <p>Visit my website: <a href="https://johndoe.com">johndoe.com</a></p>
    `
  });

  console.log(`Page 1 created: ${page1.url}`);

  // Create second page
  const page2 = await telegraph.createPage({
    accessToken: account.access_token!,
    title: 'About Me',
    content: [
      { tag: 'h3', children: ['About Me'] },
      { tag: 'p', children: ['I am a developer and blogger.'] },
      { tag: 'ul', children: [
        { tag: 'li', children: ['JavaScript'] },
        { tag: 'li', children: ['TypeScript'] },
        { tag: 'li', children: ['Node.js'] }
      ]}
    ],
    returnContent: true
  });

  console.log(`Page 2 created: ${page2.url}`);

  // Get page list
  const pageList = await telegraph.getPageList({
    accessToken: account.access_token!,
    limit: 10
  });

  console.log(`\nTotal pages: ${pageList.total_count}`);
  pageList.pages.forEach(page => {
    console.log(`- ${page.title}: ${page.views} views`);
  });

  // Get views for first page
  const views = await telegraph.getViews({
    path: page1.path
  });

  console.log(`\nPage "${page1.title}" has ${views.views} views`);

  // Update account info
  await telegraph.editAccountInfo({
    accessToken: account.access_token!,
    authorName: 'John Doe (Updated)'
  });

  console.log('Account updated!');
}

main().catch(console.error);
```

## API Reference

### Telegraph Class

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `createAccount` | `CreateAccountParams` | `Promise<Account>` | Create a new Telegraph account |
| `editAccountInfo` | `EditAccountInfoParams` | `Promise<Account>` | Update account information |
| `getAccountInfo` | `GetAccountInfoParams` | `Promise<Account>` | Get account information |
| `revokeAccessToken` | `RevokeAccessTokenParams` | `Promise<Account>` | Revoke and regenerate access token |
| `createPage` | `CreatePageParams` | `Promise<Page>` | Create a new page |
| `editPage` | `EditPageParams` | `Promise<Page>` | Edit an existing page |
| `getPage` | `GetPageParams` | `Promise<Page>` | Get page content and info |
| `getPageList` | `GetPageListParams` | `Promise<PageList>` | Get list of pages |
| `getViews` | `GetViewsParams` | `Promise<PageViews>` | Get page view statistics |

### Types

All TypeScript types are exported and documented. See the [source code](src/types.ts) for complete type definitions.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Links

- [Telegraph API Documentation](https://telegra.ph/api)
- [GitHub Repository](https://github.com/yourusername/telegraph-js)
- [npm Package](https://www.npmjs.com/package/telegraph-api-client)

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/yourusername/telegraph-js/issues) on GitHub.
