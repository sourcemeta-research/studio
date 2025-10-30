import { spawn } from 'child_process';
import { CommandResult } from '../../shared/types';

/**
 * Execute a CLI command and return the result
 */
export class CommandExecutor {
    private readonly extensionPath: string;

    constructor(extensionPath: string) {
        this.extensionPath = extensionPath;
    }

    /**
     * Execute a command with given arguments
     */
    private async executeCommand(args: string[]): Promise<CommandResult> {
        return new Promise((resolve, reject) => {
            const npxPath = process.platform === 'win32' ? 'npx.cmd' : 'npx';
            const child = spawn(npxPath, args, {
                cwd: this.extensionPath,
                shell: true
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
            const result = await this.executeCommand(['jsonschema', 'version']);
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
            const result = await this.executeCommand(['jsonschema', 'lint', '--json', filePath]);
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
            return await this.executeCommand(['jsonschema', 'fmt', '--check', filePath]);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Run format command on a file
     */
    async format(filePath: string): Promise<void> {
        const result = await this.executeCommand(['jsonschema', 'fmt', filePath]);
        if (result.exitCode !== 0) {
            throw new Error(result.output || `Process exited with code ${result.exitCode}`);
        }
    }

    /**
     * Run metaschema validation on a file
     */
    async metaschema(filePath: string, useHttp: boolean = true): Promise<CommandResult> {
        try {
            const args = ['jsonschema', 'metaschema', '--json'];
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
