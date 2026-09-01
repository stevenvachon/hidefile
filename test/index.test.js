import { afterEach, describe, expect, it } from 'vitest';
import {
  createFileFixture,
  createFolder,
  createFolderFixture,
  remove,
  TEMP_DIR,
  TEMP_HIDDEN,
  TEMP_VISIBLE,
} from './helpers.js';
import {
  hide,
  hideSync,
  isDotPrefixed,
  isHidden,
  isHiddenSync,
  reveal,
  revealSync,
  shouldBeHidden,
  shouldBeHiddenSync,
} from '../index.js';
import { InaccessiblePathError } from 'winattr';
import isWindows from 'is-windows';

const FIXTURES = [
  ['file', createFileFixture],
  ['folder', createFolderFixture],
];

afterEach(() => [TEMP_DIR, TEMP_HIDDEN, TEMP_VISIBLE].forEach(remove));

describe('isDotPrefixed()', () =>
  describe('any OS', () => {
    it.each([
      'path/to/.file.ext',
      'path/to/.file',
      '.file.ext',
      '.file',
      '.path/to/.file.ext',
      'path/.to/.file.ext',
      'path/to/.file.file.ext',
      './.file',
    ])('is true for %s', path => expect(isDotPrefixed(path)).toBe(true));

    it.each([
      'path/to/file.ext',
      'path/to/file',
      'file.ext',
      'file',
      '.path/to/file.ext',
      'path/.to/file.ext',
      'path/to/file.file.ext',
      './file',
    ])('is false for %s', path => expect(isDotPrefixed(path)).toBe(false));
  }));

describe('isHidden()', () => {
  describe.skipIf(isWindows())('Unix', () => {
    it('is true for a prefix-only file', () => expect(isHidden(TEMP_HIDDEN)).resolves.toBe(true));
    it('is true for a prefix-only folder', () => expect(isHidden(TEMP_HIDDEN)).resolves.toBe(true));
  });

  describe.skipIf(!isWindows())('Windows', () => {
    describe.each(FIXTURES)('%s', (_kind, createFixture) => {
      it('is false for an unprefixed, unattributed path', async () => {
        createFixture(TEMP_VISIBLE);
        await expect(isHidden(TEMP_VISIBLE)).resolves.toBe(false);
      });

      it('is false for a prefix-only path', async () => {
        createFixture(TEMP_HIDDEN);
        await expect(isHidden(TEMP_HIDDEN)).resolves.toBe(false);
      });

      it('is false for an attribute-only path', async () => {
        createFixture(TEMP_VISIBLE, { hidden: true });
        await expect(isHidden(TEMP_VISIBLE)).resolves.toBe(false);
      });

      it('is true for a prefixed, attributed path', async () => {
        createFixture(TEMP_HIDDEN, { hidden: true });
        await expect(isHidden(TEMP_HIDDEN)).resolves.toBe(true);
      });
    });

    it('throws for a non-existent unprefixed path', () =>
      expect(isHidden('fake')).rejects.toThrow(InaccessiblePathError));

    it('throws for a non-existent prefixed path', () =>
      expect(isHidden('.fake')).rejects.toThrow(InaccessiblePathError));
  });
});

describe('isHiddenSync()', () => {
  describe.skipIf(isWindows())('Unix', () => {
    it('is true for a prefix-only file', () => expect(isHiddenSync(TEMP_HIDDEN)).toBe(true));
    it('is true for a prefix-only folder', () => expect(isHiddenSync(TEMP_HIDDEN)).toBe(true));
  });

  describe.skipIf(!isWindows())('Windows', () => {
    describe.each(FIXTURES)('%s', (_kind, createFixture) => {
      it('is false for an unprefixed, unattributed path', () => {
        createFixture(TEMP_VISIBLE);
        expect(isHiddenSync(TEMP_VISIBLE)).toBe(false);
      });

      it('is false for a prefix-only path', () => {
        createFixture(TEMP_HIDDEN);
        expect(isHiddenSync(TEMP_HIDDEN)).toBe(false);
      });

      it('is false for an attribute-only path', () => {
        createFixture(TEMP_VISIBLE, { hidden: true });
        expect(isHiddenSync(TEMP_VISIBLE)).toBe(false);
      });

      it('is true for a prefixed, attributed path', () => {
        createFixture(TEMP_HIDDEN, { hidden: true });
        expect(isHiddenSync(TEMP_HIDDEN)).toBe(true);
      });
    });

    it('throws for a non-existent unprefixed path', () =>
      expect(() => isHiddenSync('fake')).toThrow(InaccessiblePathError));

    it('throws for a non-existent prefixed path', () =>
      expect(() => isHiddenSync('.fake')).toThrow(InaccessiblePathError));
  });
});

