<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let entryFee: number = 5;
  export let submitGuess: ((guess: string, entryFee: number) => Promise<any>) | undefined;

  const dispatch = createEventDispatcher();

  let guess = '';
  let loading = false;
  let errorMessage: string | null = null;
  let successMessage: string | null = null;

  async function handleSubmit() {
    errorMessage = null;
    successMessage = null;

    if (guess.trim() === '') {
      errorMessage = 'Please enter your guess before submitting.';
      return;
    }

    loading = true;
    try {
      if (submitGuess) {
        await submitGuess(guess.trim(), entryFee);
      } else {
        dispatch('submit', { guess: guess.trim(), entryFee });
      }
      successMessage = `Guess "${guess.trim()}" submitted! (Entry fee: ${entryFee} tokens)`;
      guess = '';
      setTimeout(() => (successMessage = null), 5000); // Auto-dismiss after 5 seconds
    } catch (err: any) {
      errorMessage = err?.message || 'Submission failed. Please try again.';
      console.error('Guess submission failed', err);
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
        aria-describedby={errorMessage ? 'guess-error' : undefined}
      />
      {#if errorMessage}
        <p id="guess-error" class="mt-2 text-sm text-red-600" role="alert">{errorMessage}</p>
      {/if}
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

  {#if successMessage}
    <div
      class="mt-4 p-3 rounded-md bg-green-100 text-green-800"
      role="status"
      aria-live="polite"
    >
      {successMessage}
    </div>
  {/if}
</div>
