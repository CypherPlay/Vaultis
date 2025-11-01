<script lang="ts">
	import WalletConnect from '$lib/components/wallet/WalletConnect.svelte';
	import { walletStore } from '$lib/stores/walletStore';

	export let title: string = 'Vaultis'; // Default title

	let isConnected: boolean;
	let walletAddress: string | null;

	walletStore.subscribe((state) => {
		isConnected = state.isConnected;
		walletAddress = state.walletAddress;
	});

	function shortenAddress(addr: string | null) {
		if (!addr) return '';
		return `${addr.substring(0, 4)}...${addr.substring(addr.length - 3)}`;
	}
</script>

<header class="bg-gray-800 text-white p-4 shadow-md">
	<div class="md:flex-nowrap container mx-auto flex flex-wrap items-center justify-between">
		<!-- Logo Area -->
		<div class="mr-6 text-white flex flex-shrink-0 items-center">
			<a href="/" class="flex items-center">
				<img src="/src/lib/assets/favicon.svg" alt="Logo" class="mr-2 h-8 w-8" />
				<span class="text-xl font-semibold tracking-tight">Vaultis</span>
			</a>
		</div>

		<!-- Dynamic Title Section -->
		<div
			class="mt-4 md:mt-0 md:flex md:w-auto md:items-center md:text-left md:flex-grow block w-full flex-grow text-center"
		>
			<h1 class="text-2xl font-bold">{title}</h1>
		</div>

		<!-- Wallet Connect Button -->
		<div class="mt-4 md:mt-0 md:w-auto md:text-right w-full flex-shrink-0 text-center">
			{#if isConnected}
				<span class="mr-2 text-sm text-white">Connected: {shortenAddress(walletAddress)}</span>
			{/if}
			<WalletConnect />
		</div>
	</div>
</header>
