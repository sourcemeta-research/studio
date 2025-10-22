import * as vscode from 'vscode';
import { PanelManager } from './panel/PanelManager';
import { CommandExecutor } from './commands/CommandExecutor';
import { DiagnosticManager } from './diagnostics/DiagnosticManager';
import { getFileInfo, parseLintResult, errorPositionToRange } from './utils/fileUtils';
import { WebviewMessage, PanelState, DiagnosticType } from '../shared/types';

let panelManager: PanelManager;
let commandExecutor: CommandExecutor;
let diagnosticManager: DiagnosticManager;
let lastActiveTextEditor: vscode.TextEditor | undefined;
let cachedVersion = 'Loading...';

/**
 * Extension activation
 */
export function activate(context: vscode.ExtensionContext): void {
    panelManager = new PanelManager(context.extensionPath);
    commandExecutor = new CommandExecutor(context.extensionPath);
    diagnosticManager = new DiagnosticManager();

    diagnosticManager.getCollections().forEach(collection => {
        context.subscriptions.push(collection);
    });

    panelManager.setMessageHandler((message: WebviewMessage) => {
        handleWebviewMessage(message);
    });

    const openPanelCommand = vscode.commands.registerCommand('sourcemeta-studio.openPanel', () => {
        panelManager.createOrReveal(context);
        updatePanelContent();
    });

    const activeEditorChangeListener = vscode.window.onDidChangeActiveTextEditor((editor) => {
        handleActiveEditorChange(editor);
    });

    if (vscode.window.activeTextEditor) {
        lastActiveTextEditor = vscode.window.activeTextEditor;
    }

    const documentSaveListener = vscode.workspace.onDidSaveTextDocument((document) => {
        handleDocumentSave(document);
    });

    context.subscriptions.push(
        openPanelCommand,
        activeEditorChangeListener,
        documentSaveListener
    );
}

/**
 * Handle messages from the webview
 */
function handleWebviewMessage(message: WebviewMessage): void {
    if (message.command === 'goToPosition' && lastActiveTextEditor && message.position) {
        const range = errorPositionToRange(message.position);

        lastActiveTextEditor.revealRange(range, vscode.TextEditorRevealType.InCenter);

        lastActiveTextEditor.selection = new vscode.Selection(range.start, range.end);

        vscode.window.showTextDocument(lastActiveTextEditor.document, lastActiveTextEditor.viewColumn);
    } else if (message.command === 'formatSchema' && lastActiveTextEditor) {
        commandExecutor.format(lastActiveTextEditor.document.uri.fsPath).then(() => {
            vscode.window.showTextDocument(lastActiveTextEditor!.document, lastActiveTextEditor!.viewColumn);
            updatePanelContent();
        }).catch((error) => {
            vscode.window.showErrorMessage(`Format failed: ${error.message}`);
        });
    }
}

/**
 * Handle active editor changes
 */
function handleActiveEditorChange(editor: vscode.TextEditor | undefined): void {
    if (panelManager.exists() && editor && editor.document.uri.scheme === 'file') {
        const panelColumn = panelManager.getPanel()?.viewColumn;
        const editorColumn = vscode.window.activeTextEditor?.viewColumn;

        if (panelColumn === editorColumn) {
            const targetColumn = panelColumn === vscode.ViewColumn.One
                ? vscode.ViewColumn.Two
                : vscode.ViewColumn.One;

            vscode.commands.executeCommand('workbench.action.closeActiveEditor').then(() => {
                vscode.window.showTextDocument(editor.document, {
                    viewColumn: targetColumn,
                    preview: false
                }).then(() => {
                    lastActiveTextEditor = vscode.window.activeTextEditor;
                });
            });
        } else {
            lastActiveTextEditor = editor;
        }
    } else if (editor && editor.document.uri.scheme === 'file') {
        lastActiveTextEditor = editor;
    }

    if (panelManager.exists()) {
        updatePanelContent();
    }
}

/**
 * Handle document save events
 */
function handleDocumentSave(document: vscode.TextDocument): void {
    if (panelManager.exists() && lastActiveTextEditor && 
        document.uri.fsPath === lastActiveTextEditor.document.uri.fsPath) {
        const fileInfo = getFileInfo(document.uri.fsPath);
        // Only refresh if it's a JSON/YAML file
        if (fileInfo) {
            updatePanelContent();
        }
    }
}

/**
 * Update the panel content with current file analysis
 */
async function updatePanelContent(): Promise<void> {
    if (!panelManager.exists()) {
        return;
    }

    const filePath = lastActiveTextEditor?.document.uri.fsPath;
    const fileInfo = getFileInfo(filePath);

    const loadingState: PanelState = {
        fileInfo,
        version: cachedVersion,
        lintResult: { raw: 'Loading...', health: null },
        formatResult: { output: 'Loading...', exitCode: null },
        metaschemaResult: { output: 'Loading...', exitCode: null }
    };
    panelManager.updateContent(loadingState);

    if (lastActiveTextEditor) {
        diagnosticManager.clearDiagnostics(lastActiveTextEditor.document.uri);
    }

    // Run all commands in parallel
    try {
        const [version, lintOutput, formatResult, metaschemaResult] = await Promise.all([
            commandExecutor.getVersion(),
            fileInfo ? commandExecutor.lint(fileInfo.absolutePath) : Promise.resolve('No file selected'),
            fileInfo ? commandExecutor.formatCheck(fileInfo.absolutePath) : Promise.resolve({ output: 'No file selected', exitCode: null }),
            fileInfo ? commandExecutor.metaschema(fileInfo.absolutePath) : Promise.resolve({ output: 'No file selected', exitCode: null })
        ]);

        cachedVersion = version;
        const lintResult = parseLintResult(lintOutput);

        const finalState: PanelState = {
            fileInfo,
            version: cachedVersion,
            lintResult,
            formatResult,
            metaschemaResult
        };
        panelManager.updateContent(finalState);

        if (lastActiveTextEditor && lintResult.errors && lintResult.errors.length > 0) {
            diagnosticManager.updateDiagnostics(
                lastActiveTextEditor.document.uri,
                lintResult.errors,
                DiagnosticType.Lint
            );
        }
    } catch (error) {
        cachedVersion = `Error: ${(error as Error).message}`;
        const errorState: PanelState = {
            fileInfo,
            version: cachedVersion,
            lintResult: { raw: `Error: ${(error as Error).message}`, health: null, error: true },
            formatResult: { output: `Error: ${(error as Error).message}`, exitCode: null },
            metaschemaResult: { output: `Error: ${(error as Error).message}`, exitCode: null }
        };
        panelManager.updateContent(errorState);
    }
}

/**
 * Extension deactivation
 */
export function deactivate(): void {
    if (panelManager) {
        panelManager.dispose();
    }
    if (diagnosticManager) {
        diagnosticManager.dispose();
    }
}
