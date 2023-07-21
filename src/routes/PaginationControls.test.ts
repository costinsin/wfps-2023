import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import PaginationControls from './PaginationControls.svelte';

// Seems necessary. Otherwise the 2nd test fails.
// https://github.com/vitest-dev/vitest/blob/8693449b412743f20a63fd9bfa1a9054aa74613f/examples/svelte/test/hello.test.ts#L5-L6
afterEach(() => cleanup());

describe('PaginationControls.svelte', async () => {
	it('shows next link', async () => {
		render(PaginationControls, { next: 'next-page-cursor' });
		expect(screen.getByRole('link', { name: 'Next page' })).toHaveAttribute(
			'href',
			'?next=next-page-cursor'
		);
	});

	it('has no next link if there is no next page', async () => {
		render(PaginationControls, { next: undefined });
		expect(screen.queryByRole('link', { name: 'Next page' })).toBe(null);
	});
});
