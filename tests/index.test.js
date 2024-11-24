import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';

describe('Mocking fs.readFile in Node.js', () => {
    beforeEach(() => {
        mock.method(fs.promises, 'readFile', async () => 'Hello World');
    });

    afterEach(() => {
        // Clean up mocks or any other resources after each test
        mock.reset();
    });

    it('should successfully read the content of a text file', async () => {
        assert.strictEqual(fs.promises.readFile.mock.calls.length, 0);
        assert.strictEqual(
            await fs.promises.readFile('text-content.txt'),
            'Hello World'
        );
        assert.strictEqual(fs.promises.readFile.mock.calls.length, 1);
    });
});

describe('Mocking setTimeout in Node.js', () => {
    it('should successfully mock setTimeout', () => {
        const fn = mock.fn();
        mock.timers.enable({ apis: ['setTimeout'] });
        setTimeout(fn, 20);

        mock.timers.tick(10);
        mock.timers.tick(10);

        assert.strictEqual(fn.mock.callCount(), 1);
    });
});

describe('Mocking the Date object in Node.js', () => {
    it('should effectively mock the Date object starting from 200 milliseconds', (context) => {
        context.mock.timers.enable({ apis: ['Date'], now: 200 });
        assert.strictEqual(Date.now(), 200);

        // Simulate advancing time by 200 milliseconds
        context.mock.timers.tick(200);
        assert.strictEqual(Date.now(), 400);
    });
});
