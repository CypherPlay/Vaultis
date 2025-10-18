<script lang="ts">
  import WalletConnect from '$lib/components/wallet/WalletConnect.svelte';
  import { walletStore } from '$lib/stores/walletStore';

  export let title: string = 'Vaultis'; // Default title

  let isConnected: boolean;
  let walletAddress: string | null;

  walletStore.subscribe(state => {
    isConnected = state.isConnected;
    walletAddress = state.walletAddress;
  });

  function shortenAddress(addr: string | null) {
    if (!addr) return '';
    return `${addr.substring(0, 4)}...${addr.substring(addr.length - 3)}`;
  }
</script>

<header class="bg-gray-800 text-white p-4 shadow-md">
  <div class="container mx-auto flex flex-wrap items-center justify-between md:flex-nowrap">
    <!-- Logo Area -->
    <div class="mr-6 flex flex-shrink-0 items-center text-white">
      <a href="/" class="flex items-center">
        <img src="/src/lib/assets/favicon.svg" alt="Logo" class="mr-2 h-8 w-8" />
        <span class="text-xl font-semibold tracking-tight">Vaultis</span>
      </a>
    </div>

    <!-- Dynamic Title Section -->
    <div
      class="mt-4 block w-full flex-grow text-center md:mt-0 md:flex md:w-auto md:items-center md:text-left"
    >
      <h1 class="text-2xl font-bold">{title}</h1>
    </div>

    <!-- Wallet Connect Button -->
    <div class="mt-4 w-full text-center md:mt-0 md:w-auto md:text-right">
      {#if isConnected}
        <span class="mr-2 text-sm text-white">Connected: {shortenAddress(walletAddress)}</span>
      {/if}
      <WalletConnect />
    </div>
  </div>
</header>
