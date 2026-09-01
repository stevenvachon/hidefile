# hidefile [![NPM Version][npm-image]][npm-url] ![Build Status][ghactions-image] [![Coverage Status][codecov-image]][codecov-url]

> Hide files and directories on all platforms.

Unix:

- Adds or removes a "." prefix on a file or directory.

Windows:

- Adds or removes a "." prefix on a file or directory.
- Adds or removes the "hidden" attribute on a file or directory.

A native binding is used, offering great performance. As a contingency in case that fails, functionality will silently revert to a command line, though it is considerably slower.

## Install

```shell
npm install hidefile
```

## Usage

### Basic

```js
import { hide, hideSync, reveal, revealSync } from 'hidefile';

await hide('path/to/file.ext'); //-> 'path/to/.file.ext'
hideSync('path/to/file.ext'); //-> 'path/to/.file.ext'

await reveal('path/to/.file.ext'); //-> 'path/to/file.ext'
revealSync('path/to/.file.ext'); //-> 'path/to/file.ext'
```

### Predicates

```js
import {
  isDotPrefixed,
  isHidden,
  isHiddenSync,
  shouldBeHidden,
  shouldBeHiddenSync,
} from 'hidefile';

isDotPrefixed('path/to/.file.ext'); //-> true
isDotPrefixed('path/to/file.ext'); //-> false

/*
  Unix: prefixed
  Windows: prefixed _and_ attributed
*/
await isHidden('path/to/.file.ext'); //-> true
isHiddenSync('path/to/.file.ext'); //-> true

/*
  Unix: prefixed
  Windows: prefixed _or_ attributed
*/
await shouldBeHidden('path/to/.file.ext'); //-> true
shouldBeHiddenSync('path/to/.file.ext'); //-> true
```

[npm-image]: https://img.shields.io/npm/v/hidefile
[npm-url]: https://npmjs.com/package/hidefile
[ghactions-image]: https://img.shields.io/github/actions/workflow/status/stevenvachon/hidefile/test.yml
[codecov-image]: https://img.shields.io/codecov/c/github/stevenvachon/hidefile
[codecov-url]: https://app.codecov.io/github/stevenvachon/hidefile
