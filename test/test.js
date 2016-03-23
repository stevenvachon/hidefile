"use strict";
const expect = require("chai").expect;
const winattr = require("winattr");

const helpers = require("./helpers");
const hidefile = require("../");

const describe_unixOnly    = helpers.isWindows===false ? describe : describe.skip;
const describe_windowsOnly = helpers.isWindows===true  ? describe : describe.skip;



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
			hidefile.isHidden(helpers.tempHidden, function(error, result)
			{
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});
		
		it("should be true for prefix-only folders", function(done)
		{
			// No need to create file on Unix as it's all string-based
			hidefile.isHidden(helpers.tempHidden, function(error, result)
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
			helpers.newFile(helpers.tempVisible);
			
			hidefile.isHidden(helpers.tempVisible, function(error, result)
			{
				helpers.removeFile(helpers.tempVisible);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});
		
		it("should be false for unprefixed-unattributed folders", function(done)
		{
			helpers.newFolder(helpers.tempVisible);
			
			hidefile.isHidden(helpers.tempVisible, function(error, result)
			{
				helpers.removeFolder(helpers.tempVisible);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});
		
		it("should be false for prefix-only files", function(done)
		{
			helpers.newFile(helpers.tempHidden);
			
			hidefile.isHidden(helpers.tempHidden, function(error, result)
			{
				helpers.removeFile(helpers.tempHidden);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});
		
		it("should be false for prefix-only folders", function(done)
		{
			helpers.newFolder(helpers.tempHidden);
			
			hidefile.isHidden(helpers.tempHidden, function(error, result)
			{
				helpers.removeFolder(helpers.tempHidden);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});
		
		it("should be false for attribute-only files", function(done)
		{
			helpers.newFile(helpers.tempVisible, {hidden:true});
			
			hidefile.isHidden(helpers.tempVisible, function(error, result)
			{
				helpers.removeFile(helpers.tempVisible);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});
		
		it("should be false for attribute-only folders", function(done)
		{
			helpers.newFolder(helpers.tempVisible, {hidden:true});
			
			hidefile.isHidden(helpers.tempVisible, function(error, result)
			{
				helpers.removeFolder(helpers.tempVisible);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});
		
		it("should be true for prefixed-attributed files", function(done)
		{
			helpers.newFile(helpers.tempHidden, {hidden:true});
			
			hidefile.isHidden(helpers.tempHidden, function(error, result)
			{
				helpers.removeFile(helpers.tempHidden);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});
		
		it("should be true for prefixed-attributed folders", function(done)
		{
			helpers.newFolder(helpers.tempHidden, {hidden:true});
			
			hidefile.isHidden(helpers.tempHidden, function(error, result)
			{
				helpers.removeFolder(helpers.tempHidden);
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
			const result = hidefile.isHiddenSync(helpers.tempHidden);
			
			expect(result).to.be.true;
			done();
		});
		
		it("should be true for prefix-only folders", function(done)
		{
			// No need to create file on Unix as it's all string-based
			const result = hidefile.isHiddenSync(helpers.tempHidden);
			
			expect(result).to.be.true;
			done();
		});
	});
	
	describe_windowsOnly("on Windows", function()
	{
		it("should be false for unprefixed-unattributed files", function(done)
		{
			helpers.newFile(helpers.tempVisible);
			
			const result = hidefile.isHiddenSync(helpers.tempVisible);
			
			helpers.removeFile(helpers.tempVisible);
			expect(result).to.be.false;
			done();
		});
		
		it("should be false for unprefixed-unattributed folders", function(done)
		{
			helpers.newFolder(helpers.tempVisible);
			
			const result = hidefile.isHiddenSync(helpers.tempVisible);
			
			helpers.removeFolder(helpers.tempVisible);
			expect(result).to.be.false;
			done();
		});
		
		it("should be false for prefix-only files", function(done)
		{
			helpers.newFile(helpers.tempHidden);
			
			const result = hidefile.isHiddenSync(helpers.tempHidden);
			
			helpers.removeFile(helpers.tempHidden);
			expect(result).to.be.false;
			done();
		});
		
		it("should be false for prefix-only folders", function(done)
		{
			helpers.newFolder(helpers.tempHidden);
			
			const result = hidefile.isHiddenSync(helpers.tempHidden);
			
			helpers.removeFolder(helpers.tempHidden);
			expect(result).to.be.false;
			done();
		});
		
		it("should be false for attribute-only files", function(done)
		{
			helpers.newFile(helpers.tempVisible, {hidden:true});
			
			const result = hidefile.isHiddenSync(helpers.tempVisible);
			
			helpers.removeFile(helpers.tempVisible);
			expect(result).to.be.false;
			done();
		});
		
		it("should be false for attribute-only folders", function(done)
		{
			helpers.newFolder(helpers.tempVisible, {hidden:true});
			
			const result = hidefile.isHiddenSync(helpers.tempVisible);
			
			helpers.removeFolder(helpers.tempVisible);
			expect(result).to.be.false;
			done();
		});
		
		it("should be true for prefixed-attributed files", function(done)
		{
			helpers.newFile(helpers.tempHidden, {hidden:true});
			
			const result = hidefile.isHiddenSync(helpers.tempHidden);
			
			helpers.removeFile(helpers.tempHidden);
			expect(result).to.be.true;
			done();
		});
		
		it("should be true for prefixed-attributed folders", function(done)
		{
			helpers.newFolder(helpers.tempHidden, {hidden:true});
			
			const result = hidefile.isHiddenSync(helpers.tempHidden);
			
			helpers.removeFolder(helpers.tempHidden);
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
		helpers.newFile(helpers.tempVisible);
		
		hidefile.shouldBeHidden(helpers.tempVisible, function(error, result)
		{
			helpers.removeFile(helpers.tempVisible);
			expect(error).to.be.null;
			expect(result).to.be.false;
			done();
		});
	});
	
	it("should be false for unprefixed-unattributed folders", function(done)
	{
		helpers.newFolder(helpers.tempVisible);
		
		hidefile.shouldBeHidden(helpers.tempVisible, function(error, result)
		{
			helpers.removeFolder(helpers.tempVisible);
			expect(error).to.be.null;
			expect(result).to.be.false;
			done();
		});
	});
	
	it("should be true for prefix-only files", function(done)
	{
		helpers.newFile(helpers.tempHidden);
		
		hidefile.shouldBeHidden(helpers.tempHidden, function(error, result)
		{
			helpers.removeFile(helpers.tempHidden);
			expect(error).to.be.null;
			expect(result).to.be.true;
			done();
		});
	});
	
	it("should be true for prefix-only folders", function(done)
	{
		helpers.newFolder(helpers.tempHidden);
		
		hidefile.shouldBeHidden(helpers.tempHidden, function(error, result)
		{
			helpers.removeFolder(helpers.tempHidden);
			expect(error).to.be.null;
			expect(result).to.be.true;
			done();
		});
	});
	
	describe_windowsOnly("on Windows", function()
	{
		it("should be true for attribute-only files", function(done)
		{
			helpers.newFile(helpers.tempVisible, {hidden:true});
			
			hidefile.shouldBeHidden(helpers.tempVisible, function(error, result)
			{
				helpers.removeFile(helpers.tempVisible);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});
		
		it("should be true for attribute-only folders", function(done)
		{
			helpers.newFolder(helpers.tempVisible, {hidden:true});
			
			hidefile.shouldBeHidden(helpers.tempVisible, function(error, result)
			{
				helpers.removeFolder(helpers.tempVisible);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});
		
		it("should be true for prefixed-attributed files", function(done)
		{
			helpers.newFile(helpers.tempHidden, {hidden:true});
			
			hidefile.shouldBeHidden(helpers.tempHidden, function(error, result)
			{
				helpers.removeFile(helpers.tempHidden);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});
		
		it("should be true for prefixed-attributed folders", function(done)
		{
			helpers.newFolder(helpers.tempHidden, {hidden:true});
			
			hidefile.shouldBeHidden(helpers.tempHidden, function(error, result)
			{
				helpers.removeFolder(helpers.tempHidden);
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
		helpers.newFile(helpers.tempVisible);
		
		const result = hidefile.shouldBeHiddenSync(helpers.tempVisible);
		
		helpers.removeFile(helpers.tempVisible);
		expect(result).to.be.false;
		done();
	});
	
	it("should be false for unprefixed-unattributed folders", function(done)
	{
		helpers.newFolder(helpers.tempVisible);
		
		const result = hidefile.shouldBeHiddenSync(helpers.tempVisible);
		
		helpers.removeFolder(helpers.tempVisible);
		expect(result).to.be.false;
		done();
	});
	
	it("should be true for prefix-only files", function(done)
	{
		helpers.newFile(helpers.tempHidden);
		
		const result = hidefile.shouldBeHiddenSync(helpers.tempHidden);
		
		helpers.removeFile(helpers.tempHidden);
		expect(result).to.be.true;
		done();
	});
	
	it("should be true for prefix-only folders", function(done)
	{
		helpers.newFolder(helpers.tempHidden);
		
		const result = hidefile.shouldBeHiddenSync(helpers.tempHidden);
		
		helpers.removeFolder(helpers.tempHidden);
		expect(result).to.be.true;
		done();
	});
	
	describe_windowsOnly("on Windows", function()
	{
		it("should be true for attribute-only files", function(done)
		{
			helpers.newFile(helpers.tempVisible, {hidden:true});
			
			const result = hidefile.shouldBeHiddenSync(helpers.tempVisible);
			
			helpers.removeFile(helpers.tempVisible);
			expect(result).to.be.true;
			done();
		});
		
		it("should be true for attribute-only folders", function(done)
		{
			helpers.newFolder(helpers.tempVisible, {hidden:true});
			
			const result = hidefile.shouldBeHiddenSync(helpers.tempVisible);
			
			helpers.removeFolder(helpers.tempVisible);
			expect(result).to.be.true;
			done();
		});
		
		it("should be true for prefixed-attributed files", function(done)
		{
			helpers.newFile(helpers.tempHidden, {hidden:true});
			
			const result = hidefile.shouldBeHiddenSync(helpers.tempHidden);
			
			helpers.removeFile(helpers.tempHidden);
			expect(result).to.be.true;
			done();
		});
		
		it("should be true for prefixed-attributed folders", function(done)
		{
			helpers.newFolder(helpers.tempHidden, {hidden:true});
			
			const result = hidefile.shouldBeHiddenSync(helpers.tempHidden);
			
			helpers.removeFolder(helpers.tempHidden);
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
		helpers.newFile(helpers.tempVisible);
		
		hidefile.hide(helpers.tempVisible, function(error, newpath)
		{
			const result = hidefile.isHiddenSync(newpath);
			
			helpers.removeFile(newpath);
			expect(error).to.be.null;
			expect(result).to.be.true;
			done();
		});
	});
	
	it("should work on unprefixed-unattributed folders", function(done)
	{
		helpers.newFolder(helpers.tempVisible);
		
		hidefile.hide(helpers.tempVisible, function(error, newpath)
		{
			const result = hidefile.isHiddenSync(newpath);
			
			helpers.removeFolder(newpath);
			expect(error).to.be.null;
			expect(result).to.be.true;
			done();
		});
	});
	
	it("should work on prefix-only files", function(done)
	{
		helpers.newFile(helpers.tempHidden);
		
		hidefile.hide(helpers.tempHidden, function(error, newpath)
		{
			const result = hidefile.isHiddenSync(helpers.tempHidden);
			
			helpers.removeFile(helpers.tempHidden);
			expect(error).to.be.null;
			expect(result).to.be.true;
			done();
		});
	});
	
	it("should work on prefix-only folders", function(done)
	{
		helpers.newFolder(helpers.tempHidden);
		
		hidefile.hide(helpers.tempHidden, function(error, newpath)
		{
			const result = hidefile.isHiddenSync(helpers.tempHidden);
			
			helpers.removeFolder(helpers.tempHidden);
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
			helpers.newFile(helpers.tempVisible, {hidden:true});
			
			hidefile.hide(helpers.tempVisible, function(error, newpath)
			{
				const result = hidefile.isHiddenSync(newpath);
				
				helpers.removeFile(newpath);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});
		
		it("should work on attribute-only folders", function(done)
		{
			helpers.newFolder(helpers.tempVisible, {hidden:true});
			
			hidefile.hide(helpers.tempVisible, function(error, newpath)
			{
				const result = hidefile.isHiddenSync(newpath);
				
				helpers.removeFolder(newpath);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});
		
		it("should work on prefixed-attributed files", function(done)
		{
			helpers.newFile(helpers.tempHidden, {hidden:true});
			
			hidefile.hide(helpers.tempHidden, function(error, newpath)
			{
				const result = hidefile.isHiddenSync(helpers.tempHidden);
				
				helpers.removeFile(helpers.tempHidden);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});
		
		it("should work on prefixed-attributed folders", function(done)
		{
			helpers.newFolder(helpers.tempHidden, {hidden:true});
			
			hidefile.hide(helpers.tempHidden, function(error, newpath)
			{
				const result = hidefile.isHiddenSync(helpers.tempHidden);
				
				helpers.removeFolder(helpers.tempHidden);
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
		helpers.newFile(helpers.tempVisible);
		
		const newpath = hidefile.hideSync(helpers.tempVisible);
		const result = hidefile.isHiddenSync(newpath);
		
		helpers.removeFile(newpath);
		expect(result).to.be.true;
		done();
	});
	
	it("should work on unprefixed-unattributed folders", function(done)
	{
		helpers.newFolder(helpers.tempVisible);
		
		const newpath = hidefile.hideSync(helpers.tempVisible);
		const result = hidefile.isHiddenSync(newpath);
		
		helpers.removeFolder(newpath);
		expect(result).to.be.true;
		done();
	});
	
	it("should work on prefix-only files", function(done)
	{
		helpers.newFile(helpers.tempHidden);
		
		const newpath = hidefile.hideSync(helpers.tempHidden);
		const result = hidefile.isHiddenSync(helpers.tempHidden);
		
		helpers.removeFile(helpers.tempHidden);
		expect(result).to.be.true;
		done();
	});
	
	it("should work on prefix-only folders", function(done)
	{
		helpers.newFolder(helpers.tempHidden);
		
		const newpath = hidefile.hideSync(helpers.tempHidden);
		const result = hidefile.isHiddenSync(helpers.tempHidden);
		
		helpers.removeFolder(helpers.tempHidden);
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
			helpers.newFile(helpers.tempVisible, {hidden:true});
			
			const newpath = hidefile.hideSync(helpers.tempVisible);
			const result = hidefile.isHiddenSync(newpath);
			
			helpers.removeFile(newpath);
			expect(result).to.be.true;
			done();
		});
		
		it("should work on attribute-only folders", function(done)
		{
			helpers.newFolder(helpers.tempVisible, {hidden:true});
			
			const newpath = hidefile.hideSync(helpers.tempVisible);
			const result = hidefile.isHiddenSync(newpath);
			
			helpers.removeFolder(newpath);
			expect(result).to.be.true;
			done();
		});
		
		it("should work on prefixed-attributed files", function(done)
		{
			helpers.newFile(helpers.tempHidden, {hidden:true});
			
			const newpath = hidefile.hideSync(helpers.tempHidden);
			const result = hidefile.isHiddenSync(helpers.tempHidden);
			
			helpers.removeFile(helpers.tempHidden);
			expect(result).to.be.true;
			done();
		});
		
		it("should work on prefixed-attributed folders", function(done)
		{
			helpers.newFolder(helpers.tempHidden, {hidden:true});
			
			const newpath = hidefile.hideSync(helpers.tempHidden);
			const result = hidefile.isHiddenSync(helpers.tempHidden);
			
			helpers.removeFolder(helpers.tempHidden);
			expect(result).to.be.true;
			done();
		});
	});
});



describe("reveal()", function()
{
	it("should work on unprefixed-unattributed files", function(done)
	{
		helpers.newFile(helpers.tempVisible);
		
		hidefile.reveal(helpers.tempVisible, function(error, newpath)
		{
			const result = hidefile.isHiddenSync(helpers.tempVisible);
			
			helpers.removeFile(helpers.tempVisible);
			expect(error).to.be.null;
			expect(result).to.be.false;
			done();
		});
	});
	
	it("should work on unprefixed-unattributed folders", function(done)
	{
		helpers.newFolder(helpers.tempVisible);
		
		hidefile.reveal(helpers.tempVisible, function(error, newpath)
		{
			const result = hidefile.isHiddenSync(helpers.tempVisible);
			
			helpers.removeFolder(helpers.tempVisible);
			expect(error).to.be.null;
			expect(result).to.be.false;
			done();
		});
	});
	
	it("should work on prefix-only files", function(done)
	{
		helpers.newFile(helpers.tempHidden);
		
		hidefile.reveal(helpers.tempHidden, function(error, newpath)
		{
			const result = hidefile.isHiddenSync(newpath);
			
			helpers.removeFile(newpath);
			expect(error).to.be.null;
			expect(result).to.be.false;
			done();
		});
	});
	
	it("should work on prefix-only folders", function(done)
	{
		helpers.newFolder(helpers.tempHidden);
		
		hidefile.reveal(helpers.tempHidden, function(error, newpath)
		{
			const result = hidefile.isHiddenSync(newpath);
			
			helpers.removeFolder(newpath);
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
			helpers.newFile(helpers.tempVisible, {hidden:true});
			
			hidefile.reveal(helpers.tempVisible, function(error, newpath)
			{
				const result = hidefile.isHiddenSync(helpers.tempVisible);
				
				helpers.removeFile(helpers.tempVisible);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});
		
		it("should work on attribute-only folders", function(done)
		{
			helpers.newFolder(helpers.tempVisible, {hidden:true});
			
			hidefile.reveal(helpers.tempVisible, function(error, newpath)
			{
				const result = hidefile.isHiddenSync(helpers.tempVisible);
				
				helpers.removeFolder(helpers.tempVisible);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});
		
		it("should work on prefixed-attributed files", function(done)
		{
			helpers.newFile(helpers.tempHidden, {hidden:true});
			
			hidefile.reveal(helpers.tempHidden, function(error, newpath)
			{
				const result = hidefile.isHiddenSync(newpath);
				
				helpers.removeFile(newpath);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});
		
		it("should work on prefixed-attributed folders", function(done)
		{
			helpers.newFolder(helpers.tempHidden, {hidden:true});
			
			hidefile.reveal(helpers.tempHidden, function(error, newpath)
			{
				const result = hidefile.isHiddenSync(newpath);
				
				helpers.removeFolder(newpath);
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
		helpers.newFile(helpers.tempVisible);
		
		const newpath = hidefile.revealSync(helpers.tempVisible);
		const result = hidefile.isHiddenSync(helpers.tempVisible);
		
		helpers.removeFile(helpers.tempVisible);
		expect(result).to.be.false;
		done();
	});
	
	it("should work on unprefixed-unattributed folders", function(done)
	{
		helpers.newFolder(helpers.tempVisible);
		
		const newpath = hidefile.revealSync(helpers.tempVisible);
		const result = hidefile.isHiddenSync(helpers.tempVisible);
		
		helpers.removeFolder(helpers.tempVisible);
		expect(result).to.be.false;
		done();
	});
	
	it("should work on prefix-only files", function(done)
	{
		helpers.newFile(helpers.tempHidden);
		
		const newpath = hidefile.revealSync(helpers.tempHidden);
		const result = hidefile.isHiddenSync(newpath);
		
		helpers.removeFile(newpath);
		expect(result).to.be.false;
		done();
	});
	
	it("should work on prefix-only folders", function(done)
	{
		helpers.newFolder(helpers.tempHidden);
		
		const newpath = hidefile.revealSync(helpers.tempHidden);
		const result = hidefile.isHiddenSync(newpath);
		
		helpers.removeFolder(newpath);
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
			helpers.newFile(helpers.tempVisible, {hidden:true});
			
			const newpath = hidefile.revealSync(helpers.tempVisible);
			const result = hidefile.isHiddenSync(helpers.tempVisible);
			
			helpers.removeFile(helpers.tempVisible);
			expect(result).to.be.false;
			done();
		});
		
		it("should work on attribute-only folders", function(done)
		{
			helpers.newFolder(helpers.tempVisible, {hidden:true});
			
			const newpath = hidefile.revealSync(helpers.tempVisible);
			const result = hidefile.isHiddenSync(helpers.tempVisible);
			
			helpers.removeFolder(helpers.tempVisible);
			expect(result).to.be.false;
			done();
		});
		
		it("should work on prefixed-attributed files", function(done)
		{
			helpers.newFile(helpers.tempHidden, {hidden:true});
			
			const newpath = hidefile.revealSync(helpers.tempHidden);
			const result = hidefile.isHiddenSync(newpath);
			
			helpers.removeFile(newpath);
			expect(result).to.be.false;
			done();
		});
		
		it("should work on prefixed-attributed folders", function(done)
		{
			helpers.newFolder(helpers.tempHidden, {hidden:true});
			
			const newpath = hidefile.revealSync(helpers.tempHidden);
			const result = hidefile.isHiddenSync(newpath);
			
			helpers.removeFolder(newpath);
			expect(result).to.be.false;
			done();
		});
	});
});
