var expect = require("chai").expect;
var fs = require("fs");
var winattr = require("winattr");

var hidefile = require("../");
var util = require("./util");

var describe_unixOnly    = eval( !util.isWindows ? "describe" : "describe.skip" );
var describe_windowsOnly = eval(  util.isWindows ? "describe" : "describe.skip" );



describe("isHidden()", function()
{
	describe_unixOnly("on Unix", function()
	{
		it("should pass with prefixed-only files", function(done)
		{
			util.newFile(util.tempHidden, function(path)
			{
				hidefile.isHidden(path, function(result)
				{
					fs.unlinkSync(path);
					expect(result).to.be.true;
					done();
				});
			});
		});
		
		it("should pass with prefixed-only folders", function(done)
		{
			util.newFolder(util.tempHidden, function(path)
			{
				hidefile.isHidden(path, function(result)
				{
					fs.rmdirSync(path);
					expect(result).to.be.true;
					done();
				});
			});
		});
	});
	
	describe_windowsOnly("on Windows", function()
	{
		it("should fail with prefixed-only files", function(done)
		{
			util.newFile(util.tempHidden, function(path)
			{
				hidefile.isHidden(path, function(result)
				{
					fs.unlinkSync(path);
					expect(result).to.be.false;
					done();
				});
			});
		});
		
		it("should fail with prefixed-only folders", function(done)
		{
			util.newFolder(util.tempHidden, function(path)
			{
				hidefile.isHidden(path, function(result)
				{
					fs.rmdirSync(path);
					expect(result).to.be.false;
					done();
				});
			});
		});
		
		it("should fail with attribute-only files", function(done)
		{
			util.newFile(function(path)
			{
				winattr.set(path, {hidden:true}, function(error)
				{
					hidefile.isHidden(path, function(result)
					{
						fs.unlinkSync(path);
						expect(error).to.be.null;
						expect(result).to.be.false;
						done();
					});
				});
			});
		});
		
		it("should fail with attribute-only folders", function(done)
		{
			util.newFolder(function(path)
			{
				winattr.set(path, {hidden:true}, function(error)
				{
					hidefile.isHidden(path, function(result)
					{
						fs.rmdirSync(path);
						expect(error).to.be.null;
						expect(result).to.be.false;
						done();
					});
				});
			});
		});
	});
});



describe("shouldBeHidden()", function()
{
	it("should pass for prefixed-only files", function(done)
	{
		util.newFile(util.tempHidden, function(path)
		{
			hidefile.shouldBeHidden(path, function(result)
			{
				fs.unlinkSync(path);
				expect(result).to.be.true;
				done();
			});
		});
	});
	
	it("should pass for prefixed-only folders", function(done)
	{
		util.newFolder(util.tempHidden, function(path)
		{
			hidefile.shouldBeHidden(path, function(result)
			{
				fs.rmdirSync(path);
				expect(result).to.be.true;
				done();
			});
		});
	});
	
	it("should fail for unhidden files", function(done)
	{
		util.newFile(function(path)
		{
			hidefile.shouldBeHidden(path, function(result)
			{
				fs.unlinkSync(path);
				expect(result).to.be.false;
				done();
			});
		});
	});
	
	it("should fail for unhidden folders", function(done)
	{
		util.newFolder(function(path)
		{
			hidefile.shouldBeHidden(path, function(result)
			{
				fs.rmdirSync(path);
				expect(result).to.be.false;
				done();
			});
		});
	});
	
	describe_windowsOnly("on Windows", function()
	{
		it("should pass for attribute-only files", function(done)
		{
			util.newFile(function(path)
			{
				winattr.set(path, {hidden:true}, function(error)
				{
					hidefile.shouldBeHidden(path, function(result)
					{
						fs.unlinkSync(path);
						expect(error).to.be.null;
						expect(result).to.be.true;
						done();
					});
				});
			});
		});
		
		it("should pass for attribute-only folders", function(done)
		{
			util.newFolder(function(path)
			{
				winattr.set(path, {hidden:true}, function(error)
				{
					hidefile.shouldBeHidden(path, function(result)
					{
						fs.rmdirSync(path);
						expect(error).to.be.null;
						expect(result).to.be.true;
						done();
					});
				});
			});
		});
	});
});



