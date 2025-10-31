import * as assert from 'assert';
import { DiagnosticType } from '../../../shared/types';
import type { PanelState, WebviewMessage } from '../../../shared/types';

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
                version: '1.0.0',
                lintResult: { raw: '', health: null },
                formatResult: { output: '', exitCode: null },
                metaschemaResult: { output: '', exitCode: null },
                isLoading: false,
                hasParseErrors: false,
                blockedByMetaschema: false
            };

            assert.ok(state.hasOwnProperty('fileInfo'));
            assert.ok(state.hasOwnProperty('version'));
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
                version: '1.0.0',
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
                version: '1.0.0',
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
                version: '1.0.0',
                lintResult: { raw: '', health: null },
                formatResult: { output: '', exitCode: null },
                metaschemaResult: { output: '', exitCode: null }
            };

            assert.strictEqual(state.fileInfo?.isYaml, true);
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
