import * as vscode from 'vscode';
import * as path from 'path';
import { WebviewMessage, PanelState } from '../utils/types';
import { buildHtmlContent } from '../ui/templates/htmlBuilder';

/**
 * Manages the webview panel lifecycle and content
 */
export class PanelManager {
    private panel: vscode.WebviewPanel | undefined;
    private readonly iconPath: vscode.Uri;
    private messageHandler?: (message: WebviewMessage) => void;

    constructor(extensionPath: string) {
        this.iconPath = vscode.Uri.file(path.join(extensionPath, '..', 'assets', 'logo.svg'));
    }

    /**
     * Set the message handler for webview messages
     */
    setMessageHandler(handler: (message: WebviewMessage) => void): void {
        this.messageHandler = handler;
    }

    /**
     * Create or reveal the panel
     */
    createOrReveal(context: vscode.ExtensionContext): vscode.WebviewPanel {
        const columnToShowIn = vscode.window.activeTextEditor
            ? vscode.ViewColumn.Beside
            : vscode.ViewColumn.One;

        if (this.panel) {
            this.panel.reveal(columnToShowIn, true);
            return this.panel;
        }

        this.panel = vscode.window.createWebviewPanel(
            'sourcemetaStudio',
            'Sourcemeta Studio',
            {
                viewColumn: columnToShowIn,
                preserveFocus: false
            },
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        this.panel.iconPath = this.iconPath;

        // Handle messages from the webview
        this.panel.webview.onDidReceiveMessage(
            message => {
                if (this.messageHandler) {
                    this.messageHandler(message);
                }
            },
            undefined,
            context.subscriptions
        );

        // Handle panel disposal
        this.panel.onDidDispose(
            () => {
                this.panel = undefined;
            },
            null,
            context.subscriptions
        );

        return this.panel;
    }

    /**
     * Update the panel content
     */
    updateContent(state: PanelState): void {
        if (!this.panel) {
            return;
        }

        this.panel.webview.html = buildHtmlContent(state);
    }

    /**
     * Check if panel exists
     */
    exists(): boolean {
        return this.panel !== undefined;
    }

    /**
     * Get the panel (if it exists)
     */
    getPanel(): vscode.WebviewPanel | undefined {
        return this.panel;
    }

    /**
     * Dispose the panel
     */
    dispose(): void {
        if (this.panel) {
            this.panel.dispose();
            this.panel = undefined;
        }
    }
}
