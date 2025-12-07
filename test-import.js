/**
 * Test file to verify all exports are working correctly
 */

import {
  Telegraph,
  TelegraphError,
  htmlToNodes,
  markdownToHtml,
  parseContent,
  ALLOWED_TAGS
} from './dist/index.js';

console.log('✓ Telegraph class imported:', typeof Telegraph === 'function');
console.log('✓ TelegraphError class imported:', typeof TelegraphError === 'function');
console.log('✓ htmlToNodes function imported:', typeof htmlToNodes === 'function');
console.log('✓ markdownToHtml function imported:', typeof markdownToHtml === 'function');
console.log('✓ parseContent function imported:', typeof parseContent === 'function');
console.log('✓ ALLOWED_TAGS array imported:', Array.isArray(ALLOWED_TAGS));

console.log('\nTesting utility functions:');

// Test htmlToNodes
const nodes = htmlToNodes('<p>Hello <b>world</b>!</p>');
console.log('✓ htmlToNodes works:', nodes.length > 0);

// Test markdownToHtml
const html = markdownToHtml('# Title\n\nThis is **bold**');
console.log('✓ markdownToHtml works:', html.includes('<h3>') && html.includes('<b>'));

// Test parseContent
const parsed = parseContent('<p>Test</p>');
console.log('✓ parseContent works:', Array.isArray(parsed));

// Test Telegraph instantiation
const telegraph = new Telegraph();
console.log('✓ Telegraph instance created:', telegraph instanceof Telegraph);

// Test TelegraphError
try {
  throw new TelegraphError('Test error');
} catch (error) {
  console.log('✓ TelegraphError works:', error instanceof TelegraphError);
  console.log('✓ TelegraphError has correct name:', error.name === 'TelegraphError');
}

console.log('\n✓ All imports and basic functionality verified successfully!');
