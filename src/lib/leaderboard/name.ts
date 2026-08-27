import { ANONYMOUS_LABEL, NAME_MAX_LENGTH } from './constants';

export type ParseResultName =
	| { kind: 'anonymous' }
	| { kind: 'named'; displayName: string; nameKey: string }
	| { kind: 'reserved' }
	| { kind: 'invalid' };

const NAME_PATTERN = /^[\p{L}\p{N} ]+$/u;

export function parseResultName(raw: string, language: string): ParseResultName {
	const displayName = raw.trim();
	if (displayName.length === 0) {
		return { kind: 'anonymous' };
	}

	if (displayName.length > NAME_MAX_LENGTH || !NAME_PATTERN.test(displayName)) {
		return { kind: 'invalid' };
	}

	const nameKey = displayName.toLowerCase();
	const reserved = ANONYMOUS_LABEL[language as keyof typeof ANONYMOUS_LABEL];
	if (reserved && nameKey === reserved) {
		return { kind: 'reserved' };
	}

	return { kind: 'named', displayName, nameKey };
}
