import type { MetaschemaResult } from '@shared/types';
import { vscode } from '../vscode-api';
import { RawOutput } from './RawOutput';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export interface MetaschemaTabProps {
  metaschemaResult: MetaschemaResult;
}

export function MetaschemaTab({ metaschemaResult }: MetaschemaTabProps) {
  const handleGoToPosition = (position: [number, number, number, number]) => {
    vscode.postMessage({ command: 'goToPosition', position });
  };

  const errors = metaschemaResult.errors || [];

  if (metaschemaResult.exitCode === 0) {
    return (
      <>
        <div className="text-center py-10 px-5">
          <div className="flex justify-center mb-4">
            <CheckCircle size={48} style={{ color: 'var(--success)' }} strokeWidth={1.5} />
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
  } else if (metaschemaResult.exitCode === 2 && errors.length > 0) {
    return (
      <div>
        <div className="flex flex-col gap-3 mb-5">
          {errors.map((error, index) => (
            <div
              key={index}
              className="bg-[var(--vscode-selection)] border-l-[3px] rounded p-3 cursor-pointer transition-colors hover:bg-[var(--vscode-hover)]"
              style={{ 
                cursor: error.instancePosition ? 'pointer' : 'default',
                borderLeftColor: 'var(--error)'
              }}
              onClick={() => error.instancePosition && handleGoToPosition(error.instancePosition)}
            >
              <div className="mb-2">
                <div className="text-[var(--vscode-fg)] text-[13px] font-semibold">
                  {error.error}
                </div>
              </div>
              <div className="flex flex-col gap-1 text-[11px]">
                {error.instancePosition && (
                  <div className="flex gap-1.5">
                    <span className="text-[var(--vscode-muted)] font-semibold min-w-[80px]">
                      Location:
                    </span>
                    <span className="text-[var(--vscode-fg)] font-[var(--vscode-editor-font)]">
                      Line {error.instancePosition[0]}, Col {error.instancePosition[1]}
                    </span>
                  </div>
                )}
                {error.instanceLocation && (
                  <div className="flex gap-1.5">
                    <span className="text-[var(--vscode-muted)] font-semibold min-w-[80px]">
                      Path:
                    </span>
                    <span className="text-[var(--vscode-fg)] font-[var(--vscode-editor-font)] break-all">
                      {error.instanceLocation || '(root)'}
                    </span>
                  </div>
                )}
                {error.keywordLocation && (
                  <div className="flex gap-1.5">
                    <span className="text-[var(--vscode-muted)] font-semibold min-w-[80px]">
                      Schema:
                    </span>
                    <span className="text-[var(--vscode-fg)] font-[var(--vscode-editor-font)] break-all">
                      {error.keywordLocation}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <RawOutput output={metaschemaResult.output} />
      </div>
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
          <div className="flex justify-center mb-4">
            <AlertTriangle size={48} style={{ color: 'var(--fatal)' }} strokeWidth={1.5} />
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
