import type { Node, NodeElement } from './types.js';

/**
 * Simple HTML to Node converter
 * Converts basic HTML string to Telegraph Node array
 * Supports: p, b, i, strong, em, a, br, h3, h4, blockquote, code, pre, ul, ol, li, figure, figcaption, img, video, iframe
 *
 * @param html - HTML string to convert
 * @returns Array of Telegraph Node objects
 */
export function htmlToNodes(html: string): Node[] {
  const nodes: Node[] = [];

  // Simple regex-based parser for basic HTML
  // This handles common cases but is not a full HTML parser
  const tagRegex = /<(\/?)([\w-]+)([^>]*)>|([^<]+)/g;
  const stack: { tag: string; attrs?: Record<string, string>; children: Node[] }[] = [];
  let current: Node[] = nodes;

  let match;
  while ((match = tagRegex.exec(html)) !== null) {
    const [, closing, tagName, attrString, text] = match;

    if (text) {
      // Text node
      const trimmedText = text;
      if (trimmedText) {
        current.push(trimmedText);
      }
    } else if (tagName) {
      const tag = tagName.toLowerCase();

      if (closing) {
        // Closing tag
        if (stack.length > 0) {
          const completed = stack.pop()!;
          current = stack.length > 0 ? stack[stack.length - 1].children : nodes;

          const element: NodeElement = { tag: completed.tag };
          if (completed.attrs && Object.keys(completed.attrs).length > 0) {
            element.attrs = completed.attrs;
          }
          if (completed.children.length > 0) {
            element.children = completed.children;
          }
          current.push(element);
        }
      } else {
        // Opening tag
        const attrs: Record<string, string> = {};

        // Parse attributes
        const attrRegex = /([\w-]+)=["']([^"']*)["']/g;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(attrString)) !== null) {
          attrs[attrMatch[1]] = attrMatch[2];
        }

        // Self-closing tags
        if (['br', 'hr', 'img'].includes(tag) || attrString.includes('/')) {
          const element: NodeElement = { tag };
          if (Object.keys(attrs).length > 0) {
            element.attrs = attrs;
          }
          current.push(element);
        } else {
          // Regular tag - push to stack
          const newElement = { tag, attrs, children: [] as Node[] };
          stack.push(newElement);
          current = newElement.children;
        }
      }
    }
  }

  // Handle any unclosed tags
  while (stack.length > 0) {
    const completed = stack.pop()!;
    const parent = stack.length > 0 ? stack[stack.length - 1].children : nodes;

    const element: NodeElement = { tag: completed.tag };
    if (completed.attrs && Object.keys(completed.attrs).length > 0) {
      element.attrs = completed.attrs;
    }
    if (completed.children.length > 0) {
      element.children = completed.children;
    }
    parent.push(element);
  }

  return nodes;
}

/**
 * Convert Markdown to HTML
 * Supports basic Markdown syntax and converts it to Telegraph-compatible HTML
 *
 * @param markdown - Markdown string to convert
 * @returns HTML string
 */
export function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Escape special HTML characters in code blocks first to preserve them
  const codeBlocks: string[] = [];
  html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
    codeBlocks.push(code.trim());
    return `__CODEBLOCK_${codeBlocks.length - 1}__`;
  });

  const inlineCodes: string[] = [];
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    inlineCodes.push(code);
    return `__INLINECODE_${inlineCodes.length - 1}__`;
  });

  // Convert headers (Telegraph only supports h3 and h4)
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^##\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^#\s+(.+)$/gm, '<h3>$1</h3>');

  // Convert horizontal rules
  html = html.replace(/^---+$/gm, '<hr/>');

  // Convert images with caption ![alt](src)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<figure><img src="$2"/><figcaption>$1</figcaption></figure>');

  // Convert links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Convert bold **text** or __text__
  html = html.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  html = html.replace(/__([^_]+)__/g, '<b>$1</b>');

  // Convert italic *text* or _text_ (but not in middle of words)
  html = html.replace(/(?<!\w)\*([^*]+)\*(?!\w)/g, '<i>$1</i>');
  html = html.replace(/(?<!\w)_([^_]+)_(?!\w)/g, '<i>$1</i>');

  // Convert blockquotes
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');

  // Convert unordered lists
  const ulLines: string[] = [];
  let inUl = false;
  const lines = html.split('\n');
  const processedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const ulMatch = line.match(/^[-*]\s+(.+)$/);

    if (ulMatch) {
      ulLines.push(`<li>${ulMatch[1]}</li>`);
      inUl = true;
    } else {
      if (inUl) {
        processedLines.push(`<ul>${ulLines.join('')}</ul>`);
        ulLines.length = 0;
        inUl = false;
      }
      processedLines.push(line);
    }
  }
  if (inUl) {
    processedLines.push(`<ul>${ulLines.join('')}</ul>`);
  }
  html = processedLines.join('\n');

  // Convert ordered lists
  const olLines: string[] = [];
  let inOl = false;
  const lines2 = html.split('\n');
  const processedLines2: string[] = [];

  for (let i = 0; i < lines2.length; i++) {
    const line = lines2[i];
    const olMatch = line.match(/^\d+\.\s+(.+)$/);

    if (olMatch) {
      olLines.push(`<li>${olMatch[1]}</li>`);
      inOl = true;
    } else {
      if (inOl) {
        processedLines2.push(`<ol>${olLines.join('')}</ol>`);
        olLines.length = 0;
        inOl = false;
      }
      processedLines2.push(line);
    }
  }
  if (inOl) {
    processedLines2.push(`<ol>${olLines.join('')}</ol>`);
  }
  html = processedLines2.join('\n');

  // Restore code blocks
  html = html.replace(/__CODEBLOCK_(\d+)__/g, (match, index) => {
    return `<pre>${codeBlocks[parseInt(index)]}</pre>`;
  });

  // Restore inline code
  html = html.replace(/__INLINECODE_(\d+)__/g, (match, index) => {
    return `<code>${inlineCodes[parseInt(index)]}</code>`;
  });

  // Convert paragraphs (lines separated by blank lines)
  const paragraphs = html.split(/\n\n+/);
  html = paragraphs
    .map(para => {
      const trimmed = para.trim();
      // Don't wrap if already an HTML tag
      if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
        return trimmed;
      }
      // Don't wrap empty lines
      if (!trimmed) {
        return '';
      }
      return `<p>${trimmed}</p>`;
    })
    .filter(p => p)
    .join('\n');

  return html;
}

