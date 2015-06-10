"use strict";
var expect = require("chai").expect;
var winattr = require("winattr");

var hidefile = require("../");
var util = require("./util");

var describe_unixOnly    = util.isWindows===false ? describe : describe.skip;
var describe_windowsOnly = util.isWindows===true  ? describe : describe.skip;



describe("", function() {

// AppVeyor (non-pro) is slow
if (util.isWindows===true) this.timeout(10000);



describe("isDotPrefixed()", function()
{
	it("should be true for prefixed dot", function(done)
	{
		expect( hidefile.isDotPrefixed("path/to/.file.ext") ).to.be.true;
		expect( hidefile.isDotPrefixed("path/to/.file") ).to.be.true;
		expect( hidefile.isDotPrefixed(".file.ext") ).to.be.true;
		expect( hidefile.isDotPrefixed(".file") ).to.be.true;
		
		expect( hidefile.isDotPrefixed(".path/to/.file.ext") ).to.be.true;
		expect( hidefile.isDotPrefixed("path/.to/.file.ext") ).to.be.true;
		expect( hidefile.isDotPrefixed("path/to/.file.file.ext") ).to.be.true;
		expect( hidefile.isDotPrefixed("./.file") ).to.be.true;
		done();
	});
	
	it("should be false for missing prefixed dot", function(done)
	{
		expect( hidefile.isDotPrefixed("path/to/file.ext") ).to.be.false;
		expect( hidefile.isDotPrefixed("path/to/file") ).to.be.false;
		expect( hidefile.isDotPrefixed("file.ext") ).to.be.false;
		expect( hidefile.isDotPrefixed("file") ).to.be.false;
		
		expect( hidefile.isDotPrefixed(".path/to/file.ext") ).to.be.false;
		expect( hidefile.isDotPrefixed("path/.to/file.ext") ).to.be.false;
		expect( hidefile.isDotPrefixed("path/to/file.file.ext") ).to.be.false;
		expect( hidefile.isDotPrefixed("./file") ).to.be.false;
		done();
	});
});



describe("isHidden()", function()
{
	describe_unixOnly("on Unix", function()
	{
		it("should be true for prefix-only files", function(done)
		{
			// No need to create file on Unix as it's all string-based
			hidefile.isHidden(util.tempHidden, function(error, result)
			{
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});
		
		it("should be true for prefix-only folders", function(done)
		{
			// No need to create file on Unix as it's all string-based
			hidefile.isHidden(util.tempHidden, function(error, result)
			{
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});
	});
	
	describe_windowsOnly("on Windows", function()
	{
		it("should be false for unprefixed-unattributed files", function(done)
		{
			util.newFile(util.tempVisible);
			
			hidefile.isHidden(util.tempVisible, function(error, result)
			{
				util.removeFile(util.tempVisible);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});
		
		it("should be false for unprefixed-unattributed folders", function(done)
		{
			util.newFolder(util.tempVisible);
			
			hidefile.isHidden(util.tempVisible, function(error, result)
			{
				util.removeFolder(util.tempVisible);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});
		
		it("should be false for prefix-only files", function(done)
		{
			util.newFile(util.tempHidden);
			
			hidefile.isHidden(util.tempHidden, function(error, result)
			{
				util.removeFile(util.tempHidden);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});
		
		it("should be false for prefix-only folders", function(done)
		{
			util.newFolder(util.tempHidden);
			
			hidefile.isHidden(util.tempHidden, function(error, result)
			{
				util.removeFolder(util.tempHidden);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});
		
		it("should be false for attribute-only files", function(done)
		{
			util.newFile(util.tempVisible, {hidden:true});
			
			hidefile.isHidden(util.tempVisible, function(error, result)
			{
				util.removeFile(util.tempVisible);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});
		
		it("should be false for attribute-only folders", function(done)
		{
			util.newFolder(util.tempVisible, {hidden:true});
			
			hidefile.isHidden(util.tempVisible, function(error, result)
			{
				util.removeFolder(util.tempVisible);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});
		
		it("should be true for prefixed-attributed files", function(done)
		{
			util.newFile(util.tempHidden, {hidden:true});
			
			hidefile.isHidden(util.tempHidden, function(error, result)
			{
				util.removeFile(util.tempHidden);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});
		
		it("should be true for prefixed-attributed folders", function(done)
		{
			util.newFolder(util.tempHidden, {hidden:true});
			
			hidefile.isHidden(util.tempHidden, function(error, result)
			{
				util.removeFolder(util.tempHidden);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});
		
		it("should error for non-existent unprefixed paths", function(done)
		{
			hidefile.isHidden("fake", function(error, result)
			{
				expect(error).to.be.instanceOf(Error);
				expect(result).to.be.undefined;
				done();
			});
		});
		
		it("should error for non-existent prefixed paths", function(done)
		{
			hidefile.isHidden(".fake", function(error, result)
			{
				expect(error).to.be.instanceOf(Error);
				expect(result).to.be.undefined;
				done();
			});
		});
	});
});



describe("isHiddenSync()", function()
{
	describe_unixOnly("on Unix", function()
	{
		it("should be true for prefix-only files", function(done)
		{
			// No need to create file on Unix as it's all string-based
			var result = hidefile.isHiddenSync(util.tempHidden);
			
			expect(result).to.be.true;
			done();
		});
		
		it("should be true for prefix-only folders", function(done)
		{
			// No need to create file on Unix as it's all string-based
			var result = hidefile.isHiddenSync(util.tempHidden);
			
			expect(result).to.be.true;
			done();
		});
	});
	
	describe_windowsOnly("on Windows", function()
	{
		it("should be false for unprefixed-unattributed files", function(done)
		{
			util.newFile(util.tempVisible);
			
			var result = hidefile.isHiddenSync(util.tempVisible);
			
			util.removeFile(util.tempVisible);
			expect(result).to.be.false;
			done();
		});
		
		it("should be false for unprefixed-unattributed folders", function(done)
		{
			util.newFolder(util.tempVisible);
			
			var result = hidefile.isHiddenSync(util.tempVisible);
			
			util.removeFolder(util.tempVisible);
			expect(result).to.be.false;
			done();
		});
		
		it("should be false for prefix-only files", function(done)
		{
			util.newFile(util.tempHidden);
			
			var result = hidefile.isHiddenSync(util.tempHidden);
			
			util.removeFile(util.tempHidden);
			expect(result).to.be.false;
			done();
		});
		
		it("should be false for prefix-only folders", function(done)
		{
			util.newFolder(util.tempHidden);
			
			var result = hidefile.isHiddenSync(util.tempHidden);
			
			util.removeFolder(util.tempHidden);
			expect(result).to.be.false;
			done();
		});
		
		it("should be false for attribute-only files", function(done)
		{
			util.newFile(util.tempVisible, {hidden:true});
			
			var result = hidefile.isHiddenSync(util.tempVisible);
			
			util.removeFile(util.tempVisible);
			expect(result).to.be.false;
			done();
		});
		
		it("should be false for attribute-only folders", function(done)
		{
			util.newFolder(util.tempVisible, {hidden:true});
			
			var result = hidefile.isHiddenSync(util.tempVisible);
			
			util.removeFolder(util.tempVisible);
			expect(result).to.be.false;
			done();
		});
		
		it("should be true for prefixed-attributed files", function(done)
		{
			util.newFile(util.tempHidden, {hidden:true});
			
			var result = hidefile.isHiddenSync(util.tempHidden);
			
			util.removeFile(util.tempHidden);
			expect(result).to.be.true;
			done();
		});
		
		it("should be true for prefixed-attributed folders", function(done)
		{
			util.newFolder(util.tempHidden, {hidden:true});
			
			var result = hidefile.isHiddenSync(util.tempHidden);
			
			util.removeFolder(util.tempHidden);
			expect(result).to.be.true;
			done();
		});
		
		it("should error for non-existent unprefixed paths", function(done)
		{
			var error,result;
			
			try
			{
				result = hidefile.isHiddenSync("fake");
			}
			catch (e)
			{
				error = e;
			}
			
			expect(error).to.be.instanceOf(Error);
			expect(result).to.be.undefined;
			done();
		});
		
		it("should error for non-existent prefixed paths", function(done)
		{
			var error,result;
			
			try
			{
				result = hidefile.isHiddenSync(".fake");
			}
			catch (e)
			{
				error = e;
			}
			
			expect(error).to.be.instanceOf(Error);
			expect(result).to.be.undefined;
			done();
		});
	});
});



describe("shouldBeHidden()", function()
{
	it("should be false for unprefixed-unattributed files", function(done)
	{
		util.newFile(util.tempVisible);
		
		hidefile.shouldBeHidden(util.tempVisible, function(error, result)
		{
			util.removeFile(util.tempVisible);
			expect(error).to.be.null;
			expect(result).to.be.false;
			done();
		});
	});
	
	it("should be false for unprefixed-unattributed folders", function(done)
	{
		util.newFolder(util.tempVisible);
		
		hidefile.shouldBeHidden(util.tempVisible, function(error, result)
		{
			util.removeFolder(util.tempVisible);
			expect(error).to.be.null;
			expect(result).to.be.false;
			done();
		});
	});
	
	it("should be true for prefix-only files", function(done)
	{
		util.newFile(util.tempHidden);
		
		hidefile.shouldBeHidden(util.tempHidden, function(error, result)
		{
			util.removeFile(util.tempHidden);
			expect(error).to.be.null;
			expect(result).to.be.true;
			done();
		});
	});
	
	it("should be true for prefix-only folders", function(done)
	{
		util.newFolder(util.tempHidden);
		
		hidefile.shouldBeHidden(util.tempHidden, function(error, result)
		{
			util.removeFolder(util.tempHidden);
			expect(error).to.be.null;
			expect(result).to.be.true;
			done();
		});
	});
	
	describe_windowsOnly("on Windows", function()
	{
		it("should be true for attribute-only files", function(done)
		{
			util.newFile(util.tempVisible, {hidden:true});
			
			hidefile.shouldBeHidden(util.tempVisible, function(error, result)
			{
				util.removeFile(util.tempVisible);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});
		
		it("should be true for attribute-only folders", function(done)
		{
			util.newFolder(util.tempVisible, {hidden:true});
			
			hidefile.shouldBeHidden(util.tempVisible, function(error, result)
			{
				util.removeFolder(util.tempVisible);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});
		
		it("should be true for prefixed-attributed files", function(done)
		{
			util.newFile(util.tempHidden, {hidden:true});
			
			hidefile.shouldBeHidden(util.tempHidden, function(error, result)
			{
				util.removeFile(util.tempHidden);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});
		
		it("should be true for prefixed-attributed folders", function(done)
		{
			util.newFolder(util.tempHidden, {hidden:true});
			
			hidefile.shouldBeHidden(util.tempHidden, function(error, result)
			{
				util.removeFolder(util.tempHidden);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});
		
		it("should error for non-existent unprefixed paths", function(done)
		{
			hidefile.shouldBeHidden("fake", function(error, result)
			{
				expect(error).to.be.instanceOf(Error);
				expect(result).to.be.undefined;
				done();
			});
		});
		
		it("should error for non-existent prefixed paths", function(done)
		{
			hidefile.shouldBeHidden(".fake", function(error, result)
			{
				expect(error).to.be.instanceOf(Error);
				expect(result).to.be.undefined;
				done();
			});
		});
	});
});



describe("shouldBeHiddenSync()", function()
{
	it("should be false for unprefixed-unattributed files", function(done)
	{
		util.newFile(util.tempVisible);
		
		var result = hidefile.shouldBeHiddenSync(util.tempVisible);
		
		util.removeFile(util.tempVisible);
		expect(result).to.be.false;
		done();
	});
	
	it("should be false for unprefixed-unattributed folders", function(done)
	{
		util.newFolder(util.tempVisible);
		
		var result = hidefile.shouldBeHiddenSync(util.tempVisible);
		
		util.removeFolder(util.tempVisible);
		expect(result).to.be.false;
		done();
	});
	
	it("should be true for prefix-only files", function(done)
	{
		util.newFile(util.tempHidden);
		
		var result = hidefile.shouldBeHiddenSync(util.tempHidden);
		
		util.removeFile(util.tempHidden);
		expect(result).to.be.true;
		done();
	});
	
	it("should be true for prefix-only folders", function(done)
	{
		util.newFolder(util.tempHidden);
		
		var result = hidefile.shouldBeHiddenSync(util.tempHidden);
		
		util.removeFolder(util.tempHidden);
		expect(result).to.be.true;
		done();
	});
	
	describe_windowsOnly("on Windows", function()
	{
		it("should be true for attribute-only files", function(done)
		{
			util.newFile(util.tempVisible, {hidden:true});
			
			var result = hidefile.shouldBeHiddenSync(util.tempVisible);
			
			util.removeFile(util.tempVisible);
			expect(result).to.be.true;
			done();
		});
		
		it("should be true for attribute-only folders", function(done)
		{
			util.newFolder(util.tempVisible, {hidden:true});
			
			var result = hidefile.shouldBeHiddenSync(util.tempVisible);
			
			util.removeFolder(util.tempVisible);
			expect(result).to.be.true;
			done();
		});
		
		it("should be true for prefixed-attributed files", function(done)
		{
			util.newFile(util.tempHidden, {hidden:true});
			
			var result = hidefile.shouldBeHiddenSync(util.tempHidden);
			
			util.removeFile(util.tempHidden);
			expect(result).to.be.true;
			done();
		});
		
		it("should be true for prefixed-attributed folders", function(done)
		{
			util.newFolder(util.tempHidden, {hidden:true});
			
			var result = hidefile.shouldBeHiddenSync(util.tempHidden);
			
			util.removeFolder(util.tempHidden);
			expect(result).to.be.true;
			done();
		});
		
		it("should error for non-existent unprefixed paths", function(done)
		{
			var error,result;
			
			try
			{
				result = hidefile.shouldBeHiddenSync("fake");
			}
			catch (e)
			{
				error = e;
			}
			
			expect(error).to.be.instanceOf(Error);
			expect(result).to.be.undefined;
			done();
		});
		
		it("should error for non-existent prefixed paths", function(done)
		{
			var error,result;
			
			try
			{
				result = hidefile.shouldBeHiddenSync(".fake");
			}
			catch (e)
			{
				error = e;
			}
			
			expect(error).to.be.instanceOf(Error);
			expect(result).to.be.undefined;
			done();
		});
	});
});



describe("hide()", function()
{
	it("should work on unprefixed-unattributed files", function(done)
	{
		util.newFile(util.tempVisible);
		
		hidefile.hide(util.tempVisible, function(error, newpath)
		{
			var result = hidefile.isHiddenSync(newpath);
			
			util.removeFile(newpath);
			expect(error).to.be.null;
			expect(result).to.be.true;
			done();
		});
	});
	
	it("should work on unprefixed-unattributed folders", function(done)
	{
		util.newFolder(util.tempVisible);
		
		hidefile.hide(util.tempVisible, function(error, newpath)
		{
			var result = hidefile.isHiddenSync(newpath);
			
			util.removeFolder(newpath);
			expect(error).to.be.null;
			expect(result).to.be.true;
			done();
		});
	});
	
	it("should work on prefix-only files", function(done)
	{
		util.newFile(util.tempHidden);
		
		hidefile.hide(util.tempHidden, function(error, newpath)
		{
			var result = hidefile.isHiddenSync(util.tempHidden);
			
			util.removeFile(util.tempHidden);
			expect(error).to.be.null;
			expect(result).to.be.true;
			done();
		});
	});
	
	it("should work on prefix-only folders", function(done)
	{
		util.newFolder(util.tempHidden);
		
		hidefile.hide(util.tempHidden, function(error, newpath)
		{
			var result = hidefile.isHiddenSync(util.tempHidden);
			
			util.removeFolder(util.tempHidden);
			expect(error).to.be.null;
			expect(result).to.be.true;
			done();
		});
	});
	
	it("should error for non-existent unprefixed paths", function(done)
	{
		hidefile.hide("fake", function(error, newpath)
		{
			expect(error).to.be.instanceOf(Error);
			expect(newpath).to.be.undefined;
			done();
		});
	});
	
	it("should error for non-existent prefixed paths", function(done)
	{
		hidefile.hide(".fake", function(error, newpath)
		{
			expect(error).to.be.instanceOf(Error);
			expect(newpath).to.be.undefined;
			done();
		});
	});
	
	describe_windowsOnly("on Windows", function()
	{
		it("should work on attribute-only files", function(done)
		{
			util.newFile(util.tempVisible, {hidden:true});
			
			hidefile.hide(util.tempVisible, function(error, newpath)
			{
				var result = hidefile.isHiddenSync(newpath);
				
				util.removeFile(newpath);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});
		
		it("should work on attribute-only folders", function(done)
		{
			util.newFolder(util.tempVisible, {hidden:true});
			
			hidefile.hide(util.tempVisible, function(error, newpath)
			{
				var result = hidefile.isHiddenSync(newpath);
				
				util.removeFolder(newpath);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});
		
		it("should work on prefixed-attributed files", function(done)
		{
			util.newFile(util.tempHidden, {hidden:true});
			
			hidefile.hide(util.tempHidden, function(error, newpath)
			{
				var result = hidefile.isHiddenSync(util.tempHidden);
				
				util.removeFile(util.tempHidden);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});
		
		it("should work on prefixed-attributed folders", function(done)
		{
			util.newFolder(util.tempHidden, {hidden:true});
			
			hidefile.hide(util.tempHidden, function(error, newpath)
			{
				var result = hidefile.isHiddenSync(util.tempHidden);
				
				util.removeFolder(util.tempHidden);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});
	});
});



describe("hideSync()", function()
{
	it("should work on unprefixed-unattributed files", function(done)
	{
		util.newFile(util.tempVisible);
		
		var newpath = hidefile.hideSync(util.tempVisible);
		var result = hidefile.isHiddenSync(newpath);
		
		util.removeFile(newpath);
		expect(result).to.be.true;
		done();
	});
	
	it("should work on unprefixed-unattributed folders", function(done)
	{
		util.newFolder(util.tempVisible);
		
		var newpath = hidefile.hideSync(util.tempVisible);
		var result = hidefile.isHiddenSync(newpath);
		
		util.removeFolder(newpath);
		expect(result).to.be.true;
		done();
	});
	
	it("should work on prefix-only files", function(done)
	{
		util.newFile(util.tempHidden);
		
		var newpath = hidefile.hideSync(util.tempHidden);
		var result = hidefile.isHiddenSync(util.tempHidden);
		
		util.removeFile(util.tempHidden);
		expect(result).to.be.true;
		done();
	});
	
	it("should work on prefix-only folders", function(done)
	{
		util.newFolder(util.tempHidden);
		
		var newpath = hidefile.hideSync(util.tempHidden);
		var result = hidefile.isHiddenSync(util.tempHidden);
		
		util.removeFolder(util.tempHidden);
		expect(result).to.be.true;
		done();
	});
	
	it("should error for non-existent unprefixed paths", function(done)
	{
		var error,newpath;
		
		try
		{
			newpath = hidefile.hideSync("fake");
		}
		catch (e)
		{
			error = e;
		}
		
		expect(error).to.be.instanceOf(Error);
		expect(newpath).to.be.undefined;
		done();
	});
	
	it("should error for non-existent prefixed paths", function(done)
	{
		var error,newpath;
		
		try
		{
			newpath = hidefile.hideSync(".fake");
		}
		catch (e)
		{
			error = e;
		}
		
		expect(error).to.be.instanceOf(Error);
		expect(newpath).to.be.undefined;
		done();
	});
	
	describe_windowsOnly("on Windows", function()
	{
		it("should work on attribute-only files", function(done)
		{
			util.newFile(util.tempVisible, {hidden:true});
			
			var newpath = hidefile.hideSync(util.tempVisible);
			var result = hidefile.isHiddenSync(newpath);
			
			util.removeFile(newpath);
			expect(result).to.be.true;
			done();
		});
		
		it("should work on attribute-only folders", function(done)
		{
			util.newFolder(util.tempVisible, {hidden:true});
			
			var newpath = hidefile.hideSync(util.tempVisible);
			var result = hidefile.isHiddenSync(newpath);
			
			util.removeFolder(newpath);
			expect(result).to.be.true;
			done();
		});
		
		it("should work on prefixed-attributed files", function(done)
		{
			util.newFile(util.tempHidden, {hidden:true});
			
			var newpath = hidefile.hideSync(util.tempHidden);
			var result = hidefile.isHiddenSync(util.tempHidden);
			
			util.removeFile(util.tempHidden);
			expect(result).to.be.true;
			done();
		});
		
		it("should work on prefixed-attributed folders", function(done)
		{
			util.newFolder(util.tempHidden, {hidden:true});
			
			var newpath = hidefile.hideSync(util.tempHidden);
			var result = hidefile.isHiddenSync(util.tempHidden);
			
			util.removeFolder(util.tempHidden);
			expect(result).to.be.true;
			done();
		});
	});
});



describe("reveal()", function()
{
	it("should work on unprefixed-unattributed files", function(done)
	{
		util.newFile(util.tempVisible);
		
		hidefile.reveal(util.tempVisible, function(error, newpath)
		{
			var result = hidefile.isHiddenSync(util.tempVisible);
			
			util.removeFile(util.tempVisible);
			expect(error).to.be.null;
			expect(result).to.be.false;
			done();
		});
	});
	
	it("should work on unprefixed-unattributed folders", function(done)
	{
		util.newFolder(util.tempVisible);
		
		hidefile.reveal(util.tempVisible, function(error, newpath)
		{
			var result = hidefile.isHiddenSync(util.tempVisible);
			
			util.removeFolder(util.tempVisible);
			expect(error).to.be.null;
			expect(result).to.be.false;
			done();
		});
	});
	
	it("should work on prefix-only files", function(done)
	{
		util.newFile(util.tempHidden);
		
		hidefile.reveal(util.tempHidden, function(error, newpath)
		{
			var result = hidefile.isHiddenSync(newpath);
			
			util.removeFile(newpath);
			expect(error).to.be.null;
			expect(result).to.be.false;
			done();
		});
	});
	
	it("should work on prefix-only folders", function(done)
	{
		util.newFolder(util.tempHidden);
		
		hidefile.reveal(util.tempHidden, function(error, newpath)
		{
			var result = hidefile.isHiddenSync(newpath);
			
			util.removeFolder(newpath);
			expect(error).to.be.null;
			expect(result).to.be.false;
			done();
		});
	});
	
	it("should error for non-existent unprefixed paths", function(done)
	{
		hidefile.reveal("fake", function(error, newpath)
		{
			expect(error).to.be.instanceOf(Error);
			expect(newpath).to.be.undefined;
			done();
		});
	});
	
	it("should error for non-existent prefixed paths", function(done)
	{
		hidefile.reveal(".fake", function(error, newpath)
		{
			expect(error).to.be.instanceOf(Error);
			expect(newpath).to.be.undefined;
			done();
		});
	});
	
	describe_windowsOnly("on Windows", function()
	{
		it("should work on attribute-only files", function(done)
		{
			util.newFile(util.tempVisible, {hidden:true});
			
			hidefile.reveal(util.tempVisible, function(error, newpath)
			{
				var result = hidefile.isHiddenSync(util.tempVisible);
				
				util.removeFile(util.tempVisible);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});
		
		it("should work on attribute-only folders", function(done)
		{
			util.newFolder(util.tempVisible, {hidden:true});
			
			hidefile.reveal(util.tempVisible, function(error, newpath)
			{
				var result = hidefile.isHiddenSync(util.tempVisible);
				
				util.removeFolder(util.tempVisible);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});
		
		it("should work on prefixed-attributed files", function(done)
		{
			util.newFile(util.tempHidden, {hidden:true});
			
			hidefile.reveal(util.tempHidden, function(error, newpath)
			{
				var result = hidefile.isHiddenSync(newpath);
				
				util.removeFile(newpath);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});
		
		it("should work on prefixed-attributed folders", function(done)
		{
			util.newFolder(util.tempHidden, {hidden:true});
			
			hidefile.reveal(util.tempHidden, function(error, newpath)
			{
				var result = hidefile.isHiddenSync(newpath);
				
				util.removeFolder(newpath);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});
	});
});



describe("revealSync()", function()
{
	it("should work on unprefixed-unattributed files", function(done)
	{
		util.newFile(util.tempVisible);
		
		var newpath = hidefile.revealSync(util.tempVisible);
		var result = hidefile.isHiddenSync(util.tempVisible);
		
		util.removeFile(util.tempVisible);
		expect(result).to.be.false;
		done();
	});
	
	it("should work on unprefixed-unattributed folders", function(done)
	{
		util.newFolder(util.tempVisible);
		
		var newpath = hidefile.revealSync(util.tempVisible);
		var result = hidefile.isHiddenSync(util.tempVisible);
		
		util.removeFolder(util.tempVisible);
		expect(result).to.be.false;
		done();
	});
	
	it("should work on prefix-only files", function(done)
	{
		util.newFile(util.tempHidden);
		
		var newpath = hidefile.revealSync(util.tempHidden);
		var result = hidefile.isHiddenSync(newpath);
		
		util.removeFile(newpath);
		expect(result).to.be.false;
		done();
	});
	
	it("should work on prefix-only folders", function(done)
	{
		util.newFolder(util.tempHidden);
		
		var newpath = hidefile.revealSync(util.tempHidden);
		var result = hidefile.isHiddenSync(newpath);
		
		util.removeFolder(newpath);
		expect(result).to.be.false;
		done();
	});
	
	it("should error for non-existent unprefixed paths", function(done)
	{
		var error,newpath;
		
		try
		{
			newpath = hidefile.revealSync("fake");
		}
		catch (e)
		{
			error = e;
		}
		
		expect(error).to.be.instanceOf(Error);
		expect(newpath).to.be.undefined;
		done();
	});
	
	it("should error for non-existent prefixed paths", function(done)
	{
		var error,newpath;
		
		try
		{
			newpath = hidefile.revealSync(".fake");
		}
		catch (e)
		{
			error = e;
		}
		
		expect(error).to.be.instanceOf(Error);
		expect(newpath).to.be.undefined;
		done();
	});
	
	describe_windowsOnly("on Windows", function()
	{
		it("should work on attribute-only files", function(done)
		{
			util.newFile(util.tempVisible, {hidden:true});
			
			var newpath = hidefile.revealSync(util.tempVisible);
			var result = hidefile.isHiddenSync(util.tempVisible);
			
			util.removeFile(util.tempVisible);
			expect(result).to.be.false;
			done();
		});
		
		it("should work on attribute-only folders", function(done)
		{
			util.newFolder(util.tempVisible, {hidden:true});
			
			var newpath = hidefile.revealSync(util.tempVisible);
			var result = hidefile.isHiddenSync(util.tempVisible);
			
			util.removeFolder(util.tempVisible);
			expect(result).to.be.false;
			done();
		});
		
		it("should work on prefixed-attributed files", function(done)
		{
			util.newFile(util.tempHidden, {hidden:true});
			
			var newpath = hidefile.revealSync(util.tempHidden);
			var result = hidefile.isHiddenSync(newpath);
			
			util.removeFile(newpath);
			expect(result).to.be.false;
			done();
		});
		
		it("should work on prefixed-attributed folders", function(done)
		{
			util.newFolder(util.tempHidden, {hidden:true});
			
			var newpath = hidefile.revealSync(util.tempHidden);
			var result = hidefile.isHiddenSync(newpath);
			
			util.removeFolder(newpath);
			expect(result).to.be.false;
			done();
		});
	});
});



});
