<script lang="ts">
	import { alertStore } from '$lib/stores/alertStore';
	import type { Alert } from '$lib/stores/alertStore';
	import { fade } from 'svelte/transition';

	function getAlertClasses(type: Alert['type']) {
		switch (type) {
			case 'success':
				return 'bg-green-500 text-white';
			case 'error':
				return 'bg-red-500 text-white';
			case 'info':
				return 'bg-blue-500 text-white';
			default:
				return 'bg-gray-500 text-white';
		}
	}
</script>

<div class="top-0 left-0 right-0 p-4 space-y-2 pointer-events-none fixed z-50">
	{#each $alertStore as alert (alert.id)}
		<div
			in:fade={{ duration: 300 }}
			out:fade={{ duration: 300 }}
			class="max-w-md rounded-lg shadow-lg p-4 pr-10 relative mx-auto text-center {getAlertClasses(
				alert.type
			)} pointer-events-auto"
			role="alert"
			aria-live="assertive"
			aria-atomic="true"
		>
			{alert.message}
			<button
				type="button"
				class="right-2 top-2 h-6 w-6 rounded absolute inline-flex items-center justify-center hover:opacity-80 focus:outline-none"
				aria-label="Dismiss notification"
				on:click={() => alertStore.remove(alert.id)}
			>
				×
			</button>
		</div>
	{/each}
</div>

<style>
	/* Add any specific styles if needed, though Tailwind should handle most. */
</style>
