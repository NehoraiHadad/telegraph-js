/**
 * Telegraph API Client
 * A TypeScript client for the Telegraph API
 */

import { TelegraphError } from './errors.js';
import { parseContent } from './utils.js';
import { readFile } from 'node:fs/promises';
import { basename, extname } from 'node:path';
import type {
  Account,
  Page,
  PageList,
  PageViews,
  ApiResponse,
  CreateAccountParams,
  EditAccountInfoParams,
  GetAccountInfoParams,
  RevokeAccessTokenParams,
  CreatePageParams,
  EditPageParams,
  GetPageParams,
  GetPageListParams,
  GetViewsParams,
  UploadImageParams,
  UploadResult,
} from './types.js';

const BASE_URL = 'https://api.telegra.ph';
const UPLOAD_URL = 'https://telegra.ph/upload';

/**
 * Telegraph API Client class
 *
 * Provides a complete interface to the Telegraph API with all 9 methods.
 * Supports both HTML strings and Node arrays for content.
 *
 * @example
 * ```typescript
 * const telegraph = new Telegraph();
 *
 * // Create an account
 * const account = await telegraph.createAccount({
 *   shortName: 'MyBot',
 *   authorName: 'Bot Author'
 * });
 *
 * // Create a page
 * const page = await telegraph.createPage({
 *   accessToken: account.accessToken!,
 *   title: 'Hello World',
 *   content: '<p>This is my page</p>'
 * });
 *
 * console.log(page.url);
 * ```
 */
