<script lang="ts">
	import { onMount } from 'svelte';
	import { apiFetch, ApiError } from '$lib/utils/apiClient';
	import { shortAddress } from '$lib/utils/shortAddress';

	interface DailyWinner {
		rank: number;
		wallet: string;
		prize: string; // Assuming prize is a string, e.g., "100 tokens"
	}

	interface AllTimeWinner {
		wallet: string;
		totalWins: number;
		cumulativePrize: string; // Assuming prize is a string
		rank?: number; // Add rank property for tie handling
	}

	let dailyWinners: DailyWinner[] = [];
	let allTimeWinners: AllTimeWinner[] = [];
	// Invariant: allTimeWinners is assumed to be pre-sorted by totalWins descending for correct rank assignment.
	$: rankedAllTimeWinners = allTimeWinners.map((winner, i, arr) => {
		const previousWinner = arr[i - 1];
		const rank =
			previousWinner && previousWinner.totalWins === winner.totalWins ? previousWinner.rank : i + 1;
		return { ...winner, rank };
	});
	let activeTab: 'daily' | 'all-time' = 'daily';
	let isLoadingDaily = true;
	let errorDaily: string | null = null;
	let isLoadingAllTime = false; // Initially false, only loads when tab is active
	let errorAllTime: string | null = null;

	onMount(async () => {
		await fetchDailyWinners();
	});

	async function fetchDailyWinners() {
		isLoadingDaily = true;
		errorDaily = null;
		try {
			dailyWinners = await apiFetch<DailyWinner[]>('/api/leaderboard/daily-winners');
		} catch (e) {
			if (e instanceof ApiError) {
				errorDaily = `Error ${e.status}: ${e.message}`;
			} else if (e instanceof Error) {
				errorDaily = e.message;
			} else {
				errorDaily = 'An unknown error occurred.';
			}
		} finally {
			isLoadingDaily = false;
		}
	}

	async function fetchAllTimeWinners() {
		if (isLoadingAllTime || (allTimeWinners.length > 0 && errorAllTime === null)) return; // Don't refetch if already loading or if data is successfully loaded

		isLoadingAllTime = true;
		errorAllTime = null;
		try {
			allTimeWinners = await apiFetch<AllTimeWinner[]>('/api/leaderboard/all-time-winners');
			allTimeWinners.sort((a, b) => b.totalWins - a.totalWins); // Sort by total wins descending
		} catch (e) {
			if (e instanceof ApiError) {
				errorAllTime = `Error ${e.status}: ${e.message}`;
			} else if (e instanceof Error) {
				errorAllTime = e.message;
			} else {
				errorAllTime = 'An unknown error occurred.';
			}
		} finally {
			isLoadingAllTime = false;
		}
	}
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
			on:click={() => {
				activeTab = 'all-time';
				void fetchAllTimeWinners();
			}}
		>
			All-Time Ranks
		</button>
	</div>

	<div class="p-4 bg-white rounded-lg shadow-md w-full">
		{#if activeTab === 'daily'}
			<div role="tabpanel" id="panel-daily" aria-labelledby="tab-daily">
				<h2 class="text-2xl font-semibold mb-4 text-primary-content">Daily Winners</h2>
				{#if isLoadingDaily}
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
								<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
								{#each Array(5) as _, i (i)}
									<tr class="skeleton-row">
										<td><div class="h-4 bg-gray-200 rounded w-1/4"></div></td>
										<td><div class="h-4 bg-gray-200 rounded w-1/2"></div></td>
										<td><div class="h-4 bg-gray-200 rounded w-1/4"></div></td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else if errorDaily}
					<div class="text-error-content py-8 text-center">
						<p class="text-lg">Error loading daily winners: {errorDaily}</p>
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
				{#if isLoadingAllTime}
					<div class="overflow-x-auto">
						<table class="table w-full">
							<thead>
								<tr>
									<th>Rank</th>
									<th>Wallet</th>
									<th>Total Wins</th>
									<th>Cumulative Prize</th>
								</tr>
							</thead>
							<tbody>
								<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
								{#each Array(5) as _, i (i)}
									<tr class="skeleton-row">
										<td><div class="h-4 bg-gray-200 rounded w-1/4"></div></td>
										<td><div class="h-4 bg-gray-200 rounded w-1/2"></div></td>
										<td><div class="h-4 bg-gray-200 rounded w-1/4"></div></td>
										<td><div class="h-4 bg-gray-200 rounded w-1/4"></div></td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else if errorAllTime}
					<div class="text-error-content py-8 text-center">
						<p class="text-lg">Error loading all-time ranks: {errorAllTime}</p>
						<p>Please try again later.</p>
					</div>
				{:else if allTimeWinners.length === 0}
					<div class="text-info-content py-8 text-center" aria-live="polite">
						<p class="text-lg font-semibold">
							No all-time ranks yet. Play more to get on the leaderboard!
						</p>
					</div>
				{:else}
					<div class="overflow-x-auto">
						<table class="table w-full">
							<thead>
								<tr>
									<th>Rank</th>
									<th>Wallet</th>
									<th>Total Wins</th>
									<th>Cumulative Prize</th>
								</tr>
							</thead>
							<tbody>
								{#each rankedAllTimeWinners as winner (winner.wallet)}
									<tr>
										<td>{winner.rank}</td>
										<td>{shortAddress(winner.wallet)}</td>
										<td>{winner.totalWins}</td>
										<td>{winner.cumulativePrize}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