describe('shouldBeHidden()', () => {
  describe('any OS', () =>
    describe.each(FIXTURES)('%s', (_kind, createFixture) => {
      it('is false for an unprefixed, unattributed path', async () => {
        createFixture(TEMP_VISIBLE);
        await expect(shouldBeHidden(TEMP_VISIBLE)).resolves.toBe(false);
      });

      it('is true for a prefix-only path', async () => {
        createFixture(TEMP_HIDDEN);
        await expect(shouldBeHidden(TEMP_HIDDEN)).resolves.toBe(true);
      });
    }));

  describe.skipIf(!isWindows())('Windows', () => {
    describe.each(FIXTURES)('%s', (_kind, createFixture) => {
      it('is true for an attribute-only path', async () => {
        createFixture(TEMP_VISIBLE, { hidden: true });
        await expect(shouldBeHidden(TEMP_VISIBLE)).resolves.toBe(true);
      });

      it('is true for a prefixed, attributed path', async () => {
        createFixture(TEMP_HIDDEN, { hidden: true });
        await expect(shouldBeHidden(TEMP_HIDDEN)).resolves.toBe(true);
      });
    });

    it('throws for a non-existent unprefixed path', () =>
      expect(shouldBeHidden('fake')).rejects.toThrow(InaccessiblePathError));

    it('throws for a non-existent prefixed path', () =>
      expect(shouldBeHidden('.fake')).rejects.toThrow(InaccessiblePathError));
  });
});

describe('shouldBeHiddenSync()', () => {
  describe('any OS', () =>
    describe.each(FIXTURES)('%s', (_kind, createFixture) => {
      it('is false for an unprefixed, unattributed path', () => {
        createFixture(TEMP_VISIBLE);
        expect(shouldBeHiddenSync(TEMP_VISIBLE)).toBe(false);
      });

      it('is true for a prefix-only path', () => {
        createFixture(TEMP_HIDDEN);
        expect(shouldBeHiddenSync(TEMP_HIDDEN)).toBe(true);
      });
    }));

  describe.skipIf(!isWindows())('Windows', () => {
    describe.each(FIXTURES)('%s', (_kind, createFixture) => {
      it('is true for an attribute-only path', () => {
        createFixture(TEMP_VISIBLE, { hidden: true });
        expect(shouldBeHiddenSync(TEMP_VISIBLE)).toBe(true);
      });

      it('is true for a prefixed, attributed path', () => {
        createFixture(TEMP_HIDDEN, { hidden: true });
        expect(shouldBeHiddenSync(TEMP_HIDDEN)).toBe(true);
      });
    });

    it('throws for a non-existent unprefixed path', () =>
      expect(() => shouldBeHiddenSync('fake')).toThrow(InaccessiblePathError));

    it('throws for a non-existent prefixed path', () =>
      expect(() => shouldBeHiddenSync('.fake')).toThrow(InaccessiblePathError));
  });
});

