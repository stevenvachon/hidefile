# hidefile [![NPM Version](http://badge.fury.io/js/hidefile.svg)](http://badge.fury.io/js/hidefile)

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
