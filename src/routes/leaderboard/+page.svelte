<script lang="ts">
  import { onMount } from 'svelte';

  let activeTab: 'daily' | 'all-time' = 'daily';
  let loading = true;
  let dailyWinners: any[] = []; // Placeholder for daily winners data
  let allTimeRanks: any[] = []; // Placeholder for all-time ranks data

  onMount(() => {
    // Simulate data loading
    setTimeout(() => {
      dailyWinners = [
        { rank: 1, name: 'Alice', score: 1500 },
        { rank: 2, name: 'Bob', score: 1450 },
        { rank: 3, name: 'Charlie', score: 1400 },
      ];
      allTimeRanks = [
        { rank: 1, name: 'David', score: 5000 },
        { rank: 2, name: 'Eve', score: 4800 },
        { rank: 3, name: 'Frank', score: 4500 },
      ];
      loading = false;
    }, 1500);
  });

  function setActiveTab(tab: 'daily' | 'all-time') {
    activeTab = tab;
  }
</script>

<div class="container mx-auto p-4 sm:p-6 lg:p-8">
  <h1 class="text-3xl font-bold text-center mb-8 text-primary-content">Leaderboard</h1>

  <div class="flex justify-center mb-6">
    <div class="tabs tabs-boxed bg-base-200">
      <a
        class="tab tab-lg"
        class:tab-active="{activeTab === 'daily'}"
        on:click="{() => setActiveTab('daily')}"
      >
        Daily Winners
      </a>
      <a
        class="tab tab-lg"
        class:tab-active="{activeTab === 'all-time'}"
        on:click="{() => setActiveTab('all-time')}"
      >
        All-Time Ranks
      </a>
    </div>
  </div>

  {#if loading}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
      <div class="bg-base-200 p-4 rounded-lg h-48"></div>
      <div class="bg-base-200 p-4 rounded-lg h-48"></div>
    </div>
  {:else}
    {#if activeTab === 'daily'}
      <div class="bg-base-200 shadow-xl rounded-lg p-4 sm:p-6">
        <h2 class="text-2xl font-semibold mb-4 text-primary-content">Daily Winners</h2>
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
              {#each dailyWinners as winner (winner.rank)}
                <tr>
                  <td>{winner.rank}</td>
                  <td>{winner.name}</td>
                  <td>{winner.score}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {:else}
      <div class="bg-base-200 shadow-xl rounded-lg p-4 sm:p-6">
        <h2 class="text-2xl font-semibold mb-4 text-primary-content">All-Time Ranks</h2>
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
      </div>
    {/if}
  {/if}
</div>