describe('hide()', () => {
  describe('any OS', () => {
    describe.each(FIXTURES)('%s', (_kind, createFixture) => {
      it('works on an unprefixed, unattributed path', async () => {
        createFixture(TEMP_VISIBLE);
        await expect(hide(TEMP_VISIBLE)).resolves.toBe(TEMP_HIDDEN);
        expect(isHiddenSync(TEMP_HIDDEN)).toBe(true);
      });

      it('works on a prefix-only path', async () => {
        createFixture(TEMP_HIDDEN);
        await expect(hide(TEMP_HIDDEN)).resolves.toBe(TEMP_HIDDEN);
        expect(isHiddenSync(TEMP_HIDDEN)).toBe(true);
      });
    });

    it('prefixes a nested basename', async () => {
      createFolder(TEMP_DIR);
      createFileFixture(`${TEMP_DIR}/file`);
      await expect(hide(`${TEMP_DIR}/file`)).resolves.toBe(`${TEMP_DIR}/.file`);
      expect(isHiddenSync(`${TEMP_DIR}/.file`)).toBe(true);
    });

    it('joins a dirname that already has a trailing slash', async () => {
      createFolder(TEMP_DIR);
      createFileFixture(`${TEMP_DIR}//file`);
      await expect(hide(`${TEMP_DIR}//file`)).resolves.toBe(`${TEMP_DIR}/.file`);
      expect(isHiddenSync(`${TEMP_DIR}/.file`)).toBe(true);
    });

    it('throws for a non-existent unprefixed path', () =>
      expect(hide('fake')).rejects.toThrow(Error)); // It fails on the rename first in Windows

    it('throws for a non-existent prefixed path', () =>
      expect(hide('.fake')).rejects.toThrow(Error)); // It fails on the rename first in Windows
  });

  describe.skipIf(!isWindows())('Windows', () =>
    describe.each(FIXTURES)('%s', (_kind, createFixture) => {
      it('works on an attribute-only path', async () => {
        createFixture(TEMP_VISIBLE, { hidden: true });
        expect(isHiddenSync(await hide(TEMP_VISIBLE))).toBe(true);
      });

      it('works on a prefixed, attributed path', async () => {
        createFixture(TEMP_HIDDEN, { hidden: true });
        expect(isHiddenSync(await hide(TEMP_HIDDEN))).toBe(true);
      });
    })
  );
});

describe('hideSync()', () => {
  describe('any OS', () => {
    describe.each(FIXTURES)('%s', (_kind, createFixture) => {
      it('works on an unprefixed, unattributed path', () => {
        createFixture(TEMP_VISIBLE);
        expect(hideSync(TEMP_VISIBLE)).toBe(TEMP_HIDDEN);
        expect(isHiddenSync(TEMP_HIDDEN)).toBe(true);
      });

      it('works on a prefix-only path', () => {
        createFixture(TEMP_HIDDEN);
        expect(hideSync(TEMP_HIDDEN)).toBe(TEMP_HIDDEN);
        expect(isHiddenSync(TEMP_HIDDEN)).toBe(true);
      });
    });

    it('prefixes a nested basename', () => {
      createFolder(TEMP_DIR);
      createFileFixture(`${TEMP_DIR}/file`);
      expect(hideSync(`${TEMP_DIR}/file`)).toBe(`${TEMP_DIR}/.file`);
      expect(isHiddenSync(`${TEMP_DIR}/.file`)).toBe(true);
    });

    it('joins a dirname that already has a trailing slash', () => {
      createFolder(TEMP_DIR);
      createFileFixture(`${TEMP_DIR}//file`);
      expect(hideSync(`${TEMP_DIR}//file`)).toBe(`${TEMP_DIR}/.file`);
      expect(isHiddenSync(`${TEMP_DIR}/.file`)).toBe(true);
    });

    it('throws for a non-existent unprefixed path', () =>
      expect(() => hideSync('fake')).toThrow(Error)); // It fails on the rename first in Windows

    it('throws for a non-existent prefixed path', () =>
      expect(() => hideSync('.fake')).toThrow(Error)); // It fails on the rename first in Windows
  });

  describe.skipIf(!isWindows())('Windows', () =>
    describe.each(FIXTURES)('%s', (_kind, createFixture) => {
      it('works on an attribute-only path', () => {
        createFixture(TEMP_VISIBLE, { hidden: true });
        expect(isHiddenSync(hideSync(TEMP_VISIBLE))).toBe(true);
      });

      it('works on a prefixed, attributed path', () => {
        createFixture(TEMP_HIDDEN, { hidden: true });
        expect(isHiddenSync(hideSync(TEMP_HIDDEN))).toBe(true);
      });
    })
  );
});

