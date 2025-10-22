import type { CommandResult } from '@shared/types';
import { RawOutput } from './RawOutput';

export interface MetaschemaTabProps {
  metaschemaResult: CommandResult;
}

export function MetaschemaTab({ metaschemaResult }: MetaschemaTabProps) {
  if (metaschemaResult.exitCode === 0) {
    return (
      <>
        <div className="text-center py-10 px-5">
          <div className="text-5xl mb-4" style={{ color: 'var(--success)' }}>
            ✓
          </div>
          <div className="text-lg font-semibold text-[var(--vscode-fg)] mb-2">
            Schema is valid according to its meta-schema!
          </div>
          <div className="text-[13px] text-[var(--vscode-muted)]">
            No validation errors found.
          </div>
        </div>
        <RawOutput output={metaschemaResult.output} />
      </>
    );
  } else if (metaschemaResult.exitCode === 2) {
    return (
      <>
        <div className="mb-5">
          <div className="bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded p-3 overflow-x-auto">
            <pre className="m-0 font-[var(--vscode-editor-font)] text-xs text-[var(--vscode-fg)] whitespace-pre-wrap break-words">
              {metaschemaResult.output}
            </pre>
          </div>
        </div>
        <RawOutput output={metaschemaResult.output} />
      </>
    );
  } else if (metaschemaResult.exitCode === 1) {
    return (
      <>
        <div className="text-center py-10 px-5">
          <div className="text-5xl mb-4" style={{ color: 'var(--fatal)' }}>
            ⚠
          </div>
          <div className="text-lg font-semibold text-[var(--vscode-fg)] mb-2">
            Fatal Error
          </div>
          <div className="text-[13px] text-[var(--vscode-muted)]">
            The metaschema command failed to execute.
          </div>
        </div>
        <RawOutput output={metaschemaResult.output} />
      </>
    );
  }

  return null;
}
