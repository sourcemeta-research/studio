import * as assert from 'assert';
import { PanelManager } from '../../panel/PanelManager';
import { PanelState } from '../../../../shared/types';

suite('PanelManager Test Suite', () => {
    let panelManager: PanelManager;
    let extensionPath: string;

    setup(() => {
        extensionPath = process.cwd();
        panelManager = new PanelManager(extensionPath);
    });

    teardown(() => {
        panelManager.dispose();
    });

    test('should create PanelManager instance', () => {
        assert.ok(panelManager, 'PanelManager should be instantiated');
    });

    test('should not exist initially', () => {
        assert.strictEqual(panelManager.exists(), false, 'Panel should not exist initially');
    });

    test('should handle dispose', () => {
        panelManager.dispose();
        assert.strictEqual(panelManager.exists(), false, 'Panel should not exist after dispose');
    });

    test('should not update content if panel does not exist', () => {
        const testState: PanelState = {
            fileInfo: null,
            cliVersion: '12.2.0',
            extensionVersion: '0.0.1',
            lintResult: { raw: '', health: null },
            formatResult: { output: '', exitCode: null },
            metaschemaResult: { output: '', exitCode: null },
            isLoading: false
        };

        assert.doesNotThrow(
            () => panelManager.updateContent(testState),
            'Should handle update when panel does not exist'
        );
    });

    test('should have setMessageHandler method', () => {
        assert.ok(
            typeof panelManager.setMessageHandler === 'function',
            'Should have setMessageHandler method'
        );
    });

    test('should have updateContent method', () => {
        assert.ok(
            typeof panelManager.updateContent === 'function',
            'Should have updateContent method'
        );
    });

    test('should have getPanel method', () => {
        assert.ok(
            typeof panelManager.getPanel === 'function',
            'Should have getPanel method'
        );
    });

    test('should have exists method', () => {
        assert.ok(
            typeof panelManager.exists === 'function',
            'Should have exists method'
        );
    });
});

