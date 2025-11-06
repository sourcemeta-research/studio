declare global {
  interface Window {
    acquireVsCodeApi: () => {
      postMessage(message: unknown): void;
      getState(): unknown;
      setState(state: unknown): void;
    };
  }
}

class VSCodeAPIWrapper {
  private readonly vsCodeApi = window.acquireVsCodeApi();

  public postMessage(message: unknown): void {
    this.vsCodeApi.postMessage(message);
  }

  public getState(): unknown {
    return this.vsCodeApi.getState();
  }

  public setState(state: unknown): void {
    this.vsCodeApi.setState(state);
  }
}

export const vscode = new VSCodeAPIWrapper();
