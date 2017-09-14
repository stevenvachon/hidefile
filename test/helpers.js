"use strict";
const fs = require("fs");
const winattr = require("winattr");

const isWindows = process.platform.startsWith("win");



const newFile = (path, attrs) =>
{
	fs.writeFileSync(path, "");
	setAttrs(path, attrs);
};



const newFolder = (path, attrs) =>
{
	fs.mkdirSync(path);
	setAttrs(path, attrs);
};



const setAttrs = (path, attrs) =>
{
	if (isWindows)
	{
		if (attrs!=null && typeof attrs==="object")
		{
			winattr.setSync(path, attrs);
		}
	}
};



module.exports =
{
	isWindows,
	newFile,
	newFolder,
	removeFile: fs.unlinkSync,
	removeFolder: fs.rmdirSync,
	TEMP_HIDDEN: ".temp",
	TEMP_VISIBLE: "temp"
};
