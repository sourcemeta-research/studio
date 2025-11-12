import { vscode } from '../vscode-api';
import { Star, Bug } from 'lucide-react';

export interface FooterProps {
  cliVersion: string;
  extensionVersion: string;
}

export function Footer({ cliVersion, extensionVersion }: FooterProps) {
  const handleStarRepo = () => {
    vscode.openExternal('https://github.com/sourcemeta/studio');
  };

  const handleReportBug = () => {
    vscode.openExternal('https://github.com/sourcemeta/studio/issues/new');
  };

  const handleSourcemetaClick = () => {
    vscode.openExternal('https://www.sourcemeta.com/');
  };

  return (
    <div className="mt-auto pt-5 border-t border-(--vscode-border)">
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <div className="flex gap-2">
          <button
            className="
              px-3 py-1.5 cursor-pointer rounded text-xs
              border border-(--vscode-button-border)
              bg-(--vscode-button-secondary-bg)
              text-(--vscode-button-secondary-fg)
              hover:bg-(--vscode-button-secondary-hover)
              transition-colors flex items-center gap-1.5
            "
            onClick={handleStarRepo}
            title="Star us on GitHub"
          >
            <Star size={14} strokeWidth={2} />
            <span>Star on Github</span>
          </button>
          <button
            className="
              px-3 py-1.5 cursor-pointer rounded text-xs
              border border-(--vscode-button-border)
              bg-(--vscode-button-secondary-bg)
              text-(--vscode-button-secondary-fg)
              hover:bg-(--vscode-button-secondary-hover)
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
            text-(--vscode-muted)
            hover:text-(--vscode-fg)
            transition-colors flex items-center gap-1.5
            shrink-0
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
      <div className="text-(--vscode-muted) text-[11px] m-0 space-y-0.5">
        <p className="m-0">CLI Version: {cliVersion}</p>
        <p className="m-0">Extension Version: {extensionVersion}</p>
      </div>
    </div>
  );
}
