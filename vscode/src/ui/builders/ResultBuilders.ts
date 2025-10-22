import { FormatResult, MetaschemaResult, TabStatus } from '../../utils/types';

/**
 * Build format check result HTML
 */
export function buildFormatResultHtml(formatResult: FormatResult): string {
    if (formatResult.exitCode === 0) {
        return `
            <div class="lint-success">
                <div class="lint-success-icon">✓</div>
                <div class="lint-success-message">Schema is properly formatted!</div>
                <div class="lint-success-subtitle">No formatting changes needed.</div>
            </div>
        `;
    } else if (formatResult.exitCode !== null && formatResult.exitCode !== undefined) {
        return `
            <div class="format-needs-formatting">
                <p class="format-message">This schema needs formatting.</p>
                <button class="format-button" onclick="formatSchema()">Format Schema</button>
            </div>
        `;
    }

    return '';
}

/**
 * Build metaschema validation result HTML
 */
export function buildMetaschemaResultHtml(metaschemaResult: MetaschemaResult): string {
    const escapedOutput = metaschemaResult.output.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    if (metaschemaResult.exitCode === 0) {
        return `
            <div class="lint-success">
                <div class="lint-success-icon">✓</div>
                <div class="lint-success-message">Schema is valid according to its meta-schema!</div>
                <div class="lint-success-subtitle">No validation errors found.</div>
            </div>
        `;
    } else if (metaschemaResult.exitCode === 2) {
        return `
            <div class="metaschema-errors">
                <div class="code-block">
                    <pre>${escapedOutput}</pre>
                </div>
            </div>
        `;
    } else if (metaschemaResult.exitCode === 1) {
        return `
            <div class="metaschema-fatal">
                <div class="metaschema-fatal-icon">⚠</div>
                <div class="metaschema-fatal-message">Fatal Error</div>
                <div class="metaschema-fatal-subtitle">The metaschema command failed to execute.</div>
            </div>
        `;
    }

    return '';
}

/**
 * Calculate format tab status
 */
export function calculateFormatTabStatus(formatResult: FormatResult): TabStatus {
    if (formatResult.exitCode === 0) {
        return { indicator: '✓', cssClass: 'tab-success' };
    } else if (formatResult.exitCode !== null && formatResult.exitCode !== undefined) {
        return { indicator: '⚠', cssClass: 'tab-warning' };
    }
    return { indicator: '', cssClass: '' };
}

/**
 * Calculate metaschema tab status
 */
export function calculateMetaschemaTabStatus(metaschemaResult: MetaschemaResult): TabStatus {
    if (metaschemaResult.exitCode === 0) {
        return { indicator: '✓', cssClass: 'tab-success' };
    } else if (metaschemaResult.exitCode === 2) {
        return { indicator: '✗', cssClass: 'tab-error' };
    } else if (metaschemaResult.exitCode === 1) {
        return { indicator: '⚠', cssClass: 'tab-fatal' };
    }
    return { indicator: '', cssClass: '' };
}
