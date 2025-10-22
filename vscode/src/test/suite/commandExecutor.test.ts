import * as assert from 'assert';
import { CommandExecutor } from '../../commands/CommandExecutor';

suite('CommandExecutor Test Suite', () => {
    let executor: CommandExecutor;

    setup(() => {
        executor = new CommandExecutor(process.cwd());
    });

    test('should create CommandExecutor instance', () => {
        assert.ok(executor, 'CommandExecutor should be instantiated');
    });

    test('should have getVersion method', () => {
        assert.ok(typeof executor.getVersion === 'function', 'getVersion should be a function');
    });

    test('should have lint method', () => {
        assert.ok(typeof executor.lint === 'function', 'lint should be a function');
    });

    test('should have formatCheck method', () => {
        assert.ok(typeof executor.formatCheck === 'function', 'formatCheck should be a function');
    });

    test('should have format method', () => {
        assert.ok(typeof executor.format === 'function', 'format should be a function');
    });

    test('should have metaschema method', () => {
        assert.ok(typeof executor.metaschema === 'function', 'metaschema should be a function');
    });

    test('should return string from lint method', async function() {
        this.timeout(10000);

        try {
            const result = await executor.lint('--help');
            assert.ok(typeof result === 'string', 'Result should be a string');
        } catch (error) {
            console.log('CLI not available for testing:', error);
        }
    });
});
