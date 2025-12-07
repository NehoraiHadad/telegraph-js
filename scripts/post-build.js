#!/usr/bin/env node

/**
 * Post-build script to create CommonJS exports
 * Renames .js files to .cjs and creates proper package.json for CJS
 */

import { readdir, rename, writeFile } from 'fs/promises';
import { join } from 'path';

async function renameFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      await renameFiles(fullPath);
    } else if (entry.name.endsWith('.js')) {
      const newPath = fullPath.replace(/\.js$/, '.cjs');
      await rename(fullPath, newPath);
    }
  }
}

async function main() {
  try {
    // Rename all .js files to .cjs in dist-cjs
    await renameFiles('./dist-cjs');

    // Create package.json for CommonJS
    const cjsPackage = {
      type: 'commonjs'
    };

    await writeFile(
      './dist-cjs/package.json',
      JSON.stringify(cjsPackage, null, 2)
    );

    console.log('CommonJS build completed successfully');
  } catch (error) {
    console.error('Error in post-build:', error);
    process.exit(1);
  }
}

main();
