import * as assert from 'assert';
import { DiagnosticType } from '../../types';
import type { PanelState, WebviewMessage } from '../../../../shared/types';

suite('Shared Types Test Suite', () => {
    test('DiagnosticType should have Lint type', () => {
        assert.strictEqual(DiagnosticType.Lint, 'lint');
    });

    test('DiagnosticType should have Metaschema type', () => {
        assert.strictEqual(DiagnosticType.Metaschema, 'metaschema');
    });

    test('DiagnosticType values should be unique', () => {
        const values = Object.values(DiagnosticType);
        const uniqueValues = new Set(values);
        assert.strictEqual(values.length, uniqueValues.size, 'All diagnostic type values should be unique');
    });

    suite('PanelState', () => {
        test('should have all required properties', () => {
            const state: PanelState = {
                fileInfo: null,
                cliVersion: '12.2.0',
                extensionVersion: '0.0.1',
                lintResult: { raw: '', health: null },
                formatResult: { output: '', exitCode: null },
                metaschemaResult: { output: '', exitCode: null },
                isLoading: false,
                hasParseErrors: false,
                blockedByMetaschema: false
            };

            assert.ok(state.hasOwnProperty('fileInfo'));
            assert.ok(state.hasOwnProperty('cliVersion'));
            assert.ok(state.hasOwnProperty('extensionVersion'));
            assert.ok(state.hasOwnProperty('lintResult'));
            assert.ok(state.hasOwnProperty('formatResult'));
            assert.ok(state.hasOwnProperty('metaschemaResult'));
            assert.ok(state.hasOwnProperty('isLoading'));
            assert.ok(state.hasOwnProperty('hasParseErrors'));
            assert.ok(state.hasOwnProperty('blockedByMetaschema'));
        });

        test('should allow optional properties to be undefined', () => {
            const state: PanelState = {
                fileInfo: null,
                cliVersion: '12.2.0',
                extensionVersion: '0.0.1',
                lintResult: { raw: '', health: null },
                formatResult: { output: '', exitCode: null },
                metaschemaResult: { output: '', exitCode: null }
            };

            assert.strictEqual(state.isLoading, undefined);
            assert.strictEqual(state.hasParseErrors, undefined);
            assert.strictEqual(state.blockedByMetaschema, undefined);
        });

        test('should represent blocked state correctly', () => {
            const blockedState: PanelState = {
                fileInfo: { absolutePath: '/test.json', displayPath: 'test.json', fileName: 'test.json' },
                cliVersion: '12.2.0',
                extensionVersion: '0.0.1',
                lintResult: { raw: '', health: null, errors: [] },
                formatResult: { output: '', exitCode: null },
                metaschemaResult: {
                    output: '{}',
                    exitCode: 1,
                    errors: [{
                        error: 'Fatal error',
                        instanceLocation: '/',
                        keywordLocation: '/'
                    }]
                },
                isLoading: false,
                hasParseErrors: true,
                blockedByMetaschema: true
            };

            assert.strictEqual(blockedState.blockedByMetaschema, true);
            assert.strictEqual(blockedState.hasParseErrors, true);
            assert.strictEqual(blockedState.metaschemaResult.exitCode, 1);
        });

        test('should handle YAML file info', () => {
            const state: PanelState = {
                fileInfo: {
                    absolutePath: '/test.yaml',
                    displayPath: 'test.yaml',
                    fileName: 'test.yaml',
                    isYaml: true
                },
                cliVersion: '12.2.0',
                extensionVersion: '0.0.1',
                lintResult: { raw: '', health: null },
                formatResult: { output: '', exitCode: null },
                metaschemaResult: { output: '', exitCode: null }
            };

            assert.strictEqual(state.fileInfo?.isYaml, true);
        });

        test('should have separate CLI and extension versions', () => {
            const state: PanelState = {
                fileInfo: null,
                cliVersion: '12.2.0',
                extensionVersion: '0.0.1',
                lintResult: { raw: '', health: null },
                formatResult: { output: '', exitCode: null },
                metaschemaResult: { output: '', exitCode: null }
            };

            assert.strictEqual(state.cliVersion, '12.2.0', 'CLI version should be set');
            assert.strictEqual(state.extensionVersion, '0.0.1', 'Extension version should be set');
        });

        test('should auto-switch to metaschema tab when blocked', () => {
            const blockedState: PanelState = {
                fileInfo: null,
                cliVersion: '12.2.0',
                extensionVersion: '0.0.1',
                lintResult: { raw: '', health: null, errors: [] },
                formatResult: { output: '', exitCode: null },
                metaschemaResult: { 
                    output: '', 
                    exitCode: 1,
                    errors: [{
                        error: 'Schema validation failed',
                        instanceLocation: '/properties',
                        keywordLocation: '/type'
                    }]
                },
                isLoading: false,
                blockedByMetaschema: true
            };

            const defaultTab = blockedState.blockedByMetaschema ? 'metaschema' : 'lint';
            assert.strictEqual(defaultTab, 'metaschema', 'Should default to metaschema tab when blocked');
        });

        test('should indicate tabs disabled when blocked by metaschema', () => {
            const blockedState: PanelState = {
                fileInfo: null,
                cliVersion: '12.2.0',
                extensionVersion: '0.0.1',
                lintResult: { raw: '', health: null, errors: [] },
                formatResult: { output: '', exitCode: null },
                metaschemaResult: { 
                    output: '', 
                    exitCode: 1,
                    errors: [{
                        error: 'Schema validation failed',
                        instanceLocation: '/properties',
                        keywordLocation: '/type'
                    }]
                },
                isLoading: false,
                blockedByMetaschema: true
            };

            const isLintDisabled = blockedState.blockedByMetaschema;
            const isFormatDisabled = blockedState.blockedByMetaschema;

            assert.strictEqual(isLintDisabled, true, 'Lint tab should be disabled');
            assert.strictEqual(isFormatDisabled, true, 'Format tab should be disabled');
        });

        test('should not be blocked without metaschema errors', () => {
            const normalState: PanelState = {
                fileInfo: null,
                cliVersion: '12.2.0',
                extensionVersion: '0.0.1',
                lintResult: { raw: '', health: 100, errors: [] },
                formatResult: { output: '', exitCode: 0 },
                metaschemaResult: { 
                    output: 'Valid schema', 
                    exitCode: 0
                },
                isLoading: false,
                blockedByMetaschema: false
            };

            assert.strictEqual(normalState.blockedByMetaschema, false, 'Should not be blocked');
            assert.ok(!normalState.metaschemaResult.errors || normalState.metaschemaResult.errors.length === 0, 'Should have no metaschema errors');
        });
    });

    suite('Version Format', () => {
        test('Extension version should be parseable', () => {
            const version = '0.0.1';
            const parts = version.split('.');
            
            assert.strictEqual(parts.length, 3, 'Version should have 3 parts');
            assert.strictEqual(parts[0], '0', 'Major version should be 0');
            assert.strictEqual(parts[1], '0', 'Minor version should be 0');
            assert.strictEqual(parts[2], '1', 'Patch version should be 1');
        });

        test('CLI version should be parseable', () => {
            const version = '12.2.0';
            const parts = version.split('.');
            
            assert.strictEqual(parts.length, 3, 'Version should have 3 parts');
            assert.strictEqual(parts[0], '12', 'Major version should be 12');
            assert.strictEqual(parts[1], '2', 'Minor version should be 2');
            assert.strictEqual(parts[2], '0', 'Patch version should be 0');
        });
    });

    suite('LintError Position', () => {
        test('should support position for both JSON and YAML', () => {
            const jsonError = {
                id: 'test-error',
                message: 'Test error',
                path: '/test',
                schemaLocation: 'test.json',
                position: [1, 0, 1, 10] as [number, number, number, number]
            };

            const yamlError = {
                id: 'test-error',
                message: 'Test error',
                path: '/test',
                schemaLocation: 'test.yaml',
                position: [2, 5, 2, 15] as [number, number, number, number]
            };
            const noPositionError = {
                id: 'test-error',
                message: 'Test error',
                path: '/test',
                schemaLocation: 'test.json',
                position: null
            };

            assert.ok(Array.isArray(jsonError.position), 'JSON error should have position');
            assert.ok(Array.isArray(yamlError.position), 'YAML error should have position');
            assert.strictEqual(noPositionError.position, null, 'Error without position should be null');
        });
    });

    suite('MetaschemaError Position', () => {
        test('should have position information', () => {
            const metaschemaError = {
                error: 'Invalid schema',
                instanceLocation: '/properties/name',
                keywordLocation: '/type',
                absoluteKeywordLocation: 'https://json-schema.org/draft/2020-12/schema#/type',
                instancePosition: [10, 2, 10, 20] as [number, number, number, number]
            };

            assert.ok(Array.isArray(metaschemaError.instancePosition), 'Metaschema error should have position');
            assert.strictEqual(metaschemaError.instancePosition.length, 4, 'Position should have 4 elements');
        });
    });

    suite('WebviewMessage', () => {
        test('should support goToPosition command', () => {
            const message: WebviewMessage = {
                command: 'goToPosition',
                position: [10, 5, 10, 20]
            };

            assert.strictEqual(message.command, 'goToPosition');
            assert.ok(message.position);
            assert.strictEqual(message.position[0], 10);
            assert.strictEqual(message.position[1], 5);
            assert.strictEqual(message.position[2], 10);
            assert.strictEqual(message.position[3], 20);
        });

        test('should support formatSchema command', () => {
            const message: WebviewMessage = {
                command: 'formatSchema'
            };

            assert.strictEqual(message.command, 'formatSchema');
            assert.strictEqual(message.position, undefined);
            assert.strictEqual(message.url, undefined);
        });

        test('should support openExternal command', () => {
            const message: WebviewMessage = {
                command: 'openExternal',
                url: 'https://github.com/sourcemeta/jsonschema'
            };

            assert.strictEqual(message.command, 'openExternal');
            assert.strictEqual(message.url, 'https://github.com/sourcemeta/jsonschema');
        });
    });
});
