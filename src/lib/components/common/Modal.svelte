<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let showModal: boolean;
  export let title: string = '';
  export let message: string = '';
  export let type: 'confirmation' | 'warning' | 'retry' | 'custom' = 'custom';

  const dispatch = createEventDispatcher();

  import { afterUpdate, onDestroy } from 'svelte';

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      dispatch('close');
    }
  }

  afterUpdate(() => {
    if (showModal) {
      window.addEventListener('keydown', handleKeydown);
    } else {
      window.removeEventListener('keydown', handleKeydown);
    }
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeydown);
  });

  function closeModal() {
    dispatch('close');
  }

  function confirm() {
    dispatch('confirm');
  }

  function retry() {
    dispatch('retry');
  }
</script>

{#if showModal}
  <div class="modal-overlay" on:click={closeModal}>
    <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1" on:click|stopPropagation>
      <header>
        <h2 id="modal-title">{title}</h2>
        <button class="close-button" aria-label="Close modal" on:click={closeModal}>&times;</button>
      </header>
      <main>
        {#if type !== 'custom'}
          <p>{message}</p>
        {/if}
        <slot />
      </main>
      <footer>
        {#if type === 'confirmation'}
          <button class="button primary" on:click={confirm}>Confirm</button>
          <button class="button secondary" on:click={closeModal}>Cancel</button>
        {:else if type === 'warning'}
          <button class="button primary" on:click={closeModal}>OK</button>
        {:else if type === 'retry'}
          <button class="button primary" on:click={retry}>Retry</button>
          <button class="button secondary" on:click={closeModal}>Cancel</button>
        {:else}
          <!-- Custom slot content for buttons if type is 'custom' -->
          <slot name="footer-buttons" />
        {/if}
      </footer>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background: var(--color-bg-secondary);
    border-radius: 8px;
    padding: 20px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .modal-content header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 10px;
  }

  .modal-content h2 {
    margin: 0;
    color: var(--color-text-primary);
  }

  .modal-content .close-button {
    background: none;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
    color: var(--color-text-secondary);
  }

  .modal-content main {
    color: var(--color-text-secondary);
    line-height: 1.5;
  }

  .modal-content footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    border-top: 1px solid var(--color-border);
    padding-top: 15px;
  }

  .button {
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s ease;
  }

  .button.primary {
    background-color: var(--color-primary);
    color: white;
    border: none;
  }

  .button.primary:hover {
    background-color: var(--color-primary-dark);
  }

  .button.secondary {
    background-color: var(--color-bg-tertiary);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
  }

  .button.secondary:hover {
    background-color: var(--color-bg-secondary);
  }
</style>
