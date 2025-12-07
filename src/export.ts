/**
 * Telegraph Export Functions
 * Export pages and backup accounts to Markdown or HTML
 */

import { Telegraph } from './client.js';
import { nodesToMarkdown, nodesToHtml } from './utils.js';
import type { Page } from './types.js';

/**
 * Exported page data
 */
export interface ExportedPage {
  /** Page title */
  title: string;
  /** Page path */
  path: string;
  /** Full URL to the page */
  url: string;
  /** Export format */
  format: 'markdown' | 'html';
  /** Exported content */
  content: string;
}

/**
 * Account backup data
 */
export interface AccountBackup {
  /** Total number of pages in account */
  total_count: number;
  /** Number of pages exported */
  exported_count: number;
  /** Export format */
  format: 'markdown' | 'html';
  /** Exported pages */
  pages: Omit<ExportedPage, 'format'>[];
}

/**
 * Export a Telegraph page to Markdown or HTML
 *
 * @param params - Export parameters
 * @returns Exported page data
 *
 * @example
 * ```typescript
 * // Export to Markdown
 * const exported = await exportPage({
 *   path: 'Sample-Page-12-15',
 *   format: 'markdown'
 * });
 * console.log(exported.title);
 * console.log(exported.content);
 *
 * // Export to HTML
 * const exportedHtml = await exportPage({
 *   path: 'Sample-Page-12-15',
 *   format: 'html'
 * });
 * console.log(exportedHtml.content);
 * ```
 */
export async function exportPage(params: {
  path: string;
  format?: 'markdown' | 'html';
}): Promise<ExportedPage> {
  const format = params.format || 'markdown';
  const telegraph = new Telegraph();

  // Fetch the page with content
  const page = await telegraph.getPage({
    path: params.path,
    returnContent: true,
  });

  if (!page.content) {
    throw new Error('Page content not returned');
  }

  // Convert content to requested format
  let content: string;
  if (format === 'markdown') {
    content = nodesToMarkdown(page.content);
  } else {
    content = nodesToHtml(page.content);
  }

  return {
    title: page.title,
    path: page.path,
    url: page.url,
    format,
    content,
  };
}

/**
 * Backup all pages from a Telegraph account
 *
 * @param params - Backup parameters
 * @returns Account backup data
 *
 * @example
 * ```typescript
 * // Backup to Markdown
 * const backup = await backupAccount({
 *   accessToken: 'your-access-token',
 *   format: 'markdown',
 *   limit: 100
 * });
 *
 * console.log(`Backed up ${backup.exported_count} of ${backup.total_count} pages`);
 *
 * // Save each page to a file
 * for (const page of backup.pages) {
 *   const filename = `${page.path}.md`;
 *   await fs.writeFile(filename, page.content);
 * }
 * ```
 */
export async function backupAccount(params: {
  accessToken: string;
  format?: 'markdown' | 'html';
  limit?: number;
}): Promise<AccountBackup> {
  const format = params.format || 'markdown';
  const limit = params.limit || 200;
  const telegraph = new Telegraph();

  // Get the page list
  const pageList = await telegraph.getPageList({
    accessToken: params.accessToken,
    offset: 0,
    limit: Math.min(limit, 200), // Telegraph API max is 200
  });

  const exportedPages: Omit<ExportedPage, 'format'>[] = [];

  // Export each page
  for (const pageInfo of pageList.pages) {
    try {
      // Fetch the full page with content
      const page = await telegraph.getPage({
        path: pageInfo.path,
        returnContent: true,
      });

      if (!page.content) {
        continue;
      }

      // Convert content to requested format
      let content: string;
      if (format === 'markdown') {
        content = nodesToMarkdown(page.content);
      } else {
        content = nodesToHtml(page.content);
      }

      exportedPages.push({
        title: page.title,
        path: page.path,
        url: page.url,
        content,
      });
    } catch (error) {
      // Continue with other pages if one fails
      console.error(`Failed to export page ${pageInfo.path}:`, error);
    }
  }

  return {
    total_count: pageList.total_count,
    exported_count: exportedPages.length,
    format,
    pages: exportedPages,
  };
}
