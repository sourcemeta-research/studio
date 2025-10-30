import { useState, useEffect } from 'react';
import type { PanelState } from '@shared/types';
import { vscode } from './vscode-api';
import { FileInfo } from './components/FileInfo';
import { HealthBar } from './components/HealthBar';
import { Tabs } from './components/Tabs';
import { LintTab } from './components/LintTab';
import { FormatTab } from './components/FormatTab';
import { MetaschemaTab } from './components/MetaschemaTab';
import { Footer } from './components/Footer';
import { LoadingSpinner } from './components/LoadingSpinner';

function App() {
  const [state, setState] = useState<PanelState | null>(null);
  const [activeTab, setActiveTab] = useState<'lint' | 'format' | 'metaschema'>('lint');

  useEffect(() => {
    // Restore last active tab from vscode state
    const savedState = vscode.getState() as { activeTab?: string } | undefined;
    if (savedState && savedState.activeTab) {
      setActiveTab(savedState.activeTab as 'lint' | 'format' | 'metaschema');
    }

    // Listen for messages from the extension
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === 'update') {
        setState(message.state);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleTabChange = (tab: 'lint' | 'format' | 'metaschema') => {
    setActiveTab(tab);
    vscode.setState({ activeTab: tab });
  };

  if (!state) {
    return (
      <div className="flex items-center justify-center h-screen text-[var(--vscode-muted)] text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen p-5">
      <FileInfo fileInfo={state.fileInfo} />
      <HealthBar lintResult={state.lintResult} isLoading={state.isLoading} />
      <Tabs activeTab={activeTab} onTabChange={handleTabChange} state={state} />
      
      <div className="flex-1 overflow-y-auto">
        {state.isLoading ? (
          <LoadingSpinner fileInfo={state.fileInfo} />
        ) : state.formatLoading && activeTab === 'format' ? (
          <LoadingSpinner fileInfo={state.fileInfo} />
        ) : (
          <>
            {activeTab === 'lint' && <LintTab lintResult={state.lintResult} />}
            {activeTab === 'format' && <FormatTab formatResult={state.formatResult} fileInfo={state.fileInfo} />}
            {activeTab === 'metaschema' && <MetaschemaTab metaschemaResult={state.metaschemaResult} />}
          </>
        )}
      </div>

      <Footer version={state.version} />
    </div>
  );
}

export default App;
