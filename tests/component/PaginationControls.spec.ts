import { test, expect } from '@playwright/experimental-ct-svelte';
import PaginationControls from '../../src/routes/PaginationControls.svelte';

test.use({ viewport: { width: 500, height: 500 } });

test('shows next link', async ({ mount }) => {
	const component = await mount(PaginationControls, { props: { next: 'next-page-cursor' } });
	await expect(component).toContainText('Next page');
});

test('has no next link if there is no next page', async ({ mount }) => {
	const component = await mount(PaginationControls);
	await expect(component).not.toContainText('Next page');
});
