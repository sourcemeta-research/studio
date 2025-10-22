import type { PanelState } from '@shared/types';

export interface TabsProps {
  activeTab: 'lint' | 'format' | 'metaschema';
  onTabChange: (tab: 'lint' | 'format' | 'metaschema') => void;
  state: PanelState;
}

export function Tabs({ activeTab, onTabChange, state }: TabsProps) {
  // Calculate tab statuses
  const lintStatus = calculateLintStatus(state.lintResult.errors?.length || 0, state.lintResult.health, state.isLoading);
  const formatStatus = calculateFormatStatus(state.formatResult.exitCode, state.formatLoading);
  const metaschemaStatus = calculateMetaschemaStatus(state.metaschemaResult.exitCode, state.isLoading);

  const Tab = ({ 
    id, 
    label, 
    indicator, 
    color 
  }: { 
    id: 'lint' | 'format' | 'metaschema'; 
    label: string; 
    indicator: string; 
    color: string; 
  }) => (
    <button
      className={`
        px-4 py-2 cursor-pointer border-none bg-transparent
        text-[13px] border-b-2 transition-all flex items-center gap-1.5
        ${activeTab === id 
          ? 'text-[var(--vscode-fg)] border-[var(--vscode-accent)]' 
          : 'text-[var(--vscode-muted)] border-transparent hover:text-[var(--vscode-fg)]'
        }
      `}
      onClick={() => onTabChange(id)}
    >
      {indicator && (
        <span className="text-sm font-bold" style={{ color }}>
          {indicator}
        </span>
      )}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex border-b border-[var(--vscode-border)] mb-5">
      <Tab id="lint" label="Lint" indicator={lintStatus.indicator} color={lintStatus.color} />
      <Tab id="format" label="Format" indicator={formatStatus.indicator} color={formatStatus.color} />
      <Tab id="metaschema" label="Metaschema" indicator={metaschemaStatus.indicator} color={metaschemaStatus.color} />
    </div>
  );
}

function calculateLintStatus(errorCount: number, health: number | null, isLoading?: boolean) {
  if (isLoading || health === null) {
    return { indicator: '?', color: 'var(--vscode-muted)' };
  }
  if (errorCount === 0) {
    return { indicator: '✓', color: 'var(--success)' };
  } else {
    return { indicator: '⚠', color: 'var(--warning)' };
  }
}

function calculateFormatStatus(exitCode: number | null, formatLoading?: boolean) {
  if (formatLoading || exitCode === null || exitCode === undefined) {
    return { indicator: '?', color: 'var(--vscode-muted)' };
  }
  if (exitCode === 0) {
    return { indicator: '✓', color: 'var(--success)' };
  } else {
    return { indicator: '⚠', color: 'var(--warning)' };
  }
}

function calculateMetaschemaStatus(exitCode: number | null, isLoading?: boolean) {
  if (isLoading || exitCode === null || exitCode === undefined) {
    return { indicator: '?', color: 'var(--vscode-muted)' };
  }
  if (exitCode === 0) {
    return { indicator: '✓', color: 'var(--success)' };
  } else if (exitCode === 2) {
    return { indicator: '✗', color: 'var(--error)' };
  } else if (exitCode === 1) {
    return { indicator: '⚠', color: 'var(--fatal)' };
  }
  return { indicator: '?', color: 'var(--vscode-muted)' };
}
