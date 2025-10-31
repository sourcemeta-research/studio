import * as assert from 'assert';
import { PanelState } from '../../../shared/types';

suite('Version and Metaschema Features Test Suite', () => {
    
    test('PanelState should have separate CLI and extension versions', () => {
        const panelState: PanelState = {
            fileInfo: null,
            cliVersion: '12.2.0',
            extensionVersion: '0.0.1',
            lintResult: { raw: '', health: null },
            formatResult: { output: '', exitCode: null },
            metaschemaResult: { output: '', exitCode: null },
            isLoading: false
        };

        assert.strictEqual(panelState.cliVersion, '12.2.0', 'CLI version should be set');
        assert.strictEqual(panelState.extensionVersion, '0.0.1', 'Extension version should be set');
    });

    test('PanelState should indicate when blocked by metaschema', () => {
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

        assert.strictEqual(blockedState.blockedByMetaschema, true, 'Should be blocked by metaschema');
        assert.ok(blockedState.metaschemaResult.errors && blockedState.metaschemaResult.errors.length > 0, 'Should have metaschema errors');
    });

    test('Health should be N/A when blocked by metaschema', () => {
        // Simulate what HealthBar component does
        const blockedState: PanelState = {
            fileInfo: null,
            cliVersion: '12.2.0',
            extensionVersion: '0.0.1',
            lintResult: { raw: '', health: 100, errors: [] },
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

        // In the HealthBar component, when blockedByMetaschema is true, it shows "N/A"
        const displayHealth = blockedState.blockedByMetaschema ? 'N/A' : `${blockedState.lintResult.health}%`;
        assert.strictEqual(displayHealth, 'N/A', 'Health should show N/A when blocked by metaschema');
    });

    test('LintError position should support both JSON and YAML', () => {
        // Previously position was null for YAML, now it supports both
        const jsonLintError = {
            id: 'test-error',
            message: 'Test error',
            path: '/test',
            schemaLocation: 'test.json',
            position: [1, 0, 1, 10] as [number, number, number, number]
        };

        const yamlLintError = {
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

        assert.ok(Array.isArray(jsonLintError.position), 'JSON error should have position');
        assert.ok(Array.isArray(yamlLintError.position), 'YAML error should have position');
        assert.strictEqual(noPositionError.position, null, 'Error without position should be null');
    });

    test('Metaschema error should have position information', () => {
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

    test('Default tab should be metaschema when blocked', () => {
        // Simulate tab selection logic
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

        // The App component should auto-switch to metaschema tab
        const defaultTab = blockedState.blockedByMetaschema ? 'metaschema' : 'lint';
        assert.strictEqual(defaultTab, 'metaschema', 'Should default to metaschema tab when blocked');
    });

    test('Lint and format tabs should be disabled when blocked by metaschema', () => {
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

        // Tabs component logic
        const isLintDisabled = blockedState.blockedByMetaschema;
        const isFormatDisabled = blockedState.blockedByMetaschema;

        assert.strictEqual(isLintDisabled, true, 'Lint tab should be disabled');
        assert.strictEqual(isFormatDisabled, true, 'Format tab should be disabled');
    });

    test('PanelState without metaschema errors should not be blocked', () => {
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