describe('reveal()', () => {
  describe('any OS', () => {
    describe.each(FIXTURES)('%s', (_kind, createFixture) => {
      it('works on an unprefixed, unattributed path', async () => {
        createFixture(TEMP_VISIBLE);
        await expect(reveal(TEMP_VISIBLE)).resolves.toBe(TEMP_VISIBLE);
        expect(isHiddenSync(TEMP_VISIBLE)).toBe(false);
      });

      it('works on a prefix-only path', async () => {
        createFixture(TEMP_HIDDEN);
        await expect(reveal(TEMP_HIDDEN)).resolves.toBe(TEMP_VISIBLE);
        expect(isHiddenSync(TEMP_VISIBLE)).toBe(false);
      });
    });

    it('removes the prefix from a nested basename', async () => {
      createFolder(TEMP_DIR);
      createFileFixture(`${TEMP_DIR}/.file`);
      await expect(reveal(`${TEMP_DIR}/.file`)).resolves.toBe(`${TEMP_DIR}/file`);
      expect(isHiddenSync(`${TEMP_DIR}/file`)).toBe(false);
    });

    it('joins a dirname that already has a trailing slash', async () => {
      createFolder(TEMP_DIR);
      createFileFixture(`${TEMP_DIR}//.file`);
      await expect(reveal(`${TEMP_DIR}//.file`)).resolves.toBe(`${TEMP_DIR}/file`);
      expect(isHiddenSync(`${TEMP_DIR}/file`)).toBe(false);
    });

    it('throws for a non-existent unprefixed path', () =>
      expect(reveal('fake')).rejects.toThrow(Error)); // It fails on the rename first in Windows

    it('throws for a non-existent prefixed path', () =>
      expect(reveal('.fake')).rejects.toThrow(Error)); // It fails on the rename first in Windows
  });

  describe.skipIf(!isWindows())('Windows', () =>
    describe.each(FIXTURES)('%s', (_kind, createFixture) => {
      it('works on an attribute-only path', async () => {
        createFixture(TEMP_VISIBLE, { hidden: true });
        expect(shouldBeHiddenSync(await reveal(TEMP_VISIBLE))).toBe(false);
      });

      it('works on a prefixed, attributed path', async () => {
        createFixture(TEMP_HIDDEN, { hidden: true });
        expect(shouldBeHiddenSync(await reveal(TEMP_HIDDEN))).toBe(false);
      });
    })
  );
});

describe('revealSync()', () => {
  describe('any OS', () => {
    describe.each(FIXTURES)('%s', (_kind, createFixture) => {
      it('works on an unprefixed, unattributed path', () => {
        createFixture(TEMP_VISIBLE);
        expect(revealSync(TEMP_VISIBLE)).toBe(TEMP_VISIBLE);
        expect(isHiddenSync(TEMP_VISIBLE)).toBe(false);
      });

      it('works on a prefix-only path', () => {
        createFixture(TEMP_HIDDEN);
        expect(revealSync(TEMP_HIDDEN)).toBe(TEMP_VISIBLE);
        expect(isHiddenSync(TEMP_VISIBLE)).toBe(false);
      });
    });

    it('removes the prefix from a nested basename', () => {
      createFolder(TEMP_DIR);
      createFileFixture(`${TEMP_DIR}/.file`);
      expect(revealSync(`${TEMP_DIR}/.file`)).toBe(`${TEMP_DIR}/file`);
      expect(isHiddenSync(`${TEMP_DIR}/file`)).toBe(false);
    });

    it('joins a dirname that already has a trailing slash', () => {
      createFolder(TEMP_DIR);
      createFileFixture(`${TEMP_DIR}//.file`);
      expect(revealSync(`${TEMP_DIR}//.file`)).toBe(`${TEMP_DIR}/file`);
      expect(isHiddenSync(`${TEMP_DIR}/file`)).toBe(false);
    });

    it('throws for a non-existent unprefixed path', () =>
      expect(() => revealSync('fake')).toThrow(Error)); // It fails on the rename first in Windows

    it('throws for a non-existent prefixed path', () =>
      expect(() => revealSync('.fake')).toThrow(Error)); // It fails on the rename first in Windows
  });

  describe.skipIf(!isWindows())('Windows', () =>
    describe.each(FIXTURES)('%s', (_kind, createFixture) => {
      it('works on an attribute-only path', () => {
        createFixture(TEMP_VISIBLE, { hidden: true });
        expect(shouldBeHiddenSync(revealSync(TEMP_VISIBLE))).toBe(false);
      });

      it('works on a prefixed, attributed path', () => {
        createFixture(TEMP_HIDDEN, { hidden: true });
        expect(shouldBeHiddenSync(revealSync(TEMP_HIDDEN))).toBe(false);
      });
    })
  );
});
