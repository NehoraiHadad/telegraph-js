/**
 * Telegraph API Type Definitions
 * Based on https://telegra.ph/api
 */

/**
 * Telegraph Account object
 */
export interface Account {
  /** Account name, helps users with several accounts remember which they are currently using */
  short_name: string;
  /** Default author name used when creating new articles */
  author_name?: string;
  /** Profile link, opened when users click on the author's name below the title */
  author_url?: string;
  /** Access token of the Telegraph account (only returned by createAccount and revokeAccessToken) */
  access_token?: string;
  /** URL to authorize a browser on telegra.ph (only returned by revokeAccessToken) */
  auth_url?: string;
  /** Number of pages belonging to the Telegraph account (only returned when requested) */
  page_count?: number;
}

/**
 * Telegraph Page object
 */
export interface Page {
  /** Path to the page */
  path: string;
  /** URL of the page */
  url: string;
  /** Title of the page */
  title: string;
  /** Description of the page */
  description: string;
  /** Name of the author, displayed below the title */
  author_name?: string;
  /** Profile link, opened when users click on the author's name below the title */
  author_url?: string;
  /** Image URL of the page */
  image_url?: string;
  /** Content of the page (array of Node objects, only returned if return_content is true) */
  content?: Node[];
  /** Number of page views for the page */
  views: number;
  /** True if the target Telegraph account can edit the page */
  can_edit?: boolean;
}

/**
 * Telegraph PageList object
 */
export interface PageList {
  /** Total number of pages belonging to the target Telegraph account */
  total_count: number;
  /** Requested pages of the target Telegraph account */
  pages: Page[];
}

/**
 * Telegraph PageViews object
 */
export interface PageViews {
  /** Number of page views for the target page */
  views: number;
}

/**
 * Telegraph Node - represents a DOM element or text
 * Can be either a string (text content) or a NodeElement
 */
export type Node = string | NodeElement;

/**
 * Telegraph NodeElement - represents a DOM element
 */
export interface NodeElement {
  /** Name of the DOM element tag */
  tag: string;
  /** Attributes of the DOM element (href for <a>, src for <img>, <video>, <iframe>) */
  attrs?: {
    href?: string;
    src?: string;
    [key: string]: string | undefined;
  };
  /** List of child nodes for the DOM element */
  children?: Node[];
}

/**
 * Available HTML tags supported by Telegraph
 */
export const ALLOWED_TAGS = [
  'a', 'aside', 'b', 'blockquote', 'br', 'code', 'em', 'figcaption',
  'figure', 'h3', 'h4', 'hr', 'i', 'iframe', 'img', 'li', 'ol', 'p',
  'pre', 's', 'strong', 'u', 'ul', 'video'
] as const;

export type AllowedTag = typeof ALLOWED_TAGS[number];

/**
 * Telegraph API Response wrapper
 */
export interface ApiResponse<T> {
  /** True if the request was successful */
  ok: boolean;
  /** Result of the request (only present if ok is true) */
  result?: T;
  /** Error message (only present if ok is false) */
  error?: string;
}

/**
 * Account fields that can be requested
 */
export type AccountField = 'short_name' | 'author_name' | 'author_url' | 'auth_url' | 'page_count';

/**
 * Parameters for createAccount method
 */
export interface CreateAccountParams {
  /** Account name (1-32 characters) */
  shortName: string;
  /** Default author name (0-128 characters) */
  authorName?: string;
  /** Default profile link (0-512 characters) */
  authorUrl?: string;
}

/**
 * Parameters for editAccountInfo method
 */
export interface EditAccountInfoParams {
  /** Access token of the Telegraph account */
  accessToken: string;
  /** New account name (1-32 characters) */
  shortName?: string;
  /** New default author name (0-128 characters) */
  authorName?: string;
  /** New default profile link (0-512 characters) */
  authorUrl?: string;
}

/**
 * Parameters for getAccountInfo method
 */
export interface GetAccountInfoParams {
  /** Access token of the Telegraph account */
  accessToken: string;
  /** List of account fields to return */
  fields?: AccountField[];
}

/**
 * Parameters for revokeAccessToken method
 */
export interface RevokeAccessTokenParams {
  /** Access token of the Telegraph account */
  accessToken: string;
}

/**
 * Parameters for createPage method
 */
export interface CreatePageParams {
  /** Access token of the Telegraph account */
  accessToken: string;
  /** Page title (1-256 characters) */
  title: string;
  /** Content of the page (HTML string or Node array) */
  content: string | Node[];
  /** Author name (0-128 characters) */
  authorName?: string;
  /** Profile link (0-512 characters) */
  authorUrl?: string;
  /** If true, content field will be returned */
  returnContent?: boolean;
}

/**
 * Parameters for editPage method
 */
export interface EditPageParams {
  /** Access token of the Telegraph account */
  accessToken: string;
  /** Path to the page */
  path: string;
  /** Page title (1-256 characters) */
  title: string;
  /** Content of the page (HTML string or Node array) */
  content: string | Node[];
  /** Author name (0-128 characters) */
  authorName?: string;
  /** Profile link (0-512 characters) */
  authorUrl?: string;
  /** If true, content field will be returned */
  returnContent?: boolean;
}

/**
 * Parameters for getPage method
 */
export interface GetPageParams {
  /** Path to the Telegraph page */
  path: string;
  /** If true, content field will be returned */
  returnContent?: boolean;
}

/**
 * Parameters for getPageList method
 */
export interface GetPageListParams {
  /** Access token of the Telegraph account */
  accessToken: string;
  /** Sequential number of the first page (default: 0) */
  offset?: number;
  /** Number of pages to be returned (0-200, default: 50) */
  limit?: number;
}

/**
 * Parameters for getViews method
 */
export interface GetViewsParams {
  /** Path to the Telegraph page */
  path: string;
  /** Required if month is passed (2000-2100) */
  year?: number;
  /** Required if day is passed (1-12) */
  month?: number;
  /** Required if hour is passed (1-31) */
  day?: number;
  /** Pass to get views for a specific hour (0-24) */
  hour?: number;
}

/**
 * Parameters for uploadImage method
 */
export interface UploadImageParams {
  /** Path to the image file (local file system) */
  filePath?: string;
  /** Base64-encoded image data */
  base64?: string;
  /** Content type of the image */
  contentType?: 'image/jpeg' | 'image/png' | 'image/gif' | 'video/mp4';
  /** Filename for the uploaded file */
  filename?: string;
}

/**
 * Result of image upload
 */
export interface UploadResult {
  /** URL of the uploaded image on Telegraph */
  url: string;
}
