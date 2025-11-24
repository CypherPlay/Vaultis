<script lang="ts">
  import { toastStore } from '../../stores/toastStore';
  import type { Toast } from '../../stores/toastStore';
  import { fade } from 'svelte/transition';

  function getToastClass(type: Toast['type']): string {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
      default:
        return 'bg-blue-500';
    }
  }
</script>

<div role="status" class="fixed bottom-4 right-4 z-50 w-72 space-y-2">
  {#each $toastStore as toast (toast.id)}
    <div
      in:fade={{ duration: 150 }}
      out:fade={{ duration: 150 }}
      class="rounded-lg p-4 text-white shadow-lg {getToastClass(toast.type)}"
    >
      {toast.message}
    </div>
  {/each}
</div>