"use strict";
const fs = require("fs");
const winattr = require("winattr");

const isWindows = process.platform.indexOf("win") === 0;



function newFile(path, attrs)
{
	fs.writeFileSync(path, "");
	setAttrs(path, attrs);
}



function newFolder(path, attrs)
{
	fs.mkdirSync(path);
	setAttrs(path, attrs);
}



function setAttrs(path, attrs)
{
	if (isWindows === true)
	{
		if (attrs!=null && typeof attrs==="object")
		{
			winattr.setSync(path, attrs);
		}
	}
}



module.exports =
{
	newFile: newFile,
	newFolder: newFolder,
	removeFile: fs.unlinkSync,
	removeFolder: fs.rmdirSync,
	
	isWindows: isWindows,
	tempHidden: ".temp",
	tempVisible: "temp"
};
