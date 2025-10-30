import type { FileInfo as FileInfoType } from '@shared/types';

export interface FileInfoProps {
  fileInfo: FileInfoType | null;
}

export function FileInfo({ fileInfo }: FileInfoProps) {
  if (!fileInfo) {
    return (
      <p className="text-[var(--vscode-muted)] text-sm italic mb-5">
        No schema file selected
      </p>
    );
  }

  return (
    <div className="mb-5 p-3 bg-[var(--vscode-selection)] rounded border-l-[3px] border-[var(--vscode-accent)]">
      <p className="text-[var(--vscode-muted)] text-[11px] uppercase tracking-wider mb-1.5 font-semibold">
        Schema File
      </p>
      <p className="text-[var(--vscode-fg)] text-[13px] break-all m-0 font-[var(--vscode-editor-font)]">
        {fileInfo.displayPath}
      </p>
      {fileInfo.lineCount && (
        <p className="text-[var(--vscode-muted)] text-[11px] mt-1.5 m-0">
          {fileInfo.lineCount.toLocaleString()} lines
          {fileInfo.isYaml && ' • YAML'}
        </p>
      )}
    </div>
  );
}