/**
 * Parse content input - accepts either HTML string, Markdown string, or Node array
 *
 * @param content - Content as HTML string, Markdown string, or Node array
 * @param format - Content format ('html' or 'markdown'), only used if content is a string
 * @returns Array of Telegraph Node objects
 */
export function parseContent(content: string | Node[], format: 'html' | 'markdown' = 'html'): Node[] {
  if (Array.isArray(content)) {
    return content;
  }

  // Try to parse as JSON first (in case it's a stringified Node array)
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // Not JSON, continue with string parsing
  }

  // Convert markdown to HTML if format is markdown
  let htmlContent = content;
  if (format === 'markdown') {
    htmlContent = markdownToHtml(content);
  }

  // Convert HTML to nodes
  return htmlToNodes(htmlContent);
}

/**
 * Convert Telegraph Node array to JSON-serializable format
 *
 * @param nodes - Array of Telegraph Node objects
 * @returns JSON-serializable array of strings and objects
 */
export function nodesToJson(nodes: Node[]): (string | object)[] {
  return nodes.map(node => {
    if (typeof node === 'string') return node;
    const result: Record<string, any> = { tag: node.tag };
    if (node.attrs && Object.keys(node.attrs).length > 0) result.attrs = node.attrs;
    if (node.children && node.children.length > 0) result.children = nodesToJson(node.children);
    return result;
  });
}

/**
 * Convert a single NodeElement to Markdown
 *
 * @param node - NodeElement to convert
 * @returns Markdown string
 */
function nodeElementToMarkdown(node: NodeElement): string {
  const children = node.children ? nodesToMarkdown(node.children) : '';

  switch (node.tag) {
    case 'h3':
      return `\n# ${children}\n`;
    case 'h4':
      return `\n## ${children}\n`;
    case 'p':
      return `\n${children}\n`;
    case 'b':
    case 'strong':
      return `**${children}**`;
    case 'i':
    case 'em':
      return `*${children}*`;
    case 'a':
      return `[${children}](${node.attrs?.href || ''})`;
    case 'img':
      return `![image](${node.attrs?.src || ''})`;
    case 'ul':
    case 'ol':
      return `\n${children}`;
    case 'li':
      return `- ${children}\n`;
    case 'blockquote':
      return `\n> ${children}\n`;
    case 'code':
      return `\`${children}\``;
    case 'pre':
      return `\n\`\`\`\n${children}\n\`\`\`\n`;
    case 'br':
      return '\n';
    case 'hr':
      return '\n---\n';
    case 's':
      return `~~${children}~~`;
    case 'u':
      return `__${children}__`;
    case 'figure':
      return children;
    case 'figcaption':
      return '';
    case 'aside':
      return `\n> ${children}\n`;
    case 'video':
    case 'iframe':
      return `\n[${node.tag}](${node.attrs?.src || ''})\n`;
    default:
      return children;
  }
}

/**
 * Convert Telegraph Node array to Markdown format
 *
 * @param nodes - Array of Telegraph Node objects
 * @returns Markdown string
 */
export function nodesToMarkdown(nodes: Node[]): string {
  let markdown = '';
  for (const node of nodes) {
    if (typeof node === 'string') {
      markdown += node;
    } else {
      markdown += nodeElementToMarkdown(node);
    }
  }
  return markdown;
}

/**
 * Convert a single NodeElement to HTML
 *
 * @param node - NodeElement to convert
 * @returns HTML string
 */
function nodeElementToHtml(node: NodeElement): string {
  const children = node.children ? nodesToHtml(node.children) : '';

  // Self-closing tags
  if (['br', 'hr', 'img'].includes(node.tag)) {
    const attrs = node.attrs
      ? ' ' + Object.entries(node.attrs)
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ')
      : '';
    return `<${node.tag}${attrs}/>`;
  }

  // Tags with attributes
  const attrs = node.attrs
    ? ' ' + Object.entries(node.attrs)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ')
    : '';

  return `<${node.tag}${attrs}>${children}</${node.tag}>`;
}

/**
 * Convert Telegraph Node array to HTML format
 *
 * @param nodes - Array of Telegraph Node objects
 * @returns HTML string
 */
export function nodesToHtml(nodes: Node[]): string {
  let html = '';
  for (const node of nodes) {
    if (typeof node === 'string') {
      html += node;
    } else {
      html += nodeElementToHtml(node);
    }
  }
  return html;
}
