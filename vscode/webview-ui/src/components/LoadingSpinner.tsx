export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-[var(--vscode-muted)] opacity-25 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-[var(--vscode-fg)] rounded-full animate-spin"></div>
        </div>
        <div className="text-[var(--vscode-muted)] text-sm">
          Analyzing schema...
        </div>
      </div>
    </div>
  );
}
