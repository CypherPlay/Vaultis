<script lang="ts">
  import { alertStore } from '$/lib/stores/alertStore';
  import type { Alert } from '$/lib/stores/alertStore';
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

<div class="fixed top-0 left-0 right-0 z-50 p-4 space-y-2 pointer-events-none">
  {#each $alertStore as alert (alert.id)}
    <div
      in:fade={{ duration: 300 }}
      out:fade={{ duration: 300 }}
      class="mx-auto max-w-md rounded-lg shadow-lg p-4 text-center {getAlertClasses(alert.type)} pointer-events-auto"
      on:click={() => alertStore.remove(alert.id)}
      role="alert"
    >
      {alert.message}
    </div>
  {/each}
</div>

<style>
  /* Add any specific styles if needed, though Tailwind should handle most. */
</style>