import * as assert from 'assert';
import { getFileInfo, parseLintResult, errorPositionToRange } from '../../utils/fileUtils';

suite('FileUtils Test Suite', () => {
    suite('getFileInfo', () => {
        test('should return null for undefined path', () => {
            const result = getFileInfo(undefined);
            assert.strictEqual(result, null);
        });

        test('should return null for empty string', () => {
            const result = getFileInfo('');
            assert.strictEqual(result, null);
        });

        test('should return null for non-JSON/YAML files', () => {
            const result = getFileInfo('/path/to/file.txt');
            assert.strictEqual(result, null);
        });

        test('should return FileInfo for .json file', () => {
            const testPath = '/path/to/schema.json';
            const result = getFileInfo(testPath);
            
            assert.notStrictEqual(result, null);
            assert.strictEqual(result?.absolutePath, testPath);
            assert.strictEqual(result?.fileName, 'schema.json');
        });

        test('should return FileInfo for .yaml file', () => {
            const testPath = '/path/to/schema.yaml';
            const result = getFileInfo(testPath);
            
            assert.notStrictEqual(result, null);
            assert.strictEqual(result?.absolutePath, testPath);
            assert.strictEqual(result?.fileName, 'schema.yaml');
        });

        test('should return FileInfo for .yml file', () => {
            const testPath = '/path/to/schema.yml';
            const result = getFileInfo(testPath);
            
            assert.notStrictEqual(result, null);
            assert.strictEqual(result?.absolutePath, testPath);
            assert.strictEqual(result?.fileName, 'schema.yml');
        });

        test('should handle paths with spaces', () => {
            const testPath = '/path/to/my schema.json';
            const result = getFileInfo(testPath);
            
            assert.notStrictEqual(result, null);
            assert.strictEqual(result?.fileName, 'my schema.json');
        });
    });

    suite('parseLintResult', () => {
        test('should return error result for empty string', () => {
            const result = parseLintResult('');
            assert.strictEqual(result.error, true);
            assert.strictEqual(result.health, null);
        });

        test('should parse valid JSON lint output', () => {
            const output = JSON.stringify({
                health: 100,
                valid: true,
                errors: []
            });
            const result = parseLintResult(output);
            
            assert.strictEqual(result.health, 100);
            assert.strictEqual(result.valid, true);
            assert.strictEqual(result.errors?.length, 0);
        });

        test('should parse lint output with errors', () => {
            const output = JSON.stringify({
                health: 50,
                valid: false,
                errors: [
                    {
                        id: 'error-1',
                        message: 'Missing required property',
                        path: '/properties/name',
                        schemaLocation: '/properties',
                        position: [5, 10, 5, 20]
                    }
                ]
            });
            const result = parseLintResult(output);
            
            assert.strictEqual(result.health, 50);
            assert.strictEqual(result.valid, false);
            assert.strictEqual(result.errors?.length, 1);
            assert.strictEqual(result.errors?.[0].message, 'Missing required property');
            assert.deepStrictEqual(result.errors?.[0].position, [5, 10, 5, 20]);
        });

        test('should handle invalid JSON', () => {
            const output = 'invalid json string';
            const result = parseLintResult(output);
            
            assert.strictEqual(result.error, true);
            assert.strictEqual(result.health, null);
        });
    });

    suite('errorPositionToRange', () => {
        test('should convert position array to VS Code Range', () => {
            const position: [number, number, number, number] = [5, 10, 5, 20];
            const range = errorPositionToRange(position);
            
            assert.strictEqual(range.start.line, 4);
            assert.strictEqual(range.start.character, 9);
            assert.strictEqual(range.end.line, 4);
            assert.strictEqual(range.end.character, 20);
        });

        test('should handle line 1, column 1', () => {
            const position: [number, number, number, number] = [1, 1, 1, 1];
            const range = errorPositionToRange(position);
            
            assert.strictEqual(range.start.line, 0);
            assert.strictEqual(range.start.character, 0);
            assert.strictEqual(range.end.line, 0);
            assert.strictEqual(range.end.character, 1);
        });

        test('should handle multi-line ranges', () => {
            const position: [number, number, number, number] = [10, 5, 12, 15];
            const range = errorPositionToRange(position);
            
            assert.strictEqual(range.start.line, 9);
            assert.strictEqual(range.start.character, 4);
            assert.strictEqual(range.end.line, 11);
            assert.strictEqual(range.end.character, 15);
        });
    });
});
