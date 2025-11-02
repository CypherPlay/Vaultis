<script lang="ts">
	import { onMount } from 'svelte';
	import { apiFetch, ApiError } from '$lib/utils/apiClient';

	interface DailyRiddle {
		id: string;
		text: string;
		imageUrl?: string;
		imageAlt?: string; // optional descriptive alt text for accessibility
		prizePool: string;
	}

	let riddle: DailyRiddle | null = null;
	let error: string | null = null;
	let loading: boolean = true;

	onMount(async () => {
		try {
			// Assuming an API endpoint for fetching the daily riddle
			const response = await apiFetch<DailyRiddle>('/api/riddle/daily');
			riddle = response;
		} catch (e) {
			if (e instanceof ApiError) {
				error = `Failed to fetch riddle: ${e.message}`;
			} else if (e instanceof Error) {
				error = `An unexpected error occurred: ${e.message}`;
			} else {
				error = 'An unknown error occurred.';
			}

		} finally {
			loading = false;
		}
	});
</script>

<div class="bg-gray-900 text-white p-4 flex min-h-screen flex-col items-center justify-center">
	<div class="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
		<h2 class="text-3xl font-bold mb-6 text-purple-400 text-center">Daily Riddle</h2>

		{#if loading}
			<div class="space-y-4 animate-pulse">
				<div class="h-48 bg-gray-700 rounded-md"></div>
				<div class="h-6 bg-gray-700 rounded-md mx-auto w-3/4"></div>
				<div class="h-6 bg-gray-700 rounded-md mx-auto w-1/2"></div>
			</div>
		{:else if error}
			<div class="bg-red-900 border-red-700 text-red-300 p-4 rounded-md border text-center">
				<p class="font-bold">Error:</p>
				<p>{error}</p>
			</div>
		{:else if riddle}
			<div class="space-y-4">
				{#if riddle.imageUrl}
					<img
						src={riddle.imageUrl}
						alt={riddle.imageAlt ?? ''}
						class="rounded-md mb-4 h-auto w-full object-cover"
					/>
				{/if}
				<p class="text-lg text-gray-200 text-center">{riddle.text}</p>
				<p class="text-xl font-semibold text-yellow-400 text-center">
					Prize Pool: {riddle.prizePool}
				</p>
			</div>
		{:else}
			<p class="text-gray-400 text-center">No active riddle today.</p>
		{/if}
	</div>
</div>
