import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { WebviewMessage, PanelState } from '../../../shared/types';

/**
 * Manages the webview panel lifecycle and content
 */
export class PanelManager {
    private panel: vscode.WebviewPanel | undefined;
    private readonly iconPath: vscode.Uri;
    private readonly extensionPath: string;
    private messageHandler?: (message: WebviewMessage) => void;

    constructor(extensionPath: string) {
        this.extensionPath = extensionPath;
        this.iconPath = vscode.Uri.file(path.join(extensionPath, '..', 'assets', 'logo.png'));
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
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(this.extensionPath, '..', 'build', 'ui'))
                ]
            }
        );

        this.panel.iconPath = this.iconPath;

        // Set initial HTML content
        this.panel.webview.html = this.getHtmlContent(this.panel.webview);

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
     * Update the panel content (send state to React)
     */
    updateContent(state: PanelState): void {
        if (!this.panel) {
            return;
        }
        
        // Send state update to React webview
        this.panel.webview.postMessage({
            type: 'update',
            state: state
        });
    }

    /**
     * Get HTML content for the webview (load React build)
     */
    private getHtmlContent(_webview: vscode.Webview): string {
        const distPath = path.join(this.extensionPath, '..', 'build', 'ui');
        const indexPath = path.join(distPath, 'index.html');

        const html = fs.readFileSync(indexPath, 'utf-8');

        return html;
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
