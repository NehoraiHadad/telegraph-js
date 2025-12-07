/**
 * Telegraph Page Templates
 * Pre-built templates for common page types
 */

import type { Node, NodeElement } from './types.js';

/**
 * Template field definition
 */
export interface TemplateField {
  /** Field name */
  name: string;
  /** Field description */
  description: string;
  /** Whether field is required */
  required: boolean;
  /** Field type */
  type: 'string' | 'string[]';
}

/**
 * Template definition
 */
export interface Template {
  /** Template name */
  name: string;
  /** Template description */
  description: string;
  /** Template fields */
  fields: TemplateField[];
  /** Generate content from data */
  generate: (data: Record<string, unknown>) => string;
}

/**
 * Blog Post Template
 * Creates a blog post with title, intro, sections, and optional conclusion
 */
const blogPostTemplate: Template = {
  name: 'blog_post',
  description: 'Create a blog post with title, introduction, sections, and optional conclusion',
  fields: [
    { name: 'title', description: 'Post title', required: true, type: 'string' },
    { name: 'intro', description: 'Introduction paragraph', required: true, type: 'string' },
    { name: 'sections', description: 'Array of {heading, content} objects', required: true, type: 'string[]' },
    { name: 'conclusion', description: 'Conclusion paragraph', required: false, type: 'string' },
  ],
  generate: (data: Record<string, unknown>): string => {
    const title = data.title as string;
    const intro = data.intro as string;
    const sections = data.sections as Array<{ heading: string; content: string }>;
    const conclusion = data.conclusion as string | undefined;

    let html = `<h3>${title}</h3>\n<p>${intro}</p>\n`;

    for (const section of sections) {
      html += `<h4>${section.heading}</h4>\n<p>${section.content}</p>\n`;
    }

    if (conclusion) {
      html += `<h4>Conclusion</h4>\n<p>${conclusion}</p>\n`;
    }

    return html;
  },
};

/**
 * Documentation Template
 * Creates technical documentation with overview, installation, usage, and API reference
 */
const documentationTemplate: Template = {
  name: 'documentation',
  description: 'Create technical documentation with overview, installation, usage, and API reference',
  fields: [
    { name: 'title', description: 'Documentation title', required: true, type: 'string' },
    { name: 'overview', description: 'Overview section content', required: true, type: 'string' },
    { name: 'installation', description: 'Installation instructions', required: false, type: 'string' },
    { name: 'usage', description: 'Usage instructions', required: false, type: 'string' },
    { name: 'api_reference', description: 'Array of API reference items', required: false, type: 'string[]' },
  ],
  generate: (data: Record<string, unknown>): string => {
    const title = data.title as string;
    const overview = data.overview as string;
    const installation = data.installation as string | undefined;
    const usage = data.usage as string | undefined;
    const apiReference = data.api_reference as string[] | undefined;

    let html = `<h3>${title}</h3>\n<h4>Overview</h4>\n<p>${overview}</p>\n`;

    if (installation) {
      html += `<h4>Installation</h4>\n<pre>${installation}</pre>\n`;
    }

    if (usage) {
      html += `<h4>Usage</h4>\n<p>${usage}</p>\n`;
    }

    if (apiReference && apiReference.length > 0) {
      html += `<h4>API Reference</h4>\n<ul>\n`;
      for (const item of apiReference) {
        html += `<li>${item}</li>\n`;
      }
      html += `</ul>\n`;
    }

    return html;
  },
};

/**
 * Article Template
 * Creates a simple article with title, optional subtitle, and body paragraphs
 */
const articleTemplate: Template = {
  name: 'article',
  description: 'Create a simple article with title, optional subtitle, and body paragraphs',
  fields: [
    { name: 'title', description: 'Article title', required: true, type: 'string' },
    { name: 'subtitle', description: 'Article subtitle', required: false, type: 'string' },
    { name: 'body', description: 'Array of body paragraphs', required: true, type: 'string[]' },
  ],
  generate: (data: Record<string, unknown>): string => {
    const title = data.title as string;
    const subtitle = data.subtitle as string | undefined;
    const body = data.body as string[];

    let html = `<h3>${title}</h3>\n`;

    if (subtitle) {
      html += `<h4>${subtitle}</h4>\n`;
    }

    for (const paragraph of body) {
      html += `<p>${paragraph}</p>\n`;
    }

    return html;
  },
};

