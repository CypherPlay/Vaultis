<script lang="ts">
  import { get } from 'svelte/store';
  import { apiFetch } from '$lib/utils/apiClient';
  import { walletStore } from '$lib/stores/walletStore';
  import { alertStore } from '$lib/stores/alertStore';

  export let entryFee: number = 5;

  let guess = '';
  let loading = false;

  async function handleSubmit() {
    const walletState = get(walletStore);
    const walletAddress = walletState.walletAddress;

    if (!walletAddress) {
      alertStore.addAlert('Please connect your wallet to submit a guess.', 'warning', 5000);
      return;
    }

    if (guess.trim() === '') {
      alertStore.addAlert('Please enter your guess before submitting.', 'warning', 5000);
      return;
    }

    loading = true;
    try {
      await apiFetch('/api/v1/guess/submit', {
        method: 'POST',
        body: { walletAddress, guess: guess.trim() },
      });
      alertStore.addAlert(`Guess "${guess.trim()}" submitted! (Entry fee: ${entryFee} tokens)`, 'success', 5000);
      guess = '';
    } catch (err: any) {
      console.error('Guess submission failed', err);
      alertStore.addAlert(err?.message || 'Submission failed. Please try again.', 'error', 5000);
    } finally {
      loading = false;
    }
  }
</script>

<div class="p-4 border rounded-lg shadow-md bg-white">
  <h2 class="text-xl font-semibold mb-4">Submit Your Guess</h2>
  <form on:submit|preventDefault={handleSubmit}>
    <div class="mb-4">
      <label for="guess" class="block text-sm font-medium text-gray-700">Your Guess:</label>
      <input
        type="text"
        id="guess"
        name="guess"
        bind:value={guess}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring-3 focus:ring-indigo-200/50"
        placeholder="Enter your guess here"
      />
    </div>
    <div class="text-sm text-gray-500 mb-4">
      Entry Fee: ${entryFee} tokens per guess.
    </div>
    <button
      type="submit"
      class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      disabled={loading}
      aria-busy={loading}
    >
      {#if loading}
        Submitting...
      {:else}
        Submit Guess
      {/if}
    </button>
  </form>
</div>
