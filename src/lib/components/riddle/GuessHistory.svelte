<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  interface Guess {
    id: string;
    timestamp: string;
    result: string;
    timeTaken: number;
    tokenCost: number;
  }

  export let guesses: Guess[] = [];
  export let currentPage: number = 1;
  export let itemsPerPage: number = 10;

  const dispatch = createEventDispatcher();

  function goToPage(page: number) {
    if (page > 0 && page <= totalPages) {
      currentPage = page;
      dispatch('pageChange', currentPage);
    }
  }

  $: totalPages = Math.ceil(guesses.length / itemsPerPage);
  $: if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
  } else if (currentPage < 1 && totalPages > 0) {
    currentPage = 1;
  }
  $: paginatedGuesses = guesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function getVisiblePages(): number[] {
    const pageRange = 2; // Number of pages to show around the current page
    const visiblePages: number[] = [];

    // Always include the first page
    if (totalPages > 0) {
      visiblePages.push(1);
    }

    // Add pages around the current page
    for (let i = currentPage - pageRange; i <= currentPage + pageRange; i++) {
      if (i > 1 && i < totalPages) {
        visiblePages.push(i);
      }
    }

    // Always include the last page if there's more than one page
    if (totalPages > 1) {
      visiblePages.push(totalPages);
    }

    // Remove duplicates and sort
    const uniquePages = [...new Set(visiblePages)].sort((a, b) => a - b);

    // Add ellipses
    const finalPages: number[] = [];
    if (uniquePages.length > 0) {
      finalPages.push(uniquePages[0]);
      for (let i = 1; i < uniquePages.length; i++) {
        if (uniquePages[i] - uniquePages[i - 1] > 1) {
          finalPages.push(-1); // Ellipsis marker
        }
        finalPages.push(uniquePages[i]);
      }
    }

    return finalPages;
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
        {#each getVisiblePages() as page}
          {#if page === -1}
            <button class="join-item btn" disabled>...</button>
          {:else}
            <button
              class="join-item btn {currentPage === page ? 'btn-active' : ''}"
              on:click={() => goToPage(page)}
            >
              {page}
            </button>
          {/if}
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
