import * as assert from 'assert';
import { DiagnosticType } from '../../../shared/types';

suite('Shared Types Test Suite', () => {
    test('DiagnosticType should have Lint type', () => {
        assert.strictEqual(DiagnosticType.Lint, 'lint');
    });

    test('DiagnosticType should have Metaschema type', () => {
        assert.strictEqual(DiagnosticType.Metaschema, 'metaschema');
    });

    test('DiagnosticType values should be unique', () => {
        const values = Object.values(DiagnosticType);
        const uniqueValues = new Set(values);
        assert.strictEqual(values.length, uniqueValues.size, 'All diagnostic type values should be unique');
    });
});
