import * as vscode from 'vscode';
import { LintError, MetaschemaError, DiagnosticType } from '../../shared/types';
import { errorPositionToRange } from '../utils/fileUtils';

/**
 * Manages VS Code diagnostics for lint and metaschema errors
 */
export class DiagnosticManager {
    private lintDiagnostics: vscode.DiagnosticCollection;
    private metaschemaDiagnostics: vscode.DiagnosticCollection;

    constructor() {
        this.lintDiagnostics = vscode.languages.createDiagnosticCollection('sourcemeta-studio-lint');
        this.metaschemaDiagnostics = vscode.languages.createDiagnosticCollection('sourcemeta-studio-metaschema');
    }

    /**
     * Update diagnostics for a document
     */
    updateDiagnostics(
        documentUri: vscode.Uri,
        errors: LintError[],
        type: DiagnosticType
    ): void {
        const diagnostics = errors.map(error => {
            const range = errorPositionToRange(error.position);

            const diagnostic = new vscode.Diagnostic(
                range,
                error.message,
                type === DiagnosticType.Lint 
                    ? vscode.DiagnosticSeverity.Warning 
                    : vscode.DiagnosticSeverity.Error
            );

            // Set the source
            diagnostic.source = type === DiagnosticType.Lint 
                ? 'Sourcemeta Studio (Lint)' 
                : 'Sourcemeta Studio (Metaschema)';

            // Add error ID as code
            if (error.id) {
                diagnostic.code = error.id;
            }

            return diagnostic;
        });

        const collection = type === DiagnosticType.Lint 
            ? this.lintDiagnostics 
            : this.metaschemaDiagnostics;
        
        collection.set(documentUri, diagnostics);
    }

    /**
     * Update metaschema diagnostics for a document
     */
    updateMetaschemaDiagnostics(
        documentUri: vscode.Uri,
        errors: MetaschemaError[]
    ): void {
        const diagnostics = errors
            .filter(error => error.instancePosition)
            .map(error => {
                const position = error.instancePosition as [number, number, number, number];
                const range = errorPositionToRange(position);

                const diagnostic = new vscode.Diagnostic(
                    range,
                    error.error,
                    vscode.DiagnosticSeverity.Error
                );

                diagnostic.source = 'Sourcemeta Studio (Metaschema)';

                if (error.instanceLocation) {
                    diagnostic.code = error.instanceLocation;
                }

                return diagnostic;
            });

        this.metaschemaDiagnostics.set(documentUri, diagnostics);
    }

    /**
     * Clear diagnostics for a document
     */
    clearDiagnostics(documentUri: vscode.Uri, type?: DiagnosticType): void {
        if (!type || type === DiagnosticType.Lint) {
            this.lintDiagnostics.delete(documentUri);
        }
        if (!type || type === DiagnosticType.Metaschema) {
            this.metaschemaDiagnostics.delete(documentUri);
        }
    }

    /**
     * Clear all diagnostics
     */
    clearAll(): void {
        this.lintDiagnostics.clear();
        this.metaschemaDiagnostics.clear();
    }

    /**
     * Dispose of the diagnostic collections
     */
    dispose(): void {
        this.lintDiagnostics.dispose();
        this.metaschemaDiagnostics.dispose();
    }

    /**
     * Get the diagnostic collections for registration
     */
    getCollections(): vscode.DiagnosticCollection[] {
        return [this.lintDiagnostics, this.metaschemaDiagnostics];
    }
}