export class Telegraph {
  /**
   * Make a request to the Telegraph API
   *
   * @param method - API method name
   * @param params - Request parameters
   * @returns API response result
   * @throws {TelegraphError} If the request fails or API returns an error
   */
  private async apiRequest<T>(method: string, params: Record<string, unknown> = {}): Promise<T> {
    const url = `${BASE_URL}/${method}`;

    // Filter out undefined values
    const filteredParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          filteredParams[key] = JSON.stringify(value);
        } else {
          filteredParams[key] = String(value);
        }
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(filteredParams).toString(),
    });

    if (!response.ok) {
      throw new TelegraphError(`HTTP error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as ApiResponse<T>;

    if (!data.ok) {
      throw new TelegraphError(data.error || 'Unknown Telegraph API error');
    }

    return data.result as T;
  }

  /**
   * Create a new Telegraph account
   *
   * @param params - Account creation parameters
   * @returns Account object with access_token
   *
   * @example
   * ```typescript
   * const account = await telegraph.createAccount({
   *   shortName: 'Sandbox',
   *   authorName: 'Anonymous',
   *   authorUrl: 'https://example.com'
   * });
   * console.log(account.accessToken);
   * ```
   */
  async createAccount(params: CreateAccountParams): Promise<Account> {
    return this.apiRequest<Account>('createAccount', {
      short_name: params.shortName,
      author_name: params.authorName,
      author_url: params.authorUrl,
    });
  }

  /**
   * Update information about a Telegraph account
   *
   * @param params - Account update parameters
   * @returns Updated Account object
   *
   * @example
   * ```typescript
   * const account = await telegraph.editAccountInfo({
   *   accessToken: 'your-access-token',
   *   shortName: 'New Name',
   *   authorName: 'New Author'
   * });
   * ```
   */
  async editAccountInfo(params: EditAccountInfoParams): Promise<Account> {
    return this.apiRequest<Account>('editAccountInfo', {
      access_token: params.accessToken,
      short_name: params.shortName,
      author_name: params.authorName,
      author_url: params.authorUrl,
    });
  }

  /**
   * Get information about a Telegraph account
   *
   * @param params - Account info request parameters
   * @returns Account object with requested fields
   *
   * @example
   * ```typescript
   * const account = await telegraph.getAccountInfo({
   *   accessToken: 'your-access-token',
   *   fields: ['short_name', 'page_count']
   * });
   * console.log(`Pages: ${account.page_count}`);
   * ```
   */
  async getAccountInfo(params: GetAccountInfoParams): Promise<Account> {
    return this.apiRequest<Account>('getAccountInfo', {
      access_token: params.accessToken,
      fields: params.fields,
    });
  }

  /**
   * Revoke access_token and generate a new one
   *
   * @param params - Token revocation parameters
   * @returns Account object with new access_token and auth_url
   *
   * @example
   * ```typescript
   * const account = await telegraph.revokeAccessToken({
   *   accessToken: 'your-old-token'
   * });
   * console.log(`New token: ${account.accessToken}`);
   * console.log(`Auth URL: ${account.auth_url}`);
   * ```
   */
  async revokeAccessToken(params: RevokeAccessTokenParams): Promise<Account> {
    return this.apiRequest<Account>('revokeAccessToken', {
      access_token: params.accessToken,
    });
  }

  /**
   * Create a new Telegraph page
   *
   * @param params - Page creation parameters
   * @returns Page object
   *
   * @example
   * ```typescript
   * // Using HTML string
   * const page = await telegraph.createPage({
   *   accessToken: 'your-access-token',
   *   title: 'My First Page',
   *   content: '<p>Hello <b>world</b>!</p>',
   *   authorName: 'John Doe',
   *   returnContent: true
   * });
   *
   * // Using Node array
   * const page2 = await telegraph.createPage({
   *   accessToken: 'your-access-token',
   *   title: 'My Second Page',
   *   content: [
   *     { tag: 'p', children: ['Hello ', { tag: 'b', children: ['world'] }, '!'] }
   *   ]
   * });
   *
   * console.log(page.url);
   * ```
   */
  async createPage(params: CreatePageParams): Promise<Page> {
    const content = typeof params.content === 'string'
      ? parseContent(params.content)
      : params.content;

    return this.apiRequest<Page>('createPage', {
      access_token: params.accessToken,
      title: params.title,
      content,
      author_name: params.authorName,
      author_url: params.authorUrl,
      return_content: params.returnContent,
    });
  }

  /**
   * Edit an existing Telegraph page
   *
   * @param params - Page edit parameters
   * @returns Updated Page object
   *
   * @example
   * ```typescript
   * const page = await telegraph.editPage({
   *   accessToken: 'your-access-token',
   *   path: 'Sample-Page-12-15',
   *   title: 'Updated Title',
   *   content: '<p>Updated content</p>',
   *   returnContent: true
   * });
   * ```
   */
  async editPage(params: EditPageParams): Promise<Page> {
    const content = typeof params.content === 'string'
      ? parseContent(params.content)
      : params.content;

    return this.apiRequest<Page>('editPage', {
      access_token: params.accessToken,
      path: params.path,
      title: params.title,
      content,
      author_name: params.authorName,
      author_url: params.authorUrl,
      return_content: params.returnContent,
    });
  }

  /**
   * Get a Telegraph page
   *
   * @param params - Page retrieval parameters
   * @returns Page object
   *
   * @example
   * ```typescript
   * const page = await telegraph.getPage({
   *   path: 'Sample-Page-12-15',
   *   returnContent: true
   * });
   * console.log(page.title);
   * console.log(page.content);
   * ```
   */
  async getPage(params: GetPageParams): Promise<Page> {
    return this.apiRequest<Page>('getPage', {
      path: params.path,
      return_content: params.returnContent,
    });
  }

  /**
   * Get a list of pages belonging to a Telegraph account
   *
   * @param params - Page list request parameters
   * @returns PageList object
   *
   * @example
   * ```typescript
   * const pageList = await telegraph.getPageList({
   *   accessToken: 'your-access-token',
   *   offset: 0,
   *   limit: 10
   * });
   * console.log(`Total pages: ${pageList.total_count}`);
   * pageList.pages.forEach(page => {
   *   console.log(`- ${page.title}: ${page.url}`);
   * });
   * ```
   */
  async getPageList(params: GetPageListParams): Promise<PageList> {
    return this.apiRequest<PageList>('getPageList', {
      access_token: params.accessToken,
      offset: params.offset,
      limit: params.limit,
    });
  }

  /**
   * Get the number of views for a Telegraph page
   *
   * @param params - Views request parameters
   * @returns PageViews object
   *
   * @example
   * ```typescript
   * // Get total views
   * const views = await telegraph.getViews({
   *   path: 'Sample-Page-12-15'
   * });
   * console.log(`Total views: ${views.views}`);
   *
   * // Get views for a specific date
   * const dailyViews = await telegraph.getViews({
   *   path: 'Sample-Page-12-15',
   *   year: 2023,
   *   month: 12,
   *   day: 15
   * });
   * console.log(`Views on Dec 15, 2023: ${dailyViews.views}`);
   * ```
   */
  async getViews(params: GetViewsParams): Promise<PageViews> {
    return this.apiRequest<PageViews>('getViews', {
      path: params.path,
      year: params.year,
      month: params.month,
      day: params.day,
      hour: params.hour,
    });
  }

  /**
   * Get content type from file extension
   *
   * @param filePath - Path to the file
   * @returns Content type string
   */
  private getContentType(filePath: string): string {
    const ext = extname(filePath).toLowerCase();
    const types: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.mp4': 'video/mp4',
    };
    return types[ext] || 'application/octet-stream';
  }

  /**
   * Upload image or video to Telegraph
   *
   * @param params - Upload parameters (either filePath or base64 + contentType + filename)
   * @returns Upload result with URL
   *
   * @example
   * ```typescript
   * // Upload from file path
   * const result = await telegraph.uploadImage({
   *   filePath: '/path/to/image.jpg'
   * });
   * console.log(`Uploaded: ${result.url}`);
   *
   * // Upload from base64
   * const result2 = await telegraph.uploadImage({
   *   base64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
   *   contentType: 'image/png',
   *   filename: 'test.png'
   * });
   * console.log(`Uploaded: ${result2.url}`);
   * ```
   */
  async uploadImage(params: UploadImageParams): Promise<UploadResult> {
    let fileData: Buffer;
    let filename: string;
    let contentType: string;

    if (params.filePath) {
      // Upload from file path
      fileData = await readFile(params.filePath);
      filename = basename(params.filePath);
      contentType = this.getContentType(params.filePath);
    } else if (params.base64 && params.contentType && params.filename) {
      // Upload from base64
      fileData = Buffer.from(params.base64, 'base64');
      filename = params.filename;
      contentType = params.contentType;
    } else {
      throw new TelegraphError(
        'Either filePath or (base64 + contentType + filename) must be provided'
      );
    }

    // Create FormData for upload
    const formData = new FormData();
    const arrayBuffer = fileData.buffer.slice(
      fileData.byteOffset,
      fileData.byteOffset + fileData.byteLength
    ) as ArrayBuffer;
    const blob = new Blob([arrayBuffer], { type: contentType });
    formData.append('file', blob, filename);

    // Upload to Telegraph
    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new TelegraphError(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json() as { src?: string; error?: string }[];

    if (result[0]?.error) {
      throw new TelegraphError(`Upload error: ${result[0].error}`);
    }

    if (!result[0]?.src) {
      throw new TelegraphError('Upload failed: No source returned');
    }

    return {
      url: `https://telegra.ph${result[0].src}`,
    };
  }
}
