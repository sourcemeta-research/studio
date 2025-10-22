import type { LintResult } from '../types';

export interface HealthBarProps {
  lintResult: LintResult;
}

export function HealthBar({ lintResult }: HealthBarProps) {
  const errorCount = lintResult.errors?.length || 0;
  const health = errorCount === 0 ? 100 : Math.max(0, 100 - errorCount * 10);
  
  const getHealthColor = (health: number): string => {
    if (health >= 80) return 'var(--success)';
    if (health >= 50) return 'var(--warning)';
    return 'var(--error)';
  };

  return (
    <div className="mb-5">
      <div className="text-[var(--vscode-fg)] text-xs mb-1.5 font-semibold">
        Schema Health: {health}%
      </div>
      <div className="w-full h-2 bg-[var(--vscode-selection)] rounded overflow-hidden">
        <div 
          className="h-full rounded transition-all duration-300"
          style={{ 
            width: `${health}%`,
            backgroundColor: getHealthColor(health)
          }}
        />
      </div>
    </div>
  );
}
