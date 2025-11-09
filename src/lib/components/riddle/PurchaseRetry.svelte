<script lang="ts">
  import { userStore } from '$lib/stores/userStore';
  import { walletStore } from '$lib/stores/walletStore';
  import { apiClient } from '$lib/utils/apiClient';
  import { createAlert } from '$lib/stores/alertStore';

  export let riddleId: string;
  export let onRetrySuccess: () => void;

  let purchasing = false;

  async function purchaseRetry() {
    if (purchasing) {
      return;
    }
    purchasing = true;

    if (!$walletStore.connected) {
      createAlert('Please connect your wallet to purchase a retry.', 'error');
      return;
    }

    try {
      // TODO: Implement on-chain transaction/payment flow here.
      // This would involve calling the wallet/provider to create and wait for the payment/tx receipt.
      // For now, we'll simulate a transaction hash.
      const transactionHash = '0x_simulated_transaction_hash'; // Replace with actual transaction hash

      // Call the backend to record the retry purchase and verify the transaction
      const response = await apiClient.post(`/riddles/${riddleId}/purchase-retry`, { transactionHash });

      if (response.status === 200 && response.data && typeof response.data.retries === 'number') {
        userStore.update(user => {
          if (user) {
            return { ...user, retries: response.data.retries };
          }
          return user;
        });
        createAlert('Retry purchased successfully!', 'success');
        onRetrySuccess();
      } else {
        console.error('Error purchasing retry: Invalid API response', response);
        createAlert('Failed to purchase retry. Please try again.', 'error');
      }
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
