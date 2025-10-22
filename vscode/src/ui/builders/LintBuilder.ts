import { escapeHtml } from '../../utils/fileUtils';
import { LintResult, FileInfo, HealthBarData, TabStatus } from '../../utils/types';

/**
 * Build the health bar HTML
 */
export function buildHealthBar(lintResult: LintResult): HealthBarData {
    let healthBarHtml = '';
    let healthBarColor = '';
    let health: number | null = null;

    if (lintResult.error) {
        healthBarHtml = `
            <div class="health-bar-container">
                <div class="health-bar-label">Health: N/A</div>
                <div class="health-bar-background">
                    <div class="health-bar-fill" style="width: 0%; background-color: #666;"></div>
                </div>
            </div>
        `;
    } else if (lintResult.health !== null && lintResult.health !== undefined) {
        health = lintResult.health;

        if (health !== null && health > 90) {
            healthBarColor = '#4caf50';
        } else if (health !== null && health > 60) {
            healthBarColor = '#ff9800';
        } else {
            healthBarColor = '#f44336';
        }

        healthBarHtml = `
            <div class="health-bar-container">
                <div class="health-bar-label">Health: ${health}%</div>
                <div class="health-bar-background">
                    <div class="health-bar-fill" style="width: ${health}%; background-color: ${healthBarColor};"></div>
                </div>
            </div>
        `;
    } else {
        healthBarHtml = `
            <div class="health-bar-container">
                <div class="health-bar-label">Health: N/A</div>
                <div class="health-bar-background">
                    <div class="health-bar-fill" style="width: 0%; background-color: #666;"></div>
                </div>
            </div>
        `;
    }

    return { health, color: healthBarColor, html: healthBarHtml };
}

/**
 * Build the file info section HTML
 */
export function buildFileInfoSection(fileInfo: FileInfo | null): string {
    if (!fileInfo) {
        return `<p class="no-file">Open a JSON Schema</p>`;
    }

    return `<div class="schema-info">
        <p class="schema-label">Current Schema</p>
        <p class="file-path">${fileInfo.displayPath}</p>
    </div>`;
}

/**
 * Build lint error display HTML
 */
export function buildLintErrorsHtml(lintResult: LintResult): string {
    if (lintResult.errors && lintResult.errors.length > 0) {
        const errorsHtml = lintResult.errors.map((error, index: number) => {
            const escapedMessage = escapeHtml(error.message);
            const escapedDescription = error.description ? escapeHtml(error.description) : null;
            const escapedId = escapeHtml(error.id);
            const positionData = JSON.stringify(error.position);

            return `
                <div class="lint-error" data-error-index="${index}" data-position="${positionData}">
                    <div class="lint-error-header">
                        <span class="lint-error-message">${escapedMessage}</span>
                    </div>
                    ${escapedDescription ? `<div class="lint-error-description">${escapedDescription}</div>` : ''}
                    <div class="lint-error-meta">
                        <div class="lint-error-meta-item">
                            <span class="lint-error-meta-label">ID:</span>
                            <span class="lint-error-meta-value">${escapedId}</span>
                        </div>
                        <div class="lint-error-meta-item">
                            <span class="lint-error-meta-label">Location:</span>
                            <span class="lint-error-meta-value">${error.schemaLocation}</span>
                        </div>
                        <div class="lint-error-meta-item">
                            <span class="lint-error-meta-label">Position:</span>
                            <span class="lint-error-meta-value">Line ${error.position[0]}, Col ${error.position[1]}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `<div class="lint-errors-container">${errorsHtml}</div>`;
    } else if (lintResult.valid === true || (lintResult.errors && lintResult.errors.length === 0)) {
        return `
            <div class="lint-success">
                <div class="lint-success-icon">✓</div>
                <div class="lint-success-message">No lint errors!</div>
                <div class="lint-success-subtitle">Your schema is looking great.</div>
            </div>
        `;
    }

    return '';
}

/**
 * Calculate tab status
 */
export function calculateLintTabStatus(lintResult: LintResult): TabStatus {
    if (lintResult.error) {
        return { indicator: '✗', cssClass: 'tab-error' };
    }
    
    if (lintResult.health !== null && lintResult.health !== undefined) {
        if (lintResult.health === 100) {
            return { indicator: '✓', cssClass: 'tab-success' };
        } else {
            return { indicator: '⚠', cssClass: 'tab-warning' };
        }
    }

    return { indicator: '', cssClass: '' };
}
