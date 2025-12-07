/**
 * telegraph-api-client
 * A TypeScript client for the Telegraph API
 *
 * @packageDocumentation
 */

export { Telegraph } from './client.js';
export { TelegraphError } from './errors.js';
export { htmlToNodes, markdownToHtml, parseContent } from './utils.js';
export type {
  Account,
  Page,
  PageList,
  PageViews,
  Node,
  NodeElement,
  ApiResponse,
  AccountField,
  AllowedTag,
  CreateAccountParams,
  EditAccountInfoParams,
  GetAccountInfoParams,
  RevokeAccessTokenParams,
  CreatePageParams,
  EditPageParams,
  GetPageParams,
  GetPageListParams,
  GetViewsParams,
} from './types.js';
export { ALLOWED_TAGS } from './types.js';
