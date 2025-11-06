/**
 * Shared types between VSCode extension and webview
 * These types define the communication contract
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

export interface CliError {
    error: string;
    line?: number;
    column?: number;
    filePath?: string;
    identifier?: string;
    location?: string;
    rule?: string;
    testNumber?: number;
    uri?: string;
    command?: string;
    option?: string;
}

export interface MetaschemaResult extends CommandResult {
    errors?: (MetaschemaError | CliError)[];
}

export type FormatResult = CommandResult;

export interface PanelState {
    fileInfo: FileInfo | null;
    cliVersion: string;
    extensionVersion: string;
    lintResult: LintResult;
    formatResult: FormatResult;
    metaschemaResult: MetaschemaResult;
    isLoading?: boolean;
    formatLoading?: boolean;
    hasParseErrors?: boolean;
    blockedByMetaschema?: boolean;
}

export interface WebviewMessage {
    command: 'goToPosition' | 'formatSchema' | 'openExternal';
    position?: [number, number, number, number];
    url?: string;
}
