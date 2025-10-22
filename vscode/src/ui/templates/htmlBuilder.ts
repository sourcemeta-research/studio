import { PanelState } from '../../utils/types';
import { escapeHtml } from '../../utils/fileUtils';
import { buildHealthBar, buildFileInfoSection, buildLintErrorsHtml, calculateLintTabStatus } from '../builders/LintBuilder';
import { buildFormatResultHtml, buildMetaschemaResultHtml, calculateFormatTabStatus, calculateMetaschemaTabStatus } from '../builders/ResultBuilders';
import { getStyles } from './styles';
import { getScripts } from './scripts.js';

/**
 * Build raw output section HTML
 */
function buildRawOutputSection(id: string, output: string): string {
    const escapedOutput = escapeHtml(output);
    return `
        <div class="raw-output-section">
            <div class="raw-output-header" onclick="toggleRawOutput('${id}')">
                <span class="raw-output-toggle" id="${id}-raw-toggle">▶</span>
                <span class="raw-output-label">Raw Output</span>
            </div>
            <div class="raw-output-content" id="${id}-raw-output-content">
                <div class="code-block">
                    <pre>${escapedOutput}</pre>
                </div>
            </div>
        </div>
    `;
}

/**
 * Generate the complete HTML content for the webview
 */
export function buildHtmlContent(state: PanelState): string {
    const { fileInfo, version, lintResult, formatResult, metaschemaResult } = state;

    // Build components
    const fileInfoHtml = buildFileInfoSection(fileInfo);
    const healthBar = buildHealthBar(lintResult);
    const lintErrorsHtml = buildLintErrorsHtml(lintResult);
    const formatResultHtml = buildFormatResultHtml(formatResult);
    const metaschemaResultHtml = buildMetaschemaResultHtml(metaschemaResult);

    // Calculate tab statuses
    const lintTabStatus = calculateLintTabStatus(lintResult);
    const formatTabStatus = calculateFormatTabStatus(formatResult);
    const metaschemaTabStatus = calculateMetaschemaTabStatus(metaschemaResult);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sourcemeta Studio</title>
    <style>
        ${getStyles()}
    </style>
</head>
<body>
    <div>
        ${fileInfoHtml}
        ${healthBar.html}
        <div class="tabs">
            <button class="tab active ${lintTabStatus.cssClass}" data-tab="lint">
                ${lintTabStatus.indicator ? `<span class="tab-indicator">${lintTabStatus.indicator}</span>` : ''}
                <span>Lint</span>
            </button>
            <button class="tab ${formatTabStatus.cssClass}" data-tab="format">
                ${formatTabStatus.indicator ? `<span class="tab-indicator">${formatTabStatus.indicator}</span>` : ''}
                <span>Format</span>
            </button>
            <button class="tab ${metaschemaTabStatus.cssClass}" data-tab="metaschema">
                ${metaschemaTabStatus.indicator ? `<span class="tab-indicator">${metaschemaTabStatus.indicator}</span>` : ''}
                <span>Metaschema</span>
            </button>
        </div>
        <div class="tab-content active" id="lint-content">
            ${lintErrorsHtml}
            ${buildRawOutputSection('lint', lintResult.raw)}
        </div>
        <div class="tab-content" id="format-content">
            ${formatResultHtml}
            ${buildRawOutputSection('format', formatResult.output)}
        </div>
        <div class="tab-content" id="metaschema-content">
            ${metaschemaResultHtml}
            ${buildRawOutputSection('metaschema', metaschemaResult.output)}
        </div>
    </div>
    <div class="footer">
        <p class="version">${version}</p>
    </div>
    ${getScripts()}
</body>
</html>`;
}
