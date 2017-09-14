"use strict";
const {expect} = require("chai");
const hidefile = require("../");
const {isWindows, newFile, newFolder, removeFile, removeFolder, TEMP_HIDDEN, TEMP_VISIBLE} = require("./helpers");
const winattr = require("winattr");

const describe_unixOnly    = !isWindows ? describe : describe.skip;
const describe_windowsOnly =  isWindows ? describe : describe.skip;



describe("isDotPrefixed()", () =>
{
	it("should be true for prefixed dot", () =>
	{
		expect( hidefile.isDotPrefixed("path/to/.file.ext") ).to.be.true;
		expect( hidefile.isDotPrefixed("path/to/.file") ).to.be.true;
		expect( hidefile.isDotPrefixed(".file.ext") ).to.be.true;
		expect( hidefile.isDotPrefixed(".file") ).to.be.true;

		expect( hidefile.isDotPrefixed(".path/to/.file.ext") ).to.be.true;
		expect( hidefile.isDotPrefixed("path/.to/.file.ext") ).to.be.true;
		expect( hidefile.isDotPrefixed("path/to/.file.file.ext") ).to.be.true;
		expect( hidefile.isDotPrefixed("./.file") ).to.be.true;
	});

	it("should be false for missing prefixed dot", () =>
	{
		expect( hidefile.isDotPrefixed("path/to/file.ext") ).to.be.false;
		expect( hidefile.isDotPrefixed("path/to/file") ).to.be.false;
		expect( hidefile.isDotPrefixed("file.ext") ).to.be.false;
		expect( hidefile.isDotPrefixed("file") ).to.be.false;

		expect( hidefile.isDotPrefixed(".path/to/file.ext") ).to.be.false;
		expect( hidefile.isDotPrefixed("path/.to/file.ext") ).to.be.false;
		expect( hidefile.isDotPrefixed("path/to/file.file.ext") ).to.be.false;
		expect( hidefile.isDotPrefixed("./file") ).to.be.false;
	});
});



