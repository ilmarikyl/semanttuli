export const DAILY_RESULT_CAP = 500;
export const NAME_MAX_LENGTH = 20;

export const ANONYMOUS_LABEL = {
	en: 'anonymous',
	fi: 'nimetön',
} as const;

export const UTC3_OFFSET_MS = 10_800_000;

export function getUtc3UnixDay(now = Date.now()): number {
	return Math.floor((now + UTC3_OFFSET_MS) / 86_400_000);
}

export function getNextUtc3Midnight(now = Date.now()): Date {
	const day = getUtc3UnixDay(now);
	return new Date((day + 1) * 86_400_000 - UTC3_OFFSET_MS);
}

/** A day's results stay through the next day, then expire at the following midnight. */
export function expiresAtForDay(dayId: number): Date {
	return new Date((dayId + 2) * 86_400_000 - UTC3_OFFSET_MS);
}
