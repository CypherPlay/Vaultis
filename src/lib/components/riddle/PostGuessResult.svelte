<script lang="ts">
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let isCorrect: boolean;
	export let recordedTime: string | null = null; // e.g., "00:01:23"
	export let canRetry: boolean = false;

	function handlePurchaseRetry() {
		// TODO: Implement logic to handle purchasing a retry
		dispatch('retryPurchase');
		// This would typically emit an event or call a store action
	}
</script>

<div
	in:fade={{ duration: 500 }}
	class="p-6 rounded-lg shadow-lg max-w-md mt-8 mx-auto flex flex-col items-center justify-center"
	class:bg-green-100={isCorrect}
	class:text-green-800={isCorrect}
	class:bg-red-100={!isCorrect}
	class:text-red-800={!isCorrect}
>
	{#if isCorrect}
		<h2 class="text-3xl font-bold mb-4">🎉 Correct! 🎉</h2>
		<p class="text-lg mb-2">You solved the riddle!</p>
		{#if recordedTime}
			<p class="text-xl font-semibold mb-4">Your time: {recordedTime}</p>
		{/if}
	{:else}
		<h2 class="text-3xl font-bold mb-4">❌ Incorrect ❌</h2>
		<p class="text-lg mb-2">That wasn't quite right.</p>
	{/if}

	{#if !isCorrect && canRetry}
		<p class="text-md mt-4 mb-4">Want another shot at the riddle?</p>
		<button
			on:click={handlePurchaseRetry}
			class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 ease-in-out transform rounded-full transition duration-300 hover:scale-105"
		>
			Purchase Retry
		</button>
	{/if}
</div>

<style>
	/* Any specific styles if needed, but Tailwind should handle most */
</style>