describe("isHidden()", () =>
{
	describe_unixOnly("on Unix", () =>
	{
		it("should be true for prefix-only files", done =>
		{
			// No need to create file on Unix as it's all string-based
			hidefile.isHidden(TEMP_HIDDEN, (error, result) =>
			{
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});

		it("should be true for prefix-only folders", done =>
		{
			// No need to create file on Unix as it's all string-based
			hidefile.isHidden(TEMP_HIDDEN, (error, result) =>
			{
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});
	});

	describe_windowsOnly("on Windows", () =>
	{
		it("should be false for unprefixed-unattributed files", done =>
		{
			newFile(TEMP_VISIBLE);

			hidefile.isHidden(TEMP_VISIBLE, (error, result) =>
			{
				removeFile(TEMP_VISIBLE);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});

		it("should be false for unprefixed-unattributed folders", done =>
		{
			newFolder(TEMP_VISIBLE);

			hidefile.isHidden(TEMP_VISIBLE, (error, result) =>
			{
				removeFolder(TEMP_VISIBLE);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});

		it("should be false for prefix-only files", done =>
		{
			newFile(TEMP_HIDDEN);

			hidefile.isHidden(TEMP_HIDDEN, (error, result) =>
			{
				removeFile(TEMP_HIDDEN);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});

		it("should be false for prefix-only folders", done =>
		{
			newFolder(TEMP_HIDDEN);

			hidefile.isHidden(TEMP_HIDDEN, (error, result) =>
			{
				removeFolder(TEMP_HIDDEN);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});

		it("should be false for attribute-only files", done =>
		{
			newFile(TEMP_VISIBLE, {hidden:true});

			hidefile.isHidden(TEMP_VISIBLE, (error, result) =>
			{
				removeFile(TEMP_VISIBLE);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});

		it("should be false for attribute-only folders", done =>
		{
			newFolder(TEMP_VISIBLE, {hidden:true});

			hidefile.isHidden(TEMP_VISIBLE, (error, result) =>
			{
				removeFolder(TEMP_VISIBLE);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});

		it("should be true for prefixed-attributed files", done =>
		{
			newFile(TEMP_HIDDEN, {hidden:true});

			hidefile.isHidden(TEMP_HIDDEN, (error, result) =>
			{
				removeFile(TEMP_HIDDEN);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});

		it("should be true for prefixed-attributed folders", done =>
		{
			newFolder(TEMP_HIDDEN, {hidden:true});

			hidefile.isHidden(TEMP_HIDDEN, (error, result) =>
			{
				removeFolder(TEMP_HIDDEN);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});

		it("should error for non-existent unprefixed paths", done =>
		{
			hidefile.isHidden("fake", (error, result) =>
			{
				expect(error).to.be.instanceOf(Error);
				expect(result).to.be.undefined;
				done();
			});
		});

		it("should error for non-existent prefixed paths", done =>
		{
			hidefile.isHidden(".fake", (error, result) =>
			{
				expect(error).to.be.instanceOf(Error);
				expect(result).to.be.undefined;
				done();
			});
		});
	});
});



describe("isHiddenSync()", () =>
{
	describe_unixOnly("on Unix", () =>
	{
		it("should be true for prefix-only files", () =>
		{
			// No need to create file on Unix as it's all string-based
			const result = hidefile.isHiddenSync(TEMP_HIDDEN);

			expect(result).to.be.true;
		});

		it("should be true for prefix-only folders", () =>
		{
			// No need to create file on Unix as it's all string-based
			const result = hidefile.isHiddenSync(TEMP_HIDDEN);

			expect(result).to.be.true;
		});
	});

	describe_windowsOnly("on Windows", () =>
	{
		it("should be false for unprefixed-unattributed files", () =>
		{
			newFile(TEMP_VISIBLE);

			const result = hidefile.isHiddenSync(TEMP_VISIBLE);

			removeFile(TEMP_VISIBLE);
			expect(result).to.be.false;
		});

		it("should be false for unprefixed-unattributed folders", () =>
		{
			newFolder(TEMP_VISIBLE);

			const result = hidefile.isHiddenSync(TEMP_VISIBLE);

			removeFolder(TEMP_VISIBLE);
			expect(result).to.be.false;
		});

		it("should be false for prefix-only files", () =>
		{
			newFile(TEMP_HIDDEN);

			const result = hidefile.isHiddenSync(TEMP_HIDDEN);

			removeFile(TEMP_HIDDEN);
			expect(result).to.be.false;
		});

		it("should be false for prefix-only folders", () =>
		{
			newFolder(TEMP_HIDDEN);

			const result = hidefile.isHiddenSync(TEMP_HIDDEN);

			removeFolder(TEMP_HIDDEN);
			expect(result).to.be.false;
		});

		it("should be false for attribute-only files", () =>
		{
			newFile(TEMP_VISIBLE, {hidden:true});

			const result = hidefile.isHiddenSync(TEMP_VISIBLE);

			removeFile(TEMP_VISIBLE);
			expect(result).to.be.false;
		});

		it("should be false for attribute-only folders", () =>
		{
			newFolder(TEMP_VISIBLE, {hidden:true});

			const result = hidefile.isHiddenSync(TEMP_VISIBLE);

			removeFolder(TEMP_VISIBLE);
			expect(result).to.be.false;
		});

		it("should be true for prefixed-attributed files", () =>
		{
			newFile(TEMP_HIDDEN, {hidden:true});

			const result = hidefile.isHiddenSync(TEMP_HIDDEN);

			removeFile(TEMP_HIDDEN);
			expect(result).to.be.true;
		});

		it("should be true for prefixed-attributed folders", () =>
		{
			newFolder(TEMP_HIDDEN, {hidden:true});

			const result = hidefile.isHiddenSync(TEMP_HIDDEN);

			removeFolder(TEMP_HIDDEN);
			expect(result).to.be.true;
		});

		it("should error for non-existent unprefixed paths", () =>
		{
			let error,result;

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
		});

		it("should error for non-existent prefixed paths", () =>
		{
			let error,result;

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
		});
	});
});



describe("shouldBeHidden()", () =>
{
	it("should be false for unprefixed-unattributed files", done =>
	{
		newFile(TEMP_VISIBLE);

		hidefile.shouldBeHidden(TEMP_VISIBLE, (error, result) =>
		{
			removeFile(TEMP_VISIBLE);
			expect(error).to.be.null;
			expect(result).to.be.false;
			done();
		});
	});

	it("should be false for unprefixed-unattributed folders", done =>
	{
		newFolder(TEMP_VISIBLE);

		hidefile.shouldBeHidden(TEMP_VISIBLE, (error, result) =>
		{
			removeFolder(TEMP_VISIBLE);
			expect(error).to.be.null;
			expect(result).to.be.false;
			done();
		});
	});

	it("should be true for prefix-only files", done =>
	{
		newFile(TEMP_HIDDEN);

		hidefile.shouldBeHidden(TEMP_HIDDEN, (error, result) =>
		{
			removeFile(TEMP_HIDDEN);
			expect(error).to.be.null;
			expect(result).to.be.true;
			done();
		});
	});

	it("should be true for prefix-only folders", done =>
	{
		newFolder(TEMP_HIDDEN);

		hidefile.shouldBeHidden(TEMP_HIDDEN, (error, result) =>
		{
			removeFolder(TEMP_HIDDEN);
			expect(error).to.be.null;
			expect(result).to.be.true;
			done();
		});
	});

	describe_windowsOnly("on Windows", () =>
	{
		it("should be true for attribute-only files", done =>
		{
			newFile(TEMP_VISIBLE, {hidden:true});

			hidefile.shouldBeHidden(TEMP_VISIBLE, (error, result) =>
			{
				removeFile(TEMP_VISIBLE);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});

		it("should be true for attribute-only folders", done =>
		{
			newFolder(TEMP_VISIBLE, {hidden:true});

			hidefile.shouldBeHidden(TEMP_VISIBLE, (error, result) =>
			{
				removeFolder(TEMP_VISIBLE);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});

		it("should be true for prefixed-attributed files", done =>
		{
			newFile(TEMP_HIDDEN, {hidden:true});

			hidefile.shouldBeHidden(TEMP_HIDDEN, (error, result) =>
			{
				removeFile(TEMP_HIDDEN);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});

		it("should be true for prefixed-attributed folders", done =>
		{
			newFolder(TEMP_HIDDEN, {hidden:true});

			hidefile.shouldBeHidden(TEMP_HIDDEN, (error, result) =>
			{
				removeFolder(TEMP_HIDDEN);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});

		it("should error for non-existent unprefixed paths", done =>
		{
			hidefile.shouldBeHidden("fake", (error, result) =>
			{
				expect(error).to.be.instanceOf(Error);
				expect(result).to.be.undefined;
				done();
			});
		});

		it("should error for non-existent prefixed paths", done =>
		{
			hidefile.shouldBeHidden(".fake", (error, result) =>
			{
				expect(error).to.be.instanceOf(Error);
				expect(result).to.be.undefined;
				done();
			});
		});
	});
});



describe("shouldBeHiddenSync()", () =>
{
	it("should be false for unprefixed-unattributed files", () =>
	{
		newFile(TEMP_VISIBLE);

		const result = hidefile.shouldBeHiddenSync(TEMP_VISIBLE);

		removeFile(TEMP_VISIBLE);
		expect(result).to.be.false;
	});

	it("should be false for unprefixed-unattributed folders", () =>
	{
		newFolder(TEMP_VISIBLE);

		const result = hidefile.shouldBeHiddenSync(TEMP_VISIBLE);

		removeFolder(TEMP_VISIBLE);
		expect(result).to.be.false;
	});

	it("should be true for prefix-only files", () =>
	{
		newFile(TEMP_HIDDEN);

		const result = hidefile.shouldBeHiddenSync(TEMP_HIDDEN);

		removeFile(TEMP_HIDDEN);
		expect(result).to.be.true;
	});

	it("should be true for prefix-only folders", () =>
	{
		newFolder(TEMP_HIDDEN);

		const result = hidefile.shouldBeHiddenSync(TEMP_HIDDEN);

		removeFolder(TEMP_HIDDEN);
		expect(result).to.be.true;
	});

	describe_windowsOnly("on Windows", () =>
	{
		it("should be true for attribute-only files", () =>
		{
			newFile(TEMP_VISIBLE, {hidden:true});

			const result = hidefile.shouldBeHiddenSync(TEMP_VISIBLE);

			removeFile(TEMP_VISIBLE);
			expect(result).to.be.true;
		});

		it("should be true for attribute-only folders", () =>
		{
			newFolder(TEMP_VISIBLE, {hidden:true});

			const result = hidefile.shouldBeHiddenSync(TEMP_VISIBLE);

			removeFolder(TEMP_VISIBLE);
			expect(result).to.be.true;
		});

		it("should be true for prefixed-attributed files", () =>
		{
			newFile(TEMP_HIDDEN, {hidden:true});

			const result = hidefile.shouldBeHiddenSync(TEMP_HIDDEN);

			removeFile(TEMP_HIDDEN);
			expect(result).to.be.true;
		});

		it("should be true for prefixed-attributed folders", () =>
		{
			newFolder(TEMP_HIDDEN, {hidden:true});

			const result = hidefile.shouldBeHiddenSync(TEMP_HIDDEN);

			removeFolder(TEMP_HIDDEN);
			expect(result).to.be.true;
		});

		it("should error for non-existent unprefixed paths", () =>
		{
			let error,result;

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
		});

		it("should error for non-existent prefixed paths", () =>
		{
			let error,result;

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
		});
	});
});



describe("hide()", () =>
{
	it("should work on unprefixed-unattributed files", done =>
	{
		newFile(TEMP_VISIBLE);

		hidefile.hide(TEMP_VISIBLE, (error, newpath) =>
		{
			const result = hidefile.isHiddenSync(newpath);

			removeFile(newpath);
			expect(error).to.be.null;
			expect(result).to.be.true;
			done();
		});
	});

	it("should work on unprefixed-unattributed folders", done =>
	{
		newFolder(TEMP_VISIBLE);

		hidefile.hide(TEMP_VISIBLE, (error, newpath) =>
		{
			const result = hidefile.isHiddenSync(newpath);

			removeFolder(newpath);
			expect(error).to.be.null;
			expect(result).to.be.true;
			done();
		});
	});

	it("should work on prefix-only files", done =>
	{
		newFile(TEMP_HIDDEN);

		hidefile.hide(TEMP_HIDDEN, (error, newpath) =>
		{
			const result = hidefile.isHiddenSync(TEMP_HIDDEN);

			removeFile(TEMP_HIDDEN);
			expect(error).to.be.null;
			expect(result).to.be.true;
			done();
		});
	});

	it("should work on prefix-only folders", done =>
	{
		newFolder(TEMP_HIDDEN);

		hidefile.hide(TEMP_HIDDEN, (error, newpath) =>
		{
			const result = hidefile.isHiddenSync(TEMP_HIDDEN);

			removeFolder(TEMP_HIDDEN);
			expect(error).to.be.null;
			expect(result).to.be.true;
			done();
		});
	});

	it("should error for non-existent unprefixed paths", done =>
	{
		hidefile.hide("fake", (error, newpath) =>
		{
			expect(error).to.be.instanceOf(Error);
			expect(newpath).to.be.undefined;
			done();
		});
	});

	it("should error for non-existent prefixed paths", done =>
	{
		hidefile.hide(".fake", (error, newpath) =>
		{
			expect(error).to.be.instanceOf(Error);
			expect(newpath).to.be.undefined;
			done();
		});
	});

	describe_windowsOnly("on Windows", () =>
	{
		it("should work on attribute-only files", done =>
		{
			newFile(TEMP_VISIBLE, {hidden:true});

			hidefile.hide(TEMP_VISIBLE, (error, newpath) =>
			{
				const result = hidefile.isHiddenSync(newpath);

				removeFile(newpath);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});

		it("should work on attribute-only folders", done =>
		{
			newFolder(TEMP_VISIBLE, {hidden:true});

			hidefile.hide(TEMP_VISIBLE, (error, newpath) =>
			{
				const result = hidefile.isHiddenSync(newpath);

				removeFolder(newpath);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});

		it("should work on prefixed-attributed files", done =>
		{
			newFile(TEMP_HIDDEN, {hidden:true});

			hidefile.hide(TEMP_HIDDEN, (error, newpath) =>
			{
				const result = hidefile.isHiddenSync(TEMP_HIDDEN);

				removeFile(TEMP_HIDDEN);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});

		it("should work on prefixed-attributed folders", done =>
		{
			newFolder(TEMP_HIDDEN, {hidden:true});

			hidefile.hide(TEMP_HIDDEN, (error, newpath) =>
			{
				const result = hidefile.isHiddenSync(TEMP_HIDDEN);

				removeFolder(TEMP_HIDDEN);
				expect(error).to.be.null;
				expect(result).to.be.true;
				done();
			});
		});
	});
});



describe("hideSync()", () =>
{
	it("should work on unprefixed-unattributed files", () =>
	{
		newFile(TEMP_VISIBLE);

		const newpath = hidefile.hideSync(TEMP_VISIBLE);
		const result = hidefile.isHiddenSync(newpath);

		removeFile(newpath);
		expect(result).to.be.true;
	});

	it("should work on unprefixed-unattributed folders", () =>
	{
		newFolder(TEMP_VISIBLE);

		const newpath = hidefile.hideSync(TEMP_VISIBLE);
		const result = hidefile.isHiddenSync(newpath);

		removeFolder(newpath);
		expect(result).to.be.true;
	});

	it("should work on prefix-only files", () =>
	{
		newFile(TEMP_HIDDEN);

		const newpath = hidefile.hideSync(TEMP_HIDDEN);
		const result = hidefile.isHiddenSync(TEMP_HIDDEN);

		removeFile(TEMP_HIDDEN);
		expect(result).to.be.true;
	});

	it("should work on prefix-only folders", () =>
	{
		newFolder(TEMP_HIDDEN);

		const newpath = hidefile.hideSync(TEMP_HIDDEN);
		const result = hidefile.isHiddenSync(TEMP_HIDDEN);

		removeFolder(TEMP_HIDDEN);
		expect(result).to.be.true;
	});

	it("should error for non-existent unprefixed paths", () =>
	{
		let error,newpath;

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
	});

	it("should error for non-existent prefixed paths", () =>
	{
		let error,newpath;

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
	});

	describe_windowsOnly("on Windows", () =>
	{
		it("should work on attribute-only files", () =>
		{
			newFile(TEMP_VISIBLE, {hidden:true});

			const newpath = hidefile.hideSync(TEMP_VISIBLE);
			const result = hidefile.isHiddenSync(newpath);

			removeFile(newpath);
			expect(result).to.be.true;
		});

		it("should work on attribute-only folders", () =>
		{
			newFolder(TEMP_VISIBLE, {hidden:true});

			const newpath = hidefile.hideSync(TEMP_VISIBLE);
			const result = hidefile.isHiddenSync(newpath);

			removeFolder(newpath);
			expect(result).to.be.true;
		});

		it("should work on prefixed-attributed files", () =>
		{
			newFile(TEMP_HIDDEN, {hidden:true});

			const newpath = hidefile.hideSync(TEMP_HIDDEN);
			const result = hidefile.isHiddenSync(TEMP_HIDDEN);

			removeFile(TEMP_HIDDEN);
			expect(result).to.be.true;
		});

		it("should work on prefixed-attributed folders", () =>
		{
			newFolder(TEMP_HIDDEN, {hidden:true});

			const newpath = hidefile.hideSync(TEMP_HIDDEN);
			const result = hidefile.isHiddenSync(TEMP_HIDDEN);

			removeFolder(TEMP_HIDDEN);
			expect(result).to.be.true;
		});
	});
});



describe("reveal()", () =>
{
	it("should work on unprefixed-unattributed files", done =>
	{
		newFile(TEMP_VISIBLE);

		hidefile.reveal(TEMP_VISIBLE, (error, newpath) =>
		{
			const result = hidefile.isHiddenSync(TEMP_VISIBLE);

			removeFile(TEMP_VISIBLE);
			expect(error).to.be.null;
			expect(result).to.be.false;
			done();
		});
	});

	it("should work on unprefixed-unattributed folders", done =>
	{
		newFolder(TEMP_VISIBLE);

		hidefile.reveal(TEMP_VISIBLE, (error, newpath) =>
		{
			const result = hidefile.isHiddenSync(TEMP_VISIBLE);

			removeFolder(TEMP_VISIBLE);
			expect(error).to.be.null;
			expect(result).to.be.false;
			done();
		});
	});

	it("should work on prefix-only files", done =>
	{
		newFile(TEMP_HIDDEN);

		hidefile.reveal(TEMP_HIDDEN, (error, newpath) =>
		{
			const result = hidefile.isHiddenSync(newpath);

			removeFile(newpath);
			expect(error).to.be.null;
			expect(result).to.be.false;
			done();
		});
	});

	it("should work on prefix-only folders", done =>
	{
		newFolder(TEMP_HIDDEN);

		hidefile.reveal(TEMP_HIDDEN, (error, newpath) =>
		{
			const result = hidefile.isHiddenSync(newpath);

			removeFolder(newpath);
			expect(error).to.be.null;
			expect(result).to.be.false;
			done();
		});
	});

	it("should error for non-existent unprefixed paths", done =>
	{
		hidefile.reveal("fake", (error, newpath) =>
		{
			expect(error).to.be.instanceOf(Error);
			expect(newpath).to.be.undefined;
			done();
		});
	});

	it("should error for non-existent prefixed paths", done =>
	{
		hidefile.reveal(".fake", (error, newpath) =>
		{
			expect(error).to.be.instanceOf(Error);
			expect(newpath).to.be.undefined;
			done();
		});
	});

	describe_windowsOnly("on Windows", () =>
	{
		it("should work on attribute-only files", done =>
		{
			newFile(TEMP_VISIBLE, {hidden:true});

			hidefile.reveal(TEMP_VISIBLE, (error, newpath) =>
			{
				const result = hidefile.isHiddenSync(TEMP_VISIBLE);

				removeFile(TEMP_VISIBLE);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});

		it("should work on attribute-only folders", done =>
		{
			newFolder(TEMP_VISIBLE, {hidden:true});

			hidefile.reveal(TEMP_VISIBLE, (error, newpath) =>
			{
				const result = hidefile.isHiddenSync(TEMP_VISIBLE);

				removeFolder(TEMP_VISIBLE);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});

		it("should work on prefixed-attributed files", done =>
		{
			newFile(TEMP_HIDDEN, {hidden:true});

			hidefile.reveal(TEMP_HIDDEN, (error, newpath) =>
			{
				const result = hidefile.isHiddenSync(newpath);

				removeFile(newpath);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});

		it("should work on prefixed-attributed folders", done =>
		{
			newFolder(TEMP_HIDDEN, {hidden:true});

			hidefile.reveal(TEMP_HIDDEN, (error, newpath) =>
			{
				const result = hidefile.isHiddenSync(newpath);

				removeFolder(newpath);
				expect(error).to.be.null;
				expect(result).to.be.false;
				done();
			});
		});
	});
});



describe("revealSync()", () =>
{
	it("should work on unprefixed-unattributed files", () =>
	{
		newFile(TEMP_VISIBLE);

		const newpath = hidefile.revealSync(TEMP_VISIBLE);
		const result = hidefile.isHiddenSync(TEMP_VISIBLE);

		removeFile(TEMP_VISIBLE);
		expect(result).to.be.false;
	});

	it("should work on unprefixed-unattributed folders", () =>
	{
		newFolder(TEMP_VISIBLE);

		const newpath = hidefile.revealSync(TEMP_VISIBLE);
		const result = hidefile.isHiddenSync(TEMP_VISIBLE);

		removeFolder(TEMP_VISIBLE);
		expect(result).to.be.false;
	});

	it("should work on prefix-only files", () =>
	{
		newFile(TEMP_HIDDEN);

		const newpath = hidefile.revealSync(TEMP_HIDDEN);
		const result = hidefile.isHiddenSync(newpath);

		removeFile(newpath);
		expect(result).to.be.false;
	});

	it("should work on prefix-only folders", () =>
	{
		newFolder(TEMP_HIDDEN);

		const newpath = hidefile.revealSync(TEMP_HIDDEN);
		const result = hidefile.isHiddenSync(newpath);

		removeFolder(newpath);
		expect(result).to.be.false;
	});

	it("should error for non-existent unprefixed paths", () =>
	{
		let error,newpath;

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
	});

	it("should error for non-existent prefixed paths", () =>
	{
		let error,newpath;

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
	});

	describe_windowsOnly("on Windows", () =>
	{
		it("should work on attribute-only files", () =>
		{
			newFile(TEMP_VISIBLE, {hidden:true});

			const newpath = hidefile.revealSync(TEMP_VISIBLE);
			const result = hidefile.isHiddenSync(TEMP_VISIBLE);

			removeFile(TEMP_VISIBLE);
			expect(result).to.be.false;
		});

		it("should work on attribute-only folders", () =>
		{
			newFolder(TEMP_VISIBLE, {hidden:true});

			const newpath = hidefile.revealSync(TEMP_VISIBLE);
			const result = hidefile.isHiddenSync(TEMP_VISIBLE);

			removeFolder(TEMP_VISIBLE);
			expect(result).to.be.false;
		});

		it("should work on prefixed-attributed files", () =>
		{
			newFile(TEMP_HIDDEN, {hidden:true});

			const newpath = hidefile.revealSync(TEMP_HIDDEN);
			const result = hidefile.isHiddenSync(newpath);

			removeFile(newpath);
			expect(result).to.be.false;
		});

		it("should work on prefixed-attributed folders", () =>
		{
			newFolder(TEMP_HIDDEN, {hidden:true});

			const newpath = hidefile.revealSync(TEMP_HIDDEN);
			const result = hidefile.isHiddenSync(newpath);

			removeFolder(newpath);
			expect(result).to.be.false;
		});
	});
});
