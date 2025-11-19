import { CheckCircle, AlertTriangle, X, HelpCircle, Info } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface TabStatusResult {
  Icon: LucideIcon | null;
  color: string;
}

/**
 * Calculate the status icon and color for the Lint tab
 */
export function calculateLintStatus(
  errorCount: number,
  health: number | null,
  isLoading?: boolean,
  noFileSelected?: boolean,
  lintError?: string
): TabStatusResult {
  if (noFileSelected) {
    return { Icon: null, color: 'var(--vscode-muted)' };
  }
  if (lintError) {
    return { Icon: X, color: 'var(--error)' };
  }
  if (isLoading) {
    return { Icon: HelpCircle, color: 'var(--vscode-muted)' };
  }
  if (health === null && errorCount !== undefined) {
    if (errorCount === 0) {
      return { Icon: CheckCircle, color: 'var(--success)' };
    } else {
      return { Icon: AlertTriangle, color: 'var(--warning)' };
    }
  }
  if (health === null) {
    return { Icon: HelpCircle, color: 'var(--vscode-muted)' };
  }
  
  if (errorCount === 0) {
    return { Icon: CheckCircle, color: 'var(--success)' };
  } else {
    return { Icon: AlertTriangle, color: 'var(--warning)' };
  }
}

/**
 * Calculate the status icon and color for the Format tab
 */
export function calculateFormatStatus(
  exitCode: number | null,
  formatLoading?: boolean,
  isYaml?: boolean,
  noFileSelected?: boolean,
  formatError?: string
): TabStatusResult {
  if (noFileSelected) {
    return { Icon: null, color: 'var(--vscode-muted)' };
  }
  if (formatError) {
    return { Icon: X, color: 'var(--error)' };
  }
  if (formatLoading || exitCode === null || exitCode === undefined) {
    return { Icon: HelpCircle, color: 'var(--vscode-muted)' };
  }
  if (isYaml) {
    return { Icon: Info, color: 'var(--vscode-muted)' };
  }
  if (exitCode === 0) {
    return { Icon: CheckCircle, color: 'var(--success)' };
  } else {
    return { Icon: AlertTriangle, color: 'var(--warning)' };
  }
}

/**
 * Calculate the status icon and color for the Metaschema tab
 */
export function calculateMetaschemaStatus(
  exitCode: number | null,
  isLoading?: boolean,
  noFileSelected?: boolean,
  metaschemaError?: string
): TabStatusResult {
  if (noFileSelected) {
    return { Icon: null, color: 'var(--vscode-muted)' };
  }
  if (metaschemaError) {
    return { Icon: X, color: 'var(--error)' };
  }
  if (isLoading || exitCode === null || exitCode === undefined) {
    return { Icon: HelpCircle, color: 'var(--vscode-muted)' };
  }
  if (exitCode === 0) {
    return { Icon: CheckCircle, color: 'var(--success)' };
  } else if (exitCode === 2) {
    return { Icon: X, color: 'var(--error)' };
  } else if (exitCode === 1) {
    return { Icon: AlertTriangle, color: 'var(--fatal)' };
  }
  return { Icon: HelpCircle, color: 'var(--vscode-muted)' };
}
