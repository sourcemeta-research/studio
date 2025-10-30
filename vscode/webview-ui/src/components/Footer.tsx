import { vscode } from '../vscode-api';
import { Star, Bug } from 'lucide-react';

export interface FooterProps {
  version: string;
}

export function Footer({ version }: FooterProps) {
  const handleStarRepo = () => {
    vscode.postMessage({ command: 'openExternal', url: 'https://github.com/sourcemeta-research/studio' });
  };

  const handleReportBug = () => {
    vscode.postMessage({ command: 'openExternal', url: 'https://github.com/sourcemeta-research/studio/issues/new' });
  };

  const handleSourcemetaClick = () => {
    vscode.postMessage({ command: 'openExternal', url: 'https://www.sourcemeta.com/' });
  };

  return (
    <div className="mt-auto pt-5 border-t border-[var(--vscode-border)]">
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <div className="flex gap-2">
          <button
            className="
              px-3 py-1.5 cursor-pointer rounded text-xs
              border border-[var(--vscode-button-border)]
              bg-[var(--vscode-button-secondary-bg)]
              text-[var(--vscode-button-secondary-fg)]
              hover:bg-[var(--vscode-button-secondary-hover)]
              transition-colors flex items-center gap-1.5
            "
            onClick={handleStarRepo}
            title="Star us on GitHub"
          >
            <Star size={14} strokeWidth={2} />
            <span>Star</span>
          </button>
          <button
            className="
              px-3 py-1.5 cursor-pointer rounded text-xs
              border border-[var(--vscode-button-border)]
              bg-[var(--vscode-button-secondary-bg)]
              text-[var(--vscode-button-secondary-fg)]
              hover:bg-[var(--vscode-button-secondary-hover)]
              transition-colors flex items-center gap-1.5
            "
            onClick={handleReportBug}
            title="Report an issue"
          >
            <Bug size={14} strokeWidth={2} />
            <span>Report Bug</span>
          </button>
        </div>
        <button
          className="
            px-2 py-1 cursor-pointer rounded
            border-none bg-transparent
            text-[var(--vscode-muted)]
            hover:text-[var(--vscode-fg)]
            transition-colors flex items-center gap-1.5
            flex-shrink-0
          "
          onClick={handleSourcemetaClick}
          title="Visit Sourcemeta"
        >
          <img 
            src="https://www.sourcemeta.com/logo.svg" 
            alt="Sourcemeta Logo" 
            className="w-4 h-4"
          />
          <span className="text-[10px] font-semibold">Sourcemeta</span>
        </button>
      </div>
      <p className="text-[var(--vscode-muted)] text-[11px] m-0">
        {version}
      </p>
    </div>
  );
}
