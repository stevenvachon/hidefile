"use strict";
const fs = require("fs");
const pathlib = require("path");
const winattr = require("winattr");

const isWindows = process.platform.startsWith("win");
const prefix = ".";



const change = (before, after, attrs, callback) =>
{
	//if (before !== after)
	//{
		fs.rename(before, after, error =>
		{
			if (error==null && isWindows)
			{
				winattr.set(after, attrs, error =>
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
	else if (isWindows)
	{
		winattr.set(after, attrs, error =>
		{
			change_callback(error, after, callback);
		});
	}
	else
	{
		// Will not produce error if file does not exist and did not attempt to rename
		callback(null, after);
	}*/
};



const change_callback = (error, after, callback) =>
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
};



const changeSync = (before, after, attrs) =>
{
	//if (before !== after)
	//{
		fs.renameSync(before, after);
	//}
	// Else: will not produce error if file does not exist and did not attempt to rename

	if (isWindows)
	{
		winattr.setSync(after, attrs);
	}

	return after;
};



const parsePath = path =>
{
	const basename = pathlib.basename(path);
	let dirname  = pathlib.dirname(path);

	// Omit current dir marker
	if (dirname === ".") dirname = "";

	return {
		basename: basename,
		dirname: dirname,
		prefixed: basename[0] === prefix
	};
};



const stat = (path, callback) =>
{
	const result =
	{
		unix: parsePath(path).prefixed,
		windows: false
	};

	if (isWindows)
	{
		winattr.get(path, (error, data) =>
		{
			result.windows = (error!=null) ? false : data.hidden;

			callback(error, result);
		});
	}
	else
	{
		callback(null, result);
	}
};



const statSync = path =>
{
	const result =
	{
		unix: parsePath(path).prefixed,
		windows: false
	};

	if (isWindows)
	{
		result.windows = winattr.getSync(path).hidden;
	}

	return result;
};



const stringifyPath = (pathObj, shouldHavePrefix) =>
{
	let result = "";

	if (pathObj.basename !== "")
	{
		if (shouldHavePrefix && !pathObj.prefixed)
		{
			result = prefix + pathObj.basename;
		}
		else if (!shouldHavePrefix && pathObj.prefixed)
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
};



//::: PUBLIC FUNCTIONS



const hide = (path, callback) =>
{
	const newpath = stringifyPath( parsePath(path), true );

	change(path, newpath, {hidden:true}, callback);
};



const hideSync = path =>
{
	const newpath = stringifyPath( parsePath(path), true );

	return changeSync(path, newpath, {hidden:true});
};



const isDotPrefixed = path =>
{
	return pathlib.basename(path)[0] === prefix;
};



const isHidden = (path, callback) =>
{
	stat(path, (error, data) =>
	{
		if (error == null)
		{
			callback( null, data.unix && ((data.windows && isWindows) || !isWindows) );
		}
		else
		{
			callback(error);
		}
	});
};



const isHiddenSync = (path, callback) =>
{
	const data = statSync(path);

	return data.unix && ((data.windows && isWindows) || !isWindows);
};



const reveal = (path, callback) =>
{
	const newpath = stringifyPath( parsePath(path), false );

	change(path, newpath, {hidden:false}, callback);
};



const revealSync = (path, callback) =>
{
	const newpath = stringifyPath( parsePath(path), false );

	return changeSync(path, newpath, {hidden:false});
};



const shouldBeHidden = (path, callback) =>
{
	stat(path, (error, data) =>
	{
		if (error == null)
		{
			callback( null, data.unix || data.windows );
		}
		else
		{
			callback(error);
		}
	});
};



const shouldBeHiddenSync = (path, callback) =>
{
	const data = statSync(path);

	return data.unix || data.windows;
};



module.exports =
{
	hide,
	hideSync,
	isDotPrefixed,
	isHidden,
	isHiddenSync,
	reveal,
	revealSync,
	shouldBeHidden,
	shouldBeHiddenSync
};
