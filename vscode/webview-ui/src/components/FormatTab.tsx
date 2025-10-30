import type { CommandResult, FileInfo } from '@shared/types';
import { vscode } from '../vscode-api';
import { RawOutput } from './RawOutput';
import { Info, CheckCircle } from 'lucide-react';

export interface FormatTabProps {
  formatResult: CommandResult;
  fileInfo: FileInfo | null;
}

export function FormatTab({ formatResult, fileInfo }: FormatTabProps) {
  const handleFormatSchema = () => {
    vscode.postMessage({ command: 'formatSchema' });
  };

  // Check if the file is YAML
  const isYaml = fileInfo?.isYaml || false;

  if (isYaml) {
    return (
      <div className="text-center py-10 px-5">
        <div className="flex justify-center mb-4">
          <Info size={48} className="text-[var(--vscode-muted)]" strokeWidth={1.5} />
        </div>
        <div className="text-lg font-semibold text-[var(--vscode-fg)] mb-2">
          YAML Format Not Supported
        </div>
        <div className="text-[13px] text-[var(--vscode-muted)]">
          The JSON Schema CLI format command does not support YAML schemas yet. Only JSON files can be formatted.
        </div>
      </div>
    );
  }

  if (formatResult.exitCode === 0) {
    return (
      <>
        <div className="text-center py-10 px-5">
          <div className="flex justify-center mb-4">
            <CheckCircle size={48} style={{ color: 'var(--success)' }} strokeWidth={1.5} />
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
