var fs = require("fs");
var hidefile = require("../");

var temp = "temp";
var tempHidden = ".temp";
var windows = process.platform.indexOf("win") == 0;



/*
	newFile(path, hidden, callback);
	newFile(path, callback);
	newFile(hidden, callback);
	newFile(callback);
*/
function newFile(path, hidden, callback)
{
	function callback_wrapper(error, newpath)
	{
		if (error) throw error;
		callback(path, newpath);
	}
	
	// hidden, callback
	if (path===true || path===false)
	{
		callback = hidden;
		hidden = path;
		path = temp;
	}
	// callback
	else if (typeof path == "function")
	{
		callback = path;
		path = temp;
		hidden = false;
	}
	// path, callback
	else if (typeof hidden == "function")
	{
		callback = hidden;
		hidden = false;
	}
	// path, hidden, callback
	else {}
	
	fs.writeFile(path, "", function(error)
	{
		if (!error && hidden)
		{
			hidefile.hide(path, callback_wrapper);
		}
		else
		{
			callback_wrapper(error, path, path);
		}
	});
}



/*
	newFolder(path, hidden, callback);
	newFolder(path, callback);
	newFolder(hidden, callback);
	newFolder(callback);
*/
function newFolder(path, hidden, callback)
{
	function callback_wrapper(error, newpath)
	{
		if (error) throw error;
		callback(path, newpath);
	}
	
	// hidden, callback
	if (path===true || path===false)
	{
		callback = hidden;
		hidden = path;
		path = temp;
	}
	// callback
	else if (typeof path == "function")
	{
		callback = path;
		path = temp;
		hidden = false;
	}
	// path, callback
	else if (typeof hidden == "function")
	{
		callback = hidden;
		hidden = false;
	}
	// path, hidden, callback
	else {}
	
	fs.mkdir(path, function(error)
	{
		if (!error && hidden)
		{
			hidefile.hide(path, callback_wrapper);
		}
		else
		{
			callback_wrapper(error, path, path);
		}
	});
}



module.exports =
{
	newFile: newFile,
	newFolder: newFolder,
	
	isWindows: windows,
	temp: temp,
	tempHidden: tempHidden
};
