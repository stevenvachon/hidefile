"use strict";
const fs = require("fs");
const pathlib = require("path");
const winattr = require("winattr");

const prefix = ".";
const windows = process.platform.indexOf("win") === 0;



function change(before, after, attrs, callback)
{
	//if (before !== after)
	//{
		fs.rename(before, after, function(error)
		{
			if (error==null && windows===true)
			{
				winattr.set(after, attrs, function(error)
				{
					change_callback(error, after, callback);
				});
			}
			else
			{
				change_callback(error, after, callback);
			}
		});
	/*}
	else if (windows === true)
	{
		winattr.set(after, attrs, function(error)
		{
			change_callback(error, after, callback);
		});
	}
	else
	{
		// Will not produce error if file does not exist and did not attempt to rename
		callback(null, after);
	}*/
}



function change_callback(error, after, callback)
{
	if (error == null)
	{
		callback(error, after);
	}
	else
	{
		// Avoids arguments being [error,undefined].length===2
		callback(error);
	}
}



function changeSync(before, after, attrs)
{
	//if (before !== after)
	//{
		fs.renameSync(before, after);
	//}
	// Else: will not produce error if file does not exist and did not attempt to rename
	
	if (windows === true)
	{
		winattr.setSync(after, attrs);
	}
	
	return after;
}



function parsePath(path)
{
	const basename = pathlib.basename(path);
	var dirname  = pathlib.dirname(path);
	
	// Omit current dir marker
	if (dirname === ".") dirname = "";
	
	return {
		basename: basename,
		dirname: dirname,
		prefixed: basename[0] === prefix
	};
}



function stat(path, callback)
{
	const result =
	{
		unix: parsePath(path).prefixed,
		windows: false
	};
	
	if (windows === true)
	{
		winattr.get(path, function(error, data)
		{
			result.windows = (error!=null) ? false : data.hidden;
			
			callback(error, result);
		});
	}
	else
	{
		callback(null, result);
	}
}



function statSync(path)
{
	const result =
	{
		unix: parsePath(path).prefixed,
		windows: false
	};
	
	if (windows === true)
	{
		result.windows = winattr.getSync(path).hidden;
	}
	
	return result;
}



function stringifyPath(pathObj, shouldHavePrefix)
{
	var result = "";
	
	if (pathObj.basename !== "")
	{
		if (shouldHavePrefix===true && pathObj.prefixed===false)
		{
			result = prefix + pathObj.basename;
		}
		else if (shouldHavePrefix===false && pathObj.prefixed===true)
		{
			result = pathObj.basename.slice(1);
		}
		else
		{
			result = pathObj.basename;
		}
	}
	
	if (pathObj.dirname !== "")
	{
		// If has a basename, and dirname is not "/" nor has a trailing slash (unlikely)
		if (result!=="" && pathObj.dirname!=="/" && pathObj.dirname[pathObj.dirname.length-1]!=="/")
		{
			result = pathObj.dirname +"/"+ result;
		}
		else
		{
			result = pathObj.dirname + result;
		}
	}
	
	return result;
}



//::: PUBLIC FUNCTIONS



function hide(path, callback)
{
	const newpath = stringifyPath( parsePath(path), true );
	
	change(path, newpath, {hidden:true}, callback);
}



function hideSync(path)
{
	const newpath = stringifyPath( parsePath(path), true );
	
	return changeSync(path, newpath, {hidden:true});
}



function isDotPrefixed(path)
{
	return pathlib.basename(path)[0] === prefix;
}



function isHidden(path, callback)
{
	stat(path, function(error, data)
	{
		if (error == null)
		{
			callback( null, data.unix===true && ((data.windows===true && windows===true) || windows===false) );
		}
		else
		{
			callback(error);
		}
	});
}



function isHiddenSync(path, callback)
{
	const data = statSync(path);
	
	return data.unix===true && ((data.windows===true && windows===true) || windows===false);
}



function reveal(path, callback)
{
	const newpath = stringifyPath( parsePath(path), false );
	
	change(path, newpath, {hidden:false}, callback);
}



function revealSync(path, callback)
{
	const newpath = stringifyPath( parsePath(path), false );
	
	return changeSync(path, newpath, {hidden:false});
}



function shouldBeHidden(path, callback)
{
	stat(path, function(error, data)
	{
		if (error == null)
		{
			callback( null, data.unix===true || data.windows===true );
		}
		else
		{
			callback(error);
		}
	});
}



function shouldBeHiddenSync(path, callback)
{
	const data = statSync(path);
	
	return data.unix===true || data.windows===true;
}



module.exports =
{
	hide: hide,
	hideSync: hideSync,
	isDotPrefixed: isDotPrefixed,
	isHidden: isHidden,
	isHiddenSync: isHiddenSync,
	reveal: reveal,
	revealSync: revealSync,
	shouldBeHidden: shouldBeHidden,
	shouldBeHiddenSync: shouldBeHiddenSync
};
