<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  type T = any;

  export let itemHeight: number;
  export let data: T[];
  export let render: (item: T) => any;


  let container: HTMLDivElement;
  let visibleItems: any[] = [];
  let startIndex = 0;
  let endIndex = 0;
  let containerHeight = 0;

  function calculateVisibleItems() {
    if (!container) return;

    const scrollTop = container.scrollTop;

    startIndex = Math.floor(scrollTop / itemHeight);
    endIndex = Math.min(
      data.length - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight)
    );

    visibleItems = data.slice(startIndex, endIndex + 1);

    container.style.height = `${containerHeight}px`;
    container.style.overflowY = 'auto';
    container.style.position = 'relative';
  }

  let resizeObserver: ResizeObserver;

  onMount(() => {
    containerHeight = container.clientHeight;
    calculateVisibleItems();
    container.addEventListener('scroll', calculateVisibleItems);

    resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === container) {
          containerHeight = entry.contentRect.height;
          calculateVisibleItems();
        }
      }
    });
    resizeObserver.observe(container);
  });

  onDestroy(() => {
    if (container) {
      container.removeEventListener('scroll', calculateVisibleItems);
      resizeObserver.unobserve(container);
    }
  });

  $: if (data && containerHeight) calculateVisibleItems();
</script>

<div bind:this={container} class="virtual-list-container">
  <div style="height: {data.length * itemHeight}px; position: relative;">
    {#each visibleItems as item, i (startIndex + i)}
      <div
        style="position: absolute; top: {(startIndex + i) * itemHeight}px; height: {itemHeight}px; width: 100%;"
      >
        {@html render(item)}
      </div>
    {/each}
  </div>
</div>

<style>
  .virtual-list-container {
    /* Add default styles or let parent component define them */
    height: 100%; /* Example: take full height of parent */
    overflow-y: auto;
  }
</style>