/**
 * Changelog Template
 * Creates a changelog with version, date, and categorized changes
 */
const changelogTemplate: Template = {
  name: 'changelog',
  description: 'Create a changelog with version, date, and categorized changes (added, changed, fixed)',
  fields: [
    { name: 'title', description: 'Changelog title', required: true, type: 'string' },
    { name: 'version', description: 'Version number', required: true, type: 'string' },
    { name: 'date', description: 'Release date', required: true, type: 'string' },
    { name: 'added', description: 'Array of added features', required: false, type: 'string[]' },
    { name: 'changed', description: 'Array of changes', required: false, type: 'string[]' },
    { name: 'fixed', description: 'Array of bug fixes', required: false, type: 'string[]' },
  ],
  generate: (data: Record<string, unknown>): string => {
    const title = data.title as string;
    const version = data.version as string;
    const date = data.date as string;
    const added = data.added as string[] | undefined;
    const changed = data.changed as string[] | undefined;
    const fixed = data.fixed as string[] | undefined;

    let html = `<h3>${title}</h3>\n<h4>Version ${version} - ${date}</h4>\n`;

    if (added && added.length > 0) {
      html += `<p><strong>Added:</strong></p>\n<ul>\n`;
      for (const item of added) {
        html += `<li>${item}</li>\n`;
      }
      html += `</ul>\n`;
    }

    if (changed && changed.length > 0) {
      html += `<p><strong>Changed:</strong></p>\n<ul>\n`;
      for (const item of changed) {
        html += `<li>${item}</li>\n`;
      }
      html += `</ul>\n`;
    }

    if (fixed && fixed.length > 0) {
      html += `<p><strong>Fixed:</strong></p>\n<ul>\n`;
      for (const item of fixed) {
        html += `<li>${item}</li>\n`;
      }
      html += `</ul>\n`;
    }

    return html;
  },
};

/**
 * Tutorial Template
 * Creates a step-by-step tutorial with description, prerequisites, steps, and conclusion
 */
const tutorialTemplate: Template = {
  name: 'tutorial',
  description: 'Create a step-by-step tutorial with description, prerequisites, steps, and conclusion',
  fields: [
    { name: 'title', description: 'Tutorial title', required: true, type: 'string' },
    { name: 'description', description: 'Tutorial description', required: true, type: 'string' },
    { name: 'prerequisites', description: 'Array of prerequisites', required: false, type: 'string[]' },
    { name: 'steps', description: 'Array of {title, content} objects for each step', required: true, type: 'string[]' },
    { name: 'conclusion', description: 'Conclusion paragraph', required: false, type: 'string' },
  ],
  generate: (data: Record<string, unknown>): string => {
    const title = data.title as string;
    const description = data.description as string;
    const prerequisites = data.prerequisites as string[] | undefined;
    const steps = data.steps as Array<{ title: string; content: string }>;
    const conclusion = data.conclusion as string | undefined;

    let html = `<h3>${title}</h3>\n<p>${description}</p>\n`;

    if (prerequisites && prerequisites.length > 0) {
      html += `<h4>Prerequisites</h4>\n<ul>\n`;
      for (const prereq of prerequisites) {
        html += `<li>${prereq}</li>\n`;
      }
      html += `</ul>\n`;
    }

    html += `<h4>Steps</h4>\n`;
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      html += `<p><strong>Step ${i + 1}: ${step.title}</strong></p>\n<p>${step.content}</p>\n`;
    }

    if (conclusion) {
      html += `<h4>Conclusion</h4>\n<p>${conclusion}</p>\n`;
    }

    return html;
  },
};

/**
 * Available templates
 */
