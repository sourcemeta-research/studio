import type { TabType, WebviewState, WebviewToExtensionMessage } from '../../protocol/types';

export type { TabType };

interface VSCodeAPI {
  postMessage(message: unknown): void;
  getState(): unknown;
  setState(state: unknown): void;
}

declare global {
  interface Window {
    acquireVsCodeApi: () => VSCodeAPI;
  }
}

class VSCodeAPIWrapper {
  private readonly vsCodeApi = window.acquireVsCodeApi();

  private postMessage(message: WebviewToExtensionMessage): void {
    this.vsCodeApi.postMessage(message);
  }

  public openExternal(url: string): void {
    this.postMessage({ command: 'openExternal', url });
  }

  public formatSchema(): void {
    this.postMessage({ command: 'formatSchema' });
  }

  public goToPosition(position: [number, number, number, number]): void {
    this.postMessage({ command: 'goToPosition', position });
  }

  public getActiveTab(): TabType | undefined {
    const state = this.vsCodeApi.getState() as WebviewState | undefined;
    return state?.activeTab;
  }

  public setActiveTab(tab: TabType): void {
    this.vsCodeApi.setState({ activeTab: tab } satisfies WebviewState);
  }
}

export const vscode = new VSCodeAPIWrapper();
