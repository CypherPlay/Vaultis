<script lang="ts">
  import { userStore } from '$lib/stores/userStore';
  import { walletStore } from '$lib/stores/walletStore';
  import { apiClient } from '$lib/utils/apiClient';
  import { createAlert } from '$lib/stores/alertStore';

  export let riddleId: string;
  export let onRetrySuccess: () => void;

  let purchasing = false;

  async function purchaseRetry() {
    if (!$walletStore.connected) {
      createAlert('Please connect your wallet to purchase a retry.', 'error');
      return;
    }

    purchasing = true;
    try {
      // Simulate a transaction or API call to purchase a retry
      // In a real application, this would involve interacting with a smart contract
      // or a backend API that handles the transaction.
      // For now, we'll simulate a successful purchase.
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      // Call the backend to record the retry purchase
      await apiClient.post(`/riddles/${riddleId}/purchase-retry`);

      // Update user store with new retry count
      userStore.update(user => {
        if (user) {
          return { ...user, retries: (user.retries || 0) + 1 };
        }
        return user;
      });

      createAlert('Retry purchased successfully!', 'success');
      onRetrySuccess();
    } catch (error) {
      console.error('Error purchasing retry:', error);
      createAlert('Failed to purchase retry. Please try again.', 'error');
    } finally {
      purchasing = false;
    }
  }
</script>

<div class="flex flex-col items-center gap-4 p-4 bg-gray-800 rounded-lg shadow-lg">
  <p class="text-lg text-white">Out of guesses? Purchase a retry!</p>
  <button
    on:click={purchaseRetry}
    disabled={purchasing || !$walletStore.connected}
    class="px-6 py-3 text-white font-bold rounded-lg transition-colors duration-200
           {$walletStore.connected ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-500 cursor-not-allowed'}
           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
  >
    {#if purchasing}
      Purchasing...
    {:else if !$walletStore.connected}
      Connect Wallet to Purchase
    {:else}
      Purchase Retry (1 MATIC)
    {/if}
  </button>
</div>
