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
    position: [number, number, number, number];
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

export type MetaschemaResult = CommandResult;
export type FormatResult = CommandResult;

export interface PanelState {
    fileInfo: FileInfo | null;
    version: string;
    lintResult: LintResult;
    formatResult: FormatResult;
    metaschemaResult: MetaschemaResult;
}
