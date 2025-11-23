<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { user } from '$lib/stores/userStore';

	// This page will be protected by a +layout.ts or similar, ensuring user is logged in.
	// For now, we'll assume userStore.user is available.

	$: userData = $user.user;
	$: error = $user.error;

	onMount(() => {
		user.fetchUserProfile();
	});
</script>

<div class="container mx-auto p-4 flex flex-col md:flex-row gap-4">
	<!-- Sidebar for User Stats -->
	<aside class="md:w-1/4 bg-gray-800 p-4 rounded-lg shadow-lg">
		<h2 class="text-xl font-bold mb-4 text-white">User Stats</h2>
		{#if error}
			<p class="text-red-400">Error loading user stats: {error}</p>
			<button on:click={user.fetchUserProfile} class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Retry</button>
		{:else if userData}
			<p class="text-gray-300">Username: {userData.username}</p>
			<p class="text-gray-300">Total Guesses: {userData.totalGuesses || 0}</p>
			<p class="text-gray-300">Correct Guesses: {userData.correctGuesses || 0}</p>
			<!-- Add more stats as needed -->
		{:else}
			<p class="text-gray-300">Loading user stats...</p>
		{/if}
	</aside>

	<!-- Main section for Guess History -->
	<section class="md:w-3/4 bg-gray-800 p-4 rounded-lg shadow-lg">
		<h2 class="text-xl font-bold mb-4 text-white">Guess History</h2>
		{#if error}
			<p class="text-red-400">Error loading guess history.</p>
		{:else if userData}
			<!-- Placeholder for guess history list -->
			<p class="text-gray-300">Display user's past guesses here.</p>
		{:else}
			<p class="text-gray-300">Loading guess history...</p>
		{/if}
	</section>
</div>
