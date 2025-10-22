/**
 * CSS styles for the webview panel
 */
export function getStyles(): string {
    return `
        body {
            padding: 20px;
            color: var(--vscode-foreground);
            font-family: var(--vscode-font-family);
            display: flex;
            flex-direction: column;
            height: calc(100vh - 40px);
        }
        h1 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 16px;
        }
        .schema-info {
            margin-bottom: 20px;
            padding: 12px;
            background: var(--vscode-editor-inactiveSelectionBackground);
            border-radius: 4px;
            border-left: 3px solid var(--vscode-focusBorder);
        }
        .schema-label {
            color: var(--vscode-descriptionForeground);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 0 0 6px 0;
            font-weight: 600;
        }
        .file-path {
            color: var(--vscode-foreground);
            font-size: 13px;
            word-break: break-all;
            margin: 0;
            font-family: var(--vscode-editor-font-family);
        }
        .no-file {
            color: var(--vscode-descriptionForeground);
            font-size: 14px;
            font-style: italic;
            margin: 0;
            margin-bottom: 20px;
        }
        .tabs {
            display: flex;
            border-bottom: 1px solid var(--vscode-panel-border);
            margin-bottom: 20px;
        }
        .tab {
            padding: 8px 16px;
            cursor: pointer;
            border: none;
            background: none;
            color: var(--vscode-descriptionForeground);
            font-family: var(--vscode-font-family);
            font-size: 13px;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .tab:hover {
            color: var(--vscode-foreground);
        }
        .tab.active {
            color: var(--vscode-foreground);
            border-bottom-color: var(--vscode-focusBorder);
        }
        .tab-indicator {
            font-size: 14px;
            font-weight: bold;
        }
        .tab-success .tab-indicator {
            color: #4caf50;
        }
        .tab-warning .tab-indicator {
            color: #ff9800;
        }
        .tab-error .tab-indicator {
            color: #f44336;
        }
        .tab-fatal .tab-indicator {
            color: #9c27b0;
        }
        .health-bar-container {
            margin-bottom: 20px;
        }
        .health-bar-label {
            color: var(--vscode-foreground);
            font-size: 12px;
            margin-bottom: 6px;
            font-weight: 600;
        }
        .health-bar-background {
            width: 100%;
            height: 8px;
            background: var(--vscode-editor-inactiveSelectionBackground);
            border-radius: 4px;
            overflow: hidden;
        }
        .health-bar-fill {
            height: 100%;
            transition: width 0.3s ease;
            border-radius: 4px;
        }
        .tab-content {
            flex: 1;
            overflow-y: auto;
            display: none;
        }
        .tab-content.active {
            display: block;
        }
        .lint-success {
            text-align: center;
            padding: 40px 20px;
        }
        .lint-success-icon {
            font-size: 48px;
            color: #4caf50;
            margin-bottom: 16px;
        }
        .lint-success-message {
            font-size: 18px;
            font-weight: 600;
            color: var(--vscode-foreground);
            margin-bottom: 8px;
        }
        .lint-success-subtitle {
            font-size: 13px;
            color: var(--vscode-descriptionForeground);
        }
        .lint-errors-container {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 20px;
        }
        .lint-error {
            background: var(--vscode-editor-inactiveSelectionBackground);
            border-left: 3px solid #ff9800;
            border-radius: 4px;
            padding: 12px;
            cursor: pointer;
            transition: background 0.2s;
        }
        .lint-error:hover {
            background: var(--vscode-list-hoverBackground);
        }
        .lint-error-header {
            margin-bottom: 8px;
        }
        .lint-error-message {
            color: var(--vscode-foreground);
            font-size: 13px;
            font-weight: 600;
        }
        .lint-error-description {
            color: var(--vscode-descriptionForeground);
            font-size: 12px;
            margin-bottom: 8px;
            white-space: pre-wrap;
            font-family: var(--vscode-editor-font-family);
        }
        .lint-error-meta {
            display: flex;
            flex-direction: column;
            gap: 4px;
            font-size: 11px;
        }
        .lint-error-meta-item {
            display: flex;
            gap: 6px;
        }
        .lint-error-meta-label {
            color: var(--vscode-descriptionForeground);
            font-weight: 600;
            min-width: 60px;
        }
        .lint-error-meta-value {
            color: var(--vscode-foreground);
            font-family: var(--vscode-editor-font-family);
        }
        .code-block {
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            padding: 12px;
            overflow-x: auto;
        }
        .code-block pre {
            margin: 0;
            font-family: var(--vscode-editor-font-family);
            font-size: 12px;
            color: var(--vscode-editor-foreground);
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .raw-output-section {
            margin-top: 20px;
        }
        .raw-output-header {
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            padding: 8px 0;
            user-select: none;
        }
        .raw-output-header:hover {
            opacity: 0.8;
        }
        .raw-output-toggle {
            color: var(--vscode-descriptionForeground);
            font-size: 10px;
            transition: transform 0.2s;
        }
        .raw-output-toggle.expanded {
            transform: rotate(90deg);
        }
        .raw-output-label {
            color: var(--vscode-descriptionForeground);
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
        }
        .raw-output-content {
            display: none;
            margin-top: 8px;
        }
        .raw-output-content.expanded {
            display: block;
        }
        .raw-output-content .code-block pre {
            font-size: 10px;
        }
        .format-needs-formatting {
            text-align: center;
            padding: 40px 20px;
        }
        .format-message {
            color: var(--vscode-foreground);
            font-size: 14px;
            margin-bottom: 20px;
        }
        .format-button {
            padding: 10px 24px;
            cursor: pointer;
            border: 1px solid var(--vscode-button-border);
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            font-family: var(--vscode-font-family);
            font-size: 14px;
            border-radius: 2px;
            font-weight: 600;
        }
        .format-button:hover {
            background: var(--vscode-button-hoverBackground);
        }
        .metaschema-fatal {
            text-align: center;
            padding: 40px 20px;
        }
        .metaschema-fatal-icon {
            font-size: 48px;
            color: #9c27b0;
            margin-bottom: 16px;
        }
        .metaschema-fatal-message {
            font-size: 18px;
            font-weight: 600;
            color: var(--vscode-foreground);
            margin-bottom: 8px;
        }
        .metaschema-fatal-subtitle {
            font-size: 13px;
            color: var(--vscode-descriptionForeground);
        }
        .metaschema-errors {
            margin-bottom: 20px;
        }
        .footer {
            margin-top: auto;
            padding-top: 20px;
            border-top: 1px solid var(--vscode-panel-border);
        }
        .version {
            color: var(--vscode-descriptionForeground);
            font-size: 11px;
            margin: 0;
        }
    `;
}
