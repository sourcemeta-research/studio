/**
 * VSCode extension-specific types
 */

export const DiagnosticType = {
    Lint: 'lint',
    Metaschema: 'metaschema'
} as const;

export type DiagnosticType = typeof DiagnosticType[keyof typeof DiagnosticType];
