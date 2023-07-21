import { describe, it, expect } from 'vitest';
import { REACTION_EMOJI, REACTIONS } from './reactions';

describe('reactions', () => {
	it('has emoji for every reaction', () => {
		const emojiKeys = Object.keys(REACTION_EMOJI);
		expect(emojiKeys).toEqual(REACTIONS);
	});
});
