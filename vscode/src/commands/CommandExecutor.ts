import { spawn, spawnSync } from "child_process";
import { join } from "path";
import * as fs from "fs";
import * as os from "os";
import { CommandResult } from "../../../protocol/types";

/**
 * Execute a CLI command and return the result
 */
export class CommandExecutor {
  private readonly extensionPath: string;
  private readonly executablePath: string;

  constructor(extensionPath: string) {
    this.extensionPath = extensionPath;

    const platform = this.resolvePlatform(os.platform());
    const architecture = this.resolveArchitecture(os.arch());

    const executableName =
      platform === "windows"
        ? `jsonschema-${platform}-${architecture}.exe`
        : `jsonschema-${platform}-${architecture}`;

    this.executablePath = join(
      extensionPath,
      "node_modules",
      "@sourcemeta",
      "jsonschema",
      executableName
    );

    if (!fs.existsSync(this.executablePath)) {
      throw new Error(
        `Unable to locate JSON Schema CLI executable at ${this.executablePath}`
      );
    }

    if (platform === "darwin") {
      try {
        spawnSync("/usr/bin/xattr", ["-c", this.executablePath], {
          stdio: "ignore",
        });
      } catch (error) {
        console.warn(
          `Failed to clear quarantine attributes for ${this.executablePath}: ${
            (error as Error).message
          }`
        );
      }
    }
  }

  /**
   * Execute a command with given arguments
   */
  private async executeCommand(args: string[]): Promise<CommandResult> {
    return new Promise((resolve, reject) => {
      const child = spawn(this.executablePath, args, {
        cwd: this.extensionPath,
        shell: false,
        windowsHide: true,
      });

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      child.on("close", (code) => {
        const output = stdout || stderr || "No output";
        resolve({
          output: output.trim(),
          exitCode: code,
        });
      });

      child.on("error", (error) => {
        reject(error);
      });
    });
  }

  /**
   * Get the JSON Schema CLI version
   */
  async getVersion(): Promise<string> {
    try {
      const result = await this.executeCommand(["version"]);
      return result.exitCode === 0
        ? result.output.trim()
        : `Error: ${result.output}`;
    } catch (error) {
      return `Error: ${(error as Error).message}`;
    }
  }

  /**
   * Run lint command on a file
   */
  async lint(filePath: string): Promise<string> {
    try {
      const result = await this.executeCommand(["lint", "--json", filePath]);
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
      return await this.executeCommand(["fmt", "--check", "--json", filePath]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Run format command on a file
   */
  async format(filePath: string): Promise<void> {
    const result = await this.executeCommand(["fmt", "--json", filePath]);
    if (result.exitCode !== 0) {
      try {
        const errorObj = JSON.parse(result.output);
        if (errorObj.error) {
          throw new Error(errorObj.error);
        }
      } catch {
        // If JSON parsing fails, use the raw output
      }
      throw new Error(
        result.output || `Process exited with code ${result.exitCode}`
      );
    }
  }

  /**
   * Run metaschema validation on a file
   */
  async metaschema(
    filePath: string,
    useHttp: boolean = true
  ): Promise<CommandResult> {
    try {
      const args = ["metaschema", "--json"];
      if (useHttp) {
        args.push("--http");
      }
      args.push(filePath);
      return await this.executeCommand(args);
    } catch (error) {
      throw error;
    }
  }

  private resolvePlatform(
    nodePlatform: NodeJS.Platform
  ): "windows" | "darwin" | "linux" {
    if (nodePlatform === "win32") {
      return "windows";
    }

    if (nodePlatform === "darwin") {
      return "darwin";
    }

    return "linux";
  }

  private resolveArchitecture(nodeArch: string): "x86_64" | "arm64" {
    if (nodeArch === "x64") {
      return "x86_64";
    }

    if (nodeArch === "arm64") {
      return "arm64";
    }

    throw new Error(`Unsupported processor architecture: ${nodeArch}`);
  }
}



