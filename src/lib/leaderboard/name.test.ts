import { describe, expect, it } from 'vitest';
import { parseResultName } from './name';

describe('parseResultName', () => {
	it('treats empty input as Anonymous', () => {
		expect(parseResultName('', 'en')).toEqual({ kind: 'anonymous' });
	});

	it('treats whitespace-only input as Anonymous', () => {
		expect(parseResultName('   ', 'en')).toEqual({ kind: 'anonymous' });
	});

	it('keeps the typed Name and compares uniqueness case-insensitively', () => {
		expect(parseResultName('Maija', 'fi')).toEqual({
			kind: 'named',
			displayName: 'Maija',
			nameKey: 'maija',
		});
		expect(parseResultName('MAIJA', 'fi')).toEqual({
			kind: 'named',
			displayName: 'MAIJA',
			nameKey: 'maija',
		});
	});

	it('trims the display Name and the uniqueness key', () => {
		expect(parseResultName('  Maija  ', 'fi')).toEqual({
			kind: 'named',
			displayName: 'Maija',
			nameKey: 'maija',
		});
	});

	it('rejects the English Anonymous label as a chosen Name', () => {
		expect(parseResultName('Anonymous', 'en')).toEqual({ kind: 'reserved' });
		expect(parseResultName('anonymous', 'en')).toEqual({ kind: 'reserved' });
	});

	it('rejects the Finnish Anonymous label as a chosen Name', () => {
		expect(parseResultName('Nimetön', 'fi')).toEqual({ kind: 'reserved' });
		expect(parseResultName('nimetön', 'fi')).toEqual({ kind: 'reserved' });
	});

	it('allows Anonymous as a chosen Name on the Finnish board', () => {
		expect(parseResultName('Anonymous', 'fi')).toEqual({
			kind: 'named',
			displayName: 'Anonymous',
			nameKey: 'anonymous',
		});
	});

	it('rejects a Name longer than 20 characters', () => {
		expect(parseResultName('abcdefghijklmnopqrstu', 'en')).toEqual({ kind: 'invalid' });
	});

	it('rejects symbols', () => {
		expect(parseResultName('Maija!', 'fi')).toEqual({ kind: 'invalid' });
	});

	it('allows letters, numbers, spaces, and Finnish letters', () => {
		expect(parseResultName('Äiti 2', 'fi')).toEqual({
			kind: 'named',
			displayName: 'Äiti 2',
			nameKey: 'äiti 2',
		});
	});
});