describe("Files", function()
{
	describe("that are not hidden", function()
	{
		beforeEach(function(done){ util.newFile(function(){ done() }) });
		
		it("should register as such", function(done)
		{
			hidefile.isHidden(util.temp, function(result)
			{
				fs.unlinkSync(util.temp);
				expect(result).to.be.false;
				done();
			});
		});
		
		it("should hide", function(done)
		{
			hidefile.hide(util.temp, function(error, newpath)
			{
				hidefile.isHidden(newpath, function(result)
				{
					fs.unlinkSync( error ? util.temp : newpath );
					expect(error).to.be.null;
					expect(result).to.be.true;
					done();
				});
			});
		});
		
		it("should reveal anyway", function(done)
		{
			hidefile.reveal(util.temp, function(error, newpath)
			{
				hidefile.isHidden(newpath, function(result)
				{
					fs.unlinkSync(util.temp);
					expect(error).to.be.null;
					expect(result).to.be.false;
					done();
				});
			});
		});
	});
	
	describe("that are hidden", function()
	{
		beforeEach(function(done){ util.newFile(true,function(){ done() }) });
		
		it("should register as such", function(done)
		{
			hidefile.isHidden(util.tempHidden, function(result)
			{
				fs.unlinkSync(util.tempHidden);
				expect(result).to.be.true;
				done();
			});
		});
		
		it("should hide anyway", function(done)
		{
			hidefile.hide(util.tempHidden, function(error, newpath)
			{
				hidefile.isHidden(newpath, function(result)
				{
					fs.unlinkSync(util.tempHidden);
					expect(error).to.be.null;
					expect(result).to.be.true;
					done();
				});
			});
		});
		
		it("should reveal", function(done)
		{
			hidefile.reveal(util.tempHidden, function(error, newpath)
			{
				hidefile.isHidden(newpath, function(result)
				{
					fs.unlinkSync( error ? util.tempHidden : newpath );
					expect(error).to.be.null;
					expect(result).to.be.false;
					done();
				});
			});
		});
	});
});



describe("Folders", function()
{
	describe("that are not hidden", function()
	{
		beforeEach(function(done){ util.newFolder(function(){ done() }) });
		
		it("should register as such", function(done)
		{
			hidefile.isHidden(util.temp, function(result)
			{
				fs.rmdirSync(util.temp);
				expect(result).to.be.false;
				done();
			});
		});
		
		it("should hide", function(done)
		{
			hidefile.hide(util.temp, function(error, newpath)
			{
				hidefile.isHidden(newpath, function(result)
				{
					fs.rmdirSync( error ? util.temp : newpath );
					expect(error).to.be.null;
					expect(result).to.be.true;
					done();
				});
			});
		});
		
		it("should reveal anyway", function(done)
		{
			hidefile.reveal(util.temp, function(error, newpath)
			{
				hidefile.isHidden(newpath, function(result)
				{
					fs.rmdirSync(util.temp);
					expect(error).to.be.null;
					expect(result).to.be.false;
					done();
				});
			});
		});
	});
	
	describe("that are hidden", function()
	{
		beforeEach(function(done){ util.newFolder(true,function(){ done() }) });
		
		it("should register as such", function(done)
		{
			hidefile.isHidden(util.tempHidden, function(result)
			{
				fs.rmdirSync(util.tempHidden);
				expect(result).to.be.true;
				done();
			});
		});
		
		it("should hide anyway", function(done)
		{
			hidefile.hide(util.tempHidden, function(error, newpath)
			{
				hidefile.isHidden(newpath, function(result)
				{
					fs.rmdirSync(util.tempHidden);
					expect(error).to.be.null;
					expect(result).to.be.true;
					done();
				});
			});
		});
		
		it("should reveal", function(done)
		{
			hidefile.reveal(util.tempHidden, function(error, newpath)
			{
				hidefile.isHidden(newpath, function(result)
				{
					fs.rmdirSync( error ? util.tempHidden : newpath );
					expect(error).to.be.null;
					expect(result).to.be.false;
					done();
				});
			});
		});
	});
});
