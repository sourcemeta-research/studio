import * as assert from 'assert';
import * as vscode from 'vscode';
import { DiagnosticManager } from '../../diagnostics/DiagnosticManager';
import { LintError, MetaschemaError, DiagnosticType } from '../../../shared/types';

suite('DiagnosticManager Test Suite', () => {
    let diagnosticManager: DiagnosticManager;
    let testUri: vscode.Uri;

    setup(() => {
        diagnosticManager = new DiagnosticManager();
        testUri = vscode.Uri.file('/test/file.json');
    });

    teardown(() => {
        diagnosticManager.dispose();
    });

    test('should create DiagnosticManager instance', () => {
        assert.ok(diagnosticManager, 'DiagnosticManager should be instantiated');
    });

    test('should have diagnostic collections', () => {
        const collections = diagnosticManager.getCollections();
        assert.strictEqual(collections.length, 2, 'Should have 2 diagnostic collections');
    });

    test('should update lint diagnostics', () => {
        const lintErrors: LintError[] = [
            {
                id: 'test-rule',
                message: 'Test error',
                description: 'Test description',
                path: '/test',
                schemaLocation: '/schema',
                position: [1, 1, 1, 10]
            }
        ];

        diagnosticManager.updateDiagnostics(testUri, lintErrors, DiagnosticType.Lint);
        
        const diagnostics = vscode.languages.getDiagnostics(testUri);
        assert.ok(diagnostics.length > 0, 'Should have diagnostics');
    });

    test('should create warning severity for lint errors', () => {
        const lintErrors: LintError[] = [
            {
                id: 'test-rule',
                message: 'Test warning',
                path: '/test',
                schemaLocation: '/schema',
                position: [1, 1, 1, 10]
            }
        ];

        diagnosticManager.updateDiagnostics(testUri, lintErrors, DiagnosticType.Lint);
        
        const diagnostics = vscode.languages.getDiagnostics(testUri);
        assert.strictEqual(
            diagnostics[0].severity,
            vscode.DiagnosticSeverity.Warning,
            'Lint errors should be warnings'
        );
    });

    test('should update metaschema diagnostics', () => {
        const metaschemaErrors: MetaschemaError[] = [
            {
                error: 'Schema validation failed',
                instanceLocation: '/properties/test',
                keywordLocation: '/properties',
                instancePosition: [5, 1, 5, 20]
            }
        ];

        diagnosticManager.updateMetaschemaDiagnostics(testUri, metaschemaErrors);
        
        const diagnostics = vscode.languages.getDiagnostics(testUri);
        assert.ok(diagnostics.length > 0, 'Should have metaschema diagnostics');
    });

    test('should create error severity for metaschema errors', () => {
        const metaschemaErrors: MetaschemaError[] = [
            {
                error: 'Schema validation failed',
                instanceLocation: '/properties/test',
                keywordLocation: '/properties',
                instancePosition: [5, 1, 5, 20]
            }
        ];

        diagnosticManager.updateMetaschemaDiagnostics(testUri, metaschemaErrors);
        
        const diagnostics = vscode.languages.getDiagnostics(testUri);
        assert.strictEqual(
            diagnostics[0].severity,
            vscode.DiagnosticSeverity.Error,
            'Metaschema errors should be errors'
        );
    });

    test('should filter out metaschema errors without position', () => {
        const metaschemaErrors: MetaschemaError[] = [
            {
                error: 'Error with position',
                instanceLocation: '/test1',
                keywordLocation: '/keyword1',
                instancePosition: [1, 1, 1, 10]
            },
            {
                error: 'Error without position',
                instanceLocation: '/test2',
                keywordLocation: '/keyword2'
                // No instancePosition
            }
        ];

        diagnosticManager.updateMetaschemaDiagnostics(testUri, metaschemaErrors);
        
        const diagnostics = vscode.languages.getDiagnostics(testUri);
        assert.strictEqual(
            diagnostics.length,
            1,
            'Should only create diagnostics for errors with position'
        );
    });

    test('should clear diagnostics', () => {
        const lintErrors: LintError[] = [
            {
                id: 'test-rule',
                message: 'Test error',
                path: '/test',
                schemaLocation: '/schema',
                position: [1, 1, 1, 10]
            }
        ];

        diagnosticManager.updateDiagnostics(testUri, lintErrors, DiagnosticType.Lint);
        assert.ok(vscode.languages.getDiagnostics(testUri).length > 0, 'Should have diagnostics');

        diagnosticManager.clearDiagnostics(testUri);
        assert.strictEqual(
            vscode.languages.getDiagnostics(testUri).length,
            0,
            'Should clear diagnostics'
        );
    });

    test('should set correct diagnostic source', () => {
        const lintErrors: LintError[] = [
            {
                id: 'test-rule',
                message: 'Test error',
                path: '/test',
                schemaLocation: '/schema',
                position: [1, 1, 1, 10]
            }
        ];

        diagnosticManager.updateDiagnostics(testUri, lintErrors, DiagnosticType.Lint);
        
        const diagnostics = vscode.languages.getDiagnostics(testUri);
        assert.ok(
            diagnostics[0].source?.includes('Sourcemeta Studio'),
            'Should have correct source'
        );
    });

    test('should add related information for lint errors with description', () => {
        const lintErrors: LintError[] = [
            {
                id: 'test-rule',
                message: 'Test error',
                description: 'This is a detailed description',
                path: '/test/path',
                schemaLocation: '/schema/location',
                position: [1, 1, 1, 10]
            }
        ];

        diagnosticManager.updateDiagnostics(testUri, lintErrors, DiagnosticType.Lint);
        
        const diagnostics = vscode.languages.getDiagnostics(testUri);
        assert.ok(diagnostics[0].relatedInformation, 'Should have related information');
        const relatedInfo = diagnostics[0].relatedInformation || [];
        assert.ok(
            relatedInfo.length >= 3,
            'Should have at least 3 related info items (description, path, schema)'
        );
    });

    test('should add clickable code with link for lint errors', () => {
        const lintErrors: LintError[] = [
            {
                id: 'unknown_keywords_prefix',
                message: 'Test error',
                path: '/test',
                schemaLocation: '/schema',
                position: [1, 1, 1, 10]
            }
        ];

        diagnosticManager.updateDiagnostics(testUri, lintErrors, DiagnosticType.Lint);
        
        const diagnostics = vscode.languages.getDiagnostics(testUri);
        assert.ok(diagnostics[0].code, 'Should have code');
        assert.ok(
            typeof diagnostics[0].code === 'object' && 'target' in diagnostics[0].code,
            'Code should be an object with target link'
        );
    });

    test('should add related information for metaschema errors', () => {
        const metaschemaErrors: MetaschemaError[] = [
            {
                error: 'Validation failed',
                instanceLocation: '/properties/test',
                keywordLocation: '/properties',
                absoluteKeywordLocation: 'http://example.com/schema',
                instancePosition: [5, 1, 5, 20]
            }
        ];

        diagnosticManager.updateMetaschemaDiagnostics(testUri, metaschemaErrors);
        
        const diagnostics = vscode.languages.getDiagnostics(testUri);
        assert.ok(diagnostics[0].relatedInformation, 'Should have related information');
        const relatedInfo = diagnostics[0].relatedInformation || [];
        assert.ok(
            relatedInfo.length >= 3,
            'Should have at least 3 related info items'
        );
    });

    test('should handle errors without optional fields', () => {
        const lintErrors: LintError[] = [
            {
                id: 'test-rule',
                message: 'Test error',
                path: '/test',
                schemaLocation: '/schema',
                position: [1, 1, 1, 10]
                // No description
            }
        ];

        diagnosticManager.updateDiagnostics(testUri, lintErrors, DiagnosticType.Lint);
        
        const diagnostics = vscode.languages.getDiagnostics(testUri);
        assert.strictEqual(diagnostics.length, 1, 'Should create diagnostic even without description');
    });

    test('should filter out lint errors with null positions (YAML files)', () => {
        const lintErrors: LintError[] = [
            {
                id: 'error-with-position',
                message: 'Error with position',
                path: '/test1',
                schemaLocation: '/schema1',
                position: [1, 1, 1, 10]
            },
            {
                id: 'error-without-position',
                message: 'Error without position (YAML)',
                path: '/test2',
                schemaLocation: '/schema2',
                position: null
            }
        ];

        diagnosticManager.updateDiagnostics(testUri, lintErrors, DiagnosticType.Lint);
        
        const diagnostics = vscode.languages.getDiagnostics(testUri);
        assert.strictEqual(
            diagnostics.length,
            1,
            'Should only create diagnostics for errors with non-null position'
        );
        assert.strictEqual(
            diagnostics[0].message,
            'Error with position',
            'Should only include error with position'
        );
    });

    test('should handle all null positions (YAML lint errors)', () => {
        const lintErrors: LintError[] = [
            {
                id: 'yaml-error-1',
                message: 'YAML error 1',
                path: '/test1',
                schemaLocation: '/schema1',
                position: null
            },
            {
                id: 'yaml-error-2',
                message: 'YAML error 2',
                path: '/test2',
                schemaLocation: '/schema2',
                position: null
            }
        ];

        diagnosticManager.updateDiagnostics(testUri, lintErrors, DiagnosticType.Lint);
        
        const diagnostics = vscode.languages.getDiagnostics(testUri);
        assert.strictEqual(
            diagnostics.length,
            0,
            'Should not create any diagnostics when all positions are null'
        );
    });
});
