<script lang="ts">
  import { onMount } from 'svelte';

  export let title: string = 'Vaultis'; // Default title
</script>

<header class="bg-gray-800 text-white p-4 shadow-md">
  <div class="container mx-auto flex items-center justify-between flex-wrap md:flex-nowrap">
    <!-- Logo Area -->
    <div class="flex items-center flex-shrink-0 text-white mr-6">
      <a href="/" class="flex items-center">
        <img src="/src/lib/assets/favicon.svg" alt="Logo" class="h-8 w-8 mr-2" />
        <span class="font-semibold text-xl tracking-tight">Vaultis</span>
      </a>
    </div>

    <!-- Dynamic Title Section -->
    <div class="block w-full flex-grow md:flex md:items-center md:w-auto text-center md:text-left mt-4 md:mt-0">
      <h1 class="text-2xl font-bold">{title}</h1>
    </div>

    <!-- Wallet Connect Button Placeholder -->
    <div class="w-full md:w-auto text-center md:text-right mt-4 md:mt-0">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Connect Wallet
      </button>
    </div>
  </div>
</header>
