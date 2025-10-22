import type { CommandResult } from '../types';
import { vscode } from '../vscode-api';
import { RawOutput } from './RawOutput';

export interface FormatTabProps {
  formatResult: CommandResult;
}

export function FormatTab({ formatResult }: FormatTabProps) {
  const handleFormatSchema = () => {
    vscode.postMessage({ command: 'formatSchema' });
  };

  if (formatResult.exitCode === 0) {
    return (
      <>
        <div className="text-center py-10 px-5">
          <div className="text-5xl mb-4" style={{ color: 'var(--success)' }}>
            ✓
          </div>
          <div className="text-lg font-semibold text-[var(--vscode-fg)] mb-2">
            Schema is properly formatted!
          </div>
          <div className="text-[13px] text-[var(--vscode-muted)]">
            No formatting changes needed.
          </div>
        </div>
        <RawOutput output={formatResult.output} />
      </>
    );
  } else if (formatResult.exitCode !== null && formatResult.exitCode !== undefined) {
    return (
      <>
        <div className="text-center py-10 px-5">
          <p className="text-[var(--vscode-fg)] text-sm mb-5">
            This schema needs formatting.
          </p>
          <button
            className="
              px-6 py-2.5 cursor-pointer rounded
              border border-[var(--vscode-button-border)]
              bg-[var(--vscode-button-bg)]
              text-[var(--vscode-button-fg)]
              text-sm font-semibold
              hover:bg-[var(--vscode-button-hover)]
              transition-colors
            "
            onClick={handleFormatSchema}
          >
            Format Schema
          </button>
        </div>
        <RawOutput output={formatResult.output} />
      </>
    );
  }

  return null;
}
