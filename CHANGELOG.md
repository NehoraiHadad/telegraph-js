# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-07

### Added
- Initial release of telegraph-api-client
- Complete TypeScript implementation of Telegraph API
- All 9 Telegraph API methods implemented:
  - `createAccount()` - Create a new Telegraph account
  - `editAccountInfo()` - Update account information
  - `getAccountInfo()` - Get account information
  - `revokeAccessToken()` - Revoke and regenerate access token
  - `createPage()` - Create a new page
  - `editPage()` - Edit an existing page
  - `getPage()` - Get page content and info
  - `getPageList()` - Get list of pages
  - `getViews()` - Get page view statistics
- Utility functions:
  - `htmlToNodes()` - Convert HTML to Telegraph Node array
  - `markdownToHtml()` - Convert Markdown to HTML
  - `parseContent()` - Universal content parser
- Full TypeScript type definitions
- ESM and CommonJS support
- Zero runtime dependencies
- Comprehensive documentation
- Example code
- MIT License
