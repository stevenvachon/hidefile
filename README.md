# hidefile [![NPM Version][npm-image]][npm-url] [![Linux Build][travis-image]][travis-url] [![Windows Build][appveyor-image]][appveyor-url] [![Dependency Status][david-image]][david-url]

> Hide files and directories on all platforms.

Unix:
* Adds or removes a "." prefix on a file or dir

Windows:
* Adds or removes a "." prefix on a file or dir
* Adds or removes the "hidden" attribute on a file or dir

A native binding is used, offering great performance. As a contingency in case that fails, functionality will silently revert to a command line, though it is considerably slower.


## Installation

[Node.js](http://nodejs.org/) `>= 4` is required. To install, type this at the command line:
```
npm install hidefile
```


## Methods

### `hide(path, callback)`
`path` - Path to file or directory  
`callback(err,newpath)` - A callback which is called upon completion  
```js
hidefile.hide("path/to/file.ext", function(err, newpath) {
    if (err == null) console.log(newpath);  //-> "path/to/.file.ext"
});
```

### `hideSync(path)`
`path` - Path to file or directory  

Throws an error if the file or dir cannot be found/accessed.
```js
var newpath = hidefile.hideSync("path/to/file.ext");

console.log(newpath);  //-> "path/to/.file.ext"
```

### `isDotPrefixed(path)`
`path` - Path to file or directory  
```js
console.log( hidefile.isDotPrefixed("path/to/.file.ext") );  //-> true
console.log( hidefile.isDotPrefixed("path/to/file.ext") );   //-> false
```

### `isHidden(path, callback)`
`path` - Path to file or directory  
`callback(result)` - A callback which is called upon completion  
```js
hidefile.isHidden("path/to/file.ext", function(err, result) {
    if (err == null) console.log(result);  //-> false
});
```
Unix: `result` is `true` if prefixed.  
Windows: `result` is `true` if prefixed *and* has "hidden" attribute, `false` if only prefixed.  

### `isHiddenSync(path)`
`path` - Path to file or directory  

Throws an error if the file or dir cannot be found/accessed.
```js
var result = hidefile.isHiddenSync("path/to/file.ext");

console.log(result);  //-> false
```

### `reveal(path, callback)`
`path` - Path to file or directory  
`callback(err,newpath)` - A callback which is called upon completion  
```js
hidefile.reveal("path/to/.file.ext", function(err, newpath) {
    if (err == null) console.log(newpath);  //-> "path/to/file.ext"
});
```

### `revealSync(path)`
`path` - Path to file or directory  

Throws an error if the file or dir cannot be found/accessed.
```js
var newpath = hidefile.revealSync("path/to/.file.ext");

console.log(newpath);  //-> "path/to/file.ext"
```

### `shouldBeHidden(path, callback)`
`path` - Path to file or directory  
`callback(result)` - A callback which is called upon completion  
```js
if (isWindows) {
    hidefile.shouldBeHidden("path/to/.file.ext", function(err, result) {
        if (err == null) console.log(result);  //-> true
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
    result = hidefile.shouldBeHiddenSync("path/to/.file.ext");
    
    console.log(result);  //-> true
}
```


## Changelog
* 2.0.0 removed support for Node.js v0.10 and v0.12
* 1.1.0 added binding support to Node.js v4
* 1.0.0
  * added `hideSync()`,`isHiddenSync()`,`revealSync()`,`shouldBeHiddenSync()`
  * removed `useExec()`,`useNative()`
  * uses binding by default, with auto-fallback to shell
* 0.2.0 added `useExec()`,`useNative()`
* 0.1.2 tested on Windows
* 0.1.1 package.json optimization
* 0.1.0 initial release


[npm-image]: https://img.shields.io/npm/v/hidefile.svg
[npm-url]: https://npmjs.org/package/hidefile
[travis-image]: https://img.shields.io/travis/stevenvachon/hidefile.svg?label=linux
[travis-url]: https://travis-ci.org/stevenvachon/hidefile
[appveyor-image]: https://img.shields.io/appveyor/ci/stevenvachon/hidefile.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/stevenvachon/hidefile
[david-image]: https://img.shields.io/david/stevenvachon/hidefile.svg
[david-url]: https://david-dm.org/stevenvachon/hidefile
