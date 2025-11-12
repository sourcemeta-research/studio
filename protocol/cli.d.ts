/**
 * CLI-related types
 * Types that represent CLI command results and errors
 */

export interface LintError {
  id: string;
  message: string;
  description?: string | null;
  path: string;
  schemaLocation: string;
  position: [number, number, number, number] | null;
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
  instancePosition?: [number, number, number, number];
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
