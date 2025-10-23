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
      console.error(e);
    } finally {
      loading = false;
    }
  });
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
  <div class="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
    <h2 class="text-3xl font-bold text-center mb-6 text-purple-400">Daily Riddle</h2>

    {#if loading}
      <p class="text-center text-gray-400">Loading daily riddle...</p>
    {:else if error}
      <p class="text-center text-red-500">{error}</p>
    {:else if riddle}
      <div class="space-y-4">
        {#if riddle.imageUrl}
          <img src={riddle.imageUrl} alt={riddle.imageAlt ?? ""} class="w-full h-auto rounded-md object-cover mb-4" />
        {/if}
        <p class="text-lg text-gray-200 text-center">{riddle.text}</p>
        <p class="text-xl font-semibold text-center text-yellow-400">Prize Pool: {riddle.prizePool}</p>
      </div>
    {:else}
      <p class="text-center text-gray-400">No daily riddle available today.</p>
    {/if}
  </div>
</div>