export const templates: Record<string, Template> = {
  blog_post: blogPostTemplate,
  documentation: documentationTemplate,
  article: articleTemplate,
  changelog: changelogTemplate,
  tutorial: tutorialTemplate,
};

/**
 * Get a template by name
 *
 * @param name - Template name
 * @returns Template object or undefined if not found
 *
 * @example
 * ```typescript
 * const template = getTemplate('blog_post');
 * if (template) {
 *   console.log(template.description);
 *   console.log(template.fields);
 * }
 * ```
 */
export function getTemplate(name: string): Template | undefined {
  return templates[name];
}

/**
 * List all available templates
 *
 * @returns Array of template metadata
 *
 * @example
 * ```typescript
 * const allTemplates = listTemplates();
 * allTemplates.forEach(t => {
 *   console.log(`${t.name}: ${t.description}`);
 *   console.log('Fields:', t.fields.map(f => f.name).join(', '));
 * });
 * ```
 */
export function listTemplates(): Array<{ name: string; description: string; fields: TemplateField[] }> {
  return Object.values(templates).map(t => ({
    name: t.name,
    description: t.description,
    fields: t.fields,
  }));
}

/**
 * Create Telegraph content from a template
 *
 * @param templateName - Name of the template to use
 * @param data - Data to populate the template
 * @returns Array of Telegraph Node objects
 *
 * @example
 * ```typescript
 * const content = createFromTemplate('blog_post', {
 *   title: 'My First Post',
 *   intro: 'This is the introduction...',
 *   sections: [
 *     { heading: 'Section 1', content: 'Content for section 1' },
 *     { heading: 'Section 2', content: 'Content for section 2' }
 *   ],
 *   conclusion: 'Thanks for reading!'
 * });
 *
 * // Use with Telegraph client
 * await telegraph.createPage({
 *   accessToken: 'token',
 *   title: 'My First Post',
 *   content: content
 * });
 * ```
 */
export function createFromTemplate(templateName: string, data: Record<string, any>): Node[] {
  const template = templates[templateName];
  if (!template) {
    throw new Error(`Template "${templateName}" not found`);
  }

  // Validate required fields
  for (const field of template.fields) {
    if (field.required && (data[field.name] === undefined || data[field.name] === null)) {
      throw new Error(`Required field "${field.name}" is missing`);
    }
  }

  // Generate HTML content
  const html = template.generate(data);

  // Convert HTML to Node array (simple conversion)
  // For simplicity, we'll import the htmlToNodes function
  // Since this is a new file, we need to import it
  return parseHtmlToNodes(html);
}

/**
 * Simple HTML to Node converter for template-generated content
 * This is a simplified version that handles the specific HTML our templates generate
 *
 * @param html - HTML string to convert
 * @returns Array of Telegraph Node objects
 */
function parseHtmlToNodes(html: string): Node[] {
  const nodes: Node[] = [];
  const tagRegex = /<(\/?)([\w-]+)([^>]*)>|([^<]+)/g;
  const stack: { tag: string; attrs?: Record<string, string>; children: Node[] }[] = [];
  let current: Node[] = nodes;

  let match;
  while ((match = tagRegex.exec(html)) !== null) {
    const [, closing, tagName, attrString, text] = match;

    if (text) {
      const trimmed = text.trim();
      if (trimmed) {
        current.push(trimmed);
      }
    } else if (tagName) {
      const tag = tagName.toLowerCase();

      if (closing) {
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
        const attrs: Record<string, string> = {};
        const attrRegex = /([\w-]+)=["']([^"']*)["']/g;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(attrString)) !== null) {
          attrs[attrMatch[1]] = attrMatch[2];
        }

        if (['br', 'hr', 'img'].includes(tag) || attrString.includes('/')) {
          const element: NodeElement = { tag };
          if (Object.keys(attrs).length > 0) {
            element.attrs = attrs;
          }
          current.push(element);
        } else {
          const newElement = { tag, attrs, children: [] as Node[] };
          stack.push(newElement);
          current = newElement.children;
        }
      }
    }
  }

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
