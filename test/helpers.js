import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import isWindows from 'is-windows';
import { setAttributesSync } from 'winattr';
/** @import { SetAttributes } from 'winattr' */

export const TEMP_DIR = 'temp-dir';
export const TEMP_HIDDEN = '.temp';
export const TEMP_VISIBLE = 'temp';

export const createFolder = path => mkdirSync(path, { recursive: true });

/**
 * Create a new file fixture and apply any attributes on Windows.
 * @param {string} path
 * @param {SetAttributes} [attrs]
 */
export const createFileFixture = (path, attrs) => {
  writeFileSync(path, '');
  maybeSetAttributes(path, attrs);
};

/**
 * Create a new folder fixture and apply any attributes on Windows.
 * @param {string} path
 * @param {SetAttributes} [attrs]
 */
export const createFolderFixture = (path, attrs) => {
  mkdirSync(path);
  maybeSetAttributes(path, attrs);
};

/**
 * @param {string} path
 * @param {SetAttributes} [attrs]
 */
const maybeSetAttributes = (path, attrs) => {
  if (isWindows() && attrs !== null && typeof attrs === 'object') {
    setAttributesSync(path, attrs);
  }
};

export const remove = path => rmSync(path, { force: true, recursive: true });
