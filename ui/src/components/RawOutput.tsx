import { useState } from 'react';

export interface RawOutputProps {
  output: string;
}

export function RawOutput({ output }: RawOutputProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-5">
      <div
        className="flex items-center gap-1.5 cursor-pointer py-2 select-none hover:opacity-80"
        onClick={() => setExpanded(!expanded)}
      >
        <span 
          className="text-(--vscode-muted) text-[10px] transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          ▶
        </span>
        <span className="text-(--vscode-muted) text-[10px] uppercase tracking-wider font-semibold">
          Raw Output
        </span>
      </div>
      {expanded && (
        <div className="mt-2">
          <div className="bg-(--vscode-bg) border border-(--vscode-border) rounded p-3 overflow-x-auto">
            <pre className="m-0 font-(--vscode-editor-font) text-[10px] text-(--vscode-fg) whitespace-pre-wrap wrap-break-word">
              {output}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
