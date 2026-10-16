import { describe, expect, it } from 'vitest';
import { celebrationPreview, decideCelebration } from './celebration';
import { findPostedForDay, type PostedResult } from './posted';

function posted(partial: Partial<PostedResult> & Pick<PostedResult, 'id'>): PostedResult {
	return { name: 'Matti', outcome: 'won', dayId: 10, ...partial };
}

describe('decideCelebration', () => {
	const row = { id: 'a', outcome: 'won' as const, place: 3 };

	it('celebrates a named win in the top 10', () => {
		expect(decideCelebration({ posted: posted({ id: 'a' }), row })).toBe('show');
	});

	it('celebrates 10th and skips 11th', () => {
		expect(decideCelebration({ posted: posted({ id: 'a' }), row: { ...row, place: 10 } })).toBe('show');
		expect(decideCelebration({ posted: posted({ id: 'a' }), row: { ...row, place: 11 } })).toBe('skip');
	});

	it('skips anonymous results', () => {
		expect(decideCelebration({ posted: posted({ id: 'a', name: null }), row })).toBe('skip');
	});

	it('skips give-ups even inside the top 10', () => {
		expect(decideCelebration({ posted: posted({ id: 'a', outcome: 'gaveUp' }), row })).toBe('skip');
		expect(
			decideCelebration({
				posted: posted({ id: 'a' }),
				row: { id: 'a', outcome: 'gaveUp', place: 4 },
			}),
		).toBe('skip');
	});

	it('skips when yesterday has no matching result', () => {
		expect(decideCelebration({ posted: posted({ id: 'a' }), row: null })).toBe('skip');
	});
});

describe('celebrationPreview', () => {
	it('returns a sample top 10 only in dev when the query is present', () => {
		const preview = celebrationPreview('?celebrate', true);
		expect(preview?.place).toBe(3);
		expect(preview?.top).toHaveLength(10);
		expect(preview?.top.find((row) => row.you)).toMatchObject({ place: 3, name: 'Matti' });
		expect(celebrationPreview('?celebrate=1', true)?.top.find((row) => row.you)?.place).toBe(1);
		expect(celebrationPreview('?celebrate', false)).toBeNull();
		expect(celebrationPreview('', true)).toBeNull();
	});
});

describe('findPostedForDay', () => {
	it('finds the result stored for that day', () => {
		const entries: [string, string][] = [
			['leaderboardPosted:4', JSON.stringify({ id: 'old', name: 'A', dayId: 9 })],
			['leaderboardPosted:5', JSON.stringify({ id: 'y', name: 'Matti', outcome: 'won', dayId: 10 })],
		];
		expect(findPostedForDay(entries, 10, 5)?.id).toBe('y');
	});

	it('uses a legacy entry keyed by yesterday’s game number when it has no day', () => {
		const entries: [string, string][] = [
			['leaderboardPosted:5', JSON.stringify({ id: 'legacy', name: 'Matti' })],
		];
		expect(findPostedForDay(entries, 10, 5)?.id).toBe('legacy');
		expect(findPostedForDay(entries, 10, 6)).toBeNull();
	});
});
