# hidefile [![NPM Version][npm-image]][npm-url] [![Linux Build][travis-image]][travis-url] [![Windows Build][appveyor-image]][appveyor-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Monitor][greenkeeper-image]][greenkeeper-url]

> Hide files and directories on all platforms.

Unix:
* Adds or removes a "." prefix on a file or dir

Windows:
* Adds or removes a "." prefix on a file or dir
* Adds or removes the "hidden" attribute on a file or dir

A native binding is used, offering great performance. As a contingency in case that fails, functionality will silently revert to a command line, though it is considerably slower.


## Installation

[Node.js](http://nodejs.org/) `>= 8` is required. To install, type this at the command line:
```
npm install hidefile
```


## Methods

### `hide(path, callback)`
`path` - Path to file or directory  
`callback(err,newpath)` - A callback which is called upon completion  
```js
hidefile.hide('path/to/file.ext', (err, newpath) => {
  if (err == null) {
    console.log(newpath);  //-> 'path/to/.file.ext'
  }
});
```

### `hideSync(path)`
`path` - Path to file or directory  

Throws an error if the file or dir cannot be found/accessed.
```js
const newpath = hidefile.hideSync('path/to/file.ext');

console.log(newpath);  //-> 'path/to/.file.ext'
```

### `isDotPrefixed(path)`
`path` - Path to file or directory  
```js
console.log( hidefile.isDotPrefixed('path/to/.file.ext') );  //-> true
console.log( hidefile.isDotPrefixed('path/to/file.ext') );   //-> false
```

### `isHidden(path, callback)`
`path` - Path to file or directory  
`callback(result)` - A callback which is called upon completion  
```js
hidefile.isHidden('path/to/file.ext', (err, result) => {
  if (err == null) {
    console.log(result);  //-> false
  }
});
```
Unix: `result` is `true` if prefixed.  
Windows: `result` is `true` if prefixed *and* has "hidden" attribute, `false` if only prefixed.  

### `isHiddenSync(path)`
`path` - Path to file or directory  

Throws an error if the file or dir cannot be found/accessed.
```js
const result = hidefile.isHiddenSync('path/to/file.ext');

console.log(result);  //-> false
```

### `reveal(path, callback)`
`path` - Path to file or directory  
`callback(err,newpath)` - A callback which is called upon completion  
```js
hidefile.reveal('path/to/.file.ext', (err, newpath) => {
  if (err == null) {
    console.log(newpath);  //-> 'path/to/file.ext'
  }
});
```

### `revealSync(path)`
`path` - Path to file or directory  

Throws an error if the file or dir cannot be found/accessed.
```js
const newpath = hidefile.revealSync('path/to/.file.ext');

console.log(newpath);  //-> 'path/to/file.ext'
```

### `shouldBeHidden(path, callback)`
`path` - Path to file or directory  
`callback(result)` - A callback which is called upon completion  
```js
if (isWindows) {
  hidefile.shouldBeHidden('path/to/.file.ext', (err, result) => {
    if (err == null) {
      console.log(result);  //-> true
    }
  });
}
```
Unix: `result` is `true` if prefixed.  
Windows: `result` is `true` if prefixed *or* has "hidden" attribute.  

### `shouldBeHiddenSync(path)`
`path` - Path to file or directory  

Throws an error if the file or dir cannot be found/accessed.
```js
if (isWindows) {
  result = hidefile.shouldBeHiddenSync('path/to/.file.ext');

  console.log(result);  //-> true
}
```


[npm-image]: https://img.shields.io/npm/v/hidefile.svg
[npm-url]: https://npmjs.com/package/hidefile
[travis-image]: https://img.shields.io/travis/stevenvachon/hidefile.svg?label=linux
[travis-url]: https://travis-ci.org/stevenvachon/hidefile
[appveyor-image]: https://img.shields.io/appveyor/ci/stevenvachon/hidefile.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/stevenvachon/hidefile
[coveralls-image]: https://img.shields.io/coveralls/stevenvachon/hidefile.svg
[coveralls-url]: https://coveralls.io/github/stevenvachon/hidefile
[greenkeeper-image]: https://badges.greenkeeper.io/stevenvachon/hidefile.svg
[greenkeeper-url]: https://greenkeeper.io/
