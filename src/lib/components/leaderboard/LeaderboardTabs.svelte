<script lang="ts">
	import { onMount } from 'svelte';
	import { apiFetch, ApiError } from '$lib/utils/apiClient';
	import { shortAddress } from '$lib/utils/shortAddress';

	interface DailyWinner {
		rank: number;
		wallet: string;
		prize: string; // Assuming prize is a string, e.g., "100 tokens"
	}

	export let dailyWinners: DailyWinner[] = [];
	export let allTimeRanks: { rank: number; name: string; score: number }[] = []; // Keep this for now, will be fetched later if needed
	let activeTab: 'daily' | 'all-time' = 'daily';
	let isLoading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			dailyWinners = await apiFetch<DailyWinner[]>('/api/leaderboard/daily-winners');
		} catch (e) {
			if (e instanceof ApiError) {
				error = `Error ${e.status}: ${e.message}`;
			} else if (e instanceof Error) {
				error = e.message;
			} else {
				error = 'An unknown error occurred.';
			}
		} finally {
			isLoading = false;
		}
	});
</script>

<div class="flex w-full flex-col items-center">
	<div role="tablist" class="space-x-4 mb-4 flex">
		<button
			type="button"
			role="tab"
			id="tab-daily"
			aria-controls="panel-daily"
			aria-selected={activeTab === 'daily'}
			class="px-6 py-2 rounded-lg text-lg font-semibold transition-colors duration-200"
			class:bg-primary-500={activeTab === 'daily'}
			class:text-white={activeTab === 'daily'}
			class:bg-gray-200={activeTab !== 'daily'}
			class:text-gray-700={activeTab !== 'daily'}
			on:click={() => (activeTab = 'daily')}
		>
			Daily Winners
		</button>
		<button
			type="button"
			role="tab"
			id="tab-all-time"
			aria-controls="panel-all-time"
			aria-selected={activeTab === 'all-time'}
			class="px-6 py-2 rounded-lg text-lg font-semibold transition-colors duration-200"
			class:bg-primary-500={activeTab === 'all-time'}
			class:text-white={activeTab === 'all-time'}
			class:bg-gray-200={activeTab !== 'all-time'}
			class:text-gray-700={activeTab !== 'all-time'}
			on:click={() => (activeTab = 'all-time')}
		>
			All-Time Ranks
		</button>
	</div>

	<div class="p-4 bg-white rounded-lg shadow-md w-full">
		{#if activeTab === 'daily'}
			<div role="tabpanel" id="panel-daily" aria-labelledby="tab-daily">
				<h2 class="text-2xl font-semibold mb-4 text-primary-content">Daily Winners</h2>
				{#if isLoading}
					<div class="overflow-x-auto">
						<table class="table w-full">
							<thead>
								<tr>
									<th>Rank</th>
									<th>Wallet</th>
									<th>Prize</th>
								</tr>
							</thead>
							<tbody>
								{#each Array(5) as _i, i (i)}
									<tr class="skeleton-row">
										<td><div class="h-4 bg-gray-200 rounded w-1/4"></div></td>
										<td><div class="h-4 bg-gray-200 rounded w-1/2"></div></td>
										<td><div class="h-4 bg-gray-200 rounded w-1/4"></div></td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else if error}
					<div class="text-error-content py-8 text-center">
						<p class="text-lg">Error loading daily winners: {error}</p>
						<p>Please try again later.</p>
					</div>
				{:else if dailyWinners.length === 0}
					<div class="text-info-content py-8 text-center">
						<p class="text-lg">No daily winners yet. Check back tomorrow!</p>
					</div>
				{:else}
					<div class="overflow-x-auto">
						<table class="table w-full">
							<thead>
								<tr>
									<th>Rank</th>
									<th>Wallet</th>
									<th>Prize</th>
								</tr>
							</thead>
							<tbody>
								{#each dailyWinners as winner (winner.rank)}
									<tr>
										<td>{winner.rank}</td>
										<td>{shortAddress(winner.wallet)}</td>
										<td>{winner.prize}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>
		{:else}
			<div role="tabpanel" id="panel-all-time" aria-labelledby="tab-all-time">
				<h2 class="text-2xl font-semibold mb-4 text-primary-content">All-Time Ranks</h2>
				{#if allTimeRanks.length > 0}
					<div class="overflow-x-auto">
						<table class="table w-full">
							<thead>
								<tr>
									<th>Rank</th>
									<th>Name</th>
									<th>Score</th>
								</tr>
							</thead>
							<tbody>
								{#each allTimeRanks as ranker (ranker.rank)}
									<tr>
										<td>{ranker.rank}</td>
										<td>{ranker.name}</td>
										<td>{ranker.score}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<div class="text-info-content py-8 text-center" aria-live="polite">
						<p class="text-lg font-semibold">All-Time Ranks: Coming Soon!</p>
						<p>Check back later for global rankings.</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
