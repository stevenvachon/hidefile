var child_process = require("child_process");
var fs = require("fs");
var pathModule = require("path");
var winattr = require("winattr");

var prefix = ".";
var windows = process.platform.indexOf("win") == 0;



function change(before, after, attrs, callback)
{
	if (before != after)
	{
		fs.rename(before, after, function(error)
		{
			if (!error && windows)
			{
				winattr.set(after, attrs, function(error)
				{
					callback(error, after);
				});
			}
			else
			{
				callback(error, after);
			}
		});
	}
	else if (windows)
	{
		winattr.set(after, attrs, function(error)
		{
			callback(error, after);
		});
	}
	else
	{
		callback(null, after);
	}
}



function hide(path, callback)
{
	var newpath = parsePath(path);
	
	if (!newpath.prefixed) newpath.basename = prefix+newpath.basename;
	
	newpath = stringifyPath(newpath);
	
	change(path, newpath, {hidden:true}, callback);
}



// TODO :: use child_process.spawnSync from node 0.12
/*function hideSync(path, callback)
{
	
}*/



function parsePath(path)
{
	var basename = pathModule.basename(path);
	var dirname  = pathModule.dirname(path);
	
	// Omit current dir marker
	if (dirname == ".") dirname = "";
	
	if (dirname.length>0 && dirname[dirname.length-1] != "/") dirname += "/";
	
	return {
		basename: basename,
		dirname: dirname,
		prefixed: basename[0] == prefix
	};
}



function reveal(path, callback)
{
	var newpath = parsePath(path);
	
	if (newpath.prefixed) newpath.basename = newpath.basename.slice(1);
	
	newpath = stringifyPath(newpath);
	
	change(path, newpath, {hidden:false}, callback);
}



function stat(path, callback)
{
	var result =
	{
		unix: parsePath(path).prefixed,
		windows: false
	};
	
	if (windows)
	{
		winattr.get(path, function(error, data)
		{
			result.windows = (error) ? false : data.hidden;
			
			callback(result);
		});
	}
	else
	{
		callback(result);
	}
}



function stat_is(path, callback)
{
	stat(path, function(data)
	{
		callback( data.unix && ((data.windows && windows) || !windows) );
	});
}



function stat_prefixed(path)
{
	return pathModule.basename(path)[0] == prefix;
}



function stat_shouldBe(path, callback)
{
	stat(path, function(data)
	{
		callback( data.unix || data.windows );
	});
}



function stringifyPath(pathObj)
{
	return pathObj.dirname + pathObj.basename;
}



module.exports =
{
	hide: hide,
	isDotPrefixed: stat_prefixed,
	isHidden: stat_is,
	reveal: reveal,
	shouldBeHidden: stat_shouldBe
};
