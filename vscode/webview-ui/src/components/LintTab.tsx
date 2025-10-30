import type { LintResult } from '@shared/types';
import { vscode } from '../vscode-api';
import { RawOutput } from './RawOutput';
import { CheckCircle } from 'lucide-react';

export interface LintTabProps {
  lintResult: LintResult;
}

export function LintTab({ lintResult }: LintTabProps) {
  const handleGoToPosition = (position: [number, number, number, number]) => {
    vscode.postMessage({ command: 'goToPosition', position });
  };

  const errors = lintResult.errors || [];

  return (
    <div>
      {errors.length === 0 ? (
        <div className="text-center py-10 px-5">
          <div className="flex justify-center mb-4">
            <CheckCircle size={48} style={{ color: 'var(--success)' }} strokeWidth={1.5} />
          </div>
          <div className="text-lg font-semibold text-[var(--vscode-fg)] mb-2">
            No issues found!
          </div>
          <div className="text-[13px] text-[var(--vscode-muted)]">
            Your schema looks great.
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-5">
          {errors.map((error, index) => (
            <div
              key={index}
              className="bg-[var(--vscode-selection)] border-l-[3px] border-[var(--warning)] rounded p-3 cursor-pointer transition-colors hover:bg-[var(--vscode-hover)]"
              style={{ cursor: error.position ? 'pointer' : 'default' }}
              onClick={() => error.position && handleGoToPosition(error.position)}
            >
              <div className="mb-2">
                <div className="text-[var(--vscode-fg)] text-[13px] font-semibold">
                  {error.message}
                </div>
              </div>
              {error.description && (
                <div className="text-[var(--vscode-muted)] text-xs mb-2 whitespace-pre-wrap font-[var(--vscode-editor-font)]">
                  {error.description}
                </div>
              )}
              <div className="flex flex-col gap-1 text-[11px]">
                {error.position && (
                  <div className="flex gap-1.5">
                    <span className="text-[var(--vscode-muted)] font-semibold min-w-[60px]">
                      Location:
                    </span>
                    <span className="text-[var(--vscode-fg)] font-[var(--vscode-editor-font)]">
                      Line {error.position[0]}, Col {error.position[1]}
                    </span>
                  </div>
                )}
                <div className="flex gap-1.5">
                  <span className="text-[var(--vscode-muted)] font-semibold min-w-[60px]">
                    Rule ID:
                  </span>
                  <span className="text-[var(--vscode-fg)] font-[var(--vscode-editor-font)]">
                    {error.id}
                  </span>
                </div>
                {error.schemaLocation && (
                  <div className="flex gap-1.5">
                    <span className="text-[var(--vscode-muted)] font-semibold min-w-[60px]">
                      Schema:
                    </span>
                    <span className="text-[var(--vscode-fg)] font-[var(--vscode-editor-font)]">
                      {error.schemaLocation}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <RawOutput output={lintResult.raw} />
    </div>
  );
}
