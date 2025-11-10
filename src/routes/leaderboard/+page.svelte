<script lang="ts">
	import { onMount } from 'svelte';
	import LeaderboardTabs from '../../lib/components/leaderboard/LeaderboardTabs.svelte';

	let loading = true;
	interface LeaderboardEntry {
		rank: number;
		name: string;
		score: number;
	}

	let dailyWinners: LeaderboardEntry[] = []; // Placeholder for daily winners data
	let allTimeRanks: LeaderboardEntry[] = []; // Placeholder for all-time ranks data

	onMount(() => {
		// Simulate data loading
		const timeoutId = setTimeout(() => {
			dailyWinners = [
				{ rank: 1, name: 'Alice', score: 1500 },
				{ rank: 2, name: 'Bob', score: 1450 },
				{ rank: 3, name: 'Charlie', score: 1400 }
			];
			allTimeRanks = [
				{ rank: 1, name: 'David', score: 5000 },
				{ rank: 2, name: 'Eve', score: 4800 },
				{ rank: 3, name: 'Frank', score: 4500 }
			];
			loading = false;
		}, 1500);

		return () => clearTimeout(timeoutId);
	});
</script>

<div class="p-4 sm:p-6 lg:p-8 container mx-auto">
	<h1 class="text-3xl font-bold mb-8 text-primary-content text-center">Leaderboard</h1>

	{#if loading}
		<div class="gap-4 animate-pulse grid grid-cols-1">
			<div class="bg-base-200 shadow-xl rounded-lg p-4 sm:p-6">
				<div class="h-6 bg-base-300 rounded mb-4 w-3/4"></div>
				<div class="h-4 bg-base-300 rounded mb-2 w-full"></div>
				<div class="h-4 bg-base-300 rounded mb-2 w-full"></div>
				<div class="h-4 bg-base-300 rounded w-1/2"></div>
			</div>
		</div>
	{:else}
		<LeaderboardTabs {allTimeRanks} />
	{/if}
</div>
