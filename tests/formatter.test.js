import { describe, it } from 'node:test';
import assert from 'node:assert';
import { formatFileSize } from '../src/formatter.js';

describe('formatFileSize function', () => {
    it.skip("should return '0B' for sizeBytes = 0", () => {
        assert.strictEqual(formatFileSize(0), '0B');
    });

    it("should return '1.00 MB' for sizeBytes = 1048576", () => {
        assert.strictEqual(formatFileSize(1048576), '1.00 MB');
    });

    it("should return '1.00 GB' for sizeBytes = 1073741824 @large", () => {
        assert.strictEqual(formatFileSize(1073741824), '1.00 GB');
    });

    it("should return '5.00 GB' for sizeBytes = 5368709120 @large", () => {
        assert.strictEqual(formatFileSize(5368709120), '5.00 GB');
    });
});
