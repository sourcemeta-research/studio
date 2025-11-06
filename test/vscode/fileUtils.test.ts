import * as assert from 'assert';
import { getFileInfo, parseLintResult, parseMetaschemaResult, errorPositionToRange, parseCliError, hasJsonParseErrors } from '../../vscode/src/utils/fileUtils';
import type { LintResult, MetaschemaResult, MetaschemaError } from '../../shared/types';

function isMetaschemaError(error: unknown): error is MetaschemaError {
    return typeof error === 'object' && error !== null && 'instanceLocation' in error;
}

suite('FileUtils Test Suite', () => {
    suite('hasJsonParseErrors', () => {
        const validMetaschema: MetaschemaResult = {
            output: '',
            exitCode: 0
        };

        const failedMetaschema: MetaschemaResult = {
            output: '',
            exitCode: 1,
            errors: [{
                error: 'Validation failed',
                instanceLocation: '/',
                keywordLocation: '/'
            }]
        };

        test('should detect parse errors in lint result', () => {
            const lintResult: LintResult = {
                raw: '{}',
                health: 0,
                valid: false,
                errors: [{
                    id: 'json-parse-error',
                    message: 'Failed to parse JSON',
                    path: '/',
                    schemaLocation: '/',
                    position: [1, 1, 1, 1]
                }]
            };
            assert.strictEqual(hasJsonParseErrors(lintResult, validMetaschema), true);
        });

        test('should not detect parse errors in normal lint errors', () => {
            const lintResult: LintResult = {
                raw: '{}',
                health: 50,
                valid: false,
                errors: [{
                    id: 'some-lint-rule',
                    message: 'Some lint error',
                    path: '/',
                    schemaLocation: '/',
                    position: [1, 1, 1, 1]
                }]
            };
            assert.strictEqual(hasJsonParseErrors(lintResult, validMetaschema), false);
        });

        test('should handle empty errors array', () => {
            const lintResult: LintResult = {
                raw: '{}',
                health: 100,
                valid: true,
                errors: []
            };
            assert.strictEqual(hasJsonParseErrors(lintResult, validMetaschema), false);
        });

        test('should handle undefined errors', () => {
            const lintResult: LintResult = {
                raw: '{}',
                health: null
            };
            assert.strictEqual(hasJsonParseErrors(lintResult, validMetaschema), false);
        });

        test('should detect CLI parse errors', () => {
            const lintResult: LintResult = {
                raw: '{}',
                health: 0,
                valid: false,
                errors: [{
                    id: 'cli-error',
                    message: 'Failed to parse the JSON document',
                    path: '/',
                    schemaLocation: '/',
                    position: [5, 10, 5, 10]
                }]
            };
            assert.strictEqual(hasJsonParseErrors(lintResult, validMetaschema), true);
        });

        test('should detect parse errors in metaschema result', () => {
            const lintResult: LintResult = {
                raw: '{}',
                health: null
            };
            const metaschema: MetaschemaResult = {
                output: '{}',
                exitCode: 1,
                errors: [{
                    error: 'Failed to parse the JSON document',
                    instanceLocation: '/',
                    keywordLocation: '/'
                }]
            };
            assert.strictEqual(hasJsonParseErrors(lintResult, metaschema), true);
        });

        test('should return false when no parse errors exist', () => {
            const lintResult: LintResult = {
                raw: '{}',
                health: 100,
                valid: true,
                errors: []
            };
            assert.strictEqual(hasJsonParseErrors(lintResult, failedMetaschema), false);
        });
    });

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

        test('should handle JSON parsing error response', () => {
            const output = JSON.stringify({
                error: 'Failed to parse the JSON document',
                line: 106,
                column: 5,
                filePath: '/home/user/schema.json'
            });
            const result = parseLintResult(output);
            
            assert.strictEqual(result.health, 0, 'Health should be 0 for parsing errors');
            assert.strictEqual(result.valid, false, 'Should be marked as invalid');
            assert.strictEqual(result.errors?.length, 1, 'Should have one error');
            assert.strictEqual(result.errors?.[0].id, 'json-parse-error');
            assert.strictEqual(result.errors?.[0].message, 'Failed to parse the JSON document');
            assert.ok(result.errors?.[0].description?.includes('line 106'), 'Description should mention line number');
            assert.ok(result.errors?.[0].description?.includes('column 5'), 'Description should mention column number');
            assert.deepStrictEqual(result.errors?.[0].position, [106, 5, 106, 5]);
        });

        test('should handle parsing error without line/column info', () => {
            const output = JSON.stringify({
                error: 'Failed to parse the JSON document'
            });
            const result = parseLintResult(output);
            
            assert.strictEqual(result.health, 0);
            assert.strictEqual(result.valid, false);
            assert.strictEqual(result.errors?.length, 1);
            assert.strictEqual(result.errors?.[0].position, null, 'Position should be null when line/column not provided');
        });

        test('should handle CLI error format from --json flag', () => {
            const output = JSON.stringify({
                error: 'Could not resolve the metaschema of the schema',
                identifier: 'https://example.com/unknown',
                filePath: '/path/to/schema.json'
            });
            const result = parseLintResult(output);
            
            assert.strictEqual(result.health, 0);
            assert.strictEqual(result.valid, false);
            assert.strictEqual(result.errors?.length, 1);
            assert.strictEqual(result.errors?.[0].message, 'Could not resolve the metaschema of the schema');
            assert.ok(result.errors?.[0].description?.includes('/path/to/schema.json'));
            assert.strictEqual(result.errors?.[0].schemaLocation, 'https://example.com/unknown');
        });

        test('should handle CLI error with location', () => {
            const output = JSON.stringify({
                error: 'Could not resolve schema reference',
                identifier: 'https://example.com/missing',
                location: '/properties/foo/$ref',
                line: 10,
                column: 15
            });
            const result = parseLintResult(output);
            
            assert.strictEqual(result.errors?.length, 1);
            assert.strictEqual(result.errors?.[0].path, '/properties/foo/$ref');
            assert.deepStrictEqual(result.errors?.[0].position, [10, 15, 10, 15]);
        });
    });

    suite('parseCliError', () => {
        test('should parse valid CLI error', () => {
            const output = JSON.stringify({
                error: 'No such file or directory',
                filePath: '/path/to/missing.json'
            });
            const result = parseCliError(output);
            
            assert.notStrictEqual(result, null);
            assert.strictEqual(result?.error, 'No such file or directory');
            assert.strictEqual(result?.filePath, '/path/to/missing.json');
        });

        test('should parse CLI error with line and column', () => {
            const output = JSON.stringify({
                error: 'Failed to parse the JSON document',
                line: 5,
                column: 23,
                filePath: '/path/to/schema.json'
            });
            const result = parseCliError(output);
            
            assert.notStrictEqual(result, null);
            assert.strictEqual(result?.line, 5);
            assert.strictEqual(result?.column, 23);
        });

        test('should parse CLI error with identifier', () => {
            const output = JSON.stringify({
                error: 'Could not resolve the metaschema of the schema',
                identifier: 'https://example.com/unknown'
            });
            const result = parseCliError(output);
            
            assert.notStrictEqual(result, null);
            assert.strictEqual(result?.identifier, 'https://example.com/unknown');
        });

        test('should return null for non-error JSON', () => {
            const output = JSON.stringify({
                health: 100,
                valid: true
            });
            const result = parseCliError(output);
            
            assert.strictEqual(result, null);
        });

        test('should return null for invalid JSON', () => {
            const output = 'not valid json';
            const result = parseCliError(output);
            
            assert.strictEqual(result, null);
        });

        test('should parse all CLI error fields', () => {
            const output = JSON.stringify({
                error: 'Test error',
                line: 10,
                column: 5,
                filePath: '/test/path.json',
                identifier: 'https://test.com',
                location: '/properties/test',
                rule: 'test-rule',
                testNumber: 5,
                uri: 'https://uri.com',
                command: 'lint',
                option: '--strict'
            });
            const result = parseCliError(output);
            
            assert.notStrictEqual(result, null);
            assert.strictEqual(result?.error, 'Test error');
            assert.strictEqual(result?.line, 10);
            assert.strictEqual(result?.column, 5);
            assert.strictEqual(result?.filePath, '/test/path.json');
            assert.strictEqual(result?.identifier, 'https://test.com');
            assert.strictEqual(result?.location, '/properties/test');
            assert.strictEqual(result?.rule, 'test-rule');
            assert.strictEqual(result?.testNumber, 5);
            assert.strictEqual(result?.uri, 'https://uri.com');
            assert.strictEqual(result?.command, 'lint');
            assert.strictEqual(result?.option, '--strict');
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
            const error = result.errors?.[0];
            assert.strictEqual(error?.error, 'Property required but missing');
            if (error && 'instancePosition' in error) {
                assert.deepStrictEqual(error.instancePosition, [10, 5, 10, 20]);
            }
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
            const error = result.errors?.[0];
            if (error && isMetaschemaError(error)) {
                assert.strictEqual(error.instancePosition, undefined);
            }
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
            const error = result.errors?.[0];
            assert.strictEqual(error?.error, 'Validation error');
            if (error && isMetaschemaError(error)) {
                assert.strictEqual(error.instanceLocation, '/properties/test');
                assert.strictEqual(error.keywordLocation, '/properties');
                assert.strictEqual(error.absoluteKeywordLocation, 'http://example.com/schema#/properties');
                assert.deepStrictEqual(error.instancePosition, [10, 5, 10, 20]);
            }
        });

        test('should handle CLI error with exit code 1', () => {
            const output = JSON.stringify({
                error: 'Could not resolve the metaschema of the schema',
                identifier: 'https://example.com/unknown',
                filePath: '/path/to/schema.json'
            });
            const result = parseMetaschemaResult(output, 1);
            
            assert.strictEqual(result.exitCode, 1);
            assert.strictEqual(result.errors?.length, 1);
            const error = result.errors?.[0];
            assert.strictEqual(error?.error, 'Could not resolve the metaschema of the schema');
            if (error && isMetaschemaError(error)) {
                assert.strictEqual(error.absoluteKeywordLocation, 'https://example.com/unknown');
            }
        });

        test('should handle CLI error with position', () => {
            const output = JSON.stringify({
                error: 'Failed to parse the JSON document',
                line: 5,
                column: 23,
                filePath: '/path/to/schema.json'
            });
            const result = parseMetaschemaResult(output, 1);
            
            assert.strictEqual(result.errors?.length, 1);
            const error = result.errors?.[0];
            if (error && isMetaschemaError(error)) {
                assert.deepStrictEqual(error.instancePosition, [5, 23, 5, 23]);
            }
        });

        test('should handle CLI error without position', () => {
            const output = JSON.stringify({
                error: 'The schema file you provided does not represent a valid JSON Schema',
                filePath: '/path/to/document.json'
            });
            const result = parseMetaschemaResult(output, 1);
            
            assert.strictEqual(result.errors?.length, 1);
            const error1 = result.errors?.[0];
            assert.strictEqual(error1?.error, 'The schema file you provided does not represent a valid JSON Schema');
            if (error1 && isMetaschemaError(error1)) {
                assert.strictEqual(error1.instancePosition, undefined);
            }
        });

        test('should handle CLI error with location', () => {
            const output = JSON.stringify({
                error: 'Schema reference error',
                location: '/properties/test/$ref',
                identifier: 'https://example.com/missing'
            });
            const result = parseMetaschemaResult(output, 1);
            
            assert.strictEqual(result.errors?.length, 1);
            const error = result.errors?.[0];
            if (error && isMetaschemaError(error)) {
                assert.strictEqual(error.instanceLocation, '/properties/test/$ref');
            }
        });
    });

    suite('hasJsonParseErrors', () => {
        test('should detect parse errors in lint result', () => {
            const lintResult = {
                raw: '{}',
                health: 0,
                valid: false,
                errors: [{
                    id: 'json-parse-error',
                    message: 'Failed to parse the JSON document',
                    path: '/',
                    schemaLocation: '/',
                    position: [5, 10, 5, 10] as [number, number, number, number]
                }]
            };
            const metaschemaResult = { output: '', exitCode: 0 };
            
            const result = hasJsonParseErrors(lintResult, metaschemaResult);
            assert.strictEqual(result, true);
        });

        test('should detect parse errors in metaschema result', () => {
            const lintResult = { raw: '', health: 100, valid: true };
            const metaschemaResult = {
                output: '',
                exitCode: 1,
                errors: [{
                    error: 'Failed to parse the JSON document',
                    instanceLocation: '/',
                    keywordLocation: '/'
                }]
            };
            
            const result = hasJsonParseErrors(lintResult, metaschemaResult);
            assert.strictEqual(result, true);
        });

        test('should return false when no parse errors', () => {
            const lintResult = {
                raw: '{}',
                health: 100,
                valid: true,
                errors: []
            };
            const metaschemaResult = { output: '', exitCode: 0 };
            
            const result = hasJsonParseErrors(lintResult, metaschemaResult);
            assert.strictEqual(result, false);
        });

        test('should return false for non-parse errors', () => {
            const lintResult = {
                raw: '{}',
                health: 50,
                valid: false,
                errors: [{
                    id: 'some-other-error',
                    message: 'Some validation error',
                    path: '/properties/test',
                    schemaLocation: '/properties',
                    position: null
                }]
            };
            const metaschemaResult = { output: '', exitCode: 0 };
            
            const result = hasJsonParseErrors(lintResult, metaschemaResult);
            assert.strictEqual(result, false);
        });

        test('should handle lint result without errors array', () => {
            const lintResult = { raw: '', health: 100, valid: true };
            const metaschemaResult = { output: '', exitCode: 0 };
            
            const result = hasJsonParseErrors(lintResult, metaschemaResult);
            assert.strictEqual(result, false);
        });

        test('should handle metaschema result without errors array', () => {
            const lintResult = { raw: '', health: 100, valid: true };
            const metaschemaResult = { output: '', exitCode: 0 };
            
            const result = hasJsonParseErrors(lintResult, metaschemaResult);
            assert.strictEqual(result, false);
        });

        test('should detect parse errors by message content', () => {
            const lintResult = {
                raw: '{}',
                health: 0,
                valid: false,
                errors: [{
                    id: 'some-id',
                    message: 'Failed to parse the document',
                    path: '/',
                    schemaLocation: '/',
                    position: null
                }]
            };
            const metaschemaResult = { output: '', exitCode: 0 };
            
            const result = hasJsonParseErrors(lintResult, metaschemaResult);
            assert.strictEqual(result, true);
        });

        test('should be case-insensitive when checking parse errors', () => {
            const lintResult = {
                raw: '{}',
                health: 0,
                valid: false,
                errors: [{
                    id: 'error',
                    message: 'FAILED TO PARSE the JSON',
                    path: '/',
                    schemaLocation: '/',
                    position: null
                }]
            };
            const metaschemaResult = { output: '', exitCode: 0 };
            
            const result = hasJsonParseErrors(lintResult, metaschemaResult);
            assert.strictEqual(result, true);
        });
    });
});

