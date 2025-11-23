<script lang="ts">
	import { page } from '$app/stores';
	import { userStore } from '$lib/stores/userStore';

	// This page will be protected by a +layout.ts or similar, ensuring user is logged in.
	// For now, we'll assume userStore.user is available.

	$: user = $userStore.user;
</script>

<div class="container mx-auto p-4 flex flex-col md:flex-row gap-4">
	<!-- Sidebar for User Stats -->
	<aside class="md:w-1/4 bg-gray-800 p-4 rounded-lg shadow-lg">
		<h2 class="text-xl font-bold mb-4 text-white">User Stats</h2>
		{#if user}
			<p class="text-gray-300">Username: {user.username}</p>
			<p class="text-gray-300">Total Guesses: {user.totalGuesses || 0}</p>
			<p class="text-gray-300">Correct Guesses: {user.correctGuesses || 0}</p>
			<!-- Add more stats as needed -->
		{:else}
			<p class="text-gray-300">Loading user stats...</p>
		{/if}
	</aside>

	<!-- Main section for Guess History -->
	<section class="md:w-3/4 bg-gray-800 p-4 rounded-lg shadow-lg">
		<h2 class="text-xl font-bold mb-4 text-white">Guess History</h2>
		{#if user}
			<!-- Placeholder for guess history list -->
			<p class="text-gray-300">Display user's past guesses here.</p>
		{:else}
			<p class="text-gray-300">Loading guess history...</p>
		{/if}
	</section>
</div>
