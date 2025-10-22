import type { LintResult } from '@shared/types';

export interface HealthBarProps {
  lintResult: LintResult;
  isLoading?: boolean;
}

export function HealthBar({ lintResult, isLoading }: HealthBarProps) {
  const errorCount = lintResult.errors?.length || 0;
  const health = lintResult.health !== null ? lintResult.health : (errorCount === 0 ? 100 : Math.max(0, 100 - errorCount * 10));
  
  const getHealthColor = (health: number): string => {
    if (health >= 80) return 'var(--success)';
    if (health >= 50) return 'var(--warning)';
    return 'var(--error)';
  };

  // Show "?" when loading or when health is null (initial state)
  const showUnknown = isLoading || lintResult.health === null;

  return (
    <div className="mb-5">
      <div className="text-[var(--vscode-fg)] text-xs mb-1.5 font-semibold">
        Schema Health: {showUnknown ? (
          <span className="text-[var(--vscode-muted)]">?%</span>
        ) : (
          `${health}%`
        )}
      </div>
      <div className="w-full h-2 bg-[var(--vscode-selection)] rounded overflow-hidden">
        {showUnknown ? (
          <div className="h-full bg-[var(--vscode-muted)] opacity-30 w-full" />
        ) : (
          <div 
            className="h-full rounded transition-all duration-300"
            style={{ 
              width: `${health}%`,
              backgroundColor: getHealthColor(health)
            }}
          />
        )}
      </div>
    </div>
  );
}
