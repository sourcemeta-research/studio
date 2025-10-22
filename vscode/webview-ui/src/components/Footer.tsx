export interface FooterProps {
  version: string;
}

export function Footer({ version }: FooterProps) {
  return (
    <div className="mt-auto pt-5 border-t border-[var(--vscode-border)]">
      <p className="text-[var(--vscode-muted)] text-[11px] m-0">
        {version}
      </p>
    </div>
  );
}
