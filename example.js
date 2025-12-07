/**
 * Example usage of the telegraph-api-client library
 *
 * Run with: node example.js
 */

import { Telegraph } from './dist/index.js';

async function main() {
  const telegraph = new Telegraph();

  console.log('Creating Telegraph account...');
  const account = await telegraph.createAccount({
    shortName: 'Example Bot',
    authorName: 'John Doe',
    authorUrl: 'https://example.com'
  });

  console.log('\nAccount created successfully!');
  console.log(`- Short Name: ${account.short_name}`);
  console.log(`- Author Name: ${account.author_name}`);
  console.log(`- Access Token: ${account.access_token}`);

  console.log('\nCreating first page...');
  const page1 = await telegraph.createPage({
    accessToken: account.access_token,
    title: 'Hello World',
    content: `
      <h3>Welcome to Telegraph!</h3>
      <p>This is an example page created with the <b>telegraph-api-client</b> library.</p>
      <p>Features:</p>
      <ul>
        <li>Full TypeScript support</li>
        <li>Zero runtime dependencies</li>
        <li>Simple API</li>
      </ul>
      <p>Visit <a href="https://github.com">GitHub</a> for more info.</p>
    `,
    returnContent: true
  });

  console.log('\nPage created successfully!');
  console.log(`- Title: ${page1.title}`);
  console.log(`- URL: ${page1.url}`);
  console.log(`- Path: ${page1.path}`);
  console.log(`- Views: ${page1.views}`);

  console.log('\nCreating second page with Node array...');
  const page2 = await telegraph.createPage({
    accessToken: account.access_token,
    title: 'About Me',
    content: [
      { tag: 'h3', children: ['About Me'] },
      { tag: 'p', children: ['I am a developer interested in:'] },
      {
        tag: 'ul',
        children: [
          { tag: 'li', children: ['JavaScript'] },
          { tag: 'li', children: ['TypeScript'] },
          { tag: 'li', children: ['Node.js'] }
        ]
      }
    ]
  });

  console.log('\nSecond page created!');
  console.log(`- Title: ${page2.title}`);
  console.log(`- URL: ${page2.url}`);

  console.log('\nGetting page list...');
  const pageList = await telegraph.getPageList({
    accessToken: account.access_token,
    limit: 10
  });

  console.log(`\nTotal pages: ${pageList.total_count}`);
  pageList.pages.forEach((page, index) => {
    console.log(`${index + 1}. ${page.title} - ${page.views} views - ${page.url}`);
  });

  console.log('\nGetting page views...');
  const views = await telegraph.getViews({
    path: page1.path
  });
  console.log(`Total views for "${page1.title}": ${views.views}`);

  console.log('\nGetting account info...');
  const accountInfo = await telegraph.getAccountInfo({
    accessToken: account.access_token,
    fields: ['short_name', 'author_name', 'page_count']
  });

  console.log(`- Short Name: ${accountInfo.short_name}`);
  console.log(`- Author Name: ${accountInfo.author_name}`);
  console.log(`- Page Count: ${accountInfo.page_count}`);

  console.log('\n✓ All operations completed successfully!');
  console.log('\nYour pages:');
  console.log(`1. ${page1.url}`);
  console.log(`2. ${page2.url}`);
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
