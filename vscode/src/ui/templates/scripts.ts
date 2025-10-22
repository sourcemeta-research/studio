/**
 * JavaScript code for the webview panel
 */
export function getScripts(): string {
    return `
    <script>
        const vscode = acquireVsCodeApi();
        const state = vscode.getState() || { activeTab: 'lint' };

        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');

        // Restore last active tab
        if (state.activeTab) {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));

            const activeTab = document.querySelector(\`[data-tab="\${state.activeTab}"]\`);
            const activeContent = document.getElementById(state.activeTab + '-content');
            if (activeTab && activeContent) {
                activeTab.classList.add('active');
                activeContent.classList.add('active');
            }
        }

        // Tab click handlers
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(tc => tc.classList.remove('active'));

                tab.classList.add('active');

                const tabName = tab.getAttribute('data-tab');
                const content = document.getElementById(tabName + '-content');
                if (content) {
                    content.classList.add('active');
                }

                vscode.setState({ ...state, activeTab: tabName });
            });
        });

        // Handle lint error clicks - use event delegation
        document.addEventListener('click', (event) => {
            const errorElement = event.target.closest('.lint-error');
            if (errorElement) {
                const positionData = errorElement.getAttribute('data-position');
                if (positionData) {
                    const position = JSON.parse(positionData);
                    vscode.postMessage({
                        command: 'goToPosition',
                        position: position
                    });
                }
            }
        });

        // Toggle raw output
        function toggleRawOutput(tab) {
            const content = document.getElementById(tab + '-raw-output-content');
            const toggle = document.getElementById(tab + '-raw-toggle');
            content.classList.toggle('expanded');
            toggle.classList.toggle('expanded');
        }

        // Format schema
        function formatSchema() {
            vscode.postMessage({
                command: 'formatSchema'
            });
        }
    </script>
    `;
}
