import * as path from 'path';
import * as vscode from 'vscode';
import { FileInfo, LintResult, MetaschemaResult } from '../../shared/types';

/**
 * Get information about a file path
 */
export function getFileInfo(filePath: string | undefined): FileInfo | null {
    if (!filePath) {
        return null;
    }

    // Check if file is JSON or YAML
    const extension = path.extname(filePath).toLowerCase();
    const isValidFile = ['.json', '.yaml', '.yml'].includes(extension);

    if (!isValidFile) {
        return null;
    }

    // Get relative path if workspace folder exists
    const workspaceFolders = vscode.workspace.workspaceFolders;
    let displayPath = filePath;

    if (workspaceFolders && workspaceFolders.length > 0) {
        const workspaceRoot = workspaceFolders[0].uri.fsPath;
        if (filePath.startsWith(workspaceRoot)) {
            displayPath = path.relative(workspaceRoot, filePath);
        }
    }

    return {
        absolutePath: filePath,
        displayPath: displayPath,
        fileName: path.basename(filePath)
    };
}

/**
 * Parse lint command output
 */
export function parseLintResult(lintOutput: string): LintResult {
    try {
        const parsed = JSON.parse(lintOutput);
        return {
            raw: lintOutput,
            health: parsed.health,
            valid: parsed.valid,
            errors: parsed.errors || []
        };
    } catch (error) {
        console.error('Failed to parse lint result:', error instanceof Error ? error.message : String(error));
        return {
            raw: lintOutput,
            health: null,
            error: true
        };
    }
}

/**
 * Parse metaschema command output
 */
export function parseMetaschemaResult(output: string, exitCode: number | null): MetaschemaResult {
    const result: MetaschemaResult = { output, exitCode };
    
    // Exit code 2 means validation failed
    if (exitCode === 2) {
        try {
            const parsed = JSON.parse(output);
            if (parsed.valid === false && Array.isArray(parsed.errors)) {
                result.errors = parsed.errors.map((error: { 
                    error?: string; 
                    instanceLocation?: string; 
                    keywordLocation?: string; 
                    absoluteKeywordLocation?: string;
                    instancePosition?: [number, number, number, number];
                }) => ({
                    error: error.error || 'Validation error',
                    instanceLocation: error.instanceLocation || '',
                    keywordLocation: error.keywordLocation || '',
                    absoluteKeywordLocation: error.absoluteKeywordLocation,
                    instancePosition: error.instancePosition
                }));
            }
        } catch (error) {
            console.error('Failed to parse metaschema result:', error instanceof Error ? error.message : String(error));
            // If parsing fails, just keep the raw output
        }
    }
    
    return result;
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(text: string): string {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Convert VS Code position to 1-based array format
 */
export function positionToArray(position: vscode.Position): [number, number] {
    return [position.line + 1, position.character + 1];
}

/**
 * Convert 1-based array format to VS Code position
 */
export function arrayToPosition(arr: [number, number]): vscode.Position {
    return new vscode.Position(arr[0] - 1, arr[1] - 1);
}

/**
 * Convert error position array to VS Code range
 * Position array is 1-based and inclusive, VS Code is 0-based and end-exclusive
 */
export function errorPositionToRange(position: [number, number, number, number]): vscode.Range {
    const [lineStart, columnStart, lineEnd, columnEnd] = position;
    return new vscode.Range(
        new vscode.Position(lineStart - 1, columnStart - 1),
        new vscode.Position(lineEnd - 1, columnEnd)
    );
}
