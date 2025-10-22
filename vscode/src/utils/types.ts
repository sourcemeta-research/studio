/**
 * Shared TypeScript interfaces and types for the Sourcemeta Studio extension
 */

export interface FileInfo {
    absolutePath: string;
    displayPath: string;
    fileName: string;
}

export interface LintError {
    id: string;
    message: string;
    description?: string;
    path: string;
    schemaLocation: string;
    position: [number, number, number, number]; // [lineStart, colStart, lineEnd, colEnd]
}

export interface LintResult {
    raw: string;
    health: number | null;
    valid?: boolean;
    errors?: LintError[];
    error?: boolean;
}

export interface CommandResult {
    output: string;
    exitCode: number | null;
}

export interface MetaschemaResult extends CommandResult {}
export interface FormatResult extends CommandResult {}

export interface WebviewMessage {
    command: 'goToPosition' | 'formatSchema';
    position?: [number, number, number, number];
}

export interface PanelState {
    fileInfo: FileInfo | null;
    version: string;
    lintResult: LintResult;
    formatResult: FormatResult;
    metaschemaResult: MetaschemaResult;
}

export enum DiagnosticType {
    Lint = 'lint',
    Metaschema = 'metaschema'
}

export interface TabStatus {
    indicator: string;
    cssClass: string;
}

export interface HealthBarData {
    health: number | null;
    color: string;
    html: string;
}
