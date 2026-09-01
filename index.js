import { basename, dirname } from 'node:path';
import { getAttributes, getAttributesSync, setAttributes, setAttributesSync } from 'winattr';
import isWindows from 'is-windows';
import { rename } from 'node:fs/promises';
import { renameSync } from 'node:fs';

const EMPTY = '';
const PREFIX = '.';

/**
 * @param {string} before
 * @param {string} after
 * @param {boolean} hidden
 */
const change = async (before, after, hidden) => {
  await rename(before, after);

  if (isWindows()) {
    await setAttributes(after, { hidden });
  }

  return after;
};

/**
 * @param {string} before
 * @param {string} after
 * @param {boolean} hidden
 */
const changeSync = (before, after, hidden) => {
  renameSync(before, after);

  if (isWindows()) {
    setAttributesSync(after, { hidden });
  }

  return after;
};

/**
 * @param {string} path
 * @param {boolean} shouldHavePrefix
 */
const dotPrefixedPath = (path, shouldHavePrefix) =>
  stringifyPath(parsePath(path), shouldHavePrefix);

/**
 * @param {string} path
 */
const getState = async path => {
  const unix = isDotPrefixed(path);

  if (!isWindows()) {
    return { unix, windows: false };
  }

  const { hidden: windows } = await getAttributes(path);
  return { unix, windows };
};

/**
 * @param {string} path
 */
const getStateSync = path => {
  const unix = isDotPrefixed(path);

  if (!isWindows()) {
    return { unix, windows: false };
  }

  const { hidden: windows } = getAttributesSync(path);
  return { unix, windows };
};

/**
 * Hide a file or directory by adding a "." prefix.
 * On Windows, the hidden attribute is also set.
 * @param {string} path Path to a file or directory.
 * @throws {Error} When `path` cannot be accessed.
 * @throws {InaccessiblePathError} When `path` cannot be accessed by the native binding on Windows.
 * @throws {TypeError} When `path` is not a string.
 * @throws {UnknownError} When the fallback command fails unexpectedly on Windows.
 */
export const hide = path => Promise.try(() => change(path, dotPrefixedPath(path, true), true));

/**
 * Synchronously hide a file or directory by adding a "." prefix.
 * On Windows, the hidden attribute is also set.
 * @param {string} path Path to a file or directory.
 * @throws {Error} When `path` cannot be accessed.
 * @throws {InaccessiblePathError} When `path` cannot be accessed by the native binding on Windows.
 * @throws {TypeError} When `path` is not a string.
 * @throws {UnknownError} When the fallback command fails unexpectedly on Windows.
 */
export const hideSync = path => changeSync(path, dotPrefixedPath(path, true), true);

/**
 * Determine whether the basename of `path` starts with a "." prefix.
 * @param {string} path Path to a file or directory.
 * @throws {TypeError} When `path` is not a string.
 */
export const isDotPrefixed = path => basename(path).startsWith(PREFIX);

/**
 * Unix: prefixed. Windows: prefixed _and_ attributed.
 * @param {{ unix: boolean, windows: boolean }} state
 */
const isFullyHidden = ({ unix, windows }) => unix && (!isWindows() || windows);

/**
 * Determine whether `path` is considered hidden.
 * Unix: prefixed;
 * Windows: prefixed _and_ attributed.
 * @param {string} path Path to a file or directory.
 * @throws {InaccessiblePathError} When `path` cannot be accessed by the native binding on Windows.
 * @throws {TypeError} When `path` is not a string.
 * @throws {UnknownError} When the fallback command fails unexpectedly on Windows.
 */
export const isHidden = path => getState(path).then(isFullyHidden);

/**
 * Synchronously determine whether `path` is considered hidden.
 * Unix: prefixed;
 * Windows: prefixed _and_ attributed.
 * @param {string} path Path to a file or directory.
 * @throws {InaccessiblePathError} When `path` cannot be accessed by the native binding on Windows.
 * @throws {TypeError} When `path` is not a string.
 * @throws {UnknownError} When the fallback command fails unexpectedly on Windows.
 */
export const isHiddenSync = path => isFullyHidden(getStateSync(path));

/**
 * Unix: prefixed;
 * Windows: prefixed _or_ attributed.
 * @param {{ unix: boolean, windows: boolean }} state
 */
const isPartiallyHidden = ({ unix, windows }) => unix || windows;

/**
 * @param {string} path
 * @throws {TypeError} When `path` is not a string.
 */
const parsePath = path => {
  const dir = dirname(path);
  const name = basename(path);

  return {
    basename: name,
    dirname: dir === PREFIX ? EMPTY : dir,
    prefixed: name.startsWith(PREFIX),
  };
};

/**
 * Reveal a file or directory by removing a "." prefix.
 * On Windows, the hidden attribute is also removed.
 * @param {string} path Path to a file or directory.
 * @throws {Error} When `path` cannot be accessed.
 * @throws {InaccessiblePathError} When `path` cannot be accessed by the native binding on Windows.
 * @throws {TypeError} When `path` is not a string.
 * @throws {UnknownError} When the fallback command fails unexpectedly on Windows.
 */
export const reveal = path => Promise.try(() => change(path, dotPrefixedPath(path, false), false));

/**
 * Synchronously reveal a file or directory by removing a "." prefix.
 * On Windows, the hidden attribute is also removed.
 * @param {string} path Path to a file or directory.
 * @throws {Error} When `path` cannot be accessed.
 * @throws {InaccessiblePathError} When `path` cannot be accessed by the native binding on Windows.
 * @throws {TypeError} When `path` is not a string.
 * @throws {UnknownError} When the fallback command fails unexpectedly on Windows.
 */
export const revealSync = path => changeSync(path, dotPrefixedPath(path, false), false);

/**
 * Determine whether `path` should be treated as hidden.
 * Unix: prefixed;
 * Windows: prefixed _or_ attributed.
 * @param {string} path Path to a file or directory.
 * @throws {InaccessiblePathError} When `path` cannot be accessed by the native binding on Windows.
 * @throws {TypeError} When `path` is not a string.
 * @throws {UnknownError} When the fallback command fails unexpectedly on Windows.
 */
export const shouldBeHidden = path => getState(path).then(isPartiallyHidden);

/**
 * Synchronously determine whether `path` should be treated as hidden.
 * Unix: prefixed;
 * Windows: prefixed _or_ attributed.
 * @param {string} path Path to a file or directory.
 * @throws {InaccessiblePathError} When `path` cannot be accessed by the native binding on Windows.
 * @throws {TypeError} When `path` is not a string.
 * @throws {UnknownError} When the fallback command fails unexpectedly on Windows.
 */
export const shouldBeHiddenSync = path => isPartiallyHidden(getStateSync(path));

/**
 * @param {{ basename: string, dirname: string, prefixed: boolean }} parts
 * @param {boolean} shouldHavePrefix
 */
const stringifyPath = ({ basename, dirname, prefixed }, shouldHavePrefix) => {
  let name = basename;

  if (basename !== EMPTY) {
    if (shouldHavePrefix && !prefixed) {
      name = `${PREFIX}${basename}`;
    } else if (!shouldHavePrefix && prefixed) {
      name = basename.slice(1);
    }
  }

  if (dirname === EMPTY) {
    return name;
  }

  if (name !== EMPTY && dirname !== '/' && !dirname.endsWith('/')) {
    return `${dirname}/${name}`;
  }

  return `${dirname}${name}`;
};
