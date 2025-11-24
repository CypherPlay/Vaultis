<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let guesses: any[] = [];
  export let currentPage: number = 1;
  export let itemsPerPage: number = 10;
  export let totalItems: number = 0;

  const dispatch = createEventDispatcher();

  $: totalPages = Math.ceil(totalItems / itemsPerPage);
  $: paginatedGuesses = guesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function goToPage(page: number) {
    if (page > 0 && page <= totalPages) {
      currentPage = page;
      dispatch('pageChange', currentPage);
    }
  }
</script>

<div class="guess-history-container">
  <h2 class="text-2xl font-bold mb-4">Guess History</h2>

  {#if guesses.length === 0}
    <p>No guesses yet.</p>
  {:else}
    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Result</th>
            <th>Time Taken</th>
            <th>Token Cost</th>
          </tr>
        </thead>
        <tbody>
          {#each paginatedGuesses as guess (guess.id)}
            <tr>
              <td>{new Date(guess.timestamp).toLocaleString()}</td>
              <td>{guess.result}</td>
              <td>{guess.timeTaken}s</td>
              <td>{guess.tokenCost}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="flex justify-center mt-4">
      <div class="join">
        <button class="join-item btn" on:click={() => goToPage(1)} disabled={currentPage === 1}>
          «
        </button>
        <button class="join-item btn" on:click={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          ‹
        </button>
        {#each Array(totalPages) as _, i}
          <button
            class="join-item btn {currentPage === i + 1 ? 'btn-active' : ''}"
            on:click={() => goToPage(i + 1)}
          >
            {i + 1}
          </button>
        {/each}
        <button class="join-item btn" on:click={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          ›
        </button>
        <button class="join-item btn" on:click={() => goToPage(totalPages)} disabled={currentPage === totalPages}>
          »
        </button>
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  .guess-history-container {
    @apply p-4 bg-base-200 rounded-box shadow-lg;
  }
  .table th, .table td {
    @apply px-4 py-2;
  }
  .table thead th {
    @apply bg-base-300 text-base-content;
  }
  .table tbody tr:nth-child(odd) {
    @apply bg-base-100;
  }
  .table tbody tr:nth-child(even) {
    @apply bg-base-200;
  }
</style>
