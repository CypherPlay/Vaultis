<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchLeaderboard, ApiError, DailyWinner, AllTimeWinner } from '$lib/utils/apiClient';
	import { shortAddress } from '$lib/utils/shortAddress';
	import { infiniteScroll } from '$lib/utils/infiniteScroll';

	let dailyWinners: DailyWinner[] = [];
	let dailyOffset = 0;
	const dailyLimit = 10;
	let dailyHasMore = true;

	let allTimeWinners: AllTimeWinner[] = [];
	let allTimeOffset = 0;
	const allTimeLimit = 10;
	let allTimeHasMore = true;

	// Invariant: allTimeWinners is assumed to be pre-sorted by totalWins descending for correct rank assignment.
	$: rankedAllTimeWinners = allTimeWinners.reduce((acc: AllTimeWinner[], winner, i) => {
		const previousWinner = acc[i - 1];
		const rank =
			previousWinner && previousWinner.totalWins === winner.totalWins
				? previousWinner.rank
				: i + 1;
		acc.push({ ...winner, rank });
		return acc;
	}, []);
	let activeTab: 'daily' | 'all-time' = 'daily';
	let isLoadingDaily = true;
	let errorDaily: string | null = null;
	let isLoadingAllTime = false; // Initially false, only loads when tab is active
	let errorAllTime: string | null = null;
	// let hasFetchedAllTime = false; // New flag to track if all-time winners have been fetched

	onMount(async () => {
		await fetchDailyWinners();
	});

	async function fetchDailyWinners() {
		if (!dailyHasMore || isLoadingDaily) return;

		isLoadingDaily = true;
		errorDaily = null;
		try {
			const newWinners = await fetchLeaderboard<DailyWinner[]>(
				'daily-winners',
				dailyOffset,
				dailyLimit
			);
			dailyWinners = [...dailyWinners, ...newWinners];
			dailyOffset += newWinners.length;
			dailyHasMore = newWinners.length === dailyLimit;
		} catch (e) {
			if (e instanceof ApiError) {
				errorDaily = `Error ${e.status}: ${e.message}`;
			} else if (e instanceof Error) {
				errorDaily = e.message;
			} else {
				errorDaily = 'An unknown error occurred.';
			}
			dailyHasMore = false; // Stop trying to load more on error
		} finally {
			isLoadingDaily = false;
		}
	}

	async function fetchAllTimeWinners() {
		if (!allTimeHasMore || isLoadingAllTime) return;

		isLoadingAllTime = true;
		errorAllTime = null;
		try {
			const newWinners = await fetchLeaderboard<AllTimeWinner[]>(
				'all-time-winners',
				allTimeOffset,
				allTimeLimit
			);
			allTimeWinners = [...allTimeWinners, ...newWinners];
			allTimeWinners.sort((a, b) => b.totalWins - a.totalWins); // Re-sort the entire list
			allTimeOffset += newWinners.length;
			allTimeHasMore = newWinners.length === allTimeLimit;
		} catch (e) {
			if (e instanceof ApiError) {
				errorAllTime = `Error ${e.status}: ${e.message}`;
			} else if (e instanceof Error) {
				errorAllTime = e.message;
			} else {
				errorAllTime = 'An unknown error occurred.';
			}
			allTimeHasMore = false; // Stop trying to load more on error
		} finally {
			isLoadingAllTime = false;
		}
	}

	// Function to reset and fetch daily winners when tab is activated
	async function activateDailyTab() {
		activeTab = 'daily';
		if (dailyWinners.length === 0 && dailyHasMore) {
			await fetchDailyWinners();
		}
	}

	// Function to reset and fetch all-time winners when tab is activated
	async function activateAllTimeTab() {
		activeTab = 'all-time';
		if (allTimeWinners.length === 0 && allTimeHasMore) {
			await fetchAllTimeWinners();
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
			on:click={activateDailyTab}
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
			on:click={activateAllTimeTab}
		>
			All-Time Ranks
		</button>
	</div>

	<div class="p-4 bg-white rounded-lg shadow-md w-full">
		{#if activeTab === 'daily'}
			<div role="tabpanel" id="panel-daily" aria-labelledby="tab-daily">
				<h2 class="text-2xl font-semibold mb-4 text-primary-content">Daily Winners</h2>
				<div class="overflow-x-auto max-h-96" use:infiniteScroll={fetchDailyWinners}>
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
							{#if isLoadingDaily && dailyHasMore}
								<!-- Loading indicator for daily winners -->
								{#each Array(dailyLimit) as _, i (i)}
									<tr class="skeleton-row">
										<td><div class="h-4 bg-gray-200 rounded w-1/4"></div></td>
										<td><div class="h-4 bg-gray-200 rounded w-1/2"></div></td>
										<td><div class="h-4 bg-gray-200 rounded w-1/4"></div></td>
									</tr>
								{/each}
							{:else if !dailyHasMore && dailyWinners.length > 0}
								<tr>
									<td colspan="3" class="text-center text-gray-500 py-4">
										No more daily winners.
									</td>
								</tr>
							{/if}
						</tbody>
					</table>
					{#if errorDaily}
						<div class="text-error-content py-8 text-center">
							<p class="text-lg">Error loading daily winners: {errorDaily}</p>
							<p class="mb-4">Please try again later.</p>
							<button on:click={fetchDailyWinners} class="btn btn-primary">Retry</button>
						</div>
					{:else if dailyWinners.length === 0 && !isLoadingDaily}
						<div class="text-info-content py-8 text-center">
							<p class="text-lg">No daily winners yet. Check back tomorrow!</p>
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<div role="tabpanel" id="panel-all-time" aria-labelledby="tab-all-time">
				<h2 class="text-2xl font-semibold mb-4 text-primary-content">All-Time Ranks</h2>
				<div class="overflow-x-auto max-h-96" use:infiniteScroll={fetchAllTimeWinners}>
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
							{#if isLoadingAllTime && allTimeHasMore}
								<!-- Loading indicator for all-time winners -->
								{#each Array(allTimeLimit) as _, i (i)}
									<tr class="skeleton-row">
										<td><div class="h-4 bg-gray-200 rounded w-1/4"></div></td>
										<td><div class="h-4 bg-gray-200 rounded w-1/2"></div></td>
										<td><div class="h-4 bg-gray-200 rounded w-1/4"></div></td>
										<td><div class="h-4 bg-gray-200 rounded w-1/4"></div></td>
									</tr>
								{/each}
							{:else if !allTimeHasMore && allTimeWinners.length > 0}
								<tr>
									<td colspan="4" class="text-center text-gray-500 py-4">
										No more all-time ranks.
									</td>
								</tr>
							{/if}
						</tbody>
					</table>
					{#if errorAllTime}
						<div class="text-error-content py-8 text-center">
							<p class="text-lg">Error loading all-time ranks: {errorAllTime}</p>
							<p>Please try again later.</p>
						</div>
					{:else if allTimeWinners.length === 0 && !isLoadingAllTime}
						<div class="text-info-content py-8 text-center" aria-live="polite">
							<p class="text-lg font-semibold">
								No all-time ranks yet. Play more to get on the leaderboard!
							</p>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>
