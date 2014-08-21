# hidefile [![NPM Version](http://badge.fury.io/js/hidefile.svg)](http://badge.fury.io/js/hidefile) [![Build Status](https://secure.travis-ci.org/stevenvachon/hidefile.svg)](http://travis-ci.org/stevenvachon/hidefile) [![Build status](https://ci.appveyor.com/api/projects/status/n3obce2u8sbtu0ty)](https://ci.appveyor.com/project/stevenvachon/hidefile) [![Dependency Status](https://david-dm.org/stevenvachon/hidefile.svg)](https://david-dm.org/stevenvachon/hidefile)

> Hide files and directories on all platforms.

Unix:
* Adds or removes a "." prefix on a file or dir

Windows:
* Adds or removes a "." prefix on a file or dir
* Adds or removes the "hidden" attribute on a file or dir

## Getting Started

[Node.js](http://nodejs.org/) `~0.10` is required. To install, type this at the command line:
```
npm install hidefile --save-dev
```

### Methods

#### hide(path, callback)
`path` - Path to file or directory  
`callback(err,newpath)` - A callback which is called upon completion  
```js
var hidefile = require("hidefile");

hidefile.hide("path/to/file.ext", function(err, newpath) {
	if (!err) console.log(newpath);	//=> "path/to/.file.ext"
});
```

#### isDotPrefixed(path)
`path` - Path to file or directory  
```js
var hidefile = require("hidefile");

console.log( hidefile.isDotPrefixed("path/to/.file.ext") );	//=> true
console.log( hidefile.isDotPrefixed("path/to/file.ext") );	//=> false
```

#### isHidden(path, callback)
`path` - Path to file or directory  
`callback(result)` - A callback which is called upon completion  
```js
var hidefile = require("hidefile");

hidefile.isHidden("path/to/file.ext", function(result) {
	console.log(result);	//=> false
});
```
Unix: `result` is `true` if prefixed  
Windows: `result` is `true` if prefixed *and* has "hidden" attribute  

#### reveal(path, callback)
`path` - Path to file or directory  
`callback(err,newpath)` - A callback which is called upon completion  
```js
var hidefile = require("hidefile");

hidefile.reveal("path/to/.file.ext", function(err, newpath) {
	if (!err) console.log(newpath);	//=> "path/to/file.ext"
});
```

#### shouldBeHidden(path, callback)
`path` - Path to file or directory  
`callback(result)` - A callback which is called upon completion  
```js
var hidefile = require("hidefile");

if (isWindows) {
	hidefile.shouldBeHidden("path/to/.file.ext", function(result) {
		console.log(result);	//=> true
	});
}
```
Unix: `result` is `true` if prefixed  
Windows: `result` is `true` if prefixed *or* has "hidden" attribute  

#### useExec()
[More info](https://github.com/stevenvachon/winattr/#useexec). Used by default.

#### useNative()
[More info](https://github.com/stevenvachon/winattr/#usenative). Much faster than `useExec()`.

### Changelog
* 0.2.0 updated [winattr](https://npmjs.org/package/winattr), added `useExec()`,`useNative()`
* 0.1.2 tested on Windows
* 0.1.1 package.json optimization
* 0.1.0 initial release
