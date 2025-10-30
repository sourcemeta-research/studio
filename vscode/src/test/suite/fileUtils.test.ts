import * as assert from 'assert';
import { getFileInfo, parseLintResult, parseMetaschemaResult, errorPositionToRange } from '../../utils/fileUtils';

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

        test('should parse YAML lint output with null positions', () => {
            const output = JSON.stringify({
                health: 95,
                valid: false,
                errors: [
                    {
                        id: 'yaml-error-1',
                        message: 'Property missing',
                        path: '/properties/name',
                        schemaLocation: '/properties',
                        position: null
                    }
                ]
            });
            const result = parseLintResult(output);
            
            assert.strictEqual(result.health, 95);
            assert.strictEqual(result.valid, false);
            assert.strictEqual(result.errors?.length, 1);
            assert.strictEqual(result.errors?.[0].message, 'Property missing');
            assert.strictEqual(result.errors?.[0].position, null);
        });

        test('should handle mixed null and non-null positions', () => {
            const output = JSON.stringify({
                health: 75,
                valid: false,
                errors: [
                    {
                        id: 'error-1',
                        message: 'Error with position',
                        path: '/test1',
                        schemaLocation: '/schema1',
                        position: [5, 10, 5, 20]
                    },
                    {
                        id: 'error-2',
                        message: 'Error without position',
                        path: '/test2',
                        schemaLocation: '/schema2',
                        position: null
                    }
                ]
            });
            const result = parseLintResult(output);
            
            assert.strictEqual(result.health, 75);
            assert.strictEqual(result.errors?.length, 2);
            assert.deepStrictEqual(result.errors?.[0].position, [5, 10, 5, 20]);
            assert.strictEqual(result.errors?.[1].position, null);
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

    suite('parseMetaschemaResult', () => {
        test('should parse metaschema result with exit code 0', () => {
            const output = 'Schema is valid';
            const result = parseMetaschemaResult(output, 0);
            
            assert.strictEqual(result.exitCode, 0);
            assert.strictEqual(result.output, output);
            assert.strictEqual(result.errors, undefined);
        });

        test('should parse metaschema errors with exit code 2', () => {
            const errors = [
                {
                    error: 'Property required but missing',
                    instanceLocation: '/properties/name',
                    keywordLocation: '/properties/name/required',
                    instancePosition: [10, 5, 10, 20]
                }
            ];
            const output = JSON.stringify(errors);
            const result = parseMetaschemaResult(output, 2);
            
            assert.strictEqual(result.exitCode, 2);
            assert.strictEqual(result.errors?.length, 1);
            assert.strictEqual(result.errors?.[0].error, 'Property required but missing');
            assert.deepStrictEqual(result.errors?.[0].instancePosition, [10, 5, 10, 20]);
        });

        test('should handle metaschema errors without position', () => {
            const errors = [
                {
                    error: 'Schema validation failed',
                    instanceLocation: '/test',
                    keywordLocation: '/keyword'
                }
            ];
            const output = JSON.stringify(errors);
            const result = parseMetaschemaResult(output, 2);
            
            assert.strictEqual(result.errors?.length, 1);
            assert.strictEqual(result.errors?.[0].instancePosition, undefined);
        });

        test('should handle exit code 1', () => {
            const output = 'Fatal error occurred';
            const result = parseMetaschemaResult(output, 1);
            
            assert.strictEqual(result.exitCode, 1);
            assert.strictEqual(result.output, output);
        });

        test('should handle invalid JSON in error output', () => {
            const output = 'invalid json';
            const result = parseMetaschemaResult(output, 2);
            
            assert.strictEqual(result.exitCode, 2);
            assert.strictEqual(result.output, output);
        });

        test('should extract JSON from output with prefix text', () => {
            const errors = [
                {
                    error: 'Test error',
                    instanceLocation: '/test',
                    keywordLocation: '/keyword',
                    instancePosition: [1, 1, 1, 10]
                }
            ];
            const output = `Some text before JSON\n${JSON.stringify(errors)}`;
            const result = parseMetaschemaResult(output, 2);
            
            assert.strictEqual(result.errors?.length, 1);
            assert.strictEqual(result.errors?.[0].error, 'Test error');
        });

        test('should extract JSON from output with suffix text', () => {
            const errors = [
                {
                    error: 'Test error',
                    instanceLocation: '/test',
                    keywordLocation: '/keyword'
                }
            ];
            const output = `${JSON.stringify(errors)}\nSome text after JSON`;
            const result = parseMetaschemaResult(output, 2);
            
            assert.strictEqual(result.errors?.length, 1);
            assert.strictEqual(result.errors?.[0].error, 'Test error');
        });

        test('should handle empty error array', () => {
            const output = '[]';
            const result = parseMetaschemaResult(output, 2);
            
            assert.strictEqual(result.exitCode, 2);
            assert.strictEqual(result.errors?.length, 0);
        });

        test('should preserve all error fields', () => {
            const errors = [
                {
                    error: 'Validation error',
                    instanceLocation: '/properties/test',
                    keywordLocation: '/properties',
                    absoluteKeywordLocation: 'http://example.com/schema#/properties',
                    instancePosition: [10, 5, 10, 20]
                }
            ];
            const output = JSON.stringify(errors);
            const result = parseMetaschemaResult(output, 2);
            
            assert.strictEqual(result.errors?.length, 1);
            assert.strictEqual(result.errors?.[0].error, 'Validation error');
            assert.strictEqual(result.errors?.[0].instanceLocation, '/properties/test');
            assert.strictEqual(result.errors?.[0].keywordLocation, '/properties');
            assert.strictEqual(result.errors?.[0].absoluteKeywordLocation, 'http://example.com/schema#/properties');
            assert.deepStrictEqual(result.errors?.[0].instancePosition, [10, 5, 10, 20]);
        });
    });
});
