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
          <div className="text-lg font-semibold text-(--vscode-fg) mb-2">
            Schema is valid according to its meta-schema!
          </div>
          <div className="text-[13px] text-(--vscode-muted)">
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
              className="bg-(--vscode-selection) border-l-[3px] rounded p-3 cursor-pointer transition-colors hover:bg-(--vscode-hover)"
              style={{ 
                cursor: error.instancePosition ? 'pointer' : 'default',
                borderLeftColor: 'var(--error)'
              }}
              onClick={() => error.instancePosition && handleGoToPosition(error.instancePosition)}
            >
              <div className="mb-2">
                <div className="text-(--vscode-fg) text-[13px] font-semibold">
                  {error.error}
                </div>
              </div>
              <div className="flex flex-col gap-1 text-[11px]">
                {error.instancePosition && (
                  <div className="flex gap-1.5">
                    <span className="text-(--vscode-muted) font-semibold min-w-20">
                      Location:
                    </span>
                    <span className="text-(--vscode-fg) font-(--vscode-editor-font)">
                      Line {error.instancePosition[0]}, Col {error.instancePosition[1]}
                    </span>
                  </div>
                )}
                {error.instanceLocation && (
                  <div className="flex gap-1.5">
                    <span className="text-(--vscode-muted) font-semibold min-w-20">
                      Path:
                    </span>
                    <span className="text-(--vscode-fg) font-(--vscode-editor-font) break-all">
                      {error.instanceLocation || '(root)'}
                    </span>
                  </div>
                )}
                {error.keywordLocation && (
                  <div className="flex gap-1.5">
                    <span className="text-(--vscode-muted) font-semibold min-w-20">
                      Schema:
                    </span>
                    <span className="text-(--vscode-fg) font-(--vscode-editor-font) break-all">
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
          <div className="bg-(--vscode-bg) border border-(--vscode-border) rounded p-3 overflow-x-auto">
            <pre className="m-0 font-(--vscode-editor-font) text-xs text-(--vscode-fg) whitespace-pre-wrap wrap-break-word">
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
          <div className="text-lg font-semibold text-(--vscode-fg) mb-2">
            Fatal Error
          </div>
          <div className="text-[13px] text-(--vscode-muted)">
            The metaschema command failed to execute.
          </div>
        </div>
        <RawOutput output={metaschemaResult.output} />
      </>
    );
  }

  return null;
}
