/**
 * Shared TypeScript interfaces and types
 */

export interface FileInfo {
    absolutePath: string;
    displayPath: string;
    fileName: string;
    lineCount?: number;
    isYaml?: boolean;
}

export interface LintError {
    id: string;
    message: string;
    description?: string | null;
    path: string;
    schemaLocation: string;
    position: [number, number, number, number] | null; // [lineStart, colStart, lineEnd, colEnd], null for YAML
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

export interface MetaschemaError {
    error: string;
    instanceLocation: string;
    keywordLocation: string;
    absoluteKeywordLocation?: string;
    instancePosition?: [number, number, number, number]; // [lineStart, colStart, lineEnd, colEnd]
}

export interface MetaschemaResult extends CommandResult {
    errors?: MetaschemaError[];
}

export type FormatResult = CommandResult;

export interface PanelState {
    fileInfo: FileInfo | null;
    version: string;
    lintResult: LintResult;
    formatResult: FormatResult;
    metaschemaResult: MetaschemaResult;
    isLoading?: boolean;
    formatLoading?: boolean;
}

export interface WebviewMessage {
    command: 'goToPosition' | 'formatSchema' | 'openExternal';
    position?: [number, number, number, number];
    url?: string;
}

export const DiagnosticType = {
    Lint: 'lint',
    Metaschema: 'metaschema'
} as const;

export type DiagnosticType = typeof DiagnosticType[keyof typeof DiagnosticType];

export interface TabStatus {
    indicator: string;
    cssClass: string;
}

export interface HealthBarData {
    health: number | null;
    color: string;
    html: string;
}
