import { spawn } from 'child_process';
import { join } from 'path';
import { CommandResult } from '../../../protocol/types';

/**
 * Execute a CLI command and return the result
 */
export class CommandExecutor {
    private readonly extensionPath: string;
    private readonly cliPath: string;

    constructor(extensionPath: string) {
        this.extensionPath = extensionPath;
        this.cliPath = join(extensionPath, 'node_modules', '@sourcemeta', 'jsonschema', 'cli.js');
    }

    /**
     * Execute a command with given arguments
     */
    private async executeCommand(args: string[]): Promise<CommandResult> {
        return new Promise((resolve, reject) => {
            const child = spawn(process.execPath, [this.cliPath, ...args], {
                cwd: this.extensionPath,
                shell: false,
                // Do not open a command prompt on spawning
                windowsHide: true
            });

            let stdout = '';
            let stderr = '';

            child.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            child.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            child.on('close', (code) => {
                const output = stdout || stderr || 'No output';
                resolve({
                    output: output.trim(),
                    exitCode: code
                });
            });

            child.on('error', (error) => {
                reject(error);
            });
        });
    }

    /**
     * Get the JSON Schema CLI version
     */
    async getVersion(): Promise<string> {
        try {
            const result = await this.executeCommand(['version']);
            return result.exitCode === 0 ? result.output.trim() : `Error: ${result.output}`;
        } catch (error) {
            return `Error: ${(error as Error).message}`;
        }
    }

    /**
     * Run lint command on a file
     */
    async lint(filePath: string): Promise<string> {
        try {
            const result = await this.executeCommand(['lint', '--json', filePath]);
            return result.output;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Run format check command on a file
     */
    async formatCheck(filePath: string): Promise<CommandResult> {
        try {
            return await this.executeCommand(['fmt', '--check', '--json', filePath]);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Run format command on a file
     */
    async format(filePath: string): Promise<void> {
        const result = await this.executeCommand(['fmt', '--json', filePath]);
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
            const args = ['metaschema', '--json'];
            if (useHttp) {
                args.push('--http');
            }
            args.push(filePath);
            return await this.executeCommand(args);
        } catch (error) {
            throw error;
        }
    }
}
