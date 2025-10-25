<script lang="ts">
  import { alertStore, type Alert } from '$lib/stores/alertStore';
  import { quintOut } from 'svelte/easing';
  import { fade, slide } from 'svelte/transition';

  function getAlertClasses(type: Alert['type']) {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-600';
      case 'error':
        return 'bg-red-500 border-red-600';
      case 'info':
        return 'bg-blue-500 border-blue-600';
      case 'warning':
        return 'bg-yellow-500 border-yellow-600';
      default:
        return 'bg-gray-500 border-gray-600';
    }
  }
</script>

<div class="fixed top-4 right-4 z-50 w-full max-w-sm space-y-3 pointer-events-none">
  {#each $alertStore as alert (alert.id)}
    <div
      in:slide={{ duration: 300, easing: quintOut }}
      out:fade={{ duration: 200 }}
      class="p-4 rounded-md shadow-lg text-white border-l-4 {getAlertClasses(alert.type)} pointer-events-auto"
      role="alert"
    >
      <div class="flex items-center justify-between">
        <p class="font-medium">{alert.message}</p>
        <button
          on:click={() => alertStore.removeAlert(alert.id)}
          class="ml-4 text-white hover:text-opacity-75 focus:outline-none"
          aria-label="Dismiss alert"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  {/each}
</div>
