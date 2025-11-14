<script lang="ts">
	import { get } from 'svelte/store';
	import { apiFetch } from '$lib/utils/apiClient';
	import { walletStore } from '$lib/stores/walletStore';
	import { alertStore } from '$lib/stores/alertStore';
	import PostGuessResult from './PostGuessResult.svelte';

	export let entryFee: number = 5;

	let guess = '';
	let loading = false;
	let errorMessage = '';

	const MAX_GUESS_LENGTH = 100; // Define a maximum character limit for the guess
	let showResult = false;
	let guessResult: { isCorrect: boolean; recordedTime: string | null; canRetry: boolean } | null =
		null;

	function resetGuessState() {
		guess = '';
		loading = false;
		showResult = false;
		guessResult = null;
	}

	async function handleSubmit() {
		errorMessage = ''; // Clear previous errors

		const walletState = get(walletStore);

		const walletAddress = walletState.walletAddress;

		if (!walletAddress) {
			alertStore.info('Please connect your wallet to submit a guess.', 5000);

			return;
		}

		if (guess.trim() === '') {
			errorMessage = 'Your guess cannot be empty.';

			return;
		}

		if (guess.length > MAX_GUESS_LENGTH) {
			errorMessage = `Your guess exceeds the maximum length of ${MAX_GUESS_LENGTH} characters.`;

			return;
		}

		loading = true;

		try {
			const response = await apiFetch('/api/guesses/submit', {
				method: 'POST',

				body: JSON.stringify({ walletAddress, guess: guess.trim() }),

				headers: {
					'Content-Type': 'application/json'
				}
			});

			guessResult = response;

			showResult = true;

			alertStore.success('Guess submitted successfully!', 3000);
		} catch (err: unknown) {
			const error = err as Error;
			alertStore.error(error?.message || 'Submission failed. Please try again.', 5000);
		} finally {
			loading = false;
		}
	}

	function handleRetryPurchase() {
		resetGuessState();
	}
</script>

{#if showResult && guessResult}
	<PostGuessResult
		isCorrect={guessResult.isCorrect}
		recordedTime={guessResult.recordedTime}
		canRetry={guessResult.canRetry}
		on:retryPurchase={handleRetryPurchase}
	/>
{:else}
	<div class="p-4 rounded-lg shadow-md bg-white border">
		<h2 class="text-xl font-semibold mb-4">Submit Your Guess</h2>

		<form on:submit|preventDefault={handleSubmit}>
			<div class="mb-4">
				<label for="guess" class="text-sm font-medium text-gray-700 block">Your Guess:</label>

				<input
					type="text"
					id="guess"
					name="guess"
					bind:value={guess}
					class="mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring-indigo-200/50 block w-full focus:ring-3"
					placeholder="Enter your guess here"
				/>

				{#if errorMessage}
					<p class="text-red-500 text-sm mt-1">{errorMessage}</p>
				{/if}
			</div>

			<div class="text-sm text-gray-500 mb-4">
				Entry Fee: ${entryFee} tokens per guess.
			</div>

			<button
				type="submit"
				class="py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 w-full border border-transparent focus:ring-2 focus:ring-offset-2 focus:outline-none"
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
{/if}
