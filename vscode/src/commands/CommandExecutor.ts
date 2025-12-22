import { spawn } from '@sourcemeta/jsonschema';
import { CommandResult } from '../../../protocol/types';

/**
 * Execute a CLI command and return the result
 */
export class CommandExecutor {
    /**
     * Execute a command with given arguments
     */
    private async executeCommand(args: string[], json: boolean = true): Promise<CommandResult> {
        try {
            const result = await spawn(args, { json });
            const output = json && typeof result.stdout !== 'string'
                ? JSON.stringify(result.stdout)
                : (result.stdout || result.stderr || 'No output');
            return {
                output: typeof output === 'string' ? output.trim() : JSON.stringify(output).trim(),
                exitCode: result.code
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get the JSON Schema CLI version
     */
    async getVersion(): Promise<string> {
        try {
            const result = await this.executeCommand(['version'], false);
            return result.exitCode === 0 ? result.output.trim() : `Error: ${result.output}`;
        } catch (error) {
            return `Error: ${(error as Error).message}`;
        }
    }

    /**
     * Run lint command on a file
     */
    async lint(filePath: string, useHttp: boolean = true): Promise<string> {
        try {
            const args = ['lint'];
            if (useHttp) {
                args.push('--http');
            }
            args.push(filePath);
            const result = await this.executeCommand(args, true);
            return result.output;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Run format check command on a file
     */
    async formatCheck(filePath: string, useHttp: boolean = true): Promise<CommandResult> {
        try {
            const args = ['fmt', '--check'];
            if (useHttp) {
                args.push('--http');
            }
            args.push(filePath);
            return await this.executeCommand(args, true);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Run format command on a file
     */
    async format(filePath: string, useHttp: boolean = true): Promise<void> {
        const args = ['fmt'];
        if (useHttp) {
            args.push('--http');
        }
        args.push(filePath);
        const result = await this.executeCommand(args, true);
        if (result.exitCode !== 0) {
            try {
                const errorObj = JSON.parse(result.output);
                if (errorObj.error) {
                    throw new Error(errorObj.error);
                }
            } catch {
                // If JSON parsing fails, use the raw output
            }
            throw new Error(result.output || `Process exited with code ${result.exitCode}`);
        }
    }

    /**
     * Run metaschema validation on a file
     */
    async metaschema(filePath: string, useHttp: boolean = true): Promise<CommandResult> {
        try {
            const args = ['metaschema'];
            if (useHttp) {
                args.push('--http');
            }
            args.push(filePath);
            return await this.executeCommand(args, true);
        } catch (error) {
            throw error;
        }
    }
}
