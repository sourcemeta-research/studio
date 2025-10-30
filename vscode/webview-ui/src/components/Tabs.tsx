import type { PanelState } from '@shared/types';
import { CheckCircle, AlertTriangle, X, HelpCircle, Info } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface TabsProps {
  activeTab: 'lint' | 'format' | 'metaschema';
  onTabChange: (tab: 'lint' | 'format' | 'metaschema') => void;
  state: PanelState;
}

export function Tabs({ activeTab, onTabChange, state }: TabsProps) {
  // Calculate tab statuses
  const lintStatus = calculateLintStatus(state.lintResult.errors?.length || 0, state.lintResult.health, state.isLoading);
  const formatStatus = calculateFormatStatus(state.formatResult.exitCode, state.formatLoading, state.fileInfo?.isYaml);
  const metaschemaStatus = calculateMetaschemaStatus(state.metaschemaResult.exitCode, state.isLoading);

  const Tab = ({ 
    id, 
    label, 
    Icon, 
    color 
  }: { 
    id: 'lint' | 'format' | 'metaschema'; 
    label: string; 
    Icon: LucideIcon | null; 
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
      {Icon && (
        <Icon size={14} strokeWidth={2} style={{ color }} />
      )}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex border-b border-[var(--vscode-border)] mb-5">
      <Tab id="lint" label="Lint" Icon={lintStatus.Icon} color={lintStatus.color} />
      <Tab id="format" label="Format" Icon={formatStatus.Icon} color={formatStatus.color} />
      <Tab id="metaschema" label="Metaschema" Icon={metaschemaStatus.Icon} color={metaschemaStatus.color} />
    </div>
  );
}

function calculateLintStatus(errorCount: number, health: number | null, isLoading?: boolean) {
  if (isLoading) {
    return { Icon: HelpCircle, color: 'var(--vscode-muted)' };
  }
  if (health === null && errorCount !== undefined) {
    if (errorCount === 0) {
      return { Icon: CheckCircle, color: 'var(--success)' };
    } else {
      return { Icon: AlertTriangle, color: 'var(--warning)' };
    }
  }
  if (health === null) {
    return { Icon: HelpCircle, color: 'var(--vscode-muted)' };
  }
  
  if (errorCount === 0) {
    return { Icon: CheckCircle, color: 'var(--success)' };
  } else {
    return { Icon: AlertTriangle, color: 'var(--warning)' };
  }
}

function calculateFormatStatus(exitCode: number | null, formatLoading?: boolean, isYaml?: boolean) {
  if (formatLoading || exitCode === null || exitCode === undefined) {
    return { Icon: HelpCircle, color: 'var(--vscode-muted)' };
  }
  if (isYaml) {
    return { Icon: Info, color: 'var(--vscode-muted)' };
  }
  if (exitCode === 0) {
    return { Icon: CheckCircle, color: 'var(--success)' };
  } else {
    return { Icon: AlertTriangle, color: 'var(--warning)' };
  }
}

function calculateMetaschemaStatus(exitCode: number | null, isLoading?: boolean) {
  if (isLoading || exitCode === null || exitCode === undefined) {
    return { Icon: HelpCircle, color: 'var(--vscode-muted)' };
  }
  if (exitCode === 0) {
    return { Icon: CheckCircle, color: 'var(--success)' };
  } else if (exitCode === 2) {
    return { Icon: X, color: 'var(--error)' };
  } else if (exitCode === 1) {
    return { Icon: AlertTriangle, color: 'var(--fatal)' };
  }
  return { Icon: HelpCircle, color: 'var(--vscode-muted)' };
}
